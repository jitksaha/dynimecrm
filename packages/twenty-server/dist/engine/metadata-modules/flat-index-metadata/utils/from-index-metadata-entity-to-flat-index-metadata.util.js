"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "fromIndexMetadataEntityToFlatIndexMetadata", {
    enumerable: true,
    get: function() {
        return fromIndexMetadataEntityToFlatIndexMetadata;
    }
});
const _utils = require("twenty-shared/utils");
const _flatentitymapsexception = require("../../flat-entity/exceptions/flat-entity-maps.exception");
const _fromentitytoscalarentityutil = require("../../flat-entity/utils/from-entity-to-scalar-entity.util");
const _resolvemanytoonerelationidstouniversalidentifiersutil = require("../../../workspace-manager/workspace-migration/universal-flat-entity/utils/resolve-many-to-one-relation-ids-to-universal-identifiers.util");
const fromIndexMetadataEntityToFlatIndexMetadata = (args)=>{
    const { entity: indexMetadataEntity, fieldMetadataIdToUniversalIdentifierMap } = args;
    const indexMetadataScalarEntity = (0, _fromentitytoscalarentityutil.fromEntityToScalarEntity)({
        metadataName: 'index',
        entity: indexMetadataEntity
    });
    const relationUniversalIdentifiers = (0, _resolvemanytoonerelationidstouniversalidentifiersutil.resolveManyToOneRelationIdsToUniversalIdentifiers)({
        metadataName: 'index',
        ...args
    });
    return {
        ...indexMetadataScalarEntity,
        ...relationUniversalIdentifiers,
        flatIndexFieldMetadatas: indexMetadataEntity.indexFieldMetadatas.map((indexFieldMetadata)=>({
                ...(0, _utils.removePropertiesFromRecord)(indexFieldMetadata, [
                    'indexMetadata',
                    'fieldMetadata'
                ]),
                createdAt: indexFieldMetadata.createdAt.toISOString(),
                updatedAt: indexFieldMetadata.updatedAt.toISOString(),
                workspaceId: indexFieldMetadata.workspaceId
            })),
        universalFlatIndexFieldMetadatas: indexMetadataEntity.indexFieldMetadatas.map((indexFieldMetadata)=>{
            const fieldMetadataUniversalIdentifier = fieldMetadataIdToUniversalIdentifierMap.get(indexFieldMetadata.fieldMetadataId);
            if (!(0, _utils.isDefined)(fieldMetadataUniversalIdentifier)) {
                throw new _flatentitymapsexception.FlatEntityMapsException(`FieldMetadata with id ${indexFieldMetadata.fieldMetadataId} not found for index field metadata ${indexFieldMetadata.id}`, _flatentitymapsexception.FlatEntityMapsExceptionCode.RELATION_UNIVERSAL_IDENTIFIER_NOT_FOUND);
            }
            return {
                order: indexFieldMetadata.order,
                subFieldName: indexFieldMetadata.subFieldName,
                createdAt: indexFieldMetadata.createdAt.toISOString(),
                updatedAt: indexFieldMetadata.updatedAt.toISOString(),
                indexMetadataUniversalIdentifier: indexMetadataEntity.universalIdentifier,
                fieldMetadataUniversalIdentifier
            };
        })
    };
};

//# sourceMappingURL=from-index-metadata-entity-to-flat-index-metadata.util.js.map