"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "buildReservedSystemFlatFieldMetadatasForCustomObject", {
    enumerable: true,
    get: function() {
        return buildReservedSystemFlatFieldMetadatasForCustomObject;
    }
});
const _application = require("twenty-shared/application");
const _partialsystemflatfieldmetadatasconstant = require("../constants/partial-system-flat-field-metadatas.constant");
const buildReservedSystemFlatFieldMetadatasForCustomObject = ({ flatObjectMetadata: { applicationUniversalIdentifier, universalIdentifier: objectMetadataUniversalIdentifier } })=>{
    const now = new Date().toISOString();
    const { createdAt, createdBy, deletedAt, id, position, updatedAt, updatedBy } = _partialsystemflatfieldmetadatasconstant.PARTIAL_SYSTEM_FLAT_FIELD_METADATAS;
    const computeFieldUniversalIdentifier = (name)=>(0, _application.getFieldUniversalIdentifier)({
            applicationUniversalIdentifier,
            objectUniversalIdentifier: objectMetadataUniversalIdentifier,
            name
        });
    return {
        id: {
            ...id,
            universalIdentifier: computeFieldUniversalIdentifier(id.name),
            applicationUniversalIdentifier,
            objectMetadataUniversalIdentifier,
            createdAt: now,
            updatedAt: now
        },
        createdAt: {
            ...createdAt,
            universalIdentifier: computeFieldUniversalIdentifier(createdAt.name),
            applicationUniversalIdentifier,
            objectMetadataUniversalIdentifier,
            createdAt: now,
            updatedAt: now
        },
        createdBy: {
            ...createdBy,
            universalIdentifier: computeFieldUniversalIdentifier(createdBy.name),
            applicationUniversalIdentifier,
            objectMetadataUniversalIdentifier,
            createdAt: now,
            updatedAt: now
        },
        deletedAt: {
            ...deletedAt,
            universalIdentifier: computeFieldUniversalIdentifier(deletedAt.name),
            applicationUniversalIdentifier,
            objectMetadataUniversalIdentifier,
            createdAt: now,
            updatedAt: now
        },
        position: {
            ...position,
            universalIdentifier: computeFieldUniversalIdentifier(position.name),
            applicationUniversalIdentifier,
            objectMetadataUniversalIdentifier,
            createdAt: now,
            updatedAt: now
        },
        updatedAt: {
            ...updatedAt,
            universalIdentifier: computeFieldUniversalIdentifier(updatedAt.name),
            applicationUniversalIdentifier,
            objectMetadataUniversalIdentifier,
            createdAt: now,
            updatedAt: now
        },
        updatedBy: {
            ...updatedBy,
            universalIdentifier: computeFieldUniversalIdentifier(updatedBy.name),
            applicationUniversalIdentifier,
            objectMetadataUniversalIdentifier,
            createdAt: now,
            updatedAt: now
        }
    };
};

//# sourceMappingURL=build-reserved-system-flat-field-metadatas-for-custom-object.util.js.map