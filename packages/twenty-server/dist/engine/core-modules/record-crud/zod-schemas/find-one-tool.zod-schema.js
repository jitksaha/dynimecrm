"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "FindOneToolInputSchema", {
    enumerable: true,
    get: function() {
        return FindOneToolInputSchema;
    }
});
const _zod = require("zod");
const FindOneToolInputSchema = _zod.z.object({
    id: _zod.z.string().uuid().describe('The unique UUID of the record to retrieve'),
    select: _zod.z.array(_zod.z.string()).nonempty().describe('Fields to include in the response. Required. ' + "Use '*' to return all fields. " + 'Relation fields resolve to related records as {id, label} summaries: ' + 'MANY_TO_ONE returns a single object (or select the <name>Id FK column for just the id), ' + 'ONE_TO_MANY returns up to 60 related records.')
});

//# sourceMappingURL=find-one-tool.zod-schema.js.map