"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "BackfillRecordPageCommand", {
    enumerable: true,
    get: function() {
        return BackfillRecordPageCommand;
    }
});
const _nestcommander = require("nest-commander");
const _application = require("twenty-shared/application");
const _utils = require("twenty-shared/utils");
const _provisionedworkspacecommandrunner = require("../../command-runners/provisioned-workspace.command-runner");
const _workspaceiteratorservice = require("../../command-runners/workspace-iterator.service");
const _applicationservice = require("../../../../engine/core-modules/application/application.service");
const _registeredworkspacecommanddecorator = require("../../../../engine/core-modules/upgrade/decorators/registered-workspace-command.decorator");
const _computesystemrecordpagelayouttocreateutil = require("../../../../engine/metadata-modules/metadata-side-effect/handlers/utils/compute-system-record-page-layout-to-create.util");
const _computesystemviewtocreateutil = require("../../../../engine/metadata-modules/metadata-side-effect/handlers/utils/compute-system-view-to-create.util");
const _computesystemviewfieldstocreateutil = require("../../../../engine/metadata-modules/metadata-side-effect/handlers/utils/compute-system-view-fields-to-create.util");
const _widgetconfigurationtypetype = require("../../../../engine/metadata-modules/page-layout-widget/enums/widget-configuration-type.type");
const _workspacecacheservice = require("../../../../engine/workspace-cache/services/workspace-cache.service");
const _twentystandardapplicationallflatentitymapsconstant = require("../../../../engine/workspace-manager/twenty-standard-application/utils/twenty-standard-application-all-flat-entity-maps.constant");
const _workspacemigrationvalidatebuildandrunservice = require("../../../../engine/workspace-manager/workspace-migration/services/workspace-migration-validate-build-and-run-service");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let BackfillRecordPageCommand = class BackfillRecordPageCommand extends _provisionedworkspacecommandrunner.ProvisionedWorkspaceCommandRunner {
    async runOnWorkspace({ workspaceId, options }) {
        const isDryRun = options.dryRun ?? false;
        const { flatViewMaps, flatViewFieldMaps, flatViewFieldGroupMaps, flatObjectMetadataMaps, flatFieldMetadataMaps, flatPageLayoutMaps } = await this.workspaceCacheService.getOrRecompute(workspaceId, [
            'flatViewMaps',
            'flatViewFieldMaps',
            'flatViewFieldGroupMaps',
            'flatObjectMetadataMaps',
            'flatFieldMetadataMaps',
            'flatPageLayoutMaps'
        ]);
        const { twentyStandardFlatApplication } = await this.applicationService.findWorkspaceTwentyStandardAndCustomApplicationOrThrow({
            workspaceId
        });
        const { allFlatEntityMaps: standardFlatEntityMaps } = (0, _twentystandardapplicationallflatentitymapsconstant.computeTwentyStandardApplicationAllFlatEntityMaps)({
            now: new Date().toISOString(),
            workspaceId,
            twentyStandardApplicationId: twentyStandardFlatApplication.id
        });
        const backfillOperationsByApplication = this.computeBackfillOperationsByApplication({
            twentyStandardApplicationUniversalIdentifier: twentyStandardFlatApplication.universalIdentifier,
            standardFlatEntityMaps,
            flatViewMaps,
            flatViewFieldMaps,
            flatViewFieldGroupMaps,
            flatObjectMetadataMaps,
            flatFieldMetadataMaps,
            flatPageLayoutMaps
        });
        const totalCreateCount = [
            ...backfillOperationsByApplication.values()
        ].reduce((count, operations)=>count + operations.viewsToCreate.length + operations.viewFieldsToCreate.length + operations.viewFieldGroupsToCreate.length + operations.pageLayoutsToCreate.length + operations.pageLayoutTabsToCreate.length + operations.pageLayoutWidgetsToCreate.length, 0);
        if (totalCreateCount === 0) {
            this.logger.log(`No record page to backfill for workspace ${workspaceId}`);
            return;
        }
        this.logger.log(`${isDryRun ? '[DRY RUN] ' : ''}Backfilling ${totalCreateCount} record-page entit(ies) for workspace ${workspaceId}`);
        if (isDryRun) {
            return;
        }
        await this.runBackfillMigrations({
            workspaceId,
            backfillOperationsByApplication
        });
        this.logger.log(`Backfilled ${totalCreateCount} record-page entit(ies) for workspace ${workspaceId}`);
    }
    computeBackfillOperationsByApplication({ twentyStandardApplicationUniversalIdentifier, standardFlatEntityMaps, flatViewMaps, flatViewFieldMaps, flatViewFieldGroupMaps, flatObjectMetadataMaps, flatFieldMetadataMaps, flatPageLayoutMaps }) {
        const backfillOperationsByApplication = new Map();
        const getApplicationBucket = (applicationUniversalIdentifier)=>{
            const existingBucket = backfillOperationsByApplication.get(applicationUniversalIdentifier);
            if ((0, _utils.isDefined)(existingBucket)) {
                return existingBucket;
            }
            const newBucket = {
                viewsToCreate: [],
                viewFieldsToCreate: [],
                viewFieldGroupsToCreate: [],
                pageLayoutsToCreate: [],
                pageLayoutTabsToCreate: [],
                pageLayoutWidgetsToCreate: []
            };
            backfillOperationsByApplication.set(applicationUniversalIdentifier, newBucket);
            return newBucket;
        };
        for (const flatObjectMetadata of Object.values(flatObjectMetadataMaps.byUniversalIdentifier)){
            if (!(0, _utils.isDefined)(flatObjectMetadata) || flatObjectMetadata.isRemote) {
                continue;
            }
            const isStandardObject = flatObjectMetadata.applicationUniversalIdentifier === twentyStandardApplicationUniversalIdentifier;
            if (isStandardObject) {
                this.collectStandardObjectRecordPageOperations({
                    flatObjectMetadata,
                    getApplicationBucket,
                    standardFlatEntityMaps,
                    flatViewMaps,
                    flatViewFieldMaps,
                    flatViewFieldGroupMaps,
                    flatFieldMetadataMaps,
                    flatPageLayoutMaps
                });
            } else {
                this.collectDefaultRecordPageOperations({
                    flatObjectMetadata,
                    getApplicationBucket,
                    flatViewMaps,
                    flatViewFieldMaps,
                    flatFieldMetadataMaps,
                    flatPageLayoutMaps
                });
            }
        }
        return backfillOperationsByApplication;
    }
    // The previously-defaulted population: standard objects whose record page
    // the deleted frontend fallback used to synthesize client-side. The curated
    // stack comes from the standard definitions, which hold the derived
    // identifiers post-reconcile, so lookups are direct. Standard objects the
    // definitions give no record page to stay without one, like fresh installs.
    collectStandardObjectRecordPageOperations({ flatObjectMetadata, getApplicationBucket, standardFlatEntityMaps, flatViewMaps, flatViewFieldMaps, flatViewFieldGroupMaps, flatFieldMetadataMaps, flatPageLayoutMaps }) {
        const applicationUniversalIdentifier = flatObjectMetadata.applicationUniversalIdentifier;
        const applicationBucket = getApplicationBucket(applicationUniversalIdentifier);
        const derivedViewUniversalIdentifier = (0, _application.getSystemViewUniversalIdentifier)({
            objectMetadataApplicationUniversalIdentifier: applicationUniversalIdentifier,
            objectUniversalIdentifier: flatObjectMetadata.universalIdentifier,
            viewKey: _application.SYSTEM_VIEW_KEYS.FIELDS_WIDGET
        });
        const standardFlatView = standardFlatEntityMaps.flatViewMaps.byUniversalIdentifier[derivedViewUniversalIdentifier];
        const viewAlreadyExists = (0, _utils.isDefined)(flatViewMaps.byUniversalIdentifier[derivedViewUniversalIdentifier]);
        const curatedViewFieldUniversalIdentifiers = new Set();
        if (!viewAlreadyExists && (0, _utils.isDefined)(standardFlatView)) {
            applicationBucket.viewsToCreate.push(standardFlatView);
            const curatedFlatViewFields = Object.values(standardFlatEntityMaps.flatViewFieldMaps.byUniversalIdentifier).filter(_utils.isDefined).filter((flatViewField)=>flatViewField.viewUniversalIdentifier === derivedViewUniversalIdentifier && (0, _utils.isDefined)(flatFieldMetadataMaps.byUniversalIdentifier[flatViewField.fieldMetadataUniversalIdentifier]));
            applicationBucket.viewFieldsToCreate.push(...curatedFlatViewFields);
            curatedFlatViewFields.forEach((flatViewField)=>curatedViewFieldUniversalIdentifiers.add(flatViewField.universalIdentifier));
        }
        if (viewAlreadyExists || (0, _utils.isDefined)(standardFlatView)) {
            // Groups are topped up independently of the view creation gate so a
            // retry after a partial failure still backfills them on an
            // already-committed view.
            applicationBucket.viewFieldGroupsToCreate.push(...Object.values(standardFlatEntityMaps.flatViewFieldGroupMaps.byUniversalIdentifier).filter(_utils.isDefined).filter((flatViewFieldGroup)=>flatViewFieldGroup.viewUniversalIdentifier === derivedViewUniversalIdentifier && !(0, _utils.isDefined)(flatViewFieldGroupMaps.byUniversalIdentifier[flatViewFieldGroup.universalIdentifier])));
            this.collectMissingFlatViewFieldsToCreate({
                flatObjectMetadata,
                derivedViewUniversalIdentifier,
                getApplicationBucket,
                flatViewFieldMaps,
                flatFieldMetadataMaps,
                skippedViewFieldUniversalIdentifiers: curatedViewFieldUniversalIdentifiers
            });
        }
        const derivedPageLayoutUniversalIdentifier = (0, _application.getSystemRecordPageLayoutUniversalIdentifier)({
            objectMetadataApplicationUniversalIdentifier: applicationUniversalIdentifier,
            objectUniversalIdentifier: flatObjectMetadata.universalIdentifier
        });
        if ((0, _utils.isDefined)(flatPageLayoutMaps.byUniversalIdentifier[derivedPageLayoutUniversalIdentifier])) {
            return;
        }
        const standardFlatPageLayout = standardFlatEntityMaps.flatPageLayoutMaps.byUniversalIdentifier[derivedPageLayoutUniversalIdentifier];
        if (!(0, _utils.isDefined)(standardFlatPageLayout)) {
            return;
        }
        applicationBucket.pageLayoutsToCreate.push(standardFlatPageLayout);
        const standardFlatPageLayoutTabs = Object.values(standardFlatEntityMaps.flatPageLayoutTabMaps.byUniversalIdentifier).filter(_utils.isDefined).filter((flatPageLayoutTab)=>flatPageLayoutTab.pageLayoutUniversalIdentifier === derivedPageLayoutUniversalIdentifier);
        applicationBucket.pageLayoutTabsToCreate.push(...standardFlatPageLayoutTabs);
        const standardTabUniversalIdentifiers = new Set(standardFlatPageLayoutTabs.map((tab)=>tab.universalIdentifier));
        applicationBucket.pageLayoutWidgetsToCreate.push(...Object.values(standardFlatEntityMaps.flatPageLayoutWidgetMaps.byUniversalIdentifier).filter(_utils.isDefined).filter((flatPageLayoutWidget)=>{
            if (!standardTabUniversalIdentifiers.has(flatPageLayoutWidget.pageLayoutTabUniversalIdentifier)) {
                return false;
            }
            if (flatPageLayoutWidget.universalConfiguration.configurationType === _widgetconfigurationtypetype.WidgetConfigurationType.FIELD) {
                return (0, _utils.isDefined)(flatFieldMetadataMaps.byUniversalIdentifier[flatPageLayoutWidget.universalConfiguration.fieldMetadataId]);
            }
            return true;
        }));
    }
    // The application and workspace-custom population: the engine default stack
    // objectRecordPageOnCreate always emits at object creation, backfilled here
    // for objects that predate the engine handler.
    collectDefaultRecordPageOperations({ flatObjectMetadata, getApplicationBucket, flatViewMaps, flatViewFieldMaps, flatFieldMetadataMaps, flatPageLayoutMaps }) {
        const applicationUniversalIdentifier = flatObjectMetadata.applicationUniversalIdentifier;
        const applicationBucket = getApplicationBucket(applicationUniversalIdentifier);
        const derivedViewUniversalIdentifier = (0, _application.getSystemViewUniversalIdentifier)({
            objectMetadataApplicationUniversalIdentifier: applicationUniversalIdentifier,
            objectUniversalIdentifier: flatObjectMetadata.universalIdentifier,
            viewKey: _application.SYSTEM_VIEW_KEYS.FIELDS_WIDGET
        });
        if (!(0, _utils.isDefined)(flatViewMaps.byUniversalIdentifier[derivedViewUniversalIdentifier])) {
            applicationBucket.viewsToCreate.push((0, _computesystemviewtocreateutil.computeSystemViewToCreate)({
                objectMetadata: flatObjectMetadata,
                applicationUniversalIdentifier,
                viewKey: _application.SYSTEM_VIEW_KEYS.FIELDS_WIDGET
            }));
        }
        this.collectMissingFlatViewFieldsToCreate({
            flatObjectMetadata,
            derivedViewUniversalIdentifier,
            getApplicationBucket,
            flatViewFieldMaps,
            flatFieldMetadataMaps
        });
        const derivedPageLayoutUniversalIdentifier = (0, _application.getSystemRecordPageLayoutUniversalIdentifier)({
            objectMetadataApplicationUniversalIdentifier: applicationUniversalIdentifier,
            objectUniversalIdentifier: flatObjectMetadata.universalIdentifier
        });
        if ((0, _utils.isDefined)(flatPageLayoutMaps.byUniversalIdentifier[derivedPageLayoutUniversalIdentifier])) {
            return;
        }
        const { pageLayouts, pageLayoutTabs, pageLayoutWidgets } = (0, _computesystemrecordpagelayouttocreateutil.computeSystemRecordPageLayoutToCreate)({
            objectMetadata: flatObjectMetadata,
            applicationUniversalIdentifier,
            recordPageFieldsViewUniversalIdentifier: derivedViewUniversalIdentifier
        });
        applicationBucket.pageLayoutsToCreate.push(...pageLayouts);
        applicationBucket.pageLayoutTabsToCreate.push(...pageLayoutTabs);
        applicationBucket.pageLayoutWidgetsToCreate.push(...pageLayoutWidgets);
    }
    // Missing view-field rows for the object's record-page view, so every
    // displayable field except the label identifier has one, the invariant the
    // engine maintains on field creation. Each row lands in the bucket of the
    // application owning its displayed field, per the engine convention: a field
    // contributed by another application yields a view field owned by that
    // application, on a view owned by the object's application.
    collectMissingFlatViewFieldsToCreate({ flatObjectMetadata, derivedViewUniversalIdentifier, getApplicationBucket, flatViewFieldMaps, flatFieldMetadataMaps, skippedViewFieldUniversalIdentifiers }) {
        const objectFlatFieldMetadatas = flatObjectMetadata.fieldUniversalIdentifiers.map((fieldUniversalIdentifier)=>flatFieldMetadataMaps.byUniversalIdentifier[fieldUniversalIdentifier]).filter(_utils.isDefined);
        const fieldApplicationUniversalIdentifierByFieldUniversalIdentifier = new Map(objectFlatFieldMetadatas.map((flatFieldMetadata)=>[
                flatFieldMetadata.universalIdentifier,
                flatFieldMetadata.applicationUniversalIdentifier
            ]));
        const missingFlatViewFields = (0, _computesystemviewfieldstocreateutil.computeSystemViewFieldsToCreate)({
            objectFlatFieldMetadatas,
            viewUniversalIdentifier: derivedViewUniversalIdentifier,
            applicationUniversalIdentifier: flatObjectMetadata.applicationUniversalIdentifier,
            labelIdentifierFieldMetadataUniversalIdentifier: flatObjectMetadata.labelIdentifierFieldMetadataUniversalIdentifier,
            excludeLabelIdentifier: true
        }).filter((flatViewFieldToCreate)=>!(0, _utils.isDefined)(flatViewFieldMaps.byUniversalIdentifier[flatViewFieldToCreate.universalIdentifier]) && !skippedViewFieldUniversalIdentifiers?.has(flatViewFieldToCreate.universalIdentifier));
        for (const missingFlatViewField of missingFlatViewFields){
            const fieldApplicationUniversalIdentifier = fieldApplicationUniversalIdentifierByFieldUniversalIdentifier.get(missingFlatViewField.fieldMetadataUniversalIdentifier) ?? flatObjectMetadata.applicationUniversalIdentifier;
            getApplicationBucket(fieldApplicationUniversalIdentifier).viewFieldsToCreate.push({
                ...missingFlatViewField,
                applicationUniversalIdentifier: fieldApplicationUniversalIdentifier
            });
        }
    }
    async runBackfillMigrations({ workspaceId, backfillOperationsByApplication }) {
        // Views commit before view fields and layouts across applications: a view
        // field belongs to the application owning its displayed field, which can
        // differ from the application owning the object.
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
        for (const [applicationUniversalIdentifier, { viewFieldsToCreate, viewFieldGroupsToCreate, pageLayoutsToCreate, pageLayoutTabsToCreate, pageLayoutWidgetsToCreate }] of backfillOperationsByApplication.entries()){
            const operationCount = viewFieldsToCreate.length + viewFieldGroupsToCreate.length + pageLayoutsToCreate.length + pageLayoutTabsToCreate.length + pageLayoutWidgetsToCreate.length;
            if (operationCount === 0) {
                continue;
            }
            await this.runBackfillMigration({
                workspaceId,
                applicationUniversalIdentifier,
                allFlatEntityOperationByMetadataName: {
                    viewFieldGroup: {
                        flatEntityToCreate: viewFieldGroupsToCreate,
                        flatEntityToDelete: [],
                        flatEntityToUpdate: []
                    },
                    viewField: {
                        flatEntityToCreate: viewFieldsToCreate,
                        flatEntityToDelete: [],
                        flatEntityToUpdate: []
                    },
                    pageLayout: {
                        flatEntityToCreate: pageLayoutsToCreate,
                        flatEntityToDelete: [],
                        flatEntityToUpdate: []
                    },
                    pageLayoutTab: {
                        flatEntityToCreate: pageLayoutTabsToCreate,
                        flatEntityToDelete: [],
                        flatEntityToUpdate: []
                    },
                    pageLayoutWidget: {
                        flatEntityToCreate: pageLayoutWidgetsToCreate,
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
            this.logger.error(`Failed to backfill record page(s) for application ${applicationUniversalIdentifier} in workspace ${workspaceId}:\n${JSON.stringify(result, null, 2)}`);
            throw new Error(`Failed to backfill record page(s) for workspace ${workspaceId}`);
        }
    }
    constructor(workspaceIteratorService, workspaceCacheService, applicationService, workspaceMigrationValidateBuildAndRunService){
        super(workspaceIteratorService), this.workspaceIteratorService = workspaceIteratorService, this.workspaceCacheService = workspaceCacheService, this.applicationService = applicationService, this.workspaceMigrationValidateBuildAndRunService = workspaceMigrationValidateBuildAndRunService;
    }
};
BackfillRecordPageCommand = _ts_decorate([
    (0, _registeredworkspacecommanddecorator.RegisteredWorkspaceCommand)('2.31.0', 1786437482000),
    (0, _nestcommander.Command)({
        name: 'upgrade:2-31:backfill-record-page',
        description: 'Every object carries a system record-page stack; caller-defined custom record-page layouts coexist with it (the frontend displays a custom layout over the system one when defined). Running after the reconcile-standard-record-page and reconcile-workspace-custom-record-page commands normalized identifiers and ownership, this command backfills the system record-page stack for every object missing it, converging upgraded installs with fresh installs and replacing the frontend hardcoded default-layout fallback with a database guarantee. Twenty-standard objects get their curated stack from the standard definitions (which hold the derived identifiers post-reconcile, so lookups are direct); standard objects the definitions give no record page to stay without one, exactly like fresh installs. Workspace-custom and application objects get the engine default stack (the one objectRecordPageOnCreate always emits through the workspace migration pipeline): the FIELDS_WIDGET view (derived identifier, reserved key), its view fields for every displayable field except the label identifier, and the default layout with its 5 tabs and widgets. The backfill is idempotent and retry-safe: view, view-field, view-field-group and layout creation are gated independently on their derived identifiers, so a retry after a partial failure still backfills the missing view fields and groups of an already-committed view. View fields land in the migration bucket of the application owning their displayed field, matching the engine emission for app-contributed fields on foreign objects. On objects whose view already exists it only tops up missing view-field rows, and it never touches the tabs and widgets of an existing layout, so deliberate customizations survive.'
    }),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _workspaceiteratorservice.WorkspaceIteratorService === "undefined" ? Object : _workspaceiteratorservice.WorkspaceIteratorService,
        typeof _workspacecacheservice.WorkspaceCacheService === "undefined" ? Object : _workspacecacheservice.WorkspaceCacheService,
        typeof _applicationservice.ApplicationService === "undefined" ? Object : _applicationservice.ApplicationService,
        typeof _workspacemigrationvalidatebuildandrunservice.WorkspaceMigrationValidateBuildAndRunService === "undefined" ? Object : _workspacemigrationvalidatebuildandrunservice.WorkspaceMigrationValidateBuildAndRunService
    ])
], BackfillRecordPageCommand);

//# sourceMappingURL=2-31-workspace-command-1786437482000-backfill-record-page.command.js.map