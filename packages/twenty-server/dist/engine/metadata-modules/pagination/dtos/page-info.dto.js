"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "PageInfoDTO", {
    enumerable: true,
    get: function() {
        return PageInfoDTO;
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
let PageInfoDTO = class PageInfoDTO {
};
_ts_decorate([
    (0, _graphql.Field)(()=>Boolean, {
        nullable: true,
        description: 'true if paging forward and there are more records.'
    }),
    _ts_metadata("design:type", Boolean)
], PageInfoDTO.prototype, "hasNextPage", void 0);
_ts_decorate([
    (0, _graphql.Field)(()=>Boolean, {
        nullable: true,
        description: 'true if paging backwards and there are more records.'
    }),
    _ts_metadata("design:type", Boolean)
], PageInfoDTO.prototype, "hasPreviousPage", void 0);
_ts_decorate([
    (0, _graphql.Field)(()=>_scalars.ConnectionCursorScalarType, {
        nullable: true,
        description: 'The cursor of the first returned record.'
    }),
    _ts_metadata("design:type", Object)
], PageInfoDTO.prototype, "startCursor", void 0);
_ts_decorate([
    (0, _graphql.Field)(()=>_scalars.ConnectionCursorScalarType, {
        nullable: true,
        description: 'The cursor of the last returned record.'
    }),
    _ts_metadata("design:type", Object)
], PageInfoDTO.prototype, "endCursor", void 0);
PageInfoDTO = _ts_decorate([
    (0, _graphql.ObjectType)('PageInfo')
], PageInfoDTO);

//# sourceMappingURL=page-info.dto.js.map