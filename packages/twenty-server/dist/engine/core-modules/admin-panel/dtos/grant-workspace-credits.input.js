"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "GrantWorkspaceCreditsInput", {
    enumerable: true,
    get: function() {
        return GrantWorkspaceCreditsInput;
    }
});
const _graphql = require("@nestjs/graphql");
const _classvalidator = require("class-validator");
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
let GrantWorkspaceCreditsInput = class GrantWorkspaceCreditsInput {
};
_ts_decorate([
    (0, _graphql.Field)(()=>_scalars.UUIDScalarType),
    (0, _classvalidator.IsNotEmpty)(),
    (0, _classvalidator.IsUUID)(),
    _ts_metadata("design:type", String)
], GrantWorkspaceCreditsInput.prototype, "workspaceId", void 0);
_ts_decorate([
    (0, _graphql.Field)(()=>_graphql.Float),
    (0, _classvalidator.IsPositive)(),
    _ts_metadata("design:type", Number)
], GrantWorkspaceCreditsInput.prototype, "amount", void 0);
_ts_decorate([
    (0, _graphql.Field)(()=>_billingcreditgranttypeenum.BillingCreditGrantType),
    (0, _classvalidator.IsEnum)(_billingcreditgranttypeenum.BillingCreditGrantType),
    _ts_metadata("design:type", typeof _billingcreditgranttypeenum.BillingCreditGrantType === "undefined" ? Object : _billingcreditgranttypeenum.BillingCreditGrantType)
], GrantWorkspaceCreditsInput.prototype, "type", void 0);
_ts_decorate([
    (0, _graphql.Field)(()=>String, {
        nullable: true
    }),
    (0, _classvalidator.IsOptional)(),
    (0, _classvalidator.IsString)(),
    (0, _classvalidator.MaxLength)(500),
    _ts_metadata("design:type", String)
], GrantWorkspaceCreditsInput.prototype, "reason", void 0);
_ts_decorate([
    (0, _graphql.Field)(()=>_scalars.UUIDScalarType),
    (0, _classvalidator.IsNotEmpty)(),
    (0, _classvalidator.IsUUID)(),
    _ts_metadata("design:type", String)
], GrantWorkspaceCreditsInput.prototype, "clientOperationId", void 0);
GrantWorkspaceCreditsInput = _ts_decorate([
    (0, _graphql.ArgsType)()
], GrantWorkspaceCreditsInput);

//# sourceMappingURL=grant-workspace-credits.input.js.map