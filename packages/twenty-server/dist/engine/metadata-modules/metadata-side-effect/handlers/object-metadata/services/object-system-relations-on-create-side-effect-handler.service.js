"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "ObjectSystemRelationsOnCreateSideEffectHandlerService", {
    enumerable: true,
    get: function() {
        return ObjectSystemRelationsOnCreateSideEffectHandlerService;
    }
});
const _core = require("@lingui/core");
const _common = require("@nestjs/common");
const _guards = require("@sniptt/guards");
const _metadata = require("twenty-shared/metadata");
const _utils = require("twenty-shared/utils");
const _metadatasideeffectexceptioncode = require("../../../exceptions/metadata-side-effect-exception-code");
const _basemetadatasideeffecthandlerservice = require("../../../interfaces/base-metadata-side-effect-handler.service");
const _buildsystemrelationflatfieldmetadatasforobjectutil = require("../../../../object-metadata/utils/build-system-relation-flat-field-metadatas-for-object.util");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let ObjectSystemRelationsOnCreateSideEffectHandlerService = class ObjectSystemRelationsOnCreateSideEffectHandlerService extends (0, _basemetadatasideeffecthandlerservice.MetadataSideEffectHandler)({
    operation: 'create',
    metadataName: 'objectMetadata',
    name: 'objectSystemRelationsOnCreate',
    description: 'When an object is created, provision its default relations to the four standard relation objects (timelineActivity, attachment, noteTarget, taskTarget): the forward RELATION field on the new object, the reverse MORPH_RELATION field on the standard object (name-free deterministic identifier so an object rename is a lossless update), and the reverse join-column index. All emitted entities are isSystemSideEffect, so the engine owns their lifecycle. twenty-standard authors these fields itself and never reaches this handler (it syncs via the FromTo path). The handler always emits its bundles: a caller-provided field colliding on universal identifier hard-fails at merge time (RESERVED_SYSTEM_UNIVERSAL_IDENTIFIER), and a caller field colliding on name hard-fails in the field validator (NOT_AVAILABLE).'
}) {
    buildSideEffects({ flatEntity: sourceFlatObjectMetadata, relatedFlatEntityMaps }) {
        const standardTargetFlatObjectMetadataByNameSingular = {};
        const missingStandardObjectErrors = [];
        for (const standardObjectNameSingular of _metadata.DEFAULT_RELATIONS_OBJECTS_STANDARD_IDS){
            const standardTargetFlatObjectMetadata = relatedFlatEntityMaps.flatObjectMetadataMaps.byUniversalIdentifier[_metadata.STANDARD_OBJECTS[standardObjectNameSingular].universalIdentifier];
            if (!(0, _utils.isDefined)(standardTargetFlatObjectMetadata)) {
                missingStandardObjectErrors.push({
                    code: _metadatasideeffectexceptioncode.MetadataSideEffectExceptionCode.SIDE_EFFECT_PARENT_METADATA_NOT_FOUND,
                    message: _core.i18n._(/*i18n*/ {
                        id: "5I3Pop",
                        message: 'Could not resolve standard relation object "{standardObjectNameSingular}" to provision default relations',
                        values: {
                            standardObjectNameSingular: standardObjectNameSingular
                        }
                    }),
                    userFriendlyMessage: /*i18n*/ {
                        id: "IAfaPi",
                        message: "A standard object required to provision default relations could not be found"
                    }
                });
                continue;
            }
            standardTargetFlatObjectMetadataByNameSingular[standardObjectNameSingular] = standardTargetFlatObjectMetadata;
        }
        if ((0, _guards.isNonEmptyArray)(missingStandardObjectErrors)) {
            return {
                status: 'fail',
                type: 'create',
                metadataName: 'objectMetadata',
                flatEntityMinimalInformation: {
                    universalIdentifier: sourceFlatObjectMetadata.universalIdentifier,
                    nameSingular: sourceFlatObjectMetadata.nameSingular
                },
                errors: missingStandardObjectErrors
            };
        }
        const systemRelationBundles = (0, _buildsystemrelationflatfieldmetadatasforobjectutil.buildSystemRelationFlatFieldMetadatasForObject)({
            sourceFlatObjectMetadata,
            standardTargetFlatObjectMetadataByNameSingular,
            applicationUniversalIdentifier: sourceFlatObjectMetadata.applicationUniversalIdentifier
        });
        return {
            status: 'success',
            operations: {
                fieldMetadata: {
                    flatEntityToCreate: (0, _utils.fromArrayToUniqueKeyRecord)({
                        array: systemRelationBundles.flatMap(({ forwardFlatFieldMetadata, reverseFlatFieldMetadata })=>[
                                forwardFlatFieldMetadata,
                                reverseFlatFieldMetadata
                            ]),
                        uniqueKey: 'universalIdentifier'
                    })
                },
                index: {
                    flatEntityToCreate: (0, _utils.fromArrayToUniqueKeyRecord)({
                        array: systemRelationBundles.map(({ flatIndexMetadata })=>flatIndexMetadata),
                        uniqueKey: 'universalIdentifier'
                    })
                }
            }
        };
    }
};
ObjectSystemRelationsOnCreateSideEffectHandlerService = _ts_decorate([
    (0, _common.Injectable)()
], ObjectSystemRelationsOnCreateSideEffectHandlerService);

//# sourceMappingURL=object-system-relations-on-create-side-effect-handler.service.js.map