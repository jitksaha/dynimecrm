"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "DemoteAndBackfillApplicationIndexViewCommand", {
    enumerable: true,
    get: function() {
        return DemoteAndBackfillApplicationIndexViewCommand;
    }
});
const _typeorm = require("@nestjs/typeorm");
const _nestcommander = require("nest-commander");
const _application = require("twenty-shared/application");
const _types = require("twenty-shared/types");
const _utils = require("twenty-shared/utils");
const _typeorm1 = require("typeorm");
const _provisionedworkspacecommandrunner = require("../../command-runners/provisioned-workspace.command-runner");
const _workspaceiteratorservice = require("../../command-runners/workspace-iterator.service");
const _invalidateindexviewreconcilecacheutil = require("./utils/invalidate-index-view-reconcile-cache.util");
const _applicationservice = require("../../../../engine/core-modules/application/application.service");
const _registeredworkspacecommanddecorator = require("../../../../engine/core-modules/upgrade/decorators/registered-workspace-command.decorator");
const _defaultviewfieldsizeconstant = require("../../../../engine/metadata-modules/flat-view-field/constants/default-view-field-size.constant");
const _computesystemviewtocreateutil = require("../../../../engine/metadata-modules/metadata-side-effect/handlers/utils/compute-system-view-to-create.util");
const _isflatfieldmetadatadisplayableindefaultviewutil = require("../../../../engine/metadata-modules/object-metadata/utils/is-flat-field-metadata-displayable-in-default-view.util");
const _orderflatfieldmetadatasforsystemindexviewutil = require("../../../../engine/metadata-modules/object-metadata/utils/order-flat-field-metadatas-for-system-index-view.util");
const _viewentity = require("../../../../engine/metadata-modules/view/entities/view.entity");
const _workspacecacheservice = require("../../../../engine/workspace-cache/services/workspace-cache.service");
const _workspacemigrationvalidatebuildandrunservice = require("../../../../engine/workspace-manager/workspace-migration/services/workspace-migration-validate-build-and-run-service");
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
let DemoteAndBackfillApplicationIndexViewCommand = class DemoteAndBackfillApplicationIndexViewCommand extends _provisionedworkspacecommandrunner.ProvisionedWorkspaceCommandRunner {
    async runOnWorkspace({ workspaceId, options }) {
        const isDryRun = options.dryRun ?? false;
        const { flatViewMaps, flatViewFieldMaps, flatObjectMetadataMaps, flatFieldMetadataMaps } = await this.workspaceCacheService.getOrRecompute(workspaceId, [
            'flatViewMaps',
            'flatViewFieldMaps',
            'flatObjectMetadataMaps',
            'flatFieldMetadataMaps'
        ]);
        const { twentyStandardFlatApplication, workspaceCustomFlatApplication } = await this.applicationService.findWorkspaceTwentyStandardAndCustomApplicationOrThrow({
            workspaceId
        });
        const engineOwnedApplicationUniversalIdentifiers = new Set([
            twentyStandardFlatApplication.universalIdentifier,
            workspaceCustomFlatApplication.universalIdentifier
        ]);
        const viewIdsToDemote = [];
        const objectUniversalIdentifiersWithEngineIndexView = new Set();
        for (const flatView of Object.values(flatViewMaps.byUniversalIdentifier)){
            if (!(0, _utils.isDefined)(flatView) || flatView.key !== _types.ViewKey.INDEX || (0, _utils.isDefined)(flatView.deletedAt) || engineOwnedApplicationUniversalIdentifiers.has(flatView.applicationUniversalIdentifier)) {
                continue;
            }
            if (flatView.isSystemSideEffect === true) {
                objectUniversalIdentifiersWithEngineIndexView.add(flatView.objectMetadataUniversalIdentifier);
                continue;
            }
            viewIdsToDemote.push(flatView.id);
        }
        const backfillOperationsByApplication = this.computeBackfillOperationsByApplication({
            flatViewFieldMaps,
            flatObjectMetadataMaps,
            flatFieldMetadataMaps,
            engineOwnedApplicationUniversalIdentifiers,
            objectUniversalIdentifiersWithEngineIndexView
        });
        const { backfillViewCount, backfillViewFieldCount } = [
            ...backfillOperationsByApplication.values()
        ].reduce((counts, { viewsToCreate, viewFieldsToCreate })=>({
                backfillViewCount: counts.backfillViewCount + viewsToCreate.length,
                backfillViewFieldCount: counts.backfillViewFieldCount + viewFieldsToCreate.length
            }), {
            backfillViewCount: 0,
            backfillViewFieldCount: 0
        });
        if (viewIdsToDemote.length === 0 && backfillViewCount === 0 && backfillViewFieldCount === 0) {
            this.logger.log(`No application INDEX view to demote or backfill for workspace ${workspaceId}`);
            return;
        }
        this.logger.log(`${isDryRun ? '[DRY RUN] ' : ''}Demoting ${viewIdsToDemote.length} application INDEX view(s) and backfilling ${backfillViewCount} engine INDEX view(s) with ${backfillViewFieldCount} view field(s) for workspace ${workspaceId}`);
        if (isDryRun) {
            return;
        }
        if (viewIdsToDemote.length > 0) {
            // Single bulk statement, atomic on its own: every row gets the same
            // patch.
            await this.viewRepository.update({
                id: (0, _typeorm1.In)(viewIdsToDemote),
                workspaceId
            }, {
                key: null
            });
            await (0, _invalidateindexviewreconcilecacheutil.invalidateIndexViewReconcileCache)({
                workspaceId,
                workspaceMigrationRunnerService: this.workspaceMigrationRunnerService
            });
        }
        await this.runBackfillMigrations({
            workspaceId,
            backfillOperationsByApplication
        });
        this.logger.log(`Demoted ${viewIdsToDemote.length} application INDEX view(s) and backfilled ${backfillViewCount} engine INDEX view(s) with ${backfillViewFieldCount} view field(s) for workspace ${workspaceId}`);
    }
    computeBackfillOperationsByApplication({ flatViewFieldMaps, flatObjectMetadataMaps, flatFieldMetadataMaps, engineOwnedApplicationUniversalIdentifiers, objectUniversalIdentifiersWithEngineIndexView }) {
        const backfillOperationsByApplication = new Map();
        const getApplicationBucket = (applicationUniversalIdentifier)=>{
            const existingBucket = backfillOperationsByApplication.get(applicationUniversalIdentifier);
            if ((0, _utils.isDefined)(existingBucket)) {
                return existingBucket;
            }
            const newBucket = {
                viewsToCreate: [],
                viewFieldsToCreate: []
            };
            backfillOperationsByApplication.set(applicationUniversalIdentifier, newBucket);
            return newBucket;
        };
        for (const flatObjectMetadata of Object.values(flatObjectMetadataMaps.byUniversalIdentifier)){
            if (!(0, _utils.isDefined)(flatObjectMetadata) || engineOwnedApplicationUniversalIdentifiers.has(flatObjectMetadata.applicationUniversalIdentifier)) {
                continue;
            }
            const indexViewUniversalIdentifier = (0, _application.getSystemViewUniversalIdentifier)({
                objectMetadataApplicationUniversalIdentifier: flatObjectMetadata.applicationUniversalIdentifier,
                objectUniversalIdentifier: flatObjectMetadata.universalIdentifier,
                viewKey: _application.SYSTEM_VIEW_KEYS.INDEX
            });
            if (!objectUniversalIdentifiersWithEngineIndexView.has(flatObjectMetadata.universalIdentifier)) {
                // computeSystemViewToCreate derives the same universal identifier.
                getApplicationBucket(flatObjectMetadata.applicationUniversalIdentifier).viewsToCreate.push((0, _computesystemviewtocreateutil.computeSystemViewToCreate)({
                    objectMetadata: flatObjectMetadata,
                    applicationUniversalIdentifier: flatObjectMetadata.applicationUniversalIdentifier,
                    viewKey: _application.SYSTEM_VIEW_KEYS.INDEX
                }));
            }
            const { labelIdentifierFieldMetadataUniversalIdentifier } = flatObjectMetadata;
            const displayableFlatFieldMetadatas = flatObjectMetadata.fieldUniversalIdentifiers.map((fieldUniversalIdentifier)=>flatFieldMetadataMaps.byUniversalIdentifier[fieldUniversalIdentifier]).filter(_utils.isDefined).filter((flatFieldMetadata)=>(0, _isflatfieldmetadatadisplayableindefaultviewutil.isFlatFieldMetadataDisplayableInDefaultView)({
                    flatFieldMetadata,
                    labelIdentifierFieldMetadataUniversalIdentifier
                }));
            // The label identifier view field must be strictly lowest and visible.
            const orderedDisplayableFlatFieldMetadatas = (0, _orderflatfieldmetadatasforsystemindexviewutil.orderFlatFieldMetadatasForSystemIndexView)({
                labelIdentifierFieldMetadataUniversalIdentifier,
                flatFieldMetadatas: displayableFlatFieldMetadatas
            });
            const createdAt = new Date().toISOString();
            orderedDisplayableFlatFieldMetadatas.forEach((flatFieldMetadata, position)=>{
                const fieldApplicationUniversalIdentifier = flatFieldMetadata.applicationUniversalIdentifier;
                const viewFieldUniversalIdentifier = (0, _application.getSystemViewFieldUniversalIdentifier)({
                    fieldMetadataApplicationUniversalIdentifier: fieldApplicationUniversalIdentifier,
                    viewUniversalIdentifier: indexViewUniversalIdentifier,
                    fieldMetadataUniversalIdentifier: flatFieldMetadata.universalIdentifier
                });
                // Already backfilled by a previous (partially failed) run.
                if ((0, _utils.isDefined)(flatViewFieldMaps.byUniversalIdentifier[viewFieldUniversalIdentifier])) {
                    return;
                }
                getApplicationBucket(fieldApplicationUniversalIdentifier).viewFieldsToCreate.push({
                    universalIdentifier: viewFieldUniversalIdentifier,
                    applicationUniversalIdentifier: fieldApplicationUniversalIdentifier,
                    fieldMetadataUniversalIdentifier: flatFieldMetadata.universalIdentifier,
                    viewUniversalIdentifier: indexViewUniversalIdentifier,
                    viewFieldGroupUniversalIdentifier: null,
                    isVisible: true,
                    size: _defaultviewfieldsizeconstant.DEFAULT_VIEW_FIELD_SIZE,
                    position,
                    aggregateOperation: null,
                    isActive: true,
                    isSystemSideEffect: true,
                    universalOverrides: null,
                    createdAt,
                    updatedAt: createdAt,
                    deletedAt: null
                });
            });
        }
        return backfillOperationsByApplication;
    }
    async runBackfillMigrations({ workspaceId, backfillOperationsByApplication }) {
        for (const [applicationUniversalIdentifier, { viewsToCreate }] of backfillOperationsByApplication.entries()){
            if (viewsToCreate.length === 0) {
                continue;
            }
            await this.runBackfillMigration({
                workspaceId,
                applicationUniversalIdentifier,
                allFlatEntityOperationByMetadataName: {
                    view: {
                        flatEntityToCreate: viewsToCreate,
                        flatEntityToDelete: [],
                        flatEntityToUpdate: []
                    }
                }
            });
        }
        for (const [applicationUniversalIdentifier, { viewFieldsToCreate }] of backfillOperationsByApplication.entries()){
            if (viewFieldsToCreate.length === 0) {
                continue;
            }
            await this.runBackfillMigration({
                workspaceId,
                applicationUniversalIdentifier,
                allFlatEntityOperationByMetadataName: {
                    viewField: {
                        flatEntityToCreate: viewFieldsToCreate,
                        flatEntityToDelete: [],
                        flatEntityToUpdate: []
                    }
                }
            });
        }
    }
    async runBackfillMigration({ workspaceId, applicationUniversalIdentifier, allFlatEntityOperationByMetadataName }) {
        const result = await this.workspaceMigrationValidateBuildAndRunService.validateBuildAndRunLegacyWorkspaceMigration({
            isSystemBuild: true,
            workspaceId,
            applicationUniversalIdentifier,
            allFlatEntityOperationByMetadataName: allFlatEntityOperationByMetadataName
        });
        if (result.status === 'fail') {
            this.logger.error(`Failed to backfill engine INDEX view(s) for application ${applicationUniversalIdentifier} in workspace ${workspaceId}:\n${JSON.stringify(result, null, 2)}`);
            throw new Error(`Failed to backfill engine INDEX view(s) for workspace ${workspaceId}`);
        }
    }
    constructor(workspaceIteratorService, workspaceCacheService, workspaceMigrationRunnerService, applicationService, workspaceMigrationValidateBuildAndRunService, // eslint-disable-next-line twenty/prefer-workspace-scoped-repository
    viewRepository){
        super(workspaceIteratorService), this.workspaceIteratorService = workspaceIteratorService, this.workspaceCacheService = workspaceCacheService, this.workspaceMigrationRunnerService = workspaceMigrationRunnerService, this.applicationService = applicationService, this.workspaceMigrationValidateBuildAndRunService = workspaceMigrationValidateBuildAndRunService, this.viewRepository = viewRepository;
    }
};
DemoteAndBackfillApplicationIndexViewCommand = _ts_decorate([
    (0, _registeredworkspacecommanddecorator.RegisteredWorkspaceCommand)('2.26.0', 1785255690000),
    (0, _nestcommander.Command)({
        name: 'upgrade:2-26:demote-and-backfill-application-index-view',
        description: 'Manifest-installed applications never had their INDEX view auto-provisioned: the ones that declared a view with ViewKey.INDEX authored it themselves under a manifest identifier. The engine is now the sole owner of the INDEX key, so every caller-authored (isSystemSideEffect: false) INDEX view owned by an application other than twenty-standard and workspace-custom is demoted to key: null — it becomes a plain additional view under its manifest identifier, and the flat view validator rejects caller-provided INDEX keys so a later app sync cannot promote it back. Every application object left without an engine-owned INDEX view then gets one backfilled through the workspace migration pipeline with its full view-field layout, converging upgraded installs with fresh installs. Views are committed before view fields across all applications because a view field belongs to the application owning its field, which can differ from the application owning the object (fields can be created on another application object). The backfill runs through the legacy pipeline path (no side-effect expansion: it replays a state the engine convention already defines) and is idempotent and retry-safe: engine-owned INDEX views are neither demoted nor re-backfilled, and view creation and view-field creation are gated independently, so a retry after a partial failure still backfills the missing view fields of an already-committed view.'
    }),
    _ts_param(5, (0, _typeorm.InjectRepository)(_viewentity.ViewEntity)),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _workspaceiteratorservice.WorkspaceIteratorService === "undefined" ? Object : _workspaceiteratorservice.WorkspaceIteratorService,
        typeof _workspacecacheservice.WorkspaceCacheService === "undefined" ? Object : _workspacecacheservice.WorkspaceCacheService,
        typeof _workspacemigrationrunnerservice.WorkspaceMigrationRunnerService === "undefined" ? Object : _workspacemigrationrunnerservice.WorkspaceMigrationRunnerService,
        typeof _applicationservice.ApplicationService === "undefined" ? Object : _applicationservice.ApplicationService,
        typeof _workspacemigrationvalidatebuildandrunservice.WorkspaceMigrationValidateBuildAndRunService === "undefined" ? Object : _workspacemigrationvalidatebuildandrunservice.WorkspaceMigrationValidateBuildAndRunService,
        typeof _typeorm1.Repository === "undefined" ? Object : _typeorm1.Repository
    ])
], DemoteAndBackfillApplicationIndexViewCommand);

//# sourceMappingURL=2-26-workspace-command-1785255690000-demote-and-backfill-application-index-view.command.js.map