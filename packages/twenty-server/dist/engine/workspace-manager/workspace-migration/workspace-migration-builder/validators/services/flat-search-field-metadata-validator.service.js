"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "FlatSearchFieldMetadataValidatorService", {
    enumerable: true,
    get: function() {
        return FlatSearchFieldMetadataValidatorService;
    }
});
const _common = require("@nestjs/common");
const _core = require("@lingui/core");
const _types = require("twenty-shared/types");
const _utils = require("twenty-shared/utils");
const _findflatentitybyuniversalidentifierutil = require("../../../../../metadata-modules/flat-entity/utils/find-flat-entity-by-universal-identifier.util");
const _findmanyflatentitybyuniversalidentifierinuniversalflatentitymapsorthrowutil = require("../../../../../metadata-modules/flat-entity/utils/find-many-flat-entity-by-universal-identifier-in-universal-flat-entity-maps-or-throw.util");
const _searchfieldmetadataexception = require("../../../../../metadata-modules/search-field-metadata/exceptions/search-field-metadata.exception");
const _getflatentityvalidationerrorutil = require("../../builders/utils/get-flat-entity-validation-error.util");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let FlatSearchFieldMetadataValidatorService = class FlatSearchFieldMetadataValidatorService {
    validateFlatSearchFieldMetadataCreation({ flatEntityToValidate: flatSearchFieldMetadataToValidate, optimisticFlatEntityMapsAndRelatedFlatEntityMaps: { flatSearchFieldMetadataMaps: optimisticFlatSearchFieldMetadataMaps, flatObjectMetadataMaps, flatFieldMetadataMaps } }) {
        const validationResult = (0, _getflatentityvalidationerrorutil.getEmptyFlatEntityValidationError)({
            flatEntityMinimalInformation: {
                universalIdentifier: flatSearchFieldMetadataToValidate.universalIdentifier,
                objectMetadataUniversalIdentifier: flatSearchFieldMetadataToValidate.objectMetadataUniversalIdentifier
            },
            metadataName: 'searchFieldMetadata',
            type: 'create'
        });
        const existingFlatSearchFieldMetadata = (0, _findflatentitybyuniversalidentifierutil.findFlatEntityByUniversalIdentifier)({
            universalIdentifier: flatSearchFieldMetadataToValidate.universalIdentifier,
            flatEntityMaps: optimisticFlatSearchFieldMetadataMaps
        });
        if ((0, _utils.isDefined)(existingFlatSearchFieldMetadata)) {
            const searchFieldMetadataId = flatSearchFieldMetadataToValidate.universalIdentifier;
            validationResult.errors.push({
                code: _searchfieldmetadataexception.SearchFieldMetadataExceptionCode.INVALID_SEARCH_FIELD_METADATA_DATA,
                message: _core.i18n._(/*i18n*/ {
                    id: "DqglnT",
                    message: "Search field metadata with id {searchFieldMetadataId} already exists",
                    values: {
                        searchFieldMetadataId: searchFieldMetadataId
                    }
                }),
                userFriendlyMessage: /*i18n*/ {
                    id: "BxFH1y",
                    message: "Search field metadata already exists"
                }
            });
        }
        const flatFieldMetadata = (0, _findflatentitybyuniversalidentifierutil.findFlatEntityByUniversalIdentifier)({
            universalIdentifier: flatSearchFieldMetadataToValidate.fieldMetadataUniversalIdentifier,
            flatEntityMaps: flatFieldMetadataMaps
        });
        if (!(0, _utils.isDefined)(flatFieldMetadata)) {
            validationResult.errors.push({
                code: _searchfieldmetadataexception.SearchFieldMetadataExceptionCode.FIELD_METADATA_NOT_FOUND,
                message: _core.i18n._(/*i18n*/ {
                    id: "MPt365",
                    message: "Field metadata not found"
                }),
                userFriendlyMessage: /*i18n*/ {
                    id: "MPt365",
                    message: "Field metadata not found"
                }
            });
        }
        const flatTsVectorFieldMetadata = (0, _findflatentitybyuniversalidentifierutil.findFlatEntityByUniversalIdentifier)({
            universalIdentifier: flatSearchFieldMetadataToValidate.tsVectorFieldMetadataUniversalIdentifier,
            flatEntityMaps: flatFieldMetadataMaps
        });
        if (!(0, _utils.isDefined)(flatTsVectorFieldMetadata)) {
            validationResult.errors.push({
                code: _searchfieldmetadataexception.SearchFieldMetadataExceptionCode.TS_VECTOR_FIELD_METADATA_NOT_FOUND,
                message: _core.i18n._(/*i18n*/ {
                    id: "U2jKdj",
                    message: "TS_VECTOR field metadata not found"
                }),
                userFriendlyMessage: /*i18n*/ {
                    id: "LhHidH",
                    message: "Search vector field not found"
                }
            });
        } else {
            if (flatTsVectorFieldMetadata.type !== _types.FieldMetadataType.TS_VECTOR) {
                validationResult.errors.push({
                    code: _searchfieldmetadataexception.SearchFieldMetadataExceptionCode.INVALID_TS_VECTOR_FIELD_METADATA,
                    message: _core.i18n._(/*i18n*/ {
                        id: "iZ+j0D",
                        message: "TS_VECTOR field metadata must be of type TS_VECTOR"
                    }),
                    userFriendlyMessage: /*i18n*/ {
                        id: "jyicIO",
                        message: "Search vector field must be a search vector"
                    }
                });
            }
            if (flatTsVectorFieldMetadata.objectMetadataUniversalIdentifier !== flatSearchFieldMetadataToValidate.objectMetadataUniversalIdentifier) {
                validationResult.errors.push({
                    code: _searchfieldmetadataexception.SearchFieldMetadataExceptionCode.INVALID_TS_VECTOR_FIELD_METADATA,
                    message: _core.i18n._(/*i18n*/ {
                        id: "FCcwXv",
                        message: "TS_VECTOR field metadata must belong to the same object"
                    }),
                    userFriendlyMessage: /*i18n*/ {
                        id: "8XvmDU",
                        message: "Search vector field must belong to the same object"
                    }
                });
            }
        }
        const flatObjectMetadata = (0, _findflatentitybyuniversalidentifierutil.findFlatEntityByUniversalIdentifier)({
            universalIdentifier: flatSearchFieldMetadataToValidate.objectMetadataUniversalIdentifier,
            flatEntityMaps: flatObjectMetadataMaps
        });
        if (!(0, _utils.isDefined)(flatObjectMetadata)) {
            validationResult.errors.push({
                code: _searchfieldmetadataexception.SearchFieldMetadataExceptionCode.OBJECT_METADATA_NOT_FOUND,
                message: _core.i18n._(/*i18n*/ {
                    id: "xrblgA",
                    message: "Object metadata not found"
                }),
                userFriendlyMessage: /*i18n*/ {
                    id: "xrblgA",
                    message: "Object metadata not found"
                }
            });
            return validationResult;
        }
        const otherFlatSearchFieldMetadatas = (0, _findmanyflatentitybyuniversalidentifierinuniversalflatentitymapsorthrowutil.findManyFlatEntityByUniversalIdentifierInUniversalFlatEntityMapsOrThrow)({
            universalIdentifiers: flatObjectMetadata.searchFieldMetadataUniversalIdentifiers,
            flatEntityMaps: optimisticFlatSearchFieldMetadataMaps
        });
        const equivalentExistingFlatSearchFieldMetadataExists = otherFlatSearchFieldMetadatas.some((flatSearchFieldMetadata)=>flatSearchFieldMetadata.universalIdentifier !== flatSearchFieldMetadataToValidate.universalIdentifier && flatSearchFieldMetadata.fieldMetadataUniversalIdentifier === flatSearchFieldMetadataToValidate.fieldMetadataUniversalIdentifier);
        if (equivalentExistingFlatSearchFieldMetadataExists) {
            validationResult.errors.push({
                code: _searchfieldmetadataexception.SearchFieldMetadataExceptionCode.INVALID_SEARCH_FIELD_METADATA_DATA,
                message: _core.i18n._(/*i18n*/ {
                    id: "YKJLlF",
                    message: "Search field metadata with same fieldMetadataId and objectMetadataId already exists"
                }),
                userFriendlyMessage: /*i18n*/ {
                    id: "BxFH1y",
                    message: "Search field metadata already exists"
                }
            });
        }
        return validationResult;
    }
    validateFlatSearchFieldMetadataUpdate({ universalIdentifier, optimisticFlatEntityMapsAndRelatedFlatEntityMaps: { flatSearchFieldMetadataMaps: optimisticFlatSearchFieldMetadataMaps } }) {
        const validationResult = (0, _getflatentityvalidationerrorutil.getEmptyFlatEntityValidationError)({
            flatEntityMinimalInformation: {
                universalIdentifier
            },
            metadataName: 'searchFieldMetadata',
            type: 'update'
        });
        const existingFlatSearchFieldMetadata = (0, _findflatentitybyuniversalidentifierutil.findFlatEntityByUniversalIdentifier)({
            universalIdentifier,
            flatEntityMaps: optimisticFlatSearchFieldMetadataMaps
        });
        if (!(0, _utils.isDefined)(existingFlatSearchFieldMetadata)) {
            validationResult.errors.push({
                code: _searchfieldmetadataexception.SearchFieldMetadataExceptionCode.SEARCH_FIELD_METADATA_NOT_FOUND,
                message: _core.i18n._(/*i18n*/ {
                    id: "xHFdq5",
                    message: "Search field metadata to update not found"
                }),
                userFriendlyMessage: /*i18n*/ {
                    id: "xHFdq5",
                    message: "Search field metadata to update not found"
                }
            });
            return validationResult;
        }
        return validationResult;
    }
    validateFlatSearchFieldMetadataDeletion({ flatEntityToValidate: { universalIdentifier }, optimisticFlatEntityMapsAndRelatedFlatEntityMaps: { flatSearchFieldMetadataMaps: optimisticFlatSearchFieldMetadataMaps } }) {
        const validationResult = (0, _getflatentityvalidationerrorutil.getEmptyFlatEntityValidationError)({
            flatEntityMinimalInformation: {
                universalIdentifier
            },
            metadataName: 'searchFieldMetadata',
            type: 'delete'
        });
        const existingFlatSearchFieldMetadata = (0, _findflatentitybyuniversalidentifierutil.findFlatEntityByUniversalIdentifier)({
            universalIdentifier,
            flatEntityMaps: optimisticFlatSearchFieldMetadataMaps
        });
        if (!(0, _utils.isDefined)(existingFlatSearchFieldMetadata)) {
            validationResult.errors.push({
                code: _searchfieldmetadataexception.SearchFieldMetadataExceptionCode.SEARCH_FIELD_METADATA_NOT_FOUND,
                message: _core.i18n._(/*i18n*/ {
                    id: "410QNy",
                    message: "Search field metadata to delete not found"
                }),
                userFriendlyMessage: /*i18n*/ {
                    id: "410QNy",
                    message: "Search field metadata to delete not found"
                }
            });
            return validationResult;
        }
        return validationResult;
    }
    constructor(){}
};
FlatSearchFieldMetadataValidatorService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [])
], FlatSearchFieldMetadataValidatorService);

//# sourceMappingURL=flat-search-field-metadata-validator.service.js.map