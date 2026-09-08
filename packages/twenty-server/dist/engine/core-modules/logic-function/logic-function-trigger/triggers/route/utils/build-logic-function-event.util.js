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
    get buildLogicFunctionEvent () {
        return buildLogicFunctionEvent;
    },
    get extractBody () {
        return extractBody;
    },
    get extractRawBody () {
        return extractRawBody;
    },
    get filterRequestHeaders () {
        return filterRequestHeaders;
    },
    get normalizePathParameters () {
        return normalizePathParameters;
    },
    get normalizeQueryStringParameters () {
        return normalizeQueryStringParameters;
    }
});
const _utils = require("twenty-shared/utils");
const _guards = require("@sniptt/guards");
const normalizeHeaderValue = (headerValue)=>Array.isArray(headerValue) ? headerValue.join(', ') : headerValue;
const filterRequestHeaders = ({ requestHeaders, forwardedRequestHeaders, forwardAllHeaders = false })=>{
    if (forwardAllHeaders) {
        const allHeaders = {};
        for (const [headerName, headerValue] of Object.entries(requestHeaders)){
            if (headerValue === undefined) {
                continue;
            }
            allHeaders[headerName] = normalizeHeaderValue(headerValue);
        }
        return allHeaders;
    }
    const lowercaseForwardedHeaders = forwardedRequestHeaders.map((h)=>h.toLowerCase());
    const filteredHeaders = {};
    for (const headerName of lowercaseForwardedHeaders){
        const headerValue = requestHeaders[headerName];
        if (headerValue !== undefined) {
            filteredHeaders[headerName] = normalizeHeaderValue(headerValue);
        }
    }
    return filteredHeaders;
};
const extractRawBody = (request)=>{
    const rawBody = request.rawBody;
    if (!(0, _utils.isDefined)(rawBody)) {
        return undefined;
    }
    return rawBody.toString('utf-8');
};
const extractBody = (request)=>{
    if (!(0, _utils.isDefined)(request.body)) {
        return null;
    }
    if ((0, _guards.isObject)(request.body) && !Buffer.isBuffer(request.body)) {
        return request.body;
    }
    if ((0, _guards.isString)(request.body)) {
        try {
            return JSON.parse(request.body);
        } catch  {
            return {
                raw: request.body
            };
        }
    }
    if (Buffer.isBuffer(request.body)) {
        try {
            return JSON.parse(request.body.toString('utf-8'));
        } catch  {
            return {
                raw: request.body.toString('utf-8')
            };
        }
    }
    return {
        raw: String(request.body)
    };
};
const normalizeQueryStringParameters = (query)=>{
    const normalized = {};
    for (const [key, value] of Object.entries(query)){
        if (value === undefined) {
            continue;
        }
        if (Array.isArray(value)) {
            const stringValues = value.filter((v)=>typeof v === 'string');
            normalized[key] = stringValues.join(',');
        } else if (typeof value === 'string') {
            normalized[key] = value;
        } else if (typeof value === 'object') {
            normalized[key] = JSON.stringify(value);
        }
    }
    return normalized;
};
const normalizePathParameters = (pathParams)=>{
    const normalized = {};
    for (const [key, value] of Object.entries(pathParams)){
        if (value === undefined) {
            continue;
        }
        if (Array.isArray(value)) {
            normalized[key] = value.join(',');
        } else {
            normalized[key] = value;
        }
    }
    return normalized;
};
const buildLogicFunctionEvent = ({ request, pathParameters, forwardedRequestHeaders, forwardAllHeaders = false, userWorkspaceId })=>{
    const rawBody = extractRawBody(request);
    return {
        headers: filterRequestHeaders({
            requestHeaders: request.headers,
            forwardedRequestHeaders,
            forwardAllHeaders
        }),
        queryStringParameters: normalizeQueryStringParameters(request.query),
        pathParameters: normalizePathParameters(pathParameters),
        body: extractBody(request),
        ...(0, _utils.isDefined)(rawBody) ? {
            rawBody
        } : {},
        isBase64Encoded: false,
        requestContext: {
            http: {
                method: request.method,
                path: request.path
            }
        },
        userWorkspaceId
    };
};

//# sourceMappingURL=build-logic-function-event.util.js.map