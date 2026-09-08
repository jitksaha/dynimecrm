"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "WorkspaceIteratorService", {
    enumerable: true,
    get: function() {
        return WorkspaceIteratorService;
    }
});
const _common = require("@nestjs/common");
const _typeorm = require("@nestjs/typeorm");
const _chalk = /*#__PURE__*/ _interop_require_default(require("chalk"));
const _guards = require("@sniptt/guards");
const _workspace = require("twenty-shared/workspace");
const _utils = require("twenty-shared/utils");
const _typeorm1 = require("typeorm");
const _commandshutdownservice = require("./command-shutdown.service");
const _activationstatusinutil = require("./utils/activation-status-in.util");
const _workspaceentity = require("../../../engine/core-modules/workspace/workspace.entity");
const _workspaceormmanager = require("../../../engine/twenty-orm/workspace-orm.manager");
const _buildsystemauthcontextutil = require("../../../engine/twenty-orm/utils/build-system-auth-context.util");
const _workspacemigrationrunnerexception = require("../../../engine/workspace-manager/workspace-migration/workspace-migration-runner/exceptions/workspace-migration-runner.exception");
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
function _ts_param(paramIndex, decorator) {
    return function(target, key) {
        decorator(target, key, paramIndex);
    };
}
const DEFAULT_ACTIVATION_STATUSES = _workspace.PROVISIONED_WORKSPACE_ACTIVATION_STATUSES;
let WorkspaceIteratorService = class WorkspaceIteratorService {
    listenToShutdownSignals() {
        this.commandShutdownService.listenToShutdownSignals();
    }
    async iterate(args) {
        const { callback, ...options } = args;
        const report = {
            fail: [],
            success: [],
            interrupted: false
        };
        const workspaceIdsToProcess = options.workspaceIds && options.workspaceIds.length > 0 ? options.workspaceIds : await this.fetchWorkspaceIds(options);
        if (options.dryRun) {
            this.logger.log(_chalk.default.yellow('Dry run mode: No changes will be applied'));
        }
        for (const [index, workspaceId] of workspaceIdsToProcess.entries()){
            if (this.commandShutdownService.isShutdownRequested()) {
                this.logger.warn(`Shutdown requested, stopping before workspace ${workspaceId}. ` + `${workspaceIdsToProcess.length - index} workspace(s) left untouched.`);
                report.interrupted = true;
                break;
            }
            this.logger.log(`Running on workspace ${workspaceId} ${index + 1}/${workspaceIdsToProcess.length}`);
            try {
                const authContext = (0, _buildsystemauthcontextutil.buildSystemAuthContext)(workspaceId);
                await this.workspaceOrmManager.executeInWorkspaceContext(async ()=>{
                    const workspace = await this.workspaceRepository.findOne({
                        select: [
                            'databaseSchema'
                        ],
                        where: {
                            id: workspaceId
                        }
                    });
                    const dataSource = (0, _guards.isNonEmptyString)(workspace?.databaseSchema) ? this.coreDataSource : undefined;
                    if (!(0, _utils.isDefined)(dataSource)) {
                        this.logger.warn(`Could not retrieve a workspace data source for workspace ${workspaceId} ` + `(index ${index + 1}/${workspaceIdsToProcess.length}): ` + `workspaceRowFound=${(0, _utils.isDefined)(workspace)}, ` + `databaseSchema=${JSON.stringify(workspace?.databaseSchema ?? null)}`);
                    }
                    await callback({
                        workspaceId,
                        databaseSchema: workspace?.databaseSchema ?? undefined,
                        dataSource,
                        index,
                        total: workspaceIdsToProcess.length
                    });
                }, authContext);
                report.success.push({
                    workspaceId
                });
            } catch (error) {
                report.fail.push({
                    error: error,
                    workspaceId
                });
            }
        }
        report.fail.forEach(({ error, workspaceId })=>{
            this.logger.error(`Error in workspace ${workspaceId}: ${error.message}`, error.stack);
            if (error instanceof _workspacemigrationrunnerexception.WorkspaceMigrationRunnerException && error.errors) {
                for (const [label, innerError] of Object.entries(error.errors)){
                    if (!(0, _utils.isDefined)(innerError)) continue;
                    if (innerError instanceof Error) {
                        this.logger.error(`Caused by ${label} in workspace ${workspaceId}: ${innerError.message}`, innerError.stack);
                    } else {
                        this.logger.error(`Caused by ${label} in workspace ${workspaceId}: ${String(innerError)}`);
                    }
                }
            }
        });
        return report;
    }
    async fetchWorkspaceIds(options) {
        const activationStatuses = options.activationStatuses ?? DEFAULT_ACTIVATION_STATUSES;
        const shard = options.shard;
        if ((0, _utils.isDefined)(shard)) {
            if ((0, _utils.isDefined)(options.startFromWorkspaceId)) {
                throw new Error('Cannot combine shard with startFromWorkspaceId in workspace iterator');
            }
            if (shard.index < 0 || shard.index >= shard.total || shard.total > 256) {
                throw new Error(`Invalid workspace iterator shard ${shard.index}/${shard.total}`);
            }
        }
        const workspaces = await this.workspaceRepository.find({
            select: [
                'id'
            ],
            where: {
                activationStatus: (0, _activationstatusinutil.activationStatusIn)(activationStatuses),
                ...options.startFromWorkspaceId ? {
                    id: (0, _typeorm1.MoreThanOrEqual)(options.startFromWorkspaceId)
                } : {},
                ...(0, _utils.isDefined)(shard) ? {
                    id: (0, _typeorm1.Raw)((alias)=>`mod(get_byte(uuid_send(${alias}), 0), :shardTotal) = :shardIndex`, {
                        shardTotal: shard.total,
                        shardIndex: shard.index
                    })
                } : {}
            },
            order: {
                id: 'ASC'
            },
            take: options.workspaceCountLimit
        });
        return workspaces.map((workspace)=>workspace.id);
    }
    constructor(workspaceRepository, coreDataSource, workspaceOrmManager, commandShutdownService){
        this.workspaceRepository = workspaceRepository;
        this.coreDataSource = coreDataSource;
        this.workspaceOrmManager = workspaceOrmManager;
        this.commandShutdownService = commandShutdownService;
        this.logger = new _common.Logger(WorkspaceIteratorService.name);
    }
};
WorkspaceIteratorService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_param(0, (0, _typeorm.InjectRepository)(_workspaceentity.WorkspaceEntity)),
    _ts_param(1, (0, _typeorm.InjectDataSource)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _typeorm1.Repository === "undefined" ? Object : _typeorm1.Repository,
        typeof _typeorm1.DataSource === "undefined" ? Object : _typeorm1.DataSource,
        typeof _workspaceormmanager.WorkspaceOrmManager === "undefined" ? Object : _workspaceormmanager.WorkspaceOrmManager,
        typeof _commandshutdownservice.CommandShutdownService === "undefined" ? Object : _commandshutdownservice.CommandShutdownService
    ])
], WorkspaceIteratorService);

//# sourceMappingURL=workspace-iterator.service.js.map