"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "ApplicationRestApiExceptionFilter", {
    enumerable: true,
    get: function() {
        return ApplicationRestApiExceptionFilter;
    }
});
const _common = require("@nestjs/common");
const _utils = require("twenty-shared/utils");
const _applicationexception = require("./application.exception");
const _httpexceptionhandlerservice = require("../exception-handler/http-exception-handler.service");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
const applicationExceptionCodeToHttpStatus = (code)=>{
    switch(code){
        case _applicationexception.ApplicationExceptionCode.OBJECT_NOT_FOUND:
        case _applicationexception.ApplicationExceptionCode.FIELD_NOT_FOUND:
        case _applicationexception.ApplicationExceptionCode.ENTITY_NOT_FOUND:
        case _applicationexception.ApplicationExceptionCode.APPLICATION_NOT_FOUND:
        case _applicationexception.ApplicationExceptionCode.APP_NOT_INSTALLED:
        case _applicationexception.ApplicationExceptionCode.LOGIC_FUNCTION_NOT_FOUND:
        case _applicationexception.ApplicationExceptionCode.FRONT_COMPONENT_NOT_FOUND:
            return 404;
        case _applicationexception.ApplicationExceptionCode.FORBIDDEN:
            return 403;
        case _applicationexception.ApplicationExceptionCode.INVALID_INPUT:
        case _applicationexception.ApplicationExceptionCode.SOURCE_CHANNEL_MISMATCH:
        case _applicationexception.ApplicationExceptionCode.APP_ALREADY_INSTALLED:
        case _applicationexception.ApplicationExceptionCode.CANNOT_DOWNGRADE_APPLICATION:
        case _applicationexception.ApplicationExceptionCode.SERVER_VERSION_INCOMPATIBLE:
        case _applicationexception.ApplicationExceptionCode.WORKSPACE_VERSION_INCOMPATIBLE:
        case _applicationexception.ApplicationExceptionCode.INVALID_APP_ENGINE_REQUIREMENT:
        case _applicationexception.ApplicationExceptionCode.INVALID_WORKSPACE_VERSION:
            return 400;
        case _applicationexception.ApplicationExceptionCode.PACKAGE_RESOLUTION_FAILED:
        case _applicationexception.ApplicationExceptionCode.POST_INSTALL_ERROR:
        case _applicationexception.ApplicationExceptionCode.PRE_INSTALL_ERROR:
        case _applicationexception.ApplicationExceptionCode.UNINSTALL_ERROR:
        case _applicationexception.ApplicationExceptionCode.TARBALL_EXTRACTION_FAILED:
        case _applicationexception.ApplicationExceptionCode.UPGRADE_FAILED:
        case _applicationexception.ApplicationExceptionCode.INVALID_SERVER_VERSION:
        case _applicationexception.ApplicationExceptionCode.APPLICATION_INSTALLATION_FAILED:
        case _applicationexception.ApplicationExceptionCode.KEY_VALUE_PERSISTENCE_FAILED:
            return 500;
        default:
            return (0, _utils.assertUnreachable)(code);
    }
};
let ApplicationRestApiExceptionFilter = class ApplicationRestApiExceptionFilter {
    catch(exception, host) {
        const response = host.switchToHttp().getResponse();
        return this.httpExceptionHandlerService.handleError(exception, response, applicationExceptionCodeToHttpStatus(exception.code));
    }
    constructor(httpExceptionHandlerService){
        this.httpExceptionHandlerService = httpExceptionHandlerService;
    }
};
ApplicationRestApiExceptionFilter = _ts_decorate([
    (0, _common.Injectable)(),
    (0, _common.Catch)(_applicationexception.ApplicationException),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _httpexceptionhandlerservice.HttpExceptionHandlerService === "undefined" ? Object : _httpexceptionhandlerservice.HttpExceptionHandlerService
    ])
], ApplicationRestApiExceptionFilter);

//# sourceMappingURL=application-rest-api-exception.filter.js.map