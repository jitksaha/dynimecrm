"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "AppKeyValueScope", {
    enumerable: true,
    get: function() {
        return AppKeyValueScope;
    }
});
const _graphql = require("@nestjs/graphql");
var AppKeyValueScope = /*#__PURE__*/ function(AppKeyValueScope) {
    AppKeyValueScope["WORKSPACE"] = "WORKSPACE";
    AppKeyValueScope["SERVER"] = "SERVER";
    return AppKeyValueScope;
}({});
(0, _graphql.registerEnumType)(AppKeyValueScope, {
    name: 'AppKeyValueScope',
    description: 'WORKSPACE entries are private to one workspace install of the application. SERVER entries are shared across every install: the value is always the claiming workspaceId and only that workspace can overwrite or delete the key.'
});

//# sourceMappingURL=app-key-value-scope.enum.js.map