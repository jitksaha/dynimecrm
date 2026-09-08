"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "FileUploadController", {
    enumerable: true,
    get: function() {
        return FileUploadController;
    }
});
const _common = require("@nestjs/common");
const _express = require("express");
const _types = require("twenty-shared/types");
const _fileuploadapiexceptionfilter = require("../filters/file-upload-api-exception.filter");
const _fileuploadtokenguard = require("../guards/file-upload-token.guard");
const _fileuploadservice = require("../services/file-upload.service");
const _nopermissionguard = require("../../../../guards/no-permission.guard");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
function _ts_param(paramIndex, decorator) {
    return function(target, key) {
        decorator(target, key, paramIndex);
    };
}
let FileUploadController = class FileUploadController {
    // Streaming target for direct uploads when storage has no presigned upload
    // support (local driver, or S3 without presign enabled). The body is piped
    // to the storage driver without ever being buffered in memory.
    async uploadFileById(req, res, fileId) {
        // oxlint-disable-next-line typescript/no-explicit-any
        const workspaceId = req?.workspaceId;
        await this.fileUploadService.receiveFileStream({
            workspaceId,
            fileId,
            stream: req
        });
        res.status(204).send();
    }
    constructor(fileUploadService){
        this.fileUploadService = fileUploadService;
    }
};
_ts_decorate([
    (0, _common.Put)(`${_types.ApiPath.FileUpload}/:id`),
    (0, _common.UseGuards)(_fileuploadtokenguard.FileUploadTokenGuard, _nopermissionguard.NoPermissionGuard),
    _ts_param(0, (0, _common.Req)()),
    _ts_param(1, (0, _common.Res)()),
    _ts_param(2, (0, _common.Param)('id')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _express.Request === "undefined" ? Object : _express.Request,
        typeof _express.Response === "undefined" ? Object : _express.Response,
        String
    ]),
    _ts_metadata("design:returntype", Promise)
], FileUploadController.prototype, "uploadFileById", null);
FileUploadController = _ts_decorate([
    (0, _common.Controller)(),
    (0, _common.UseFilters)(_fileuploadapiexceptionfilter.FileUploadApiExceptionFilter),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _fileuploadservice.FileUploadService === "undefined" ? Object : _fileuploadservice.FileUploadService
    ])
], FileUploadController);

//# sourceMappingURL=file-upload.controller.js.map