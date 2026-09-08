"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "CalendarSaveEventsService", {
    enumerable: true,
    get: function() {
        return CalendarSaveEventsService;
    }
});
const _common = require("@nestjs/common");
const _typeorm = require("typeorm");
const _workspaceormmanager = require("../../../../engine/twenty-orm/workspace-orm.manager");
const _buildsystemauthcontextutil = require("../../../../engine/twenty-orm/utils/build-system-auth-context.util");
const _buildcalendareventsaveoperationsutil = require("../utils/build-calendar-event-save-operations.util");
const _calendareventparticipantservice = require("../../calendar-event-participant-manager/services/calendar-event-participant.service");
const _buildcalendareventparticipantsaveoperationsutil = require("../../calendar-event-participant-manager/utils/build-calendar-event-participant-save-operations.util");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let CalendarSaveEventsService = class CalendarSaveEventsService {
    async saveCalendarEventsAndEnqueueContactCreationJob(fetchedCalendarEvents, calendarChannel, connectedAccount, workspaceId) {
        const authContext = (0, _buildsystemauthcontextutil.buildSystemAuthContext)(workspaceId);
        const { savedParticipantIds, calendarEventIds } = await this.workspaceOrmManager.executeInWorkspaceContext(async ()=>{
            const calendarChannelEventAssociationRepository = this.workspaceOrmManager.getRepository('calendarChannelEventAssociation');
            const existingAssociations = await calendarChannelEventAssociationRepository.find({
                where: {
                    eventExternalId: (0, _typeorm.Any)(fetchedCalendarEvents.map((event)=>event.id)),
                    calendarChannelId: calendarChannel.id
                }
            });
            const { saveOperations, participantsOfNewEvents, participantsOfExistingEvents } = (0, _buildcalendareventsaveoperationsutil.buildCalendarEventSaveOperations)({
                fetchedCalendarEvents,
                existingAssociations,
                calendarChannelId: calendarChannel.id
            });
            const existingParticipants = await this.calendarEventParticipantService.findCalendarEventParticipantsByCalendarEventIds({
                calendarEventIds: participantsOfExistingEvents.map((participant)=>participant.calendarEventId)
            });
            const participantOperations = (0, _buildcalendareventparticipantsaveoperationsutil.buildCalendarEventParticipantSaveOperations)({
                fetchedParticipants: [
                    ...participantsOfNewEvents,
                    ...participantsOfExistingEvents
                ],
                existingParticipants
            });
            await this.workspaceOrmManager.runInWorkspaceTransaction(async (transactionScope)=>{
                const calendarEventRepository = transactionScope.getRepository('calendarEvent');
                const associationRepository = transactionScope.getRepository('calendarChannelEventAssociation');
                if (saveOperations.calendarEventsToInsert.length > 0) {
                    await calendarEventRepository.insert(saveOperations.calendarEventsToInsert);
                }
                if (saveOperations.calendarEventsToUpdate.length > 0) {
                    await calendarEventRepository.updateMany(saveOperations.calendarEventsToUpdate);
                }
                if (saveOperations.associationsToInsert.length > 0) {
                    await associationRepository.insert(saveOperations.associationsToInsert);
                }
                if (saveOperations.associationsToUpdate.length > 0) {
                    await associationRepository.updateMany(saveOperations.associationsToUpdate);
                }
                await this.calendarEventParticipantService.writeCalendarEventParticipants({
                    operations: participantOperations,
                    transactionScope
                });
            });
            return {
                savedParticipantIds: participantOperations.participantsToInsert.map((participant)=>participant.id),
                calendarEventIds: [
                    ...saveOperations.associationsToInsert.map(({ calendarEventId })=>calendarEventId),
                    ...saveOperations.calendarEventsToUpdate.map(({ criteria })=>criteria)
                ]
            };
        }, authContext, {
            lite: true
        });
        await this.calendarEventParticipantService.matchParticipantsAndEnqueueContactCreationJob({
            savedParticipantIds,
            calendarEventIds,
            calendarChannel,
            connectedAccount,
            workspaceId
        });
        return {
            calendarEventIds
        };
    }
    constructor(workspaceOrmManager, calendarEventParticipantService){
        this.workspaceOrmManager = workspaceOrmManager;
        this.calendarEventParticipantService = calendarEventParticipantService;
    }
};
CalendarSaveEventsService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _workspaceormmanager.WorkspaceOrmManager === "undefined" ? Object : _workspaceormmanager.WorkspaceOrmManager,
        typeof _calendareventparticipantservice.CalendarEventParticipantService === "undefined" ? Object : _calendareventparticipantservice.CalendarEventParticipantService
    ])
], CalendarSaveEventsService);

//# sourceMappingURL=calendar-save-events.service.js.map