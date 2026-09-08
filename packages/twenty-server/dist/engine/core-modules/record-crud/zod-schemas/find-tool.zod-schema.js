"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "generateFindToolInputSchema", {
    enumerable: true,
    get: function() {
        return generateFindToolInputSchema;
    }
});
const _zod = require("zod");
const _orderbyzodschema = require("./order-by.zod-schema");
const _recordfilterzodschema = require("./record-filter.zod-schema");
const generateFindToolInputSchema = (objectMetadata, restrictedFields)=>{
    const { filterShape, filterSchema } = (0, _recordfilterzodschema.generateRecordFilterSchema)({
        objectMetadata,
        restrictedFields
    });
    return _zod.z.object({
        limit: _zod.z.number().int().positive().max(100).default(10).describe('Maximum number of records to return (default: 10, max: 100). Start small and increase only if needed.'),
        offset: _zod.z.number().int().nonnegative().default(0).describe('Number of records to skip (default: 0)'),
        orderBy: _orderbyzodschema.ObjectRecordOrderBySchema.describe('Sort by field(s). ' + 'Scalar fields: [{fieldName: "DescNullsLast"}]. ' + 'Composite fields (name, address, currency, …): [{fieldName: {subFieldName: "AscNullsFirst"}}] — e.g. [{"name": {"firstName": "AscNullsFirst"}}]. ' + 'Never use dot-notation keys like "name.firstName". ' + 'Use DescNullsLast for top/largest, AscNullsFirst for bottom/smallest.'),
        select: _zod.z.array(_zod.z.string()).nonempty().describe(`Fields to include in the response. Required. ` + `Use '*' to return all fields, or list specific field names. ` + `Relation fields resolve to related records as {id, label} summaries: ` + `MANY_TO_ONE returns a single object (or select the '<name>Id' FK column for just the id), ` + `ONE_TO_MANY returns up to 60 related records. ` + `For more fields or more records, query the related object directly. `),
        ...filterShape,
        or: _zod.z.array(filterSchema).optional().describe('OR condition - matches if ANY of the filters match'),
        and: _zod.z.array(filterSchema).optional().describe('AND condition - matches if ALL filters match'),
        not: filterSchema.optional().describe('NOT condition - matches if the filter does NOT match')
    });
};

//# sourceMappingURL=find-tool.zod-schema.js.map