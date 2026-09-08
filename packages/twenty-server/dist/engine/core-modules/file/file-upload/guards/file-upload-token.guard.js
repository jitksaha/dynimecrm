"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "FileUploadTokenGuard", {
    enumerable: true,
    get: function() {
        return FileUploadTokenGuard;
    }
});
const _common = require("@nestjs/common");
const _jwttokentypeenum = require("../../../auth/types/jwt-token-type.enum");
const _jwtwrapperservice = require("../../../jwt/services/jwt-wrapper.service");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let FileUploadTokenGuard = class FileUploadTokenGuard {
    async canActivate(context) {
        const request = context.switchToHttp().getRequest();
        const fileId = request.params.id;
        const uploadToken = request.query.token;
        if (!uploadToken) {
            return false;
        }
        let payload;
        try {
            payload = await this.jwtWrapperService.verifyJwtToken(uploadToken);
        } catch  {
            return false;
        }
        // A FILE (download) token also carries workspaceId + fileId: reject
        // anything that is not explicitly an upload token.
        if (payload.type !== _jwttokentypeenum.JwtTokenTypeEnum.FILE_UPLOAD) {
            return false;
        }
        if (!payload.workspaceId || payload.fileId !== fileId) {
            return false;
        }
        request.workspaceId = payload.workspaceId;
        return true;
    }
    constructor(jwtWrapperService){
        this.jwtWrapperService = jwtWrapperService;
    }
};
FileUploadTokenGuard = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _jwtwrapperservice.JwtWrapperService === "undefined" ? Object : _jwtwrapperservice.JwtWrapperService
    ])
], FileUploadTokenGuard);

//# sourceMappingURL=file-upload-token.guard.js.map