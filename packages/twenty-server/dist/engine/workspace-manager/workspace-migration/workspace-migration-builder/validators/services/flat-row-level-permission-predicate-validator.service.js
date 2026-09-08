/* @license Enterprise */ "use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "FlatRowLevelPermissionPredicateValidatorService", {
    enumerable: true,
    get: function() {
        return FlatRowLevelPermissionPredicateValidatorService;
    }
});
const _common = require("@nestjs/common");
const _core = require("@lingui/core");
const _guards = require("@sniptt/guards");
const _utils = require("twenty-shared/utils");
const _findflatentitybyuniversalidentifierutil = require("../../../../../metadata-modules/flat-entity/utils/find-flat-entity-by-universal-identifier.util");
const _rowlevelpermissionpredicateexception = require("../../../../../metadata-modules/row-level-permission-predicate/exceptions/row-level-permission-predicate.exception");
const _getflatentityvalidationerrorutil = require("../../builders/utils/get-flat-entity-validation-error.util");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let FlatRowLevelPermissionPredicateValidatorService = class FlatRowLevelPermissionPredicateValidatorService {
    validateFlatRowLevelPermissionPredicateCreation({ flatEntityToValidate: flatPredicateToValidate, optimisticFlatEntityMapsAndRelatedFlatEntityMaps }) {
        const { flatRowLevelPermissionPredicateMaps: optimisticFlatPredicateMaps, flatFieldMetadataMaps, flatObjectMetadataMaps, flatRowLevelPermissionPredicateGroupMaps, flatRoleMaps } = optimisticFlatEntityMapsAndRelatedFlatEntityMaps;
        const validationResult = (0, _getflatentityvalidationerrorutil.getEmptyFlatEntityValidationError)({
            flatEntityMinimalInformation: {
                universalIdentifier: flatPredicateToValidate.universalIdentifier
            },
            metadataName: 'rowLevelPermissionPredicate',
            type: 'create'
        });
        const existingPredicate = (0, _findflatentitybyuniversalidentifierutil.findFlatEntityByUniversalIdentifier)({
            universalIdentifier: flatPredicateToValidate.universalIdentifier,
            flatEntityMaps: optimisticFlatPredicateMaps
        });
        if ((0, _utils.isDefined)(existingPredicate)) {
            validationResult.errors.push({
                code: _rowlevelpermissionpredicateexception.RowLevelPermissionPredicateExceptionCode.INVALID_ROW_LEVEL_PERMISSION_PREDICATE_DATA,
                message: _core.i18n._(/*i18n*/ {
                    id: "B4yoLq",
                    message: "Row level permission predicate with this universal identifier already exists"
                }),
                userFriendlyMessage: /*i18n*/ {
                    id: "/ruB5e",
                    message: "Row level permission predicate already exists"
                }
            });
        }
        const fieldMetadata = flatFieldMetadataMaps ? (0, _findflatentitybyuniversalidentifierutil.findFlatEntityByUniversalIdentifier)({
            universalIdentifier: flatPredicateToValidate.fieldMetadataUniversalIdentifier,
            flatEntityMaps: flatFieldMetadataMaps
        }) : undefined;
        if (!(0, _utils.isDefined)(fieldMetadata)) {
            validationResult.errors.push({
                code: _rowlevelpermissionpredicateexception.RowLevelPermissionPredicateExceptionCode.FIELD_METADATA_NOT_FOUND,
                message: _core.i18n._(/*i18n*/ {
                    id: "MPt365",
                    message: "Field metadata not found"
                }),
                userFriendlyMessage: /*i18n*/ {
                    id: "MPt365",
                    message: "Field metadata not found"
                }
            });
        } else {
            const invalidValueError = this.getInvalidValueError({
                fieldType: fieldMetadata.type,
                operand: flatPredicateToValidate.operand,
                subFieldName: flatPredicateToValidate.subFieldName,
                value: flatPredicateToValidate.value,
                workspaceMemberFieldMetadataUniversalIdentifier: flatPredicateToValidate.workspaceMemberFieldMetadataUniversalIdentifier
            });
            if ((0, _utils.isDefined)(invalidValueError)) {
                validationResult.errors.push(invalidValueError);
            }
        }
        const objectMetadata = flatObjectMetadataMaps ? (0, _findflatentitybyuniversalidentifierutil.findFlatEntityByUniversalIdentifier)({
            universalIdentifier: flatPredicateToValidate.objectMetadataUniversalIdentifier,
            flatEntityMaps: flatObjectMetadataMaps
        }) : undefined;
        if (!(0, _utils.isDefined)(objectMetadata)) {
            validationResult.errors.push({
                code: _rowlevelpermissionpredicateexception.RowLevelPermissionPredicateExceptionCode.OBJECT_METADATA_NOT_FOUND,
                message: _core.i18n._(/*i18n*/ {
                    id: "xrblgA",
                    message: "Object metadata not found"
                }),
                userFriendlyMessage: /*i18n*/ {
                    id: "xrblgA",
                    message: "Object metadata not found"
                }
            });
        }
        if ((0, _utils.isDefined)(flatPredicateToValidate.rowLevelPermissionPredicateGroupUniversalIdentifier) && flatRowLevelPermissionPredicateGroupMaps) {
            const predicateGroup = (0, _findflatentitybyuniversalidentifierutil.findFlatEntityByUniversalIdentifier)({
                universalIdentifier: flatPredicateToValidate.rowLevelPermissionPredicateGroupUniversalIdentifier,
                flatEntityMaps: flatRowLevelPermissionPredicateGroupMaps
            });
            if (!(0, _utils.isDefined)(predicateGroup)) {
                validationResult.errors.push({
                    code: _rowlevelpermissionpredicateexception.RowLevelPermissionPredicateExceptionCode.INVALID_ROW_LEVEL_PERMISSION_PREDICATE_DATA,
                    message: _core.i18n._(/*i18n*/ {
                        id: "va8c5P",
                        message: "Row level permission predicate group not found"
                    }),
                    userFriendlyMessage: /*i18n*/ {
                        id: "va8c5P",
                        message: "Row level permission predicate group not found"
                    }
                });
            }
        }
        const role = flatRoleMaps ? (0, _findflatentitybyuniversalidentifierutil.findFlatEntityByUniversalIdentifier)({
            universalIdentifier: flatPredicateToValidate.roleUniversalIdentifier,
            flatEntityMaps: flatRoleMaps
        }) : undefined;
        if (!(0, _utils.isDefined)(role)) {
            validationResult.errors.push({
                code: _rowlevelpermissionpredicateexception.RowLevelPermissionPredicateExceptionCode.ROLE_NOT_FOUND,
                message: _core.i18n._(/*i18n*/ {
                    id: "MvTCyk",
                    message: "Role not found"
                }),
                userFriendlyMessage: /*i18n*/ {
                    id: "MvTCyk",
                    message: "Role not found"
                }
            });
        }
        return validationResult;
    }
    validateFlatRowLevelPermissionPredicateDeletion({ flatEntityToValidate: flatPredicateToDelete, optimisticFlatEntityMapsAndRelatedFlatEntityMaps }) {
        const { flatRowLevelPermissionPredicateMaps: optimisticFlatPredicateMaps } = optimisticFlatEntityMapsAndRelatedFlatEntityMaps;
        const validationResult = (0, _getflatentityvalidationerrorutil.getEmptyFlatEntityValidationError)({
            flatEntityMinimalInformation: {
                universalIdentifier: flatPredicateToDelete.universalIdentifier
            },
            metadataName: 'rowLevelPermissionPredicate',
            type: 'delete'
        });
        const existingPredicate = (0, _findflatentitybyuniversalidentifierutil.findFlatEntityByUniversalIdentifier)({
            universalIdentifier: flatPredicateToDelete.universalIdentifier,
            flatEntityMaps: optimisticFlatPredicateMaps
        });
        if (!(0, _utils.isDefined)(existingPredicate)) {
            validationResult.errors.push({
                code: _rowlevelpermissionpredicateexception.RowLevelPermissionPredicateExceptionCode.ROW_LEVEL_PERMISSION_PREDICATE_NOT_FOUND,
                message: _core.i18n._(/*i18n*/ {
                    id: "zdTUvE",
                    message: "Row level permission predicate to delete not found"
                }),
                userFriendlyMessage: /*i18n*/ {
                    id: "zdTUvE",
                    message: "Row level permission predicate to delete not found"
                }
            });
        }
        return validationResult;
    }
    validateFlatRowLevelPermissionPredicateUpdate({ universalIdentifier, flatEntityUpdate, optimisticFlatEntityMapsAndRelatedFlatEntityMaps }) {
        const { flatRowLevelPermissionPredicateMaps: optimisticFlatPredicateMaps, flatFieldMetadataMaps, flatObjectMetadataMaps, flatRowLevelPermissionPredicateGroupMaps, flatRoleMaps } = optimisticFlatEntityMapsAndRelatedFlatEntityMaps;
        const existingPredicate = (0, _findflatentitybyuniversalidentifierutil.findFlatEntityByUniversalIdentifier)({
            universalIdentifier,
            flatEntityMaps: optimisticFlatPredicateMaps
        });
        const validationResult = (0, _getflatentityvalidationerrorutil.getEmptyFlatEntityValidationError)({
            flatEntityMinimalInformation: {
                universalIdentifier
            },
            metadataName: 'rowLevelPermissionPredicate',
            type: 'update'
        });
        if (!(0, _utils.isDefined)(existingPredicate)) {
            validationResult.errors.push({
                code: _rowlevelpermissionpredicateexception.RowLevelPermissionPredicateExceptionCode.ROW_LEVEL_PERMISSION_PREDICATE_NOT_FOUND,
                message: _core.i18n._(/*i18n*/ {
                    id: "aeNy7i",
                    message: "Row level permission predicate to update not found"
                }),
                userFriendlyMessage: /*i18n*/ {
                    id: "aeNy7i",
                    message: "Row level permission predicate to update not found"
                }
            });
            return validationResult;
        }
        const updatedPredicate = {
            ...existingPredicate,
            ...flatEntityUpdate
        };
        if (updatedPredicate.roleUniversalIdentifier !== existingPredicate.roleUniversalIdentifier) {
            const existingRoleIdentifier = existingPredicate.roleUniversalIdentifier;
            const updatedRoleIdentifier = updatedPredicate.roleUniversalIdentifier;
            validationResult.errors.push({
                code: _rowlevelpermissionpredicateexception.RowLevelPermissionPredicateExceptionCode.UNAUTHORIZED_ROLE_MODIFICATION,
                message: _core.i18n._(/*i18n*/ {
                    id: "uoi9Wy",
                    message: "Cannot modify predicate to change its role from {existingRoleIdentifier} to {updatedRoleIdentifier}",
                    values: {
                        existingRoleIdentifier: existingRoleIdentifier,
                        updatedRoleIdentifier: updatedRoleIdentifier
                    }
                }),
                userFriendlyMessage: /*i18n*/ {
                    id: "7JaPm8",
                    message: "Cannot modify predicate to change its role"
                }
            });
        }
        if (updatedPredicate.objectMetadataUniversalIdentifier !== existingPredicate.objectMetadataUniversalIdentifier) {
            const existingObjectMetadataIdentifier = existingPredicate.objectMetadataUniversalIdentifier;
            const updatedObjectMetadataIdentifier = updatedPredicate.objectMetadataUniversalIdentifier;
            validationResult.errors.push({
                code: _rowlevelpermissionpredicateexception.RowLevelPermissionPredicateExceptionCode.UNAUTHORIZED_OBJECT_MODIFICATION,
                message: _core.i18n._(/*i18n*/ {
                    id: "ku/9og",
                    message: "Cannot modify predicate to change its object from {existingObjectMetadataIdentifier} to {updatedObjectMetadataIdentifier}",
                    values: {
                        existingObjectMetadataIdentifier: existingObjectMetadataIdentifier,
                        updatedObjectMetadataIdentifier: updatedObjectMetadataIdentifier
                    }
                }),
                userFriendlyMessage: /*i18n*/ {
                    id: "HDo5ie",
                    message: "Cannot modify predicate to change its object"
                }
            });
        }
        const fieldMetadata = flatFieldMetadataMaps ? (0, _findflatentitybyuniversalidentifierutil.findFlatEntityByUniversalIdentifier)({
            universalIdentifier: updatedPredicate.fieldMetadataUniversalIdentifier,
            flatEntityMaps: flatFieldMetadataMaps
        }) : undefined;
        if (!(0, _utils.isDefined)(fieldMetadata)) {
            validationResult.errors.push({
                code: _rowlevelpermissionpredicateexception.RowLevelPermissionPredicateExceptionCode.FIELD_METADATA_NOT_FOUND,
                message: _core.i18n._(/*i18n*/ {
                    id: "MPt365",
                    message: "Field metadata not found"
                }),
                userFriendlyMessage: /*i18n*/ {
                    id: "MPt365",
                    message: "Field metadata not found"
                }
            });
        } else if ('value' in flatEntityUpdate || 'operand' in flatEntityUpdate || 'fieldMetadataUniversalIdentifier' in flatEntityUpdate || 'subFieldName' in flatEntityUpdate || 'workspaceMemberFieldMetadataUniversalIdentifier' in flatEntityUpdate) {
            const invalidValueError = this.getInvalidValueError({
                fieldType: fieldMetadata.type,
                operand: updatedPredicate.operand,
                subFieldName: updatedPredicate.subFieldName,
                value: updatedPredicate.value,
                workspaceMemberFieldMetadataUniversalIdentifier: updatedPredicate.workspaceMemberFieldMetadataUniversalIdentifier
            });
            if ((0, _utils.isDefined)(invalidValueError)) {
                validationResult.errors.push(invalidValueError);
            }
        }
        const objectMetadata = flatObjectMetadataMaps ? (0, _findflatentitybyuniversalidentifierutil.findFlatEntityByUniversalIdentifier)({
            universalIdentifier: updatedPredicate.objectMetadataUniversalIdentifier,
            flatEntityMaps: flatObjectMetadataMaps
        }) : undefined;
        if (!(0, _utils.isDefined)(objectMetadata)) {
            validationResult.errors.push({
                code: _rowlevelpermissionpredicateexception.RowLevelPermissionPredicateExceptionCode.OBJECT_METADATA_NOT_FOUND,
                message: _core.i18n._(/*i18n*/ {
                    id: "xrblgA",
                    message: "Object metadata not found"
                }),
                userFriendlyMessage: /*i18n*/ {
                    id: "xrblgA",
                    message: "Object metadata not found"
                }
            });
        }
        if ((0, _utils.isDefined)(updatedPredicate.rowLevelPermissionPredicateGroupUniversalIdentifier) && flatRowLevelPermissionPredicateGroupMaps) {
            const predicateGroup = (0, _findflatentitybyuniversalidentifierutil.findFlatEntityByUniversalIdentifier)({
                universalIdentifier: updatedPredicate.rowLevelPermissionPredicateGroupUniversalIdentifier,
                flatEntityMaps: flatRowLevelPermissionPredicateGroupMaps
            });
            if (!(0, _utils.isDefined)(predicateGroup)) {
                validationResult.errors.push({
                    code: _rowlevelpermissionpredicateexception.RowLevelPermissionPredicateExceptionCode.INVALID_ROW_LEVEL_PERMISSION_PREDICATE_DATA,
                    message: _core.i18n._(/*i18n*/ {
                        id: "va8c5P",
                        message: "Row level permission predicate group not found"
                    }),
                    userFriendlyMessage: /*i18n*/ {
                        id: "va8c5P",
                        message: "Row level permission predicate group not found"
                    }
                });
            }
        }
        const role = flatRoleMaps ? (0, _findflatentitybyuniversalidentifierutil.findFlatEntityByUniversalIdentifier)({
            universalIdentifier: updatedPredicate.roleUniversalIdentifier,
            flatEntityMaps: flatRoleMaps
        }) : undefined;
        if (!(0, _utils.isDefined)(role)) {
            validationResult.errors.push({
                code: _rowlevelpermissionpredicateexception.RowLevelPermissionPredicateExceptionCode.ROLE_NOT_FOUND,
                message: _core.i18n._(/*i18n*/ {
                    id: "MvTCyk",
                    message: "Role not found"
                }),
                userFriendlyMessage: /*i18n*/ {
                    id: "MvTCyk",
                    message: "Role not found"
                }
            });
        }
        return validationResult;
    }
    // A row level permission predicate compiles without a current record, so a
    // relation value resolving only through isCurrentRecordSelected yields no
    // record id and removes the restriction instead of matching nothing. View
    // filters do resolve it, so this cannot live in the shared schema.
    getUnresolvableRelationError({ fieldType, operand, value }) {
        if ((0, _utils.getFilterTypeFromFieldType)(fieldType) !== 'RELATION') {
            return undefined;
        }
        const stringifiedValue = (0, _utils.convertViewFilterValueToString)(value);
        const relationValue = _utils.jsonRelationFilterValueSchema.safeParse(stringifiedValue);
        if (!relationValue.success || relationValue.data.selectedRecordIds.length > 0 || relationValue.data.isCurrentWorkspaceMemberSelected === true) {
            return undefined;
        }
        return {
            code: _rowlevelpermissionpredicateexception.RowLevelPermissionPredicateExceptionCode.INVALID_ROW_LEVEL_PERMISSION_PREDICATE_DATA,
            message: _core.i18n._(/*i18n*/ {
                id: "l+Dvh5",
                message: 'Value "{stringifiedValue}" resolves to no record for operand "{operand}", the current record is not available to a row level permission predicate',
                values: {
                    stringifiedValue: stringifiedValue,
                    operand: operand
                }
            }),
            userFriendlyMessage: /*i18n*/ {
                id: "a/WH2z",
                message: "Predicate value is not valid for this operand"
            }
        };
    }
    getInvalidValueError({ fieldType, operand, subFieldName, value, workspaceMemberFieldMetadataUniversalIdentifier }) {
        if ((0, _utils.isDefined)(workspaceMemberFieldMetadataUniversalIdentifier)) {
            return undefined;
        }
        const recordFilterOperand = operand;
        if ((0, _utils.isRecordFilterOperandExpectingValue)(recordFilterOperand) && !(0, _utils.isRecordFilterValueValid)({
            operand: recordFilterOperand,
            value: (0, _utils.convertViewFilterValueToString)(value)
        })) {
            return {
                code: _rowlevelpermissionpredicateexception.RowLevelPermissionPredicateExceptionCode.INVALID_ROW_LEVEL_PERMISSION_PREDICATE_DATA,
                message: _core.i18n._(/*i18n*/ {
                    id: "iD+jGc",
                    message: 'Operand "{operand}" requires a value, an empty predicate would remove the row restriction entirely',
                    values: {
                        operand: operand
                    }
                }),
                userFriendlyMessage: /*i18n*/ {
                    id: "OAanPr",
                    message: "Predicate is missing a value"
                }
            };
        }
        const unresolvableRelationError = this.getUnresolvableRelationError({
            fieldType,
            operand,
            value
        });
        if ((0, _utils.isDefined)(unresolvableRelationError)) {
            return unresolvableRelationError;
        }
        const issue = (0, _utils.getFilterValueValidationIssue)({
            fieldType,
            operand: recordFilterOperand,
            subFieldName,
            value
        });
        if (!(0, _utils.isDefined)(issue)) {
            return undefined;
        }
        const { stringifiedValue, filterType, hint } = issue;
        return {
            code: _rowlevelpermissionpredicateexception.RowLevelPermissionPredicateExceptionCode.INVALID_ROW_LEVEL_PERMISSION_PREDICATE_DATA,
            message: (0, _guards.isNonEmptyString)(hint) ? _core.i18n._(/*i18n*/ {
                id: "ccqQWi",
                message: 'Value "{stringifiedValue}" is not valid for operand "{operand}" on field type "{filterType}". {hint}',
                values: {
                    stringifiedValue: stringifiedValue,
                    operand: operand,
                    filterType: filterType,
                    hint: hint
                }
            }) : _core.i18n._(/*i18n*/ {
                id: "sFN4Dx",
                message: 'Value "{stringifiedValue}" is not valid for operand "{operand}" on field type "{filterType}".',
                values: {
                    stringifiedValue: stringifiedValue,
                    operand: operand,
                    filterType: filterType
                }
            }),
            userFriendlyMessage: /*i18n*/ {
                id: "a/WH2z",
                message: "Predicate value is not valid for this operand"
            }
        };
    }
};
FlatRowLevelPermissionPredicateValidatorService = _ts_decorate([
    (0, _common.Injectable)()
], FlatRowLevelPermissionPredicateValidatorService);

//# sourceMappingURL=flat-row-level-permission-predicate-validator.service.js.map