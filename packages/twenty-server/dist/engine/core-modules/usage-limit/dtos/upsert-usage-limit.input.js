"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "UpsertUsageLimitInput", {
    enumerable: true,
    get: function() {
        return UpsertUsageLimitInput;
    }
});
const _graphql = require("@nestjs/graphql");
const _graphqlscalars = require("graphql-scalars");
const _classvalidator = require("class-validator");
const _limitkindsconstant = require("../constants/limit-kinds.constant");
const _spendertypesconstant = require("../constants/spender-types.constant");
const _usageoperationtypeenum = require("../../usage/enums/usage-operation-type.enum");
const _usageresourcetypeenum = require("../../usage/enums/usage-resource-type.enum");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let UpsertUsageLimitInput = class UpsertUsageLimitInput {
};
_ts_decorate([
    (0, _graphql.Field)(()=>_usageresourcetypeenum.UsageResourceType),
    (0, _classvalidator.IsEnum)(_usageresourcetypeenum.UsageResourceType),
    _ts_metadata("design:type", typeof _usageresourcetypeenum.UsageResourceType === "undefined" ? Object : _usageresourcetypeenum.UsageResourceType)
], UpsertUsageLimitInput.prototype, "resourceType", void 0);
_ts_decorate([
    (0, _graphql.Field)(()=>_usageoperationtypeenum.UsageOperationType),
    (0, _classvalidator.IsEnum)(_usageoperationtypeenum.UsageOperationType),
    _ts_metadata("design:type", typeof _usageoperationtypeenum.UsageOperationType === "undefined" ? Object : _usageoperationtypeenum.UsageOperationType)
], UpsertUsageLimitInput.prototype, "operationType", void 0);
_ts_decorate([
    (0, _graphql.Field)(()=>String),
    (0, _classvalidator.IsIn)(_spendertypesconstant.SPENDER_TYPES),
    _ts_metadata("design:type", typeof SpenderType === "undefined" ? Object : SpenderType)
], UpsertUsageLimitInput.prototype, "spenderType", void 0);
_ts_decorate([
    (0, _graphql.Field)(()=>String, {
        nullable: true
    }),
    (0, _classvalidator.IsString)(),
    (0, _classvalidator.IsOptional)(),
    _ts_metadata("design:type", Object)
], UpsertUsageLimitInput.prototype, "spenderId", void 0);
_ts_decorate([
    (0, _graphql.Field)(()=>String),
    (0, _classvalidator.IsIn)(_limitkindsconstant.LIMIT_KINDS),
    _ts_metadata("design:type", typeof LimitKind === "undefined" ? Object : LimitKind)
], UpsertUsageLimitInput.prototype, "limitKind", void 0);
_ts_decorate([
    (0, _graphql.Field)(()=>_graphql.Int, {
        defaultValue: 0
    }),
    (0, _classvalidator.IsInt)(),
    (0, _classvalidator.Min)(0),
    _ts_metadata("design:type", Number)
], UpsertUsageLimitInput.prototype, "windowSeconds", void 0);
_ts_decorate([
    (0, _graphql.Field)(()=>_graphqlscalars.GraphQLBigInt),
    (0, _classvalidator.IsInt)(),
    (0, _classvalidator.Min)(1),
    _ts_metadata("design:type", Number)
], UpsertUsageLimitInput.prototype, "limitValue", void 0);
_ts_decorate([
    (0, _graphql.Field)(()=>_graphqlscalars.GraphQLBigInt, {
        nullable: true
    }),
    (0, _classvalidator.IsInt)(),
    (0, _classvalidator.Min)(1),
    (0, _classvalidator.IsOptional)(),
    _ts_metadata("design:type", Object)
], UpsertUsageLimitInput.prototype, "burstValue", void 0);
UpsertUsageLimitInput = _ts_decorate([
    (0, _graphql.InputType)()
], UpsertUsageLimitInput);

//# sourceMappingURL=upsert-usage-limit.input.js.map