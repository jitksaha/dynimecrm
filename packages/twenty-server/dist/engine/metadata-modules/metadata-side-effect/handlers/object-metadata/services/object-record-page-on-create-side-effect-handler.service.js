"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "ObjectRecordPageOnCreateSideEffectHandlerService", {
    enumerable: true,
    get: function() {
        return ObjectRecordPageOnCreateSideEffectHandlerService;
    }
});
const _application = require("twenty-shared/application");
const _common = require("@nestjs/common");
const _utils = require("twenty-shared/utils");
const _computesystemrecordpagelayouttocreateutil = require("../../utils/compute-system-record-page-layout-to-create.util");
const _computesystemviewfieldsforcreatedobjectviewutil = require("../../utils/compute-system-view-fields-for-created-object-view.util");
const _computesystemviewtocreateutil = require("../../utils/compute-system-view-to-create.util");
const _basemetadatasideeffecthandlerservice = require("../../../interfaces/base-metadata-side-effect-handler.service");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let ObjectRecordPageOnCreateSideEffectHandlerService = class ObjectRecordPageOnCreateSideEffectHandlerService extends (0, _basemetadatasideeffecthandlerservice.MetadataSideEffectHandler)({
    operation: 'create',
    metadataName: 'objectMetadata',
    name: 'objectRecordPageOnCreate',
    description: 'When an object is created, provision its default record-page stack: the FIELDS_WIDGET record-page view ("{labelSingular} Record Page Fields", keyed on SYSTEM_VIEW_KEYS.FIELDS_WIDGET) with one view field per displayable SYSTEM field (the label identifier is excluded: the record page displays it in the title), and the RECORD_PAGE page layout with its 5 tabs (Home/Timeline/Tasks/Notes/Files) and 5 widgets, of which the Home FIELDS widget references the record-page view by universal identifier. All entities are isSystemSideEffect with name-free deterministic universal identifiers, so an object rename keeps every identifier. View fields for caller-provided fields are owned by fieldRecordPageViewFieldOnCreate; both handlers derive positions from the same caller-input list so the layout is contiguous without ordering dependency. The engine always emits the system record-page stack, exactly like INDEX. Caller-defined custom RECORD_PAGE layouts (e.g. manifest apps authoring a record page for their own objects) are legitimate and coexist with it: the frontend displays a custom record page over the system one when defined, and identifier squatting on engine emissions is caught by the side-effect collision detector. twenty-standard is not concerned: it synchronizes through the from/to migration path, which never runs the side-effect engine, and authors its own curated record-page stack on the same derived identifiers.'
}) {
    buildSideEffects({ flatEntity: sourceFlatObjectMetadata, allFlatEntityOperationRecordByMetadataName }) {
        const { applicationUniversalIdentifier } = sourceFlatObjectMetadata;
        const flatRecordPageViewToCreate = (0, _computesystemviewtocreateutil.computeSystemViewToCreate)({
            objectMetadata: sourceFlatObjectMetadata,
            applicationUniversalIdentifier,
            viewKey: _application.SYSTEM_VIEW_KEYS.FIELDS_WIDGET
        });
        const flatViewFieldsToCreate = (0, _computesystemviewfieldsforcreatedobjectviewutil.computeSystemViewFieldsForCreatedObjectView)({
            sourceFlatObjectMetadata,
            viewUniversalIdentifier: flatRecordPageViewToCreate.universalIdentifier,
            allFlatEntityOperationRecordByMetadataName,
            labelIdentifierPolicy: 'excluded'
        });
        const { pageLayouts, pageLayoutTabs, pageLayoutWidgets } = (0, _computesystemrecordpagelayouttocreateutil.computeSystemRecordPageLayoutToCreate)({
            objectMetadata: sourceFlatObjectMetadata,
            applicationUniversalIdentifier,
            recordPageFieldsViewUniversalIdentifier: flatRecordPageViewToCreate.universalIdentifier
        });
        return {
            status: 'success',
            operations: {
                view: {
                    flatEntityToCreate: {
                        [flatRecordPageViewToCreate.universalIdentifier]: flatRecordPageViewToCreate
                    }
                },
                viewField: {
                    flatEntityToCreate: (0, _utils.fromArrayToUniqueKeyRecord)({
                        array: flatViewFieldsToCreate,
                        uniqueKey: 'universalIdentifier'
                    })
                },
                pageLayout: {
                    flatEntityToCreate: (0, _utils.fromArrayToUniqueKeyRecord)({
                        array: pageLayouts,
                        uniqueKey: 'universalIdentifier'
                    })
                },
                pageLayoutTab: {
                    flatEntityToCreate: (0, _utils.fromArrayToUniqueKeyRecord)({
                        array: pageLayoutTabs,
                        uniqueKey: 'universalIdentifier'
                    })
                },
                pageLayoutWidget: {
                    flatEntityToCreate: (0, _utils.fromArrayToUniqueKeyRecord)({
                        array: pageLayoutWidgets,
                        uniqueKey: 'universalIdentifier'
                    })
                }
            }
        };
    }
};
ObjectRecordPageOnCreateSideEffectHandlerService = _ts_decorate([
    (0, _common.Injectable)()
], ObjectRecordPageOnCreateSideEffectHandlerService);

//# sourceMappingURL=object-record-page-on-create-side-effect-handler.service.js.map