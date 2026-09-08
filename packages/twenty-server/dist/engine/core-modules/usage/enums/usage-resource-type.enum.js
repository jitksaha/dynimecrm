/* @license Enterprise */ "use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "UsageResourceType", {
    enumerable: true,
    get: function() {
        return UsageResourceType;
    }
});
const _graphql = require("@nestjs/graphql");
var UsageResourceType = /*#__PURE__*/ function(UsageResourceType) {
    UsageResourceType["AI"] = "AI";
    UsageResourceType["WORKFLOW"] = "WORKFLOW";
    UsageResourceType["APP"] = "APP";
    UsageResourceType["STORAGE"] = "STORAGE";
    UsageResourceType["API"] = "API";
    UsageResourceType["LOGIC_FUNCTION"] = "LOGIC_FUNCTION";
    UsageResourceType["EMAIL"] = "EMAIL";
    return UsageResourceType;
}({});
(0, _graphql.registerEnumType)(UsageResourceType, {
    name: 'UsageResourceType'
});

//# sourceMappingURL=usage-resource-type.enum.js.map