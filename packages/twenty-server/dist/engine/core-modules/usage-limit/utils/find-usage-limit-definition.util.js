"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "findUsageLimitDefinition", {
    enumerable: true,
    get: function() {
        return findUsageLimitDefinition;
    }
});
const _usagelimitdefinitionsconstant = require("../constants/usage-limit-definitions.constant");
const findUsageLimitDefinition = ({ resourceType, limitKind })=>_usagelimitdefinitionsconstant.USAGE_LIMIT_DEFINITIONS[resourceType]?.[limitKind];

//# sourceMappingURL=find-usage-limit-definition.util.js.map