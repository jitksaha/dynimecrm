type RecordObjectSchema = {
    type?: string;
    objectUniversalIdentifier?: string;
};
export declare const isRecordObjectSchema: <TSchema extends RecordObjectSchema>(schema: TSchema | null | undefined) => schema is TSchema & {
    objectUniversalIdentifier: string;
};
export {};
//# sourceMappingURL=is-record-object-schema.d.ts.map