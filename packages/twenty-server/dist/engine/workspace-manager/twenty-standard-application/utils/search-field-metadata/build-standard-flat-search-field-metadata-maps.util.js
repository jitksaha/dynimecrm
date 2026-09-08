"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "buildStandardFlatSearchFieldMetadataMaps", {
    enumerable: true,
    get: function() {
        return buildStandardFlatSearchFieldMetadataMaps;
    }
});
const _createemptyflatentitymapsconstant = require("../../../../metadata-modules/flat-entity/constant/create-empty-flat-entity-maps.constant");
const _addflatentitytoflatentitymapsorthrowutil = require("../../../../metadata-modules/flat-entity/utils/add-flat-entity-to-flat-entity-maps-or-throw.util");
const _searchfieldsbystandardobjectnameconstant = require("../../constants/search-fields-by-standard-object-name.constant");
const _buildstandardflatsearchfieldmetadatasutil = require("./build-standard-flat-search-field-metadatas.util");
const buildStandardFlatSearchFieldMetadataMaps = (args)=>{
    const allSearchFieldMetadatas = Object.keys(_searchfieldsbystandardobjectnameconstant.SEARCH_FIELDS_BY_STANDARD_OBJECT_NAME).flatMap((objectName)=>(0, _buildstandardflatsearchfieldmetadatasutil.buildStandardFlatSearchFieldMetadatas)({
            ...args,
            objectName,
            searchFields: _searchfieldsbystandardobjectnameconstant.SEARCH_FIELDS_BY_STANDARD_OBJECT_NAME[objectName]
        }));
    let flatSearchFieldMetadataMaps = (0, _createemptyflatentitymapsconstant.createEmptyFlatEntityMaps)();
    for (const searchFieldMetadata of allSearchFieldMetadatas){
        flatSearchFieldMetadataMaps = (0, _addflatentitytoflatentitymapsorthrowutil.addFlatEntityToFlatEntityMapsOrThrow)({
            flatEntity: searchFieldMetadata,
            flatEntityMaps: flatSearchFieldMetadataMaps
        });
    }
    return flatSearchFieldMetadataMaps;
};

//# sourceMappingURL=build-standard-flat-search-field-metadata-maps.util.js.map