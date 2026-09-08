"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "findActiveFlatApplicationByUniversalIdentifier", {
    enumerable: true,
    get: function() {
        return findActiveFlatApplicationByUniversalIdentifier;
    }
});
const _utils = require("twenty-shared/utils");
const _findactiveflatapplicationbyidutil = require("./find-active-flat-application-by-id.util");
const findActiveFlatApplicationByUniversalIdentifier = (flatApplicationMaps, applicationUniversalIdentifier)=>{
    const applicationId = flatApplicationMaps.idByUniversalIdentifier[applicationUniversalIdentifier];
    return (0, _utils.isDefined)(applicationId) ? (0, _findactiveflatapplicationbyidutil.findActiveFlatApplicationById)(flatApplicationMaps, applicationId) : undefined;
};

//# sourceMappingURL=find-active-flat-application-by-universal-identifier.util.js.map