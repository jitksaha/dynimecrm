"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "ObjectSystemFieldsOnCreateSideEffectHandlerService", {
    enumerable: true,
    get: function() {
        return ObjectSystemFieldsOnCreateSideEffectHandlerService;
    }
});
const _common = require("@nestjs/common");
const _utils = require("twenty-shared/utils");
const _basemetadatasideeffecthandlerservice = require("../../../interfaces/base-metadata-side-effect-handler.service");
const _buildreservedsystemflatfieldmetadatasforcustomobjectutil = require("../../../../object-metadata/utils/build-reserved-system-flat-field-metadatas-for-custom-object.util");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let ObjectSystemFieldsOnCreateSideEffectHandlerService = class ObjectSystemFieldsOnCreateSideEffectHandlerService extends (0, _basemetadatasideeffecthandlerservice.MetadataSideEffectHandler)({
    operation: 'create',
    metadataName: 'objectMetadata',
    name: 'objectSystemFieldsOnCreate',
    description: 'When an object is created, provision its 7 reserved system fields (id, createdAt, updatedAt, deletedAt, createdBy, updatedBy, position), all isSystemSideEffect so the engine owns their lifecycle; searchVector is handled by objectSearchVectorOnCreate and the name field is caller-provided. Their view fields are owned by the view handlers (objectIndexViewOnCreate, objectRecordPageOnCreate), which re-derive the same reserved fields statelessly from the object identity, so there is no ordering dependency between handlers. twenty-standard is not concerned: it synchronizes through the from/to migration path, which never runs the side-effect engine, and authors its own system fields.'
}) {
    buildSideEffects({ flatEntity: sourceFlatObjectMetadata }) {
        const { applicationUniversalIdentifier, universalIdentifier } = sourceFlatObjectMetadata;
        const systemFlatFieldMetadatas = Object.values((0, _buildreservedsystemflatfieldmetadatasforcustomobjectutil.buildReservedSystemFlatFieldMetadatasForCustomObject)({
            flatObjectMetadata: {
                applicationUniversalIdentifier,
                universalIdentifier
            }
        }));
        return {
            status: 'success',
            operations: {
                fieldMetadata: {
                    flatEntityToCreate: (0, _utils.fromArrayToUniqueKeyRecord)({
                        array: systemFlatFieldMetadatas,
                        uniqueKey: 'universalIdentifier'
                    })
                }
            }
        };
    }
};
ObjectSystemFieldsOnCreateSideEffectHandlerService = _ts_decorate([
    (0, _common.Injectable)()
], ObjectSystemFieldsOnCreateSideEffectHandlerService);

//# sourceMappingURL=object-system-fields-on-create-side-effect-handler.service.js.map