export type ResolvedVariable = {
    found: boolean;
    type?: string;
    label?: string;
};
export declare const resolveInSchema: (schema: unknown, segments: string[]) => ResolvedVariable;
export declare const resolveVariablePathInOutputSchema: ({ schema, propertyPath, }: {
    schema: unknown;
    propertyPath: string[];
}) => ResolvedVariable;
export declare const collectOutputSchemaVariablePaths: (schema: unknown) => string[];
//# sourceMappingURL=resolve-variable-path-in-output-schema.d.ts.map