"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "WorkflowToolWorkspaceService", {
    enumerable: true,
    get: function() {
        return WorkflowToolWorkspaceService;
    }
});
const _common = require("@nestjs/common");
const _recordpositionservice = require("../../../../engine/core-modules/record-position/services/record-position.service");
const _workflowversioncoresyncservice = require("../../../../engine/core-modules/workflow/services/workflow-version-core-sync.service");
const _agentservice = require("../../../../engine/metadata-modules/ai/ai-agent/agent.service");
const _workspacemanyorallflatentitymapscacheservice = require("../../../../engine/metadata-modules/flat-entity/services/workspace-many-or-all-flat-entity-maps-cache.service");
const _logicfunctionfromsourceservice = require("../../../../engine/metadata-modules/logic-function/services/logic-function-from-source.service");
const _workspaceormmanager = require("../../../../engine/twenty-orm/workspace-orm.manager");
const _workflowcommonworkspaceservice = require("../../common/workspace-services/workflow-common.workspace-service");
const _workflowschemaworkspaceservice = require("../../workflow-builder/workflow-schema/workflow-schema.workspace-service");
const _workflowvalidationworkspaceservice = require("../../workflow-builder/workflow-validation/workflow-validation.workspace-service");
const _workflowversionedgeworkspaceservice = require("../../workflow-builder/workflow-version-edge/workflow-version-edge.workspace-service");
const _workflowversionstephelpersworkspaceservice = require("../../workflow-builder/workflow-version-step/workflow-version-step-helpers.workspace-service");
const _workflowversionstepworkspaceservice = require("../../workflow-builder/workflow-version-step/workflow-version-step.workspace-service");
const _workflowversionworkspaceservice = require("../../workflow-builder/workflow-version/workflow-version.workspace-service");
const _activateworkflowversiontool = require("../tools/activate-workflow-version.tool");
const _computestepoutputschematool = require("../tools/compute-step-output-schema.tool");
const _createcompleteworkflowtool = require("../tools/create-complete-workflow.tool");
const _createdraftfromworkflowversiontool = require("../tools/create-draft-from-workflow-version.tool");
const _createworkflowversionedgetool = require("../tools/create-workflow-version-edge.tool");
const _createworkflowversionsteptool = require("../tools/create-workflow-version-step.tool");
const _deactivateworkflowversiontool = require("../tools/deactivate-workflow-version.tool");
const _deleteworkflowtool = require("../tools/delete-workflow.tool");
const _deleteworkflowversionedgetool = require("../tools/delete-workflow-version-edge.tool");
const _deleteworkflowversionsteptool = require("../tools/delete-workflow-version-step.tool");
const _getlogicfunctionsourcetool = require("../tools/get-logic-function-source.tool");
const _getworkflowcurrentversiontool = require("../tools/get-workflow-current-version.tool");
const _getworkflowruntool = require("../tools/get-workflow-run.tool");
const _listlogicfunctiontoolstool = require("../tools/list-logic-function-tools.tool");
const _listworkflowrunstool = require("../tools/list-workflow-runs.tool");
const _listworkflowstool = require("../tools/list-workflows.tool");
const _updateagenttool = require("../tools/update-agent.tool");
const _updatelogicfunctionsourcetool = require("../tools/update-logic-function-source.tool");
const _updateworkflowversionpositionstool = require("../tools/update-workflow-version-positions.tool");
const _updateworkflowversionsteptool = require("../tools/update-workflow-version-step.tool");
const _updateworkflowversiontriggertool = require("../tools/update-workflow-version-trigger.tool");
const _validateworkflowtool = require("../tools/validate-workflow.tool");
const _workflowtriggerworkspaceservice = require("../../workflow-trigger/workspace-services/workflow-trigger.workspace-service");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let WorkflowToolWorkspaceService = class WorkflowToolWorkspaceService {
    generateWorkflowTools(workspaceId, rolePermissionConfig) {
        const context = {
            workspaceId
        };
        const contextWithPermissions = {
            workspaceId,
            rolePermissionConfig
        };
        const createCompleteWorkflow = (0, _createcompleteworkflowtool.createCreateCompleteWorkflowTool)(this.deps, contextWithPermissions);
        const createWorkflowVersionStep = (0, _createworkflowversionsteptool.createCreateWorkflowVersionStepTool)(this.deps, context);
        const updateWorkflowVersionStep = (0, _updateworkflowversionsteptool.createUpdateWorkflowVersionStepTool)(this.deps, context);
        const updateWorkflowVersionTrigger = (0, _updateworkflowversiontriggertool.createUpdateWorkflowVersionTriggerTool)(this.deps, context);
        const deleteWorkflowVersionStep = (0, _deleteworkflowversionsteptool.createDeleteWorkflowVersionStepTool)(this.deps, context);
        const createWorkflowVersionEdge = (0, _createworkflowversionedgetool.createCreateWorkflowVersionEdgeTool)(this.deps, context);
        const deleteWorkflowVersionEdge = (0, _deleteworkflowversionedgetool.createDeleteWorkflowVersionEdgeTool)(this.deps, context);
        const createDraftFromWorkflowVersion = (0, _createdraftfromworkflowversiontool.createCreateDraftFromWorkflowVersionTool)(this.deps, context);
        const updateWorkflowVersionPositions = (0, _updateworkflowversionpositionstool.createUpdateWorkflowVersionPositionsTool)(this.deps, context);
        const activateWorkflowVersion = (0, _activateworkflowversiontool.createActivateWorkflowVersionTool)(this.deps, context);
        const deactivateWorkflowVersion = (0, _deactivateworkflowversiontool.createDeactivateWorkflowVersionTool)(this.deps, context);
        const computeStepOutputSchema = (0, _computestepoutputschematool.createComputeStepOutputSchemaTool)(this.deps, context);
        const getWorkflowCurrentVersion = (0, _getworkflowcurrentversiontool.createGetWorkflowCurrentVersionTool)(this.deps, contextWithPermissions);
        const getWorkflowRun = (0, _getworkflowruntool.createGetWorkflowRunTool)(this.deps, contextWithPermissions);
        const listWorkflowRuns = (0, _listworkflowrunstool.createListWorkflowRunsTool)(this.deps, contextWithPermissions);
        const listWorkflows = (0, _listworkflowstool.createListWorkflowsTool)(this.deps, contextWithPermissions);
        const deleteWorkflow = (0, _deleteworkflowtool.createDeleteWorkflowTool)(this.deps, contextWithPermissions);
        const getLogicFunctionSource = (0, _getlogicfunctionsourcetool.createGetLogicFunctionSourceTool)(this.deps, context);
        const updateLogicFunctionSource = (0, _updatelogicfunctionsourcetool.createUpdateLogicFunctionSourceTool)(this.deps, context);
        const listLogicFunctionTools = (0, _listlogicfunctiontoolstool.createListLogicFunctionToolsTool)(this.deps, context);
        const updateAgent = (0, _updateagenttool.createUpdateAgentTool)(this.deps, context);
        const validateWorkflow = (0, _validateworkflowtool.createValidateWorkflowTool)(this.deps, context);
        return {
            [createCompleteWorkflow.name]: createCompleteWorkflow,
            [createWorkflowVersionStep.name]: createWorkflowVersionStep,
            [updateWorkflowVersionStep.name]: updateWorkflowVersionStep,
            [updateWorkflowVersionTrigger.name]: updateWorkflowVersionTrigger,
            [deleteWorkflowVersionStep.name]: deleteWorkflowVersionStep,
            [createWorkflowVersionEdge.name]: createWorkflowVersionEdge,
            [deleteWorkflowVersionEdge.name]: deleteWorkflowVersionEdge,
            [createDraftFromWorkflowVersion.name]: createDraftFromWorkflowVersion,
            [updateWorkflowVersionPositions.name]: updateWorkflowVersionPositions,
            [activateWorkflowVersion.name]: activateWorkflowVersion,
            [deactivateWorkflowVersion.name]: deactivateWorkflowVersion,
            [computeStepOutputSchema.name]: computeStepOutputSchema,
            [getWorkflowCurrentVersion.name]: getWorkflowCurrentVersion,
            [listWorkflows.name]: listWorkflows,
            [deleteWorkflow.name]: deleteWorkflow,
            [getWorkflowRun.name]: getWorkflowRun,
            [listWorkflowRuns.name]: listWorkflowRuns,
            [getLogicFunctionSource.name]: getLogicFunctionSource,
            [updateLogicFunctionSource.name]: updateLogicFunctionSource,
            [listLogicFunctionTools.name]: listLogicFunctionTools,
            [updateAgent.name]: updateAgent,
            [validateWorkflow.name]: validateWorkflow
        };
    }
    constructor(workflowVersionStepService, workflowVersionStepHelpersService, workflowVersionEdgeService, workflowVersionService, workflowTriggerService, workflowSchemaService, workflowValidationService, workspaceOrmManager, recordPositionService, logicFunctionFromSourceService, flatEntityMapsCacheService, agentService, workflowCommonService, workflowVersionCoreSyncService){
        this.deps = {
            workflowVersionStepService,
            workflowVersionStepHelpersService,
            workflowVersionEdgeService,
            workflowVersionService,
            workflowTriggerService,
            workflowSchemaService,
            workflowValidationService,
            workspaceOrmManager,
            recordPositionService,
            logicFunctionFromSourceService,
            flatEntityMapsCacheService,
            agentService,
            workflowCommonService,
            workflowVersionCoreSyncService
        };
    }
};
WorkflowToolWorkspaceService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _workflowversionstepworkspaceservice.WorkflowVersionStepWorkspaceService === "undefined" ? Object : _workflowversionstepworkspaceservice.WorkflowVersionStepWorkspaceService,
        typeof _workflowversionstephelpersworkspaceservice.WorkflowVersionStepHelpersWorkspaceService === "undefined" ? Object : _workflowversionstephelpersworkspaceservice.WorkflowVersionStepHelpersWorkspaceService,
        typeof _workflowversionedgeworkspaceservice.WorkflowVersionEdgeWorkspaceService === "undefined" ? Object : _workflowversionedgeworkspaceservice.WorkflowVersionEdgeWorkspaceService,
        typeof _workflowversionworkspaceservice.WorkflowVersionWorkspaceService === "undefined" ? Object : _workflowversionworkspaceservice.WorkflowVersionWorkspaceService,
        typeof _workflowtriggerworkspaceservice.WorkflowTriggerWorkspaceService === "undefined" ? Object : _workflowtriggerworkspaceservice.WorkflowTriggerWorkspaceService,
        typeof _workflowschemaworkspaceservice.WorkflowSchemaWorkspaceService === "undefined" ? Object : _workflowschemaworkspaceservice.WorkflowSchemaWorkspaceService,
        typeof _workflowvalidationworkspaceservice.WorkflowValidationWorkspaceService === "undefined" ? Object : _workflowvalidationworkspaceservice.WorkflowValidationWorkspaceService,
        typeof _workspaceormmanager.WorkspaceOrmManager === "undefined" ? Object : _workspaceormmanager.WorkspaceOrmManager,
        typeof _recordpositionservice.RecordPositionService === "undefined" ? Object : _recordpositionservice.RecordPositionService,
        typeof _logicfunctionfromsourceservice.LogicFunctionFromSourceService === "undefined" ? Object : _logicfunctionfromsourceservice.LogicFunctionFromSourceService,
        typeof _workspacemanyorallflatentitymapscacheservice.WorkspaceManyOrAllFlatEntityMapsCacheService === "undefined" ? Object : _workspacemanyorallflatentitymapscacheservice.WorkspaceManyOrAllFlatEntityMapsCacheService,
        typeof _agentservice.AgentService === "undefined" ? Object : _agentservice.AgentService,
        typeof _workflowcommonworkspaceservice.WorkflowCommonWorkspaceService === "undefined" ? Object : _workflowcommonworkspaceservice.WorkflowCommonWorkspaceService,
        typeof _workflowversioncoresyncservice.WorkflowVersionCoreSyncService === "undefined" ? Object : _workflowversioncoresyncservice.WorkflowVersionCoreSyncService
    ])
], WorkflowToolWorkspaceService);

//# sourceMappingURL=workflow-tool.workspace-service.js.map