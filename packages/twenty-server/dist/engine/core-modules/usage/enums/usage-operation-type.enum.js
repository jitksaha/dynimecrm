/* @license Enterprise */ "use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "UsageOperationType", {
    enumerable: true,
    get: function() {
        return UsageOperationType;
    }
});
const _graphql = require("@nestjs/graphql");
var UsageOperationType = /*#__PURE__*/ function(UsageOperationType) {
    UsageOperationType["AI_CHAT_TOKEN"] = "AI_CHAT_TOKEN";
    UsageOperationType["AI_WORKFLOW_TOKEN"] = "AI_WORKFLOW_TOKEN";
    UsageOperationType["WORKFLOW_EXECUTION"] = "WORKFLOW_EXECUTION";
    UsageOperationType["CODE_EXECUTION"] = "CODE_EXECUTION";
    UsageOperationType["WEB_SEARCH"] = "WEB_SEARCH";
    UsageOperationType["CALL_RECORDING"] = "CALL_RECORDING";
    UsageOperationType["EMAIL_SEND"] = "EMAIL_SEND";
    UsageOperationType["API_REQUEST"] = "API_REQUEST";
    return UsageOperationType;
}({});
(0, _graphql.registerEnumType)(UsageOperationType, {
    name: 'UsageOperationType'
});

//# sourceMappingURL=usage-operation-type.enum.js.map