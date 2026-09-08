"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "FindRecordsWorkflowAction", {
    enumerable: true,
    get: function() {
        return FindRecordsWorkflowAction;
    }
});
const _common = require("@nestjs/common");
const _utils = require("twenty-shared/utils");
const _findrecordsservice = require("../../../../../engine/core-modules/record-crud/services/find-records.service");
const _workflowcommonworkspaceservice = require("../../../common/workspace-services/workflow-common.workspace-service");
const _workflowstepexecutorexception = require("../../exceptions/workflow-step-executor.exception");
const _workflowexecutioncontextservice = require("../../services/workflow-execution-context.service");
const _findsteporthrowutil = require("../../utils/find-step-or-throw.util");
const _isworkflowfindrecordsactionguard = require("./guards/is-workflow-find-records-action.guard");
const _resolvelimitinpututil = require("./utils/resolve-limit-input.util");
const _resolveoffsetinpututil = require("./utils/resolve-offset-input.util");
const _resolverecordfiltersutil = require("./utils/resolve-record-filters.util");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let FindRecordsWorkflowAction = class FindRecordsWorkflowAction {
    async execute({ currentStepId, steps, context, runInfo }) {
        const step = (0, _findsteporthrowutil.findStepOrThrow)({
            steps,
            stepId: currentStepId
        });
        if (!(0, _isworkflowfindrecordsactionguard.isWorkflowFindRecordsAction)(step)) {
            throw new _workflowstepexecutorexception.WorkflowStepExecutorException('Step is not a find records action', _workflowstepexecutorexception.WorkflowStepExecutorExceptionCode.INVALID_STEP_TYPE);
        }
        const recordFilters = (0, _resolverecordfiltersutil.resolveRecordFilters)({
            unresolvedRecordFilters: step.settings.input.filter?.recordFilters,
            context
        });
        const workflowActionInput = (0, _utils.resolveInput)(step.settings.input, context);
        const { workspaceId } = runInfo;
        const executionContext = await this.workflowExecutionContextService.getExecutionContext(runInfo);
        const { flatFieldMetadataMaps } = await this.workflowCommonWorkspaceService.getObjectMetadataInfo(workflowActionInput.objectName, workspaceId);
        if (recordFilters) {
            for (const filter of recordFilters){
                if (!(0, _utils.isRecordFilterValueValid)(filter)) {
                    throw new _workflowstepexecutorexception.WorkflowStepExecutorException(`Filter condition has an empty value after variable resolution. This likely means a workflow variable could not be resolved. Filter field: ${filter.fieldMetadataId}, operand: ${filter.operand}`, _workflowstepexecutorexception.WorkflowStepExecutorExceptionCode.INVALID_STEP_INPUT);
                }
            }
        }
        let gqlOperationFilter;
        try {
            gqlOperationFilter = (0, _utils.isDefined)(recordFilters) ? (0, _utils.computeRecordGqlOperationFilter)({
                fieldMetadataItems: Object.values(flatFieldMetadataMaps.byUniversalIdentifier).filter(_utils.isDefined),
                recordFilters,
                recordFilterGroups: workflowActionInput.filter?.recordFilterGroups ?? [],
                filterValueDependencies: {
                    timeZone: 'UTC'
                }
            }) : {};
        } catch (error) {
            throw new _workflowstepexecutorexception.WorkflowStepExecutorException(`Filter could not be computed: ${error.message}`, _workflowstepexecutorexception.WorkflowStepExecutorExceptionCode.INVALID_STEP_INPUT);
        }
        if ((0, _utils.isNonEmptyArray)(recordFilters) && (0, _utils.isEmptyObject)(gqlOperationFilter)) {
            throw new _workflowstepexecutorexception.WorkflowStepExecutorException('Filter could not be resolved to a valid query. Check that filtered fields exist and that grouped filters include their recordFilterGroups.', _workflowstepexecutorexception.WorkflowStepExecutorExceptionCode.INVALID_STEP_INPUT);
        }
        const toolOutput = await this.findRecordsService.execute({
            objectName: workflowActionInput.objectName,
            filter: gqlOperationFilter,
            orderBy: workflowActionInput.orderBy?.gqlOperationOrderBy,
            limit: (0, _resolvelimitinpututil.resolveLimitInput)(workflowActionInput.limit),
            offset: (0, _resolveoffsetinpututil.resolveOffsetInput)(workflowActionInput.offset),
            authContext: executionContext.authContext,
            rolePermissionConfig: executionContext.rolePermissionConfig,
            shouldBuildEffectiveSelectFields: false
        });
        if (!toolOutput.success) {
            return {
                error: toolOutput.error || toolOutput.message
            };
        }
        const records = toolOutput.result?.records ?? [];
        const totalCount = toolOutput.result?.count ?? 0;
        return {
            result: {
                first: records[0],
                all: records,
                totalCount
            }
        };
    }
    constructor(findRecordsService, workflowExecutionContextService, workflowCommonWorkspaceService){
        this.findRecordsService = findRecordsService;
        this.workflowExecutionContextService = workflowExecutionContextService;
        this.workflowCommonWorkspaceService = workflowCommonWorkspaceService;
    }
};
FindRecordsWorkflowAction = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _findrecordsservice.FindRecordsService === "undefined" ? Object : _findrecordsservice.FindRecordsService,
        typeof _workflowexecutioncontextservice.WorkflowExecutionContextService === "undefined" ? Object : _workflowexecutioncontextservice.WorkflowExecutionContextService,
        typeof _workflowcommonworkspaceservice.WorkflowCommonWorkspaceService === "undefined" ? Object : _workflowcommonworkspaceservice.WorkflowCommonWorkspaceService
    ])
], FindRecordsWorkflowAction);

//# sourceMappingURL=find-records.workflow-action.js.map