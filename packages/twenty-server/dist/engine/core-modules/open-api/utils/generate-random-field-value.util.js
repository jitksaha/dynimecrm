"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "generateRandomFieldValue", {
    enumerable: true,
    get: function() {
        return generateRandomFieldValue;
    }
});
const _faker = require("@faker-js/faker");
const _types = require("twenty-shared/types");
const _utils = require("twenty-shared/utils");
// Its own instance so seeding cannot disturb the shared faker other callers use.
const faker = new _faker.Faker({
    locale: _faker.en
});
// CI diffs this document against the one main generates, so an example may only
// depend on the field it describes. Field ids are per-workspace, hence the name.
const seedForField = (field)=>{
    let seed = 0;
    for (const character of `${field.name}:${field.type}`){
        seed = seed * 31 + character.charCodeAt(0) | 0;
    }
    faker.seed(Math.abs(seed));
};
// Anchors faker.date, which is otherwise relative to the moment of generation.
const EXAMPLE_REFERENCE_DATE = new Date('2024-01-01T00:00:00.000Z');
const generateRandomFieldValue = ({ field })=>{
    seedForField(field);
    switch(field.type){
        case _types.FieldMetadataType.UUID:
            {
                return faker.string.uuid();
            }
        case _types.FieldMetadataType.TEXT:
            {
                return faker.string.fromCharacters(field.name);
            }
        case _types.FieldMetadataType.PHONES:
            {
                return {
                    primaryPhoneNumber: '06 10 20 30 40',
                    primaryPhoneCallingCode: '+33',
                    primaryPhoneCountryCode: 'FR',
                    additionalPhones: []
                };
            }
        case _types.FieldMetadataType.EMAILS:
            {
                return {
                    primaryEmail: faker.internet.email().toLowerCase(),
                    additionalEmails: null
                };
            }
        case _types.FieldMetadataType.DATE:
        case _types.FieldMetadataType.DATE_TIME:
            {
                return faker.date.soon({
                    refDate: EXAMPLE_REFERENCE_DATE
                });
            }
        case _types.FieldMetadataType.BOOLEAN:
            {
                return false;
            }
        case _types.FieldMetadataType.NUMBER:
            {
                return faker.number.float({
                    min: 1,
                    max: 1_000
                });
            }
        case _types.FieldMetadataType.NUMERIC:
            {
                return faker.number.int({
                    min: 1,
                    max: 1_000
                });
            }
        case _types.FieldMetadataType.LINKS:
            {
                return {
                    primaryLinkLabel: '',
                    primaryLinkUrl: faker.internet.url(),
                    secondaryLinks: []
                };
            }
        case _types.FieldMetadataType.CURRENCY:
            {
                return {
                    amountMicros: `${faker.number.int({
                        min: 100,
                        max: 1_000
                    }) * 1_000_000}`,
                    currencyCode: 'EUR'
                };
            }
        case _types.FieldMetadataType.FULL_NAME:
            {
                return {
                    firstName: faker.person.firstName(),
                    lastName: faker.person.lastName()
                };
            }
        case _types.FieldMetadataType.RATING:
            {
                return 'RATING_5';
            }
        case _types.FieldMetadataType.SELECT:
            {
                if (!(0, _utils.isDefined)(field.options) || !(0, _utils.isDefined)(field.options[0].value)) {
                    return null;
                }
                return field.options[0].value;
            }
        case _types.FieldMetadataType.MULTI_SELECT:
            {
                if (!(0, _utils.isDefined)(field.options) || !(0, _utils.isDefined)(field.options[0].value)) {
                    return [];
                }
                return [
                    field.options[0].value
                ];
            }
        case _types.FieldMetadataType.RELATION:
        case _types.FieldMetadataType.MORPH_RELATION:
            {
                return null;
            }
        case _types.FieldMetadataType.POSITION:
            {
                return 1;
            }
        case _types.FieldMetadataType.ADDRESS:
            {
                return {
                    addressStreet1: faker.location.streetAddress(),
                    addressStreet2: faker.location.secondaryAddress(),
                    addressCity: faker.location.city(),
                    addressState: faker.location.state(),
                    addressCountry: faker.location.country(),
                    addressPostcode: faker.location.zipCode(),
                    addressLat: faker.location.latitude(),
                    addressLng: faker.location.longitude()
                };
            }
        case _types.FieldMetadataType.RAW_JSON:
            {
                return {};
            }
        case _types.FieldMetadataType.RICH_TEXT:
            {
                return '';
            }
        case _types.FieldMetadataType.ACTOR:
            {
                return {
                    source: 'MANUAL',
                    name: faker.person.fullName(),
                    workspaceMemberId: null
                };
            }
        case _types.FieldMetadataType.ARRAY:
            {
                return [];
            }
        case _types.FieldMetadataType.FILES:
            {
                return null;
            }
        case _types.FieldMetadataType.TS_VECTOR:
            {
                throw new Error(`We should not generate fake version for ${field.type} field`);
            }
        default:
            {
                (0, _utils.assertUnreachable)(field.type, `Unsupported field type '${field.type}'`);
            }
    }
};

//# sourceMappingURL=generate-random-field-value.util.js.map