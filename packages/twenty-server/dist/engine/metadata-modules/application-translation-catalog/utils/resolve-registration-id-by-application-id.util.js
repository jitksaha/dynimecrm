"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "resolveRegistrationIdByApplicationId", {
    enumerable: true,
    get: function() {
        return resolveRegistrationIdByApplicationId;
    }
});
const _utils = require("twenty-shared/utils");
const resolveRegistrationIdByApplicationId = ({ applicationIds, flatApplicationMaps, standardApplicationId })=>{
    const registrationIdByApplicationId = new Map();
    for (const applicationId of new Set(applicationIds)){
        if (!(0, _utils.isDefined)(applicationId) || applicationId === standardApplicationId) {
            continue;
        }
        const applicationRegistrationId = flatApplicationMaps.byId[applicationId]?.applicationRegistrationId;
        if ((0, _utils.isDefined)(applicationRegistrationId)) {
            registrationIdByApplicationId.set(applicationId, applicationRegistrationId);
        }
    }
    return registrationIdByApplicationId;
};

//# sourceMappingURL=resolve-registration-id-by-application-id.util.js.map