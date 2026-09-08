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
    get parseLinkedTimelineActivityHappensAt () {
        return parseLinkedTimelineActivityHappensAt;
    },
    get resolveLinkedTimelineActivityHappensAt () {
        return resolveLinkedTimelineActivityHappensAt;
    },
    get resolveTimelineActivityHappensAt () {
        return resolveTimelineActivityHappensAt;
    }
});
const _guards = require("@sniptt/guards");
const _utils = require("twenty-shared/utils");
const parseTimestamp = (value)=>{
    if (value instanceof Date) {
        return Number.isNaN(value.getTime()) ? undefined : value;
    }
    if (!(0, _guards.isNonEmptyString)(value)) {
        return undefined;
    }
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? undefined : date;
};
const getRecordTimestamp = (record)=>{
    if (!(0, _utils.isDefined)(record)) {
        return undefined;
    }
    const updatedAt = 'updatedAt' in record ? record.updatedAt : undefined;
    return updatedAt ?? ('createdAt' in record ? record.createdAt : undefined);
};
const resolveTimelineActivityHappensAt = (event)=>{
    const record = event.properties.after ?? event.properties.before;
    const recordTimestamp = parseTimestamp(getRecordTimestamp(record));
    return (0, _utils.isDefined)(recordTimestamp) ? recordTimestamp : new Date();
};
const parseLinkedTimelineActivityHappensAt = (value)=>parseTimestamp(value);
const resolveLinkedTimelineActivityHappensAt = ({ event, ruleAction, happensAtFieldName, sourceRecord })=>{
    const sourceRecordHappensAt = ruleAction === 'linked' && (0, _utils.isDefined)(happensAtFieldName) ? parseTimestamp(sourceRecord?.[happensAtFieldName]) : undefined;
    return sourceRecordHappensAt ?? resolveTimelineActivityHappensAt(event);
};

//# sourceMappingURL=resolve-timeline-activity-happens-at.util.js.map