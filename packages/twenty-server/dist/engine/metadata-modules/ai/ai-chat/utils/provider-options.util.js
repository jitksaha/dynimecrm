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
    get getCacheProviderOptions () {
        return getCacheProviderOptions;
    },
    get getCallLevelProviderOptions () {
        return getCallLevelProviderOptions;
    },
    get injectCacheBreakpoint () {
        return injectCacheBreakpoint;
    }
});
const _aisdkpackageconst = require("../../ai-models/constants/ai-sdk-package.const");
const getCacheProviderOptions = (sdkPackage)=>{
    switch(sdkPackage){
        case _aisdkpackageconst.AI_SDK_BEDROCK:
            return {
                bedrock: {
                    cachePoint: {
                        type: 'default'
                    }
                }
            };
        default:
            return undefined;
    }
};
const getCallLevelProviderOptions = ({ sdkPackage, providerOptions, promptCacheKey })=>{
    switch(sdkPackage){
        case _aisdkpackageconst.AI_SDK_ANTHROPIC:
            return {
                ...providerOptions ?? {},
                anthropic: {
                    cacheControl: {
                        type: 'ephemeral'
                    }
                }
            };
        case _aisdkpackageconst.AI_SDK_OPENAI:
            return {
                ...providerOptions ?? {},
                openai: {
                    store: false,
                    ...promptCacheKey ? {
                        promptCacheKey
                    } : {}
                }
            };
        case _aisdkpackageconst.AI_SDK_AZURE:
            return {
                ...providerOptions ?? {},
                azure: {
                    store: false
                }
            };
        default:
            return providerOptions;
    }
};
const injectCacheBreakpoint = (messages, sdkPackage)=>{
    if (messages.length === 0) return messages;
    const cacheOptions = getCacheProviderOptions(sdkPackage);
    if (!cacheOptions) return messages;
    const lastIdx = messages.length - 1;
    return messages.map((message, index)=>{
        if (index !== lastIdx) return message;
        return {
            ...message,
            providerOptions: {
                ...message.providerOptions ?? {},
                ...cacheOptions
            }
        };
    });
};

//# sourceMappingURL=provider-options.util.js.map