"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "EventLogsLiveResolver", {
    enumerable: true,
    get: function() {
        return EventLogsLiveResolver;
    }
});
const _common = require("@nestjs/common");
const _graphql = require("@nestjs/graphql");
const _constants = require("twenty-shared/constants");
const _types = require("twenty-shared/types");
const _metadataresolverdecorator = require("../../api/graphql/graphql-config/decorators/metadata-resolver.decorator");
const _authgraphqlapiexceptionfilter = require("../auth/filters/auth-graphql-api-exception.filter");
const _eventlogsgraphqlapiexceptionfilter = require("./filters/event-logs-graphql-api-exception.filter");
const _forbiddenexceptiongraphqlfilter = require("./filters/forbidden-exception-graphql.filter");
const _preventnesttoautologgraphqlerrorsfilter = require("../graphql/filters/prevent-nest-to-auto-log-graphql-errors.filter");
const _resolvervalidationpipe = require("../graphql/pipes/resolver-validation.pipe");
const _workspaceentity = require("../workspace/workspace.entity");
const _authworkspacedecorator = require("../../decorators/auth/auth-workspace.decorator");
const _settingspermissionguard = require("../../guards/settings-permission.guard");
const _workspaceauthguard = require("../../guards/workspace-auth.guard");
const _permissionsgraphqlapiexceptionfilter = require("../../metadata-modules/permissions/utils/permissions-graphql-api-exception.filter");
const _applicationkeepaliveintervalmsconstant = require("../../subscriptions/constants/application-keepalive-interval-ms.constant");
const _subscriptionchannelenum = require("../../subscriptions/enums/subscription-channel.enum");
const _subscriptionservice = require("../../subscriptions/subscription.service");
const _wrapasynciteratorwithlifecycle = require("../../subscriptions/utils/wrap-async-iterator-with-lifecycle");
const _eventlogliveservice = require("./live/event-log-live.service");
const _eventlogsservice = require("./event-logs.service");
const _eventlogresultdto = require("./dtos/event-log-result.dto");
const _eventlogregistry = require("./registry/event-log-registry");
const _normalizeeventlogrecords = require("./utils/normalize-event-log-records");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
function _ts_param(paramIndex, decorator) {
    return function(target, key) {
        decorator(target, key, paramIndex);
    };
}
let EventLogsLiveResolver = class EventLogsLiveResolver {
    async eventLogsLive(table, workspace) {
        await this.eventLogsService.validateAccess(workspace.id, table);
        const clickHouseTable = (0, _eventlogregistry.getClickHouseTableName)(table);
        await this.workspaceEventLiveService.markWatched(workspace.id, clickHouseTable);
        const iterator = await this.subscriptionService.subscribe({
            channel: _subscriptionchannelenum.SubscriptionChannel.WORKSPACE_EVENTS_CHANNEL,
            workspaceId: workspace.id
        });
        return (0, _wrapasynciteratorwithlifecycle.wrapAsyncIteratorWithLifecycle)(iterator, {
            onHeartbeat: async ()=>{
                await this.workspaceEventLiveService.markWatched(workspace.id, clickHouseTable);
                return true;
            },
            heartbeatIntervalMs: _applicationkeepaliveintervalmsconstant.APPLICATION_KEEPALIVE_INTERVAL_MS
        });
    }
    constructor(eventLogsService, subscriptionService, workspaceEventLiveService){
        this.eventLogsService = eventLogsService;
        this.subscriptionService = subscriptionService;
        this.workspaceEventLiveService = workspaceEventLiveService;
    }
};
_ts_decorate([
    (0, _common.UseGuards)(_workspaceauthguard.WorkspaceAuthGuard, (0, _settingspermissionguard.SettingsPermissionGuard)(_constants.PermissionFlagType.SECURITY)),
    (0, _graphql.Subscription)(()=>[
            _eventlogresultdto.EventLogRecord
        ], {
        nullable: true,
        filter: (payload, variables)=>(0, _eventlogregistry.getClickHouseTableName)(variables.table) === payload.table,
        resolve: (payload, variables)=>(0, _normalizeeventlogrecords.normalizeEventLogRecords)(payload.rows, variables.table)
    }),
    _ts_param(0, (0, _graphql.Args)('table', {
        type: ()=>_types.EventLogTable
    })),
    _ts_param(1, (0, _authworkspacedecorator.AuthWorkspace)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _types.EventLogTable === "undefined" ? Object : _types.EventLogTable,
        typeof _workspaceentity.WorkspaceEntity === "undefined" ? Object : _workspaceentity.WorkspaceEntity
    ]),
    _ts_metadata("design:returntype", Promise)
], EventLogsLiveResolver.prototype, "eventLogsLive", null);
EventLogsLiveResolver = _ts_decorate([
    (0, _metadataresolverdecorator.MetadataResolver)(),
    (0, _common.UseFilters)(_forbiddenexceptiongraphqlfilter.ForbiddenExceptionGraphqlFilter, _authgraphqlapiexceptionfilter.AuthGraphqlApiExceptionFilter, _eventlogsgraphqlapiexceptionfilter.EventLogsGraphqlApiExceptionFilter, _permissionsgraphqlapiexceptionfilter.PermissionsGraphqlApiExceptionFilter, _preventnesttoautologgraphqlerrorsfilter.PreventNestToAutoLogGraphqlErrorsFilter),
    (0, _common.UsePipes)(_resolvervalidationpipe.ResolverValidationPipe),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _eventlogsservice.EventLogsService === "undefined" ? Object : _eventlogsservice.EventLogsService,
        typeof _subscriptionservice.SubscriptionService === "undefined" ? Object : _subscriptionservice.SubscriptionService,
        typeof _eventlogliveservice.EventLogLiveService === "undefined" ? Object : _eventlogliveservice.EventLogLiveService
    ])
], EventLogsLiveResolver);

//# sourceMappingURL=event-logs-live.resolver.js.map