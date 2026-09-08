"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "WorkflowValidationWorkspaceService", {
    enumerable: true,
    get: function() {
        return WorkflowValidationWorkspaceService;
    }
});
const _common = require("@nestjs/common");
const _guards = require("@sniptt/guards");
const _logicfunction = require("twenty-shared/logic-function");
const _utils = require("twenty-shared/utils");
const _workflow = require("twenty-shared/workflow");
const _workflowcommonworkspaceservice = require("../../common/workspace-services/workflow-common.workspace-service");
const _workflowmetadatareadworkspaceservice = require("../../common/workspace-services/workflow-metadata-read.workspace-service");
const _workflowschemaworkspaceservice = require("../workflow-schema/workflow-schema.workspace-service");
const _getpickrecordloadbalanceconfigerrorutil = require("./utils/get-pick-record-load-balance-config-error.util");
const _hasworkflowstepleveloutputschemautil = require("./utils/has-workflow-step-level-output-schema.util");
const _buildmissingworkflowoutputschemaissueutil = require("./utils/build-missing-workflow-output-schema-issue.util");
const _validateworkflowtriggertyperequirementsutil = require("./utils/validate-workflow-trigger-type-requirements.util");
const _validateworkflowruntimeoutputsteputil = require("./utils/validate-workflow-runtime-output-step.util");
const _validateworkflowstepshavevariablereferencesutil = require("./utils/validate-workflow-steps-have-variable-references.util");
const _validateworkflowiteratorsteputil = require("./utils/validate-workflow-iterator-step.util");
const _validateworkflowaiagentsteputil = require("./utils/validate-workflow-ai-agent-step.util");
const _validateworkflowlogicfunctionoutputschemamismatchutil = require("./utils/validate-workflow-logic-function-output-schema-mismatch.util");
const _workflowrecordcrudactiontypesconstant = require("./constants/workflow-record-crud-action-types.constant");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
const OBJECT_TARGETING_ACTION_TYPES = new Set([
    ..._workflowrecordcrudactiontypesconstant.WORKFLOW_RECORD_CRUD_ACTION_TYPES,
    _workflow.WorkflowActionType.PICK_RECORD
]);
let WorkflowValidationWorkspaceService = class WorkflowValidationWorkspaceService {
    async validateWorkflowVersion({ workspaceId, workflowVersionId }) {
        const workflowVersion = await this.workflowCommonWorkspaceService.getWorkflowVersionOrFail({
            workspaceId,
            workflowVersionId
        });
        return this.validateWorkflowDefinition({
            workspaceId,
            workflowVersionId,
            trigger: workflowVersion.trigger,
            steps: workflowVersion.steps
        });
    }
    async validateWorkflowDefinition({ workspaceId, workflowVersionId, trigger, steps }) {
        const { trigger: enrichedTrigger, steps: enrichedSteps } = await this.enrichOutputSchemas({
            workspaceId,
            workflowVersionId,
            trigger,
            steps
        });
        const staticResult = (0, _workflow.validateWorkflowStructure)({
            trigger: enrichedTrigger,
            steps: enrichedSteps
        });
        const triggerIssues = (0, _validateworkflowtriggertyperequirementsutil.validateWorkflowTriggerTypeRequirements)(enrichedTrigger);
        const semanticIssues = await this.validateStepTypeRequirements({
            workspaceId,
            steps: enrichedSteps ?? [],
            trigger: enrichedTrigger
        });
        const metadataIssues = await this.validateWorkspaceMetadata({
            workspaceId,
            steps: enrichedSteps ?? []
        });
        const variableReferenceIssues = (0, _validateworkflowstepshavevariablereferencesutil.validateWorkflowStepsHaveVariableReferences)(enrichedSteps ?? []);
        return mergeValidationResults(staticResult, [
            ...triggerIssues,
            ...semanticIssues,
            ...metadataIssues,
            ...variableReferenceIssues
        ]);
    }
    async enrichOutputSchemas({ workspaceId, workflowVersionId, trigger, steps }) {
        const enrichedTrigger = (0, _utils.isDefined)(trigger) ? await this.withComputedOutputSchema({
            step: trigger,
            workspaceId,
            workflowVersionId
        }) : trigger;
        const enrichedSteps = (0, _utils.isDefined)(steps) ? await Promise.all(steps.map((step)=>this.withComputedOutputSchema({
                step,
                workspaceId,
                workflowVersionId
            }))) : steps;
        return {
            trigger: enrichedTrigger,
            steps: enrichedSteps
        };
    }
    async withComputedOutputSchema({ step, workspaceId, workflowVersionId }) {
        try {
            const computedSchema = await this.workflowSchemaWorkspaceService.computeStepOutputSchema({
                step,
                workspaceId,
                workflowVersionId
            });
            if (!(0, _utils.isDefined)(computedSchema) || Object.keys(computedSchema).length === 0) {
                return step;
            }
            return {
                ...step,
                settings: {
                    ...step.settings,
                    outputSchema: computedSchema
                }
            };
        } catch  {
            // Output schema enrichment is best-effort: if it cannot be computed,
            // validation still runs against the step's existing settings rather
            // than failing the whole validation.
            return step;
        }
    }
    async validateStepTypeRequirements({ workspaceId, steps, trigger }) {
        const issues = [];
        for (const step of steps){
            switch(step.type){
                case _workflow.WorkflowActionType.AI_AGENT:
                    issues.push(...(0, _validateworkflowaiagentsteputil.validateWorkflowAiAgentStep)(step));
                    break;
                case _workflow.WorkflowActionType.CODE:
                case _workflow.WorkflowActionType.HTTP_REQUEST:
                    issues.push(...(0, _validateworkflowruntimeoutputsteputil.validateWorkflowRuntimeOutputStep)(step));
                    break;
                case _workflow.WorkflowActionType.LOGIC_FUNCTION:
                    issues.push(...await this.validateLogicFunctionStep({
                        step,
                        workspaceId
                    }));
                    break;
                case _workflow.WorkflowActionType.ITERATOR:
                    issues.push(...(0, _validateworkflowiteratorsteputil.validateWorkflowIteratorStep)({
                        step,
                        steps,
                        trigger
                    }));
                    break;
            }
        }
        return issues;
    }
    async validateLogicFunctionStep({ step, workspaceId }) {
        const issues = [];
        const declaredOutputSchema = await this.getLogicFunctionDeclaredOutputSchema({
            step,
            workspaceId
        });
        issues.push(...(0, _validateworkflowlogicfunctionoutputschemamismatchutil.validateWorkflowLogicFunctionOutputSchemaMismatch)({
            step,
            declaredOutputSchema
        }));
        if ((0, _hasworkflowstepleveloutputschemautil.hasWorkflowStepLevelOutputSchema)(step)) {
            return issues;
        }
        if ((0, _utils.isDefined)(declaredOutputSchema)) {
            return issues;
        }
        issues.push((0, _buildmissingworkflowoutputschemaissueutil.buildMissingWorkflowOutputSchemaIssue)({
            id: step.id,
            name: step.name
        }));
        return issues;
    }
    async getLogicFunctionDeclaredOutputSchema({ step, workspaceId }) {
        const input = step.settings?.input;
        const logicFunctionId = (0, _guards.isObject)(input) && 'logicFunctionId' in input ? input.logicFunctionId : undefined;
        if (!(0, _guards.isNonEmptyString)(logicFunctionId)) {
            return undefined;
        }
        try {
            const logicFunction = await this.workflowMetadataReadService.getLogicFunctionById({
                logicFunctionId,
                workspaceId
            });
            const declaredInputSchema = logicFunction?.workflowActionTriggerSettings?.outputSchema;
            if (!(0, _guards.isNonEmptyArray)(declaredInputSchema)) {
                return undefined;
            }
            const declaredOutputSchema = (0, _logicfunction.inputSchemaToOutputSchema)(declaredInputSchema);
            if (Object.keys(declaredOutputSchema).length === 0) {
                return undefined;
            }
            return declaredOutputSchema;
        } catch  {
            return undefined;
        }
    }
    async validateWorkspaceMetadata({ workspaceId, steps }) {
        const recordSteps = steps.filter((step)=>OBJECT_TARGETING_ACTION_TYPES.has(step.type));
        if (recordSteps.length === 0) {
            return [];
        }
        const { objectIdByNameSingular, flatFieldMetadataMaps } = await this.workflowMetadataReadService.getFlatEntityMaps(workspaceId);
        const issues = [];
        for (const step of recordSteps){
            const input = step.settings.input;
            const objectName = (0, _guards.isObject)(input) && 'objectName' in input ? input.objectName : undefined;
            if (!(0, _guards.isString)(objectName)) {
                issues.push({
                    severity: 'error',
                    code: 'INVALID_STEP_PARAMS',
                    message: `Step "${step.name ?? step.id}" has an invalid object name.`,
                    stepId: step.id
                });
                continue;
            }
            if (!(0, _utils.isDefined)(objectIdByNameSingular[objectName])) {
                issues.push({
                    severity: 'error',
                    code: 'INVALID_STEP_PARAMS',
                    message: `Step "${step.name ?? step.id}" targets object "${objectName}" which does not exist in this workspace.`,
                    stepId: step.id
                });
                continue;
            }
            if (step.type === _workflow.WorkflowActionType.PICK_RECORD) {
                const loadBalanceError = (0, _getpickrecordloadbalanceconfigerrorutil.getPickRecordLoadBalanceConfigError)({
                    step,
                    objectIdByNameSingular,
                    flatFieldMetadataMaps
                });
                if ((0, _utils.isDefined)(loadBalanceError)) {
                    issues.push({
                        severity: 'error',
                        code: 'INVALID_STEP_PARAMS',
                        message: loadBalanceError,
                        stepId: step.id
                    });
                }
            }
        }
        return issues;
    }
    constructor(workflowCommonWorkspaceService, workflowMetadataReadService, workflowSchemaWorkspaceService){
        this.workflowCommonWorkspaceService = workflowCommonWorkspaceService;
        this.workflowMetadataReadService = workflowMetadataReadService;
        this.workflowSchemaWorkspaceService = workflowSchemaWorkspaceService;
    }
};
WorkflowValidationWorkspaceService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _workflowcommonworkspaceservice.WorkflowCommonWorkspaceService === "undefined" ? Object : _workflowcommonworkspaceservice.WorkflowCommonWorkspaceService,
        typeof _workflowmetadatareadworkspaceservice.WorkflowMetadataReadService === "undefined" ? Object : _workflowmetadatareadworkspaceservice.WorkflowMetadataReadService,
        typeof _workflowschemaworkspaceservice.WorkflowSchemaWorkspaceService === "undefined" ? Object : _workflowschemaworkspaceservice.WorkflowSchemaWorkspaceService
    ])
], WorkflowValidationWorkspaceService);
const mergeValidationResults = (baseResult, additionalIssues)=>{
    const errors = [
        ...baseResult.errors,
        ...additionalIssues.filter((issue)=>issue.severity === 'error')
    ];
    const warnings = [
        ...baseResult.warnings,
        ...additionalIssues.filter((issue)=>issue.severity === 'warning')
    ];
    return {
        valid: errors.length === 0,
        errors,
        warnings
    };
};

//# sourceMappingURL=workflow-validation.workspace-service.js.map