"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "EventLogEmitterResolver", {
    enumerable: true,
    get: function() {
        return EventLogEmitterResolver;
    }
});
const _common = require("@nestjs/common");
const _graphql = require("@nestjs/graphql");
const _metadataresolverdecorator = require("../../../api/graphql/graphql-config/decorators/metadata-resolver.decorator");
const _eventlogemitterexceptionfilter = require("./event-log-emitter-exception.filter");
const _eventlogemitterexception = require("./event-log-emitter.exception");
const _createobjecteventinput = require("./dtos/create-object-event.input");
const _preventnesttoautologgraphqlerrorsfilter = require("../../graphql/filters/prevent-nest-to-auto-log-graphql-errors.filter");
const _resolvervalidationpipe = require("../../graphql/pipes/resolver-validation.pipe");
const _authuserdecorator = require("../../../decorators/auth/auth-user.decorator");
const _authworkspacedecorator = require("../../../decorators/auth/auth-workspace.decorator");
const _nopermissionguard = require("../../../guards/no-permission.guard");
const _publicendpointguard = require("../../../guards/public-endpoint.guard");
const _workspaceauthguard = require("../../../guards/workspace-auth.guard");
const _analyticsdto = require("./dtos/analytics.dto");
const _createanalyticsinput = require("./dtos/create-analytics.input");
const _eventlogemitterservice = require("./event-log-emitter.service");
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
let EventLogEmitterResolver = class EventLogEmitterResolver {
    async createObjectEvent(createObjectEventInput, workspace, user) {
        if (!workspace) {
            throw new _eventlogemitterexception.EventLogEmitterException('Missing workspace', _eventlogemitterexception.EventLogEmitterExceptionCode.INVALID_INPUT);
        }
        const eventLogContext = this.eventLogEmitterService.createContext({
            workspaceId: workspace.id,
            userId: user?.id
        });
        return eventLogContext.createObjectEvent(createObjectEventInput.event, {
            ...createObjectEventInput.properties,
            recordId: createObjectEventInput.recordId,
            objectMetadataId: createObjectEventInput.objectMetadataId,
            isCustom: true
        });
    }
    async trackAnalytics(createAnalyticsInput, workspace, user) {
        const eventLogContext = this.eventLogEmitterService.createContext({
            workspaceId: workspace?.id,
            userId: user?.id
        });
        if ((0, _createanalyticsinput.isPageviewAnalyticsInput)(createAnalyticsInput)) {
            return eventLogContext.createPageviewEvent(createAnalyticsInput.name, createAnalyticsInput.properties ?? {});
        }
        if ((0, _createanalyticsinput.isTrackAnalyticsInput)(createAnalyticsInput)) {
            return eventLogContext.insertWorkspaceEvent(createAnalyticsInput.event, createAnalyticsInput.properties ?? {});
        }
        throw new _eventlogemitterexception.EventLogEmitterException('Invalid analytics input', _eventlogemitterexception.EventLogEmitterExceptionCode.INVALID_TYPE);
    }
    constructor(eventLogEmitterService){
        this.eventLogEmitterService = eventLogEmitterService;
    }
};
_ts_decorate([
    (0, _graphql.Mutation)(()=>_analyticsdto.Analytics),
    (0, _common.UseGuards)(_workspaceauthguard.WorkspaceAuthGuard, _nopermissionguard.NoPermissionGuard),
    _ts_param(0, (0, _graphql.Args)()),
    _ts_param(1, (0, _authworkspacedecorator.AuthWorkspace)()),
    _ts_param(2, (0, _authuserdecorator.AuthUser)({
        allowUndefined: true
    })),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _createobjecteventinput.CreateObjectEventInput === "undefined" ? Object : _createobjecteventinput.CreateObjectEventInput,
        Object,
        Object
    ]),
    _ts_metadata("design:returntype", Promise)
], EventLogEmitterResolver.prototype, "createObjectEvent", null);
_ts_decorate([
    (0, _graphql.Mutation)(()=>_analyticsdto.Analytics),
    (0, _common.UseGuards)(_publicendpointguard.PublicEndpointGuard, _nopermissionguard.NoPermissionGuard),
    _ts_param(0, (0, _graphql.Args)()),
    _ts_param(1, (0, _authworkspacedecorator.AuthWorkspace)({
        allowUndefined: true
    })),
    _ts_param(2, (0, _authuserdecorator.AuthUser)({
        allowUndefined: true
    })),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _createanalyticsinput.CreateAnalyticsInputV2 === "undefined" ? Object : _createanalyticsinput.CreateAnalyticsInputV2,
        Object,
        Object
    ]),
    _ts_metadata("design:returntype", Promise)
], EventLogEmitterResolver.prototype, "trackAnalytics", null);
EventLogEmitterResolver = _ts_decorate([
    (0, _metadataresolverdecorator.MetadataResolver)(()=>_analyticsdto.Analytics),
    (0, _common.UsePipes)(_resolvervalidationpipe.ResolverValidationPipe),
    (0, _common.UseFilters)(_eventlogemitterexceptionfilter.EventLogEmitterExceptionFilter, _preventnesttoautologgraphqlerrorsfilter.PreventNestToAutoLogGraphqlErrorsFilter),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _eventlogemitterservice.EventLogEmitterService === "undefined" ? Object : _eventlogemitterservice.EventLogEmitterService
    ])
], EventLogEmitterResolver);

//# sourceMappingURL=event-log-emitter.resolver.js.map