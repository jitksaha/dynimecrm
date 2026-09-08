"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "ReconcileWorkspaceCustomRecordPageCommand", {
    enumerable: true,
    get: function() {
        return ReconcileWorkspaceCustomRecordPageCommand;
    }
});
const _typeorm = require("@nestjs/typeorm");
const _nestcommander = require("nest-commander");
const _application = require("twenty-shared/application");
const _utils = require("twenty-shared/utils");
const _typeorm1 = require("typeorm");
const _provisionedworkspacecommandrunner = require("../../command-runners/provisioned-workspace.command-runner");
const _workspaceiteratorservice = require("../../command-runners/workspace-iterator.service");
const _applyrecordpagereownupdatesutil = require("./utils/apply-record-page-reown-updates.util");
const _computerecordpagestackreownupdatesutil = require("./utils/compute-record-page-stack-reown-updates.util");
const _countrecordpagereownupdatesutil = require("./utils/count-record-page-reown-updates.util");
const _createemptyrecordpagereownupdatesutil = require("./utils/create-empty-record-page-reown-updates.util");
const _computerecordpagereconcileflatentitymapskeysutil = require("./utils/compute-record-page-reconcile-flat-entity-maps-keys.util");
const _applicationservice = require("../../../../engine/core-modules/application/application.service");
const _registeredworkspacecommanddecorator = require("../../../../engine/core-modules/upgrade/decorators/registered-workspace-command.decorator");
const _types = require("twenty-shared/types");
const _viewentity = require("../../../../engine/metadata-modules/view/entities/view.entity");
const _workspacecacheservice = require("../../../../engine/workspace-cache/services/workspace-cache.service");
const _workspacemigrationrunnerservice = require("../../../../engine/workspace-manager/workspace-migration/workspace-migration-runner/services/workspace-migration-runner.service");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
function _ts_param(paramIndex, decorator) {
    return function(target, key) {
        decorator(target, key, paramIndex);
    };
}
let ReconcileWorkspaceCustomRecordPageCommand = class ReconcileWorkspaceCustomRecordPageCommand extends _provisionedworkspacecommandrunner.ProvisionedWorkspaceCommandRunner {
    async runOnWorkspace({ workspaceId, options }) {
        const isDryRun = options.dryRun ?? false;
        const { flatViewMaps, flatViewFieldMaps, flatViewFieldGroupMaps, flatObjectMetadataMaps, flatFieldMetadataMaps, flatPageLayoutMaps, flatPageLayoutTabMaps, flatPageLayoutWidgetMaps } = await this.workspaceCacheService.getOrRecompute(workspaceId, [
            'flatViewMaps',
            'flatViewFieldMaps',
            'flatViewFieldGroupMaps',
            'flatObjectMetadataMaps',
            'flatFieldMetadataMaps',
            'flatPageLayoutMaps',
            'flatPageLayoutTabMaps',
            'flatPageLayoutWidgetMaps'
        ]);
        const { twentyStandardFlatApplication, workspaceCustomFlatApplication } = await this.applicationService.findWorkspaceTwentyStandardAndCustomApplicationOrThrow({
            workspaceId
        });
        const reownUpdates = this.computeReownUpdates({
            workspaceId,
            twentyStandardApplicationUniversalIdentifier: twentyStandardFlatApplication.universalIdentifier,
            workspaceCustomApplicationUniversalIdentifier: workspaceCustomFlatApplication.universalIdentifier,
            flatViewMaps,
            flatViewFieldMaps,
            flatViewFieldGroupMaps,
            flatObjectMetadataMaps,
            flatFieldMetadataMaps,
            flatPageLayoutMaps,
            flatPageLayoutTabMaps,
            flatPageLayoutWidgetMaps
        });
        const totalUpdateCount = (0, _countrecordpagereownupdatesutil.countRecordPageReownUpdates)(reownUpdates);
        if (totalUpdateCount === 0) {
            this.logger.log(`No workspace-custom record-page stack to reconcile for workspace ${workspaceId}`);
            return;
        }
        this.logger.log(`${isDryRun ? '[DRY RUN] ' : ''}Reconciling workspace-custom record-page stacks for workspace ${workspaceId} (${totalUpdateCount} row(s))`);
        if (isDryRun) {
            return;
        }
        await (0, _applyrecordpagereownupdatesutil.applyRecordPageReownUpdates)({
            manager: this.viewRepository.manager,
            workspaceId,
            reownUpdates
        });
        await this.workspaceMigrationRunnerService.invalidateCache({
            allFlatEntityMapsKeys: (0, _computerecordpagereconcileflatentitymapskeysutil.computeRecordPageReconcileFlatEntityMapsKeys)(),
            workspaceId
        });
        this.logger.log(`Reconciled workspace-custom record-page stacks for workspace ${workspaceId} (${totalUpdateCount} row(s))`);
    }
    computeReownUpdates({ workspaceId, twentyStandardApplicationUniversalIdentifier, workspaceCustomApplicationUniversalIdentifier, flatViewMaps, flatViewFieldMaps, flatViewFieldGroupMaps, flatObjectMetadataMaps, flatFieldMetadataMaps, flatPageLayoutMaps, flatPageLayoutTabMaps, flatPageLayoutWidgetMaps }) {
        const reownUpdates = (0, _createemptyrecordpagereownupdatesutil.createEmptyRecordPageReownUpdates)();
        const engineOwnedApplicationUniversalIdentifiers = new Set([
            twentyStandardApplicationUniversalIdentifier,
            workspaceCustomApplicationUniversalIdentifier
        ]);
        const candidatesByObjectUniversalIdentifier = new Map();
        for (const flatPageLayout of Object.values(flatPageLayoutMaps.byUniversalIdentifier)){
            if (!(0, _utils.isDefined)(flatPageLayout) || flatPageLayout.type !== _types.PageLayoutType.RECORD_PAGE || (0, _utils.isDefined)(flatPageLayout.deletedAt) || flatPageLayout.applicationUniversalIdentifier !== workspaceCustomApplicationUniversalIdentifier || !(0, _utils.isDefined)(flatPageLayout.objectMetadataUniversalIdentifier)) {
                continue;
            }
            const candidates = candidatesByObjectUniversalIdentifier.get(flatPageLayout.objectMetadataUniversalIdentifier) ?? [];
            candidates.push(flatPageLayout);
            candidatesByObjectUniversalIdentifier.set(flatPageLayout.objectMetadataUniversalIdentifier, candidates);
        }
        for (const [objectMetadataUniversalIdentifier, candidates] of candidatesByObjectUniversalIdentifier){
            const flatObjectMetadata = flatObjectMetadataMaps.byUniversalIdentifier[objectMetadataUniversalIdentifier];
            if (!(0, _utils.isDefined)(flatObjectMetadata)) {
                this.logger.warn(`Missing object for record-page layout(s) ${candidates.map((flatPageLayout)=>flatPageLayout.id).join(', ')} in workspace ${workspaceId}, skipping`);
                continue;
            }
            // Workspace-custom layouts on standard or app objects are caller
            // customs by definition (the system stack of those objects is owned by
            // their own application) and are never re-owned.
            if (flatObjectMetadata.applicationUniversalIdentifier !== workspaceCustomApplicationUniversalIdentifier) {
                continue;
            }
            const systemStackFlatPageLayout = this.resolveSystemStackFlatPageLayout({
                workspaceId,
                flatObjectMetadata,
                candidates
            });
            if (!(0, _utils.isDefined)(systemStackFlatPageLayout)) {
                continue;
            }
            const stackReownUpdates = (0, _computerecordpagestackreownupdatesutil.computeRecordPageStackReownUpdates)({
                workspaceId,
                logger: this.logger,
                flatObjectMetadata,
                flatPageLayout: systemStackFlatPageLayout,
                derivedPageLayoutUniversalIdentifier: (0, _application.getSystemRecordPageLayoutUniversalIdentifier)({
                    objectMetadataApplicationUniversalIdentifier: flatObjectMetadata.applicationUniversalIdentifier,
                    objectUniversalIdentifier: flatObjectMetadata.universalIdentifier
                }),
                engineOwnedApplicationUniversalIdentifiers,
                twentyStandardApplicationUniversalIdentifier,
                flatViewMaps,
                flatViewFieldMaps,
                flatViewFieldGroupMaps,
                flatFieldMetadataMaps,
                flatPageLayoutMaps,
                flatPageLayoutTabMaps,
                flatPageLayoutWidgetMaps
            });
            for (const key of Object.keys(stackReownUpdates)){
                reownUpdates[key].push(...stackReownUpdates[key]);
            }
        }
        return reownUpdates;
    }
    // The decision table: a single candidate is the system stack; among
    // several, a single isSystemSideEffect candidate wins (the engine wrote
    // that flag); anything still ambiguous is skipped, never scored.
    resolveSystemStackFlatPageLayout({ workspaceId, flatObjectMetadata, candidates }) {
        if (candidates.length === 1) {
            return candidates[0];
        }
        const flaggedCandidates = candidates.filter((flatPageLayout)=>flatPageLayout.isSystemSideEffect);
        if (flaggedCandidates.length === 1) {
            const systemStackFlatPageLayout = flaggedCandidates[0];
            for (const flatPageLayout of candidates){
                if (flatPageLayout.id === systemStackFlatPageLayout.id) {
                    continue;
                }
                this.logger.warn(`Record-page layout ${flatPageLayout.id} on object ${flatObjectMetadata.universalIdentifier} in workspace ${workspaceId} stays a caller custom, the system-flagged layout ${systemStackFlatPageLayout.id} is the system stack`);
            }
            return systemStackFlatPageLayout;
        }
        this.logger.warn(`Ambiguous record-page layouts ${candidates.map((flatPageLayout)=>flatPageLayout.id).join(', ')} on object ${flatObjectMetadata.universalIdentifier} in workspace ${workspaceId}, skipping object`);
        return undefined;
    }
    constructor(workspaceIteratorService, workspaceCacheService, workspaceMigrationRunnerService, applicationService, // eslint-disable-next-line twenty/prefer-workspace-scoped-repository
    viewRepository){
        super(workspaceIteratorService), this.workspaceIteratorService = workspaceIteratorService, this.workspaceCacheService = workspaceCacheService, this.workspaceMigrationRunnerService = workspaceMigrationRunnerService, this.applicationService = applicationService, this.viewRepository = viewRepository;
    }
};
ReconcileWorkspaceCustomRecordPageCommand = _ts_decorate([
    (0, _registeredworkspacecommanddecorator.RegisteredWorkspaceCommand)('2.31.0', 1786437481500),
    (0, _nestcommander.Command)({
        name: 'upgrade:2-31:reconcile-workspace-custom-record-page',
        description: 'Re-own the system record-page stack of every workspace-custom object onto the engine convention. Runs after reconcile-standard-record-page de-owned the 1-23-era stacks onto workspace-custom, so per custom object the workspace-custom RECORD_PAGE layouts are one homogeneous population: the system stack (1-23 backfill or the incremental createOneObject path, whose pre-2-15 rows are stuck at isSystemSideEffect false because the 2-15 column landed with default false and no backfill) plus, theoretically, API-created custom layouts. The system stack per object is resolved by a decision table, never by scoring: a single candidate is the system stack; among several, a single isSystemSideEffect candidate wins (the engine wrote that flag); anything still ambiguous is logged and skipped, the backfill command provisions the derived stack next and the untouched layouts keep working as caller customs. The winner stack (tabs, widgets, the FIELDS widget view plus the reserved FIELDS_WIDGET key backfill, its view fields keyed on the displayed field application) is re-owned onto the name-free derived scheme and flagged isSystemSideEffect. App-authored rows are left untouched, and derived identifiers already held by another row are skipped with a warning instead of aborting the transaction.'
    }),
    _ts_param(4, (0, _typeorm.InjectRepository)(_viewentity.ViewEntity)),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _workspaceiteratorservice.WorkspaceIteratorService === "undefined" ? Object : _workspaceiteratorservice.WorkspaceIteratorService,
        typeof _workspacecacheservice.WorkspaceCacheService === "undefined" ? Object : _workspacecacheservice.WorkspaceCacheService,
        typeof _workspacemigrationrunnerservice.WorkspaceMigrationRunnerService === "undefined" ? Object : _workspacemigrationrunnerservice.WorkspaceMigrationRunnerService,
        typeof _applicationservice.ApplicationService === "undefined" ? Object : _applicationservice.ApplicationService,
        typeof _typeorm1.Repository === "undefined" ? Object : _typeorm1.Repository
    ])
], ReconcileWorkspaceCustomRecordPageCommand);

//# sourceMappingURL=2-31-workspace-command-1786437481500-reconcile-workspace-custom-record-page.command.js.map