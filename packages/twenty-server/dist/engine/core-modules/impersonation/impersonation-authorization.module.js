"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "ImpersonationAuthorizationModule", {
    enumerable: true,
    get: function() {
        return ImpersonationAuthorizationModule;
    }
});
const _common = require("@nestjs/common");
const _impersonationauthorizationservice = require("./services/impersonation-authorization.service");
const _permissionsmodule = require("../../metadata-modules/permissions/permissions.module");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let ImpersonationAuthorizationModule = class ImpersonationAuthorizationModule {
};
ImpersonationAuthorizationModule = _ts_decorate([
    (0, _common.Module)({
        imports: [
            _permissionsmodule.PermissionsModule
        ],
        providers: [
            _impersonationauthorizationservice.ImpersonationAuthorizationService
        ],
        exports: [
            _impersonationauthorizationservice.ImpersonationAuthorizationService
        ]
    })
], ImpersonationAuthorizationModule);

//# sourceMappingURL=impersonation-authorization.module.js.map