"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "CalendarEventComposerService", {
    enumerable: true,
    get: function() {
        return CalendarEventComposerService;
    }
});
const _common = require("@nestjs/common");
const _typeorm = require("@nestjs/typeorm");
const _guards = require("@sniptt/guards");
const _constants = require("twenty-shared/constants");
const _utils = require("twenty-shared/utils");
const _zod = require("zod");
const _calendarchannelentity = require("../../../../engine/metadata-modules/calendar-channel/entities/calendar-channel.entity");
const _connectedaccountentity = require("../../../../engine/metadata-modules/connected-account/entities/connected-account.entity");
const _getmissingcreateeventscopesutil = require("../utils/get-missing-create-event-scopes.util");
const _iscalendarcreationsupportedproviderutil = require("../utils/is-calendar-creation-supported-provider.util");
const _isvalidtimezoneutil = require("../utils/is-valid-time-zone.util");
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
// Timed events need an absolute instant, so the date-time must carry an explicit
// UTC offset (Z or ±hh:mm); without one the instant is ambiguous and providers
// would schedule it at the wrong time. All-day boundaries are calendar dates.
const offsetDateTimeSchema = _zod.z.string().datetime({
    offset: true
});
const dateSchema = _zod.z.string().date();
let CalendarEventComposerService = class CalendarEventComposerService {
    async composeCalendarEvent(params, workspaceId) {
        const normalizedInput = this.normalizeAndValidateInput(params);
        if ('error' in normalizedInput) {
            return {
                success: false,
                error: normalizedInput.error
            };
        }
        const resolution = await this.resolveCalendarAccount(params.connectedAccountId, workspaceId);
        if ('error' in resolution) {
            return {
                success: false,
                error: resolution.error
            };
        }
        const { connectedAccount, calendarChannel } = resolution;
        const missingScopes = (0, _getmissingcreateeventscopesutil.getMissingCreateEventScopes)(connectedAccount);
        if (missingScopes.length > 0) {
            return {
                success: false,
                error: `The connected ${connectedAccount.provider} account is missing calendar permissions (${missingScopes.join(', ')}). Please reconnect the account to grant calendar access.`
            };
        }
        return {
            success: true,
            data: {
                input: normalizedInput,
                connectedAccount,
                calendarChannel
            }
        };
    }
    normalizeAndValidateInput(params) {
        const title = params.title?.trim();
        if (!(0, _guards.isNonEmptyString)(title)) {
            return {
                error: 'A title is required to create a calendar event'
            };
        }
        const isFullDay = params.isFullDay ?? false;
        const datesError = this.validateDates(params.startsAt, params.endsAt, isFullDay);
        if ((0, _utils.isDefined)(datesError)) {
            return {
                error: datesError
            };
        }
        const timeZone = params.timeZone ?? 'UTC';
        if (!(0, _isvalidtimezoneutil.isValidTimeZone)(timeZone)) {
            return {
                error: `timeZone '${timeZone}' is not a valid IANA time zone`
            };
        }
        const sendInvitations = params.sendInvitations ?? false;
        // Attendees are only ever attached when the caller explicitly opts in to
        // notifying them, so creating an event never silently emails external people.
        const attendeeEmails = sendInvitations ? this.parseAttendeeEmails(params.attendees) : [];
        if (attendeeEmails.length > _constants.MAX_EMAIL_RECIPIENTS) {
            return {
                error: `Too many attendees: ${attendeeEmails.length}. Maximum allowed is ${_constants.MAX_EMAIL_RECIPIENTS}.`
            };
        }
        const invalidAttendees = attendeeEmails.filter((email)=>!this.emailSchema.safeParse(email).success);
        if (invalidAttendees.length > 0) {
            return {
                error: `Invalid attendee email addresses: ${invalidAttendees.join(', ')}`
            };
        }
        return {
            title,
            description: params.description,
            location: params.location,
            startsAt: params.startsAt,
            endsAt: params.endsAt,
            isFullDay,
            timeZone,
            attendees: attendeeEmails.map((email)=>({
                    email
                })),
            sendInvitations,
            addConferencing: params.addConferencing ?? false
        };
    }
    // All-day boundaries collapse to a date, so they must be validated at day
    // granularity; timed boundaries are absolute instants and must carry an offset.
    validateDates(startsAt, endsAt, isFullDay) {
        if (isFullDay) {
            const startDate = startsAt.slice(0, 10);
            const endDate = endsAt.slice(0, 10);
            if (!dateSchema.safeParse(startDate).success || !dateSchema.safeParse(endDate).success) {
                return 'startsAt and endsAt must be valid ISO 8601 dates';
            }
            if (endDate <= startDate) {
                return 'endsAt must be a later day than startsAt for all-day events';
            }
            return undefined;
        }
        if (!offsetDateTimeSchema.safeParse(startsAt).success || !offsetDateTimeSchema.safeParse(endsAt).success) {
            return 'startsAt and endsAt must be ISO 8601 date-times with an offset (e.g. 2026-07-01T15:00:00Z)';
        }
        if (Date.parse(endsAt) <= Date.parse(startsAt)) {
            return 'endsAt must be after startsAt';
        }
        return undefined;
    }
    parseAttendeeEmails(attendees) {
        return (attendees ?? '').split(',').map((email)=>email.trim()).filter((email)=>email.length > 0);
    }
    async resolveCalendarAccount(connectedAccountId, workspaceId) {
        // A blank id (the workflow node's default) falls back to the default account.
        if ((0, _guards.isNonEmptyString)(connectedAccountId)) {
            if (!(0, _utils.isValidUuid)(connectedAccountId)) {
                return {
                    error: 'The provided connectedAccountId is not a valid UUID'
                };
            }
            const connectedAccount = await this.connectedAccountRepository.findOne({
                where: {
                    id: connectedAccountId,
                    workspaceId
                }
            });
            if (!(0, _utils.isDefined)(connectedAccount)) {
                return {
                    error: `No connected account found for id '${connectedAccountId}'`
                };
            }
            if (!(0, _iscalendarcreationsupportedproviderutil.isCalendarCreationSupportedProvider)(connectedAccount.provider)) {
                return {
                    error: `Calendar event creation is only supported for Google, Microsoft and CalDAV accounts (got ${connectedAccount.provider})`
                };
            }
            const calendarChannel = await this.findSyncEnabledCalendarChannel(connectedAccount.id, workspaceId);
            if (!(0, _utils.isDefined)(calendarChannel)) {
                return {
                    error: `Connected account '${connectedAccountId}' has no calendar channel with sync enabled. Enable calendar sync for this account first.`
                };
            }
            return {
                connectedAccount,
                calendarChannel
            };
        }
        return this.resolveDefaultCalendarAccount(workspaceId);
    }
    // Only sync-enabled channels are eligible: a created event is reconciled by the
    // provider sync, which skips channels whose sync is disabled.
    async resolveDefaultCalendarAccount(workspaceId) {
        const calendarChannels = await this.calendarChannelRepository.find({
            where: {
                workspaceId,
                isSyncEnabled: true
            },
            relations: {
                connectedAccount: true
            },
            order: {
                createdAt: 'ASC'
            }
        });
        const calendarChannel = calendarChannels.find((channel)=>(0, _utils.isDefined)(channel.connectedAccount) && !(0, _utils.isDefined)(channel.connectedAccount.archivedAt) && (0, _iscalendarcreationsupportedproviderutil.isCalendarCreationSupportedProvider)(channel.connectedAccount.provider));
        if (!(0, _utils.isDefined)(calendarChannel)) {
            return {
                error: 'No Google, Microsoft or CalDAV account with calendar sync is connected in this workspace'
            };
        }
        return {
            connectedAccount: calendarChannel.connectedAccount,
            calendarChannel
        };
    }
    async findSyncEnabledCalendarChannel(connectedAccountId, workspaceId) {
        return this.calendarChannelRepository.findOne({
            where: {
                connectedAccountId,
                workspaceId,
                isSyncEnabled: true
            },
            order: {
                createdAt: 'ASC'
            }
        });
    }
    constructor(connectedAccountRepository, calendarChannelRepository){
        this.connectedAccountRepository = connectedAccountRepository;
        this.calendarChannelRepository = calendarChannelRepository;
        this.emailSchema = _zod.z.string().trim().pipe(_zod.z.email());
    }
};
CalendarEventComposerService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_param(0, (0, _typeorm.InjectRepository)(_connectedaccountentity.ConnectedAccountEntity)),
    _ts_param(1, (0, _typeorm.InjectRepository)(_calendarchannelentity.CalendarChannelEntity)),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof Repository === "undefined" ? Object : Repository,
        typeof Repository === "undefined" ? Object : Repository
    ])
], CalendarEventComposerService);

//# sourceMappingURL=calendar-event-composer.service.js.map