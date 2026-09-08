"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "generateBulkDeleteToolInputSchema", {
    enumerable: true,
    get: function() {
        return generateBulkDeleteToolInputSchema;
    }
});
const _zod = require("zod");
const _recordfilterzodschema = require("./record-filter.zod-schema");
const generateBulkDeleteToolInputSchema = (objectMetadata, restrictedFields)=>{
    const { filterSchema } = (0, _recordfilterzodschema.generateRecordFilterSchema)({
        objectMetadata,
        restrictedFields
    });
    return _zod.z.object({
        filter: filterSchema.describe('Filter to select which records to delete. Supports field-level filters and logical operators (or, and, not). WARNING: A broad filter may delete many records at once. Always verify the filter scope with a find query first.')
    });
};

//# sourceMappingURL=bulk-delete-tool.zod-schema.js.map