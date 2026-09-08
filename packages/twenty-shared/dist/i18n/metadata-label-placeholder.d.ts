export declare const METADATA_LABEL_PLACEHOLDER_NAMES: readonly ["objectLabel", "objectLabelSingular", "objectLabelPlural", "objectIcon"];
export type MetadataLabelPlaceholderName = (typeof METADATA_LABEL_PLACEHOLDER_NAMES)[number];
export declare const OBJECT_METADATA_LABEL_PLACEHOLDER_NAMES: readonly ["objectLabelSingular", "objectLabelPlural", "objectIcon"];
export type MetadataLabelPlaceholderValues = Partial<Record<MetadataLabelPlaceholderName, string>>;
export declare const getMetadataLabelPlaceholder: (name: "objectIcon" | "objectLabel" | "objectLabelPlural" | "objectLabelSingular") => string;
export declare const METADATA_LABEL_PLACEHOLDER_PASS_THROUGH: Record<MetadataLabelPlaceholderName, string>;
export declare const buildObjectMetadataLabelPlaceholderValues: ({ label, labelSingular, labelPlural, icon, }: {
    label?: string | null | undefined;
    labelSingular?: string | null | undefined;
    labelPlural?: string | null | undefined;
    icon?: string | null | undefined;
}) => Partial<Record<"objectIcon" | "objectLabel" | "objectLabelPlural" | "objectLabelSingular", string>>;
export declare const hasObjectMetadataLabelPlaceholder: (message: string) => boolean;
//# sourceMappingURL=metadata-label-placeholder.d.ts.map