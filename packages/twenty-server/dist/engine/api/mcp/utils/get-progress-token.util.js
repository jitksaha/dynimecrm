"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "getProgressToken", {
    enumerable: true,
    get: function() {
        return getProgressToken;
    }
});
const _zod = require("zod");
const progressTokenParamsSchema = _zod.z.object({
    _meta: _zod.z.object({
        progressToken: _zod.z.union([
            _zod.z.string(),
            _zod.z.number().int()
        ])
    })
});
const getProgressToken = (params)=>{
    const parsed = progressTokenParamsSchema.safeParse(params);
    return parsed.success ? parsed.data._meta.progressToken : undefined;
};

//# sourceMappingURL=get-progress-token.util.js.map