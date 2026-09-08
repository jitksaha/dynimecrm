"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "FieldMetadataModule", {
    enumerable: true,
    get: function() {
        return FieldMetadataModule;
    }
});
const _common = require("@nestjs/common");
const _applicationtranslationcatalogmodule = require("../application-translation-catalog/application-translation-catalog.module");
const _typeorm = require("@nestjs/typeorm");
const _typeormmodule = require("../../../database/typeorm/typeorm.module");
const _actormodule = require("../../core-modules/actor/actor.module");
const _applicationmodule = require("../../core-modules/application/application.module");
const _applicationtranslationmodule = require("../../core-modules/application/application-translation/application-translation.module");
const _tokenmodule = require("../../core-modules/auth/token/token.module");
const _featureflagmodule = require("../../core-modules/feature-flag/feature-flag.module");
const _fieldmetadatacontroller = require("./controllers/field-metadata.controller");
const _fieldmetadataresolver = require("./field-metadata.resolver");
const _fieldmetadataservice = require("./services/field-metadata.service");
const _fieldmetadatatoolsfactory = require("./tools/field-metadata-tools.factory");
const _workspacemanyorallflatentitymapscachemodule = require("../flat-entity/services/workspace-many-or-all-flat-entity-maps-cache.module");
const _flatfieldmetadatamodule = require("../flat-field-metadata/flat-field-metadata.module");
const _indexmetadatamodule = require("../index-metadata/index-metadata.module");
const _objectmetadataentity = require("../object-metadata/object-metadata.entity");
const _objectmetadatamodule = require("../object-metadata/object-metadata.module");
const _permissionsmodule = require("../permissions/permissions.module");
const _viewfieldmodule = require("../view-field/view-field.module");
const _viewfiltermodule = require("../view-filter/view-filter.module");
const _viewgroupmodule = require("../view-group/view-group.module");
const _viewmodule = require("../view/view.module");
const _workspacecachestoragemodule = require("../../workspace-cache-storage/workspace-cache-storage.module");
const _workspacemigrationmodule = require("../../workspace-manager/workspace-migration/workspace-migration.module");
const _workspacecachemodule = require("../../workspace-cache/workspace-cache.module");
const _fieldmetadataentity = require("./field-metadata.entity");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let FieldMetadataModule = class FieldMetadataModule {
};
FieldMetadataModule = _ts_decorate([
    (0, _common.Module)({
        imports: [
            _applicationtranslationcatalogmodule.ApplicationTranslationCatalogModule,
            _typeorm.TypeOrmModule.forFeature([
                _fieldmetadataentity.FieldMetadataEntity,
                _objectmetadataentity.ObjectMetadataEntity
            ]),
            _applicationmodule.ApplicationModule,
            _applicationtranslationmodule.ApplicationTranslationModule,
            _tokenmodule.TokenModule,
            _workspacecachestoragemodule.WorkspaceCacheStorageModule,
            _featureflagmodule.FeatureFlagModule,
            _workspacemanyorallflatentitymapscachemodule.WorkspaceManyOrAllFlatEntityMapsCacheModule,
            _objectmetadatamodule.ObjectMetadataModule,
            _typeormmodule.TypeORMModule,
            _actormodule.ActorModule,
            _viewmodule.ViewModule,
            _viewfieldmodule.ViewFieldModule,
            _viewfiltermodule.ViewFilterModule,
            _viewgroupmodule.ViewGroupModule,
            _permissionsmodule.PermissionsModule,
            _workspacemigrationmodule.WorkspaceMigrationModule,
            _flatfieldmetadatamodule.FlatFieldMetadataModule,
            _indexmetadatamodule.IndexMetadataModule,
            _workspacecachemodule.WorkspaceCacheModule
        ],
        controllers: [
            _fieldmetadatacontroller.FieldMetadataController
        ],
        providers: [
            _fieldmetadataservice.FieldMetadataService,
            _fieldmetadataresolver.FieldMetadataResolver,
            _fieldmetadatatoolsfactory.FieldMetadataToolsFactory
        ],
        exports: [
            _fieldmetadataservice.FieldMetadataService,
            _fieldmetadatatoolsfactory.FieldMetadataToolsFactory
        ]
    })
], FieldMetadataModule);

//# sourceMappingURL=field-metadata.module.js.map