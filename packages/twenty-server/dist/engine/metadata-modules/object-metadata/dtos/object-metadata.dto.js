"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "ObjectMetadataDTO", {
    enumerable: true,
    get: function() {
        return ObjectMetadataDTO;
    }
});
const _graphql = require("@nestjs/graphql");
const _types = require("twenty-shared/types");
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
(0, _graphql.registerEnumType)(_types.ObjectOpenRecordIn, {
    name: 'ObjectOpenRecordIn'
});
let ObjectMetadataDTO = class ObjectMetadataDTO {
};
_ts_decorate([
    (0, _graphql.Field)(()=>_scalars.UUIDScalarType),
    _ts_metadata("design:type", String)
], ObjectMetadataDTO.prototype, "id", void 0);
_ts_decorate([
    (0, _graphql.Field)(),
    _ts_metadata("design:type", String)
], ObjectMetadataDTO.prototype, "universalIdentifier", void 0);
_ts_decorate([
    (0, _graphql.Field)(),
    _ts_metadata("design:type", String)
], ObjectMetadataDTO.prototype, "nameSingular", void 0);
_ts_decorate([
    (0, _graphql.Field)(),
    _ts_metadata("design:type", String)
], ObjectMetadataDTO.prototype, "namePlural", void 0);
_ts_decorate([
    (0, _graphql.Field)(),
    _ts_metadata("design:type", String)
], ObjectMetadataDTO.prototype, "labelSingular", void 0);
_ts_decorate([
    (0, _graphql.Field)(),
    _ts_metadata("design:type", String)
], ObjectMetadataDTO.prototype, "labelPlural", void 0);
_ts_decorate([
    (0, _graphql.Field)({
        nullable: true
    }),
    _ts_metadata("design:type", String)
], ObjectMetadataDTO.prototype, "description", void 0);
_ts_decorate([
    (0, _graphql.Field)({
        nullable: true
    }),
    _ts_metadata("design:type", String)
], ObjectMetadataDTO.prototype, "icon", void 0);
_ts_decorate([
    (0, _graphql.HideField)(),
    _ts_metadata("design:type", Object)
], ObjectMetadataDTO.prototype, "overrides", void 0);
_ts_decorate([
    (0, _graphql.Field)({
        nullable: true
    }),
    _ts_metadata("design:type", String)
], ObjectMetadataDTO.prototype, "shortcut", void 0);
_ts_decorate([
    (0, _graphql.Field)({
        nullable: true
    }),
    _ts_metadata("design:type", String)
], ObjectMetadataDTO.prototype, "color", void 0);
_ts_decorate([
    (0, _graphql.Field)(),
    _ts_metadata("design:type", Boolean)
], ObjectMetadataDTO.prototype, "isRemote", void 0);
_ts_decorate([
    (0, _graphql.Field)(),
    _ts_metadata("design:type", Boolean)
], ObjectMetadataDTO.prototype, "isActive", void 0);
_ts_decorate([
    (0, _graphql.Field)(),
    _ts_metadata("design:type", Boolean)
], ObjectMetadataDTO.prototype, "isSystem", void 0);
_ts_decorate([
    (0, _graphql.Field)(),
    _ts_metadata("design:type", Boolean)
], ObjectMetadataDTO.prototype, "isUIEditable", void 0);
_ts_decorate([
    (0, _graphql.Field)(),
    _ts_metadata("design:type", Boolean)
], ObjectMetadataDTO.prototype, "isUICreatable", void 0);
_ts_decorate([
    (0, _graphql.Field)({
        deprecationReason: 'Use isUIEditable'
    }),
    _ts_metadata("design:type", Boolean)
], ObjectMetadataDTO.prototype, "isUIReadOnly", void 0);
_ts_decorate([
    (0, _graphql.Field)(),
    _ts_metadata("design:type", Boolean)
], ObjectMetadataDTO.prototype, "isSearchable", void 0);
_ts_decorate([
    (0, _graphql.Field)(()=>_types.ObjectOpenRecordIn),
    _ts_metadata("design:type", typeof _types.ObjectOpenRecordIn === "undefined" ? Object : _types.ObjectOpenRecordIn)
], ObjectMetadataDTO.prototype, "openRecordIn", void 0);
_ts_decorate([
    (0, _graphql.HideField)(),
    _ts_metadata("design:type", String)
], ObjectMetadataDTO.prototype, "workspaceId", void 0);
_ts_decorate([
    (0, _graphql.Field)(()=>_scalars.UUIDScalarType),
    _ts_metadata("design:type", String)
], ObjectMetadataDTO.prototype, "applicationId", void 0);
_ts_decorate([
    (0, _graphql.Field)(),
    _ts_metadata("design:type", typeof Date === "undefined" ? Object : Date)
], ObjectMetadataDTO.prototype, "createdAt", void 0);
_ts_decorate([
    (0, _graphql.Field)(),
    _ts_metadata("design:type", typeof Date === "undefined" ? Object : Date)
], ObjectMetadataDTO.prototype, "updatedAt", void 0);
_ts_decorate([
    (0, _graphql.Field)(()=>_scalars.UUIDScalarType, {
        nullable: true
    }),
    _ts_metadata("design:type", Object)
], ObjectMetadataDTO.prototype, "labelIdentifierFieldMetadataId", void 0);
_ts_decorate([
    (0, _graphql.Field)(()=>_scalars.UUIDScalarType, {
        nullable: true
    }),
    _ts_metadata("design:type", Object)
], ObjectMetadataDTO.prototype, "imageIdentifierFieldMetadataId", void 0);
_ts_decorate([
    (0, _graphql.Field)(),
    _ts_metadata("design:type", Boolean)
], ObjectMetadataDTO.prototype, "isLabelSyncedWithName", void 0);
_ts_decorate([
    (0, _graphql.Field)(()=>[
            [
                String
            ]
        ], {
        nullable: true
    }),
    _ts_metadata("design:type", Array)
], ObjectMetadataDTO.prototype, "duplicateCriteria", void 0);
ObjectMetadataDTO = _ts_decorate([
    (0, _graphql.ObjectType)('Object')
], ObjectMetadataDTO);

//# sourceMappingURL=object-metadata.dto.js.map