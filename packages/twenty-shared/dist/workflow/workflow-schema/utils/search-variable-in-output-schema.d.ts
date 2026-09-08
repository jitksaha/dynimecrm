import { type RecordOutputSchemaV2, type VariableSearchResult } from '../types/output-schema.type';
export declare const searchRecordOutputSchema: ({ stepName, recordOutputSchema, path, selectedField, isFullRecord, stepNameLabel, }: {
    stepName: string;
    recordOutputSchema: RecordOutputSchemaV2;
    path: string[];
    selectedField: string;
    isFullRecord: boolean;
    stepNameLabel?: string | undefined;
}) => VariableSearchResult;
export declare const searchVariableInOutputSchema: ({ schema, stepType, stepName, rawVariableName, isFullRecord, stepNameLabel, }: {
    schema: unknown;
    stepType: string;
    stepName: string;
    rawVariableName: string;
    isFullRecord: boolean;
    stepNameLabel?: string | undefined;
}) => VariableSearchResult;
//# sourceMappingURL=search-variable-in-output-schema.d.ts.map