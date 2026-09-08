"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "CursorPagingInput", {
    enumerable: true,
    get: function() {
        return CursorPagingInput;
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
let CursorPagingInput = class CursorPagingInput {
};
_ts_decorate([
    (0, _graphql.Field)(()=>_scalars.ConnectionCursorScalarType, {
        nullable: true,
        description: 'Paginate before opaque cursor'
    }),
    _ts_metadata("design:type", String)
], CursorPagingInput.prototype, "before", void 0);
_ts_decorate([
    (0, _graphql.Field)(()=>_scalars.ConnectionCursorScalarType, {
        nullable: true,
        description: 'Paginate after opaque cursor'
    }),
    _ts_metadata("design:type", String)
], CursorPagingInput.prototype, "after", void 0);
_ts_decorate([
    (0, _graphql.Field)(()=>_graphql.Int, {
        nullable: true,
        description: 'Paginate first'
    }),
    _ts_metadata("design:type", Number)
], CursorPagingInput.prototype, "first", void 0);
_ts_decorate([
    (0, _graphql.Field)(()=>_graphql.Int, {
        nullable: true,
        description: 'Paginate last'
    }),
    _ts_metadata("design:type", Number)
], CursorPagingInput.prototype, "last", void 0);
CursorPagingInput = _ts_decorate([
    (0, _graphql.InputType)('CursorPaging')
], CursorPagingInput);

//# sourceMappingURL=cursor-paging.input.js.map