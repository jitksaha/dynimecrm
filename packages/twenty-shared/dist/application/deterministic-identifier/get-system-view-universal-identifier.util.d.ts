export declare const SYSTEM_VIEW_KEYS: {
    readonly INDEX: "INDEX";
    readonly FIELDS_WIDGET: "FIELDS_WIDGET";
};
export type SystemViewKey = (typeof SYSTEM_VIEW_KEYS)[keyof typeof SYSTEM_VIEW_KEYS];
export declare const getSystemViewUniversalIdentifier: ({ objectMetadataApplicationUniversalIdentifier, objectUniversalIdentifier, viewKey, }: {
    objectMetadataApplicationUniversalIdentifier: string;
    objectUniversalIdentifier: string;
    viewKey: SystemViewKey;
}) => string;
//# sourceMappingURL=get-system-view-universal-identifier.util.d.ts.map