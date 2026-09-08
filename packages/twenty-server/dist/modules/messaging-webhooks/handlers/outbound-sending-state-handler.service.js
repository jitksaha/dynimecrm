"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "OutboundSendingStateHandlerService", {
    enumerable: true,
    get: function() {
        return OutboundSendingStateHandlerService;
    }
});
const _common = require("@nestjs/common");
const _emailingdomaintenantstatusservice = require("../../../engine/core-modules/emailing-domain/services/emailing-domain-tenant-status.service");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let OutboundSendingStateHandlerService = class OutboundSendingStateHandlerService {
    async handle(event) {
        await this.emailingDomainTenantStatusService.setTenantStatusForWorkspace(event.workspaceId, event.status);
    }
    constructor(emailingDomainTenantStatusService){
        this.emailingDomainTenantStatusService = emailingDomainTenantStatusService;
    }
};
OutboundSendingStateHandlerService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _emailingdomaintenantstatusservice.EmailingDomainTenantStatusService === "undefined" ? Object : _emailingdomaintenantstatusservice.EmailingDomainTenantStatusService
    ])
], OutboundSendingStateHandlerService);

//# sourceMappingURL=outbound-sending-state-handler.service.js.map