"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "ReconcileIndexViewUniversalIdentifierCommand", {
    enumerable: true,
    get: function() {
        return ReconcileIndexViewUniversalIdentifierCommand;
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
const _findmanyflatentitybyuniversalidentifierinuniversalflatentitymapsutil = require("../../../../engine/metadata-modules/flat-entity/utils/find-many-flat-entity-by-universal-identifier-in-universal-flat-entity-maps.util");
const _viewfieldentity = require("../../../../engine/metadata-modules/view-field/entities/view-field.entity");
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
let ReconcileIndexViewUniversalIdentifierCommand = class ReconcileIndexViewUniversalIdentifierCommand extends _provisionedworkspacecommandrunner.ProvisionedWorkspaceCommandRunner {
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
        const flatIndexViews = Object.values(flatViewMaps.byUniversalIdentifier).filter(_utils.isDefined).filter((flatView)=>flatView.key === _types.ViewKey.INDEX && !(0, _utils.isDefined)(flatView.deletedAt) && engineOwnedApplicationUniversalIdentifiers.has(flatView.applicationUniversalIdentifier));
        const { viewUpdates, viewFieldUpdates } = this.computeReownUpdates({
            workspaceId,
            flatIndexViews,
            flatViewMaps,
            flatViewFieldMaps,
            flatObjectMetadataMaps,
            flatFieldMetadataMaps
        });
        if (viewUpdates.length === 0 && viewFieldUpdates.length === 0) {
            this.logger.log(`No INDEX view to reconcile for workspace ${workspaceId}`);
            return;
        }
        this.logger.log(`${isDryRun ? '[DRY RUN] ' : ''}Reconciling ${viewUpdates.length} INDEX view(s) and ${viewFieldUpdates.length} view field(s) for workspace ${workspaceId}`);
        if (isDryRun) {
            return;
        }
        await this.viewRepository.manager.transaction(async (entityManager)=>{
            const transactionalViewRepository = entityManager.getRepository(_viewentity.ViewEntity);
            const transactionalViewFieldRepository = entityManager.getRepository(_viewfieldentity.ViewFieldEntity);
            for (const { id, update } of viewUpdates){
                await transactionalViewRepository.update({
                    id,
                    workspaceId
                }, update);
            }
            for (const { id, update } of viewFieldUpdates){
                await transactionalViewFieldRepository.update({
                    id,
                    workspaceId
                }, update);
            }
        });
        await (0, _invalidateindexviewreconcilecacheutil.invalidateIndexViewReconcileCache)({
            workspaceId,
            workspaceMigrationRunnerService: this.workspaceMigrationRunnerService
        });
        this.logger.log(`Reconciled ${viewUpdates.length} INDEX view(s) and ${viewFieldUpdates.length} view field(s) for workspace ${workspaceId}`);
    }
    computeReownUpdates({ workspaceId, flatIndexViews, flatViewMaps, flatViewFieldMaps, flatObjectMetadataMaps, flatFieldMetadataMaps }) {
        const viewUpdates = [];
        const viewFieldUpdates = [];
        const claimedViewUniversalIdentifiers = new Set();
        const claimedViewFieldUniversalIdentifiers = new Set();
        for (const flatView of flatIndexViews){
            const flatObjectMetadata = flatObjectMetadataMaps.byUniversalIdentifier[flatView.objectMetadataUniversalIdentifier];
            if (!(0, _utils.isDefined)(flatObjectMetadata)) {
                this.logger.warn(`Missing object for INDEX view ${flatView.id} in workspace ${workspaceId}, skipping`);
                continue;
            }
            // An INDEX view belongs to the application of its object. A view
            // attributed to another application (legacy caller-provided INDEX keys
            // predating the flat view validator) cannot be the object's INDEX
            // view: it is demoted to a plain caller-owned view, leaving the
            // object's own INDEX view as the only holder of the key.
            if (flatView.applicationUniversalIdentifier !== flatObjectMetadata.applicationUniversalIdentifier) {
                this.logger.warn(`INDEX view ${flatView.id} is attributed to application ${flatView.applicationUniversalIdentifier} but its object belongs to application ${flatObjectMetadata.applicationUniversalIdentifier} in workspace ${workspaceId}, demoting it`);
                const update = {
                    key: null
                };
                if (flatView.isSystemSideEffect) {
                    update.isSystemSideEffect = false;
                }
                viewUpdates.push({
                    id: flatView.id,
                    update
                });
                continue;
            }
            const derivedViewUniversalIdentifier = (0, _application.getSystemViewUniversalIdentifier)({
                objectMetadataApplicationUniversalIdentifier: flatObjectMetadata.applicationUniversalIdentifier,
                objectUniversalIdentifier: flatObjectMetadata.universalIdentifier,
                viewKey: _application.SYSTEM_VIEW_KEYS.INDEX
            });
            if (flatView.universalIdentifier === derivedViewUniversalIdentifier) {
                claimedViewUniversalIdentifiers.add(derivedViewUniversalIdentifier);
                if (!flatView.isSystemSideEffect) {
                    viewUpdates.push({
                        id: flatView.id,
                        update: {
                            isSystemSideEffect: true
                        }
                    });
                }
            } else {
                // The unique index on (workspaceId, universalIdentifier) covers
                // soft-deleted rows too, and the flat maps are loaded withDeleted:
                // any holder of the derived identifier makes the re-own impossible.
                const isDerivedViewUniversalIdentifierTaken = (0, _utils.isDefined)(flatViewMaps.byUniversalIdentifier[derivedViewUniversalIdentifier]) || claimedViewUniversalIdentifiers.has(derivedViewUniversalIdentifier);
                if (isDerivedViewUniversalIdentifierTaken) {
                    this.logger.warn(`Derived identifier ${derivedViewUniversalIdentifier} of INDEX view ${flatView.id} is already held by another view in workspace ${workspaceId}, skipping`);
                    continue;
                }
                claimedViewUniversalIdentifiers.add(derivedViewUniversalIdentifier);
                const update = {
                    universalIdentifier: derivedViewUniversalIdentifier
                };
                if (!flatView.isSystemSideEffect) {
                    update.isSystemSideEffect = true;
                }
                viewUpdates.push({
                    id: flatView.id,
                    update
                });
            }
            viewFieldUpdates.push(...this.computeViewFieldReownUpdates({
                workspaceId,
                flatView,
                derivedViewUniversalIdentifier,
                flatViewFieldMaps,
                flatFieldMetadataMaps,
                claimedViewFieldUniversalIdentifiers
            }));
        }
        return {
            viewUpdates,
            viewFieldUpdates
        };
    }
    computeViewFieldReownUpdates({ workspaceId, flatView, derivedViewUniversalIdentifier, flatViewFieldMaps, flatFieldMetadataMaps, claimedViewFieldUniversalIdentifiers }) {
        const viewFieldUpdates = [];
        const flatViewFields = (0, _findmanyflatentitybyuniversalidentifierinuniversalflatentitymapsutil.findManyFlatEntityByUniversalIdentifierInUniversalFlatEntityMaps)({
            flatEntityMaps: flatViewFieldMaps,
            universalIdentifiers: flatView.viewFieldUniversalIdentifiers
        });
        for (const flatViewField of flatViewFields){
            if ((0, _utils.isDefined)(flatViewField.deletedAt)) {
                continue;
            }
            const flatFieldMetadata = flatFieldMetadataMaps.byUniversalIdentifier[flatViewField.fieldMetadataUniversalIdentifier];
            if (!(0, _utils.isDefined)(flatFieldMetadata)) {
                this.logger.warn(`Missing field for INDEX view field ${flatViewField.id} in workspace ${workspaceId}, skipping`);
                continue;
            }
            const derivedViewFieldUniversalIdentifier = (0, _application.getSystemViewFieldUniversalIdentifier)({
                fieldMetadataApplicationUniversalIdentifier: flatFieldMetadata.applicationUniversalIdentifier,
                viewUniversalIdentifier: derivedViewUniversalIdentifier,
                fieldMetadataUniversalIdentifier: flatViewField.fieldMetadataUniversalIdentifier
            });
            if (flatViewField.universalIdentifier === derivedViewFieldUniversalIdentifier) {
                claimedViewFieldUniversalIdentifiers.add(derivedViewFieldUniversalIdentifier);
                if (!flatViewField.isSystemSideEffect) {
                    viewFieldUpdates.push({
                        id: flatViewField.id,
                        update: {
                            isSystemSideEffect: true
                        }
                    });
                }
                continue;
            }
            const isDerivedViewFieldUniversalIdentifierTaken = (0, _utils.isDefined)(flatViewFieldMaps.byUniversalIdentifier[derivedViewFieldUniversalIdentifier]) || claimedViewFieldUniversalIdentifiers.has(derivedViewFieldUniversalIdentifier);
            if (isDerivedViewFieldUniversalIdentifierTaken) {
                this.logger.warn(`Derived identifier ${derivedViewFieldUniversalIdentifier} of view field ${flatViewField.id} is already held by another view field in workspace ${workspaceId}, skipping`);
                continue;
            }
            claimedViewFieldUniversalIdentifiers.add(derivedViewFieldUniversalIdentifier);
            const update = {
                universalIdentifier: derivedViewFieldUniversalIdentifier
            };
            if (!flatViewField.isSystemSideEffect) {
                update.isSystemSideEffect = true;
            }
            viewFieldUpdates.push({
                id: flatViewField.id,
                update
            });
        }
        return viewFieldUpdates;
    }
    constructor(workspaceIteratorService, workspaceCacheService, workspaceMigrationRunnerService, applicationService, // eslint-disable-next-line twenty/prefer-workspace-scoped-repository
    viewRepository){
        super(workspaceIteratorService), this.workspaceIteratorService = workspaceIteratorService, this.workspaceCacheService = workspaceCacheService, this.workspaceMigrationRunnerService = workspaceMigrationRunnerService, this.applicationService = applicationService, this.viewRepository = viewRepository;
    }
};
ReconcileIndexViewUniversalIdentifierCommand = _ts_decorate([
    (0, _registeredworkspacecommanddecorator.RegisteredWorkspaceCommand)('2.26.0', 1785255689000),
    (0, _nestcommander.Command)({
        name: 'upgrade:2-26:reconcile-index-view-universal-identifier',
        description: 'Re-own the INDEX table views ("All {objectLabelPlural}", keyed on ViewKey.INDEX) of the twenty-standard and workspace-custom applications, and all their view fields, onto the engine convention: the view gets the name-free deterministic universal identifier (getSystemViewUniversalIdentifier, object identifier + INDEX key), each view field gets the derived getSystemViewFieldUniversalIdentifier keyed on the application of the field it DISPLAYS — not the row attribution, which diverges when a user shows a hidden standard column and mints a workspace-custom view field on a standard field — so an app or user column on a standard INDEX view converges too, and both get isSystemSideEffect: true, as if provisioned by the metadata side-effect engine. INDEX views of other applications are handled by the demote-and-backfill command. An INDEX view attributed to another application than its object (legacy caller-provided INDEX keys predating the flat view validator) is demoted to a plain view instead. Children reference the view by primary key, so the re-own is a lossless update.'
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
], ReconcileIndexViewUniversalIdentifierCommand);

//# sourceMappingURL=2-26-workspace-command-1785255689000-reconcile-index-view-universal-identifier.command.js.map