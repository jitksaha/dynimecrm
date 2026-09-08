"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
}
_export(exports, {
    get MetadataTranslationDTO () {
        return MetadataTranslationDTO;
    },
    get MetadataTranslationProvenance () {
        return MetadataTranslationProvenance;
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
var MetadataTranslationProvenance = /*#__PURE__*/ function(MetadataTranslationProvenance) {
    MetadataTranslationProvenance["WORKSPACE"] = "WORKSPACE";
    MetadataTranslationProvenance["SHIPPED"] = "SHIPPED";
    MetadataTranslationProvenance["INHERITED"] = "INHERITED";
    return MetadataTranslationProvenance;
}({});
(0, _graphql.registerEnumType)(MetadataTranslationProvenance, {
    name: 'MetadataTranslationProvenance',
    description: 'Where a resolved metadata label comes from: a workspace-authored translation, a shipped application catalog, or inheritance from the canonical value'
});
let MetadataTranslationDTO = class MetadataTranslationDTO {
};
_ts_decorate([
    (0, _graphql.Field)(),
    _ts_metadata("design:type", String)
], MetadataTranslationDTO.prototype, "metadataName", void 0);
_ts_decorate([
    (0, _graphql.Field)(()=>_scalars.UUIDScalarType),
    _ts_metadata("design:type", String)
], MetadataTranslationDTO.prototype, "recordId", void 0);
_ts_decorate([
    (0, _graphql.Field)(()=>_scalars.UUIDScalarType, {
        nullable: true
    }),
    _ts_metadata("design:type", Object)
], MetadataTranslationDTO.prototype, "objectMetadataId", void 0);
_ts_decorate([
    (0, _graphql.Field)(),
    _ts_metadata("design:type", String)
], MetadataTranslationDTO.prototype, "property", void 0);
_ts_decorate([
    (0, _graphql.Field)(),
    _ts_metadata("design:type", String)
], MetadataTranslationDTO.prototype, "locale", void 0);
_ts_decorate([
    (0, _graphql.Field)(),
    _ts_metadata("design:type", String)
], MetadataTranslationDTO.prototype, "sourceValue", void 0);
_ts_decorate([
    (0, _graphql.Field)(),
    _ts_metadata("design:type", String)
], MetadataTranslationDTO.prototype, "canonicalValue", void 0);
_ts_decorate([
    (0, _graphql.Field)(),
    _ts_metadata("design:type", String)
], MetadataTranslationDTO.prototype, "value", void 0);
_ts_decorate([
    (0, _graphql.Field)(()=>MetadataTranslationProvenance),
    _ts_metadata("design:type", String)
], MetadataTranslationDTO.prototype, "provenance", void 0);
MetadataTranslationDTO = _ts_decorate([
    (0, _graphql.ObjectType)('MetadataTranslation')
], MetadataTranslationDTO);

//# sourceMappingURL=metadata-translation.dto.js.map