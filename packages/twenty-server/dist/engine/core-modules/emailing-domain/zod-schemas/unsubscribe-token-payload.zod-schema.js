"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "unsubscribeTokenPayloadSchema", {
    enumerable: true,
    get: function() {
        return unsubscribeTokenPayloadSchema;
    }
});
const _zod = require("zod");
const unsubscribeTokenPayloadSchema = _zod.z.object({
    workspaceId: _zod.z.string().min(1),
    emailAddress: _zod.z.string().min(1),
    preview: _zod.z.literal(true).optional(),
    issuedAt: _zod.z.number()
});

//# sourceMappingURL=unsubscribe-token-payload.zod-schema.js.map