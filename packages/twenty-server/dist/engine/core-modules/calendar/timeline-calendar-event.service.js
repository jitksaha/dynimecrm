"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "TimelineCalendarEventService", {
    enumerable: true,
    get: function() {
        return TimelineCalendarEventService;
    }
});
const _common = require("@nestjs/common");
const _typeorm = require("@nestjs/typeorm");
const _lodashomit = /*#__PURE__*/ _interop_require_default(require("lodash.omit"));
const _constants = require("twenty-shared/constants");
const _utils = require("twenty-shared/utils");
const _typeorm1 = require("typeorm");
const _types = require("twenty-shared/types");
const _calendarconstants = require("./constants/calendar.constants");
const _fileurlservice = require("../file/file-url/file-url.service");
const _relatedpersonidsservice = require("../related-person-ids/services/related-person-ids.service");
const _messagecalendartargetreadinessservice = require("../target/services/message-calendar-target-readiness.service");
const _calendarchannelentity = require("../../metadata-modules/calendar-channel/entities/calendar-channel.entity");
const _connectedaccountentity = require("../../metadata-modules/connected-account/entities/connected-account.entity");
const _userworkspaceentity = require("../user-workspace/user-workspace.entity");
const _workspaceormmanager = require("../../twenty-orm/workspace-orm.manager");
const _buildsystemauthcontextutil = require("../../twenty-orm/utils/build-system-auth-context.util");
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
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
let TimelineCalendarEventService = class TimelineCalendarEventService {
    async getCalendarEventsFromPersonIds({ currentWorkspaceMemberId, personIds, workspaceId, page = 1, pageSize = _calendarconstants.TIMELINE_CALENDAR_EVENTS_DEFAULT_PAGE_SIZE, targetFilter }) {
        const authContext = (0, _buildsystemauthcontextutil.buildSystemAuthContext)(workspaceId);
        return this.workspaceOrmManager.executeInWorkspaceContext(async ()=>{
            const offset = (page - 1) * pageSize;
            // Runs under a system auth context, which resolves no role, so without
            // this the participant relations (person, workspaceMember) are read with
            // empty permissions and denied for everyone. Channel-level redaction of
            // title and description below is what gates the caller's access.
            // TODO run under the caller's role via resolveRolePermissionConfig instead
            // of bypassing, once roles that cannot read person degrade to a redacted
            // timeline rather than a denied one
            // https://github.com/twentyhq/core-team-issues/issues/2777
            const calendarEventRepository = this.workspaceOrmManager.getRepository('calendarEvent', {
                shouldBypassPermissionChecks: true
            });
            const where = (0, _utils.isDefined)(targetFilter) ? {
                calendarEventTargets: {
                    [targetFilter.fieldName]: targetFilter.recordId
                }
            } : {
                calendarEventParticipants: {
                    personId: (0, _typeorm1.Any)(personIds)
                }
            };
            const totalNumberOfCalendarEvents = await calendarEventRepository.count({
                where
            });
            const calendarEventIds = await calendarEventRepository.find({
                where,
                select: {
                    id: true,
                    startsAt: true
                },
                skip: offset,
                take: pageSize,
                order: {
                    startsAt: 'DESC'
                }
            });
            const ids = calendarEventIds.map(({ id })=>id);
            if (ids.length <= 0) {
                return {
                    totalNumberOfCalendarEvents,
                    timelineCalendarEvents: [],
                    relatedPersonIds: personIds
                };
            }
            const [events] = await calendarEventRepository.findAndCount({
                where: {
                    id: (0, _typeorm1.Any)(ids)
                },
                relations: {
                    calendarEventParticipants: {
                        person: true,
                        workspaceMember: true
                    },
                    calendarChannelEventAssociations: true
                }
            });
            const callRecordingRepository = this.workspaceOrmManager.getRepository('callRecording');
            const callRecordings = await callRecordingRepository.find({
                where: {
                    calendarEventId: (0, _typeorm1.Any)(ids)
                },
                select: {
                    id: true,
                    status: true,
                    applicationId: true,
                    calendarEventId: true
                }
            });
            const callRecordingsByCalendarEventId = callRecordings.reduce((acc, callRecording)=>{
                if (!(0, _utils.isDefined)(callRecording.calendarEventId)) {
                    return acc;
                }
                const existing = acc.get(callRecording.calendarEventId) ?? [];
                existing.push({
                    id: callRecording.id,
                    status: callRecording.status,
                    applicationId: callRecording.applicationId ?? null
                });
                acc.set(callRecording.calendarEventId, existing);
                return acc;
            }, new Map());
            const allCalendarChannelIds = [
                ...new Set(events.flatMap((event)=>event.calendarChannelEventAssociations.map((association)=>association.calendarChannelId)))
            ];
            const calendarChannels = allCalendarChannelIds.length > 0 ? await this.calendarChannelRepository.find({
                where: {
                    id: (0, _typeorm1.In)(allCalendarChannelIds),
                    workspaceId
                }
            }) : [];
            // Resolve current user's userWorkspaceId (workspaceMember → userId → userWorkspace)
            const workspaceMemberRepo = this.workspaceOrmManager.getRepository('workspaceMember', {
                shouldBypassPermissionChecks: true
            });
            const currentMember = await workspaceMemberRepo.findOne({
                where: {
                    id: currentWorkspaceMemberId
                },
                select: {
                    userId: true
                }
            });
            const currentUserWorkspaceId = currentMember ? (await this.userWorkspaceRepository.findOne({
                where: {
                    userId: currentMember.userId,
                    workspaceId
                },
                select: {
                    id: true
                }
            }))?.id ?? null : null;
            const connectedAccountIds = [
                ...new Set(calendarChannels.map((channel)=>channel.connectedAccountId))
            ];
            const ownedAccountIds = connectedAccountIds.length > 0 && currentUserWorkspaceId ? new Set((await this.connectedAccountRepository.find({
                where: {
                    id: (0, _typeorm1.In)(connectedAccountIds),
                    userWorkspaceId: currentUserWorkspaceId
                },
                select: {
                    id: true
                }
            })).map((a)=>a.id)) : new Set();
            const calendarChannelMap = new Map(calendarChannels.map((channel)=>[
                    channel.id,
                    {
                        visibility: channel.visibility,
                        isOwnedByCurrentUser: ownedAccountIds.has(channel.connectedAccountId)
                    }
                ]));
            const orderedEvents = events.sort((a, b)=>ids.indexOf(a.id) - ids.indexOf(b.id));
            const timelineCalendarEventPromises = orderedEvents.map(async (event)=>{
                const participantPromises = event.calendarEventParticipants.map(async (participant)=>{
                    const personAvatarFileUrl = await this.fileUrlService.signFirstFilesFieldFileUrl({
                        filesFieldValue: participant.person?.avatarFile,
                        workspaceId
                    });
                    return {
                        calendarEventId: event.id,
                        personId: participant.personId ?? null,
                        workspaceMemberId: participant.workspaceMemberId ?? null,
                        firstName: participant.person?.name?.firstName || participant.workspaceMember?.name.firstName || '',
                        lastName: participant.person?.name?.lastName || participant.workspaceMember?.name.lastName || '',
                        displayName: participant.person?.name?.firstName || participant.person?.name?.lastName || participant.workspaceMember?.name.firstName || participant.workspaceMember?.name.lastName || participant.displayName || participant.handle || '',
                        avatarUrl: personAvatarFileUrl || participant.person?.avatarUrl || participant.workspaceMember?.avatarUrl || '',
                        handle: participant.handle ?? ''
                    };
                });
                const participants = await Promise.all(participantPromises);
                const hasFullAccess = event.calendarChannelEventAssociations.some((association)=>{
                    const channel = calendarChannelMap.get(association.calendarChannelId);
                    return channel?.visibility === 'SHARE_EVERYTHING' || channel?.isOwnedByCurrentUser;
                });
                const visibility = hasFullAccess ? _types.CalendarChannelVisibility.SHARE_EVERYTHING : _types.CalendarChannelVisibility.METADATA;
                return {
                    ...(0, _lodashomit.default)(event, [
                        'calendarEventParticipants',
                        'calendarChannelEventAssociations'
                    ]),
                    title: visibility === _types.CalendarChannelVisibility.METADATA ? _constants.FIELD_RESTRICTED_ADDITIONAL_PERMISSIONS_REQUIRED : event.title ?? '',
                    description: visibility === _types.CalendarChannelVisibility.METADATA ? _constants.FIELD_RESTRICTED_ADDITIONAL_PERMISSIONS_REQUIRED : event.description ?? '',
                    startsAt: event.startsAt,
                    endsAt: event.endsAt,
                    participants,
                    callRecordings: callRecordingsByCalendarEventId.get(event.id) ?? [],
                    visibility,
                    location: event.location ?? '',
                    conferenceSolution: event.conferenceSolution ?? ''
                };
            });
            const timelineCalendarEvents = await Promise.all(timelineCalendarEventPromises);
            return {
                totalNumberOfCalendarEvents,
                timelineCalendarEvents,
                relatedPersonIds: personIds
            };
        }, authContext);
    }
    async getCalendarEventsFromObjectRecord({ currentWorkspaceMemberId, objectNameSingular, recordId, workspaceId, page = 1, pageSize = _calendarconstants.TIMELINE_CALENDAR_EVENTS_DEFAULT_PAGE_SIZE }) {
        const personIds = await this.relatedPersonIdsService.getRelatedPersonIds({
            workspaceId,
            objectNameSingular,
            recordId
        });
        const targetFilter = await this.messageCalendarTargetReadinessService.resolveTargetFilter({
            objectNameSingular,
            recordId,
            workspaceId
        });
        if (!(0, _utils.isDefined)(targetFilter) && personIds.length === 0) {
            return {
                totalNumberOfCalendarEvents: 0,
                timelineCalendarEvents: [],
                relatedPersonIds: []
            };
        }
        return this.getCalendarEventsFromPersonIds({
            currentWorkspaceMemberId,
            personIds,
            workspaceId,
            page,
            pageSize,
            ...(0, _utils.isDefined)(targetFilter) && {
                targetFilter
            }
        });
    }
    constructor(workspaceOrmManager, calendarChannelRepository, connectedAccountRepository, userWorkspaceRepository, relatedPersonIdsService, fileUrlService, messageCalendarTargetReadinessService){
        this.workspaceOrmManager = workspaceOrmManager;
        this.calendarChannelRepository = calendarChannelRepository;
        this.connectedAccountRepository = connectedAccountRepository;
        this.userWorkspaceRepository = userWorkspaceRepository;
        this.relatedPersonIdsService = relatedPersonIdsService;
        this.fileUrlService = fileUrlService;
        this.messageCalendarTargetReadinessService = messageCalendarTargetReadinessService;
    }
};
TimelineCalendarEventService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_param(1, (0, _typeorm.InjectRepository)(_calendarchannelentity.CalendarChannelEntity)),
    _ts_param(2, (0, _typeorm.InjectRepository)(_connectedaccountentity.ConnectedAccountEntity)),
    _ts_param(3, (0, _typeorm.InjectRepository)(_userworkspaceentity.UserWorkspaceEntity)),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _workspaceormmanager.WorkspaceOrmManager === "undefined" ? Object : _workspaceormmanager.WorkspaceOrmManager,
        typeof Repository === "undefined" ? Object : Repository,
        typeof Repository === "undefined" ? Object : Repository,
        typeof Repository === "undefined" ? Object : Repository,
        typeof _relatedpersonidsservice.RelatedPersonIdsService === "undefined" ? Object : _relatedpersonidsservice.RelatedPersonIdsService,
        typeof _fileurlservice.FileUrlService === "undefined" ? Object : _fileurlservice.FileUrlService,
        typeof _messagecalendartargetreadinessservice.MessageCalendarTargetReadinessService === "undefined" ? Object : _messagecalendartargetreadinessservice.MessageCalendarTargetReadinessService
    ])
], TimelineCalendarEventService);

//# sourceMappingURL=timeline-calendar-event.service.js.map