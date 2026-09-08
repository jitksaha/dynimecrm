"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "ApplicationFileUploadTargetDTO", {
    enumerable: true,
    get: function() {
        return ApplicationFileUploadTargetDTO;
    }
});
const _graphql = require("@nestjs/graphql");
const _types = require("twenty-shared/types");
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
let ApplicationFileUploadTargetDTO = class ApplicationFileUploadTargetDTO {
};
_ts_decorate([
    (0, _graphql.Field)(()=>_scalars.UUIDScalarType),
    _ts_metadata("design:type", String)
], ApplicationFileUploadTargetDTO.prototype, "fileId", void 0);
_ts_decorate([
    (0, _graphql.Field)(()=>_types.FileFolder),
    _ts_metadata("design:type", typeof _types.FileFolder === "undefined" ? Object : _types.FileFolder)
], ApplicationFileUploadTargetDTO.prototype, "fileFolder", void 0);
_ts_decorate([
    (0, _graphql.Field)(),
    _ts_metadata("design:type", String)
], ApplicationFileUploadTargetDTO.prototype, "filePath", void 0);
_ts_decorate([
    (0, _graphql.Field)(),
    _ts_metadata("design:type", String)
], ApplicationFileUploadTargetDTO.prototype, "uploadUrl", void 0);
_ts_decorate([
    (0, _graphql.Field)(),
    _ts_metadata("design:type", String)
], ApplicationFileUploadTargetDTO.prototype, "contentType", void 0);
_ts_decorate([
    (0, _graphql.Field)(()=>Date, {
        nullable: false
    }),
    _ts_metadata("design:type", typeof Date === "undefined" ? Object : Date)
], ApplicationFileUploadTargetDTO.prototype, "expiresAt", void 0);
ApplicationFileUploadTargetDTO = _ts_decorate([
    (0, _graphql.ObjectType)('ApplicationFileUploadTarget')
], ApplicationFileUploadTargetDTO);

//# sourceMappingURL=application-file-upload-target.dto.js.map