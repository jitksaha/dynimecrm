"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "hasRestResponse", {
    enumerable: true,
    get: function() {
        return hasRestResponse;
    }
});
const _guards = require("@sniptt/guards");
const hasRestResponse = (exception)=>(0, _guards.isObject)(exception) && 'getResponseHeaders' in exception && (0, _guards.isFunction)(exception.getResponseHeaders) && 'getResponseBody' in exception && (0, _guards.isFunction)(exception.getResponseBody);

//# sourceMappingURL=has-rest-response.util.js.map