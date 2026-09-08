"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "findActiveFlatApplicationById", {
    enumerable: true,
    get: function() {
        return findActiveFlatApplicationById;
    }
});
const _utils = require("twenty-shared/utils");
const findActiveFlatApplicationById = (flatApplicationMaps, applicationId)=>{
    const application = flatApplicationMaps.byId[applicationId];
    if (!(0, _utils.isDefined)(application) || (0, _utils.isDefined)(application.deletedAt)) {
        return undefined;
    }
    return application;
};

//# sourceMappingURL=find-active-flat-application-by-id.util.js.map