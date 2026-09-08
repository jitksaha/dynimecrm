"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "buildCompanyDomainNameCandidatesQuery", {
    enumerable: true,
    get: function() {
        return buildCompanyDomainNameCandidatesQuery;
    }
});
const _buildnoncanonicaldomainnameconditionutil = require("./build-non-canonical-domain-name-condition.util");
const _companydomainnamecolumnsconstant = require("./company-domain-name-columns.constant");
const buildCompanyDomainNameCandidatesQuery = ({ schemaName, batchSize, afterCompanyId })=>({
        sql: `
SELECT
  company."id" AS "id",
  company."${_companydomainnamecolumnsconstant.COMPANY_DOMAIN_NAME_COLUMNS.primaryLinkUrl}" AS "primaryLinkUrl",
  company."${_companydomainnamecolumnsconstant.COMPANY_DOMAIN_NAME_COLUMNS.secondaryLinks}" AS "secondaryLinks"
FROM "${schemaName}"."company" company
WHERE company."id" > $1
  AND ${(0, _buildnoncanonicaldomainnameconditionutil.buildNonCanonicalDomainNameCondition)('company')}
ORDER BY company."id"
LIMIT $2
`,
        parameters: [
            afterCompanyId,
            batchSize
        ]
    });

//# sourceMappingURL=build-company-domain-name-candidates-query.util.js.map