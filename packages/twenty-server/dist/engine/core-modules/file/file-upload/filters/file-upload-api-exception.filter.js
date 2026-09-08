"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "FileUploadApiExceptionFilter", {
    enumerable: true,
    get: function() {
        return FileUploadApiExceptionFilter;
    }
});
const _common = require("@nestjs/common");
const _httpexceptionhandlerservice = require("../../../exception-handler/http-exception-handler.service");
const _fileuploadexception = require("../file-upload.exception");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let FileUploadApiExceptionFilter = class FileUploadApiExceptionFilter {
    catch(exception, host) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        switch(exception.code){
            case _fileuploadexception.FileUploadExceptionCode.FILE_NOT_FOUND:
                return this.httpExceptionHandlerService.handleError(exception, response, 404);
            case _fileuploadexception.FileUploadExceptionCode.FILE_TOO_LARGE:
                return this.httpExceptionHandlerService.handleError(exception, response, 413);
            case _fileuploadexception.FileUploadExceptionCode.BAD_REQUEST:
            case _fileuploadexception.FileUploadExceptionCode.FILE_NOT_UPLOADED:
            case _fileuploadexception.FileUploadExceptionCode.FILE_SIZE_MISMATCH:
                return this.httpExceptionHandlerService.handleError(exception, response, 400);
            default:
                return this.httpExceptionHandlerService.handleError(exception, response, 500);
        }
    }
    constructor(httpExceptionHandlerService){
        this.httpExceptionHandlerService = httpExceptionHandlerService;
    }
};
FileUploadApiExceptionFilter = _ts_decorate([
    (0, _common.Catch)(_fileuploadexception.FileUploadException),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _httpexceptionhandlerservice.HttpExceptionHandlerService === "undefined" ? Object : _httpexceptionhandlerservice.HttpExceptionHandlerService
    ])
], FileUploadApiExceptionFilter);

//# sourceMappingURL=file-upload-api-exception.filter.js.map