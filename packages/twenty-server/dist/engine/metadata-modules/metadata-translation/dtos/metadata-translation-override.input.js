"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "MetadataTranslationOverrideInput", {
    enumerable: true,
    get: function() {
        return MetadataTranslationOverrideInput;
    }
});
const _graphql = require("@nestjs/graphql");
const _translations = require("twenty-shared/translations");
const _classvalidator = require("class-validator");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let MetadataTranslationOverrideInput = class MetadataTranslationOverrideInput {
};
_ts_decorate([
    (0, _classvalidator.IsIn)(Object.keys(_translations.APP_LOCALES)),
    (0, _graphql.Field)(()=>String),
    _ts_metadata("design:type", Object)
], MetadataTranslationOverrideInput.prototype, "locale", void 0);
_ts_decorate([
    (0, _classvalidator.IsString)(),
    (0, _classvalidator.IsNotEmpty)(),
    (0, _graphql.Field)(),
    _ts_metadata("design:type", String)
], MetadataTranslationOverrideInput.prototype, "property", void 0);
_ts_decorate([
    (0, _classvalidator.IsString)(),
    (0, _classvalidator.IsOptional)(),
    (0, _graphql.Field)(()=>String, {
        nullable: true
    }),
    _ts_metadata("design:type", Object)
], MetadataTranslationOverrideInput.prototype, "value", void 0);
MetadataTranslationOverrideInput = _ts_decorate([
    (0, _graphql.InputType)()
], MetadataTranslationOverrideInput);

//# sourceMappingURL=metadata-translation-override.input.js.map