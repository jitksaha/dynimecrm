"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "computeDefaultViewFieldPositionByFieldUniversalIdentifier", {
    enumerable: true,
    get: function() {
        return computeDefaultViewFieldPositionByFieldUniversalIdentifier;
    }
});
const _isflatfieldmetadatadisplayableindefaultviewutil = require("../../../object-metadata/utils/is-flat-field-metadata-displayable-in-default-view.util");
const _orderflatfieldmetadatasforsystemindexviewutil = require("../../../object-metadata/utils/order-flat-field-metadatas-for-system-index-view.util");
const computeDefaultViewFieldPositionByFieldUniversalIdentifier = ({ systemFlatFieldMetadatas, callerFlatFieldMetadatas, labelIdentifierFieldMetadataUniversalIdentifier, labelIdentifierPolicy })=>{
    const displayableSystemFlatFieldMetadatas = systemFlatFieldMetadatas.filter((flatFieldMetadata)=>(0, _isflatfieldmetadatadisplayableindefaultviewutil.isFlatFieldMetadataDisplayableInDefaultView)({
            flatFieldMetadata,
            labelIdentifierFieldMetadataUniversalIdentifier
        }));
    const flatFieldMetadatas = [
        ...callerFlatFieldMetadatas,
        ...displayableSystemFlatFieldMetadatas
    ];
    const orderedFlatFieldMetadatas = labelIdentifierPolicy === 'displayedFirst' ? (0, _orderflatfieldmetadatasforsystemindexviewutil.orderFlatFieldMetadatasForSystemIndexView)({
        labelIdentifierFieldMetadataUniversalIdentifier,
        flatFieldMetadatas
    }) : flatFieldMetadatas.filter((flatFieldMetadata)=>flatFieldMetadata.universalIdentifier !== labelIdentifierFieldMetadataUniversalIdentifier);
    return new Map(orderedFlatFieldMetadatas.map((flatFieldMetadata, position)=>[
            flatFieldMetadata.universalIdentifier,
            position
        ]));
};

//# sourceMappingURL=compute-default-view-field-position-by-field-universal-identifier.util.js.map