"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "NATIVE_MODEL_TOOLS_BY_SDK_PACKAGE", {
    enumerable: true,
    get: function() {
        return NATIVE_MODEL_TOOLS_BY_SDK_PACKAGE;
    }
});
const _aisdkpackageconst = require("./ai-sdk-package.const");
const NATIVE_MODEL_TOOLS_BY_SDK_PACKAGE = {
    [_aisdkpackageconst.AI_SDK_ANTHROPIC]: {
        webSearch: {
            kind: 'sdk-tool',
            directToolName: 'web_search'
        }
    },
    [_aisdkpackageconst.AI_SDK_OPENAI]: {
        webSearch: {
            kind: 'sdk-tool',
            directToolName: 'web_search'
        }
    },
    [_aisdkpackageconst.AI_SDK_XAI]: {
        webSearch: {
            kind: 'sdk-tool',
            directToolName: 'web_search'
        },
        twitterSearch: {
            kind: 'sdk-tool',
            directToolName: 'x_search'
        }
    },
    [_aisdkpackageconst.AI_SDK_GOOGLE]: {},
    [_aisdkpackageconst.AI_SDK_MISTRAL]: {},
    [_aisdkpackageconst.AI_SDK_BEDROCK]: {},
    [_aisdkpackageconst.AI_SDK_OPENAI_COMPATIBLE]: {},
    [_aisdkpackageconst.AI_SDK_AZURE]: {}
};

//# sourceMappingURL=native-model-tools-by-sdk-package.const.js.map