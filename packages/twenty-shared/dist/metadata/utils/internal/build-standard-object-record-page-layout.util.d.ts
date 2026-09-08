type RecordPageLayoutTabsSpec = Record<string, {
    title: string;
    widgets: Record<string, string>;
}>;
export declare const buildStandardObjectRecordPageLayout: <const TTabs extends RecordPageLayoutTabsSpec>({ objectUniversalIdentifier, tabs, }: {
    objectUniversalIdentifier: string;
    tabs: TTabs;
}) => {
    universalIdentifier: string;
    tabs: { [TTabKey in keyof TTabs]: {
        universalIdentifier: string;
        widgets: { [TWidgetKey in keyof TTabs[TTabKey]["widgets"]]: {
            universalIdentifier: string;
        }; };
    }; };
};
export {};
//# sourceMappingURL=build-standard-object-record-page-layout.util.d.ts.map