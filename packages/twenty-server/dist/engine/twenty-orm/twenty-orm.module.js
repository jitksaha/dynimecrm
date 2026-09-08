"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "TwentyOrmModule", {
    enumerable: true,
    get: function() {
        return TwentyOrmModule;
    }
});
const _common = require("@nestjs/common");
const _typeorm = require("@nestjs/typeorm");
const _typeormmodule = require("../../database/typeorm/typeorm.module");
const _applicationentity = require("../core-modules/application/application.entity");
const _featureflagentity = require("../core-modules/feature-flag/feature-flag.entity");
const _twentyconfigmodule = require("../core-modules/twenty-config/twenty-config.module");
const _workspaceentity = require("../core-modules/workspace/workspace.entity");
const _fieldmetadataentity = require("../metadata-modules/field-metadata/field-metadata.entity");
const _workspacemanyorallflatentitymapscachemodule = require("../metadata-modules/flat-entity/services/workspace-many-or-all-flat-entity-maps-cache.module");
const _objectmetadataentity = require("../metadata-modules/object-metadata/object-metadata.entity");
const _workspacefeatureflagsmapcachemodule = require("../metadata-modules/workspace-feature-flags-map-cache/workspace-feature-flags-map-cache.module");
const _workspaceormmanager = require("./workspace-orm.manager");
const _workspaceormentitymetadatascacheservice = require("./workspace-orm-entity-metadatas-cache.service");
const _provideworkspacescopedrepository = require("./workspace-scoped-repository/provide-workspace-scoped-repository");
const _workspacedatasourceservice = require("./datasource/workspace-data-source.service");
const _workspacecachestoragemodule = require("../workspace-cache-storage/workspace-cache-storage.module");
const _workspacecachemodule = require("../workspace-cache/workspace-cache.module");
const _workspaceeventemittermodule = require("../workspace-event-emitter/workspace-event-emitter.module");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let TwentyOrmModule = class TwentyOrmModule {
};
TwentyOrmModule = _ts_decorate([
    (0, _common.Global)(),
    (0, _common.Module)({
        imports: [
            _typeormmodule.TypeORMModule,
            _typeorm.TypeOrmModule.forFeature([
                _workspaceentity.WorkspaceEntity,
                _objectmetadataentity.ObjectMetadataEntity,
                _fieldmetadataentity.FieldMetadataEntity,
                _applicationentity.ApplicationEntity,
                _featureflagentity.FeatureFlagEntity
            ]),
            _workspacecachestoragemodule.WorkspaceCacheStorageModule,
            _workspacemanyorallflatentitymapscachemodule.WorkspaceManyOrAllFlatEntityMapsCacheModule,
            _workspacefeatureflagsmapcachemodule.WorkspaceFeatureFlagsMapCacheModule,
            _twentyconfigmodule.TwentyConfigModule,
            _workspaceeventemittermodule.WorkspaceEventEmitterModule,
            _workspacecachemodule.WorkspaceCacheModule
        ],
        providers: [
            _workspaceormmanager.WorkspaceOrmManager,
            _workspacedatasourceservice.WorkspaceDataSourceService,
            _workspaceormentitymetadatascacheservice.WorkspaceORMEntityMetadatasCacheService,
            (0, _provideworkspacescopedrepository.provideWorkspaceScopedRepository)(_featureflagentity.FeatureFlagEntity)
        ],
        exports: [
            _workspaceormmanager.WorkspaceOrmManager
        ]
    })
], TwentyOrmModule);

//# sourceMappingURL=twenty-orm.module.js.map