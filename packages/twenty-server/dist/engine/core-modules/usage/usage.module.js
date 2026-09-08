/* @license Enterprise */ "use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "UsageModule", {
    enumerable: true,
    get: function() {
        return UsageModule;
    }
});
const _common = require("@nestjs/common");
const _typeorm = require("@nestjs/typeorm");
const _clickhousemodule = require("../../../database/clickhouse/clickhouse.module");
const _eventlogemittermodule = require("../event-logs/emit/event-log-emitter.module");
const _featureflagmodule = require("../feature-flag/feature-flag.module");
const _usageeventlistener = require("./listeners/usage-event.listener");
const _usageanalyticsservice = require("./services/usage-analytics.service");
const _usagerecorderservice = require("./services/usage-recorder.service");
const _usageresolver = require("./usage.resolver");
const _userworkspaceentity = require("../user-workspace/user-workspace.entity");
const _permissionsmodule = require("../../metadata-modules/permissions/permissions.module");
const _workspacecachemodule = require("../../workspace-cache/workspace-cache.module");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let UsageModule = class UsageModule {
};
UsageModule = _ts_decorate([
    (0, _common.Module)({
        imports: [
            _clickhousemodule.ClickHouseModule,
            _eventlogemittermodule.EventLogEmitterModule,
            _featureflagmodule.FeatureFlagModule,
            _permissionsmodule.PermissionsModule,
            _typeorm.TypeOrmModule.forFeature([
                _userworkspaceentity.UserWorkspaceEntity
            ]),
            _workspacecachemodule.WorkspaceCacheModule
        ],
        providers: [
            _usageresolver.UsageResolver,
            _usageanalyticsservice.UsageAnalyticsService,
            _usagerecorderservice.UsageRecorderService,
            _usageeventlistener.UsageEventListener
        ],
        exports: [
            _usageanalyticsservice.UsageAnalyticsService,
            _usagerecorderservice.UsageRecorderService
        ]
    })
], UsageModule);

//# sourceMappingURL=usage.module.js.map