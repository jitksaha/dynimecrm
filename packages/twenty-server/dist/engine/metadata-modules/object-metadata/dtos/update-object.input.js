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
    get UpdateObjectPayload () {
        return UpdateObjectPayload;
    },
    get UpdateOneObjectInput () {
        return UpdateOneObjectInput;
    }
});
const _graphql = require("@nestjs/graphql");
const _classtransformer = require("class-transformer");
const _types = require("twenty-shared/types");
const _classvalidator = require("class-validator");
const _scalars = require("../../../api/graphql/workspace-schema-builder/graphql-types/scalars");
const _isvalidmetadatanamedecorator = require("../../../decorators/metadata/is-valid-metadata-name.decorator");
const _metadatatranslationoverrideinput = require("../../metadata-translation/dtos/metadata-translation-override.input");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let UpdateObjectPayload = class UpdateObjectPayload {
};
_ts_decorate([
    (0, _classvalidator.IsString)(),
    (0, _classvalidator.IsOptional)(),
    (0, _graphql.Field)({
        nullable: true
    }),
    _ts_metadata("design:type", String)
], UpdateObjectPayload.prototype, "labelSingular", void 0);
_ts_decorate([
    (0, _classvalidator.IsString)(),
    (0, _classvalidator.IsOptional)(),
    (0, _graphql.Field)({
        nullable: true
    }),
    _ts_metadata("design:type", String)
], UpdateObjectPayload.prototype, "labelPlural", void 0);
_ts_decorate([
    (0, _classvalidator.IsString)(),
    (0, _classvalidator.IsOptional)(),
    (0, _graphql.Field)({
        nullable: true
    }),
    (0, _isvalidmetadatanamedecorator.IsValidMetadataName)(),
    _ts_metadata("design:type", String)
], UpdateObjectPayload.prototype, "nameSingular", void 0);
_ts_decorate([
    (0, _classvalidator.IsString)(),
    (0, _classvalidator.IsOptional)(),
    (0, _graphql.Field)({
        nullable: true
    }),
    (0, _isvalidmetadatanamedecorator.IsValidMetadataName)(),
    _ts_metadata("design:type", String)
], UpdateObjectPayload.prototype, "namePlural", void 0);
_ts_decorate([
    (0, _classvalidator.IsString)(),
    (0, _classvalidator.IsOptional)(),
    (0, _graphql.Field)({
        nullable: true
    }),
    _ts_metadata("design:type", String)
], UpdateObjectPayload.prototype, "description", void 0);
_ts_decorate([
    (0, _classvalidator.IsString)(),
    (0, _classvalidator.IsOptional)(),
    (0, _graphql.Field)({
        nullable: true
    }),
    _ts_metadata("design:type", String)
], UpdateObjectPayload.prototype, "icon", void 0);
_ts_decorate([
    (0, _classvalidator.IsString)(),
    (0, _classvalidator.IsOptional)(),
    (0, _graphql.Field)({
        nullable: true
    }),
    _ts_metadata("design:type", String)
], UpdateObjectPayload.prototype, "shortcut", void 0);
_ts_decorate([
    (0, _classvalidator.IsString)(),
    (0, _classvalidator.IsOptional)(),
    (0, _graphql.Field)({
        nullable: true
    }),
    _ts_metadata("design:type", String)
], UpdateObjectPayload.prototype, "color", void 0);
_ts_decorate([
    (0, _classvalidator.IsBoolean)(),
    (0, _classvalidator.IsOptional)(),
    (0, _graphql.Field)({
        nullable: true
    }),
    _ts_metadata("design:type", Boolean)
], UpdateObjectPayload.prototype, "isActive", void 0);
_ts_decorate([
    (0, _classvalidator.IsUUID)(),
    (0, _classvalidator.IsOptional)(),
    (0, _graphql.Field)(()=>_scalars.UUIDScalarType, {
        nullable: true
    }),
    _ts_metadata("design:type", String)
], UpdateObjectPayload.prototype, "labelIdentifierFieldMetadataId", void 0);
_ts_decorate([
    (0, _classvalidator.IsUUID)(),
    (0, _classvalidator.IsOptional)(),
    (0, _graphql.Field)(()=>_scalars.UUIDScalarType, {
        nullable: true
    }),
    _ts_metadata("design:type", Object)
], UpdateObjectPayload.prototype, "imageIdentifierFieldMetadataId", void 0);
_ts_decorate([
    (0, _classvalidator.IsBoolean)(),
    (0, _classvalidator.IsOptional)(),
    (0, _graphql.Field)({
        nullable: true
    }),
    _ts_metadata("design:type", Boolean)
], UpdateObjectPayload.prototype, "isLabelSyncedWithName", void 0);
_ts_decorate([
    (0, _classvalidator.IsBoolean)(),
    (0, _classvalidator.IsOptional)(),
    (0, _graphql.Field)({
        nullable: true
    }),
    _ts_metadata("design:type", Boolean)
], UpdateObjectPayload.prototype, "isSearchable", void 0);
_ts_decorate([
    (0, _classvalidator.IsEnum)(_types.ObjectOpenRecordIn),
    (0, _classvalidator.IsOptional)(),
    (0, _graphql.Field)(()=>_types.ObjectOpenRecordIn, {
        nullable: true
    }),
    _ts_metadata("design:type", typeof _types.ObjectOpenRecordIn === "undefined" ? Object : _types.ObjectOpenRecordIn)
], UpdateObjectPayload.prototype, "openRecordIn", void 0);
_ts_decorate([
    (0, _classtransformer.Type)(()=>_metadatatranslationoverrideinput.MetadataTranslationOverrideInput),
    (0, _classvalidator.ValidateNested)({
        each: true
    }),
    (0, _classvalidator.IsOptional)(),
    (0, _graphql.Field)(()=>[
            _metadatatranslationoverrideinput.MetadataTranslationOverrideInput
        ], {
        nullable: true
    }),
    _ts_metadata("design:type", Array)
], UpdateObjectPayload.prototype, "translations", void 0);
UpdateObjectPayload = _ts_decorate([
    (0, _graphql.InputType)()
], UpdateObjectPayload);
let UpdateOneObjectInput = class UpdateOneObjectInput {
};
_ts_decorate([
    (0, _classtransformer.Type)(()=>UpdateObjectPayload),
    (0, _classvalidator.ValidateNested)(),
    (0, _graphql.Field)(()=>UpdateObjectPayload),
    _ts_metadata("design:type", typeof UpdateObjectPayload === "undefined" ? Object : UpdateObjectPayload)
], UpdateOneObjectInput.prototype, "update", void 0);
_ts_decorate([
    (0, _classvalidator.IsNotEmpty)(),
    (0, _graphql.Field)(()=>_scalars.UUIDScalarType, {
        description: 'The id of the object to update'
    }),
    (0, _classvalidator.IsUUID)(),
    _ts_metadata("design:type", String)
], UpdateOneObjectInput.prototype, "id", void 0);
UpdateOneObjectInput = _ts_decorate([
    (0, _graphql.InputType)()
], UpdateOneObjectInput);

//# sourceMappingURL=update-object.input.js.map