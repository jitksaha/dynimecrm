"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "orderFlatFieldMetadatasForSystemIndexView", {
    enumerable: true,
    get: function() {
        return orderFlatFieldMetadatasForSystemIndexView;
    }
});
const orderFlatFieldMetadatasForSystemIndexView = ({ flatFieldMetadatas, labelIdentifierFieldMetadataUniversalIdentifier })=>[
        ...flatFieldMetadatas.filter((flatFieldMetadata)=>flatFieldMetadata.universalIdentifier === labelIdentifierFieldMetadataUniversalIdentifier),
        ...flatFieldMetadatas.filter((flatFieldMetadata)=>flatFieldMetadata.universalIdentifier !== labelIdentifierFieldMetadataUniversalIdentifier)
    ];

//# sourceMappingURL=order-flat-field-metadatas-for-system-index-view.util.js.map