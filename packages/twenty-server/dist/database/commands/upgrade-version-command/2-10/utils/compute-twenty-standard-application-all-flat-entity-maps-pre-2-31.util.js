"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "computeTwentyStandardApplicationAllFlatEntityMapsPre231", {
    enumerable: true,
    get: function() {
        return computeTwentyStandardApplicationAllFlatEntityMapsPre231;
    }
});
const _remaprecordpageuniversalidentifierstopre231util = require("./remap-record-page-universal-identifiers-to-pre-2-31.util");
const _twentystandardapplicationallflatentitymapsconstant = require("../../../../../engine/workspace-manager/twenty-standard-application/utils/twenty-standard-application-all-flat-entity-maps.constant");
const computeTwentyStandardApplicationAllFlatEntityMapsPre231 = (args)=>{
    const { allFlatEntityMaps } = (0, _twentystandardapplicationallflatentitymapsconstant.computeTwentyStandardApplicationAllFlatEntityMaps)(args);
    return (0, _remaprecordpageuniversalidentifierstopre231util.remapRecordPageUniversalIdentifiersToPre231)(allFlatEntityMaps);
};

//# sourceMappingURL=compute-twenty-standard-application-all-flat-entity-maps-pre-2-31.util.js.map