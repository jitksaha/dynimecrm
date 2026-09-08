"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "ViewChildEntityPermissionGuard", {
    enumerable: true,
    get: function() {
        return ViewChildEntityPermissionGuard;
    }
});
const _common = require("@nestjs/common");
const _graphql = require("@nestjs/graphql");
const _viewaccessservice = require("../services/view-access.service");
const _viewentitylookupservice = require("../services/view-entity-lookup.service");
const _resolveviewchildentityidutil = require("../utils/resolve-view-child-entity-id.util");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
const ViewChildEntityPermissionGuard = (kind)=>{
    let ViewChildEntityPermissionGuardMixin = class ViewChildEntityPermissionGuardMixin {
        async canActivate(context) {
            const gqlContext = _graphql.GqlExecutionContext.create(context);
            const request = gqlContext.getContext().req;
            const args = gqlContext.getArgs();
            const entityId = (0, _resolveviewchildentityidutil.resolveViewChildEntityId)({
                args,
                params: request.params
            });
            const viewId = entityId ? await this.viewEntityLookupService.findViewIdByEntityIdAndKind(kind, entityId, request.workspace.id) : null;
            return this.viewAccessService.canUserModifyViewByChildEntity(viewId, request.userWorkspaceId, request.workspace.id, request.apiKey?.id);
        }
        constructor(viewAccessService, viewEntityLookupService){
            this.viewAccessService = viewAccessService;
            this.viewEntityLookupService = viewEntityLookupService;
        }
    };
    ViewChildEntityPermissionGuardMixin = _ts_decorate([
        (0, _common.Injectable)(),
        _ts_metadata("design:type", Function),
        _ts_metadata("design:paramtypes", [
            typeof _viewaccessservice.ViewAccessService === "undefined" ? Object : _viewaccessservice.ViewAccessService,
            typeof _viewentitylookupservice.ViewEntityLookupService === "undefined" ? Object : _viewentitylookupservice.ViewEntityLookupService
        ])
    ], ViewChildEntityPermissionGuardMixin);
    return ViewChildEntityPermissionGuardMixin;
};

//# sourceMappingURL=view-child-entity-permission.guard.js.map