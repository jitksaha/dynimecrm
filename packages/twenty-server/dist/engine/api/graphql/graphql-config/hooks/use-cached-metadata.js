"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "useCachedMetadata", {
    enumerable: true,
    get: function() {
        return useCachedMetadata;
    }
});
const _crypto = require("crypto");
const _node = /*#__PURE__*/ _interop_require_wildcard(require("@sentry/node"));
const _utils = require("twenty-shared/utils");
function _getRequireWildcardCache(nodeInterop) {
    if (typeof WeakMap !== "function") return null;
    var cacheBabelInterop = new WeakMap();
    var cacheNodeInterop = new WeakMap();
    return (_getRequireWildcardCache = function(nodeInterop) {
        return nodeInterop ? cacheNodeInterop : cacheBabelInterop;
    })(nodeInterop);
}
function _interop_require_wildcard(obj, nodeInterop) {
    if (!nodeInterop && obj && obj.__esModule) {
        return obj;
    }
    if (obj === null || typeof obj !== "object" && typeof obj !== "function") {
        return {
            default: obj
        };
    }
    var cache = _getRequireWildcardCache(nodeInterop);
    if (cache && cache.has(obj)) {
        return cache.get(obj);
    }
    var newObj = {
        __proto__: null
    };
    var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;
    for(var key in obj){
        if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) {
            var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;
            if (desc && (desc.get || desc.set)) {
                Object.defineProperty(newObj, key, desc);
            } else {
                newObj[key] = obj[key];
            }
        }
    }
    newObj.default = obj;
    if (cache) {
        cache.set(obj, newObj);
    }
    return newObj;
}
function useCachedMetadata(config) {
    const computeCacheKey = async ({ operationName, operationConfig, workspaceId, request })=>{
        const dependencyHash = await config.dependencyHashGetter(workspaceId, operationConfig.dependencies);
        const queryHash = (0, _crypto.createHash)('sha256').update(request.body.query).update(JSON.stringify(request.body.variables ?? null)).digest('hex');
        const userScopeSegment = operationConfig.scope === 'userWorkspace' ? `:${request.userWorkspaceId}` : '';
        return `graphql:operations:${operationName}:${workspaceId}:${dependencyHash}${userScopeSegment}:${request.locale}:${queryHash}`;
    };
    // oxlint-disable-next-line typescript/no-explicit-any
    const getOperationName = (serverContext)=>serverContext?.req?.body?.operationName;
    const getOperationCacheConfig = (operationName)=>typeof operationName === 'string' && Object.prototype.hasOwnProperty.call(config.operationsToCache, operationName) ? config.operationsToCache[operationName] : undefined;
    const cacheHitRequests = new WeakSet();
    const requestCacheKeys = new WeakMap();
    const resolveCacheKey = async ({ operationName, operationConfig, workspaceId, request })=>{
        let cacheKey;
        try {
            cacheKey = await computeCacheKey({
                operationName,
                operationConfig,
                workspaceId,
                request
            });
        } catch (error) {
            _node.captureException(error);
            cacheKey = null;
        }
        requestCacheKeys.set(request, cacheKey);
        return cacheKey;
    };
    const getCachedResponse = ({ cacheKey, operationName, phase })=>_node.startSpan({
            name: 'metadata GraphQL cache lookup',
            op: 'cache.get',
            onlyIfParent: true,
            attributes: {
                'cache.phase': phase,
                'graphql.operation.name': operationName,
                'graphql.operation.type': 'query'
            }
        }, async (span)=>{
            const cachedResponse = await config.cacheGetter(cacheKey);
            span.setAttribute('cache.hit', Boolean(cachedResponse));
            return cachedResponse;
        });
    return {
        onRequest: async ({ endResponse, serverContext })=>{
            // TODO: we should probably override the graphql-yoga request type to include the workspace and locale
            const request = serverContext.req;
            const workspaceId = request.workspace?.id;
            if (!workspaceId) {
                return;
            }
            const operationName = getOperationName(serverContext);
            const operationConfig = getOperationCacheConfig(operationName);
            if (!(0, _utils.isDefined)(operationConfig)) {
                return;
            }
            _node.setTags({
                operationName,
                operation: 'query'
            });
            _node.getCurrentScope().setTransactionName(operationName);
            const cacheKey = await resolveCacheKey({
                operationName,
                operationConfig,
                workspaceId,
                request
            });
            if (!(0, _utils.isDefined)(cacheKey)) {
                return;
            }
            const cachedResponse = await getCachedResponse({
                cacheKey,
                operationName,
                phase: 'request'
            });
            if (cachedResponse) {
                cacheHitRequests.add(request);
                const earlyResponse = Response.json(cachedResponse);
                return endResponse(earlyResponse);
            }
        },
        onResponse: async ({ response, serverContext })=>{
            const request = serverContext.req;
            if (!request.workspace?.id) {
                return;
            }
            const operationName = getOperationName(serverContext);
            if (!(0, _utils.isDefined)(getOperationCacheConfig(operationName))) {
                return;
            }
            if (cacheHitRequests.delete(request)) {
                return;
            }
            const cacheKey = requestCacheKeys.get(request);
            if (!(0, _utils.isDefined)(cacheKey)) {
                return;
            }
            const cachedResponse = await getCachedResponse({
                cacheKey,
                operationName,
                phase: 'response'
            });
            if (!cachedResponse) {
                const responseBody = await response.json();
                if (responseBody.errors) {
                    return;
                }
                config.cacheSetter(cacheKey, responseBody);
            }
        }
    };
}

//# sourceMappingURL=use-cached-metadata.js.map