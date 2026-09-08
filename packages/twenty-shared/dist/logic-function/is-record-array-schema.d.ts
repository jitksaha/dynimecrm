type RecordArraySchema = {
    type?: string;
    objectUniversalIdentifier?: string;
    items?: {
        type?: string;
        objectUniversalIdentifier?: string;
    } | null;
};
export declare const isRecordArraySchema: (schema: RecordArraySchema | null | undefined) => boolean;
export {};
//# sourceMappingURL=is-record-array-schema.d.ts.map