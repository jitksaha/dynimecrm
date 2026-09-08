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
    get ObjectRecordOrderByItemSchema () {
        return ObjectRecordOrderByItemSchema;
    },
    get ObjectRecordOrderBySchema () {
        return ObjectRecordOrderBySchema;
    },
    get OrderByDirectionEnum () {
        return OrderByDirectionEnum;
    },
    get OrderByFieldValueSchema () {
        return OrderByFieldValueSchema;
    }
});
const _zod = require("zod");
const OrderByDirectionEnum = _zod.z.enum([
    'AscNullsFirst',
    'AscNullsLast',
    'DescNullsFirst',
    'DescNullsLast'
]);
const OrderByFieldValueSchema = _zod.z.union([
    OrderByDirectionEnum,
    _zod.z.record(_zod.z.string(), OrderByDirectionEnum)
]);
const ObjectRecordOrderByItemSchema = _zod.z.object({}).catchall(OrderByFieldValueSchema).refine((obj)=>Object.keys(obj).length === 1, {
    message: 'Each orderBy item must specify exactly one field'
}).describe('Object with exactly ONE property. ' + 'For scalar fields use a direction string: {"employees": "DescNullsLast"}. ' + 'For composite fields (e.g. name, address, currency) use a nested object with the sub-field: {"name": {"firstName": "AscNullsFirst"}}. ' + 'Never use dot-notation keys like "name.firstName".');
const ObjectRecordOrderBySchema = _zod.z.array(ObjectRecordOrderByItemSchema).optional().describe('Array of sort criteria. Each item sorts by one field. ' + 'Scalar fields: [{"employees": "DescNullsLast"}]. ' + 'Composite fields (name, address, currency, …): [{"name": {"firstName": "AscNullsFirst"}}]. ' + 'Use "DescNullsLast" for descending (top/largest), "AscNullsFirst" for ascending (bottom/smallest). ' + 'Never use dot-notation keys like "name.firstName".');

//# sourceMappingURL=order-by.zod-schema.js.map