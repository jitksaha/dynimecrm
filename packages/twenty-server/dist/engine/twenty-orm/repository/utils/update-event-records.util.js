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
    get getUpdateEventColumnsToReturn () {
        return getUpdateEventColumnsToReturn;
    },
    get mergeReturnedUpdateTimestamps () {
        return mergeReturnedUpdateTimestamps;
    }
});
const _guards = require("@sniptt/guards");
const _utils = require("twenty-shared/utils");
const getUpdateEventColumnsToReturn = (columnsToReturn, tableShape)=>(0, _utils.isDefined)(tableShape.columnShapeByColumnName.updatedAt) ? [
        ...new Set([
            ...columnsToReturn,
            'id',
            'updatedAt'
        ])
    ] : [
        ...new Set([
            ...columnsToReturn,
            'id'
        ])
    ];
const mergeReturnedUpdateTimestamps = (eventRecords, returnedRecords)=>{
    const returnedRecordsById = new Map(returnedRecords.filter((record)=>(0, _guards.isNonEmptyString)(record.id)).map((record)=>[
            record.id,
            record
        ]));
    return eventRecords.map((eventRecord)=>{
        const returnedRecord = (0, _guards.isNonEmptyString)(eventRecord.id) ? returnedRecordsById.get(eventRecord.id) : undefined;
        const returnedUpdatedAt = returnedRecord?.updatedAt;
        return (0, _utils.isDefined)(returnedUpdatedAt) ? {
            ...eventRecord,
            updatedAt: returnedUpdatedAt
        } : eventRecord;
    });
};

//# sourceMappingURL=update-event-records.util.js.map