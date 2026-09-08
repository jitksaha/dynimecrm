"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "WorkspaceWorkflowAutomatedTriggerMapCacheService", {
    enumerable: true,
    get: function() {
        return WorkspaceWorkflowAutomatedTriggerMapCacheService;
    }
});
const _common = require("@nestjs/common");
const _utils = require("twenty-shared/utils");
const _typeorm = require("typeorm");
const _workflowversionentity = require("../entities/workflow-version.entity");
const _computeautomatedtriggerfromworkflowversionutil = require("../utils/compute-automated-trigger-from-workflow-version.util");
const _workspaceormmanager = require("../../../twenty-orm/workspace-orm.manager");
const _buildsystemauthcontextutil = require("../../../twenty-orm/utils/build-system-auth-context.util");
const _injectworkspacescopedrepositorydecorator = require("../../../twenty-orm/workspace-scoped-repository/inject-workspace-scoped-repository.decorator");
const _workspacescopedrepository = require("../../../twenty-orm/workspace-scoped-repository/workspace-scoped-repository");
const _workspacecachedecorator = require("../../../workspace-cache/decorators/workspace-cache.decorator");
const _workspacecacheproviderservice = require("../../../workspace-cache/interfaces/workspace-cache-provider.service");
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
let WorkspaceWorkflowAutomatedTriggerMapCacheService = class WorkspaceWorkflowAutomatedTriggerMapCacheService extends _workspacecacheproviderservice.WorkspaceCacheProvider {
    async computeForCache({ workspaceId }) {
        const activeWorkflowVersions = await this.workflowVersionRepository.find(workspaceId, {
            where: {
                status: _workflowversionentity.WorkflowVersionStatus.ACTIVE
            }
        });
        const workspaceVersionIdByCoreVersionId = await this.findWorkspaceVersionIdByCoreVersionId({
            workspaceId,
            activeWorkflowVersions
        });
        const byWorkflowId = {};
        for (const workflowVersion of activeWorkflowVersions){
            const automatedTrigger = (0, _computeautomatedtriggerfromworkflowversionutil.computeAutomatedTriggerFromWorkflowVersion)({
                workflowVersion,
                workspaceWorkflowVersionId: workspaceVersionIdByCoreVersionId[workflowVersion.id] ?? null
            });
            if ((0, _utils.isDefined)(automatedTrigger)) {
                byWorkflowId[workflowVersion.workflowId] = automatedTrigger;
            }
        }
        return {
            byWorkflowId
        };
    }
    async findWorkspaceVersionIdByCoreVersionId({ workspaceId, activeWorkflowVersions }) {
        if (activeWorkflowVersions.length === 0) {
            return {};
        }
        const authContext = (0, _buildsystemauthcontextutil.buildSystemAuthContext)(workspaceId);
        return this.workspaceOrmManager.executeInWorkspaceContext(async ()=>{
            const workspaceWorkflowVersionRepository = this.workspaceOrmManager.getRepository('workflowVersion', {
                shouldBypassPermissionChecks: true
            });
            const workspaceWorkflowVersions = await workspaceWorkflowVersionRepository.find({
                where: {
                    coreWorkflowVersionId: (0, _typeorm.In)(activeWorkflowVersions.map((workflowVersion)=>workflowVersion.id))
                },
                select: {
                    id: true,
                    workflowId: true,
                    coreWorkflowVersionId: true
                }
            });
            const workflowIdByCoreVersionId = Object.fromEntries(activeWorkflowVersions.map((workflowVersion)=>[
                    workflowVersion.id,
                    workflowVersion.workflowId
                ]));
            const twinIdsByCoreVersionId = new Map();
            for (const workspaceWorkflowVersion of workspaceWorkflowVersions){
                const { coreWorkflowVersionId } = workspaceWorkflowVersion;
                if (!(0, _utils.isDefined)(coreWorkflowVersionId) || workflowIdByCoreVersionId[coreWorkflowVersionId] !== workspaceWorkflowVersion.workflowId) {
                    continue;
                }
                twinIdsByCoreVersionId.set(coreWorkflowVersionId, [
                    ...twinIdsByCoreVersionId.get(coreWorkflowVersionId) ?? [],
                    workspaceWorkflowVersion.id
                ]);
            }
            return Object.fromEntries([
                ...twinIdsByCoreVersionId.entries()
            ].flatMap(([coreWorkflowVersionId, twinIds])=>{
                if (twinIds.length > 1) {
                    this.logger.error(`Core workflow version ${coreWorkflowVersionId} has ${twinIds.length} workspace twins in workspace ${workspaceId}, skipping core dispatch`);
                    return [];
                }
                return [
                    [
                        coreWorkflowVersionId,
                        twinIds[0]
                    ]
                ];
            }));
        }, authContext);
    }
    constructor(workflowVersionRepository, workspaceOrmManager){
        super(), this.workflowVersionRepository = workflowVersionRepository, this.workspaceOrmManager = workspaceOrmManager, this.logger = new _common.Logger(WorkspaceWorkflowAutomatedTriggerMapCacheService.name);
    }
};
WorkspaceWorkflowAutomatedTriggerMapCacheService = _ts_decorate([
    (0, _common.Injectable)(),
    (0, _workspacecachedecorator.WorkspaceCache)('workflowAutomatedTriggerMaps', {
        packingPonderation: 1
    }),
    _ts_param(0, (0, _injectworkspacescopedrepositorydecorator.InjectWorkspaceScopedRepository)(_workflowversionentity.WorkflowVersionEntity)),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _workspacescopedrepository.WorkspaceScopedRepository === "undefined" ? Object : _workspacescopedrepository.WorkspaceScopedRepository,
        typeof _workspaceormmanager.WorkspaceOrmManager === "undefined" ? Object : _workspaceormmanager.WorkspaceOrmManager
    ])
], WorkspaceWorkflowAutomatedTriggerMapCacheService);

//# sourceMappingURL=workspace-workflow-automated-trigger-map-cache.service.js.map