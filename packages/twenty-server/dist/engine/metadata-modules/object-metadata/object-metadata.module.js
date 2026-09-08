"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "ObjectMetadataModule", {
    enumerable: true,
    get: function() {
        return ObjectMetadataModule;
    }
});
const _common = require("@nestjs/common");
const _applicationtranslationcatalogmodule = require("../application-translation-catalog/application-translation-catalog.module");
const _typeorm = require("@nestjs/typeorm");
const _typeormmodule = require("../../../database/typeorm/typeorm.module");
const _applicationtranslationmodule = require("../../core-modules/application/application-translation/application-translation.module");
const _applicationmodule = require("../../core-modules/application/application.module");
const _tokenmodule = require("../../core-modules/auth/token/token.module");
const _featureflagentity = require("../../core-modules/feature-flag/feature-flag.entity");
const _featureflagmodule = require("../../core-modules/feature-flag/feature-flag.module");
const _fieldmetadataentity = require("../field-metadata/field-metadata.entity");
const _workspacemanyorallflatentitymapscachemodule = require("../flat-entity/services/workspace-many-or-all-flat-entity-maps-cache.module");
const _indexmetadatamodule = require("../index-metadata/index-metadata.module");
const _objectmetadatacontroller = require("./controllers/object-metadata.controller");
const _mostlyemptyfieldsservice = require("./mostly-empty-fields.service");
const _objectmetadataentity = require("./object-metadata.entity");
const _objectmetadataresolver = require("./object-metadata.resolver");
const _objectmetadataservice = require("./object-metadata.service");
const _objectrecordcountservice = require("./object-record-count.service");
const _objectmetadatatoolsfactory = require("./tools/object-metadata-tools.factory");
const _permissionsmodule = require("../permissions/permissions.module");
const _viewfieldmodule = require("../view-field/view-field.module");
const _viewentity = require("../view/entities/view.entity");
const _viewmodule = require("../view/view.module");
const _workspacecachestoragemodule = require("../../workspace-cache-storage/workspace-cache-storage.module");
const _workspacecachemodule = require("../../workspace-cache/workspace-cache.module");
const _workspacedatasourcemodule = require("../../workspace-datasource/workspace-datasource.module");
const _workspacemigrationmodule = require("../../workspace-manager/workspace-migration/workspace-migration.module");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let ObjectMetadataModule = class ObjectMetadataModule {
};
ObjectMetadataModule = _ts_decorate([
    (0, _common.Module)({
        imports: [
            _applicationtranslationcatalogmodule.ApplicationTranslationCatalogModule,
            _typeorm.TypeOrmModule.forFeature([
                _objectmetadataentity.ObjectMetadataEntity,
                _fieldmetadataentity.FieldMetadataEntity,
                _featureflagentity.FeatureFlagEntity,
                _viewentity.ViewEntity
            ]),
            _tokenmodule.TokenModule,
            _workspacecachestoragemodule.WorkspaceCacheStorageModule,
            _featureflagmodule.FeatureFlagModule,
            _applicationmodule.ApplicationModule,
            _applicationtranslationmodule.ApplicationTranslationModule,
            _workspacemanyorallflatentitymapscachemodule.WorkspaceManyOrAllFlatEntityMapsCacheModule,
            _typeormmodule.TypeORMModule,
            _indexmetadatamodule.IndexMetadataModule,
            _permissionsmodule.PermissionsModule,
            _workspacedatasourcemodule.WorkspaceDataSourceModule,
            _workspacemigrationmodule.WorkspaceMigrationModule,
            _viewmodule.ViewModule,
            _viewfieldmodule.ViewFieldModule,
            _workspacecachemodule.WorkspaceCacheModule
        ],
        controllers: [
            _objectmetadatacontroller.ObjectMetadataController
        ],
        providers: [
            _objectmetadataservice.ObjectMetadataService,
            _objectmetadataresolver.ObjectMetadataResolver,
            _objectrecordcountservice.ObjectRecordCountService,
            _mostlyemptyfieldsservice.MostlyEmptyFieldsService,
            _objectmetadatatoolsfactory.ObjectMetadataToolsFactory
        ],
        exports: [
            _objectmetadataservice.ObjectMetadataService,
            _objectmetadatatoolsfactory.ObjectMetadataToolsFactory
        ]
    })
], ObjectMetadataModule);

//# sourceMappingURL=object-metadata.module.js.map