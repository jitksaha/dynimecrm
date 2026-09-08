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
    get AUTH_SESSION_EVENT () {
        return AUTH_SESSION_EVENT;
    },
    get authSessionSchema () {
        return authSessionSchema;
    }
});
const _zod = require("zod");
const _track = require("../track");
const AUTH_SESSION_EVENT = 'AuthSession';
const authSessionSchema = _zod.z.strictObject({
    event: _zod.z.literal(AUTH_SESSION_EVENT),
    properties: _zod.z.strictObject({
        action: _zod.z.enum([
            'user_signed_in',
            'user_signed_out',
            'session_revoked'
        ]),
        message: _zod.z.string().optional()
    })
});
(0, _track.registerEvent)(AUTH_SESSION_EVENT, authSessionSchema);

//# sourceMappingURL=auth-session.js.map