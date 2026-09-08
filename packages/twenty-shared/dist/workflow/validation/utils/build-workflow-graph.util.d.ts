import { type ValidatableWorkflow } from '../../../workflow/validation/types/workflow-validation.type';
export type WorkflowGraph = {
    childrenByStepId: Map<string, string[]>;
    reachableFromTrigger: Set<string>;
    ancestorsByStepId: Map<string, Set<string>>;
};
export declare const buildWorkflowGraph: ({ trigger, steps, }: ValidatableWorkflow) => WorkflowGraph;
//# sourceMappingURL=build-workflow-graph.util.d.ts.map