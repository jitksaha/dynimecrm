"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "fromFieldMetadataEntityToOrmFlatFieldMetadata", {
    enumerable: true,
    get: function() {
        return fromFieldMetadataEntityToOrmFlatFieldMetadata;
    }
});
const _ormflatfieldmetadatatype = require("../types/orm-flat-field-metadata.type");
const fromFieldMetadataEntityToOrmFlatFieldMetadata = ({ entity, isUnique })=>{
    return Object.fromEntries(_ormflatfieldmetadatatype.ORM_FLAT_FIELD_METADATA_KEYS.map((key)=>[
            key,
            key === 'isUnique' ? isUnique : entity[key]
        ]));
};

//# sourceMappingURL=from-field-metadata-entity-to-orm-flat-field-metadata.util.js.map