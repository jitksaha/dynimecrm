export declare const APPLICATION_CATEGORIES: readonly ["Communication", "Productivity", "Product management", "Sales", "Marketing", "Enrichment", "Data", "Search", "Other"];
export type KnownApplicationCategory = (typeof APPLICATION_CATEGORIES)[number];
export type ApplicationCategory = KnownApplicationCategory | (string & {});
export declare const isKnownApplicationCategory: (category: string) => category is "Communication" | "Data" | "Enrichment" | "Marketing" | "Other" | "Product management" | "Productivity" | "Sales" | "Search";
//# sourceMappingURL=applicationCategoryType.d.ts.map