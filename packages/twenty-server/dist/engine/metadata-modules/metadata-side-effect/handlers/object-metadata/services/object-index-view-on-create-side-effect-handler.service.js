"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "ObjectIndexViewOnCreateSideEffectHandlerService", {
    enumerable: true,
    get: function() {
        return ObjectIndexViewOnCreateSideEffectHandlerService;
    }
});
const _application = require("twenty-shared/application");
const _common = require("@nestjs/common");
const _utils = require("twenty-shared/utils");
const _computesystemviewfieldsforcreatedobjectviewutil = require("../../utils/compute-system-view-fields-for-created-object-view.util");
const _computesystemviewtocreateutil = require("../../utils/compute-system-view-to-create.util");
const _basemetadatasideeffecthandlerservice = require("../../../interfaces/base-metadata-side-effect-handler.service");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let ObjectIndexViewOnCreateSideEffectHandlerService = class ObjectIndexViewOnCreateSideEffectHandlerService extends (0, _basemetadatasideeffecthandlerservice.MetadataSideEffectHandler)({
    operation: 'create',
    metadataName: 'objectMetadata',
    name: 'objectIndexViewOnCreate',
    description: 'When an object is created, provision its default INDEX table view ("All {objectLabelPlural}") with one view field per displayable SYSTEM field only, all isSystemSideEffect so the engine owns their lifecycle. The reserved system fields themselves are created by objectSystemFieldsOnCreate; this handler re-derives them statelessly from the object identity, so there is no ordering dependency between the two. View fields for caller-provided fields are owned by fieldIndexViewFieldOnCreate (the field creation side effect), which positions them before the system view fields; both handlers derive positions from the same caller-input list so the layout is contiguous without any ordering dependency. The view identifier is name-free (object identifier + INDEX view key), so an object rename keeps the same view. The engine is the sole owner of the INDEX view and always emits it: the flat view validator rejects caller-created INDEX views (caller inputs are forced isSystemSideEffect: false) and enforces a single non-deleted INDEX view per object. twenty-standard is not concerned: it synchronizes through the from/to migration path, which never runs the side-effect engine, and authors its own curated INDEX view/fields.'
}) {
    buildSideEffects({ flatEntity: sourceFlatObjectMetadata, allFlatEntityOperationRecordByMetadataName }) {
        const { applicationUniversalIdentifier } = sourceFlatObjectMetadata;
        const flatIndexViewToCreate = (0, _computesystemviewtocreateutil.computeSystemViewToCreate)({
            objectMetadata: sourceFlatObjectMetadata,
            applicationUniversalIdentifier,
            viewKey: _application.SYSTEM_VIEW_KEYS.INDEX
        });
        const flatViewFieldsToCreate = (0, _computesystemviewfieldsforcreatedobjectviewutil.computeSystemViewFieldsForCreatedObjectView)({
            sourceFlatObjectMetadata,
            viewUniversalIdentifier: flatIndexViewToCreate.universalIdentifier,
            allFlatEntityOperationRecordByMetadataName,
            labelIdentifierPolicy: 'displayedFirst'
        });
        return {
            status: 'success',
            operations: {
                view: {
                    flatEntityToCreate: {
                        [flatIndexViewToCreate.universalIdentifier]: flatIndexViewToCreate
                    }
                },
                viewField: {
                    flatEntityToCreate: (0, _utils.fromArrayToUniqueKeyRecord)({
                        array: flatViewFieldsToCreate,
                        uniqueKey: 'universalIdentifier'
                    })
                }
            }
        };
    }
};
ObjectIndexViewOnCreateSideEffectHandlerService = _ts_decorate([
    (0, _common.Injectable)()
], ObjectIndexViewOnCreateSideEffectHandlerService);

//# sourceMappingURL=object-index-view-on-create-side-effect-handler.service.js.map