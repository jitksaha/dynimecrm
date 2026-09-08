"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "AuthApplication", {
    enumerable: true,
    get: function() {
        return AuthApplication;
    }
});
const _common = require("@nestjs/common");
const _extractrequest = require("../../../utils/extract-request");
const AuthApplication = (0, _common.createParamDecorator)((options, ctx)=>{
    const request = (0, _extractrequest.getRequest)(ctx);
    if (!options?.allowUndefined && !request.application) {
        throw new _common.ForbiddenException('This endpoint requires an APPLICATION_ACCESS token.');
    }
    return request.application;
});

//# sourceMappingURL=auth-application.decorator.js.map