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
    get getUpdateEventRecords () {
        return getUpdateEventRecords;
    },
    get mergeRecordWithUpdateValues () {
        return mergeRecordWithUpdateValues;
    },
    get mergeRecordsWithUpdateValues () {
        return mergeRecordsWithUpdateValues;
    }
});
const _guards = require("@sniptt/guards");
const getConcreteUpdateValues = (values)=>Object.fromEntries(Object.entries(values).filter(([, value])=>typeof value !== 'function'));
const mergeRecordWithUpdateValues = (record, values)=>{
    if (values === undefined) {
        return record;
    }
    return {
        ...record,
        ...getConcreteUpdateValues(values)
    };
};
const mergeRecordsWithUpdateValues = (records, values)=>{
    if (!Array.isArray(values)) {
        const concreteValues = getConcreteUpdateValues(values);
        return records.map((record)=>({
                ...record,
                ...concreteValues
            }));
    }
    return records.map((record, index)=>mergeRecordWithUpdateValues(record, values[index] ?? values[0]));
};
const getUpdateEventRecords = (recordsBefore, recordsAfter)=>{
    const recordsAfterById = new Map(recordsAfter.filter((record)=>(0, _guards.isNonEmptyString)(record.id)).map((record)=>[
            record.id,
            record
        ]));
    return recordsBefore.map((recordBefore, index)=>(0, _guards.isNonEmptyString)(recordBefore.id) ? recordsAfterById.get(recordBefore.id) ?? recordBefore : recordsAfter[index] ?? recordBefore);
};

//# sourceMappingURL=merge-records-with-update-values.util.js.map