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
    get ApplicationFileUploadErrorDTO () {
        return ApplicationFileUploadErrorDTO;
    },
    get CreateApplicationFileUploadsResultDTO () {
        return CreateApplicationFileUploadsResultDTO;
    }
});
const _graphql = require("@nestjs/graphql");
const _types = require("twenty-shared/types");
const _applicationfileuploadtargetdto = require("./application-file-upload-target.dto");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let ApplicationFileUploadErrorDTO = class ApplicationFileUploadErrorDTO {
};
_ts_decorate([
    (0, _graphql.Field)(()=>_types.FileFolder),
    _ts_metadata("design:type", typeof _types.FileFolder === "undefined" ? Object : _types.FileFolder)
], ApplicationFileUploadErrorDTO.prototype, "fileFolder", void 0);
_ts_decorate([
    (0, _graphql.Field)(),
    _ts_metadata("design:type", String)
], ApplicationFileUploadErrorDTO.prototype, "filePath", void 0);
_ts_decorate([
    (0, _graphql.Field)(),
    _ts_metadata("design:type", String)
], ApplicationFileUploadErrorDTO.prototype, "message", void 0);
ApplicationFileUploadErrorDTO = _ts_decorate([
    (0, _graphql.ObjectType)('ApplicationFileUploadError')
], ApplicationFileUploadErrorDTO);
let CreateApplicationFileUploadsResultDTO = class CreateApplicationFileUploadsResultDTO {
};
_ts_decorate([
    (0, _graphql.Field)(()=>[
            _applicationfileuploadtargetdto.ApplicationFileUploadTargetDTO
        ]),
    _ts_metadata("design:type", Array)
], CreateApplicationFileUploadsResultDTO.prototype, "targets", void 0);
_ts_decorate([
    (0, _graphql.Field)(()=>[
            ApplicationFileUploadErrorDTO
        ]),
    _ts_metadata("design:type", Array)
], CreateApplicationFileUploadsResultDTO.prototype, "errors", void 0);
CreateApplicationFileUploadsResultDTO = _ts_decorate([
    (0, _graphql.ObjectType)('CreateApplicationFileUploadsResult')
], CreateApplicationFileUploadsResultDTO);

//# sourceMappingURL=create-application-file-uploads-result.dto.js.map