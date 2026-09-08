"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "IndexMetadataModule", {
    enumerable: true,
    get: function() {
        return IndexMetadataModule;
    }
});
const _common = require("@nestjs/common");
const _typeorm = require("@nestjs/typeorm");
const _applicationmodule = require("../../core-modules/application/application.module");
const _workspacemanyorallflatentitymapscachemodule = require("../flat-entity/services/workspace-many-or-all-flat-entity-maps-cache.module");
const _indexmetadataentity = require("./index-metadata.entity");
const _indexmetadataresolver = require("./index-metadata.resolver");
const _indexmetadataservice = require("./services/index-metadata.service");
const _uniquefieldmetadataidsservice = require("./services/unique-field-metadata-ids.service");
const _permissionsmodule = require("../permissions/permissions.module");
const _workspacemigrationmodule = require("../../workspace-manager/workspace-migration/workspace-migration.module");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let IndexMetadataModule = class IndexMetadataModule {
};
IndexMetadataModule = _ts_decorate([
    (0, _common.Module)({
        imports: [
            _typeorm.TypeOrmModule.forFeature([
                _indexmetadataentity.IndexMetadataEntity
            ]),
            _applicationmodule.ApplicationModule,
            _permissionsmodule.PermissionsModule,
            _workspacemigrationmodule.WorkspaceMigrationModule,
            _workspacemanyorallflatentitymapscachemodule.WorkspaceManyOrAllFlatEntityMapsCacheModule
        ],
        providers: [
            _indexmetadataresolver.IndexMetadataResolver,
            _indexmetadataservice.IndexMetadataService,
            _uniquefieldmetadataidsservice.UniqueFieldMetadataIdsService
        ],
        exports: [
            _indexmetadataservice.IndexMetadataService,
            _uniquefieldmetadataidsservice.UniqueFieldMetadataIdsService
        ]
    })
], IndexMetadataModule);

//# sourceMappingURL=index-metadata.module.js.map