"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "buildNonCanonicalDomainNameCondition", {
    enumerable: true,
    get: function() {
        return buildNonCanonicalDomainNameCondition;
    }
});
const _companydomainnamecolumnsconstant = require("./company-domain-name-columns.constant");
const nonCanonicalDomain = (expression)=>`(
    ${expression} <> lower(${expression})
    OR ${expression} ~ '[:/?#@]|\\s|[^[:ascii:]]'
    OR ${expression} LIKE 'www.%'
    OR ${expression} LIKE '%.'
  )`;
const buildNonCanonicalDomainNameCondition = (alias)=>{
    const primaryLinkUrl = `"${alias}"."${_companydomainnamecolumnsconstant.COMPANY_DOMAIN_NAME_COLUMNS.primaryLinkUrl}"`;
    const secondaryLinks = `"${alias}"."${_companydomainnamecolumnsconstant.COMPANY_DOMAIN_NAME_COLUMNS.secondaryLinks}"`;
    return `(
  ${nonCanonicalDomain(primaryLinkUrl)}
  OR (
    jsonb_typeof(${secondaryLinks}) = 'array'
    AND EXISTS (
      SELECT 1
      FROM jsonb_array_elements(${secondaryLinks}) AS link
      WHERE link->>'url' IS NOT NULL AND ${nonCanonicalDomain(`link->>'url'`)}
    )
  )
)`;
};

//# sourceMappingURL=build-non-canonical-domain-name-condition.util.js.map