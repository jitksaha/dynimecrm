"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "AdminPanelWorkspaceCreditGrantDTO", {
    enumerable: true,
    get: function() {
        return AdminPanelWorkspaceCreditGrantDTO;
    }
});
const _graphql = require("@nestjs/graphql");
const _scalars = require("../../../api/graphql/workspace-schema-builder/graphql-types/scalars");
const _billingcreditgranttypeenum = require("../../billing/enums/billing-credit-grant-type.enum");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let AdminPanelWorkspaceCreditGrantDTO = class AdminPanelWorkspaceCreditGrantDTO {
};
_ts_decorate([
    (0, _graphql.Field)(()=>_scalars.UUIDScalarType),
    _ts_metadata("design:type", String)
], AdminPanelWorkspaceCreditGrantDTO.prototype, "id", void 0);
_ts_decorate([
    (0, _graphql.Field)(()=>_graphql.Float),
    _ts_metadata("design:type", Number)
], AdminPanelWorkspaceCreditGrantDTO.prototype, "amount", void 0);
_ts_decorate([
    (0, _graphql.Field)(()=>_billingcreditgranttypeenum.BillingCreditGrantType),
    _ts_metadata("design:type", typeof _billingcreditgranttypeenum.BillingCreditGrantType === "undefined" ? Object : _billingcreditgranttypeenum.BillingCreditGrantType)
], AdminPanelWorkspaceCreditGrantDTO.prototype, "type", void 0);
_ts_decorate([
    (0, _graphql.Field)(()=>Date),
    _ts_metadata("design:type", typeof Date === "undefined" ? Object : Date)
], AdminPanelWorkspaceCreditGrantDTO.prototype, "effectiveAt", void 0);
_ts_decorate([
    (0, _graphql.Field)(()=>Date),
    _ts_metadata("design:type", typeof Date === "undefined" ? Object : Date)
], AdminPanelWorkspaceCreditGrantDTO.prototype, "expiresAt", void 0);
_ts_decorate([
    (0, _graphql.Field)(()=>Date, {
        nullable: true
    }),
    _ts_metadata("design:type", Object)
], AdminPanelWorkspaceCreditGrantDTO.prototype, "revokedAt", void 0);
_ts_decorate([
    (0, _graphql.Field)(()=>String, {
        nullable: true
    }),
    _ts_metadata("design:type", Object)
], AdminPanelWorkspaceCreditGrantDTO.prototype, "reason", void 0);
_ts_decorate([
    (0, _graphql.Field)(()=>Boolean),
    _ts_metadata("design:type", Boolean)
], AdminPanelWorkspaceCreditGrantDTO.prototype, "isActive", void 0);
_ts_decorate([
    (0, _graphql.Field)(()=>Date),
    _ts_metadata("design:type", typeof Date === "undefined" ? Object : Date)
], AdminPanelWorkspaceCreditGrantDTO.prototype, "createdAt", void 0);
AdminPanelWorkspaceCreditGrantDTO = _ts_decorate([
    (0, _graphql.ObjectType)('AdminPanelWorkspaceCreditGrant')
], AdminPanelWorkspaceCreditGrantDTO);

//# sourceMappingURL=admin-panel-workspace-credit-grant.dto.js.map