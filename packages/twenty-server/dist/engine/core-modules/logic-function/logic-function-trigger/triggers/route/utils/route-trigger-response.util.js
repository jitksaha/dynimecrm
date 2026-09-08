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
    get buildRouteTriggerResponse () {
        return buildRouteTriggerResponse;
    },
    get sendRouteTriggerResponse () {
        return sendRouteTriggerResponse;
    }
});
const _types = require("twenty-shared/types");
const _utils = require("twenty-shared/utils");
const ALLOWED_RESPONSE_HEADERS = new Set([
    'content-type',
    'content-language',
    'content-disposition',
    'cache-control',
    'retry-after'
]);
const buildRouteTriggerResponse = (data)=>{
    if ((0, _types.isLogicFunctionHttpResponse)(data)) {
        return {
            statusCode: data.status ?? 200,
            headers: data.headers ?? {},
            body: data.body
        };
    }
    return {
        statusCode: 200,
        headers: {},
        body: data
    };
};
const sendRouteTriggerResponse = (response, { statusCode, headers, body }, { allowAllHeaders = false } = {})=>{
    response.status(statusCode);
    for (const [key, value] of Object.entries(headers)){
        if (allowAllHeaders || ALLOWED_RESPONSE_HEADERS.has(key.toLowerCase())) {
            response.setHeader(key, value);
        }
    }
    if (!(0, _utils.isDefined)(body)) {
        response.send();
        return;
    }
    const hasContentType = (0, _utils.isDefined)(response.getHeader('content-type'));
    if (typeof body === 'string') {
        if (!hasContentType) {
            response.setHeader('content-type', 'text/plain');
        }
        response.send(body);
        return;
    }
    if (hasContentType) {
        response.send(JSON.stringify(body));
        return;
    }
    response.json(body);
};

//# sourceMappingURL=route-trigger-response.util.js.map