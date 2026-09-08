"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "computeRecordPageReconcileFlatEntityMapsKeys", {
    enumerable: true,
    get: function() {
        return computeRecordPageReconcileFlatEntityMapsKeys;
    }
});
const _getmetadataflatentitymapskeyutil = require("../../../../../engine/metadata-modules/flat-entity/utils/get-metadata-flat-entity-maps-key.util");
const _getmetadatarelatedmetadatanamesutil = require("../../../../../engine/metadata-modules/flat-entity/utils/get-metadata-related-metadata-names.util");
const computeRecordPageReconcileFlatEntityMapsKeys = ()=>{
    const reconciledMetadataRelatedNames = [
        'view',
        ...(0, _getmetadatarelatedmetadatanamesutil.getMetadataRelatedMetadataNames)('view'),
        'viewField',
        ...(0, _getmetadatarelatedmetadatanamesutil.getMetadataRelatedMetadataNames)('viewField'),
        'viewFieldGroup',
        ...(0, _getmetadatarelatedmetadatanamesutil.getMetadataRelatedMetadataNames)('viewFieldGroup'),
        'pageLayout',
        ...(0, _getmetadatarelatedmetadatanamesutil.getMetadataRelatedMetadataNames)('pageLayout'),
        'pageLayoutTab',
        ...(0, _getmetadatarelatedmetadatanamesutil.getMetadataRelatedMetadataNames)('pageLayoutTab'),
        'pageLayoutWidget',
        ...(0, _getmetadatarelatedmetadatanamesutil.getMetadataRelatedMetadataNames)('pageLayoutWidget')
    ];
    return [
        ...new Set(reconciledMetadataRelatedNames.map(_getmetadataflatentitymapskeyutil.getMetadataFlatEntityMapsKey))
    ];
};

//# sourceMappingURL=compute-record-page-reconcile-flat-entity-maps-keys.util.js.map