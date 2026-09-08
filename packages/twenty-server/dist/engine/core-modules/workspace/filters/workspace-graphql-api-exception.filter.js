"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "WorkspaceGraphqlApiExceptionFilter", {
    enumerable: true,
    get: function() {
        return WorkspaceGraphqlApiExceptionFilter;
    }
});
const _common = require("@nestjs/common");
const _workspacegraphqlapiexceptionhandlerutil = require("../utils/workspace-graphql-api-exception-handler.util");
const _workspaceexception = require("../workspace.exception");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let WorkspaceGraphqlApiExceptionFilter = class WorkspaceGraphqlApiExceptionFilter {
    catch(exception) {
        return (0, _workspacegraphqlapiexceptionhandlerutil.workspaceGraphqlApiExceptionHandler)(exception);
    }
};
WorkspaceGraphqlApiExceptionFilter = _ts_decorate([
    (0, _common.Catch)(_workspaceexception.WorkspaceException)
], WorkspaceGraphqlApiExceptionFilter);

//# sourceMappingURL=workspace-graphql-api-exception.filter.js.map