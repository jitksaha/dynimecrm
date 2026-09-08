"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "validateLinksFlatFieldMetadata", {
    enumerable: true,
    get: function() {
        return validateLinksFlatFieldMetadata;
    }
});
const _types = require("twenty-shared/types");
const _utils = require("twenty-shared/utils");
const _fieldmetadataexception = require("../../../field-metadata/field-metadata.exception");
const validateLinksFlatFieldMetadata = ({ flatEntityToValidate })=>{
    const variant = flatEntityToValidate?.universalSettings?.type;
    if ((0, _utils.isDefined)(variant) && !_types.FIELD_LINKS_VARIANTS.includes(variant)) {
        return [
            {
                code: _fieldmetadataexception.FieldMetadataExceptionCode.INVALID_FIELD_INPUT,
                message: `Links field type must be one of ${_types.FIELD_LINKS_VARIANTS.join(', ')}`,
                userFriendlyMessage: /*i18n*/ {
                    id: "4yWmVP",
                    message: "Links field type must be either a url or a domain"
                }
            }
        ];
    }
    return [];
};

//# sourceMappingURL=validate-links-flat-field-metadata.util.js.map