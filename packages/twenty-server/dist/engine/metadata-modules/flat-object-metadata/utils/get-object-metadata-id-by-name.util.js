"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "getObjectMetadataIdByName", {
    enumerable: true,
    get: function() {
        return getObjectMetadataIdByName;
    }
});
const _buildobjectidbynamemapsutil = require("./build-object-id-by-name-maps.util");
const getObjectMetadataIdByName = ({ flatObjectMetadataMaps, objectName })=>{
    const { idByNameSingular, idByNamePlural } = (0, _buildobjectidbynamemapsutil.buildObjectIdByNameMaps)(flatObjectMetadataMaps);
    return idByNameSingular[objectName] ?? idByNamePlural[objectName];
};

//# sourceMappingURL=get-object-metadata-id-by-name.util.js.map