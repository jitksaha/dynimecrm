/* @license Enterprise */ "use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "EventLogsViewerModule", {
    enumerable: true,
    get: function() {
        return EventLogsViewerModule;
    }
});
const _common = require("@nestjs/common");
const _typeorm = require("@nestjs/typeorm");
const _billingmodule = require("../billing/billing.module");
const _enterprisemodule = require("../enterprise/enterprise.module");
const _eventlogemittermodule = require("./emit/event-log-emitter.module");
const _eventlogemitterresolver = require("./emit/event-log-emitter.resolver");
const _eventloglivemodule = require("./live/event-log-live.module");
const _guardredirectmodule = require("../guard-redirect/guard-redirect.module");
const _jwtmodule = require("../jwt/jwt.module");
const _clickhousemodule = require("../../../database/clickhouse/clickhouse.module");
const _userworkspaceentity = require("../user-workspace/user-workspace.entity");
const _permissionsmodule = require("../../metadata-modules/permissions/permissions.module");
const _subscriptionsmodule = require("../../subscriptions/subscriptions.module");
const _eventlogsliveresolver = require("./event-logs-live.resolver");
const _eventlogsresolver = require("./event-logs.resolver");
const _eventlogsservice = require("./event-logs.service");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let EventLogsViewerModule = class EventLogsViewerModule {
};
EventLogsViewerModule = _ts_decorate([
    (0, _common.Module)({
        imports: [
            _clickhousemodule.ClickHouseModule,
            _permissionsmodule.PermissionsModule,
            _billingmodule.BillingModule,
            _enterprisemodule.EnterpriseModule,
            _guardredirectmodule.GuardRedirectModule,
            _jwtmodule.JwtModule,
            _eventloglivemodule.EventLogLiveModule,
            _eventlogemittermodule.EventLogEmitterModule,
            _subscriptionsmodule.SubscriptionsModule,
            _typeorm.TypeOrmModule.forFeature([
                _userworkspaceentity.UserWorkspaceEntity
            ])
        ],
        providers: [
            _eventlogsresolver.EventLogsResolver,
            _eventlogsliveresolver.EventLogsLiveResolver,
            _eventlogsservice.EventLogsService,
            _eventlogemitterresolver.EventLogEmitterResolver
        ],
        exports: [
            _eventlogsservice.EventLogsService
        ]
    })
], EventLogsViewerModule);

//# sourceMappingURL=event-logs-viewer.module.js.map