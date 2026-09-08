type StandardViewFieldUniversalIdentifier = {
    universalIdentifier: string;
};
export declare const buildStandardObjectIndexView: <const TViewFieldName extends string>({ objectUniversalIdentifier, fields, viewFieldNames, }: {
    objectUniversalIdentifier: string;
    fields: Record<string, StandardViewFieldUniversalIdentifier>;
    viewFieldNames: readonly TViewFieldName[];
}) => {
    universalIdentifier: string;
    viewFields: Record<TViewFieldName, StandardViewFieldUniversalIdentifier>;
};
export {};
//# sourceMappingURL=build-standard-object-index-view.util.d.ts.map