"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "ObjectSearchVectorOnUpdateSideEffectHandlerService", {
    enumerable: true,
    get: function() {
        return ObjectSearchVectorOnUpdateSideEffectHandlerService;
    }
});
const _common = require("@nestjs/common");
const _application = require("twenty-shared/application");
const _utils = require("twenty-shared/utils");
const _buildflatsearchfieldmetadataforfieldutil = require("../../../../flat-search-field-metadata/utils/build-flat-search-field-metadata-for-field.util");
const _findtsvectorflatfieldmetadataforobjectutil = require("../../../../flat-search-field-metadata/utils/find-ts-vector-flat-field-metadata-for-object.util");
const _basemetadatasideeffecthandlerservice = require("../../../interfaces/base-metadata-side-effect-handler.service");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let ObjectSearchVectorOnUpdateSideEffectHandlerService = class ObjectSearchVectorOnUpdateSideEffectHandlerService extends (0, _basemetadatasideeffecthandlerservice.MetadataSideEffectHandler)({
    operation: 'update',
    metadataName: 'objectMetadata',
    name: 'objectSearchVectorOnUpdate',
    description: 'When a searchable object is relabeled onto a new searchable field, provision the searchFieldMetadata row that indexes it. Relabeling is additive: existing search rows (e.g. the provisioned name row) are preserved so the previous label identifier stays searchable. Mirrors the API update path so a manifest re-sync that changes the label identifier reaches search parity.'
}) {
    buildSideEffects({ flatEntity: updatedFlatObjectMetadata, allFlatEntityOperationRecordByMetadataName, relatedFlatEntityMaps }) {
        if (updatedFlatObjectMetadata.isSearchable !== true) {
            return {
                status: 'noop'
            };
        }
        const newLabelIdentifierFieldMetadataUniversalIdentifier = updatedFlatObjectMetadata.labelIdentifierFieldMetadataUniversalIdentifier;
        if (!(0, _utils.isDefined)(newLabelIdentifierFieldMetadataUniversalIdentifier)) {
            return {
                status: 'noop'
            };
        }
        // The trigger entity is the incoming (manifest/API) object with empty foreign
        // key aggregators; the existing search rows, positions and searchVector field
        // are resolved from the current cached object.
        const existingFlatObjectMetadata = relatedFlatEntityMaps.flatObjectMetadataMaps.byUniversalIdentifier[updatedFlatObjectMetadata.universalIdentifier];
        if (!(0, _utils.isDefined)(existingFlatObjectMetadata)) {
            return {
                status: 'noop'
            };
        }
        if (existingFlatObjectMetadata.labelIdentifierFieldMetadataUniversalIdentifier === newLabelIdentifierFieldMetadataUniversalIdentifier) {
            return {
                status: 'noop'
            };
        }
        // Junction objects use the system id field as label identifier; UUID is a
        // searchable type, so a type-based check would wrongly index them.
        const derivedIdFieldUniversalIdentifier = (0, _application.getFieldUniversalIdentifier)({
            applicationUniversalIdentifier: updatedFlatObjectMetadata.applicationUniversalIdentifier,
            objectUniversalIdentifier: updatedFlatObjectMetadata.universalIdentifier,
            name: 'id'
        });
        if (newLabelIdentifierFieldMetadataUniversalIdentifier === derivedIdFieldUniversalIdentifier) {
            return {
                status: 'noop'
            };
        }
        const newLabelIdentifierFieldType = this.resolveFieldType({
            fieldMetadataUniversalIdentifier: newLabelIdentifierFieldMetadataUniversalIdentifier,
            allFlatEntityOperationRecordByMetadataName,
            relatedFlatEntityMaps
        });
        if (!(0, _utils.isDefined)(newLabelIdentifierFieldType) || !(0, _utils.isSearchableFieldType)(newLabelIdentifierFieldType)) {
            return {
                status: 'noop'
            };
        }
        const existingSearchFieldMetadatas = existingFlatObjectMetadata.searchFieldMetadataUniversalIdentifiers.map((searchFieldMetadataUniversalIdentifier)=>relatedFlatEntityMaps.flatSearchFieldMetadataMaps.byUniversalIdentifier[searchFieldMetadataUniversalIdentifier]).filter(_utils.isDefined);
        const newLabelIdentifierAlreadyIndexed = existingSearchFieldMetadatas.some((searchFieldMetadata)=>searchFieldMetadata.fieldMetadataUniversalIdentifier === newLabelIdentifierFieldMetadataUniversalIdentifier);
        if (newLabelIdentifierAlreadyIndexed) {
            return {
                status: 'noop'
            };
        }
        const tsVectorFlatFieldMetadata = (0, _findtsvectorflatfieldmetadataforobjectutil.findTsVectorFlatFieldMetadataForObject)({
            fieldUniversalIdentifiers: existingFlatObjectMetadata.fieldUniversalIdentifiers,
            flatFieldMetadataMaps: relatedFlatEntityMaps.flatFieldMetadataMaps
        });
        if (!(0, _utils.isDefined)(tsVectorFlatFieldMetadata)) {
            return {
                status: 'noop'
            };
        }
        const newLabelIdentifierPosition = existingSearchFieldMetadatas.reduce((maxPosition, searchFieldMetadata)=>Math.max(maxPosition, searchFieldMetadata.position), -1) + 1;
        const searchFieldMetadata = (0, _buildflatsearchfieldmetadataforfieldutil.buildFlatSearchFieldMetadataForField)({
            flatObjectMetadata: updatedFlatObjectMetadata,
            flatFieldMetadata: {
                universalIdentifier: newLabelIdentifierFieldMetadataUniversalIdentifier
            },
            tsVectorFlatFieldMetadata: {
                universalIdentifier: tsVectorFlatFieldMetadata.universalIdentifier
            },
            position: newLabelIdentifierPosition
        });
        return {
            status: 'success',
            operations: {
                searchFieldMetadata: {
                    flatEntityToCreate: {
                        [searchFieldMetadata.universalIdentifier]: searchFieldMetadata
                    }
                }
            }
        };
    }
    resolveFieldType({ fieldMetadataUniversalIdentifier, allFlatEntityOperationRecordByMetadataName, relatedFlatEntityMaps }) {
        const pendingField = allFlatEntityOperationRecordByMetadataName.fieldMetadata?.flatEntityToCreate[fieldMetadataUniversalIdentifier];
        if ((0, _utils.isDefined)(pendingField)) {
            return pendingField.type;
        }
        const existingField = relatedFlatEntityMaps.flatFieldMetadataMaps.byUniversalIdentifier[fieldMetadataUniversalIdentifier];
        return existingField?.type;
    }
};
ObjectSearchVectorOnUpdateSideEffectHandlerService = _ts_decorate([
    (0, _common.Injectable)()
], ObjectSearchVectorOnUpdateSideEffectHandlerService);

//# sourceMappingURL=object-search-vector-on-update-side-effect-handler.service.js.map