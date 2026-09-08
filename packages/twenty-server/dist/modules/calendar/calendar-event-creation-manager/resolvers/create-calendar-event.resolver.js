"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "CreateCalendarEventResolver", {
    enumerable: true,
    get: function() {
        return CreateCalendarEventResolver;
    }
});
const _common = require("@nestjs/common");
const _graphql = require("@nestjs/graphql");
const _constants = require("twenty-shared/constants");
const _metadataresolverdecorator = require("../../../../engine/api/graphql/graphql-config/decorators/metadata-resolver.decorator");
const _authgraphqlapiexceptionfilter = require("../../../../engine/core-modules/auth/filters/auth-graphql-api-exception.filter");
const _resolvervalidationpipe = require("../../../../engine/core-modules/graphql/pipes/resolver-validation.pipe");
const _workspaceentity = require("../../../../engine/core-modules/workspace/workspace.entity");
const _authuserworkspaceiddecorator = require("../../../../engine/decorators/auth/auth-user-workspace-id.decorator");
const _authworkspacedecorator = require("../../../../engine/decorators/auth/auth-workspace.decorator");
const _settingspermissionguard = require("../../../../engine/guards/settings-permission.guard");
const _workspaceauthguard = require("../../../../engine/guards/workspace-auth.guard");
const _connectedaccountmetadataservice = require("../../../../engine/metadata-modules/connected-account/connected-account-metadata.service");
const _createcalendareventoutputdto = require("../dtos/create-calendar-event-output.dto");
const _createcalendareventinput = require("../dtos/create-calendar-event.input");
const _calendareventcomposerservice = require("../services/calendar-event-composer.service");
const _createcalendareventservice = require("../services/create-calendar-event.service");
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
let CreateCalendarEventResolver = class CreateCalendarEventResolver {
    async createCalendarEvent(input, workspace, userWorkspaceId) {
        try {
            await this.connectedAccountMetadataService.verifyOwnership({
                id: input.connectedAccountId,
                userWorkspaceId,
                workspaceId: workspace.id
            });
            const result = await this.calendarEventComposerService.composeCalendarEvent({
                connectedAccountId: input.connectedAccountId,
                title: input.title,
                description: input.description,
                location: input.location,
                startsAt: input.startsAt,
                endsAt: input.endsAt,
                isFullDay: input.isFullDay,
                timeZone: input.timeZone,
                attendees: input.attendees,
                sendInvitations: input.sendInvitations,
                addConferencing: input.addConferencing
            }, workspace.id);
            if (!result.success) {
                return {
                    success: false,
                    error: result.error
                };
            }
            const createdEvent = await this.createCalendarEventService.createComposedCalendarEvent(result.data);
            const calendarEventId = await this.createCalendarEventService.persistCalendarEvent(createdEvent, result.data, workspace.id);
            return {
                success: true,
                iCalUid: createdEvent.iCalUid || undefined,
                conferenceLink: createdEvent.conferenceLinkUrl || undefined,
                calendarEventId: calendarEventId ?? undefined
            };
        } catch (error) {
            if (error instanceof _common.ForbiddenException) {
                throw error;
            }
            this.logger.error(`Failed to create calendar event: ${error}`);
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Failed to create calendar event'
            };
        }
    }
    constructor(connectedAccountMetadataService, calendarEventComposerService, createCalendarEventService){
        this.connectedAccountMetadataService = connectedAccountMetadataService;
        this.calendarEventComposerService = calendarEventComposerService;
        this.createCalendarEventService = createCalendarEventService;
        this.logger = new _common.Logger(CreateCalendarEventResolver.name);
    }
};
_ts_decorate([
    (0, _graphql.Mutation)(()=>_createcalendareventoutputdto.CreateCalendarEventOutputDTO),
    _ts_param(0, (0, _graphql.Args)('input')),
    _ts_param(1, (0, _authworkspacedecorator.AuthWorkspace)()),
    _ts_param(2, (0, _authuserworkspaceiddecorator.AuthUserWorkspaceId)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _createcalendareventinput.CreateCalendarEventInput === "undefined" ? Object : _createcalendareventinput.CreateCalendarEventInput,
        typeof _workspaceentity.WorkspaceEntity === "undefined" ? Object : _workspaceentity.WorkspaceEntity,
        String
    ]),
    _ts_metadata("design:returntype", Promise)
], CreateCalendarEventResolver.prototype, "createCalendarEvent", null);
CreateCalendarEventResolver = _ts_decorate([
    (0, _metadataresolverdecorator.MetadataResolver)(),
    (0, _common.UsePipes)(_resolvervalidationpipe.ResolverValidationPipe),
    (0, _common.UseFilters)(_authgraphqlapiexceptionfilter.AuthGraphqlApiExceptionFilter),
    (0, _common.UseGuards)(_workspaceauthguard.WorkspaceAuthGuard, (0, _settingspermissionguard.SettingsPermissionGuard)(_constants.PermissionFlagType.CREATE_CALENDAR_EVENT_TOOL)),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _connectedaccountmetadataservice.ConnectedAccountMetadataService === "undefined" ? Object : _connectedaccountmetadataservice.ConnectedAccountMetadataService,
        typeof _calendareventcomposerservice.CalendarEventComposerService === "undefined" ? Object : _calendareventcomposerservice.CalendarEventComposerService,
        typeof _createcalendareventservice.CreateCalendarEventService === "undefined" ? Object : _createcalendareventservice.CreateCalendarEventService
    ])
], CreateCalendarEventResolver);

//# sourceMappingURL=create-calendar-event.resolver.js.map