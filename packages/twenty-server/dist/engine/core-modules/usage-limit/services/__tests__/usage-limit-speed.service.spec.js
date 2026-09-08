"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _testing = require("@nestjs/testing");
const _cachestorageexception = require("../../../cache-storage/exceptions/cache-storage.exception");
const _cachestoragenamespaceenum = require("../../../cache-storage/types/cache-storage-namespace.enum");
const _twentyconfigservice = require("../../../twenty-config/twenty-config.service");
const _usagelimitspeedservice = require("../usage-limit-speed.service");
const _usageoperationtypeenum = require("../../../usage/enums/usage-operation-type.enum");
const _usageresourcetypeenum = require("../../../usage/enums/usage-resource-type.enum");
const _workspacecacheexception = require("../../../../workspace-cache/exceptions/workspace-cache.exception");
const _workspacecacheservice = require("../../../../workspace-cache/services/workspace-cache.service");
const apiKeyContext = {
    type: 'apiKey',
    workspace: {
        id: 'workspace-1'
    },
    apiKey: {
        id: 'key-1'
    }
};
describe('UsageLimitSpeedService', ()=>{
    let service;
    const cacheStorage = {
        runScript: jest.fn().mockResolvedValue([
            1,
            0,
            0
        ])
    };
    const workspaceCacheService = {
        getOrRecompute: jest.fn().mockResolvedValue({
            usageLimitRules: {
                byResourceType: {}
            }
        })
    };
    const twentyConfigService = {
        get: jest.fn((key)=>key.endsWith('_IN_MS') ? 60_000 : 100)
    };
    const consume = ()=>service.consumeOrThrow({
            resourceType: _usageresourcetypeenum.UsageResourceType.API,
            authContext: apiKeyContext,
            operationType: _usageoperationtypeenum.UsageOperationType.API_REQUEST
        });
    beforeEach(async ()=>{
        jest.clearAllMocks();
        const module = await _testing.Test.createTestingModule({
            providers: [
                _usagelimitspeedservice.UsageLimitSpeedService,
                {
                    provide: _cachestoragenamespaceenum.CacheStorageNamespace.EngineUsageLimit,
                    useValue: cacheStorage
                },
                {
                    provide: _workspacecacheservice.WorkspaceCacheService,
                    useValue: workspaceCacheService
                },
                {
                    provide: _twentyconfigservice.TwentyConfigService,
                    useValue: twentyConfigService
                }
            ]
        }).compile();
        service = module.get(_usagelimitspeedservice.UsageLimitSpeedService);
    });
    it('admits the request when the rules cannot be read from storage', async ()=>{
        workspaceCacheService.getOrRecompute.mockRejectedValueOnce(new Error('Socket closed unexpectedly'));
        await expect(consume()).resolves.toBeUndefined();
        expect(cacheStorage.runScript).not.toHaveBeenCalled();
    });
    it('surfaces a misuse of the cache api instead of degrading', async ()=>{
        workspaceCacheService.getOrRecompute.mockRejectedValueOnce(new _workspacecacheexception.WorkspaceCacheException('Invalid parameters', _workspacecacheexception.WorkspaceCacheExceptionCode.INVALID_PARAMETERS));
        await expect(consume()).rejects.toThrow(_workspacecacheexception.WorkspaceCacheException);
    });
    it('admits the request when the counters cannot be consumed', async ()=>{
        cacheStorage.runScript.mockRejectedValueOnce(new _cachestorageexception.CacheStorageException('Script execution failed', _cachestorageexception.CacheStorageExceptionCode.SCRIPT_EXECUTION_FAILED));
        await expect(consume()).resolves.toBeUndefined();
    });
    it('denies the request when a bucket is exhausted', async ()=>{
        cacheStorage.runScript.mockResolvedValueOnce([
            0,
            1,
            1500
        ]);
        await expect(consume()).rejects.toThrow(/Rate limit exceeded/);
    });
});

//# sourceMappingURL=usage-limit-speed.service.spec.js.map