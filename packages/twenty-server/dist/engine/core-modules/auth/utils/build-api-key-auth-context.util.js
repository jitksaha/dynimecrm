"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "buildApiKeyAuthContext", {
    enumerable: true,
    get: function() {
        return buildApiKeyAuthContext;
    }
});
const buildApiKeyAuthContext = (input)=>{
    return {
        type: 'apiKey',
        workspace: input.workspace,
        apiKey: input.apiKey
    };
};

//# sourceMappingURL=build-api-key-auth-context.util.js.map