"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "MetadataSideEffectHandlersModule", {
    enumerable: true,
    get: function() {
        return MetadataSideEffectHandlersModule;
    }
});
const _common = require("@nestjs/common");
const _fieldsearchfieldmetadataondeletesideeffecthandlerservice = require("./field-metadata/services/field-search-field-metadata-on-delete-side-effect-handler.service");
const _fieldindexviewfieldoncreatesideeffecthandlerservice = require("./field-metadata/services/field-index-view-field-on-create-side-effect-handler.service");
const _fieldrecordpageviewfieldoncreatesideeffecthandlerservice = require("./field-metadata/services/field-record-page-view-field-on-create-side-effect-handler.service");
const _fieldsystemviewfieldsondeletesideeffecthandlerservice = require("./field-metadata/services/field-system-view-fields-on-delete-side-effect-handler.service");
const _fielduniquebackingindexoncreatesideeffecthandlerservice = require("./field-metadata/services/field-unique-backing-index-on-create-side-effect-handler.service");
const _fielduniquebackingindexondeletesideeffecthandlerservice = require("./field-metadata/services/field-unique-backing-index-on-delete-side-effect-handler.service");
const _fielduniquebackingindexonupdatesideeffecthandlerservice = require("./field-metadata/services/field-unique-backing-index-on-update-side-effect-handler.service");
const _objectindexviewlabelidentifieronupdatesideeffecthandlerservice = require("./object-metadata/services/object-index-view-label-identifier-on-update-side-effect-handler.service");
const _objectindexviewoncreatesideeffecthandlerservice = require("./object-metadata/services/object-index-view-on-create-side-effect-handler.service");
const _objectnavigationcommandoncreatesideeffecthandlerservice = require("./object-metadata/services/object-navigation-command-on-create-side-effect-handler.service");
const _objectnavigationcommandonupdatesideeffecthandlerservice = require("./object-metadata/services/object-navigation-command-on-update-side-effect-handler.service");
const _objectrecordpagelabelidentifieronupdatesideeffecthandlerservice = require("./object-metadata/services/object-record-page-label-identifier-on-update-side-effect-handler.service");
const _objectrecordpageoncreatesideeffecthandlerservice = require("./object-metadata/services/object-record-page-on-create-side-effect-handler.service");
const _objectsearchvectoroncreatesideeffecthandlerservice = require("./object-metadata/services/object-search-vector-on-create-side-effect-handler.service");
const _objectsearchvectoronupdatesideeffecthandlerservice = require("./object-metadata/services/object-search-vector-on-update-side-effect-handler.service");
const _objectsystemfieldsoncreatesideeffecthandlerservice = require("./object-metadata/services/object-system-fields-on-create-side-effect-handler.service");
const _objectsystemrelationsoncreatesideeffecthandlerservice = require("./object-metadata/services/object-system-relations-on-create-side-effect-handler.service");
const _objectsystemrelationsonupdatesideeffecthandlerservice = require("./object-metadata/services/object-system-relations-on-update-side-effect-handler.service");
const _objectsystemsideeffectsondeletesideeffecthandlerservice = require("./object-metadata/services/object-system-side-effects-on-delete-side-effect-handler.service");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let MetadataSideEffectHandlersModule = class MetadataSideEffectHandlersModule {
};
MetadataSideEffectHandlersModule = _ts_decorate([
    (0, _common.Module)({
        providers: [
            _fielduniquebackingindexoncreatesideeffecthandlerservice.FieldUniqueBackingIndexOnCreateSideEffectHandlerService,
            _fielduniquebackingindexonupdatesideeffecthandlerservice.FieldUniqueBackingIndexOnUpdateSideEffectHandlerService,
            _fielduniquebackingindexondeletesideeffecthandlerservice.FieldUniqueBackingIndexOnDeleteSideEffectHandlerService,
            _fieldsearchfieldmetadataondeletesideeffecthandlerservice.FieldSearchFieldMetadataOnDeleteSideEffectHandlerService,
            _fieldindexviewfieldoncreatesideeffecthandlerservice.FieldIndexViewFieldOnCreateSideEffectHandlerService,
            _fieldrecordpageviewfieldoncreatesideeffecthandlerservice.FieldRecordPageViewFieldOnCreateSideEffectHandlerService,
            _fieldsystemviewfieldsondeletesideeffecthandlerservice.FieldSystemViewFieldsOnDeleteSideEffectHandlerService,
            _objectsystemfieldsoncreatesideeffecthandlerservice.ObjectSystemFieldsOnCreateSideEffectHandlerService,
            _objectindexviewoncreatesideeffecthandlerservice.ObjectIndexViewOnCreateSideEffectHandlerService,
            _objectrecordpageoncreatesideeffecthandlerservice.ObjectRecordPageOnCreateSideEffectHandlerService,
            _objectnavigationcommandoncreatesideeffecthandlerservice.ObjectNavigationCommandOnCreateSideEffectHandlerService,
            _objectnavigationcommandonupdatesideeffecthandlerservice.ObjectNavigationCommandOnUpdateSideEffectHandlerService,
            _objectsystemrelationsoncreatesideeffecthandlerservice.ObjectSystemRelationsOnCreateSideEffectHandlerService,
            _objectsystemrelationsonupdatesideeffecthandlerservice.ObjectSystemRelationsOnUpdateSideEffectHandlerService,
            _objectsearchvectoroncreatesideeffecthandlerservice.ObjectSearchVectorOnCreateSideEffectHandlerService,
            _objectsearchvectoronupdatesideeffecthandlerservice.ObjectSearchVectorOnUpdateSideEffectHandlerService,
            _objectindexviewlabelidentifieronupdatesideeffecthandlerservice.ObjectIndexViewLabelIdentifierOnUpdateSideEffectHandlerService,
            _objectrecordpagelabelidentifieronupdatesideeffecthandlerservice.ObjectRecordPageLabelIdentifierOnUpdateSideEffectHandlerService,
            _objectsystemsideeffectsondeletesideeffecthandlerservice.ObjectSystemSideEffectsOnDeleteSideEffectHandlerService
        ]
    })
], MetadataSideEffectHandlersModule);

//# sourceMappingURL=metadata-side-effect-handlers.module.js.map