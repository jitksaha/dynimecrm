"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "buildFormattedToRawLookupDto", {
    enumerable: true,
    get: function() {
        return buildFormattedToRawLookupDto;
    }
});
const _utils = require("twenty-shared/utils");
const buildFormattedToRawLookupDto = ({ axisLookups })=>{
    const mergedLookup = new Map();
    for (const { formattedToRawLookup, relationLabelResolution } of axisLookups){
        const unresolvedRecordIds = relationLabelResolution?.unresolvedRecordIds;
        for (const [formattedValue, rawValue] of formattedToRawLookup){
            const isUnresolvedRecordId = (0, _utils.isDefined)(unresolvedRecordIds) && unresolvedRecordIds.has(String(rawValue));
            if (isUnresolvedRecordId) {
                continue;
            }
            mergedLookup.set(formattedValue, rawValue);
        }
    }
    return Object.fromEntries(mergedLookup);
};

//# sourceMappingURL=build-formatted-to-raw-lookup-dto.util.js.map