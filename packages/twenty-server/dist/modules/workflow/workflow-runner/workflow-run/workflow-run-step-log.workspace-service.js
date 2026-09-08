"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "WorkflowRunStepLogWorkspaceService", {
    enumerable: true,
    get: function() {
        return WorkflowRunStepLogWorkspaceService;
    }
});
const _common = require("@nestjs/common");
const _typeorm = require("@nestjs/typeorm");
const _typeorm1 = require("typeorm");
const _getworkspaceschemanameutil = require("../../../../engine/workspace-datasource/utils/get-workspace-schema-name.util");
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
const MAX_STEP_LOG_BYTES = 256_000;
const computeSizeBytes = (value)=>{
    try {
        return Buffer.byteLength(JSON.stringify(value) ?? '', 'utf8');
    } catch  {
        return 0;
    }
};
let WorkflowRunStepLogWorkspaceService = class WorkflowRunStepLogWorkspaceService {
    async setStepLog({ workflowRunId, workspaceId, stepId, stepLog }) {
        const sizeBytes = computeSizeBytes(stepLog);
        if (sizeBytes > MAX_STEP_LOG_BYTES) {
            this.logger.warn(`Step log for workflowRun=${workflowRunId} step=${stepId} exceeds cap (${sizeBytes}b > ${MAX_STEP_LOG_BYTES}b) and will be dropped`);
            return;
        }
        const stepLogWithSize = {
            ...stepLog,
            sizeBytes
        };
        const schemaName = (0, _getworkspaceschemanameutil.getWorkspaceSchemaName)(workspaceId);
        await this.coreDataSource.query(`UPDATE ${schemaName}."workflowRun" SET "stepLogs" = jsonb_set(COALESCE("stepLogs", '{}'::jsonb), ARRAY[$1]::text[], $2::jsonb, true) WHERE "id" = $3`, [
            stepId,
            JSON.stringify(stepLogWithSize),
            workflowRunId
        ]);
    }
    constructor(coreDataSource){
        this.coreDataSource = coreDataSource;
        this.logger = new _common.Logger(WorkflowRunStepLogWorkspaceService.name);
    }
};
WorkflowRunStepLogWorkspaceService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_param(0, (0, _typeorm.InjectDataSource)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _typeorm1.DataSource === "undefined" ? Object : _typeorm1.DataSource
    ])
], WorkflowRunStepLogWorkspaceService);

//# sourceMappingURL=workflow-run-step-log.workspace-service.js.map