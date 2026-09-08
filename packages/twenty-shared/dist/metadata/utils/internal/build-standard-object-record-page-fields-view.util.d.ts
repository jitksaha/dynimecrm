type StandardUniversalIdentifierHolder = {
    universalIdentifier: string;
};
export declare const buildStandardObjectRecordPageFieldsView: <const TViewFieldName extends string, const TViewFieldGroupName extends string>({ objectUniversalIdentifier, fields, viewFieldNames, viewFieldGroupNames, }: {
    objectUniversalIdentifier: string;
    fields: Record<string, StandardUniversalIdentifierHolder>;
    viewFieldNames: readonly TViewFieldName[];
    viewFieldGroupNames: Record<TViewFieldGroupName, string>;
}) => {
    universalIdentifier: string;
    viewFields: Record<TViewFieldName, StandardUniversalIdentifierHolder>;
    viewFieldGroups: Record<TViewFieldGroupName, StandardUniversalIdentifierHolder>;
};
export {};
//# sourceMappingURL=build-standard-object-record-page-fields-view.util.d.ts.map