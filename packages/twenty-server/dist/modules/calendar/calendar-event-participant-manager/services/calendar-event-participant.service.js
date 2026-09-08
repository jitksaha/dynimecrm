"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "CalendarEventParticipantService", {
    enumerable: true,
    get: function() {
        return CalendarEventParticipantService;
    }
});
const _common = require("@nestjs/common");
const _lodashchunk = /*#__PURE__*/ _interop_require_default(require("lodash.chunk"));
const _types = require("twenty-shared/types");
const _typeorm = require("typeorm");
const _messagequeuedecorator = require("../../../../engine/core-modules/message-queue/decorators/message-queue.decorator");
const _messagequeueconstants = require("../../../../engine/core-modules/message-queue/message-queue.constants");
const _messagequeueservice = require("../../../../engine/core-modules/message-queue/services/message-queue.service");
const _workspaceormmanager = require("../../../../engine/twenty-orm/workspace-orm.manager");
const _buildsystemauthcontextutil = require("../../../../engine/twenty-orm/utils/build-system-auth-context.util");
const _calendareventparticipantchunksize = require("../constants/calendar-event-participant-chunk-size");
const _createcompanyandcontactjob = require("../../../contact-creation-manager/jobs/create-company-and-contact.job");
const _matchparticipantservice = require("../../../match-participant/match-participant.service");
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
let CalendarEventParticipantService = class CalendarEventParticipantService {
    async findCalendarEventParticipantsByCalendarEventIds({ calendarEventIds }) {
        const calendarEventParticipantRepository = this.workspaceOrmManager.getRepository('calendarEventParticipant');
        return calendarEventParticipantRepository.find({
            where: {
                calendarEventId: (0, _typeorm.Any)([
                    ...new Set(calendarEventIds)
                ])
            }
        });
    }
    async writeCalendarEventParticipants({ operations, transactionScope }) {
        const calendarEventParticipantRepository = transactionScope.getRepository('calendarEventParticipant');
        if (operations.participantIdsToDelete.length > 0) {
            await calendarEventParticipantRepository.delete({
                id: (0, _typeorm.Any)(operations.participantIdsToDelete)
            });
        }
        if (operations.participantsToUpdate.length > 0) {
            await calendarEventParticipantRepository.updateMany(operations.participantsToUpdate);
        }
        for (const participantsChunk of (0, _lodashchunk.default)(operations.participantsToInsert, _calendareventparticipantchunksize.CALENDAR_EVENT_PARTICIPANT_CHUNK_SIZE)){
            await calendarEventParticipantRepository.insert(participantsChunk);
        }
    }
    async matchParticipantsAndEnqueueContactCreationJob({ savedParticipantIds, calendarChannel, connectedAccount, workspaceId, calendarEventIds }) {
        const authContext = (0, _buildsystemauthcontextutil.buildSystemAuthContext)(workspaceId);
        await this.workspaceOrmManager.executeInWorkspaceContext(async ()=>{
            const calendarEventParticipantRepository = this.workspaceOrmManager.getRepository('calendarEventParticipant');
            const savedParticipants = [];
            for (const savedParticipantIdsChunk of (0, _lodashchunk.default)(savedParticipantIds, _calendareventparticipantchunksize.CALENDAR_EVENT_PARTICIPANT_CHUNK_SIZE)){
                const participantsChunk = await calendarEventParticipantRepository.find({
                    where: {
                        id: (0, _typeorm.In)(savedParticipantIdsChunk)
                    }
                });
                savedParticipants.push(...participantsChunk);
            }
            if (calendarChannel.isContactAutoCreationEnabled) {
                await this.messageQueueService.add(_createcompanyandcontactjob.CreateCompanyAndContactJob.name, {
                    workspaceId,
                    connectedAccount,
                    contactsToCreate: savedParticipants.map((participant)=>({
                            handle: participant.handle ?? '',
                            displayName: participant.displayName ?? participant.handle ?? ''
                        })),
                    source: _types.FieldActorSource.CALENDAR
                });
            }
            await this.matchParticipantService.matchParticipants({
                participants: savedParticipants,
                sourceRecordIds: calendarEventIds,
                objectMetadataName: 'calendarEventParticipant',
                matchWith: 'workspaceMemberAndPerson'
            });
        }, authContext, {
            lite: true
        });
    }
    constructor(workspaceOrmManager, matchParticipantService, messageQueueService){
        this.workspaceOrmManager = workspaceOrmManager;
        this.matchParticipantService = matchParticipantService;
        this.messageQueueService = messageQueueService;
    }
};
CalendarEventParticipantService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_param(2, (0, _messagequeuedecorator.InjectMessageQueue)(_messagequeueconstants.MessageQueue.contactCreationQueue)),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _workspaceormmanager.WorkspaceOrmManager === "undefined" ? Object : _workspaceormmanager.WorkspaceOrmManager,
        typeof _matchparticipantservice.MatchParticipantService === "undefined" ? Object : _matchparticipantservice.MatchParticipantService,
        typeof _messagequeueservice.MessageQueueService === "undefined" ? Object : _messagequeueservice.MessageQueueService
    ])
], CalendarEventParticipantService);

//# sourceMappingURL=calendar-event-participant.service.js.map