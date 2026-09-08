"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "buildCalendarEventParticipantSaveOperations", {
    enumerable: true,
    get: function() {
        return buildCalendarEventParticipantSaveOperations;
    }
});
const _utils = require("twenty-shared/utils");
const _uuid = require("uuid");
const buildParticipantKey = ({ calendarEventId, handle })=>`${calendarEventId}:${handle}`;
const buildCalendarEventParticipantSaveOperations = ({ fetchedParticipants, existingParticipants })=>{
    const existingParticipantByKey = new Map();
    for (const existingParticipant of existingParticipants){
        const participantKey = buildParticipantKey(existingParticipant);
        if (existingParticipantByKey.has(participantKey)) {
            continue;
        }
        existingParticipantByKey.set(participantKey, existingParticipant);
    }
    const operations = {
        participantsToInsert: [],
        participantsToUpdate: [],
        participantIdsToDelete: []
    };
    for (const fetchedParticipant of fetchedParticipants){
        const existingParticipant = existingParticipantByKey.get(buildParticipantKey(fetchedParticipant));
        if (!(0, _utils.isDefined)(existingParticipant)) {
            operations.participantsToInsert.push({
                ...fetchedParticipant,
                id: (0, _uuid.v4)()
            });
            continue;
        }
        operations.participantsToUpdate.push({
            criteria: existingParticipant.id,
            partialEntity: fetchedParticipant
        });
    }
    const fetchedParticipantKeys = new Set(fetchedParticipants.map(buildParticipantKey));
    for (const existingParticipant of existingParticipants){
        if (fetchedParticipantKeys.has(buildParticipantKey(existingParticipant))) {
            continue;
        }
        operations.participantIdsToDelete.push(existingParticipant.id);
    }
    return operations;
};

//# sourceMappingURL=build-calendar-event-participant-save-operations.util.js.map