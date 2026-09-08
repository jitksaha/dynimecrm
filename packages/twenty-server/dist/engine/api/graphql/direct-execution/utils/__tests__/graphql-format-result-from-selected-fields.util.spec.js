"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _types = require("twenty-shared/types");
const _graphqlformatresultfromselectedfieldsutil = require("../graphql-format-result-from-selected-fields.util");
const PERSON_ID = 'person-object-id';
const PHONES_FIELD_ID = 'phones-field-id';
const flatObjectMetadataMaps = {
    universalIdentifierById: {
        [PERSON_ID]: PERSON_ID
    },
    byUniversalIdentifier: {
        [PERSON_ID]: {
            id: PERSON_ID,
            nameSingular: 'person',
            fieldIds: [
                PHONES_FIELD_ID
            ]
        }
    }
};
const flatFieldMetadataMaps = {
    universalIdentifierById: {
        [PHONES_FIELD_ID]: PHONES_FIELD_ID
    },
    byUniversalIdentifier: {
        [PHONES_FIELD_ID]: {
            id: PHONES_FIELD_ID,
            name: 'phones',
            type: _types.FieldMetadataType.PHONES
        }
    }
};
const formatPerson = (phones)=>(0, _graphqlformatresultfromselectedfieldsutil.graphQLFormatResultFromSelectedFields)({
        id: 'record-id',
        phones
    }, {
        phones: {
            primaryPhoneNumber: {},
            additionalPhones: {
                number: {},
                countryCode: {},
                __typename: {}
            }
        }
    }, 'person', {
        flatObjectMetadataMaps,
        flatFieldMetadataMaps,
        objectIdByNameSingular: {
            person: PERSON_ID
        },
        method: 'findOne'
    });
describe('graphQLFormatResultFromSelectedFields', ()=>{
    it('projects selected sub-fields of an object-typed composite sub-field', ()=>{
        expect(formatPerson({
            primaryPhoneNumber: '123456789',
            additionalPhones: [
                {
                    number: '987654321',
                    callingCode: '+33'
                }
            ]
        })).toStrictEqual({
            phones: {
                primaryPhoneNumber: '123456789',
                additionalPhones: [
                    {
                        number: '987654321',
                        countryCode: null,
                        __typename: 'AdditionalPhone'
                    }
                ]
            }
        });
    });
    it('passes through a composite sub-field value that is not an object list', ()=>{
        expect(formatPerson({
            primaryPhoneNumber: '123456789',
            additionalPhones: '[{"number":"987654321"}]'
        })).toStrictEqual({
            phones: {
                primaryPhoneNumber: '123456789',
                additionalPhones: '[{"number":"987654321"}]'
            }
        });
    });
});

//# sourceMappingURL=graphql-format-result-from-selected-fields.util.spec.js.map