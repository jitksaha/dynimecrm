"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "CreateViewChildEntityPermissionGuard", {
    enumerable: true,
    get: function() {
        return CreateViewChildEntityPermissionGuard;
    }
});
const _common = require("@nestjs/common");
const _graphql = require("@nestjs/graphql");
const _viewaccessservice = require("../services/view-access.service");
const _resolveviewchildentityviewidutil = require("../utils/resolve-view-child-entity-view-id.util");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let CreateViewChildEntityPermissionGuard = class CreateViewChildEntityPermissionGuard {
    async canActivate(context) {
        const gqlContext = _graphql.GqlExecutionContext.create(context);
        const request = gqlContext.getContext().req;
        const args = gqlContext.getArgs();
        const viewId = (0, _resolveviewchildentityviewidutil.resolveViewChildEntityViewId)({
            args,
            body: request.body
        });
        return this.viewAccessService.canUserModifyViewByChildEntity(viewId, request.userWorkspaceId, request.workspace.id, request.apiKey?.id);
    }
    constructor(viewAccessService){
        this.viewAccessService = viewAccessService;
    }
};
CreateViewChildEntityPermissionGuard = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _viewaccessservice.ViewAccessService === "undefined" ? Object : _viewaccessservice.ViewAccessService
    ])
], CreateViewChildEntityPermissionGuard);

//# sourceMappingURL=create-view-child-entity-permission.guard.js.map