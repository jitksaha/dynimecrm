"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "TimelineCalendarEventResolver", {
    enumerable: true,
    get: function() {
        return TimelineCalendarEventResolver;
    }
});
const _common = require("@nestjs/common");
const _graphql = require("@nestjs/graphql");
const _classvalidator = require("class-validator");
const _types = require("twenty-shared/types");
const _scalars = require("../../api/graphql/workspace-schema-builder/graphql-types/scalars");
const _calendarconstants = require("./constants/calendar.constants");
const _timelinecalendareventswithtotaldto = require("./dtos/timeline-calendar-events-with-total.dto");
const _timelinecalendareventservice = require("./timeline-calendar-event.service");
const _authworkspacedecorator = require("../../decorators/auth/auth-workspace.decorator");
const _authworkspacememberiddecorator = require("../../decorators/auth/auth-workspace-member-id.decorator");
const _coreresolverdecorator = require("../../api/graphql/graphql-config/decorators/core-resolver.decorator");
const _custompermissionguard = require("../../guards/custom-permission.guard");
const _workspaceauthguard = require("../../guards/workspace-auth.guard");
const _workspaceentity = require("../workspace/workspace.entity");
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
let GetTimelineCalendarEventsFromObjectRecordArgs = class GetTimelineCalendarEventsFromObjectRecordArgs {
};
_ts_decorate([
    (0, _graphql.Field)(()=>String),
    _ts_metadata("design:type", String)
], GetTimelineCalendarEventsFromObjectRecordArgs.prototype, "objectNameSingular", void 0);
_ts_decorate([
    (0, _graphql.Field)(()=>_scalars.UUIDScalarType),
    _ts_metadata("design:type", String)
], GetTimelineCalendarEventsFromObjectRecordArgs.prototype, "recordId", void 0);
_ts_decorate([
    (0, _graphql.Field)(()=>_graphql.Int),
    _ts_metadata("design:type", Number)
], GetTimelineCalendarEventsFromObjectRecordArgs.prototype, "page", void 0);
_ts_decorate([
    (0, _graphql.Field)(()=>_graphql.Int),
    (0, _classvalidator.Max)(_calendarconstants.TIMELINE_CALENDAR_EVENTS_MAX_PAGE_SIZE),
    _ts_metadata("design:type", Number)
], GetTimelineCalendarEventsFromObjectRecordArgs.prototype, "pageSize", void 0);
GetTimelineCalendarEventsFromObjectRecordArgs = _ts_decorate([
    (0, _graphql.ArgsType)()
], GetTimelineCalendarEventsFromObjectRecordArgs);
let GetTimelineCalendarEventsFromPersonIdArgs = class GetTimelineCalendarEventsFromPersonIdArgs {
};
_ts_decorate([
    (0, _graphql.Field)(()=>_scalars.UUIDScalarType),
    _ts_metadata("design:type", String)
], GetTimelineCalendarEventsFromPersonIdArgs.prototype, "personId", void 0);
_ts_decorate([
    (0, _graphql.Field)(()=>_graphql.Int),
    _ts_metadata("design:type", Number)
], GetTimelineCalendarEventsFromPersonIdArgs.prototype, "page", void 0);
_ts_decorate([
    (0, _graphql.Field)(()=>_graphql.Int),
    (0, _classvalidator.Max)(_calendarconstants.TIMELINE_CALENDAR_EVENTS_MAX_PAGE_SIZE),
    _ts_metadata("design:type", Number)
], GetTimelineCalendarEventsFromPersonIdArgs.prototype, "pageSize", void 0);
GetTimelineCalendarEventsFromPersonIdArgs = _ts_decorate([
    (0, _graphql.ArgsType)()
], GetTimelineCalendarEventsFromPersonIdArgs);
let GetTimelineCalendarEventsFromCompanyIdArgs = class GetTimelineCalendarEventsFromCompanyIdArgs {
};
_ts_decorate([
    (0, _graphql.Field)(()=>_scalars.UUIDScalarType),
    _ts_metadata("design:type", String)
], GetTimelineCalendarEventsFromCompanyIdArgs.prototype, "companyId", void 0);
_ts_decorate([
    (0, _graphql.Field)(()=>_graphql.Int),
    _ts_metadata("design:type", Number)
], GetTimelineCalendarEventsFromCompanyIdArgs.prototype, "page", void 0);
_ts_decorate([
    (0, _graphql.Field)(()=>_graphql.Int),
    (0, _classvalidator.Max)(_calendarconstants.TIMELINE_CALENDAR_EVENTS_MAX_PAGE_SIZE),
    _ts_metadata("design:type", Number)
], GetTimelineCalendarEventsFromCompanyIdArgs.prototype, "pageSize", void 0);
GetTimelineCalendarEventsFromCompanyIdArgs = _ts_decorate([
    (0, _graphql.ArgsType)()
], GetTimelineCalendarEventsFromCompanyIdArgs);
let GetTimelineCalendarEventsFromOpportunityIdArgs = class GetTimelineCalendarEventsFromOpportunityIdArgs {
};
_ts_decorate([
    (0, _graphql.Field)(()=>_scalars.UUIDScalarType),
    _ts_metadata("design:type", String)
], GetTimelineCalendarEventsFromOpportunityIdArgs.prototype, "opportunityId", void 0);
_ts_decorate([
    (0, _graphql.Field)(()=>_graphql.Int),
    _ts_metadata("design:type", Number)
], GetTimelineCalendarEventsFromOpportunityIdArgs.prototype, "page", void 0);
_ts_decorate([
    (0, _graphql.Field)(()=>_graphql.Int),
    (0, _classvalidator.Max)(_calendarconstants.TIMELINE_CALENDAR_EVENTS_MAX_PAGE_SIZE),
    _ts_metadata("design:type", Number)
], GetTimelineCalendarEventsFromOpportunityIdArgs.prototype, "pageSize", void 0);
GetTimelineCalendarEventsFromOpportunityIdArgs = _ts_decorate([
    (0, _graphql.ArgsType)()
], GetTimelineCalendarEventsFromOpportunityIdArgs);
let TimelineCalendarEventResolver = class TimelineCalendarEventResolver {
    async getTimelineCalendarEventsFromObjectRecord({ objectNameSingular, recordId, page, pageSize }, workspaceMemberId, workspace) {
        return this.timelineCalendarEventService.getCalendarEventsFromObjectRecord({
            currentWorkspaceMemberId: workspaceMemberId,
            objectNameSingular,
            recordId,
            workspaceId: workspace.id,
            page,
            pageSize
        });
    }
    async getTimelineCalendarEventsFromPersonId({ personId, page, pageSize }, workspaceMemberId, workspace) {
        return this.timelineCalendarEventService.getCalendarEventsFromObjectRecord({
            currentWorkspaceMemberId: workspaceMemberId,
            objectNameSingular: _types.CoreObjectNameSingular.Person,
            recordId: personId,
            workspaceId: workspace.id,
            page,
            pageSize
        });
    }
    async getTimelineCalendarEventsFromCompanyId({ companyId, page, pageSize }, workspaceMemberId, workspace) {
        return this.timelineCalendarEventService.getCalendarEventsFromObjectRecord({
            currentWorkspaceMemberId: workspaceMemberId,
            objectNameSingular: _types.CoreObjectNameSingular.Company,
            recordId: companyId,
            workspaceId: workspace.id,
            page,
            pageSize
        });
    }
    async getTimelineCalendarEventsFromOpportunityId({ opportunityId, page, pageSize }, workspaceMemberId, workspace) {
        return this.timelineCalendarEventService.getCalendarEventsFromObjectRecord({
            currentWorkspaceMemberId: workspaceMemberId,
            objectNameSingular: _types.CoreObjectNameSingular.Opportunity,
            recordId: opportunityId,
            workspaceId: workspace.id,
            page,
            pageSize
        });
    }
    constructor(timelineCalendarEventService){
        this.timelineCalendarEventService = timelineCalendarEventService;
    }
};
_ts_decorate([
    (0, _graphql.Query)(()=>_timelinecalendareventswithtotaldto.TimelineCalendarEventsWithTotalDTO),
    _ts_param(0, (0, _graphql.Args)()),
    _ts_param(1, (0, _authworkspacememberiddecorator.AuthWorkspaceMemberId)()),
    _ts_param(2, (0, _authworkspacedecorator.AuthWorkspace)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof GetTimelineCalendarEventsFromObjectRecordArgs === "undefined" ? Object : GetTimelineCalendarEventsFromObjectRecordArgs,
        String,
        typeof _workspaceentity.WorkspaceEntity === "undefined" ? Object : _workspaceentity.WorkspaceEntity
    ]),
    _ts_metadata("design:returntype", Promise)
], TimelineCalendarEventResolver.prototype, "getTimelineCalendarEventsFromObjectRecord", null);
_ts_decorate([
    (0, _graphql.Query)(()=>_timelinecalendareventswithtotaldto.TimelineCalendarEventsWithTotalDTO, {
        deprecationReason: 'Use getTimelineCalendarEventsFromObjectRecord instead'
    }),
    _ts_param(0, (0, _graphql.Args)()),
    _ts_param(1, (0, _authworkspacememberiddecorator.AuthWorkspaceMemberId)()),
    _ts_param(2, (0, _authworkspacedecorator.AuthWorkspace)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof GetTimelineCalendarEventsFromPersonIdArgs === "undefined" ? Object : GetTimelineCalendarEventsFromPersonIdArgs,
        String,
        typeof _workspaceentity.WorkspaceEntity === "undefined" ? Object : _workspaceentity.WorkspaceEntity
    ]),
    _ts_metadata("design:returntype", Promise)
], TimelineCalendarEventResolver.prototype, "getTimelineCalendarEventsFromPersonId", null);
_ts_decorate([
    (0, _graphql.Query)(()=>_timelinecalendareventswithtotaldto.TimelineCalendarEventsWithTotalDTO, {
        deprecationReason: 'Use getTimelineCalendarEventsFromObjectRecord instead'
    }),
    _ts_param(0, (0, _graphql.Args)()),
    _ts_param(1, (0, _authworkspacememberiddecorator.AuthWorkspaceMemberId)()),
    _ts_param(2, (0, _authworkspacedecorator.AuthWorkspace)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof GetTimelineCalendarEventsFromCompanyIdArgs === "undefined" ? Object : GetTimelineCalendarEventsFromCompanyIdArgs,
        String,
        typeof _workspaceentity.WorkspaceEntity === "undefined" ? Object : _workspaceentity.WorkspaceEntity
    ]),
    _ts_metadata("design:returntype", Promise)
], TimelineCalendarEventResolver.prototype, "getTimelineCalendarEventsFromCompanyId", null);
_ts_decorate([
    (0, _graphql.Query)(()=>_timelinecalendareventswithtotaldto.TimelineCalendarEventsWithTotalDTO, {
        deprecationReason: 'Use getTimelineCalendarEventsFromObjectRecord instead'
    }),
    _ts_param(0, (0, _graphql.Args)()),
    _ts_param(1, (0, _authworkspacememberiddecorator.AuthWorkspaceMemberId)()),
    _ts_param(2, (0, _authworkspacedecorator.AuthWorkspace)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof GetTimelineCalendarEventsFromOpportunityIdArgs === "undefined" ? Object : GetTimelineCalendarEventsFromOpportunityIdArgs,
        String,
        typeof _workspaceentity.WorkspaceEntity === "undefined" ? Object : _workspaceentity.WorkspaceEntity
    ]),
    _ts_metadata("design:returntype", Promise)
], TimelineCalendarEventResolver.prototype, "getTimelineCalendarEventsFromOpportunityId", null);
TimelineCalendarEventResolver = _ts_decorate([
    (0, _common.UseGuards)(_workspaceauthguard.WorkspaceAuthGuard, _custompermissionguard.CustomPermissionGuard),
    (0, _coreresolverdecorator.CoreResolver)(()=>_timelinecalendareventswithtotaldto.TimelineCalendarEventsWithTotalDTO),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _timelinecalendareventservice.TimelineCalendarEventService === "undefined" ? Object : _timelinecalendareventservice.TimelineCalendarEventService
    ])
], TimelineCalendarEventResolver);

//# sourceMappingURL=timeline-calendar-event.resolver.js.map