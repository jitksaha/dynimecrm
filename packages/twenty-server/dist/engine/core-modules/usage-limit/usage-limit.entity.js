"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "UsageLimitEntity", {
    enumerable: true,
    get: function() {
        return UsageLimitEntity;
    }
});
const _graphql = require("@nestjs/graphql");
const _graphqlscalars = require("graphql-scalars");
const _typeorm = require("typeorm");
const _scalars = require("../../api/graphql/workspace-schema-builder/graphql-types/scalars");
const _nullablebigintcolumntransformerutil = require("./utils/nullable-bigint-column-transformer.util");
const _usageoperationtypeenum = require("../usage/enums/usage-operation-type.enum");
const _usageresourcetypeenum = require("../usage/enums/usage-resource-type.enum");
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
let UsageLimitEntity = class UsageLimitEntity extends _workspacerelatedentity.WorkspaceRelatedEntity {
};
_ts_decorate([
    (0, _graphql.Field)(()=>_scalars.UUIDScalarType),
    (0, _typeorm.PrimaryGeneratedColumn)('uuid'),
    _ts_metadata("design:type", String)
], UsageLimitEntity.prototype, "id", void 0);
_ts_decorate([
    (0, _graphql.Field)(()=>_usageresourcetypeenum.UsageResourceType),
    (0, _typeorm.Column)({
        type: 'varchar'
    }),
    _ts_metadata("design:type", typeof _usageresourcetypeenum.UsageResourceType === "undefined" ? Object : _usageresourcetypeenum.UsageResourceType)
], UsageLimitEntity.prototype, "resourceType", void 0);
_ts_decorate([
    (0, _graphql.Field)(()=>_usageoperationtypeenum.UsageOperationType),
    (0, _typeorm.Column)({
        type: 'varchar'
    }),
    _ts_metadata("design:type", typeof _usageoperationtypeenum.UsageOperationType === "undefined" ? Object : _usageoperationtypeenum.UsageOperationType)
], UsageLimitEntity.prototype, "operationType", void 0);
_ts_decorate([
    (0, _graphql.Field)(()=>String),
    (0, _typeorm.Column)({
        type: 'varchar'
    }),
    _ts_metadata("design:type", typeof SpenderType === "undefined" ? Object : SpenderType)
], UsageLimitEntity.prototype, "spenderType", void 0);
_ts_decorate([
    (0, _graphql.Field)(()=>String),
    (0, _typeorm.Column)({
        type: 'varchar',
        default: ''
    }),
    _ts_metadata("design:type", String)
], UsageLimitEntity.prototype, "spenderId", void 0);
_ts_decorate([
    (0, _graphql.Field)(()=>String),
    (0, _typeorm.Column)({
        type: 'varchar'
    }),
    _ts_metadata("design:type", typeof LimitKind === "undefined" ? Object : LimitKind)
], UsageLimitEntity.prototype, "limitKind", void 0);
_ts_decorate([
    (0, _graphql.Field)(()=>_graphql.Int),
    (0, _typeorm.Column)({
        type: 'int',
        default: 0
    }),
    _ts_metadata("design:type", Number)
], UsageLimitEntity.prototype, "windowSeconds", void 0);
_ts_decorate([
    (0, _graphql.Field)(()=>String),
    (0, _typeorm.Column)({
        type: 'varchar',
        default: 'absolute'
    }),
    _ts_metadata("design:type", typeof LimitValueType === "undefined" ? Object : LimitValueType)
], UsageLimitEntity.prototype, "limitValueType", void 0);
_ts_decorate([
    (0, _graphql.Field)(()=>_graphqlscalars.GraphQLBigInt),
    (0, _typeorm.Column)({
        type: 'bigint',
        transformer: _nullablebigintcolumntransformerutil.nullableBigintColumnTransformer
    }),
    _ts_metadata("design:type", Number)
], UsageLimitEntity.prototype, "limitValue", void 0);
_ts_decorate([
    (0, _graphql.Field)(()=>_graphqlscalars.GraphQLBigInt, {
        nullable: true
    }),
    (0, _typeorm.Column)({
        type: 'bigint',
        nullable: true,
        transformer: _nullablebigintcolumntransformerutil.nullableBigintColumnTransformer
    }),
    _ts_metadata("design:type", Object)
], UsageLimitEntity.prototype, "burstValue", void 0);
_ts_decorate([
    (0, _graphql.Field)(()=>Date),
    (0, _typeorm.CreateDateColumn)({
        type: 'timestamptz'
    }),
    _ts_metadata("design:type", typeof Date === "undefined" ? Object : Date)
], UsageLimitEntity.prototype, "createdAt", void 0);
_ts_decorate([
    (0, _graphql.Field)(()=>Date),
    (0, _typeorm.UpdateDateColumn)({
        type: 'timestamptz'
    }),
    _ts_metadata("design:type", typeof Date === "undefined" ? Object : Date)
], UsageLimitEntity.prototype, "updatedAt", void 0);
UsageLimitEntity = _ts_decorate([
    (0, _typeorm.Unique)('UQ_USAGE_LIMIT_SCOPE', [
        'workspaceId',
        'resourceType',
        'operationType',
        'spenderType',
        'spenderId',
        'limitKind',
        'windowSeconds'
    ]),
    (0, _typeorm.Entity)({
        name: 'usageLimit',
        schema: 'core'
    }),
    (0, _graphql.ObjectType)('UsageLimit')
], UsageLimitEntity);

//# sourceMappingURL=usage-limit.entity.js.map