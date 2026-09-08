"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "ViewPermissionsModule", {
    enumerable: true,
    get: function() {
        return ViewPermissionsModule;
    }
});
const _common = require("@nestjs/common");
const _typeorm = require("@nestjs/typeorm");
const _applicationmodule = require("../../core-modules/application/application.module");
const _i18nmodule = require("../../core-modules/i18n/i18n.module");
const _workspacemanyorallflatentitymapscachemodule = require("../flat-entity/services/workspace-many-or-all-flat-entity-maps-cache.module");
const _permissionsmodule = require("../permissions/permissions.module");
const _viewfieldentity = require("../view-field/entities/view-field.entity");
const _viewfiltergroupentity = require("../view-filter-group/entities/view-filter-group.entity");
const _viewfilterentity = require("../view-filter/entities/view-filter.entity");
const _viewgroupentity = require("../view-group/entities/view-group.entity");
const _viewaccessservice = require("./services/view-access.service");
const _viewentitylookupservice = require("./services/view-entity-lookup.service");
const _viewsortentity = require("../view-sort/entities/view-sort.entity");
const _viewentity = require("../view/entities/view.entity");
const _viewservice = require("../view/services/view.service");
const _provideworkspacescopedrepository = require("../../twenty-orm/workspace-scoped-repository/provide-workspace-scoped-repository");
const _workspacecachestoragemodule = require("../../workspace-cache-storage/workspace-cache-storage.module");
const _workspacemigrationmodule = require("../../workspace-manager/workspace-migration/workspace-migration.module");
const _createviewchildentitypermissionguard = require("./guards/create-view-child-entity-permission.guard");
const _viewpermissionguard = require("./guards/view-permission.guard");
const _createviewpermissionguard = require("./guards/create-view-permission.guard");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let ViewPermissionsModule = class ViewPermissionsModule {
};
ViewPermissionsModule = _ts_decorate([
    (0, _common.Module)({
        imports: [
            _typeorm.TypeOrmModule.forFeature([
                _viewentity.ViewEntity,
                _viewfieldentity.ViewFieldEntity,
                _viewfilterentity.ViewFilterEntity,
                _viewfiltergroupentity.ViewFilterGroupEntity,
                _viewgroupentity.ViewGroupEntity,
                _viewsortentity.ViewSortEntity
            ]),
            _applicationmodule.ApplicationModule,
            _i18nmodule.I18nModule,
            _permissionsmodule.PermissionsModule,
            _workspacecachestoragemodule.WorkspaceCacheStorageModule,
            _workspacemanyorallflatentitymapscachemodule.WorkspaceManyOrAllFlatEntityMapsCacheModule,
            _workspacemigrationmodule.WorkspaceMigrationModule
        ],
        providers: [
            _viewservice.ViewService,
            _viewentitylookupservice.ViewEntityLookupService,
            _viewaccessservice.ViewAccessService,
            _createviewpermissionguard.CreateViewPermissionGuard,
            _createviewchildentitypermissionguard.CreateViewChildEntityPermissionGuard,
            _viewpermissionguard.ViewPermissionGuard,
            (0, _provideworkspacescopedrepository.provideWorkspaceScopedRepository)(_viewentity.ViewEntity),
            (0, _provideworkspacescopedrepository.provideWorkspaceScopedRepository)(_viewfieldentity.ViewFieldEntity),
            (0, _provideworkspacescopedrepository.provideWorkspaceScopedRepository)(_viewfilterentity.ViewFilterEntity),
            (0, _provideworkspacescopedrepository.provideWorkspaceScopedRepository)(_viewfiltergroupentity.ViewFilterGroupEntity),
            (0, _provideworkspacescopedrepository.provideWorkspaceScopedRepository)(_viewgroupentity.ViewGroupEntity),
            (0, _provideworkspacescopedrepository.provideWorkspaceScopedRepository)(_viewsortentity.ViewSortEntity)
        ],
        exports: [
            _viewservice.ViewService,
            _viewentitylookupservice.ViewEntityLookupService,
            _viewaccessservice.ViewAccessService,
            _createviewpermissionguard.CreateViewPermissionGuard,
            _createviewchildentitypermissionguard.CreateViewChildEntityPermissionGuard,
            _viewpermissionguard.ViewPermissionGuard
        ]
    })
], ViewPermissionsModule);

//# sourceMappingURL=view-permissions.module.js.map