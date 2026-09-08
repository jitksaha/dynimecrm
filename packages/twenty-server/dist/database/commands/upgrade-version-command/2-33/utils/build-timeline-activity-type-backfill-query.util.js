"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "buildTimelineActivityTypeBackfillQuery", {
    enumerable: true,
    get: function() {
        return buildTimelineActivityTypeBackfillQuery;
    }
});
const _metadata = require("twenty-shared/metadata");
const _utils = require("twenty-shared/utils");
const _resolvetimelineactivitytypeidutil = require("../../../../../modules/timeline/utils/resolve-timeline-activity-type-id.util");
// The legacy name held `<object>.<databaseAction>` for a record's own events and
// `linked-<object>.<databaseAction>` for events about a linked record. A junction
// row being created or restored is a link, deleted is an unlink, and updated is
// the linked record itself changing, which is why the two halves differ.
const LINKED_ACTION_BY_DATABASE_ACTION = {
    created: 'linked',
    restored: 'linked',
    updated: 'updated',
    deleted: 'unlinked'
};
const SELF_ACTION_BY_DATABASE_ACTION = {
    created: 'created',
    updated: 'updated',
    deleted: 'deleted',
    restored: 'restored'
};
// Notes and tasks were written through the junction path, messages and calendar
// events through their own listeners, which is why only the first two carry the
// `linked-` prefix.
const LEGACY_JUNCTION_OBJECTS = [
    {
        legacyName: 'note',
        universalIdentifier: _metadata.STANDARD_OBJECTS.note.universalIdentifier
    },
    {
        legacyName: 'task',
        universalIdentifier: _metadata.STANDARD_OBJECTS.task.universalIdentifier
    }
];
const LEGACY_PARTICIPANT_NAMES = [
    {
        legacyName: 'message.linked',
        universalIdentifier: _metadata.STANDARD_OBJECTS.message.universalIdentifier
    },
    {
        legacyName: 'calendarEvent.linked',
        universalIdentifier: _metadata.STANDARD_OBJECTS.calendarEvent.universalIdentifier
    }
];
const buildTimelineActivityTypeBackfillQuery = ({ schemaName, flatTimelineActivityTypeMaps, batchSize })=>{
    const resolveTimelineActivityTypeId = (0, _resolvetimelineactivitytypeidutil.buildTimelineActivityTypeResolver)(flatTimelineActivityTypeMaps);
    const fallbackTypeId = resolveTimelineActivityTypeId({
        action: 'linked'
    });
    if (!(0, _utils.isDefined)(fallbackTypeId)) {
        return undefined;
    }
    const parameters = [];
    const whenClauses = [];
    const pushWhenClause = (condition, typeId)=>{
        if (!(0, _utils.isDefined)(typeId)) {
            return;
        }
        parameters.push(typeId);
        whenClauses.push(`WHEN ${condition} THEN $${parameters.length}::uuid`);
    };
    // The object-bound arms come first so a linked note keeps its own type rather
    // than matching the shared arm for the same action.
    for (const { legacyName, universalIdentifier } of LEGACY_PARTICIPANT_NAMES){
        pushWhenClause(`"name" = '${legacyName}'`, resolveTimelineActivityTypeId({
            action: 'linked',
            objectUniversalIdentifier: universalIdentifier
        }));
    }
    for (const { legacyName, universalIdentifier } of LEGACY_JUNCTION_OBJECTS){
        for (const [databaseAction, action] of Object.entries(LINKED_ACTION_BY_DATABASE_ACTION)){
            if (databaseAction === 'updated') {
                const legacyUpdatedName = `linked-${legacyName}.updated`;
                // Source-record updates and junction repoints shared this legacy name.
                // A source update carries the field diff; a junction event does not.
                pushWhenClause(`"name" = '${legacyUpdatedName}' AND jsonb_typeof("properties"->'diff') = 'object' AND "properties"->'diff' <> '{}'::jsonb`, resolveTimelineActivityTypeId({
                    action,
                    objectUniversalIdentifier: universalIdentifier
                }));
                pushWhenClause(`"name" = '${legacyUpdatedName}'`, resolveTimelineActivityTypeId({
                    action: 'linked',
                    objectUniversalIdentifier: universalIdentifier
                }));
                continue;
            }
            pushWhenClause(`"name" = 'linked-${legacyName}.${databaseAction}'`, resolveTimelineActivityTypeId({
                action,
                objectUniversalIdentifier: universalIdentifier
            }));
        }
    }
    for (const [databaseAction, action] of Object.entries(LINKED_ACTION_BY_DATABASE_ACTION)){
        pushWhenClause(`"name" LIKE 'linked-%' AND split_part("name", '.', 2) = '${databaseAction}'`, resolveTimelineActivityTypeId({
            action
        }));
    }
    for (const [databaseAction, action] of Object.entries(SELF_ACTION_BY_DATABASE_ACTION)){
        pushWhenClause(`"name" NOT LIKE 'linked-%' AND split_part("name", '.', 2) = '${databaseAction}'`, resolveTimelineActivityTypeId({
            action
        }));
    }
    parameters.push(fallbackTypeId);
    return {
        sql: `UPDATE "${schemaName}"."timelineActivity" SET "timelineActivityTypeId" = CASE ${whenClauses.join(' ')} ELSE $${parameters.length}::uuid END WHERE "id" IN (SELECT "id" FROM "${schemaName}"."timelineActivity" WHERE "timelineActivityTypeId" IS NULL LIMIT ${batchSize})`,
        parameters
    };
};

//# sourceMappingURL=build-timeline-activity-type-backfill-query.util.js.map