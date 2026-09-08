"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "computeDashboardIdentifierMaps", {
    enumerable: true,
    get: function() {
        return computeDashboardIdentifierMaps;
    }
});
const _buildfieldidbynamemapsutil = require("../../../../engine/metadata-modules/flat-field-metadata/utils/build-field-id-by-name-maps.util");
const _buildobjectidbynamemapsutil = require("../../../../engine/metadata-modules/flat-object-metadata/utils/build-object-id-by-name-maps.util");
const computeDashboardIdentifierMaps = async (deps, context)=>{
    const { flatObjectMetadataMaps, flatFieldMetadataMaps } = await deps.flatEntityMapsCacheService.getOrRecomputeManyOrAllFlatEntityMaps({
        workspaceId: context.workspaceId,
        flatMapsKeys: [
            'flatObjectMetadataMaps',
            'flatFieldMetadataMaps'
        ]
    });
    const { idByNameSingular, idByNamePlural } = (0, _buildobjectidbynamemapsutil.buildObjectIdByNameMaps)(flatObjectMetadataMaps);
    const { fieldIdByObjectIdAndName, fieldById } = (0, _buildfieldidbynamemapsutil.buildFieldIdByNameMaps)(flatFieldMetadataMaps);
    return {
        objectIdByName: {
            ...idByNamePlural,
            ...idByNameSingular
        },
        fieldIdByObjectIdAndName,
        fieldById
    };
};

//# sourceMappingURL=compute-dashboard-identifier-maps.util.js.map