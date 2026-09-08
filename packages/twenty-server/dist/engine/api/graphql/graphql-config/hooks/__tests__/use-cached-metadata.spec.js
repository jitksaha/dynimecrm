"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _node = /*#__PURE__*/ _interop_require_wildcard(require("@sentry/node"));
const _usecachedmetadata = require("../use-cached-metadata");
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
jest.mock('@sentry/node', ()=>({
        captureException: jest.fn(),
        getCurrentScope: jest.fn(),
        setTags: jest.fn(),
        startSpan: jest.fn()
    }));
describe('useCachedMetadata', ()=>{
    const mockScope = {
        setTransactionName: jest.fn()
    };
    const mockSpan = {
        setAttribute: jest.fn()
    };
    const expectedSpanOptions = (phase)=>({
            name: 'metadata GraphQL cache lookup',
            op: 'cache.get',
            onlyIfParent: true,
            attributes: {
                'cache.phase': phase,
                'graphql.operation.name': 'FindAllViews',
                'graphql.operation.type': 'query'
            }
        });
    const createRequest = (overrides = {})=>({
            body: {
                operationName: 'FindAllViews',
                query: 'query FindAllViews { views { id } }'
            },
            locale: 'en',
            userWorkspaceId: 'user-workspace-id',
            workspace: {
                id: 'workspace-id'
            },
            ...overrides
        });
    const createPlugin = ({ cacheGetter = jest.fn().mockResolvedValue(undefined), cacheSetter = jest.fn(), dependencyHashGetter = jest.fn().mockResolvedValue('dependency-hash') } = {})=>(0, _usecachedmetadata.useCachedMetadata)({
            cacheGetter,
            cacheSetter,
            operationsToCache: {
                FindAllViews: {
                    scope: 'userWorkspace',
                    dependencies: [
                        'flatViewMaps'
                    ]
                }
            },
            dependencyHashGetter
        });
    beforeEach(()=>{
        jest.clearAllMocks();
        jest.mocked(_node.getCurrentScope).mockReturnValue(mockScope);
        jest.mocked(_node.startSpan).mockImplementation((_options, callback)=>callback(mockSpan));
    });
    it('reads the cache once when returning a cached response', async ()=>{
        const cachedResponse = {
            data: {
                views: [
                    {
                        id: 'view-id'
                    }
                ]
            }
        };
        const cacheGetter = jest.fn().mockResolvedValue(cachedResponse);
        const cacheSetter = jest.fn();
        const plugin = createPlugin({
            cacheGetter,
            cacheSetter
        });
        const request = createRequest();
        const serverContext = {
            req: request
        };
        const endResponse = jest.fn();
        await plugin.onRequest?.({
            endResponse,
            serverContext
        });
        const response = endResponse.mock.calls[0][0];
        await plugin.onResponse?.({
            response,
            serverContext
        });
        expect(cacheGetter).toHaveBeenCalledTimes(1);
        expect(cacheSetter).not.toHaveBeenCalled();
        expect(await response.json()).toEqual(cachedResponse);
        expect(_node.setTags).toHaveBeenCalledWith({
            operationName: 'FindAllViews',
            operation: 'query'
        });
        expect(mockScope.setTransactionName).toHaveBeenCalledWith('FindAllViews');
        expect(_node.startSpan).toHaveBeenCalledTimes(1);
        expect(_node.startSpan).toHaveBeenCalledWith(expectedSpanOptions('request'), expect.any(Function));
        expect(mockSpan.setAttribute).toHaveBeenCalledWith('cache.hit', true);
    });
    it('preserves a value populated after the request cache miss', async ()=>{
        const responseCachedByAnotherRequest = {
            data: {
                views: [
                    {
                        id: 'view-id'
                    }
                ]
            }
        };
        const cacheGetter = jest.fn().mockResolvedValueOnce(undefined).mockResolvedValueOnce(responseCachedByAnotherRequest);
        const cacheSetter = jest.fn();
        const plugin = createPlugin({
            cacheGetter,
            cacheSetter
        });
        const request = createRequest();
        const serverContext = {
            req: request
        };
        const response = Response.json({
            data: {
                views: []
            }
        });
        await plugin.onRequest?.({
            endResponse: jest.fn(),
            serverContext
        });
        await plugin.onResponse?.({
            response,
            serverContext
        });
        expect(cacheGetter).toHaveBeenCalledTimes(2);
        expect(cacheSetter).not.toHaveBeenCalled();
        expect(_node.startSpan).toHaveBeenNthCalledWith(1, expectedSpanOptions('request'), expect.any(Function));
        expect(_node.startSpan).toHaveBeenNthCalledWith(2, expectedSpanOptions('response'), expect.any(Function));
        expect(mockSpan.setAttribute).toHaveBeenNthCalledWith(1, 'cache.hit', false);
        expect(mockSpan.setAttribute).toHaveBeenNthCalledWith(2, 'cache.hit', true);
    });
    it('resolves dependency hashes once per request and caches the response under that key', async ()=>{
        const cacheGetter = jest.fn().mockResolvedValue(undefined);
        const cacheSetter = jest.fn();
        const dependencyHashGetter = jest.fn().mockResolvedValue('dependency-hash');
        const plugin = createPlugin({
            cacheGetter,
            cacheSetter,
            dependencyHashGetter
        });
        const request = createRequest();
        const serverContext = {
            req: request
        };
        const responseBody = {
            data: {
                views: []
            }
        };
        await plugin.onRequest?.({
            endResponse: jest.fn(),
            serverContext
        });
        await plugin.onResponse?.({
            response: Response.json(responseBody),
            serverContext
        });
        expect(dependencyHashGetter).toHaveBeenCalledTimes(1);
        expect(dependencyHashGetter).toHaveBeenCalledWith('workspace-id', [
            'flatViewMaps'
        ]);
        const cacheKey = cacheGetter.mock.calls[0][0];
        expect(cacheKey).toContain('dependency-hash');
        expect(cacheKey).toContain('user-workspace-id');
        expect(cacheSetter).toHaveBeenCalledWith(cacheKey, responseBody);
    });
    it('shares cache entries across users for workspace-scoped operations', async ()=>{
        const cacheGetter = jest.fn().mockResolvedValue(undefined);
        const plugin = (0, _usecachedmetadata.useCachedMetadata)({
            cacheGetter,
            cacheSetter: jest.fn(),
            operationsToCache: {
                FindAllViews: {
                    scope: 'workspace',
                    dependencies: [
                        'flatViewMaps'
                    ]
                }
            },
            dependencyHashGetter: jest.fn().mockResolvedValue('dependency-hash')
        });
        const request = createRequest();
        const serverContext = {
            req: request
        };
        await plugin.onRequest?.({
            endResponse: jest.fn(),
            serverContext
        });
        const cacheKey = cacheGetter.mock.calls[0][0];
        expect(cacheKey).not.toContain('user-workspace-id');
        expect(cacheKey).toContain(':en:');
    });
    it('serves the request uncached when dependency hashes cannot be resolved', async ()=>{
        const cacheGetter = jest.fn();
        const cacheSetter = jest.fn();
        const dependencyHashGetter = jest.fn().mockRejectedValue(new Error('cache storage unavailable'));
        const plugin = createPlugin({
            cacheGetter,
            cacheSetter,
            dependencyHashGetter
        });
        const request = createRequest();
        const serverContext = {
            req: request
        };
        await plugin.onRequest?.({
            endResponse: jest.fn(),
            serverContext
        });
        await plugin.onResponse?.({
            response: Response.json({
                data: {
                    views: []
                }
            }),
            serverContext
        });
        expect(cacheGetter).not.toHaveBeenCalled();
        expect(cacheSetter).not.toHaveBeenCalled();
        expect(_node.captureException).toHaveBeenCalledTimes(1);
    });
    it('does not trace client-controlled operations outside the cache allowlist', async ()=>{
        const cacheGetter = jest.fn();
        const plugin = createPlugin({
            cacheGetter
        });
        const request = createRequest({
            body: {
                operationName: 'UncachedOperation',
                query: 'query UncachedOperation { views { id } }'
            }
        });
        const serverContext = {
            req: request
        };
        await plugin.onRequest?.({
            endResponse: jest.fn(),
            serverContext
        });
        await plugin.onResponse?.({
            response: Response.json({
                data: {}
            }),
            serverContext
        });
        expect(cacheGetter).not.toHaveBeenCalled();
        expect(_node.setTags).not.toHaveBeenCalled();
        expect(_node.startSpan).not.toHaveBeenCalled();
    });
    it('ignores operation names inherited from Object.prototype', async ()=>{
        const cacheGetter = jest.fn();
        const dependencyHashGetter = jest.fn();
        const plugin = createPlugin({
            cacheGetter,
            dependencyHashGetter
        });
        const request = createRequest({
            body: {
                operationName: 'constructor',
                query: 'query { views { id } }'
            }
        });
        const serverContext = {
            req: request
        };
        await plugin.onRequest?.({
            endResponse: jest.fn(),
            serverContext
        });
        expect(cacheGetter).not.toHaveBeenCalled();
        expect(dependencyHashGetter).not.toHaveBeenCalled();
    });
});

//# sourceMappingURL=use-cached-metadata.spec.js.map