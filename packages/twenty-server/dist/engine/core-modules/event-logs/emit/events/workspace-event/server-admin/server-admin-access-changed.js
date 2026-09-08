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
    get SERVER_ADMIN_ACCESS_CHANGED_EVENT () {
        return SERVER_ADMIN_ACCESS_CHANGED_EVENT;
    },
    get serverAdminAccessChangedSchema () {
        return serverAdminAccessChangedSchema;
    }
});
const _zod = require("zod");
const _track = require("../track");
const SERVER_ADMIN_ACCESS_CHANGED_EVENT = 'ServerAdminAccessChanged';
const serverAdminAccessChangedSchema = _zod.z.strictObject({
    event: _zod.z.literal(SERVER_ADMIN_ACCESS_CHANGED_EVENT),
    properties: _zod.z.strictObject({
        targetUserId: _zod.z.string(),
        canAccessFullAdminPanel: _zod.z.boolean(),
        canImpersonate: _zod.z.boolean(),
        message: _zod.z.string().optional()
    })
});
(0, _track.registerEvent)(SERVER_ADMIN_ACCESS_CHANGED_EVENT, serverAdminAccessChangedSchema);

//# sourceMappingURL=server-admin-access-changed.js.map