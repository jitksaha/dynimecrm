import { type ValidatableWorkflow, type ValidatableWorkflowStep, type WorkflowValidationIssue } from '../../../workflow/validation/types/workflow-validation.type';
import { type WorkflowGraph } from '../../../workflow/validation/utils/build-workflow-graph.util';
export declare const validateWorkflowVariableReferences: ({ workflow, graph, stepsById, }: {
    workflow: ValidatableWorkflow;
    graph: WorkflowGraph;
    stepsById: Map<string, ValidatableWorkflowStep>;
}) => WorkflowValidationIssue[];
//# sourceMappingURL=validate-workflow-variable-references.util.d.ts.map