import { type BaseOutputSchemaV2, type Leaf, type Node } from '../types/base-output-schema.type';
export declare const isFlattenedArrayOutputSchema: (schema: BaseOutputSchemaV2 | undefined) => boolean;
export declare const getCurrentItemSchemaFromFlattenedArrayOutputSchema: ({ schema, label, }: {
    schema: BaseOutputSchemaV2;
    label?: string | undefined;
}) => Leaf | Node | undefined;
//# sourceMappingURL=flattened-array-output-schema.d.ts.map