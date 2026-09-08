"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "getRequestOrThrowWhenUnauthenticated", {
    enumerable: true,
    get: function() {
        return getRequestOrThrowWhenUnauthenticated;
    }
});
const _utils = require("twenty-shared/utils");
const _authexception = require("../../core-modules/auth/auth.exception");
const _graphqlerrorsutil = require("../../core-modules/graphql/utils/graphql-errors.util");
const _extractrequest = require("../../../utils/extract-request");
const hasAuthenticatedPrincipal = (request)=>(0, _utils.isDefined)(request.user) || (0, _utils.isDefined)(request.apiKey) || (0, _utils.isDefined)(request.application);
const getRequestOrThrowWhenUnauthenticated = (context)=>{
    const request = (0, _extractrequest.getRequest)(context);
    if (!request) {
        return undefined;
    }
    if (!hasAuthenticatedPrincipal(request) && context.getType() === 'graphql') {
        throw new _graphqlerrorsutil.AuthenticationError('Missing authentication token', {
            subCode: _authexception.AuthExceptionCode.UNAUTHENTICATED,
            userFriendlyMessage: /*i18n*/ {
                id: "z+7x/s",
                message: "You must be authenticated to perform this action."
            }
        });
    }
    return request;
};

//# sourceMappingURL=get-request-or-throw-when-unauthenticated.util.js.map