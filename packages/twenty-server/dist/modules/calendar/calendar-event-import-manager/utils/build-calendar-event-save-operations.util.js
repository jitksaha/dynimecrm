"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "buildCalendarEventSaveOperations", {
    enumerable: true,
    get: function() {
        return buildCalendarEventSaveOperations;
    }
});
const _utils = require("twenty-shared/utils");
const _uuid = require("uuid");
const buildCalendarEventSaveOperations = ({ fetchedCalendarEvents, existingAssociations, calendarChannelId })=>{
    const existingAssociationByEventExternalId = new Map(existingAssociations.map((association)=>[
            association.eventExternalId,
            association
        ]));
    const saveOperations = {
        calendarEventsToInsert: [],
        calendarEventsToUpdate: [],
        associationsToInsert: [],
        associationsToUpdate: []
    };
    const participantsOfNewEvents = [];
    const participantsOfExistingEvents = [];
    for (const fetchedCalendarEvent of fetchedCalendarEvents){
        const { id: eventExternalId, participants, recurringEventExternalId = '' } = fetchedCalendarEvent;
        const calendarEvent = {
            iCalUid: fetchedCalendarEvent.iCalUid,
            title: fetchedCalendarEvent.title,
            description: fetchedCalendarEvent.description,
            startsAt: fetchedCalendarEvent.startsAt,
            endsAt: fetchedCalendarEvent.endsAt,
            location: fetchedCalendarEvent.location,
            isFullDay: fetchedCalendarEvent.isFullDay,
            isCanceled: fetchedCalendarEvent.isCanceled,
            conferenceSolution: fetchedCalendarEvent.conferenceSolution,
            conferenceLink: {
                primaryLinkLabel: fetchedCalendarEvent.conferenceLinkLabel,
                primaryLinkUrl: fetchedCalendarEvent.conferenceLinkUrl,
                secondaryLinks: []
            },
            externalCreatedAt: fetchedCalendarEvent.externalCreatedAt,
            externalUpdatedAt: fetchedCalendarEvent.externalUpdatedAt
        };
        const existingAssociation = existingAssociationByEventExternalId.get(eventExternalId);
        if ((0, _utils.isDefined)(existingAssociation)) {
            const { calendarEventId } = existingAssociation;
            saveOperations.calendarEventsToUpdate.push({
                criteria: calendarEventId,
                partialEntity: calendarEvent
            });
            saveOperations.associationsToUpdate.push({
                criteria: existingAssociation.id,
                partialEntity: {
                    recurringEventExternalId
                }
            });
            participantsOfExistingEvents.push(...participants.map((participant)=>({
                    ...participant,
                    calendarEventId
                })));
            continue;
        }
        const calendarEventId = (0, _uuid.v4)();
        saveOperations.calendarEventsToInsert.push({
            id: calendarEventId,
            ...calendarEvent
        });
        saveOperations.associationsToInsert.push({
            calendarEventId,
            eventExternalId,
            calendarChannelId,
            recurringEventExternalId
        });
        participantsOfNewEvents.push(...participants.map((participant)=>({
                ...participant,
                calendarEventId
            })));
    }
    return {
        saveOperations,
        participantsOfNewEvents,
        participantsOfExistingEvents
    };
};

//# sourceMappingURL=build-calendar-event-save-operations.util.js.map