import { type ValidatableWorkflowStep } from '../../../workflow/validation/types/workflow-validation.type';
export declare const isIteratorStepInput: (step: ValidatableWorkflowStep) => step is ValidatableWorkflowStep & {
    settings: {
        input: Partial<{
            items?: string | any[] | undefined;
            initialLoopStepIds?: string[] | undefined;
            shouldContinueOnIterationFailure?: boolean | undefined;
        }>;
    };
};
//# sourceMappingURL=isIteratorStepInput.d.ts.map