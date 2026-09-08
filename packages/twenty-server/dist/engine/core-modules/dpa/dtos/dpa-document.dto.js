"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "DpaDocumentDTO", {
    enumerable: true,
    get: function() {
        return DpaDocumentDTO;
    }
});
const _graphql = require("@nestjs/graphql");
const _dpadocumentblockdto = require("./dpa-document-block.dto");
const _dparegionenum = require("../enums/dpa-region.enum");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let DpaDocumentDTO = class DpaDocumentDTO {
};
_ts_decorate([
    (0, _graphql.Field)(),
    _ts_metadata("design:type", String)
], DpaDocumentDTO.prototype, "title", void 0);
_ts_decorate([
    (0, _graphql.Field)(),
    _ts_metadata("design:type", String)
], DpaDocumentDTO.prototype, "lastUpdatedLabel", void 0);
_ts_decorate([
    (0, _graphql.Field)(),
    _ts_metadata("design:type", String)
], DpaDocumentDTO.prototype, "templateVersion", void 0);
_ts_decorate([
    (0, _graphql.Field)(()=>_dparegionenum.DpaRegion),
    _ts_metadata("design:type", typeof _dparegionenum.DpaRegion === "undefined" ? Object : _dparegionenum.DpaRegion)
], DpaDocumentDTO.prototype, "region", void 0);
_ts_decorate([
    (0, _graphql.Field)(),
    _ts_metadata("design:type", String)
], DpaDocumentDTO.prototype, "processorEntity", void 0);
_ts_decorate([
    (0, _graphql.Field)(),
    _ts_metadata("design:type", Boolean)
], DpaDocumentDTO.prototype, "sccSectionActive", void 0);
_ts_decorate([
    (0, _graphql.Field)({
        nullable: true
    }),
    _ts_metadata("design:type", String)
], DpaDocumentDTO.prototype, "notice", void 0);
_ts_decorate([
    (0, _graphql.Field)(()=>[
            _dpadocumentblockdto.DpaDocumentBlockDTO
        ]),
    _ts_metadata("design:type", Array)
], DpaDocumentDTO.prototype, "blocks", void 0);
DpaDocumentDTO = _ts_decorate([
    (0, _graphql.ObjectType)('DpaDocument')
], DpaDocumentDTO);

//# sourceMappingURL=dpa-document.dto.js.map