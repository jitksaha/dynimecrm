"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "NormalizeCompanyDomainNamesCommand", {
    enumerable: true,
    get: function() {
        return NormalizeCompanyDomainNamesCommand;
    }
});
const _nestcommander = require("nest-commander");
const _utils = require("twenty-shared/utils");
const _provisionedworkspacecommandrunner = require("../../command-runners/provisioned-workspace.command-runner");
const _workspaceiteratorservice = require("../../command-runners/workspace-iterator.service");
const _buildcompanydomainnamecandidatesqueryutil = require("./utils/build-company-domain-name-candidates-query.util");
const _buildcompanydomainnameupdatequeryutil = require("./utils/build-company-domain-name-update-query.util");
const _builddomainnamesettingspatchqueryutil = require("./utils/build-domain-name-settings-patch-query.util");
const _computecompanydomainnamerewritesutil = require("./utils/compute-company-domain-name-rewrites.util");
const _partitioncompanydomainnamerewritesutil = require("./utils/partition-company-domain-name-rewrites.util");
const _registeredworkspacecommanddecorator = require("../../../../engine/core-modules/upgrade/decorators/registered-workspace-command.decorator");
const _workspacecacheservice = require("../../../../engine/workspace-cache/services/workspace-cache.service");
const _getworkspaceschemanameutil = require("../../../../engine/workspace-datasource/utils/get-workspace-schema-name.util");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
const BACKFILL_BATCH_SIZE = 20000;
const FIRST_COMPANY_ID = '00000000-0000-0000-0000-000000000000';
let NormalizeCompanyDomainNamesCommand = class NormalizeCompanyDomainNamesCommand extends _provisionedworkspacecommandrunner.ProvisionedWorkspaceCommandRunner {
    async runOnWorkspace({ workspaceId, options, dataSource }) {
        if (!(0, _utils.isDefined)(dataSource)) {
            return;
        }
        const isDryRun = options.dryRun ?? false;
        const schemaName = (0, _getworkspaceschemanameutil.getWorkspaceSchemaName)(workspaceId);
        const hasCompanyTable = await this.hasCompanyTable({
            dataSource,
            schemaName
        });
        if (!hasCompanyTable) {
            return;
        }
        await this.markDomainNameFieldAsDomainTyped({
            dataSource,
            workspaceId,
            isDryRun
        });
        let afterCompanyId = FIRST_COMPANY_ID;
        let updatedCount = 0;
        const skippedCompanyIds = [];
        for(;;){
            const candidates = await this.findNextCandidates({
                dataSource,
                schemaName,
                afterCompanyId
            });
            if (candidates.length === 0) {
                break;
            }
            afterCompanyId = candidates[candidates.length - 1].id;
            const rewrites = (0, _computecompanydomainnamerewritesutil.computeCompanyDomainNameRewrites)(candidates);
            const { updates, skippedCompanyIds: skippedInBatch } = (0, _partitioncompanydomainnamerewritesutil.partitionCompanyDomainNameRewrites)({
                rewrites,
                claimedPrimaryLinkUrls: await this.findClaimedPrimaryLinkUrls({
                    dataSource,
                    schemaName,
                    rewrites
                })
            });
            skippedCompanyIds.push(...skippedInBatch);
            updatedCount += updates.length;
            if (updates.length > 0 && !isDryRun) {
                const updateQuery = (0, _buildcompanydomainnameupdatequeryutil.buildCompanyDomainNameUpdateQuery)({
                    schemaName,
                    updates
                });
                await dataSource.query(updateQuery.sql, updateQuery.parameters);
            }
            if (candidates.length < BACKFILL_BATCH_SIZE) {
                break;
            }
        }
        if (updatedCount === 0 && skippedCompanyIds.length === 0) {
            return;
        }
        this.logger.log(`${isDryRun ? '[DRY RUN] ' : ''}Normalized ${updatedCount} company domain name(s) for workspace ${workspaceId}`);
        if (skippedCompanyIds.length > 0) {
            this.logger.warn(`Left ${skippedCompanyIds.length} company domain name(s) unnormalized in workspace ${workspaceId} because another company already holds the normalized domain, these need a merge: ${skippedCompanyIds.join(', ')}`);
        }
    }
    async markDomainNameFieldAsDomainTyped({ dataSource, workspaceId, isDryRun }) {
        if (isDryRun) {
            return;
        }
        const { sql, parameters } = (0, _builddomainnamesettingspatchqueryutil.buildDomainNameSettingsPatchQuery)(workspaceId);
        const [, patchedFieldCount] = await dataSource.query(sql, parameters);
        if (patchedFieldCount === 0) {
            return;
        }
        await this.workspaceCacheService.invalidateAndRecompute(workspaceId, [
            'flatFieldMetadataMaps'
        ]);
    }
    async hasCompanyTable({ dataSource, schemaName }) {
        const [row] = await dataSource.query(`SELECT to_regclass($1) IS NOT NULL AS "exists"`, [
            `"${schemaName}"."company"`
        ]);
        return row?.exists === true;
    }
    async findNextCandidates({ dataSource, schemaName, afterCompanyId }) {
        const { sql, parameters } = (0, _buildcompanydomainnamecandidatesqueryutil.buildCompanyDomainNameCandidatesQuery)({
            schemaName,
            batchSize: BACKFILL_BATCH_SIZE,
            afterCompanyId
        });
        const rows = await dataSource.query(sql, parameters);
        return rows.map(({ id, ...domainName })=>({
                id,
                domainName
            }));
    }
    async findClaimedPrimaryLinkUrls({ dataSource, schemaName, rewrites }) {
        const desiredPrimaryLinkUrls = rewrites.map(({ domainName })=>domainName.primaryLinkUrl);
        if (desiredPrimaryLinkUrls.length === 0) {
            return new Set();
        }
        const rows = await dataSource.query(`
SELECT company."domainNamePrimaryLinkUrl"
FROM "${schemaName}"."company" company
WHERE company."domainNamePrimaryLinkUrl" = ANY($1::text[])
  AND company."id" <> ALL($2::uuid[])
`, [
            desiredPrimaryLinkUrls,
            rewrites.map(({ id })=>id)
        ]);
        return new Set(rows.map(({ domainNamePrimaryLinkUrl })=>domainNamePrimaryLinkUrl));
    }
    constructor(workspaceIteratorService, workspaceCacheService){
        super(workspaceIteratorService), this.workspaceIteratorService = workspaceIteratorService, this.workspaceCacheService = workspaceCacheService;
    }
};
NormalizeCompanyDomainNamesCommand = _ts_decorate([
    (0, _registeredworkspacecommanddecorator.RegisteredWorkspaceCommand)('2.38.0', 1787935130000),
    (0, _nestcommander.Command)({
        name: 'upgrade:2-38:normalize-company-domain-names',
        description: 'Rewrite company domain names to the bare canonical domain now written by the domain-typed LINKS field, so contact auto-creation matches them exactly'
    }),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _workspaceiteratorservice.WorkspaceIteratorService === "undefined" ? Object : _workspaceiteratorservice.WorkspaceIteratorService,
        typeof _workspacecacheservice.WorkspaceCacheService === "undefined" ? Object : _workspacecacheservice.WorkspaceCacheService
    ])
], NormalizeCompanyDomainNamesCommand);

//# sourceMappingURL=2-38-workspace-command-1787935130000-normalize-company-domain-names.command.js.map