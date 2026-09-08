"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "AuthAuthenticatedAt", {
    enumerable: true,
    get: function() {
        return AuthAuthenticatedAt;
    }
});
const _common = require("@nestjs/common");
const _extractrequest = require("../../../utils/extract-request");
const AuthAuthenticatedAt = (0, _common.createParamDecorator)((_, ctx)=>{
    const request = (0, _extractrequest.getRequest)(ctx);
    return request.authenticatedAt;
});

//# sourceMappingURL=auth-authenticated-at.decorator.js.map