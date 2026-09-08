"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "ReconcileStandardRecordPageCommand", {
    enumerable: true,
    get: function() {
        return ReconcileStandardRecordPageCommand;
    }
});
const _typeorm = require("@nestjs/typeorm");
const _nestcommander = require("nest-commander");
const _application = require("twenty-shared/application");
const _utils = require("twenty-shared/utils");
const _typeorm1 = require("typeorm");
const _provisionedworkspacecommandrunner = require("../../command-runners/provisioned-workspace.command-runner");
const _workspaceiteratorservice = require("../../command-runners/workspace-iterator.service");
const _pre231standardrecordpagelayoutuniversalidentifierbyobjectuniversalidentifierconstant = require("./constants/pre-2-31-standard-record-page-layout-universal-identifier-by-object-universal-identifier.constant");
const _applyrecordpagereownupdatesutil = require("./utils/apply-record-page-reown-updates.util");
const _collectrecordpagestackflatentitiesutil = require("./utils/collect-record-page-stack-flat-entities.util");
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
let ReconcileStandardRecordPageCommand = class ReconcileStandardRecordPageCommand extends _provisionedworkspacecommandrunner.ProvisionedWorkspaceCommandRunner {
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
        const reownUpdates = this.computeCuratedStackReownUpdates({
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
        this.appendDeOwnUpdates({
            workspaceId,
            reownUpdates,
            twentyStandardApplicationUniversalIdentifier: twentyStandardFlatApplication.universalIdentifier,
            workspaceCustomApplicationUniversalIdentifier: workspaceCustomFlatApplication.universalIdentifier,
            workspaceCustomApplicationId: workspaceCustomFlatApplication.id,
            flatViewMaps,
            flatViewFieldMaps,
            flatViewFieldGroupMaps,
            flatObjectMetadataMaps,
            flatPageLayoutMaps,
            flatPageLayoutTabMaps,
            flatPageLayoutWidgetMaps
        });
        const totalUpdateCount = (0, _countrecordpagereownupdatesutil.countRecordPageReownUpdates)(reownUpdates);
        if (totalUpdateCount === 0) {
            this.logger.log(`No standard record-page stack to reconcile for workspace ${workspaceId}`);
            return;
        }
        this.logger.log(`${isDryRun ? '[DRY RUN] ' : ''}Reconciling standard record-page stacks for workspace ${workspaceId} (${totalUpdateCount} row(s))`);
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
        this.logger.log(`Reconciled standard record-page stacks for workspace ${workspaceId} (${totalUpdateCount} row(s))`);
    }
    // Pass 1: for every standard object, locate the curated layout by its
    // pre-2.31 pinned literal (or the derived identifier on a rerun) and re-own
    // its whole stack onto the derived scheme.
    computeCuratedStackReownUpdates({ workspaceId, twentyStandardApplicationUniversalIdentifier, workspaceCustomApplicationUniversalIdentifier, flatViewMaps, flatViewFieldMaps, flatViewFieldGroupMaps, flatObjectMetadataMaps, flatFieldMetadataMaps, flatPageLayoutMaps, flatPageLayoutTabMaps, flatPageLayoutWidgetMaps }) {
        const reownUpdates = (0, _createemptyrecordpagereownupdatesutil.createEmptyRecordPageReownUpdates)();
        const engineOwnedApplicationUniversalIdentifiers = new Set([
            twentyStandardApplicationUniversalIdentifier,
            workspaceCustomApplicationUniversalIdentifier
        ]);
        for (const flatObjectMetadata of Object.values(flatObjectMetadataMaps.byUniversalIdentifier)){
            if (!(0, _utils.isDefined)(flatObjectMetadata) || flatObjectMetadata.applicationUniversalIdentifier !== twentyStandardApplicationUniversalIdentifier) {
                continue;
            }
            const pre228LayoutUniversalIdentifier = _pre231standardrecordpagelayoutuniversalidentifierbyobjectuniversalidentifierconstant.PRE_2_31_STANDARD_RECORD_PAGE_LAYOUT_UNIVERSAL_IDENTIFIER_BY_OBJECT_UNIVERSAL_IDENTIFIER[flatObjectMetadata.universalIdentifier];
            const derivedPageLayoutUniversalIdentifier = (0, _application.getSystemRecordPageLayoutUniversalIdentifier)({
                objectMetadataApplicationUniversalIdentifier: twentyStandardApplicationUniversalIdentifier,
                objectUniversalIdentifier: flatObjectMetadata.universalIdentifier
            });
            const flatPageLayout = (0, _utils.isDefined)(pre228LayoutUniversalIdentifier) ? flatPageLayoutMaps.byUniversalIdentifier[pre228LayoutUniversalIdentifier] ?? flatPageLayoutMaps.byUniversalIdentifier[derivedPageLayoutUniversalIdentifier] : flatPageLayoutMaps.byUniversalIdentifier[derivedPageLayoutUniversalIdentifier];
            if (!(0, _utils.isDefined)(flatPageLayout) || (0, _utils.isDefined)(flatPageLayout.deletedAt)) {
                continue;
            }
            if (flatPageLayout.applicationUniversalIdentifier !== twentyStandardApplicationUniversalIdentifier || flatPageLayout.type !== _types.PageLayoutType.RECORD_PAGE || flatPageLayout.objectMetadataUniversalIdentifier !== flatObjectMetadata.universalIdentifier) {
                this.logger.warn(`Layout ${flatPageLayout.id} does not match the expected curated record-page stack of standard object ${flatObjectMetadata.universalIdentifier} in workspace ${workspaceId}, skipping`);
                continue;
            }
            const stackReownUpdates = (0, _computerecordpagestackreownupdatesutil.computeRecordPageStackReownUpdates)({
                workspaceId,
                logger: this.logger,
                flatObjectMetadata,
                flatPageLayout,
                derivedPageLayoutUniversalIdentifier,
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
            this.mergeReownUpdates(reownUpdates, stackReownUpdates);
        }
        return reownUpdates;
    }
    // Pass 2: the 1-23 backfill authored the record-page stacks of
    // workspace-custom objects under twenty-standard; move their applicationId
    // to workspace-custom (identifiers untouched, the workspace-custom
    // reconcile command re-owns them next).
    appendDeOwnUpdates({ workspaceId, reownUpdates, twentyStandardApplicationUniversalIdentifier, workspaceCustomApplicationUniversalIdentifier, workspaceCustomApplicationId, flatViewMaps, flatViewFieldMaps, flatViewFieldGroupMaps, flatObjectMetadataMaps, flatPageLayoutMaps, flatPageLayoutTabMaps, flatPageLayoutWidgetMaps }) {
        for (const flatPageLayout of Object.values(flatPageLayoutMaps.byUniversalIdentifier)){
            if (!(0, _utils.isDefined)(flatPageLayout) || flatPageLayout.type !== _types.PageLayoutType.RECORD_PAGE || (0, _utils.isDefined)(flatPageLayout.deletedAt) || flatPageLayout.applicationUniversalIdentifier !== twentyStandardApplicationUniversalIdentifier || !(0, _utils.isDefined)(flatPageLayout.objectMetadataUniversalIdentifier)) {
                continue;
            }
            const flatObjectMetadata = flatObjectMetadataMaps.byUniversalIdentifier[flatPageLayout.objectMetadataUniversalIdentifier];
            if (!(0, _utils.isDefined)(flatObjectMetadata)) {
                this.logger.warn(`Missing object for standard-owned record-page layout ${flatPageLayout.id} in workspace ${workspaceId}, skipping`);
                continue;
            }
            if (flatObjectMetadata.applicationUniversalIdentifier === twentyStandardApplicationUniversalIdentifier) {
                const expectedLayoutUniversalIdentifiers = [
                    _pre231standardrecordpagelayoutuniversalidentifierbyobjectuniversalidentifierconstant.PRE_2_31_STANDARD_RECORD_PAGE_LAYOUT_UNIVERSAL_IDENTIFIER_BY_OBJECT_UNIVERSAL_IDENTIFIER[flatObjectMetadata.universalIdentifier],
                    (0, _application.getSystemRecordPageLayoutUniversalIdentifier)({
                        objectMetadataApplicationUniversalIdentifier: twentyStandardApplicationUniversalIdentifier,
                        objectUniversalIdentifier: flatObjectMetadata.universalIdentifier
                    })
                ].filter(_utils.isDefined);
                if (!expectedLayoutUniversalIdentifiers.includes(flatPageLayout.universalIdentifier)) {
                    this.logger.warn(`Standard-owned record-page layout ${flatPageLayout.id} on standard object ${flatObjectMetadata.universalIdentifier} in workspace ${workspaceId} matches neither the pre-2.31 literal nor the derived identifier, skipping`);
                }
                continue;
            }
            // Layouts of app objects were never authored under twenty-standard;
            // anything found there is an anomaly, not a 1-23 backfill row.
            if (flatObjectMetadata.applicationUniversalIdentifier !== workspaceCustomApplicationUniversalIdentifier) {
                this.logger.warn(`Standard-owned record-page layout ${flatPageLayout.id} is attached to app object ${flatObjectMetadata.universalIdentifier} in workspace ${workspaceId}, skipping`);
                continue;
            }
            const stack = (0, _collectrecordpagestackflatentitiesutil.collectRecordPageStackFlatEntities)({
                flatPageLayout,
                flatViewMaps,
                flatViewFieldMaps,
                flatViewFieldGroupMaps,
                flatPageLayoutTabMaps,
                flatPageLayoutWidgetMaps
            });
            const stackBuckets = [
                [
                    stack.pageLayouts,
                    reownUpdates.pageLayoutUpdates
                ],
                [
                    stack.pageLayoutTabs,
                    reownUpdates.pageLayoutTabUpdates
                ],
                [
                    stack.pageLayoutWidgets,
                    reownUpdates.pageLayoutWidgetUpdates
                ],
                [
                    stack.views,
                    reownUpdates.viewUpdates
                ],
                [
                    stack.viewFields,
                    reownUpdates.viewFieldUpdates
                ],
                [
                    stack.viewFieldGroups,
                    reownUpdates.viewFieldGroupUpdates
                ]
            ];
            for (const [flatEntities, updates] of stackBuckets){
                for (const flatEntity of flatEntities){
                    if (flatEntity.applicationUniversalIdentifier !== twentyStandardApplicationUniversalIdentifier) {
                        continue;
                    }
                    updates.push({
                        id: flatEntity.id,
                        update: {
                            applicationId: workspaceCustomApplicationId
                        }
                    });
                }
            }
        }
    }
    mergeReownUpdates(target, source) {
        for (const key of Object.keys(source)){
            target[key].push(...source[key]);
        }
    }
    constructor(workspaceIteratorService, workspaceCacheService, workspaceMigrationRunnerService, applicationService, // eslint-disable-next-line twenty/prefer-workspace-scoped-repository
    viewRepository){
        super(workspaceIteratorService), this.workspaceIteratorService = workspaceIteratorService, this.workspaceCacheService = workspaceCacheService, this.workspaceMigrationRunnerService = workspaceMigrationRunnerService, this.applicationService = applicationService, this.viewRepository = viewRepository;
    }
};
ReconcileStandardRecordPageCommand = _ts_decorate([
    (0, _registeredworkspacecommanddecorator.RegisteredWorkspaceCommand)('2.31.0', 1786437481000),
    (0, _nestcommander.Command)({
        name: 'upgrade:2-31:reconcile-standard-record-page',
        description: 'Normalize the twenty-standard-owned record-page rows. Only the standard sync and the 1-23 backfill ever authored rows under twenty-standard, so per object there is at most one RECORD_PAGE layout by construction and no winner selection is ever needed. Two passes. (1) For every standard object, the curated layout is located by its pre-2.31 pinned literal (or by the derived identifier on a rerun) and its whole stack (tabs, widgets, the FIELDS widget view plus the reserved FIELDS_WIDGET key backfill, its view fields keyed on the displayed field application, standard-authored groups) is re-owned onto the name-free derived scheme and flagged isSystemSideEffect. App-authored tabs attached to the standard layout (e.g. fireflies, call-recorder) are left untouched. (2) The 1-23 backfill authored the record-page stacks of workspace-custom objects under twenty-standard: those stacks are de-owned, i.e. their applicationId moves to the workspace-custom application without touching identifiers, so that the workspace-custom reconcile command running next treats one homogeneous population per custom object. Standard-owned layouts matching neither pass (unknown row on a standard object, layout on an app object) are logged and left untouched. universalIdentifier is unique per workspace, so any derived identifier already held by another row is skipped with a warning instead of aborting the transaction. Objects missing the stack entirely get it from the backfill-record-page command.'
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
], ReconcileStandardRecordPageCommand);

//# sourceMappingURL=2-31-workspace-command-1786437481000-reconcile-standard-record-page.command.js.map