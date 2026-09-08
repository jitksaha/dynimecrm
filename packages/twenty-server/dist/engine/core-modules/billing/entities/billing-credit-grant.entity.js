/* @license Enterprise */ "use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "BillingCreditGrantEntity", {
    enumerable: true,
    get: function() {
        return BillingCreditGrantEntity;
    }
});
const _typeorm = require("typeorm");
const _billingcreditgranttypeenum = require("../enums/billing-credit-grant-type.enum");
const _bigintcolumntransformerutil = require("../utils/bigint-column-transformer.util");
const _workspacerelatedentity = require("../../../workspace-manager/types/workspace-related-entity");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let BillingCreditGrantEntity = class BillingCreditGrantEntity extends _workspacerelatedentity.WorkspaceRelatedEntity {
};
_ts_decorate([
    (0, _typeorm.PrimaryGeneratedColumn)('uuid'),
    _ts_metadata("design:type", String)
], BillingCreditGrantEntity.prototype, "id", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        nullable: false,
        type: 'bigint',
        transformer: _bigintcolumntransformerutil.bigintColumnTransformer
    }),
    _ts_metadata("design:type", Number)
], BillingCreditGrantEntity.prototype, "amountMicro", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        nullable: false,
        type: 'enum',
        enum: Object.values(_billingcreditgranttypeenum.BillingCreditGrantType)
    }),
    _ts_metadata("design:type", typeof _billingcreditgranttypeenum.BillingCreditGrantType === "undefined" ? Object : _billingcreditgranttypeenum.BillingCreditGrantType)
], BillingCreditGrantEntity.prototype, "type", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        nullable: false,
        type: 'timestamptz'
    }),
    _ts_metadata("design:type", typeof Date === "undefined" ? Object : Date)
], BillingCreditGrantEntity.prototype, "effectiveAt", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        nullable: false,
        type: 'timestamptz'
    }),
    _ts_metadata("design:type", typeof Date === "undefined" ? Object : Date)
], BillingCreditGrantEntity.prototype, "expiresAt", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        nullable: true,
        type: 'timestamptz'
    }),
    _ts_metadata("design:type", Object)
], BillingCreditGrantEntity.prototype, "revokedAt", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        nullable: true,
        type: 'uuid'
    }),
    _ts_metadata("design:type", Object)
], BillingCreditGrantEntity.prototype, "revokedByUserId", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        nullable: true,
        type: 'uuid'
    }),
    _ts_metadata("design:type", Object)
], BillingCreditGrantEntity.prototype, "grantedByUserId", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        nullable: true,
        type: 'varchar',
        length: 500
    }),
    _ts_metadata("design:type", Object)
], BillingCreditGrantEntity.prototype, "reason", void 0);
_ts_decorate([
    (0, _typeorm.Index)('IDX_BILLING_CREDIT_GRANT_IDEMPOTENCY_KEY_UNIQUE', {
        unique: true
    }),
    (0, _typeorm.Column)({
        nullable: true,
        type: 'varchar'
    }),
    _ts_metadata("design:type", Object)
], BillingCreditGrantEntity.prototype, "idempotencyKey", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        nullable: true,
        type: 'uuid'
    }),
    _ts_metadata("design:type", Object)
], BillingCreditGrantEntity.prototype, "sourceGrantId", void 0);
_ts_decorate([
    (0, _typeorm.CreateDateColumn)({
        type: 'timestamptz'
    }),
    _ts_metadata("design:type", typeof Date === "undefined" ? Object : Date)
], BillingCreditGrantEntity.prototype, "createdAt", void 0);
_ts_decorate([
    (0, _typeorm.UpdateDateColumn)({
        type: 'timestamptz'
    }),
    _ts_metadata("design:type", typeof Date === "undefined" ? Object : Date)
], BillingCreditGrantEntity.prototype, "updatedAt", void 0);
BillingCreditGrantEntity = _ts_decorate([
    (0, _typeorm.Entity)({
        name: 'billingCreditGrant',
        schema: 'core'
    }),
    (0, _typeorm.Index)('IDX_BILLING_CREDIT_GRANT_WORKSPACE_ID_EXPIRES_AT', [
        'workspaceId',
        'expiresAt'
    ])
], BillingCreditGrantEntity);

//# sourceMappingURL=billing-credit-grant.entity.js.map