"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "GetMessagesService", {
    enumerable: true,
    get: function() {
        return GetMessagesService;
    }
});
const _common = require("@nestjs/common");
const _utils = require("twenty-shared/utils");
const _messagingconstants = require("../constants/messaging.constants");
const _timelinemessagingservice = require("./timeline-messaging.service");
const _formatthreadsutil = require("../utils/format-threads.util");
const _relatedpersonidsservice = require("../../related-person-ids/services/related-person-ids.service");
const _messagecalendartargetreadinessservice = require("../../target/services/message-calendar-target-readiness.service");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let GetMessagesService = class GetMessagesService {
    async getMessagesFromPersonIds(workspaceMemberId, personIds, workspaceId, page = 1, pageSize = _messagingconstants.TIMELINE_THREADS_DEFAULT_PAGE_SIZE, targetFilter) {
        const offset = (page - 1) * pageSize;
        const { messageThreads, totalNumberOfThreads } = await this.timelineMessagingService.getAndCountMessageThreads(personIds, workspaceId, offset, pageSize, targetFilter);
        if (!messageThreads) {
            return {
                totalNumberOfThreads: 0,
                timelineThreads: [],
                relatedPersonIds: personIds
            };
        }
        const messageThreadIds = messageThreads.map((messageThread)=>messageThread.id);
        const threadParticipantsByThreadId = await this.timelineMessagingService.getThreadParticipantsByThreadId(messageThreadIds, workspaceId);
        const threadVisibilityByThreadId = await this.timelineMessagingService.getThreadVisibilityByThreadId(messageThreadIds, workspaceMemberId, workspaceId);
        return {
            totalNumberOfThreads,
            timelineThreads: (0, _formatthreadsutil.formatThreads)(messageThreads, threadParticipantsByThreadId, threadVisibilityByThreadId),
            relatedPersonIds: personIds
        };
    }
    async getMessagesFromObjectRecord(workspaceMemberId, objectNameSingular, recordId, workspaceId, page = 1, pageSize = _messagingconstants.TIMELINE_THREADS_DEFAULT_PAGE_SIZE) {
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
                totalNumberOfThreads: 0,
                timelineThreads: [],
                relatedPersonIds: []
            };
        }
        return this.getMessagesFromPersonIds(workspaceMemberId, personIds, workspaceId, page, pageSize, targetFilter);
    }
    constructor(timelineMessagingService, relatedPersonIdsService, messageCalendarTargetReadinessService){
        this.timelineMessagingService = timelineMessagingService;
        this.relatedPersonIdsService = relatedPersonIdsService;
        this.messageCalendarTargetReadinessService = messageCalendarTargetReadinessService;
    }
};
GetMessagesService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _timelinemessagingservice.TimelineMessagingService === "undefined" ? Object : _timelinemessagingservice.TimelineMessagingService,
        typeof _relatedpersonidsservice.RelatedPersonIdsService === "undefined" ? Object : _relatedpersonidsservice.RelatedPersonIdsService,
        typeof _messagecalendartargetreadinessservice.MessageCalendarTargetReadinessService === "undefined" ? Object : _messagecalendartargetreadinessservice.MessageCalendarTargetReadinessService
    ])
], GetMessagesService);

//# sourceMappingURL=get-messages.service.js.map