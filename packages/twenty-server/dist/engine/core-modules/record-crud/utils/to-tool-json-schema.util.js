"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "toToolJsonSchema", {
    enumerable: true,
    get: function() {
        return toToolJsonSchema;
    }
});
const _zod = require("zod");
const toToolJsonSchema = (schema)=>{
    const result = _zod.z.toJSONSchema(schema, {
        io: 'input',
        reused: 'ref',
        override (ctx) {
            if (!ctx.jsonSchema) {
                return;
            }
            if (ctx.jsonSchema.type === 'integer') {
                delete ctx.jsonSchema.minimum;
                delete ctx.jsonSchema.maximum;
            }
            if (ctx.jsonSchema.format && ctx.jsonSchema.pattern) {
                delete ctx.jsonSchema.pattern;
            }
        }
    });
    delete result['$schema'];
    return result;
};

//# sourceMappingURL=to-tool-json-schema.util.js.map