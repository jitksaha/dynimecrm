"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "FileUploadTargetDTO", {
    enumerable: true,
    get: function() {
        return FileUploadTargetDTO;
    }
});
const _graphql = require("@nestjs/graphql");
const _scalars = require("../../../../api/graphql/workspace-schema-builder/graphql-types/scalars");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let FileUploadTargetDTO = class FileUploadTargetDTO {
};
_ts_decorate([
    (0, _graphql.Field)(()=>_scalars.UUIDScalarType),
    _ts_metadata("design:type", String)
], FileUploadTargetDTO.prototype, "fileId", void 0);
_ts_decorate([
    (0, _graphql.Field)(),
    _ts_metadata("design:type", String)
], FileUploadTargetDTO.prototype, "uploadUrl", void 0);
_ts_decorate([
    (0, _graphql.Field)(),
    _ts_metadata("design:type", String)
], FileUploadTargetDTO.prototype, "contentType", void 0);
_ts_decorate([
    (0, _graphql.Field)(()=>Date, {
        nullable: false
    }),
    _ts_metadata("design:type", typeof Date === "undefined" ? Object : Date)
], FileUploadTargetDTO.prototype, "expiresAt", void 0);
FileUploadTargetDTO = _ts_decorate([
    (0, _graphql.ObjectType)('FileUploadTarget')
], FileUploadTargetDTO);

//# sourceMappingURL=file-upload-target.dto.js.map