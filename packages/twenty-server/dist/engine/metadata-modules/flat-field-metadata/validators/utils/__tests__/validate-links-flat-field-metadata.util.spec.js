"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _types = require("twenty-shared/types");
const _validatelinksflatfieldmetadatautil = require("../validate-links-flat-field-metadata.util");
const createFlatEntityToValidate = (overrides = {})=>({
        type: _types.FieldMetadataType.LINKS,
        name: 'testLinksField',
        label: 'Test Links Field',
        universalSettings: {
            maxNumberOfValues: 1
        },
        ...overrides
    });
const callValidator = (flatEntityToValidate)=>(0, _validatelinksflatfieldmetadatautil.validateLinksFlatFieldMetadata)({
        flatEntityToValidate
    });
const stripUserFriendlyMessage = (errors)=>errors.map(({ userFriendlyMessage: _, ...rest })=>rest);
describe('validateLinksFlatFieldMetadata', ()=>{
    it('should return no errors for a links field with no variant set', ()=>{
        const errors = callValidator(createFlatEntityToValidate());
        expect(errors).toMatchInlineSnapshot('[]');
    });
    it('should return no errors for a domain-typed links field', ()=>{
        const errors = callValidator(createFlatEntityToValidate({
            universalSettings: {
                maxNumberOfValues: 1,
                type: 'domain'
            }
        }));
        expect(errors).toMatchInlineSnapshot('[]');
    });
    it('should return an error for a variant it does not know', ()=>{
        const errors = callValidator(createFlatEntityToValidate({
            universalSettings: {
                type: 'Domain'
            }
        }));
        expect(stripUserFriendlyMessage(errors)).toMatchInlineSnapshot(`
[
  {
    "code": "INVALID_FIELD_INPUT",
    "message": "Links field type must be one of url, domain",
  },
]
`);
    });
});

//# sourceMappingURL=validate-links-flat-field-metadata.util.spec.js.map