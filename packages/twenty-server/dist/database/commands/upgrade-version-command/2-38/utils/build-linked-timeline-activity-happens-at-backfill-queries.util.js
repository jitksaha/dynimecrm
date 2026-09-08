"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "buildLinkedTimelineActivityHappensAtBackfillQueries", {
    enumerable: true,
    get: function() {
        return buildLinkedTimelineActivityHappensAtBackfillQueries;
    }
});
const _metadata = require("twenty-shared/metadata");
// Linked activities were historically stamped with the participant row's own
// timestamps, so synced emails and meetings sat at import time instead of when
// they happened. The write path now uses these same source columns.
const LINKED_SOURCE_OBJECTS = [
    {
        label: 'message timeline activities',
        objectUniversalIdentifier: _metadata.STANDARD_OBJECTS.message.universalIdentifier,
        sourceTableName: 'message',
        happensAtColumnName: 'receivedAt'
    },
    {
        label: 'calendar event timeline activities',
        objectUniversalIdentifier: _metadata.STANDARD_OBJECTS.calendarEvent.universalIdentifier,
        sourceTableName: 'calendarEvent',
        happensAtColumnName: 'startsAt'
    }
];
const buildQueryForSourceObject = ({ schemaName, batchSize, sourceObject, timelineActivityTypeIds })=>{
    const { label, sourceTableName, happensAtColumnName } = sourceObject;
    const candidateSql = `SELECT candidate_timeline_activity."id"
FROM "${schemaName}"."timelineActivity" candidate_timeline_activity
INNER JOIN "${schemaName}"."${sourceTableName}" candidate_source
  ON candidate_source."id" = candidate_timeline_activity."linkedRecordId"
WHERE candidate_timeline_activity."timelineActivityTypeId" = ANY($1::uuid[])
  AND candidate_source."${happensAtColumnName}" IS NOT NULL
  AND candidate_timeline_activity."happensAt" IS DISTINCT FROM candidate_source."${happensAtColumnName}"`;
    return {
        label,
        countSql: `SELECT COUNT(*)::int AS "count" FROM (${candidateSql}) candidates`,
        updateSql: `UPDATE "${schemaName}"."timelineActivity" timeline_activity
SET "happensAt" = source."${happensAtColumnName}"
FROM "${schemaName}"."${sourceTableName}" source
WHERE timeline_activity."id" IN (${candidateSql}
  LIMIT ${batchSize})
  AND source."id" = timeline_activity."linkedRecordId"`,
        parameters: [
            timelineActivityTypeIds
        ]
    };
};
const buildLinkedTimelineActivityHappensAtBackfillQueries = ({ schemaName, batchSize, flatTimelineActivityTypes })=>LINKED_SOURCE_OBJECTS.flatMap((sourceObject)=>{
        // Inactive types still label rows written while they were active, so they
        // stay in scope; the filter mirrors how the write path picks the type.
        const timelineActivityTypeIds = flatTimelineActivityTypes.filter((flatTimelineActivityType)=>flatTimelineActivityType.action === 'linked' && flatTimelineActivityType.objectUniversalIdentifier === sourceObject.objectUniversalIdentifier).map((flatTimelineActivityType)=>flatTimelineActivityType.id);
        if (timelineActivityTypeIds.length === 0) {
            return [];
        }
        return [
            buildQueryForSourceObject({
                schemaName,
                batchSize,
                sourceObject,
                timelineActivityTypeIds
            })
        ];
    });

//# sourceMappingURL=build-linked-timeline-activity-happens-at-backfill-queries.util.js.map