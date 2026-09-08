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
    get AddressValueOptionalSchema () {
        return AddressValueOptionalSchema;
    },
    get AddressValueSchema () {
        return AddressValueSchema;
    },
    get CurrencyResponseValueOptionalSchema () {
        return CurrencyResponseValueOptionalSchema;
    },
    get CurrencyResponseValueSchema () {
        return CurrencyResponseValueSchema;
    },
    get CurrencyValueOptionalSchema () {
        return CurrencyValueOptionalSchema;
    },
    get CurrencyValueSchema () {
        return CurrencyValueSchema;
    },
    get EmailsValueOptionalSchema () {
        return EmailsValueOptionalSchema;
    },
    get EmailsValueSchema () {
        return EmailsValueSchema;
    },
    get FullNameValueOptionalSchema () {
        return FullNameValueOptionalSchema;
    },
    get FullNameValueSchema () {
        return FullNameValueSchema;
    },
    get LinksValueOptionalSchema () {
        return LinksValueOptionalSchema;
    },
    get LinksValueSchema () {
        return LinksValueSchema;
    },
    get PhonesValueOptionalSchema () {
        return PhonesValueOptionalSchema;
    },
    get PhonesValueSchema () {
        return PhonesValueSchema;
    },
    get RichTextValueOptionalSchema () {
        return RichTextValueOptionalSchema;
    },
    get RichTextValueSchema () {
        return RichTextValueSchema;
    },
    get UuidValueOptionalSchema () {
        return UuidValueOptionalSchema;
    },
    get UuidValueSchema () {
        return UuidValueSchema;
    }
});
const _zod = require("zod");
const UuidValueSchema = _zod.z.uuidv4();
const UuidValueOptionalSchema = UuidValueSchema.optional();
const LinksValueSchema = _zod.z.object({
    primaryLinkLabel: _zod.z.string().optional(),
    primaryLinkUrl: _zod.z.string().url().optional(),
    secondaryLinks: _zod.z.array(_zod.z.object({
        url: _zod.z.string().url(),
        label: _zod.z.string()
    })).optional()
});
const LinksValueOptionalSchema = LinksValueSchema.optional();
const CURRENCY_WRITE_DESCRIPTION = 'Currency amount in micros (1 unit = 1,000,000 micros). Multiply the user-provided amount by 1,000,000 before writing.';
const CURRENCY_READ_DESCRIPTION = 'Currency amount in micros (1 unit = 1,000,000 micros). Divide by 1,000,000 to display to users.';
const CurrencyValueSchema = _zod.z.object({
    amountMicros: _zod.z.number().optional().describe(CURRENCY_WRITE_DESCRIPTION),
    currencyCode: _zod.z.string().optional()
});
const CurrencyValueOptionalSchema = CurrencyValueSchema.optional();
const CurrencyResponseValueSchema = _zod.z.object({
    amountMicros: _zod.z.number().optional().describe(CURRENCY_READ_DESCRIPTION),
    currencyCode: _zod.z.string().optional()
});
const CurrencyResponseValueOptionalSchema = CurrencyResponseValueSchema.optional();
const FullNameValueSchema = _zod.z.object({
    firstName: _zod.z.string().optional(),
    lastName: _zod.z.string().optional()
});
const FullNameValueOptionalSchema = FullNameValueSchema.optional();
const AddressValueSchema = _zod.z.object({
    addressStreet1: _zod.z.string().optional(),
    addressStreet2: _zod.z.string().optional(),
    addressCity: _zod.z.string().optional(),
    addressPostcode: _zod.z.string().optional(),
    addressState: _zod.z.string().optional(),
    addressCountry: _zod.z.string().optional(),
    addressLat: _zod.z.number().optional(),
    addressLng: _zod.z.number().optional()
});
const AddressValueOptionalSchema = AddressValueSchema.optional();
const EmailsValueSchema = _zod.z.object({
    primaryEmail: _zod.z.string().email().optional(),
    additionalEmails: _zod.z.array(_zod.z.string().email()).optional()
});
const EmailsValueOptionalSchema = EmailsValueSchema.optional();
const PhonesValueSchema = _zod.z.object({
    primaryPhoneNumber: _zod.z.string().optional(),
    primaryPhoneCountryCode: _zod.z.string().optional(),
    primaryPhoneCallingCode: _zod.z.string().optional(),
    additionalPhones: _zod.z.array(_zod.z.string()).optional()
});
const PhonesValueOptionalSchema = PhonesValueSchema.optional();
const RichTextValueSchema = _zod.z.object({
    markdown: _zod.z.string().optional(),
    blocknote: _zod.z.string().optional()
});
const RichTextValueOptionalSchema = RichTextValueSchema.optional();

//# sourceMappingURL=shared-value-defs.zod-schema.js.map