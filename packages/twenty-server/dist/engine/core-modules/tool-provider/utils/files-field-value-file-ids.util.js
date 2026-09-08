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
    get collectFileIdsFromFilesFieldValue () {
        return collectFileIdsFromFilesFieldValue;
    },
    get substituteFileIdsInFilesFieldValue () {
        return substituteFileIdsInFilesFieldValue;
    }
});
const _guards = require("@sniptt/guards");
const isFilesFieldValueEntry = (entry)=>(0, _guards.isObject)(entry) && (0, _guards.isNonEmptyString)(entry.fileId);
const collectFileIdsFromFilesFieldValue = (value)=>{
    if (!Array.isArray(value)) {
        return [];
    }
    return value.filter(isFilesFieldValueEntry).map((entry)=>entry.fileId);
};
const substituteFileIdsInFilesFieldValue = (value, fileIdSubstitutions)=>{
    if (!Array.isArray(value)) {
        return value;
    }
    return value.map((entry)=>isFilesFieldValueEntry(entry) && fileIdSubstitutions.has(entry.fileId) ? {
            ...entry,
            fileId: fileIdSubstitutions.get(entry.fileId)
        } : entry);
};

//# sourceMappingURL=files-field-value-file-ids.util.js.map