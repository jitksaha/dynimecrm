"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "UUIDFilterComparisonInput", {
    enumerable: true,
    get: function() {
        return UUIDFilterComparisonInput;
    }
});
const _graphql = require("@nestjs/graphql");
const _scalars = require("../../../api/graphql/workspace-schema-builder/graphql-types/scalars");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let UUIDFilterComparisonInput = class UUIDFilterComparisonInput {
};
_ts_decorate([
    (0, _graphql.Field)(()=>Boolean, {
        nullable: true
    }),
    _ts_metadata("design:type", Object)
], UUIDFilterComparisonInput.prototype, "is", void 0);
_ts_decorate([
    (0, _graphql.Field)(()=>Boolean, {
        nullable: true
    }),
    _ts_metadata("design:type", Object)
], UUIDFilterComparisonInput.prototype, "isNot", void 0);
_ts_decorate([
    (0, _graphql.Field)(()=>_scalars.UUIDScalarType, {
        nullable: true
    }),
    _ts_metadata("design:type", String)
], UUIDFilterComparisonInput.prototype, "eq", void 0);
_ts_decorate([
    (0, _graphql.Field)(()=>_scalars.UUIDScalarType, {
        nullable: true
    }),
    _ts_metadata("design:type", String)
], UUIDFilterComparisonInput.prototype, "neq", void 0);
_ts_decorate([
    (0, _graphql.Field)(()=>_scalars.UUIDScalarType, {
        nullable: true
    }),
    _ts_metadata("design:type", String)
], UUIDFilterComparisonInput.prototype, "gt", void 0);
_ts_decorate([
    (0, _graphql.Field)(()=>_scalars.UUIDScalarType, {
        nullable: true
    }),
    _ts_metadata("design:type", String)
], UUIDFilterComparisonInput.prototype, "gte", void 0);
_ts_decorate([
    (0, _graphql.Field)(()=>_scalars.UUIDScalarType, {
        nullable: true
    }),
    _ts_metadata("design:type", String)
], UUIDFilterComparisonInput.prototype, "lt", void 0);
_ts_decorate([
    (0, _graphql.Field)(()=>_scalars.UUIDScalarType, {
        nullable: true
    }),
    _ts_metadata("design:type", String)
], UUIDFilterComparisonInput.prototype, "lte", void 0);
_ts_decorate([
    (0, _graphql.Field)(()=>_scalars.UUIDScalarType, {
        nullable: true
    }),
    _ts_metadata("design:type", String)
], UUIDFilterComparisonInput.prototype, "like", void 0);
_ts_decorate([
    (0, _graphql.Field)(()=>_scalars.UUIDScalarType, {
        nullable: true
    }),
    _ts_metadata("design:type", String)
], UUIDFilterComparisonInput.prototype, "notLike", void 0);
_ts_decorate([
    (0, _graphql.Field)(()=>_scalars.UUIDScalarType, {
        nullable: true
    }),
    _ts_metadata("design:type", String)
], UUIDFilterComparisonInput.prototype, "iLike", void 0);
_ts_decorate([
    (0, _graphql.Field)(()=>_scalars.UUIDScalarType, {
        nullable: true
    }),
    _ts_metadata("design:type", String)
], UUIDFilterComparisonInput.prototype, "notILike", void 0);
_ts_decorate([
    (0, _graphql.Field)(()=>[
            _scalars.UUIDScalarType
        ], {
        nullable: true
    }),
    _ts_metadata("design:type", Array)
], UUIDFilterComparisonInput.prototype, "in", void 0);
_ts_decorate([
    (0, _graphql.Field)(()=>[
            _scalars.UUIDScalarType
        ], {
        nullable: true
    }),
    _ts_metadata("design:type", Array)
], UUIDFilterComparisonInput.prototype, "notIn", void 0);
UUIDFilterComparisonInput = _ts_decorate([
    (0, _graphql.InputType)('UUIDFilterComparison')
], UUIDFilterComparisonInput);

//# sourceMappingURL=uuid-filter-comparison.input.js.map