"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "validateStandardMetadataUpdateCount", {
    enumerable: true,
    get: function() {
        return validateStandardMetadataUpdateCount;
    }
});
const validateStandardMetadataUpdateCount = ({ actualCount, expectedCount, logger, metadataLabel, workspaceId })=>{
    if (actualCount > expectedCount) {
        throw new Error(`Expected at most ${expectedCount} ${metadataLabel} for workspace ${workspaceId}, updated ${actualCount}`);
    }
    if (actualCount < expectedCount) {
        logger.warn(`Expected ${expectedCount} ${metadataLabel} for workspace ${workspaceId}, updated ${actualCount}; continuing because standard metadata can be absent on older workspaces`);
    }
};

//# sourceMappingURL=validate-standard-metadata-update-count.util.js.map