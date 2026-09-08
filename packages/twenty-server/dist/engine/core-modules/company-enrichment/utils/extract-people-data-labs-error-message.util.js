"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "extractPeopleDataLabsErrorMessage", {
    enumerable: true,
    get: function() {
        return extractPeopleDataLabsErrorMessage;
    }
});
const _guards = require("@sniptt/guards");
const _utils = require("twenty-shared/utils");
const extractMessageFromValue = (messageValue)=>{
    if ((0, _guards.isNonEmptyString)(messageValue)) {
        return messageValue;
    }
    if (Array.isArray(messageValue)) {
        const joinedMessages = messageValue.filter(_guards.isString).join('; ');
        return (0, _guards.isNonEmptyString)(joinedMessages) ? joinedMessages : undefined;
    }
    return undefined;
};
const extractPeopleDataLabsErrorMessage = ({ json, httpStatus })=>{
    const errorField = json.error;
    if ((0, _guards.isObject)(errorField)) {
        const messageFromErrorObject = extractMessageFromValue(errorField.message);
        if ((0, _utils.isDefined)(messageFromErrorObject)) {
            return messageFromErrorObject;
        }
    }
    const messageFromTopLevelField = extractMessageFromValue(errorField) ?? extractMessageFromValue(json.message);
    if ((0, _utils.isDefined)(messageFromTopLevelField)) {
        return messageFromTopLevelField;
    }
    return `PDL request failed (HTTP ${httpStatus}).`;
};

//# sourceMappingURL=extract-people-data-labs-error-message.util.js.map