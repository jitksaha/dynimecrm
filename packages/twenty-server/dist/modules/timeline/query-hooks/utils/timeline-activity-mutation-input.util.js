"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
}
_export(exports, {
    get assertTimelineActivityCreationInputIsValid () {
        return assertTimelineActivityCreationInputIsValid;
    },
    get assertTimelineActivityTypeIsNotUpdated () {
        return assertTimelineActivityTypeIsNotUpdated;
    },
    get sanitizeApplicationTimelineActivityInput () {
        return sanitizeApplicationTimelineActivityInput;
    },
    get stampTimelineActivityTypeSnapshots () {
        return stampTimelineActivityTypeSnapshots;
    }
});
const _utils = require("twenty-shared/utils");
const _standarderrormessageconstant = require("../../../../engine/api/common/common-query-runners/errors/standard-error-message.constant");
const _graphqlqueryrunnerexception = require("../../../../engine/api/graphql/graphql-query-runner/errors/graphql-query-runner.exception");
const throwInvalidTimelineActivityInput = (message)=>{
    throw new _graphqlqueryrunnerexception.GraphqlQueryRunnerException(message, _graphqlqueryrunnerexception.GraphqlQueryRunnerExceptionCode.INVALID_QUERY_INPUT, {
        userFriendlyMessage: _standarderrormessageconstant.STANDARD_ERROR_MESSAGE
    });
};
const sanitizeApplicationTimelineActivityInput = ({ now = new Date(), record })=>{
    const happensAt = (0, _utils.isDefined)(record.happensAt) ? new Date(record.happensAt) : undefined;
    return {
        ...record,
        workspaceMemberId: null,
        ...(0, _utils.isDefined)(happensAt) && !Number.isNaN(happensAt.getTime()) && happensAt > now && {
            happensAt: now.toISOString()
        }
    };
};
const assertTimelineActivityCreationInputIsValid = ({ records, upsert })=>{
    if (upsert) {
        throwInvalidTimelineActivityInput('Timeline activities cannot be upserted because their type is immutable');
    }
    if (records.some(({ timelineActivityTypeId })=>!(0, _utils.isDefined)(timelineActivityTypeId))) {
        throwInvalidTimelineActivityInput('A timeline activity type is required on creation');
    }
    if (records.some((record)=>(0, _utils.isDefined)(record.linkedRecordId) !== (0, _utils.isDefined)(record.linkedObjectMetadataId) || Object.entries(record).filter(([key, value])=>key.startsWith('target') && (0, _utils.isDefined)(value)).length !== 1)) {
        throwInvalidTimelineActivityInput('A timeline activity requires exactly one target and complete linked record metadata');
    }
};
const stampTimelineActivityTypeSnapshots = ({ applicationId, now = new Date(), records, resolvedTimelineActivityTypeById })=>{
    if ((0, _utils.isDefined)(applicationId) && [
        ...resolvedTimelineActivityTypeById.values()
    ].some((timelineActivityType)=>timelineActivityType.applicationId !== applicationId)) {
        throwInvalidTimelineActivityInput('An application can only create its own timeline activity types');
    }
    return records.map((record)=>{
        if (!(0, _utils.isDefined)(record.timelineActivityTypeId)) {
            return throwInvalidTimelineActivityInput('Timeline activity type validation did not run');
        }
        const resolvedTimelineActivityType = resolvedTimelineActivityTypeById.get(record.timelineActivityTypeId);
        if (!(0, _utils.isDefined)(resolvedTimelineActivityType)) {
            return throwInvalidTimelineActivityInput('Timeline activity type resolution did not run');
        }
        const stampedRecord = {
            ...record,
            timelineActivityTypeSnapshot: resolvedTimelineActivityType.snapshot
        };
        return (0, _utils.isDefined)(applicationId) ? sanitizeApplicationTimelineActivityInput({
            now,
            record: stampedRecord
        }) : stampedRecord;
    });
};
const assertTimelineActivityTypeIsNotUpdated = (records)=>{
    if (records.some((record)=>Object.prototype.hasOwnProperty.call(record, 'timelineActivityTypeId') || Object.prototype.hasOwnProperty.call(record, 'timelineActivityTypeSnapshot'))) {
        throwInvalidTimelineActivityInput('A timeline activity type is immutable after creation');
    }
};

//# sourceMappingURL=timeline-activity-mutation-input.util.js.map