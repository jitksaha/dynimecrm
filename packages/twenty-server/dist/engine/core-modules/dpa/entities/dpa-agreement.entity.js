"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "DpaAgreementEntity", {
    enumerable: true,
    get: function() {
        return DpaAgreementEntity;
    }
});
const _graphql = require("@nestjs/graphql");
const _typeorm = require("typeorm");
const _scalars = require("../../../api/graphql/workspace-schema-builder/graphql-types/scalars");
const _dpaagreementtypeenum = require("../enums/dpa-agreement-type.enum");
const _dparegionenum = require("../enums/dpa-region.enum");
const _workspaceentity = require("../../workspace/workspace.entity");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
(0, _graphql.registerEnumType)(_dpaagreementtypeenum.DpaAgreementType, {
    name: 'DpaAgreementType'
});
(0, _graphql.registerEnumType)(_dparegionenum.DpaRegion, {
    name: 'DpaRegion'
});
let DpaAgreementEntity = class DpaAgreementEntity {
};
_ts_decorate([
    (0, _graphql.Field)(()=>_scalars.UUIDScalarType),
    (0, _typeorm.PrimaryGeneratedColumn)('uuid'),
    _ts_metadata("design:type", String)
], DpaAgreementEntity.prototype, "id", void 0);
_ts_decorate([
    (0, _graphql.Field)(()=>_dpaagreementtypeenum.DpaAgreementType),
    (0, _typeorm.Column)({
        type: 'enum',
        enum: Object.values(_dpaagreementtypeenum.DpaAgreementType)
    }),
    _ts_metadata("design:type", typeof _dpaagreementtypeenum.DpaAgreementType === "undefined" ? Object : _dpaagreementtypeenum.DpaAgreementType)
], DpaAgreementEntity.prototype, "type", void 0);
_ts_decorate([
    (0, _graphql.Field)(),
    (0, _typeorm.Column)(),
    _ts_metadata("design:type", String)
], DpaAgreementEntity.prototype, "templateVersion", void 0);
_ts_decorate([
    (0, _graphql.Field)(()=>_dparegionenum.DpaRegion),
    (0, _typeorm.Column)({
        type: 'varchar'
    }),
    _ts_metadata("design:type", typeof _dparegionenum.DpaRegion === "undefined" ? Object : _dparegionenum.DpaRegion)
], DpaAgreementEntity.prototype, "region", void 0);
_ts_decorate([
    (0, _graphql.Field)(),
    (0, _typeorm.Column)(),
    _ts_metadata("design:type", String)
], DpaAgreementEntity.prototype, "processorEntity", void 0);
_ts_decorate([
    (0, _graphql.Field)({
        nullable: true
    }),
    (0, _typeorm.Column)({
        nullable: true
    }),
    _ts_metadata("design:type", String)
], DpaAgreementEntity.prototype, "customerLegalEntityName", void 0);
_ts_decorate([
    (0, _graphql.Field)({
        nullable: true
    }),
    (0, _typeorm.Column)({
        nullable: true
    }),
    _ts_metadata("design:type", String)
], DpaAgreementEntity.prototype, "signatoryName", void 0);
_ts_decorate([
    (0, _graphql.Field)({
        nullable: true
    }),
    (0, _typeorm.Column)({
        nullable: true
    }),
    _ts_metadata("design:type", String)
], DpaAgreementEntity.prototype, "signatoryTitle", void 0);
_ts_decorate([
    (0, _graphql.Field)({
        nullable: true
    }),
    (0, _typeorm.Column)({
        type: 'uuid',
        nullable: true
    }),
    _ts_metadata("design:type", String)
], DpaAgreementEntity.prototype, "signedFileId", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        type: 'uuid',
        nullable: true
    }),
    _ts_metadata("design:type", String)
], DpaAgreementEntity.prototype, "acceptedByUserId", void 0);
_ts_decorate([
    (0, _graphql.Field)({
        nullable: true
    }),
    (0, _typeorm.Column)({
        nullable: true
    }),
    _ts_metadata("design:type", String)
], DpaAgreementEntity.prototype, "acceptedByEmail", void 0);
_ts_decorate([
    (0, _graphql.Field)(),
    (0, _typeorm.Column)({
        type: 'timestamptz'
    }),
    _ts_metadata("design:type", typeof Date === "undefined" ? Object : Date)
], DpaAgreementEntity.prototype, "acceptedAt", void 0);
_ts_decorate([
    (0, _graphql.Field)(),
    (0, _typeorm.CreateDateColumn)({
        type: 'timestamptz'
    }),
    _ts_metadata("design:type", typeof Date === "undefined" ? Object : Date)
], DpaAgreementEntity.prototype, "createdAt", void 0);
_ts_decorate([
    (0, _graphql.Field)(),
    (0, _typeorm.UpdateDateColumn)({
        type: 'timestamptz'
    }),
    _ts_metadata("design:type", typeof Date === "undefined" ? Object : Date)
], DpaAgreementEntity.prototype, "updatedAt", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        nullable: false,
        type: 'uuid'
    }),
    _ts_metadata("design:type", String)
], DpaAgreementEntity.prototype, "workspaceId", void 0);
_ts_decorate([
    (0, _typeorm.ManyToOne)(()=>_workspaceentity.WorkspaceEntity, {
        onDelete: 'CASCADE'
    }),
    (0, _typeorm.JoinColumn)({
        name: 'workspaceId'
    }),
    _ts_metadata("design:type", typeof Relation === "undefined" ? Object : Relation)
], DpaAgreementEntity.prototype, "workspace", void 0);
DpaAgreementEntity = _ts_decorate([
    (0, _typeorm.Entity)({
        name: 'dpaAgreement',
        schema: 'core'
    }),
    (0, _typeorm.Index)('IDX_DPA_AGREEMENT_WORKSPACE_ID', [
        'workspaceId'
    ]),
    (0, _graphql.ObjectType)('DpaAgreement')
], DpaAgreementEntity);

//# sourceMappingURL=dpa-agreement.entity.js.map