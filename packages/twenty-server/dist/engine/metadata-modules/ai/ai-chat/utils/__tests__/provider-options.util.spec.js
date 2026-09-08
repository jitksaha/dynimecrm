"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _provideroptionsutil = require("../provider-options.util");
const _aisdkpackageconst = require("../../../ai-models/constants/ai-sdk-package.const");
describe('provider-options.util', ()=>{
    describe('getCallLevelProviderOptions', ()=>{
        it('returns cache provider options for Anthropic models', ()=>{
            expect((0, _provideroptionsutil.getCallLevelProviderOptions)({
                sdkPackage: _aisdkpackageconst.AI_SDK_ANTHROPIC
            })).toEqual({
                anthropic: {
                    cacheControl: {
                        type: 'ephemeral'
                    }
                }
            });
        });
        it('merges existing provider options with call-level options', ()=>{
            expect((0, _provideroptionsutil.getCallLevelProviderOptions)({
                sdkPackage: _aisdkpackageconst.AI_SDK_OPENAI,
                providerOptions: {
                    xai: {
                        searchParameters: {
                            mode: 'auto'
                        }
                    }
                }
            })).toEqual({
                xai: {
                    searchParameters: {
                        mode: 'auto'
                    }
                },
                openai: {
                    store: false
                }
            });
        });
        it('returns store false for OpenAI models', ()=>{
            expect((0, _provideroptionsutil.getCallLevelProviderOptions)({
                sdkPackage: _aisdkpackageconst.AI_SDK_OPENAI
            })).toEqual({
                openai: {
                    store: false
                }
            });
        });
        it('includes promptCacheKey for OpenAI when provided', ()=>{
            expect((0, _provideroptionsutil.getCallLevelProviderOptions)({
                sdkPackage: _aisdkpackageconst.AI_SDK_OPENAI,
                promptCacheKey: 'thread-123'
            })).toEqual({
                openai: {
                    store: false,
                    promptCacheKey: 'thread-123'
                }
            });
        });
        it('returns store false for Azure models', ()=>{
            expect((0, _provideroptionsutil.getCallLevelProviderOptions)({
                sdkPackage: _aisdkpackageconst.AI_SDK_AZURE
            })).toEqual({
                azure: {
                    store: false
                }
            });
        });
        it('merges existing provider options with Azure store false', ()=>{
            expect((0, _provideroptionsutil.getCallLevelProviderOptions)({
                sdkPackage: _aisdkpackageconst.AI_SDK_AZURE,
                providerOptions: {
                    xai: {
                        searchParameters: {
                            mode: 'auto'
                        }
                    }
                }
            })).toEqual({
                xai: {
                    searchParameters: {
                        mode: 'auto'
                    }
                },
                azure: {
                    store: false
                }
            });
        });
        it('omits promptCacheKey for non-OpenAI providers', ()=>{
            expect((0, _provideroptionsutil.getCallLevelProviderOptions)({
                sdkPackage: _aisdkpackageconst.AI_SDK_ANTHROPIC,
                promptCacheKey: 'thread-123'
            })).toEqual({
                anthropic: {
                    cacheControl: {
                        type: 'ephemeral'
                    }
                }
            });
        });
    });
    describe('getCacheProviderOptions', ()=>{
        it('returns cache point provider options for Bedrock models', ()=>{
            expect((0, _provideroptionsutil.getCacheProviderOptions)(_aisdkpackageconst.AI_SDK_BEDROCK)).toEqual({
                bedrock: {
                    cachePoint: {
                        type: 'default'
                    }
                }
            });
        });
    });
    describe('injectCacheBreakpoint', ()=>{
        it('injects cache provider options on the last message only', ()=>{
            expect((0, _provideroptionsutil.injectCacheBreakpoint)([
                {
                    role: 'user',
                    content: 'first'
                },
                {
                    role: 'user',
                    content: 'last',
                    providerOptions: {
                        openai: {
                            store: false
                        }
                    }
                }
            ], _aisdkpackageconst.AI_SDK_BEDROCK)).toEqual([
                {
                    role: 'user',
                    content: 'first'
                },
                {
                    role: 'user',
                    content: 'last',
                    providerOptions: {
                        openai: {
                            store: false
                        },
                        bedrock: {
                            cachePoint: {
                                type: 'default'
                            }
                        }
                    }
                }
            ]);
        });
    });
});

//# sourceMappingURL=provider-options.util.spec.js.map