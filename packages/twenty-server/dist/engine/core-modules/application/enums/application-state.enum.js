"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "ApplicationState", {
    enumerable: true,
    get: function() {
        return ApplicationState;
    }
});
const _graphql = require("@nestjs/graphql");
var ApplicationState = /*#__PURE__*/ function(ApplicationState) {
    ApplicationState["INSTALLING"] = "INSTALLING";
    ApplicationState["INSTALLED"] = "INSTALLED";
    ApplicationState["UPGRADING"] = "UPGRADING";
    ApplicationState["UNINSTALLING"] = "UNINSTALLING";
    return ApplicationState;
}({});
(0, _graphql.registerEnumType)(ApplicationState, {
    name: 'ApplicationState'
});

//# sourceMappingURL=application-state.enum.js.map