"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "objectRecordDiffMerge", {
    enumerable: true,
    get: function() {
        return objectRecordDiffMerge;
    }
});
function objectRecordDiffMerge(// oxlint-disable-next-line typescript/no-explicit-any
oldRecord, // oxlint-disable-next-line typescript/no-explicit-any
newRecord) {
    // oxlint-disable-next-line typescript/no-explicit-any
    const result = {
        diff: {}
    };
    Object.keys(oldRecord.diff ?? {}).forEach((key)=>{
        if (newRecord.diff && newRecord.diff[key]) {
            result.diff[key] = {
                before: oldRecord.diff[key].before,
                after: newRecord.diff[key].after
            };
        } else {
            result.diff[key] = oldRecord.diff[key];
        }
    });
    Object.keys(newRecord.diff ?? {}).forEach((key)=>{
        if (!result.diff[key]) {
            result.diff[key] = newRecord.diff[key];
        }
    });
    return result;
}

//# sourceMappingURL=object-record-diff-merge.js.map