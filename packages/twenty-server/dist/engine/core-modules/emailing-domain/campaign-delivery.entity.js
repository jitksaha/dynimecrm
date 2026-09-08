"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "CampaignDeliveryEntity", {
    enumerable: true,
    get: function() {
        return CampaignDeliveryEntity;
    }
});
const _typeorm = require("typeorm");
const _workspacerelatedentity = require("../../workspace-manager/types/workspace-related-entity");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let CampaignDeliveryEntity = class CampaignDeliveryEntity extends _workspacerelatedentity.WorkspaceRelatedEntity {
};
_ts_decorate([
    (0, _typeorm.PrimaryColumn)({
        type: 'uuid'
    }),
    _ts_metadata("design:type", String)
], CampaignDeliveryEntity.prototype, "id", void 0);
_ts_decorate([
    (0, _typeorm.CreateDateColumn)({
        type: 'timestamptz'
    }),
    _ts_metadata("design:type", typeof Date === "undefined" ? Object : Date)
], CampaignDeliveryEntity.prototype, "createdAt", void 0);
_ts_decorate([
    (0, _typeorm.UpdateDateColumn)({
        type: 'timestamptz'
    }),
    _ts_metadata("design:type", typeof Date === "undefined" ? Object : Date)
], CampaignDeliveryEntity.prototype, "updatedAt", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        type: 'uuid',
        nullable: false
    }),
    _ts_metadata("design:type", String)
], CampaignDeliveryEntity.prototype, "campaignId", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        type: 'uuid',
        nullable: false
    }),
    _ts_metadata("design:type", String)
], CampaignDeliveryEntity.prototype, "personId", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        type: 'varchar',
        nullable: false
    }),
    _ts_metadata("design:type", String)
], CampaignDeliveryEntity.prototype, "recipientEmail", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        type: 'varchar',
        nullable: false,
        default: 'QUEUED'
    }),
    _ts_metadata("design:type", typeof CampaignDeliveryState === "undefined" ? Object : CampaignDeliveryState)
], CampaignDeliveryEntity.prototype, "state", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        type: 'varchar',
        nullable: true
    }),
    _ts_metadata("design:type", Object)
], CampaignDeliveryEntity.prototype, "skipReason", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        type: 'varchar',
        nullable: true
    }),
    _ts_metadata("design:type", Object)
], CampaignDeliveryEntity.prototype, "failureReason", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        type: 'uuid',
        nullable: true
    }),
    _ts_metadata("design:type", Object)
], CampaignDeliveryEntity.prototype, "claimToken", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        type: 'timestamptz',
        nullable: true
    }),
    _ts_metadata("design:type", Object)
], CampaignDeliveryEntity.prototype, "claimExpiresAt", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        type: 'varchar',
        nullable: true
    }),
    _ts_metadata("design:type", Object)
], CampaignDeliveryEntity.prototype, "providerMessageId", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        type: 'timestamptz',
        nullable: true
    }),
    _ts_metadata("design:type", Object)
], CampaignDeliveryEntity.prototype, "sentAt", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        type: 'timestamptz',
        nullable: true
    }),
    _ts_metadata("design:type", Object)
], CampaignDeliveryEntity.prototype, "deliveredAt", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        type: 'timestamptz',
        nullable: true
    }),
    _ts_metadata("design:type", Object)
], CampaignDeliveryEntity.prototype, "bouncedAt", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        type: 'timestamptz',
        nullable: true
    }),
    _ts_metadata("design:type", Object)
], CampaignDeliveryEntity.prototype, "complainedAt", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        type: 'timestamptz',
        nullable: true
    }),
    _ts_metadata("design:type", Object)
], CampaignDeliveryEntity.prototype, "rejectedAt", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        type: 'timestamptz',
        nullable: true
    }),
    _ts_metadata("design:type", Object)
], CampaignDeliveryEntity.prototype, "renderingFailedAt", void 0);
CampaignDeliveryEntity = _ts_decorate([
    (0, _typeorm.Entity)({
        name: 'campaignDelivery',
        schema: 'core'
    }),
    (0, _typeorm.Check)('CHK_CAMPAIGN_DELIVERY_CLAIM_HAS_LEASE', `"state" <> 'SENDING' OR "claimExpiresAt" IS NOT NULL`),
    (0, _typeorm.Check)('CHK_CAMPAIGN_DELIVERY_CLAIM_IS_WHOLE', `("claimToken" IS NULL) = ("claimExpiresAt" IS NULL)`),
    (0, _typeorm.Index)('IDX_CAMPAIGN_DELIVERY_UNIQUE', [
        'campaignId',
        'personId'
    ], {
        unique: true
    }),
    (0, _typeorm.Index)('IDX_CAMPAIGN_DELIVERY_UNFINISHED', [
        'campaignId'
    ], {
        where: `"state" IN ('QUEUED', 'SENDING')`
    }),
    (0, _typeorm.Index)('IDX_CAMPAIGN_DELIVERY_EXPIRED_CLAIM', [
        'claimExpiresAt'
    ], {
        where: `"state" = 'SENDING'`
    }),
    (0, _typeorm.Index)('IDX_CAMPAIGN_DELIVERY_COUNTS', [
        'workspaceId',
        'campaignId',
        'state'
    ]),
    (0, _typeorm.Index)('IDX_CAMPAIGN_DELIVERY_PROVIDER_MESSAGE_ID', [
        'workspaceId',
        'providerMessageId'
    ], {
        unique: true,
        where: '"providerMessageId" IS NOT NULL'
    })
], CampaignDeliveryEntity);

//# sourceMappingURL=campaign-delivery.entity.js.map