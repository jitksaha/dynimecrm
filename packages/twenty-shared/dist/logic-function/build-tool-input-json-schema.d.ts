import { type InputJsonSchema } from '../logic-function/input-json-schema.type';
type ResolveObjectLabel = (objectUniversalIdentifier: string) => string | undefined;
export declare const buildToolInputJsonSchema: (jsonSchema: InputJsonSchema, resolveObjectLabel?: ResolveObjectLabel | undefined) => InputJsonSchema;
export {};
//# sourceMappingURL=build-tool-input-json-schema.d.ts.map