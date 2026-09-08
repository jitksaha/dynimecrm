"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "buildCompanyDomainNameUpdateQuery", {
    enumerable: true,
    get: function() {
        return buildCompanyDomainNameUpdateQuery;
    }
});
const _utils = require("twenty-shared/utils");
const _companydomainnamecolumnsconstant = require("./company-domain-name-columns.constant");
const buildCompanyDomainNameUpdateQuery = ({ schemaName, updates })=>({
        sql: `
UPDATE "${schemaName}"."company" company
SET
  "${_companydomainnamecolumnsconstant.COMPANY_DOMAIN_NAME_COLUMNS.primaryLinkUrl}" = source."primaryLinkUrl",
  "${_companydomainnamecolumnsconstant.COMPANY_DOMAIN_NAME_COLUMNS.secondaryLinks}" = source."secondaryLinks"
FROM unnest($1::uuid[], $2::text[], $3::jsonb[])
  AS source("id", "primaryLinkUrl", "secondaryLinks")
WHERE company."id" = source."id"
`,
        parameters: [
            updates.map(({ id })=>id),
            updates.map(({ domainName })=>domainName.primaryLinkUrl),
            updates.map(({ domainName })=>(0, _utils.isDefined)(domainName.secondaryLinks) ? JSON.stringify(domainName.secondaryLinks) : null)
        ]
    });

//# sourceMappingURL=build-company-domain-name-update-query.util.js.map