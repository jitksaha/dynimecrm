"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "OnboardingInviteSuggestionsService", {
    enumerable: true,
    get: function() {
        return OnboardingInviteSuggestionsService;
    }
});
const _common = require("@nestjs/common");
const _typeorm = require("@nestjs/typeorm");
const _utils = require("twenty-shared/utils");
const _typeorm1 = require("typeorm");
const _cachestoragedecorator = require("../../../engine/core-modules/cache-storage/decorators/cache-storage.decorator");
const _cachestorageservice = require("../../../engine/core-modules/cache-storage/services/cache-storage.service");
const _cachestoragenamespaceenum = require("../../../engine/core-modules/cache-storage/types/cache-storage-namespace.enum");
const _connectedaccountentity = require("../../../engine/metadata-modules/connected-account/entities/connected-account.entity");
const _getdomainnamefromhandleutil = require("../../contact-creation-manager/utils/get-domain-name-from-handle.util");
const _isgroupemail = require("../../messaging/message-import-manager/utils/is-group-email");
const _onboardinginvitesuggestionscachettlmsconstant = require("../constants/onboarding-invite-suggestions-cache-ttl-ms.constant");
const _onboardinginvitesuggestionsmaxcountconstant = require("../constants/onboarding-invite-suggestions-max-count.constant");
const _calendarattendeesservice = require("./calendar-attendees.service");
const _getonboardinginvitesuggestionscachekeyutil = require("../utils/get-onboarding-invite-suggestions-cache-key.util");
const _isworkemail = require("../../../utils/is-work-email");
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
let OnboardingInviteSuggestionsService = class OnboardingInviteSuggestionsService {
    async getOrComputeSuggestions({ workspaceId, userId, userWorkspaceId }) {
        const cacheKey = (0, _getonboardinginvitesuggestionscachekeyutil.getOnboardingInviteSuggestionsCacheKey)(workspaceId, userId);
        const cachedSuggestions = await this.cacheStorageService.get(cacheKey);
        if ((0, _utils.isDefined)(cachedSuggestions)) {
            return cachedSuggestions;
        }
        const suggestions = await this.computeSuggestionsFromConnectedAccount({
            workspaceId,
            userWorkspaceId
        });
        await this.cacheStorageService.set(cacheKey, suggestions, _onboardinginvitesuggestionscachettlmsconstant.ONBOARDING_INVITE_SUGGESTIONS_CACHE_TTL_MS);
        return suggestions;
    }
    async computeSuggestionsFromConnectedAccount({ workspaceId, userWorkspaceId }) {
        const mostRecentlyConnectedAccount = await this.connectedAccountRepository.findOne({
            where: {
                userWorkspaceId,
                workspaceId
            },
            order: {
                createdAt: 'DESC'
            }
        });
        if (!(0, _utils.isDefined)(mostRecentlyConnectedAccount)) {
            return [];
        }
        const connectedAccountHandle = mostRecentlyConnectedAccount.handle.toLowerCase();
        if (!(0, _isworkemail.isWorkEmail)(connectedAccountHandle)) {
            return [];
        }
        const connectedAccountDomain = (0, _getdomainnamefromhandleutil.getDomainNameFromHandle)(connectedAccountHandle);
        const ownEmailHandles = new Set([
            connectedAccountHandle,
            ...(mostRecentlyConnectedAccount.handleAliases ?? []).map((alias)=>alias.toLowerCase())
        ]);
        let attendees = [];
        try {
            attendees = await this.calendarAttendeesService.getRecentAttendees(mostRecentlyConnectedAccount);
        } catch (error) {
            this.logger.warn(`Could not compute invite suggestions for workspace ${workspaceId}: ${error instanceof Error ? error.message : 'unknown error'}`);
        }
        const eventCountByColleagueEmail = new Map();
        for (const attendee of attendees){
            const attendeeEmail = attendee.email.toLowerCase();
            const isOwnEmail = ownEmailHandles.has(attendeeEmail);
            const isSameCompanyColleague = (0, _getdomainnamefromhandleutil.getDomainNameFromHandle)(attendeeEmail) === connectedAccountDomain;
            if (isOwnEmail || !isSameCompanyColleague || (0, _isgroupemail.isGroupEmail)(attendeeEmail)) {
                continue;
            }
            const colleagueTally = eventCountByColleagueEmail.get(attendeeEmail) ?? {
                eventCount: 0
            };
            colleagueTally.eventCount += 1;
            if (!(0, _utils.isDefined)(colleagueTally.displayName) && (0, _utils.isDefined)(attendee.displayName)) {
                colleagueTally.displayName = attendee.displayName;
            }
            eventCountByColleagueEmail.set(attendeeEmail, colleagueTally);
        }
        const mostFrequentColleaguesFirst = Array.from(eventCountByColleagueEmail.entries()).sort(([, left], [, right])=>right.eventCount - left.eventCount);
        return mostFrequentColleaguesFirst.slice(0, _onboardinginvitesuggestionsmaxcountconstant.ONBOARDING_INVITE_SUGGESTIONS_MAX_COUNT).map(([email, { displayName }])=>({
                email,
                displayName
            }));
    }
    constructor(connectedAccountRepository, calendarAttendeesService, cacheStorageService){
        this.connectedAccountRepository = connectedAccountRepository;
        this.calendarAttendeesService = calendarAttendeesService;
        this.cacheStorageService = cacheStorageService;
        this.logger = new _common.Logger(OnboardingInviteSuggestionsService.name);
    }
};
OnboardingInviteSuggestionsService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_param(0, (0, _typeorm.InjectRepository)(_connectedaccountentity.ConnectedAccountEntity)),
    _ts_param(2, (0, _cachestoragedecorator.InjectCacheStorage)(_cachestoragenamespaceenum.CacheStorageNamespace.EngineOnboardingInviteSuggestions)),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _typeorm1.Repository === "undefined" ? Object : _typeorm1.Repository,
        typeof _calendarattendeesservice.CalendarAttendeesService === "undefined" ? Object : _calendarattendeesservice.CalendarAttendeesService,
        typeof _cachestorageservice.CacheStorageService === "undefined" ? Object : _cachestorageservice.CacheStorageService
    ])
], OnboardingInviteSuggestionsService);

//# sourceMappingURL=onboarding-invite-suggestions.service.js.map