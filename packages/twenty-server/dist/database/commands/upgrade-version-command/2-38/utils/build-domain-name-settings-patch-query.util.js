"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "buildDomainNameSettingsPatchQuery", {
    enumerable: true,
    get: function() {
        return buildDomainNameSettingsPatchQuery;
    }
});
const _metadata = require("twenty-shared/metadata");
const buildDomainNameSettingsPatchQuery = (workspaceId)=>({
        sql: `
UPDATE "core"."fieldMetadata"
SET "settings" = COALESCE("settings", '{}'::jsonb) || jsonb_build_object('type', 'domain')
WHERE "workspaceId" = $1
  AND "universalIdentifier" = $2::uuid
  AND COALESCE("settings" ->> 'type', '') <> 'domain'
`,
        parameters: [
            workspaceId,
            _metadata.STANDARD_OBJECT_FIELDS.company.domainName.universalIdentifier
        ]
    });

//# sourceMappingURL=build-domain-name-settings-patch-query.util.js.map