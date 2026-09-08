"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "DpaDocumentBlockDTO", {
    enumerable: true,
    get: function() {
        return DpaDocumentBlockDTO;
    }
});
const _graphql = require("@nestjs/graphql");
const _dpadocumentblockkindenum = require("../enums/dpa-document-block-kind.enum");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
(0, _graphql.registerEnumType)(_dpadocumentblockkindenum.DpaDocumentBlockKind, {
    name: 'DpaDocumentBlockKind'
});
let DpaDocumentBlockDTO = class DpaDocumentBlockDTO {
};
_ts_decorate([
    (0, _graphql.Field)(()=>_dpadocumentblockkindenum.DpaDocumentBlockKind),
    _ts_metadata("design:type", typeof _dpadocumentblockkindenum.DpaDocumentBlockKind === "undefined" ? Object : _dpadocumentblockkindenum.DpaDocumentBlockKind)
], DpaDocumentBlockDTO.prototype, "kind", void 0);
_ts_decorate([
    (0, _graphql.Field)(),
    _ts_metadata("design:type", String)
], DpaDocumentBlockDTO.prototype, "text", void 0);
_ts_decorate([
    (0, _graphql.Field)({
        nullable: true
    }),
    _ts_metadata("design:type", String)
], DpaDocumentBlockDTO.prototype, "label", void 0);
_ts_decorate([
    (0, _graphql.Field)({
        nullable: true
    }),
    _ts_metadata("design:type", String)
], DpaDocumentBlockDTO.prototype, "value", void 0);
DpaDocumentBlockDTO = _ts_decorate([
    (0, _graphql.ObjectType)('DpaDocumentBlock')
], DpaDocumentBlockDTO);

//# sourceMappingURL=dpa-document-block.dto.js.map