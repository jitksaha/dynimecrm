import { type ValidatableWorkflowStep } from '../../../workflow/validation/types/workflow-validation.type';
export declare const isIfElseStepInput: (step: ValidatableWorkflowStep) => step is ValidatableWorkflowStep & {
    settings: {
        input: Partial<{
            stepFilterGroups: {
                id: string;
                logicalOperator: import("../../../types").StepLogicalOperator;
                parentStepFilterGroupId?: string | undefined;
                positionInStepFilterGroup?: number | undefined;
            }[];
            stepFilters: {
                id: string;
                type: string;
                stepOutputKey: string;
                operand: import("../../../types").ViewFilterOperandDeprecated | import("../../../types").ViewFilterOperand;
                value: string;
                stepFilterGroupId: string;
                positionInStepFilterGroup?: number | undefined;
                fieldMetadataId?: string | undefined;
                compositeFieldSubFieldName?: string | undefined;
            }[];
            branches: {
                id: string;
                nextStepIds: string[];
                filterGroupId?: string | undefined;
            }[];
        }>;
    };
};
//# sourceMappingURL=isIfElseStepInput.d.ts.map