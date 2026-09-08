"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "ObjectSearchVectorOnCreateSideEffectHandlerService", {
    enumerable: true,
    get: function() {
        return ObjectSearchVectorOnCreateSideEffectHandlerService;
    }
});
const _common = require("@nestjs/common");
const _application = require("twenty-shared/application");
const _utils = require("twenty-shared/utils");
const _buildflatsearchfieldmetadataforfieldutil = require("../../../../flat-search-field-metadata/utils/build-flat-search-field-metadata-for-field.util");
const _basemetadatasideeffecthandlerservice = require("../../../interfaces/base-metadata-side-effect-handler.service");
const _buildsearchvectorflatfieldmetadataforcustomobjectutil = require("../../../../object-metadata/utils/build-search-vector-flat-field-metadata-for-custom-object.util");
const _buildsearchvectorginindexforcustomobjectutil = require("../../../../object-metadata/utils/build-search-vector-gin-index-for-custom-object.util");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let ObjectSearchVectorOnCreateSideEffectHandlerService = class ObjectSearchVectorOnCreateSideEffectHandlerService extends (0, _basemetadatasideeffecthandlerservice.MetadataSideEffectHandler)({
    operation: 'create',
    metadataName: 'objectMetadata',
    name: 'objectSearchVectorOnCreate',
    description: 'When an object is created, provision its full-text search surface as a single self-contained side effect: the searchVector system field, the GIN index backing it, and (for searchable objects whose label identifier is a searchable field) the searchFieldMetadata row that keeps the searchVector populated instead of NULL.'
}) {
    buildSideEffects({ flatEntity: flatObjectMetadata, allFlatEntityOperationRecordByMetadataName, relatedFlatEntityMaps }) {
        const { applicationUniversalIdentifier, universalIdentifier } = flatObjectMetadata;
        const searchVectorFlatFieldMetadata = (0, _buildsearchvectorflatfieldmetadataforcustomobjectutil.buildSearchVectorFlatFieldMetadataForCustomObject)({
            flatObjectMetadata: {
                applicationUniversalIdentifier,
                universalIdentifier
            }
        });
        const tsVectorFlatIndex = (0, _buildsearchvectorginindexforcustomobjectutil.buildSearchVectorGinIndexForCustomObject)({
            flatObjectMetadata,
            searchVectorFlatFieldMetadata
        });
        const operations = {
            fieldMetadata: {
                flatEntityToCreate: {
                    [searchVectorFlatFieldMetadata.universalIdentifier]: searchVectorFlatFieldMetadata
                }
            },
            index: {
                flatEntityToCreate: {
                    [tsVectorFlatIndex.universalIdentifier]: tsVectorFlatIndex
                }
            }
        };
        const searchFieldMetadata = this.buildSearchFieldMetadata({
            flatObjectMetadata,
            searchVectorFlatFieldMetadata,
            allFlatEntityOperationRecordByMetadataName,
            relatedFlatEntityMaps
        });
        if ((0, _utils.isDefined)(searchFieldMetadata)) {
            operations.searchFieldMetadata = {
                flatEntityToCreate: {
                    [searchFieldMetadata.universalIdentifier]: searchFieldMetadata
                }
            };
        }
        return {
            status: 'success',
            operations
        };
    }
    buildSearchFieldMetadata({ flatObjectMetadata, searchVectorFlatFieldMetadata, allFlatEntityOperationRecordByMetadataName, relatedFlatEntityMaps }) {
        if (flatObjectMetadata.isSearchable !== true) {
            return undefined;
        }
        const labelIdentifierFieldMetadataUniversalIdentifier = flatObjectMetadata.labelIdentifierFieldMetadataUniversalIdentifier;
        if (!(0, _utils.isDefined)(labelIdentifierFieldMetadataUniversalIdentifier)) {
            return undefined;
        }
        const derivedIdFieldUniversalIdentifier = (0, _application.getFieldUniversalIdentifier)({
            applicationUniversalIdentifier: flatObjectMetadata.applicationUniversalIdentifier,
            objectUniversalIdentifier: flatObjectMetadata.universalIdentifier,
            name: 'id'
        });
        if (labelIdentifierFieldMetadataUniversalIdentifier === derivedIdFieldUniversalIdentifier) {
            return undefined;
        }
        const labelIdentifierFieldType = this.resolveLabelIdentifierFieldType({
            labelIdentifierFieldMetadataUniversalIdentifier,
            allFlatEntityOperationRecordByMetadataName,
            relatedFlatEntityMaps
        });
        if (!(0, _utils.isDefined)(labelIdentifierFieldType) || !(0, _utils.isSearchableFieldType)(labelIdentifierFieldType)) {
            return undefined;
        }
        return (0, _buildflatsearchfieldmetadataforfieldutil.buildFlatSearchFieldMetadataForField)({
            flatObjectMetadata,
            flatFieldMetadata: {
                universalIdentifier: labelIdentifierFieldMetadataUniversalIdentifier
            },
            tsVectorFlatFieldMetadata: {
                universalIdentifier: searchVectorFlatFieldMetadata.universalIdentifier
            },
            position: 0
        });
    }
    resolveLabelIdentifierFieldType({ labelIdentifierFieldMetadataUniversalIdentifier, allFlatEntityOperationRecordByMetadataName, relatedFlatEntityMaps }) {
        const pendingField = allFlatEntityOperationRecordByMetadataName.fieldMetadata?.flatEntityToCreate[labelIdentifierFieldMetadataUniversalIdentifier];
        if ((0, _utils.isDefined)(pendingField)) {
            return pendingField.type;
        }
        const existingField = relatedFlatEntityMaps.flatFieldMetadataMaps.byUniversalIdentifier[labelIdentifierFieldMetadataUniversalIdentifier];
        return existingField?.type;
    }
};
ObjectSearchVectorOnCreateSideEffectHandlerService = _ts_decorate([
    (0, _common.Injectable)()
], ObjectSearchVectorOnCreateSideEffectHandlerService);

//# sourceMappingURL=object-search-vector-on-create-side-effect-handler.service.js.map