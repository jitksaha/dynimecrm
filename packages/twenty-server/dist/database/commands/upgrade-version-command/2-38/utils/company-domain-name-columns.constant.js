"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "COMPANY_DOMAIN_NAME_COLUMNS", {
    enumerable: true,
    get: function() {
        return COMPANY_DOMAIN_NAME_COLUMNS;
    }
});
const _types = require("twenty-shared/types");
const _computecolumnnameutil = require("../../../../../engine/metadata-modules/field-metadata/utils/compute-column-name.util");
const DOMAIN_NAME_FIELD_NAME = 'domainName';
const compositeProperty = (name)=>{
    const property = _types.linksCompositeType.properties.find((candidate)=>candidate.name === name);
    if (!property) {
        throw new Error(`Links composite type has no ${name} property`);
    }
    return property;
};
const COMPANY_DOMAIN_NAME_COLUMNS = {
    primaryLinkUrl: (0, _computecolumnnameutil.computeCompositeColumnName)(DOMAIN_NAME_FIELD_NAME, compositeProperty('primaryLinkUrl')),
    secondaryLinks: (0, _computecolumnnameutil.computeCompositeColumnName)(DOMAIN_NAME_FIELD_NAME, compositeProperty('secondaryLinks'))
};

//# sourceMappingURL=company-domain-name-columns.constant.js.map