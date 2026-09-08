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
    get IMPERSONATION_EVENT () {
        return IMPERSONATION_EVENT;
    },
    get impersonationSchema () {
        return impersonationSchema;
    }
});
const _zod = require("zod");
const _track = require("../track");
const IMPERSONATION_EVENT = 'Impersonation';
const impersonationSchema = _zod.z.strictObject({
    event: _zod.z.literal(IMPERSONATION_EVENT),
    properties: _zod.z.strictObject({
        level: _zod.z.enum([
            'server',
            'workspace'
        ]),
        action: _zod.z.enum([
            'attempt',
            'attempted',
            'issued',
            'ended',
            'login_token_attempt',
            'login_token_generated',
            'login_token_failed',
            'token_exchange_attempt',
            'token_exchange_success',
            'token_exchange_failed'
        ]),
        message: _zod.z.string().optional()
    })
});
(0, _track.registerEvent)(IMPERSONATION_EVENT, impersonationSchema);

//# sourceMappingURL=impersonation.js.map