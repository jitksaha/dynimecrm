"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "FlatTimelineActivityTypeValidatorService", {
    enumerable: true,
    get: function() {
        return FlatTimelineActivityTypeValidatorService;
    }
});
const _common = require("@nestjs/common");
const _core = require("@lingui/core");
const _guards = require("@sniptt/guards");
const _timeline = require("twenty-shared/timeline");
const _types = require("twenty-shared/types");
const _utils = require("twenty-shared/utils");
const _findflatentitybyuniversalidentifierutil = require("../../../../../metadata-modules/flat-entity/utils/find-flat-entity-by-universal-identifier.util");
const _ismorphorrelationflatfieldmetadatautil = require("../../../../../metadata-modules/flat-field-metadata/utils/is-morph-or-relation-flat-field-metadata.util");
const _timelineactivitytypeexceptioncodeenum = require("../../../../../metadata-modules/timeline-activity-type/enums/timeline-activity-type-exception-code.enum");
const _isvalidtimelineactivitytypeoverrideutil = require("../../../../../metadata-modules/timeline-activity-type/utils/is-valid-timeline-activity-type-override.util");
const _resolvetimelineactivitytypeoverrideutil = require("../../../../../metadata-modules/timeline-activity-type/utils/resolve-timeline-activity-type-override.util");
const _twentystandardapplications = require("../../../../twenty-standard-application/constants/twenty-standard-applications");
const _getflatentityvalidationerrorutil = require("../../builders/utils/get-flat-entity-validation-error.util");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let FlatTimelineActivityTypeValidatorService = class FlatTimelineActivityTypeValidatorService {
    validateFlatTimelineActivityTypeCreation({ flatEntityToValidate: flatTimelineActivityType, optimisticFlatEntityMapsAndRelatedFlatEntityMaps: validationMaps }) {
        const validationResult = (0, _getflatentityvalidationerrorutil.getEmptyFlatEntityValidationError)({
            flatEntityMinimalInformation: {
                universalIdentifier: flatTimelineActivityType.universalIdentifier,
                name: flatTimelineActivityType.name
            },
            metadataName: 'timelineActivityType',
            type: 'create'
        });
        this.validateTimelineActivityTypeConfiguration({
            timelineActivityType: flatTimelineActivityType,
            validationMaps,
            validationResult
        });
        return validationResult;
    }
    validateFlatTimelineActivityTypeDeletion({ flatEntityToValidate, optimisticFlatEntityMapsAndRelatedFlatEntityMaps: { flatTimelineActivityTypeMaps: optimisticFlatTimelineActivityTypeMaps } }) {
        const validationResult = (0, _getflatentityvalidationerrorutil.getEmptyFlatEntityValidationError)({
            flatEntityMinimalInformation: {
                universalIdentifier: flatEntityToValidate.universalIdentifier,
                name: flatEntityToValidate.name
            },
            metadataName: 'timelineActivityType',
            type: 'delete'
        });
        const existingTimelineActivityType = (0, _findflatentitybyuniversalidentifierutil.findFlatEntityByUniversalIdentifier)({
            universalIdentifier: flatEntityToValidate.universalIdentifier,
            flatEntityMaps: optimisticFlatTimelineActivityTypeMaps
        });
        if (!(0, _utils.isDefined)(existingTimelineActivityType)) {
            validationResult.errors.push({
                code: _timelineactivitytypeexceptioncodeenum.TimelineActivityTypeExceptionCode.TIMELINE_ACTIVITY_TYPE_NOT_FOUND,
                message: _core.i18n._(/*i18n*/ {
                    id: "kNsVJi",
                    message: "Timeline activity type not found"
                }),
                userFriendlyMessage: /*i18n*/ {
                    id: "kNsVJi",
                    message: "Timeline activity type not found"
                }
            });
        }
        return validationResult;
    }
    validateFlatTimelineActivityTypeUpdate({ universalIdentifier, flatEntityUpdate, optimisticFlatEntityMapsAndRelatedFlatEntityMaps }) {
        const { flatTimelineActivityTypeMaps: optimisticFlatTimelineActivityTypeMaps } = optimisticFlatEntityMapsAndRelatedFlatEntityMaps;
        const validationResult = (0, _getflatentityvalidationerrorutil.getEmptyFlatEntityValidationError)({
            flatEntityMinimalInformation: {
                universalIdentifier
            },
            metadataName: 'timelineActivityType',
            type: 'update'
        });
        const fromFlatTimelineActivityType = (0, _findflatentitybyuniversalidentifierutil.findFlatEntityByUniversalIdentifier)({
            universalIdentifier,
            flatEntityMaps: optimisticFlatTimelineActivityTypeMaps
        });
        if (!(0, _utils.isDefined)(fromFlatTimelineActivityType)) {
            validationResult.errors.push({
                code: _timelineactivitytypeexceptioncodeenum.TimelineActivityTypeExceptionCode.TIMELINE_ACTIVITY_TYPE_NOT_FOUND,
                message: _core.i18n._(/*i18n*/ {
                    id: "kNsVJi",
                    message: "Timeline activity type not found"
                }),
                userFriendlyMessage: /*i18n*/ {
                    id: "kNsVJi",
                    message: "Timeline activity type not found"
                }
            });
            return validationResult;
        }
        const updatedTimelineActivityType = {
            ...fromFlatTimelineActivityType,
            ...flatEntityUpdate
        };
        this.validateTimelineActivityTypeConfiguration({
            timelineActivityType: updatedTimelineActivityType,
            validationMaps: optimisticFlatEntityMapsAndRelatedFlatEntityMaps,
            validationResult
        });
        return validationResult;
    }
    validateTimelineActivityTypeConfiguration({ timelineActivityType, validationMaps, validationResult }) {
        if (!(0, _guards.isNonEmptyString)(timelineActivityType.name)) {
            validationResult.errors.push({
                code: _timelineactivitytypeexceptioncodeenum.TimelineActivityTypeExceptionCode.INVALID_TIMELINE_ACTIVITY_TYPE_INPUT,
                message: _core.i18n._(/*i18n*/ {
                    id: "0QdkGz",
                    message: "Timeline activity type name is required"
                }),
                userFriendlyMessage: /*i18n*/ {
                    id: "0QdkGz",
                    message: "Timeline activity type name is required"
                }
            });
        }
        if (!(0, _guards.isNonEmptyString)(timelineActivityType.label)) {
            validationResult.errors.push({
                code: _timelineactivitytypeexceptioncodeenum.TimelineActivityTypeExceptionCode.INVALID_TIMELINE_ACTIVITY_TYPE_INPUT,
                message: _core.i18n._(/*i18n*/ {
                    id: "sqmSqj",
                    message: "Timeline activity type label is required"
                }),
                userFriendlyMessage: /*i18n*/ {
                    id: "sqmSqj",
                    message: "Timeline activity type label is required"
                }
            });
        }
        if ((0, _utils.isDefined)(timelineActivityType.action) && !(0, _timeline.isTimelineActivityAction)(timelineActivityType.action)) {
            validationResult.errors.push({
                code: _timelineactivitytypeexceptioncodeenum.TimelineActivityTypeExceptionCode.INVALID_TIMELINE_ACTIVITY_TYPE_INPUT,
                message: _core.i18n._(/*i18n*/ {
                    id: "o/bbIF",
                    message: "Unknown timeline activity action {0}",
                    values: {
                        0: timelineActivityType.action
                    }
                }),
                userFriendlyMessage: /*i18n*/ {
                    id: "0GMgIa",
                    message: "This timeline activity action is not supported"
                }
            });
        }
        const existingByName = Object.values(validationMaps.flatTimelineActivityTypeMaps.byUniversalIdentifier).find((existing)=>(0, _utils.isDefined)(existing) && existing.universalIdentifier !== timelineActivityType.universalIdentifier && existing.name === timelineActivityType.name && existing.applicationUniversalIdentifier === timelineActivityType.applicationUniversalIdentifier);
        if ((0, _utils.isDefined)(existingByName)) {
            validationResult.errors.push({
                code: _timelineactivitytypeexceptioncodeenum.TimelineActivityTypeExceptionCode.TIMELINE_ACTIVITY_TYPE_NAME_ALREADY_EXISTS,
                message: _core.i18n._(/*i18n*/ {
                    id: "8VTlb5",
                    message: "Timeline activity type with name {0} already exists for this application",
                    values: {
                        0: timelineActivityType.name
                    }
                }),
                userFriendlyMessage: /*i18n*/ {
                    id: "JJamm8",
                    message: "A timeline activity type with this name already exists for this application"
                }
            });
        }
        this.validateTimelineActivityTypeDependencies({
            timelineActivityType,
            validationMaps,
            validationResult
        });
        this.validateTimelineActivityTypeResolverConflict({
            timelineActivityType,
            validationMaps,
            validationResult
        });
    }
    validateTimelineActivityTypeDependencies({ timelineActivityType, validationMaps, validationResult }) {
        const { objectUniversalIdentifier, frontComponentUniversalIdentifier, targetRelationFieldUniversalIdentifier, triggerFieldUniversalIdentifiers, happensAtFieldUniversalIdentifier, replacesTimelineActivityTypeUniversalIdentifier } = timelineActivityType;
        const objectMetadata = (0, _utils.isDefined)(objectUniversalIdentifier) ? validationMaps.flatObjectMetadataMaps.byUniversalIdentifier[objectUniversalIdentifier] : undefined;
        if ((0, _utils.isDefined)(objectUniversalIdentifier) && !(0, _utils.isDefined)(objectMetadata)) {
            validationResult.errors.push({
                code: _timelineactivitytypeexceptioncodeenum.TimelineActivityTypeExceptionCode.INVALID_TIMELINE_ACTIVITY_TYPE_INPUT,
                message: _core.i18n._(/*i18n*/ {
                    id: "f7+vxa",
                    message: "Timeline activity type references an object that does not exist"
                }),
                userFriendlyMessage: /*i18n*/ {
                    id: "QaaKZQ",
                    message: "The object used by this timeline activity type is not available"
                }
            });
        }
        if ((0, _utils.isDefined)(timelineActivityType.action) && !(0, _utils.isDefined)(objectUniversalIdentifier) && timelineActivityType.applicationUniversalIdentifier !== _twentystandardapplications.TWENTY_STANDARD_APPLICATION.universalIdentifier) {
            validationResult.errors.push({
                code: _timelineactivitytypeexceptioncodeenum.TimelineActivityTypeExceptionCode.INVALID_TIMELINE_ACTIVITY_TYPE_INPUT,
                message: _core.i18n._(/*i18n*/ {
                    id: "SC8Bk0",
                    message: "An application timeline activity emitter must target one of its objects"
                }),
                userFriendlyMessage: /*i18n*/ {
                    id: "dRdO/y",
                    message: "Choose the object that emits this timeline activity type"
                }
            });
        }
        if ((timelineActivityType.action === 'linked' || timelineActivityType.action === 'unlinked') && !(0, _utils.isDefined)(targetRelationFieldUniversalIdentifier) && timelineActivityType.applicationUniversalIdentifier !== _twentystandardapplications.TWENTY_STANDARD_APPLICATION.universalIdentifier) {
            validationResult.errors.push({
                code: _timelineactivitytypeexceptioncodeenum.TimelineActivityTypeExceptionCode.INVALID_TIMELINE_ACTIVITY_TYPE_INPUT,
                message: _core.i18n._(/*i18n*/ {
                    id: "LXKHX6",
                    message: "Linked and unlinked timeline activity emitters require a target relation"
                }),
                userFriendlyMessage: /*i18n*/ {
                    id: "PDwfT5",
                    message: "Choose the relation used by this timeline activity type"
                }
            });
        }
        const overridesTimelineActivityType = (0, _utils.isDefined)(replacesTimelineActivityTypeUniversalIdentifier) ? validationMaps.flatTimelineActivityTypeMaps.byUniversalIdentifier[replacesTimelineActivityTypeUniversalIdentifier] : undefined;
        const targetsAnotherApplication = (0, _utils.isDefined)(timelineActivityType.action) && (0, _utils.isDefined)(objectMetadata) && objectMetadata.applicationUniversalIdentifier !== timelineActivityType.applicationUniversalIdentifier;
        if (targetsAnotherApplication && !(0, _utils.isDefined)(replacesTimelineActivityTypeUniversalIdentifier)) {
            validationResult.errors.push({
                code: _timelineactivitytypeexceptioncodeenum.TimelineActivityTypeExceptionCode.INVALID_TIMELINE_ACTIVITY_TYPE_INPUT,
                message: _core.i18n._(/*i18n*/ {
                    id: "WzDeE/",
                    message: "A timeline activity type targeting another application's object must declare the timeline activity type it overrides"
                }),
                userFriendlyMessage: /*i18n*/ {
                    id: "8kN7d7",
                    message: "Choose an existing timeline activity type to override"
                }
            });
        }
        if ((0, _utils.isDefined)(replacesTimelineActivityTypeUniversalIdentifier) && !(0, _isvalidtimelineactivitytypeoverrideutil.isValidTimelineActivityTypeOverride)({
            timelineActivityType,
            objectOwner: objectMetadata,
            overriddenTimelineActivityType: overridesTimelineActivityType
        })) {
            validationResult.errors.push({
                code: _timelineactivitytypeexceptioncodeenum.TimelineActivityTypeExceptionCode.INVALID_TIMELINE_ACTIVITY_TYPE_INPUT,
                message: _core.i18n._(/*i18n*/ {
                    id: "0VIqW4",
                    message: "Timeline activity type override must reference a compatible type owned by the target object's application"
                }),
                userFriendlyMessage: /*i18n*/ {
                    id: "PLlXuR",
                    message: "The timeline activity type override is not compatible with this event"
                }
            });
        }
        if ((0, _utils.isDefined)(targetRelationFieldUniversalIdentifier)) {
            const targetRelationField = validationMaps.flatFieldMetadataMaps.byUniversalIdentifier[targetRelationFieldUniversalIdentifier];
            const hasSupportedRelationShape = (0, _utils.isDefined)(targetRelationField) && (0, _ismorphorrelationflatfieldmetadatautil.isMorphOrRelationUniversalFlatFieldMetadata)(targetRelationField) && (targetRelationField.universalSettings?.relationType === _types.RelationType.MANY_TO_ONE || targetRelationField.universalSettings?.relationType === _types.RelationType.ONE_TO_MANY && (0, _utils.isDefined)(targetRelationField.universalSettings?.junctionTargetFieldUniversalIdentifier));
            if (!(0, _utils.isDefined)(timelineActivityType.action) || !(0, _utils.isDefined)(objectUniversalIdentifier) || !(0, _utils.isDefined)(targetRelationField) || targetRelationField.objectMetadataUniversalIdentifier !== objectUniversalIdentifier || !hasSupportedRelationShape) {
                validationResult.errors.push({
                    code: _timelineactivitytypeexceptioncodeenum.TimelineActivityTypeExceptionCode.INVALID_TIMELINE_ACTIVITY_TYPE_INPUT,
                    message: _core.i18n._(/*i18n*/ {
                        id: "Y9ZQls",
                        message: "Timeline activity type target relation must be a direct or junction relation on its source object"
                    }),
                    userFriendlyMessage: /*i18n*/ {
                        id: "Eq5YMK",
                        message: "The target relation used by this timeline activity type is not available"
                    }
                });
            }
        }
        if ((0, _utils.isDefined)(triggerFieldUniversalIdentifiers)) {
            const hasInvalidTriggerField = timelineActivityType.action !== 'updated' || !(0, _utils.isDefined)(targetRelationFieldUniversalIdentifier) || !(0, _utils.isNonEmptyArray)(triggerFieldUniversalIdentifiers) || new Set(triggerFieldUniversalIdentifiers).size !== triggerFieldUniversalIdentifiers.length || triggerFieldUniversalIdentifiers.some((universalIdentifier)=>{
                const triggerField = validationMaps.flatFieldMetadataMaps.byUniversalIdentifier[universalIdentifier];
                return !(0, _utils.isDefined)(triggerField) || triggerField.objectMetadataUniversalIdentifier !== objectUniversalIdentifier;
            });
            if (hasInvalidTriggerField) {
                validationResult.errors.push({
                    code: _timelineactivitytypeexceptioncodeenum.TimelineActivityTypeExceptionCode.INVALID_TIMELINE_ACTIVITY_TYPE_INPUT,
                    message: _core.i18n._(/*i18n*/ {
                        id: "ShcC6H",
                        message: "Timeline activity type trigger fields must be non-empty fields on the source object of an updated relation event"
                    }),
                    userFriendlyMessage: /*i18n*/ {
                        id: "IT44Du",
                        message: "The trigger fields used by this timeline activity type are not available"
                    }
                });
            }
        }
        if ((0, _utils.isDefined)(happensAtFieldUniversalIdentifier)) {
            const happensAtField = validationMaps.flatFieldMetadataMaps.byUniversalIdentifier[happensAtFieldUniversalIdentifier];
            const hasInvalidHappensAtField = timelineActivityType.action !== 'linked' || !(0, _utils.isDefined)(targetRelationFieldUniversalIdentifier) || !(0, _utils.isDefined)(happensAtField) || happensAtField.objectMetadataUniversalIdentifier !== objectUniversalIdentifier || happensAtField.type !== _types.FieldMetadataType.DATE_TIME && happensAtField.type !== _types.FieldMetadataType.DATE;
            if (hasInvalidHappensAtField) {
                validationResult.errors.push({
                    code: _timelineactivitytypeexceptioncodeenum.TimelineActivityTypeExceptionCode.INVALID_TIMELINE_ACTIVITY_TYPE_INPUT,
                    message: _core.i18n._(/*i18n*/ {
                        id: "yi1Kgg",
                        message: "Timeline activity type happensAt field must be a date field on the source object of a linked relation event"
                    }),
                    userFriendlyMessage: /*i18n*/ {
                        id: "840b8q",
                        message: "The happensAt field used by this timeline activity type is not available"
                    }
                });
            }
        }
        if (!(0, _utils.isDefined)(frontComponentUniversalIdentifier)) {
            return;
        }
        const isStandardRenderer = (0, _timeline.isStandardTimelineActivityRendererUniversalIdentifier)(frontComponentUniversalIdentifier);
        const usesStandardRenderer = isStandardRenderer && timelineActivityType.applicationUniversalIdentifier === _twentystandardapplications.TWENTY_STANDARD_APPLICATION.universalIdentifier;
        if (usesStandardRenderer) {
            return;
        }
        const frontComponent = validationMaps.flatFrontComponentMaps.byUniversalIdentifier[frontComponentUniversalIdentifier];
        if (isStandardRenderer || !(0, _utils.isDefined)(frontComponent) || frontComponent.applicationUniversalIdentifier !== timelineActivityType.applicationUniversalIdentifier) {
            validationResult.errors.push({
                code: _timelineactivitytypeexceptioncodeenum.TimelineActivityTypeExceptionCode.INVALID_TIMELINE_ACTIVITY_TYPE_INPUT,
                message: _core.i18n._(/*i18n*/ {
                    id: "kfv1kx",
                    message: "Timeline activity type references a front component that does not belong to its application"
                }),
                userFriendlyMessage: /*i18n*/ {
                    id: "9TYO3w",
                    message: "The front component used by this timeline activity type is not available"
                }
            });
        }
    }
    validateTimelineActivityTypeResolverConflict({ timelineActivityType, validationMaps, validationResult }) {
        if (!(0, _utils.isDefined)(timelineActivityType.action)) {
            return;
        }
        const existingTimelineActivityTypes = Object.values(validationMaps.flatTimelineActivityTypeMaps.byUniversalIdentifier).filter(_utils.isDefined);
        const resolverCandidates = [
            ...existingTimelineActivityTypes.filter((existing)=>existing.universalIdentifier !== timelineActivityType.universalIdentifier && existing.action === timelineActivityType.action && existing.objectUniversalIdentifier === timelineActivityType.objectUniversalIdentifier && existing.targetRelationFieldUniversalIdentifier === timelineActivityType.targetRelationFieldUniversalIdentifier),
            timelineActivityType
        ];
        const effectiveTimelineActivityType = (0, _resolvetimelineactivitytypeoverrideutil.resolveTimelineActivityTypeOverride)(resolverCandidates, new Set([
            ...existingTimelineActivityTypes.map((existing)=>existing.universalIdentifier),
            timelineActivityType.universalIdentifier
        ]));
        if (!(0, _utils.isDefined)(effectiveTimelineActivityType)) {
            const conflictingResolverType = resolverCandidates.find((candidate)=>candidate.universalIdentifier !== timelineActivityType.universalIdentifier);
            validationResult.errors.push({
                code: _timelineactivitytypeexceptioncodeenum.TimelineActivityTypeExceptionCode.INVALID_TIMELINE_ACTIVITY_TYPE_INPUT,
                message: _core.i18n._(/*i18n*/ {
                    id: "wt+xfK",
                    message: "Timeline activity type conflicts with {0} for the same action, object, and target relation",
                    values: {
                        0: conflictingResolverType?.name ?? timelineActivityType.name
                    }
                }),
                userFriendlyMessage: /*i18n*/ {
                    id: "8IMyyd",
                    message: "Another timeline activity type already handles this action, object, and target relation"
                }
            });
        }
    }
};
FlatTimelineActivityTypeValidatorService = _ts_decorate([
    (0, _common.Injectable)()
], FlatTimelineActivityTypeValidatorService);

//# sourceMappingURL=flat-timeline-activity-type-validator.service.js.map