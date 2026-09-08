"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "CreateIndexInput", {
    enumerable: true,
    get: function() {
        return CreateIndexInput;
    }
});
const _graphql = require("@nestjs/graphql");
const _classtransformer = require("class-transformer");
const _classvalidator = require("class-validator");
const _scalars = require("../../../api/graphql/workspace-schema-builder/graphql-types/scalars");
const _createindexfieldinput = require("./create-index-field.input");
const _types = require("twenty-shared/types");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let CreateIndexInput = class CreateIndexInput {
};
_ts_decorate([
    (0, _classvalidator.IsUUID)(),
    (0, _graphql.Field)(()=>_scalars.UUIDScalarType),
    _ts_metadata("design:type", String)
], CreateIndexInput.prototype, "objectMetadataId", void 0);
_ts_decorate([
    (0, _classvalidator.IsArray)(),
    (0, _classvalidator.ArrayNotEmpty)(),
    (0, _classvalidator.ArrayMinSize)(1),
    (0, _classtransformer.Type)(()=>_createindexfieldinput.CreateIndexFieldInput),
    (0, _classvalidator.ValidateNested)({
        each: true
    }),
    (0, _graphql.Field)(()=>[
            _createindexfieldinput.CreateIndexFieldInput
        ]),
    _ts_metadata("design:type", Array)
], CreateIndexInput.prototype, "fields", void 0);
_ts_decorate([
    (0, _classvalidator.IsEnum)(_types.IndexType),
    (0, _graphql.Field)(()=>_types.IndexType, {
        defaultValue: _types.IndexType.BTREE
    }),
    _ts_metadata("design:type", typeof _types.IndexType === "undefined" ? Object : _types.IndexType)
], CreateIndexInput.prototype, "indexType", void 0);
CreateIndexInput = _ts_decorate([
    (0, _graphql.InputType)()
], CreateIndexInput);

//# sourceMappingURL=create-index.input.js.map