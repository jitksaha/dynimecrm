"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "UserAuthGuard", {
    enumerable: true,
    get: function() {
        return UserAuthGuard;
    }
});
const _getrequestorthrowwhenunauthenticatedutil = require("./utils/get-request-or-throw-when-unauthenticated.util");
let UserAuthGuard = class UserAuthGuard {
    canActivate(context) {
        const request = (0, _getrequestorthrowwhenunauthenticatedutil.getRequestOrThrowWhenUnauthenticated)(context);
        if (!request) {
            return false;
        }
        return request.user !== undefined;
    }
};

//# sourceMappingURL=user-auth.guard.js.map