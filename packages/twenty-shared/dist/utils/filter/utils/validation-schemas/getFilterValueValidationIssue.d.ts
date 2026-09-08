import { type FieldMetadataType, type FilterableAndTSVectorFieldType, type ViewFilterOperand } from '../../../../types';
export type FilterValueValidationIssue = {
    stringifiedValue: string;
    operand: ViewFilterOperand;
    filterType: FilterableAndTSVectorFieldType;
    hint: string;
};
export declare const getFilterValueValidationIssue: ({ fieldType, operand, subFieldName, value, }: {
    fieldType: FieldMetadataType;
    operand: ViewFilterOperand;
    subFieldName?: string | null | undefined;
    value: unknown;
}) => FilterValueValidationIssue | undefined;
//# sourceMappingURL=getFilterValueValidationIssue.d.ts.map