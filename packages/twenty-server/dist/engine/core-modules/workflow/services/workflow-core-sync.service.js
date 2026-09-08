"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "WorkflowCoreSyncService", {
    enumerable: true,
    get: function() {
        return WorkflowCoreSyncService;
    }
});
const _common = require("@nestjs/common");
const _typeorm = require("@nestjs/typeorm");
const _guards = require("@sniptt/guards");
const _metadata = require("twenty-shared/metadata");
const _utils = require("twenty-shared/utils");
const _typeorm1 = require("typeorm");
const _uuid = require("uuid");
const _workflowentity = require("../entities/workflow.entity");
const _workspaceentity = require("../../workspace/workspace.entity");
const _workspaceormmanager = require("../../../twenty-orm/workspace-orm.manager");
const _injectworkspacescopedrepositorydecorator = require("../../../twenty-orm/workspace-scoped-repository/inject-workspace-scoped-repository.decorator");
const _workspacescopedrepository = require("../../../twenty-orm/workspace-scoped-repository/workspace-scoped-repository");
const _buildsystemauthcontextutil = require("../../../twenty-orm/utils/build-system-auth-context.util");
const _workspacecacheservice = require("../../../workspace-cache/services/workspace-cache.service");
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
let WorkflowCoreSyncService = class WorkflowCoreSyncService {
    async upsertToCore(workspaceId, workflows) {
        if (workflows.length === 0) {
            return;
        }
        const applicationId = await this.getCustomApplicationIdOrThrow(workspaceId);
        const linkedCoreWorkflowIds = await this.resolveOwnedCoreWorkflowIds(workspaceId, workflows);
        const coreWorkflowIdByWorkspaceRecordId = new Map();
        const coreRows = workflows.map((workflow)=>{
            const candidateCoreWorkflowId = workflow.coreWorkflowId;
            const linkedCoreWorkflowId = (0, _guards.isNonEmptyString)(candidateCoreWorkflowId) && linkedCoreWorkflowIds.has(candidateCoreWorkflowId) ? candidateCoreWorkflowId : null;
            const coreWorkflowId = linkedCoreWorkflowId ?? (0, _uuid.v4)();
            if (!(0, _utils.isDefined)(linkedCoreWorkflowId)) {
                coreWorkflowIdByWorkspaceRecordId.set(workflow.id, coreWorkflowId);
            }
            return {
                id: coreWorkflowId,
                name: workflow.name ?? null,
                lastPublishedVersionId: (0, _guards.isNonEmptyString)(workflow.lastPublishedVersionId) ? workflow.lastPublishedVersionId : null,
                universalIdentifier: (0, _uuid.v4)(),
                applicationId
            };
        });
        await this.coreWorkflowRepository.upsert(workspaceId, coreRows, [
            'id'
        ]);
        await this.writeBackCoreWorkflowIds(workspaceId, coreWorkflowIdByWorkspaceRecordId);
    }
    // coreWorkflowId is a writable column on the workspace record, so a caller
    // can point it at a core row owned by another workspace.
    async resolveOwnedCoreWorkflowIds(workspaceId, workflows) {
        const candidateIds = workflows.map((workflow)=>workflow.coreWorkflowId).filter(_guards.isNonEmptyString);
        if (candidateIds.length === 0) {
            return new Set();
        }
        const ownedRows = await this.coreWorkflowRepository.find(workspaceId, {
            where: {
                id: (0, _typeorm1.In)(candidateIds)
            },
            select: {
                id: true
            }
        });
        return new Set(ownedRows.map((row)=>row.id));
    }
    async deleteFromCore(workspaceId, coreWorkflowIds) {
        if (coreWorkflowIds.length === 0) {
            return;
        }
        await this.coreWorkflowRepository.delete(workspaceId, {
            id: (0, _typeorm1.In)(coreWorkflowIds)
        });
    }
    async writeBackCoreWorkflowIds(workspaceId, coreWorkflowIdByWorkspaceRecordId) {
        if (coreWorkflowIdByWorkspaceRecordId.size === 0) {
            return;
        }
        if (!await this.workspaceHasCoreWorkflowIdField(workspaceId)) {
            this.logger.warn(`workflow.coreWorkflowId field missing for workspace ${workspaceId}, skipping core id write-back`);
            return;
        }
        await this.workspaceOrmManager.executeInWorkspaceContext(async ()=>{
            const workspaceWorkflowRepository = this.workspaceOrmManager.getRepository('workflow', {
                shouldBypassPermissionChecks: true
            });
            for (const [workspaceRecordId, coreWorkflowId] of coreWorkflowIdByWorkspaceRecordId){
                await workspaceWorkflowRepository.update(workspaceRecordId, {
                    coreWorkflowId
                });
            }
        }, (0, _buildsystemauthcontextutil.buildSystemAuthContext)(workspaceId));
    }
    async workspaceHasCoreWorkflowIdField(workspaceId) {
        const { flatFieldMetadataMaps } = await this.workspaceCacheService.getOrRecompute(workspaceId, [
            'flatFieldMetadataMaps'
        ]);
        return (0, _utils.isDefined)(flatFieldMetadataMaps.byUniversalIdentifier[_metadata.STANDARD_OBJECTS.workflow.fields.coreWorkflowId.universalIdentifier]);
    }
    async getCustomApplicationIdOrThrow(workspaceId) {
        const workspace = await this.workspaceRepository.findOne({
            where: {
                id: workspaceId
            },
            select: [
                'id',
                'workspaceCustomApplicationId'
            ]
        });
        if (!(0, _utils.isDefined)(workspace?.workspaceCustomApplicationId)) {
            throw new Error(`Workspace custom application not found for workspace ${workspaceId}`);
        }
        return workspace.workspaceCustomApplicationId;
    }
    constructor(coreWorkflowRepository, workspaceRepository, workspaceOrmManager, workspaceCacheService){
        this.coreWorkflowRepository = coreWorkflowRepository;
        this.workspaceRepository = workspaceRepository;
        this.workspaceOrmManager = workspaceOrmManager;
        this.workspaceCacheService = workspaceCacheService;
        this.logger = new _common.Logger(WorkflowCoreSyncService.name);
    }
};
WorkflowCoreSyncService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_param(0, (0, _injectworkspacescopedrepositorydecorator.InjectWorkspaceScopedRepository)(_workflowentity.WorkflowEntity)),
    _ts_param(1, (0, _typeorm.InjectRepository)(_workspaceentity.WorkspaceEntity)),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _workspacescopedrepository.WorkspaceScopedRepository === "undefined" ? Object : _workspacescopedrepository.WorkspaceScopedRepository,
        typeof _typeorm1.Repository === "undefined" ? Object : _typeorm1.Repository,
        typeof _workspaceormmanager.WorkspaceOrmManager === "undefined" ? Object : _workspaceormmanager.WorkspaceOrmManager,
        typeof _workspacecacheservice.WorkspaceCacheService === "undefined" ? Object : _workspacecacheservice.WorkspaceCacheService
    ])
], WorkflowCoreSyncService);

//# sourceMappingURL=workflow-core-sync.service.js.map