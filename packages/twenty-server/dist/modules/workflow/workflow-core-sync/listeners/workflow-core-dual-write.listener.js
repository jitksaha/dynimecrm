"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "WorkflowCoreDualWriteListener", {
    enumerable: true,
    get: function() {
        return WorkflowCoreDualWriteListener;
    }
});
const _common = require("@nestjs/common");
const _utils = require("twenty-shared/utils");
const _ondatabasebatcheventdecorator = require("../../../../engine/api/graphql/graphql-query-runner/decorators/on-database-batch-event.decorator");
const _databaseeventaction = require("../../../../engine/api/graphql/graphql-query-runner/enums/database-event-action");
const _exceptionhandlerservice = require("../../../../engine/core-modules/exception-handler/exception-handler.service");
const _workflowcoresyncservice = require("../../../../engine/core-modules/workflow/services/workflow-core-sync.service");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let WorkflowCoreDualWriteListener = class WorkflowCoreDualWriteListener {
    async handleCreated(batchEvent) {
        await this.upsertToCore(batchEvent.workspaceId, batchEvent.events.map((event)=>event.properties.after));
    }
    async handleUpdated(batchEvent) {
        await this.upsertToCore(batchEvent.workspaceId, batchEvent.events.map((event)=>event.properties.after));
    }
    async handleRestored(batchEvent) {
        await this.upsertToCore(batchEvent.workspaceId, batchEvent.events.map((event)=>event.properties.after));
    }
    async handleDeleted(batchEvent) {
        await this.deleteFromCore(batchEvent.workspaceId, batchEvent.events.map((event)=>event.properties.before.coreWorkflowId).filter(_utils.isDefined));
    }
    async handleDestroyed(batchEvent) {
        await this.deleteFromCore(batchEvent.workspaceId, batchEvent.events.map((event)=>event.properties.before.coreWorkflowId).filter(_utils.isDefined));
    }
    async upsertToCore(workspaceId, workflows) {
        if (!(0, _utils.isDefined)(workspaceId)) {
            return;
        }
        try {
            await this.workflowCoreSyncService.upsertToCore(workspaceId, workflows);
        } catch (error) {
            this.exceptionHandlerService.captureExceptions([
                error
            ], {
                workspace: {
                    id: workspaceId
                }
            });
        }
    }
    async deleteFromCore(workspaceId, coreWorkflowIds) {
        if (!(0, _utils.isDefined)(workspaceId)) {
            return;
        }
        try {
            await this.workflowCoreSyncService.deleteFromCore(workspaceId, coreWorkflowIds);
        } catch (error) {
            this.exceptionHandlerService.captureExceptions([
                error
            ], {
                workspace: {
                    id: workspaceId
                }
            });
        }
    }
    constructor(exceptionHandlerService, workflowCoreSyncService){
        this.exceptionHandlerService = exceptionHandlerService;
        this.workflowCoreSyncService = workflowCoreSyncService;
    }
};
_ts_decorate([
    (0, _ondatabasebatcheventdecorator.OnDatabaseBatchEvent)('workflow', _databaseeventaction.DatabaseEventAction.CREATED),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof CustomWorkspaceEventBatch === "undefined" ? Object : CustomWorkspaceEventBatch
    ]),
    _ts_metadata("design:returntype", Promise)
], WorkflowCoreDualWriteListener.prototype, "handleCreated", null);
_ts_decorate([
    (0, _ondatabasebatcheventdecorator.OnDatabaseBatchEvent)('workflow', _databaseeventaction.DatabaseEventAction.UPDATED),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof CustomWorkspaceEventBatch === "undefined" ? Object : CustomWorkspaceEventBatch
    ]),
    _ts_metadata("design:returntype", Promise)
], WorkflowCoreDualWriteListener.prototype, "handleUpdated", null);
_ts_decorate([
    (0, _ondatabasebatcheventdecorator.OnDatabaseBatchEvent)('workflow', _databaseeventaction.DatabaseEventAction.RESTORED),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof CustomWorkspaceEventBatch === "undefined" ? Object : CustomWorkspaceEventBatch
    ]),
    _ts_metadata("design:returntype", Promise)
], WorkflowCoreDualWriteListener.prototype, "handleRestored", null);
_ts_decorate([
    (0, _ondatabasebatcheventdecorator.OnDatabaseBatchEvent)('workflow', _databaseeventaction.DatabaseEventAction.DELETED),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof CustomWorkspaceEventBatch === "undefined" ? Object : CustomWorkspaceEventBatch
    ]),
    _ts_metadata("design:returntype", Promise)
], WorkflowCoreDualWriteListener.prototype, "handleDeleted", null);
_ts_decorate([
    (0, _ondatabasebatcheventdecorator.OnDatabaseBatchEvent)('workflow', _databaseeventaction.DatabaseEventAction.DESTROYED),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof CustomWorkspaceEventBatch === "undefined" ? Object : CustomWorkspaceEventBatch
    ]),
    _ts_metadata("design:returntype", Promise)
], WorkflowCoreDualWriteListener.prototype, "handleDestroyed", null);
WorkflowCoreDualWriteListener = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _exceptionhandlerservice.ExceptionHandlerService === "undefined" ? Object : _exceptionhandlerservice.ExceptionHandlerService,
        typeof _workflowcoresyncservice.WorkflowCoreSyncService === "undefined" ? Object : _workflowcoresyncservice.WorkflowCoreSyncService
    ])
], WorkflowCoreDualWriteListener);

//# sourceMappingURL=workflow-core-dual-write.listener.js.map