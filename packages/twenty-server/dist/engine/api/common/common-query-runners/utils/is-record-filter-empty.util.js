"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "isRecordFilterEmpty", {
    enumerable: true,
    get: function() {
        return isRecordFilterEmpty;
    }
});
const _utils = require("twenty-shared/utils");
const isRecordFilterEmpty = (filter)=>{
    const filterEntries = Object.entries(filter);
    if (filterEntries.length === 0) {
        return true;
    }
    return filterEntries.every(([filterKey, filterValue])=>{
        if (filterKey === 'and' || filterKey === 'or') {
            const subFilters = (0, _utils.isDefined)(filterValue) ? filterValue : [];
            return subFilters.every(isRecordFilterEmpty);
        }
        if (filterKey === 'not') {
            const negatedFilter = (0, _utils.isDefined)(filterValue) ? filterValue : {};
            return isRecordFilterEmpty(negatedFilter);
        }
        return false;
    });
};

//# sourceMappingURL=is-record-filter-empty.util.js.map