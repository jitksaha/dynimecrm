"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "WorkflowCoreConsistencyService", {
    enumerable: true,
    get: function() {
        return WorkflowCoreConsistencyService;
    }
});
const _common = require("@nestjs/common");
const _typeorm = require("@nestjs/typeorm");
const _utils = require("twenty-shared/utils");
const _typeorm1 = require("typeorm");
const _workspaceiteratorservice = require("../../../../database/commands/command-runners/workspace-iterator.service");
const _exceptionhandlerservice = require("../../../../engine/core-modules/exception-handler/exception-handler.service");
const _metricsservice = require("../../../../engine/core-modules/metrics/metrics.service");
const _metricskeystype = require("../../../../engine/core-modules/metrics/types/metrics-keys.type");
const _workspacecacheservice = require("../../../../engine/workspace-cache/services/workspace-cache.service");
const _workflowautomatedtriggerworkspaceentity = require("../../common/standard-objects/workflow-automated-trigger.workspace-entity");
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
const CRON_INTERVAL_HOURS = 3;
const SHARD_TOTAL = 24 / CRON_INTERVAL_HOURS;
let WorkflowCoreConsistencyService = class WorkflowCoreConsistencyService {
    async runConsistencyCheck() {
        const shard = {
            index: Math.floor(new Date().getUTCHours() / CRON_INTERVAL_HOURS) % SHARD_TOTAL,
            total: SHARD_TOTAL
        };
        const report = await this.workspaceIteratorService.iterate({
            shard,
            callback: async ({ workspaceId, databaseSchema })=>{
                if (!(0, _utils.isDefined)(databaseSchema)) {
                    return;
                }
                await this.checkWorkspace(workspaceId, databaseSchema);
            }
        });
        for (const { workspaceId, error } of report.fail){
            this.exceptionHandlerService.captureExceptions([
                error
            ], {
                workspace: {
                    id: workspaceId
                }
            });
        }
    }
    async checkWorkspace(workspaceId, schema) {
        const [{ shouldCheck }] = await this.coreDataSource.query(`SELECT (
         EXISTS (SELECT 1 FROM "${schema}"."workflow" WHERE "deletedAt" IS NULL)
         OR EXISTS (SELECT 1 FROM core."workflow" WHERE "workspaceId" = $1)
       ) AS "shouldCheck"`, [
            workspaceId
        ]);
        if (!shouldCheck) {
            return;
        }
        await this.checkWorkflowSync(workspaceId, schema);
        await this.checkWorkflowVersionSync(workspaceId, schema);
        await this.checkAutomatedTriggerSync(workspaceId, schema);
    }
    async checkWorkflowSync(workspaceId, schema) {
        const [counts] = await this.coreDataSource.query(`SELECT
         count(*) FILTER (WHERE wf."coreWorkflowId" IS NULL)::int AS unlinked,
         count(*) FILTER (WHERE wf."coreWorkflowId" IS NOT NULL AND c.id IS NULL)::int AS "missingCore",
         count(*) FILTER (WHERE c.id IS NOT NULL AND (
           wf.name IS DISTINCT FROM c.name
           OR NULLIF(wf."lastPublishedVersionId", '') IS DISTINCT FROM c."lastPublishedVersionId"::text
         ))::int AS "fieldMismatch"
       FROM "${schema}"."workflow" wf
       LEFT JOIN core."workflow" c
         ON c.id = wf."coreWorkflowId" AND c."workspaceId" = $1
       WHERE wf."deletedAt" IS NULL`, [
            workspaceId
        ]);
        const [{ orphanCore }] = await this.coreDataSource.query(`SELECT count(*)::int AS "orphanCore"
       FROM core."workflow" c
       WHERE c."workspaceId" = $1
         AND NOT EXISTS (
           SELECT 1 FROM "${schema}"."workflow" wf WHERE wf."coreWorkflowId" = c.id
         )`, [
            workspaceId
        ]);
        this.emitDrift(_metricskeystype.MetricsKeys.WorkflowCoreConsistencyWorkflowDrift, workspaceId, 'workflow', {
            unlinked: counts.unlinked,
            missingCore: counts.missingCore,
            fieldMismatch: counts.fieldMismatch,
            orphanCore
        });
    }
    async checkWorkflowVersionSync(workspaceId, schema) {
        const [counts] = await this.coreDataSource.query(`SELECT
         count(*) FILTER (WHERE wf."coreWorkflowVersionId" IS NULL)::int AS unlinked,
         count(*) FILTER (WHERE wf."coreWorkflowVersionId" IS NOT NULL AND c.id IS NULL)::int AS "missingCore",
         count(*) FILTER (WHERE c.id IS NOT NULL AND (
           c.status::text IS DISTINCT FROM wf.status::text
           OR c."workflowId" IS DISTINCT FROM wf."workflowId"
           OR c.steps IS DISTINCT FROM wf.steps
           OR c.triggers IS DISTINCT FROM (
             CASE WHEN wf.trigger IS NULL THEN NULL ELSE jsonb_build_array(wf.trigger) END
           )
         ))::int AS "fieldMismatch"
       FROM "${schema}"."workflowVersion" wf
       LEFT JOIN core."workflowVersion" c
         ON c.id = wf."coreWorkflowVersionId" AND c."workspaceId" = $1
       WHERE wf."deletedAt" IS NULL`, [
            workspaceId
        ]);
        const [{ orphanCore }] = await this.coreDataSource.query(`SELECT count(*)::int AS "orphanCore"
       FROM core."workflowVersion" c
       WHERE c."workspaceId" = $1
         AND NOT EXISTS (
           SELECT 1 FROM "${schema}"."workflowVersion" wf WHERE wf."coreWorkflowVersionId" = c.id
         )`, [
            workspaceId
        ]);
        this.emitDrift(_metricskeystype.MetricsKeys.WorkflowCoreConsistencyVersionDrift, workspaceId, 'workflowVersion', {
            unlinked: counts.unlinked,
            missingCore: counts.missingCore,
            fieldMismatch: counts.fieldMismatch,
            orphanCore
        });
    }
    async checkAutomatedTriggerSync(workspaceId, schema) {
        const { workflowAutomatedTriggerMaps } = await this.workspaceCacheService.getOrRecompute(workspaceId, [
            'workflowAutomatedTriggerMaps'
        ]);
        const cacheByWorkflowId = workflowAutomatedTriggerMaps.byWorkflowId;
        const tableRows = await this.coreDataSource.query(`SELECT "workflowId", type, settings FROM "${schema}"."workflowAutomatedTrigger" WHERE "deletedAt" IS NULL`);
        const tableByWorkflowId = new Map(tableRows.map((row)=>[
                row.workflowId,
                row
            ]));
        let inTableNotCache = 0;
        let inCacheNotTable = 0;
        let mismatch = 0;
        for (const [workflowId, row] of tableByWorkflowId){
            const cached = cacheByWorkflowId[workflowId];
            if (!(0, _utils.isDefined)(cached)) {
                inTableNotCache++;
                continue;
            }
            if (cached.type !== row.type || this.triggerIdentity(row.type, row.settings) !== this.triggerIdentity(cached.type, cached.settings)) {
                mismatch++;
            }
        }
        for (const workflowId of Object.keys(cacheByWorkflowId)){
            if (!tableByWorkflowId.has(workflowId)) {
                inCacheNotTable++;
            }
        }
        this.emitDrift(_metricskeystype.MetricsKeys.WorkflowCoreConsistencyAutomatedTriggerDrift, workspaceId, 'automatedTrigger', {
            inTableNotCache,
            inCacheNotTable,
            mismatch
        });
    }
    triggerIdentity(type, settings) {
        if (type === _workflowautomatedtriggerworkspaceentity.AutomatedTriggerType.CRON) {
            return settings?.pattern ?? '';
        }
        if (type === _workflowautomatedtriggerworkspaceentity.AutomatedTriggerType.DATABASE_EVENT) {
            return settings?.eventName ?? '';
        }
        return '';
    }
    emitDrift(key, workspaceId, entity, counts) {
        for (const [driftType, count] of Object.entries(counts)){
            if (count > 0) {
                this.metricsService.incrementCounterBy({
                    key,
                    amount: count,
                    attributes: {
                        driftType
                    }
                });
                this.logger.warn(`Workflow core consistency drift: workspace=${workspaceId} entity=${entity} ${driftType}=${count}`);
            }
        }
    }
    constructor(coreDataSource, workspaceIteratorService, workspaceCacheService, metricsService, exceptionHandlerService){
        this.coreDataSource = coreDataSource;
        this.workspaceIteratorService = workspaceIteratorService;
        this.workspaceCacheService = workspaceCacheService;
        this.metricsService = metricsService;
        this.exceptionHandlerService = exceptionHandlerService;
        this.logger = new _common.Logger(WorkflowCoreConsistencyService.name);
    }
};
WorkflowCoreConsistencyService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_param(0, (0, _typeorm.InjectDataSource)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _typeorm1.DataSource === "undefined" ? Object : _typeorm1.DataSource,
        typeof _workspaceiteratorservice.WorkspaceIteratorService === "undefined" ? Object : _workspaceiteratorservice.WorkspaceIteratorService,
        typeof _workspacecacheservice.WorkspaceCacheService === "undefined" ? Object : _workspacecacheservice.WorkspaceCacheService,
        typeof _metricsservice.MetricsService === "undefined" ? Object : _metricsservice.MetricsService,
        typeof _exceptionhandlerservice.ExceptionHandlerService === "undefined" ? Object : _exceptionhandlerservice.ExceptionHandlerService
    ])
], WorkflowCoreConsistencyService);

//# sourceMappingURL=workflow-core-consistency.service.js.map