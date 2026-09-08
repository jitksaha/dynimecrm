"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "ALL_WORKSPACE_CACHE_ENTITY_BY_NAME", {
    enumerable: true,
    get: function() {
        return ALL_WORKSPACE_CACHE_ENTITY_BY_NAME;
    }
});
const _apikeyentity = require("../../core-modules/api-key/api-key.entity");
const _applicationentity = require("../../core-modules/application/application.entity");
const _featureflagentity = require("../../core-modules/feature-flag/feature-flag.entity");
const _usagelimitentity = require("../../core-modules/usage-limit/usage-limit.entity");
const _allmetadataentitybymetadatanameconstant = require("../../metadata-modules/flat-entity/constant/all-metadata-entity-by-metadata-name.constant");
const _indexfieldmetadataentity = require("../../metadata-modules/index-metadata/index-field-metadata.entity");
const ALL_WORKSPACE_CACHE_ENTITY_BY_NAME = {
    ..._allmetadataentitybymetadatanameconstant.ALL_METADATA_ENTITY_BY_METADATA_NAME,
    application: _applicationentity.ApplicationEntity,
    indexFieldMetadata: _indexfieldmetadataentity.IndexFieldMetadataEntity,
    apiKey: _apikeyentity.ApiKeyEntity,
    featureFlag: _featureflagentity.FeatureFlagEntity,
    usageLimit: _usagelimitentity.UsageLimitEntity
};

//# sourceMappingURL=all-workspace-cache-entity-by-name.constant.js.map