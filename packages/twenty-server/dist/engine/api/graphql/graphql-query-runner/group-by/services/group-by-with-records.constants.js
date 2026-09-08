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
    get RECORDS_PER_GROUP_LIMIT () {
        return RECORDS_PER_GROUP_LIMIT;
    },
    get RELATIONS_PER_RECORD_LIMIT () {
        return RELATIONS_PER_RECORD_LIMIT;
    },
    get SUB_QUERY_PREFIX () {
        return SUB_QUERY_PREFIX;
    }
});
const RECORDS_PER_GROUP_LIMIT = 10;
const RELATIONS_PER_RECORD_LIMIT = 5;
const SUB_QUERY_PREFIX = 'sub_query_';

//# sourceMappingURL=group-by-with-records.constants.js.map