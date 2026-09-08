"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "parsePeopleDataLabsResponseItem", {
    enumerable: true,
    get: function() {
        return parsePeopleDataLabsResponseItem;
    }
});
const _guards = require("@sniptt/guards");
const _utils = require("twenty-shared/utils");
const _extractpeopledatalabserrormessageutil = require("./extract-people-data-labs-error-message.util");
const ASSUMED_SUCCESS_STATUS_WHEN_MISSING = 200;
const ENVELOPE_FIELD_NAMES = new Set([
    'status',
    'likelihood'
]);
const extractMatchedData = (responseItem)=>{
    if ((0, _utils.isPlainObject)(responseItem.data)) {
        return responseItem.data;
    }
    return Object.fromEntries(Object.entries(responseItem).filter(([fieldName])=>!ENVELOPE_FIELD_NAMES.has(fieldName)));
};
const parsePeopleDataLabsResponseItem = ({ item, requestedMinLikelihood })=>{
    if (!(0, _utils.isPlainObject)(item)) {
        return {
            outcome: 'error',
            httpStatus: 0,
            message: 'People Data Labs returned a malformed response item.'
        };
    }
    const httpStatus = (0, _guards.isNumber)(item.status) ? item.status : ASSUMED_SUCCESS_STATUS_WHEN_MISSING;
    if (httpStatus === 404) {
        return {
            outcome: 'notFound',
            httpStatus: 404
        };
    }
    if (httpStatus < 200 || httpStatus >= 300) {
        return {
            outcome: 'error',
            httpStatus,
            message: (0, _extractpeopledatalabserrormessageutil.extractPeopleDataLabsErrorMessage)({
                json: item,
                httpStatus
            })
        };
    }
    const matchedData = extractMatchedData(item);
    if (Object.keys(matchedData).length === 0) {
        return {
            outcome: 'notFound',
            httpStatus
        };
    }
    const matchLikelihood = (0, _guards.isNumber)(item.likelihood) ? item.likelihood : undefined;
    const isMatchBelowRequestedThreshold = (0, _utils.isDefined)(requestedMinLikelihood) && (0, _utils.isDefined)(matchLikelihood) && matchLikelihood < requestedMinLikelihood;
    if (isMatchBelowRequestedThreshold) {
        return {
            outcome: 'notFound',
            httpStatus
        };
    }
    return {
        outcome: 'matched',
        httpStatus,
        likelihood: matchLikelihood,
        data: matchedData
    };
};

//# sourceMappingURL=parse-people-data-labs-response-item.util.js.map