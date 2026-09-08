export declare const TRANSLATABLE_PROPERTIES_BY_METADATA_NAME: {
    readonly objectMetadata: readonly ["labelSingular", "labelPlural", "description"];
    readonly fieldMetadata: readonly ["label", "description"];
    readonly view: readonly ["name"];
    readonly viewFieldGroup: readonly ["name"];
    readonly pageLayout: readonly ["name"];
    readonly pageLayoutTab: readonly ["title"];
    readonly pageLayoutWidget: readonly ["title"];
    readonly commandMenuItem: readonly ["label", "shortLabel"];
    readonly navigationMenuItem: readonly ["name"];
    readonly timelineActivityType: readonly ["label"];
};
export type TranslatableMetadataName = keyof typeof TRANSLATABLE_PROPERTIES_BY_METADATA_NAME;
export type TranslatablePropertyName<T extends TranslatableMetadataName> = (typeof TRANSLATABLE_PROPERTIES_BY_METADATA_NAME)[T][number];
//# sourceMappingURL=translatable-properties-by-metadata-name.d.ts.map