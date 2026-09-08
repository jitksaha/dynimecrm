import { type BaseOutputSchemaV2 } from '../../../workflow/workflow-schema/types/base-output-schema.type';
export type OutputSchemaPathFailure = {
    validPrefix: string[];
    failedSegment: string;
    availableKeys: string[];
};
export declare const findOutputSchemaPathFailure: ({ schema, propertyPath, }: {
    schema: BaseOutputSchemaV2;
    propertyPath: string[];
}) => OutputSchemaPathFailure | undefined;
//# sourceMappingURL=find-output-schema-path-failure.d.ts.map