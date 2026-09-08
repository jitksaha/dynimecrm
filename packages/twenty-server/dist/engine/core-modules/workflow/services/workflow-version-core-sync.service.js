"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "WorkflowVersionCoreSyncService", {
    enumerable: true,
    get: function() {
        return WorkflowVersionCoreSyncService;
    }
});
const _common = require("@nestjs/common");
const _typeorm = require("@nestjs/typeorm");
const _guards = require("@sniptt/guards");
const _metadata = require("twenty-shared/metadata");
const _utils = require("twenty-shared/utils");
const _typeorm1 = require("typeorm");
const _uuid = require("uuid");
const _workflowversionentity = require("../entities/workflow-version.entity");
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
let WorkflowVersionCoreSyncService = class WorkflowVersionCoreSyncService {
    async upsertToCore(workspaceId, workflowVersions) {
        if (workflowVersions.length === 0) {
            return;
        }
        const applicationId = await this.getCustomApplicationIdOrThrow(workspaceId);
        const linkedCoreVersionIds = await this.resolveOwnedCoreVersionIds(workspaceId, workflowVersions);
        const coreVersionIdByWorkspaceRecordId = new Map();
        const coreRows = workflowVersions.map((workflowVersion)=>{
            const candidateCoreVersionId = workflowVersion.coreWorkflowVersionId;
            const linkedCoreVersionId = (0, _guards.isNonEmptyString)(candidateCoreVersionId) && linkedCoreVersionIds.has(candidateCoreVersionId) ? candidateCoreVersionId : null;
            const coreWorkflowVersionId = linkedCoreVersionId ?? (0, _uuid.v4)();
            if (!(0, _utils.isDefined)(linkedCoreVersionId)) {
                coreVersionIdByWorkspaceRecordId.set(workflowVersion.id, coreWorkflowVersionId);
            }
            return {
                id: coreWorkflowVersionId,
                workflowId: workflowVersion.workflowId,
                triggers: (0, _utils.isDefined)(workflowVersion.trigger) ? [
                    workflowVersion.trigger
                ] : null,
                steps: workflowVersion.steps ?? null,
                status: workflowVersion.status,
                universalIdentifier: (0, _uuid.v4)(),
                applicationId
            };
        });
        await this.coreWorkflowVersionRepository.upsert(workspaceId, coreRows, [
            'id'
        ]);
        await this.writeBackCoreVersionIds(workspaceId, coreVersionIdByWorkspaceRecordId);
        await this.invalidateAutomatedTriggerMaps(workspaceId);
    }
    // Same caller-writable column as coreWorkflowId, see WorkflowCoreSyncService.
    async resolveOwnedCoreVersionIds(workspaceId, workflowVersions) {
        const candidateIds = workflowVersions.map((workflowVersion)=>workflowVersion.coreWorkflowVersionId).filter(_guards.isNonEmptyString);
        if (candidateIds.length === 0) {
            return new Set();
        }
        const ownedRows = await this.coreWorkflowVersionRepository.find(workspaceId, {
            where: {
                id: (0, _typeorm1.In)(candidateIds)
            },
            select: {
                id: true
            }
        });
        return new Set(ownedRows.map((row)=>row.id));
    }
    async deleteFromCore(workspaceId, coreWorkflowVersionIds) {
        if (coreWorkflowVersionIds.length === 0) {
            return;
        }
        await this.coreWorkflowVersionRepository.delete(workspaceId, {
            id: (0, _typeorm1.In)(coreWorkflowVersionIds)
        });
        await this.invalidateAutomatedTriggerMaps(workspaceId);
    }
    async findCoreVersionById(workspaceId, coreWorkflowVersionId) {
        return this.coreWorkflowVersionRepository.findOne(workspaceId, {
            where: {
                id: coreWorkflowVersionId
            }
        });
    }
    async mirrorWorkflowVersionWrite({ workspaceId, transactionScope, workflowVersion, applicationId }) {
        if (!await this.workspaceHasCoreWorkflowVersionIdField(workspaceId)) {
            this.logger.warn(`workflowVersion.coreWorkflowVersionId field missing for workspace ${workspaceId}, skipping transactional core mirror`);
            return null;
        }
        const resolvedApplicationId = applicationId ?? await this.getCustomApplicationIdOrThrow(workspaceId);
        const candidateCoreVersionId = workflowVersion.coreWorkflowVersionId;
        const linkedCoreVersionId = (0, _guards.isNonEmptyString)(candidateCoreVersionId) && await this.isCoreVersionOwnedByWorkspace({
            coreWorkflowVersionId: candidateCoreVersionId,
            workspaceId,
            transactionScope
        }) ? candidateCoreVersionId : null;
        const isNewLink = !(0, _utils.isDefined)(linkedCoreVersionId);
        const coreWorkflowVersionId = linkedCoreVersionId ?? (0, _uuid.v4)();
        // The conflict target is the primary key alone, so without the workspaceId
        // predicate a core row owned by another workspace would have its triggers
        // and steps overwritten.
        await transactionScope.executeRawQuery(`INSERT INTO core."workflowVersion"
         ("id", "workspaceId", "workflowId", "triggers", "steps", "status", "universalIdentifier", "applicationId")
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       ON CONFLICT ("id") DO UPDATE SET
         "triggers" = EXCLUDED."triggers",
         "steps" = EXCLUDED."steps",
         "status" = EXCLUDED."status"
       WHERE core."workflowVersion"."workspaceId" = EXCLUDED."workspaceId"`, [
            coreWorkflowVersionId,
            workspaceId,
            workflowVersion.workflowId,
            (0, _utils.isDefined)(workflowVersion.trigger) ? JSON.stringify([
                workflowVersion.trigger
            ]) : null,
            (0, _utils.isDefined)(workflowVersion.steps) ? JSON.stringify(workflowVersion.steps) : null,
            workflowVersion.status,
            (0, _uuid.v4)(),
            resolvedApplicationId
        ]);
        if (isNewLink) {
            await this.writeBackCoreVersionIdInTransaction(workflowVersion.id, coreWorkflowVersionId, transactionScope);
        }
        return {
            coreWorkflowVersionId
        };
    }
    // Must run inside the caller's transaction so the ownership answer cannot go
    // stale before the insert below uses it.
    async isCoreVersionOwnedByWorkspace({ coreWorkflowVersionId, workspaceId, transactionScope }) {
        const rows = await transactionScope.executeRawQuery(`SELECT 1 FROM core."workflowVersion" WHERE "id" = $1 AND "workspaceId" = $2`, [
            coreWorkflowVersionId,
            workspaceId
        ]);
        return (0, _utils.isNonEmptyArray)(rows);
    }
    async mirrorWorkflowVersionWrites({ workspaceId, transactionScope, workflowVersions }) {
        const coreIdByWorkspaceRecordId = new Map();
        if (workflowVersions.length === 0) {
            return coreIdByWorkspaceRecordId;
        }
        const applicationId = await this.getCustomApplicationIdOrThrow(workspaceId);
        for (const workflowVersion of workflowVersions){
            const result = await this.mirrorWorkflowVersionWrite({
                workspaceId,
                transactionScope,
                workflowVersion,
                applicationId
            });
            if ((0, _utils.isDefined)(result)) {
                coreIdByWorkspaceRecordId.set(workflowVersion.id, result.coreWorkflowVersionId);
            }
        }
        return coreIdByWorkspaceRecordId;
    }
    async writeWorkflowVersionAndMirror(workspaceId, write) {
        await this.workspaceOrmManager.executeInWorkspaceContext(async ()=>{
            await this.workspaceOrmManager.runInWorkspaceTransaction(async (transactionScope)=>{
                const workflowVersionRepository = transactionScope.getRepository('workflowVersion', {
                    shouldBypassPermissionChecks: true
                });
                const workflowVersionId = await write(workflowVersionRepository, transactionScope);
                const workflowVersion = await workflowVersionRepository.findOne({
                    where: {
                        id: workflowVersionId
                    }
                });
                if ((0, _utils.isDefined)(workflowVersion)) {
                    await this.mirrorWorkflowVersionWrite({
                        workspaceId,
                        transactionScope,
                        workflowVersion
                    });
                }
            });
        }, (0, _buildsystemauthcontextutil.buildSystemAuthContext)(workspaceId));
        await this.invalidateAutomatedTriggerMaps(workspaceId);
    }
    async deleteCoreVersionsByWorkflowIds(workspaceId, workflowIds) {
        if (workflowIds.length === 0) {
            return;
        }
        await this.coreWorkflowVersionRepository.delete(workspaceId, {
            workflowId: (0, _typeorm1.In)(workflowIds)
        });
        await this.invalidateAutomatedTriggerMaps(workspaceId);
    }
    async deleteCoreVersionsByWorkspaceVersionIds(workspaceId, workflowVersionIds) {
        if (workflowVersionIds.length === 0) {
            return;
        }
        const coreWorkflowVersionIds = await this.workspaceOrmManager.executeInWorkspaceContext(async ()=>{
            const workflowVersionRepository = this.workspaceOrmManager.getRepository('workflowVersion', {
                shouldBypassPermissionChecks: true
            });
            const versions = await workflowVersionRepository.find({
                where: {
                    id: (0, _typeorm1.In)(workflowVersionIds)
                },
                withDeleted: true
            });
            return versions.map((version)=>version.coreWorkflowVersionId).filter(_guards.isNonEmptyString);
        }, (0, _buildsystemauthcontextutil.buildSystemAuthContext)(workspaceId));
        await this.deleteFromCore(workspaceId, coreWorkflowVersionIds);
    }
    async recreateCoreVersionsByWorkflowId(workspaceId, workflowId) {
        await this.workspaceOrmManager.executeInWorkspaceContext(async ()=>{
            const workflowVersionRepository = this.workspaceOrmManager.getRepository('workflowVersion', {
                shouldBypassPermissionChecks: true
            });
            const versions = await workflowVersionRepository.find({
                where: {
                    workflowId
                }
            });
            await this.upsertToCore(workspaceId, versions);
        }, (0, _buildsystemauthcontextutil.buildSystemAuthContext)(workspaceId));
    }
    async writeBackCoreVersionIds(workspaceId, coreVersionIdByWorkspaceRecordId) {
        if (coreVersionIdByWorkspaceRecordId.size === 0) {
            return;
        }
        if (!await this.workspaceHasCoreWorkflowVersionIdField(workspaceId)) {
            this.logger.warn(`workflowVersion.coreWorkflowVersionId field missing for workspace ${workspaceId}, skipping core id write-back`);
            return;
        }
        await this.workspaceOrmManager.executeInWorkspaceContext(async ()=>{
            const workspaceWorkflowVersionRepository = this.workspaceOrmManager.getRepository('workflowVersion', {
                shouldBypassPermissionChecks: true
            });
            for (const [workspaceRecordId, coreWorkflowVersionId] of coreVersionIdByWorkspaceRecordId){
                await workspaceWorkflowVersionRepository.update(workspaceRecordId, {
                    coreWorkflowVersionId
                });
            }
        }, (0, _buildsystemauthcontextutil.buildSystemAuthContext)(workspaceId));
    }
    async writeBackCoreVersionIdInTransaction(workflowVersionId, coreWorkflowVersionId, transactionScope) {
        const workspaceWorkflowVersionRepository = transactionScope.getRepository('workflowVersion', {
            shouldBypassPermissionChecks: true
        });
        await workspaceWorkflowVersionRepository.update({
            id: workflowVersionId
        }, {
            coreWorkflowVersionId
        });
    }
    async workspaceHasCoreWorkflowVersionIdField(workspaceId) {
        const { flatFieldMetadataMaps } = await this.workspaceCacheService.getOrRecompute(workspaceId, [
            'flatFieldMetadataMaps'
        ]);
        return (0, _utils.isDefined)(flatFieldMetadataMaps.byUniversalIdentifier[_metadata.STANDARD_OBJECTS.workflowVersion.fields.coreWorkflowVersionId.universalIdentifier]);
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
    async invalidateAutomatedTriggerMaps(workspaceId) {
        await this.workspaceCacheService.invalidateAndRecompute(workspaceId, [
            'workflowAutomatedTriggerMaps'
        ]);
    }
    constructor(coreWorkflowVersionRepository, workspaceRepository, workspaceOrmManager, workspaceCacheService){
        this.coreWorkflowVersionRepository = coreWorkflowVersionRepository;
        this.workspaceRepository = workspaceRepository;
        this.workspaceOrmManager = workspaceOrmManager;
        this.workspaceCacheService = workspaceCacheService;
        this.logger = new _common.Logger(WorkflowVersionCoreSyncService.name);
    }
};
WorkflowVersionCoreSyncService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_param(0, (0, _injectworkspacescopedrepositorydecorator.InjectWorkspaceScopedRepository)(_workflowversionentity.WorkflowVersionEntity)),
    _ts_param(1, (0, _typeorm.InjectRepository)(_workspaceentity.WorkspaceEntity)),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _workspacescopedrepository.WorkspaceScopedRepository === "undefined" ? Object : _workspacescopedrepository.WorkspaceScopedRepository,
        typeof _typeorm1.Repository === "undefined" ? Object : _typeorm1.Repository,
        typeof _workspaceormmanager.WorkspaceOrmManager === "undefined" ? Object : _workspaceormmanager.WorkspaceOrmManager,
        typeof _workspacecacheservice.WorkspaceCacheService === "undefined" ? Object : _workspacecacheservice.WorkspaceCacheService
    ])
], WorkflowVersionCoreSyncService);

//# sourceMappingURL=workflow-version-core-sync.service.js.map