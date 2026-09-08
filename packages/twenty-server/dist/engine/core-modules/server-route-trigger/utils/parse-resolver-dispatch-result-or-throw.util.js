"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "parseResolverDispatchResultOrThrow", {
    enumerable: true,
    get: function() {
        return parseResolverDispatchResultOrThrow;
    }
});
const _guards = require("@sniptt/guards");
const _zod = require("zod");
const _serverroutetriggerexception = require("../exceptions/server-route-trigger.exception");
const resolverDispatchResultSchema = _zod.z.object({
    workspaceId: _zod.z.uuid(),
    targetLogicFunctionUniversalIdentifier: _zod.z.uuid(),
    payload: _zod.z.custom((value)=>(0, _guards.isObject)(value)).optional()
});
const parseResolverDispatchResultOrThrow = (data)=>{
    const parsedDispatchResult = resolverDispatchResultSchema.safeParse(data);
    if (!parsedDispatchResult.success) {
        throw new _serverroutetriggerexception.ServerRouteTriggerException('Resolver logic function must return either a Response, or { workspaceId: string; targetLogicFunctionUniversalIdentifier: string; payload?: object }', _serverroutetriggerexception.ServerRouteTriggerExceptionCode.RESOLVER_INVALID_RESULT);
    }
    return parsedDispatchResult.data;
};

//# sourceMappingURL=parse-resolver-dispatch-result-or-throw.util.js.map