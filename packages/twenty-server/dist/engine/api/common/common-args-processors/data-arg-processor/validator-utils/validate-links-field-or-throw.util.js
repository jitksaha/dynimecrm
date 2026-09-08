"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "validateLinksFieldOrThrow", {
    enumerable: true,
    get: function() {
        return validateLinksFieldOrThrow;
    }
});
const _guards = require("@sniptt/guards");
const _utils = require("twenty-shared/utils");
const _parseadditionalitemsutil = require("../../../../graphql/graphql-query-runner/utils/parse-additional-items.util");
const _validaterawjsonfieldorthrowutil = require("./validate-raw-json-field-or-throw.util");
const _validatetextfieldorthrowutil = require("./validate-text-field-or-throw.util");
const _commonqueryrunnerexception = require("../../../common-query-runners/errors/common-query-runner.exception");
const assertDomainOrThrow = (value, fieldName)=>{
    if (!(0, _guards.isNonEmptyString)(value)) {
        return;
    }
    if (!(0, _utils.isValidDomain)(value)) {
        throw new _commonqueryrunnerexception.CommonQueryRunnerException(`"${value}" is not a domain name, for domain-typed links field "${fieldName}"`, _commonqueryrunnerexception.CommonQueryRunnerExceptionCode.INVALID_ARGS_DATA, {
            userFriendlyMessage: /*i18n*/ {
                id: "Zm9s4F",
                message: "Please enter a domain name, like twenty.com"
            }
        });
    }
};
const validateLinksFieldOrThrow = ({ value, fieldName, linksVariant })=>{
    const preValidatedValue = (0, _validaterawjsonfieldorthrowutil.validateRawJsonFieldOrThrow)(value, fieldName);
    if ((0, _guards.isNull)(preValidatedValue)) return null;
    const isDomainField = linksVariant === 'domain';
    for (const [subField, subFieldValue] of Object.entries(preValidatedValue)){
        switch(subField){
            case 'primaryLinkUrl':
                (0, _validatetextfieldorthrowutil.validateTextFieldOrThrow)(subFieldValue, `${fieldName}.${subField}`);
                if (isDomainField) {
                    assertDomainOrThrow(subFieldValue, `${fieldName}.${subField}`);
                }
                break;
            case 'primaryLinkLabel':
                (0, _validatetextfieldorthrowutil.validateTextFieldOrThrow)(subFieldValue, `${fieldName}.${subField}`);
                break;
            case 'secondaryLinks':
                (0, _validaterawjsonfieldorthrowutil.validateRawJsonFieldOrThrow)(subFieldValue, `${fieldName}.${subField}`);
                if (isDomainField) {
                    for (const link of (0, _parseadditionalitemsutil.parseArrayOrJsonStringToArray)(subFieldValue)){
                        assertDomainOrThrow(link.url, `${fieldName}.${subField}`);
                    }
                }
                break;
            default:
                throw new _commonqueryrunnerexception.CommonQueryRunnerException(`Invalid subfield ${subField} for links field "${fieldName}"`, _commonqueryrunnerexception.CommonQueryRunnerExceptionCode.INVALID_ARGS_DATA, {
                    userFriendlyMessage: /*i18n*/ {
                        id: "GFYy9y",
                        message: "Invalid value for links."
                    }
                });
        }
    }
    return value;
};

//# sourceMappingURL=validate-links-field-or-throw.util.js.map