"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "getApplicationSubAllFlatEntityMaps", {
    enumerable: true,
    get: function() {
        return getApplicationSubAllFlatEntityMaps;
    }
});
const _metadata = require("twenty-shared/metadata");
const _getsuballflatentitymapsbyapplicationidsorthrowutil = require("../../../../metadata-modules/flat-entity/utils/get-sub-all-flat-entity-maps-by-application-ids-or-throw.util");
const getApplicationSubAllFlatEntityMaps = ({ applicationIds, fromAllFlatEntityMaps })=>(0, _getsuballflatentitymapsbyapplicationidsorthrowutil.getSubAllFlatEntityMapsByApplicationIdsOrThrow)({
        applicationIds,
        metadataNames: Object.values(_metadata.ALL_METADATA_NAME),
        fromAllFlatEntityMaps
    });

//# sourceMappingURL=get-application-sub-all-flat-entity-maps.util.js.map