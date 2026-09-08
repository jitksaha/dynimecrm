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
    get AddressFilterSchema () {
        return AddressFilterSchema;
    },
    get ArrayFieldFilterSchema () {
        return ArrayFieldFilterSchema;
    },
    get BooleanFilterSchema () {
        return BooleanFilterSchema;
    },
    get CurrencyFilterSchema () {
        return CurrencyFilterSchema;
    },
    get DateFilterSchema () {
        return DateFilterSchema;
    },
    get DefaultFilterSchema () {
        return DefaultFilterSchema;
    },
    get EmailsFilterSchema () {
        return EmailsFilterSchema;
    },
    get FullNameFilterSchema () {
        return FullNameFilterSchema;
    },
    get LinksFilterSchema () {
        return LinksFilterSchema;
    },
    get NullCheckEnum () {
        return NullCheckEnum;
    },
    get NumberFilterSchema () {
        return NumberFilterSchema;
    },
    get PhonesFilterSchema () {
        return PhonesFilterSchema;
    },
    get RichTextFilterSchema () {
        return RichTextFilterSchema;
    },
    get TextFilterSchema () {
        return TextFilterSchema;
    },
    get UuidFilterSchema () {
        return UuidFilterSchema;
    }
});
const _zod = require("zod");
const NullCheckEnum = _zod.z.enum([
    'NULL',
    'NOT_NULL'
]).describe('Is null or not null');
const TextFilterSchema = _zod.z.object({
    eq: _zod.z.string().optional().describe('Equals'),
    neq: _zod.z.string().optional().describe('Not equals'),
    in: _zod.z.array(_zod.z.string()).optional().describe('In array'),
    like: _zod.z.string().optional().describe('LIKE (% wildcard)'),
    ilike: _zod.z.string().optional().describe('ILIKE (% wildcard, case-insensitive)'),
    startsWith: _zod.z.string().optional().describe('Starts with'),
    endsWith: _zod.z.string().optional().describe('Ends with'),
    is: NullCheckEnum.optional()
}).optional();
const NumberFilterSchema = _zod.z.object({
    eq: _zod.z.number().optional().describe('Equals'),
    neq: _zod.z.number().optional().describe('Not equals'),
    gt: _zod.z.number().optional().describe('>'),
    gte: _zod.z.number().optional().describe('>='),
    lt: _zod.z.number().optional().describe('<'),
    lte: _zod.z.number().optional().describe('<='),
    in: _zod.z.array(_zod.z.number()).optional().describe('In array'),
    is: NullCheckEnum.optional()
}).optional();
const DateFilterSchema = _zod.z.object({
    eq: _zod.z.string().datetime().optional().describe('Equals (ISO datetime)'),
    neq: _zod.z.string().datetime().optional().describe('Not equals (ISO datetime)'),
    gt: _zod.z.string().datetime().optional().describe('> ISO datetime'),
    gte: _zod.z.string().datetime().optional().describe('>= ISO datetime'),
    lt: _zod.z.string().datetime().optional().describe('< ISO datetime'),
    lte: _zod.z.string().datetime().optional().describe('<= ISO datetime'),
    in: _zod.z.array(_zod.z.string().datetime()).optional().describe('In array (ISO datetimes)'),
    is: NullCheckEnum.optional()
}).optional();
const BooleanFilterSchema = _zod.z.object({
    eq: _zod.z.boolean().optional().describe('Equals'),
    is: NullCheckEnum.optional()
}).optional();
const UuidFilterSchema = _zod.z.object({
    eq: _zod.z.string().uuid().optional().describe('Equals'),
    neq: _zod.z.string().uuid().optional().describe('Not equals'),
    in: _zod.z.array(_zod.z.string().uuid()).optional().describe('In array of values'),
    is: NullCheckEnum.optional()
}).optional();
const DefaultFilterSchema = _zod.z.object({
    eq: _zod.z.string().optional().describe('Equals'),
    neq: _zod.z.string().optional().describe('Not equals'),
    like: _zod.z.string().optional().describe('LIKE (% wildcard)'),
    ilike: _zod.z.string().optional().describe('ILIKE (% wildcard, case-insensitive)'),
    is: NullCheckEnum.optional()
}).optional();
const ArrayFieldFilterSchema = _zod.z.object({
    containsIlike: _zod.z.string().optional().describe('Contains case-insensitive substring'),
    is: NullCheckEnum.optional(),
    isEmptyArray: _zod.z.boolean().optional().describe('Is empty array')
}).optional();
const LinksFilterSchema = _zod.z.object({
    primaryLinkUrl: _zod.z.object({
        eq: _zod.z.string().url().optional().describe('Equals'),
        neq: _zod.z.string().url().optional().describe('Not equals'),
        like: _zod.z.string().optional().describe('LIKE (% wildcard)'),
        ilike: _zod.z.string().optional().describe('ILIKE (% wildcard, case-insensitive)'),
        is: NullCheckEnum.optional()
    }).optional()
}).optional();
const AddressFilterSchema = _zod.z.object({
    addressStreet1: _zod.z.object({
        eq: _zod.z.string().optional().describe('Equals'),
        neq: _zod.z.string().optional().describe('Not equals'),
        like: _zod.z.string().optional().describe('LIKE (% wildcard)'),
        ilike: _zod.z.string().optional().describe('ILIKE (% wildcard, case-insensitive)'),
        is: NullCheckEnum.optional()
    }).optional(),
    addressCity: _zod.z.object({
        eq: _zod.z.string().optional().describe('Equals'),
        neq: _zod.z.string().optional().describe('Not equals'),
        like: _zod.z.string().optional().describe('LIKE (% wildcard)'),
        ilike: _zod.z.string().optional().describe('ILIKE (% wildcard, case-insensitive)'),
        is: NullCheckEnum.optional()
    }).optional(),
    addressCountry: _zod.z.object({
        eq: _zod.z.string().optional().describe('Equals'),
        neq: _zod.z.string().optional().describe('Not equals'),
        like: _zod.z.string().optional().describe('LIKE (% wildcard)'),
        ilike: _zod.z.string().optional().describe('ILIKE (% wildcard, case-insensitive)'),
        is: NullCheckEnum.optional()
    }).optional()
}).optional();
const FullNameFilterSchema = _zod.z.object({
    firstName: _zod.z.object({
        eq: _zod.z.string().optional().describe('Equals'),
        neq: _zod.z.string().optional().describe('Not equals'),
        like: _zod.z.string().optional().describe('LIKE (% wildcard)'),
        ilike: _zod.z.string().optional().describe('ILIKE (% wildcard, case-insensitive)'),
        startsWith: _zod.z.string().optional().describe('Starts with'),
        endsWith: _zod.z.string().optional().describe('Ends with'),
        is: NullCheckEnum.optional()
    }).optional(),
    lastName: _zod.z.object({
        eq: _zod.z.string().optional().describe('Equals'),
        neq: _zod.z.string().optional().describe('Not equals'),
        like: _zod.z.string().optional().describe('LIKE (% wildcard)'),
        ilike: _zod.z.string().optional().describe('ILIKE (% wildcard, case-insensitive)'),
        startsWith: _zod.z.string().optional().describe('Starts with'),
        endsWith: _zod.z.string().optional().describe('Ends with'),
        is: NullCheckEnum.optional()
    }).optional()
}).optional();
const EmailsFilterSchema = _zod.z.object({
    primaryEmail: _zod.z.object({
        eq: _zod.z.string().email().optional().describe('Equals'),
        neq: _zod.z.string().email().optional().describe('Not equals'),
        like: _zod.z.string().optional().describe('LIKE (% wildcard)'),
        ilike: _zod.z.string().optional().describe('ILIKE (% wildcard, case-insensitive)'),
        is: NullCheckEnum.optional()
    }).optional()
}).optional();
const PhonesFilterSchema = _zod.z.object({
    primaryPhoneNumber: _zod.z.object({
        eq: _zod.z.string().optional().describe('Equals'),
        neq: _zod.z.string().optional().describe('Not equals'),
        like: _zod.z.string().optional().describe('LIKE (% wildcard)'),
        ilike: _zod.z.string().optional().describe('ILIKE (% wildcard, case-insensitive)'),
        is: NullCheckEnum.optional()
    }).optional()
}).optional();
const RichTextFilterSchema = _zod.z.object({
    markdown: _zod.z.object({
        eq: _zod.z.string().optional().describe('Equals'),
        neq: _zod.z.string().optional().describe('Not equals'),
        like: _zod.z.string().optional().describe('LIKE (% wildcard)'),
        ilike: _zod.z.string().optional().describe('ILIKE (% wildcard, case-insensitive)'),
        startsWith: _zod.z.string().optional().describe('Starts with'),
        endsWith: _zod.z.string().optional().describe('Ends with'),
        is: NullCheckEnum.optional()
    }).optional()
}).optional();
const CurrencyFilterSchema = _zod.z.object({
    amountMicros: _zod.z.object({
        eq: _zod.z.number().optional().describe('Equals'),
        neq: _zod.z.number().optional().describe('Not equals'),
        gt: _zod.z.number().optional().describe('>'),
        gte: _zod.z.number().optional().describe('>='),
        lt: _zod.z.number().optional().describe('<'),
        lte: _zod.z.number().optional().describe('<='),
        in: _zod.z.array(_zod.z.number()).optional().describe('In array'),
        is: NullCheckEnum.optional()
    }).describe('Currency amount in micros (1 unit = 1,000,000 micros). Multiply the user-provided amount by 1,000,000 to build this filter.').optional(),
    currencyCode: _zod.z.object({
        eq: _zod.z.string().optional().describe('Equals'),
        neq: _zod.z.string().optional().describe('Not equals'),
        in: _zod.z.array(_zod.z.string()).optional().describe('In array'),
        is: NullCheckEnum.optional()
    }).optional()
}).optional();

//# sourceMappingURL=shared-filter-defs.zod-schema.js.map