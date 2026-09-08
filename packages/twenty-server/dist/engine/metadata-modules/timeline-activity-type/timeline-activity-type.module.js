"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "TimelineActivityTypeModule", {
    enumerable: true,
    get: function() {
        return TimelineActivityTypeModule;
    }
});
const _common = require("@nestjs/common");
const _applicationmodule = require("../../core-modules/application/application.module");
const _applicationtranslationcatalogmodule = require("../application-translation-catalog/application-translation-catalog.module");
const _workspacemanyorallflatentitymapscachemodule = require("../flat-entity/services/workspace-many-or-all-flat-entity-maps-cache.module");
const _permissionsmodule = require("../permissions/permissions.module");
const _timelineactivitytyperesolver = require("./timeline-activity-type.resolver");
const _timelineactivitytypeservice = require("./timeline-activity-type.service");
const _timelineactivitytypegraphqlapiexceptioninterceptor = require("./interceptors/timeline-activity-type-graphql-api-exception.interceptor");
const _workspacemigrationgraphqlapiexceptioninterceptor = require("../../workspace-manager/workspace-migration/interceptors/workspace-migration-graphql-api-exception.interceptor");
const _workspacemigrationmodule = require("../../workspace-manager/workspace-migration/workspace-migration.module");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let TimelineActivityTypeModule = class TimelineActivityTypeModule {
};
TimelineActivityTypeModule = _ts_decorate([
    (0, _common.Module)({
        imports: [
            _applicationtranslationcatalogmodule.ApplicationTranslationCatalogModule,
            _workspacemanyorallflatentitymapscachemodule.WorkspaceManyOrAllFlatEntityMapsCacheModule,
            _applicationmodule.ApplicationModule,
            _permissionsmodule.PermissionsModule,
            _workspacemigrationmodule.WorkspaceMigrationModule
        ],
        providers: [
            _timelineactivitytypeservice.TimelineActivityTypeService,
            _timelineactivitytyperesolver.TimelineActivityTypeResolver,
            _timelineactivitytypegraphqlapiexceptioninterceptor.TimelineActivityTypeGraphqlApiExceptionInterceptor,
            _workspacemigrationgraphqlapiexceptioninterceptor.WorkspaceMigrationGraphqlApiExceptionInterceptor
        ],
        exports: [
            _timelineactivitytypeservice.TimelineActivityTypeService
        ]
    })
], TimelineActivityTypeModule);

//# sourceMappingURL=timeline-activity-type.module.js.map