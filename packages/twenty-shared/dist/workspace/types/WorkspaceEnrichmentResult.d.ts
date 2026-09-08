export type WorkspaceEnrichmentResult<TEnrichment> = {
    outcome: 'matched';
    enrichment: TEnrichment;
} | {
    outcome: 'unavailable' | 'transientError';
    enrichment: null;
};
//# sourceMappingURL=WorkspaceEnrichmentResult.d.ts.map