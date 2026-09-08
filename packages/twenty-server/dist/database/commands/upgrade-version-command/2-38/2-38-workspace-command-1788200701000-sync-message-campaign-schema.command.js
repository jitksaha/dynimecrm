"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "SyncMessageCampaignSchemaCommand", {
    enumerable: true,
    get: function() {
        return SyncMessageCampaignSchemaCommand;
    }
});
const _nestcommander = require("nest-commander");
const _applicationservice = require("../../../../engine/core-modules/application/application.service");
const _types = require("twenty-shared/types");
const _messagecampaignstandardobjectuniversalidentifiersconstant = require("./constants/message-campaign-standard-object-universal-identifiers.constant");
const _provisionedworkspacecommandrunner = require("../../command-runners/provisioned-workspace.command-runner");
const _registeredworkspacecommanddecorator = require("../../../../engine/core-modules/upgrade/decorators/registered-workspace-command.decorator");
const _metadata = require("twenty-shared/metadata");
const _workspacecacheservice = require("../../../../engine/workspace-cache/services/workspace-cache.service");
const _workspaceiteratorservice = require("../../command-runners/workspace-iterator.service");
const _workspacemigrationvalidatebuildandrunservice = require("../../../../engine/workspace-manager/workspace-migration/services/workspace-migration-validate-build-and-run-service");
const _buildnavigationcommandmenuitemoperationsorthrowutil = require("../2-10/utils/build-navigation-command-menu-item-operations-or-throw.util");
const _collectmessagecampaignstandarduniversalidentifiersutil = require("./utils/collect-message-campaign-standard-universal-identifiers.util");
const _twentystandardapplicationallflatentitymapsconstant = require("../../../../engine/workspace-manager/twenty-standard-application/utils/twenty-standard-application-all-flat-entity-maps.constant");
const _findflatentitybyuniversalidentifierutil = require("../../../../engine/metadata-modules/flat-entity/utils/find-flat-entity-by-universal-identifier.util");
const _getstandardflatentitiestocreateorthrowutil = require("../2-10/utils/get-standard-flat-entities-to-create-or-throw.util");
const _utils = require("twenty-shared/utils");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
const MESSAGE_CAMPAIGN = _metadata.STANDARD_OBJECTS.messageCampaign;
const CAMPAIGN_STATUS_FIELD = MESSAGE_CAMPAIGN.fields.status;
let SyncMessageCampaignSchemaCommand = class SyncMessageCampaignSchemaCommand extends _provisionedworkspacecommandrunner.ProvisionedWorkspaceCommandRunner {
    async runOnWorkspace(args) {
        await this.syncStandardObjects(args);
        await this.makeCampaignSearchable(args);
        await this.syncCampaignMetadata(args);
    }
    async syncStandardObjects({ workspaceId, options }) {
        const isDryRun = options.dryRun ?? false;
        const { flatObjectMetadataMaps, flatFieldMetadataMaps, flatIndexMaps, flatSearchFieldMetadataMaps, flatViewMaps, flatViewFieldMaps, flatViewFieldGroupMaps, flatPageLayoutMaps, flatPageLayoutTabMaps, flatPageLayoutWidgetMaps, flatCommandMenuItemMaps } = await this.workspaceCacheService.getOrRecompute(workspaceId, [
            'flatObjectMetadataMaps',
            'flatFieldMetadataMaps',
            'flatIndexMaps',
            'flatSearchFieldMetadataMaps',
            'flatViewMaps',
            'flatViewFieldMaps',
            'flatViewFieldGroupMaps',
            'flatPageLayoutMaps',
            'flatPageLayoutTabMaps',
            'flatPageLayoutWidgetMaps',
            'flatCommandMenuItemMaps'
        ]);
        const personObjectMetadata = flatObjectMetadataMaps.byUniversalIdentifier[_metadata.STANDARD_OBJECTS.person.universalIdentifier];
        if (!(0, _utils.isDefined)(personObjectMetadata)) {
            this.logger.warn(`person object not found for workspace ${workspaceId}, skipping MessageCampaign standard metadata sync`);
            return;
        }
        const { twentyStandardFlatApplication } = await this.applicationService.findWorkspaceTwentyStandardAndCustomApplicationOrThrow({
            workspaceId
        });
        const now = new Date().toISOString();
        const { allFlatEntityMaps: standardAllFlatEntityMaps } = (0, _twentystandardapplicationallflatentitymapsconstant.computeTwentyStandardApplicationAllFlatEntityMaps)({
            now,
            workspaceId,
            twentyStandardApplicationId: twentyStandardFlatApplication.id
        });
        const universalIdentifiers = (0, _collectmessagecampaignstandarduniversalidentifiersutil.collectMessageCampaignStandardUniversalIdentifiers)({
            standardAllFlatEntityMaps
        });
        const objectMetadatasForNavigation = _messagecampaignstandardobjectuniversalidentifiersconstant.MESSAGE_CAMPAIGN_STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.map((universalIdentifier)=>(0, _getstandardflatentitiestocreateorthrowutil.getExistingOrStandardFlatEntityOrThrow)({
                standardFlatEntityMaps: standardAllFlatEntityMaps.flatObjectMetadataMaps,
                existingFlatEntityMaps: flatObjectMetadataMaps,
                universalIdentifier
            }));
        const navigationCommandMenuItemOperations = (0, _buildnavigationcommandmenuitemoperationsorthrowutil.buildNavigationCommandMenuItemOperationsOrThrow)({
            existingFlatCommandMenuItemMaps: flatCommandMenuItemMaps,
            objectMetadatasForNavigation,
            applicationId: twentyStandardFlatApplication.id,
            workspaceId,
            now,
            renamedCollisionObjectMetadatas: []
        });
        const allFlatEntityOperationByMetadataName = {
            objectMetadata: {
                flatEntityToCreate: (0, _getstandardflatentitiestocreateorthrowutil.getStandardFlatEntitiesToCreateOrThrow)({
                    standardFlatEntityMaps: standardAllFlatEntityMaps.flatObjectMetadataMaps,
                    existingFlatEntityMaps: flatObjectMetadataMaps,
                    universalIdentifiers: universalIdentifiers.objectMetadata
                }),
                flatEntityToDelete: [],
                flatEntityToUpdate: []
            },
            fieldMetadata: {
                flatEntityToCreate: (0, _getstandardflatentitiestocreateorthrowutil.getStandardFlatEntitiesToCreateOrThrow)({
                    standardFlatEntityMaps: standardAllFlatEntityMaps.flatFieldMetadataMaps,
                    existingFlatEntityMaps: flatFieldMetadataMaps,
                    universalIdentifiers: universalIdentifiers.fieldMetadata
                }),
                flatEntityToDelete: [],
                flatEntityToUpdate: []
            },
            index: {
                flatEntityToCreate: (0, _getstandardflatentitiestocreateorthrowutil.getStandardFlatEntitiesToCreateOrThrow)({
                    standardFlatEntityMaps: standardAllFlatEntityMaps.flatIndexMaps,
                    existingFlatEntityMaps: flatIndexMaps,
                    universalIdentifiers: universalIdentifiers.index
                }),
                flatEntityToDelete: [],
                flatEntityToUpdate: []
            },
            searchFieldMetadata: {
                flatEntityToCreate: (0, _getstandardflatentitiestocreateorthrowutil.getStandardFlatEntitiesToCreateOrThrow)({
                    standardFlatEntityMaps: standardAllFlatEntityMaps.flatSearchFieldMetadataMaps,
                    existingFlatEntityMaps: flatSearchFieldMetadataMaps,
                    universalIdentifiers: universalIdentifiers.searchFieldMetadata
                }),
                flatEntityToDelete: [],
                flatEntityToUpdate: []
            },
            view: {
                flatEntityToCreate: (0, _getstandardflatentitiestocreateorthrowutil.getStandardFlatEntitiesToCreateOrThrow)({
                    standardFlatEntityMaps: standardAllFlatEntityMaps.flatViewMaps,
                    existingFlatEntityMaps: flatViewMaps,
                    universalIdentifiers: universalIdentifiers.view
                }),
                flatEntityToDelete: [],
                flatEntityToUpdate: []
            },
            viewFieldGroup: {
                flatEntityToCreate: (0, _getstandardflatentitiestocreateorthrowutil.getStandardFlatEntitiesToCreateOrThrow)({
                    standardFlatEntityMaps: standardAllFlatEntityMaps.flatViewFieldGroupMaps,
                    existingFlatEntityMaps: flatViewFieldGroupMaps,
                    universalIdentifiers: universalIdentifiers.viewFieldGroup
                }),
                flatEntityToDelete: [],
                flatEntityToUpdate: []
            },
            viewField: {
                flatEntityToCreate: (0, _getstandardflatentitiestocreateorthrowutil.getStandardFlatEntitiesToCreateOrThrow)({
                    standardFlatEntityMaps: standardAllFlatEntityMaps.flatViewFieldMaps,
                    existingFlatEntityMaps: flatViewFieldMaps,
                    universalIdentifiers: universalIdentifiers.viewField
                }),
                flatEntityToDelete: [],
                flatEntityToUpdate: []
            },
            pageLayout: {
                flatEntityToCreate: (0, _getstandardflatentitiestocreateorthrowutil.getStandardFlatEntitiesToCreateOrThrow)({
                    standardFlatEntityMaps: standardAllFlatEntityMaps.flatPageLayoutMaps,
                    existingFlatEntityMaps: flatPageLayoutMaps,
                    universalIdentifiers: universalIdentifiers.pageLayout
                }),
                flatEntityToDelete: [],
                flatEntityToUpdate: []
            },
            pageLayoutTab: {
                flatEntityToCreate: (0, _getstandardflatentitiestocreateorthrowutil.getStandardFlatEntitiesToCreateOrThrow)({
                    standardFlatEntityMaps: standardAllFlatEntityMaps.flatPageLayoutTabMaps,
                    existingFlatEntityMaps: flatPageLayoutTabMaps,
                    universalIdentifiers: universalIdentifiers.pageLayoutTab
                }),
                flatEntityToDelete: [],
                flatEntityToUpdate: []
            },
            pageLayoutWidget: {
                flatEntityToCreate: (0, _getstandardflatentitiestocreateorthrowutil.getStandardFlatEntitiesToCreateOrThrow)({
                    standardFlatEntityMaps: standardAllFlatEntityMaps.flatPageLayoutWidgetMaps,
                    existingFlatEntityMaps: flatPageLayoutWidgetMaps,
                    universalIdentifiers: universalIdentifiers.pageLayoutWidget
                }),
                flatEntityToDelete: [],
                flatEntityToUpdate: []
            },
            commandMenuItem: {
                flatEntityToCreate: [
                    ...(0, _getstandardflatentitiestocreateorthrowutil.getStandardFlatEntitiesToCreateOrThrow)({
                        standardFlatEntityMaps: standardAllFlatEntityMaps.flatCommandMenuItemMaps,
                        existingFlatEntityMaps: flatCommandMenuItemMaps,
                        universalIdentifiers: universalIdentifiers.commandMenuItem
                    }),
                    ...navigationCommandMenuItemOperations.flatEntityToCreate
                ],
                flatEntityToDelete: [],
                flatEntityToUpdate: navigationCommandMenuItemOperations.flatEntityToUpdate
            }
        };
        const totalOperationCount = Object.values(allFlatEntityOperationByMetadataName).reduce((total, operations)=>total + operations.flatEntityToCreate.length + operations.flatEntityToUpdate.length, 0);
        if (totalOperationCount === 0) {
            this.logger.log(`MessageCampaign standard metadata already exists for workspace ${workspaceId}, skipping`);
            return;
        }
        this.logger.log(`${isDryRun ? '[DRY RUN] ' : ''}Applying ${totalOperationCount} MessageCampaign standard metadata operation(s) for workspace ${workspaceId}`);
        if (isDryRun) {
            return;
        }
        const validateAndBuildResult = await this.workspaceMigrationValidateBuildAndRunService.validateBuildAndRunLegacyWorkspaceMigration({
            isSystemBuild: true,
            applicationUniversalIdentifier: twentyStandardFlatApplication.universalIdentifier,
            workspaceId,
            allFlatEntityOperationByMetadataName
        });
        if (validateAndBuildResult.status === 'fail') {
            throw new Error(`Failed to create the MessageCampaign standard objects for workspace ${workspaceId}: ${JSON.stringify(validateAndBuildResult, null, 2)}`);
        }
        this.logger.log(`Applied ${totalOperationCount} MessageCampaign standard metadata operation(s) for workspace ${workspaceId}`);
    }
    async makeCampaignSearchable({ workspaceId, options }) {
        const isDryRun = options.dryRun ?? false;
        const { flatObjectMetadataMaps } = await this.workspaceCacheService.getOrRecompute(workspaceId, [
            'flatObjectMetadataMaps'
        ]);
        const messageCampaignObjectMetadata = flatObjectMetadataMaps.byUniversalIdentifier[_metadata.STANDARD_OBJECTS.messageCampaign.universalIdentifier];
        if (!(0, _utils.isDefined)(messageCampaignObjectMetadata)) {
            this.logger.log(`messageCampaign object not found for workspace ${workspaceId}, skipping`);
            return;
        }
        if (messageCampaignObjectMetadata.isSearchable) {
            this.logger.log(`messageCampaign is already searchable for workspace ${workspaceId}, skipping`);
            return;
        }
        this.logger.log(`${isDryRun ? '[DRY RUN] ' : ''}Making messageCampaign searchable for workspace ${workspaceId}`);
        if (isDryRun) {
            return;
        }
        const { twentyStandardFlatApplication } = await this.applicationService.findWorkspaceTwentyStandardAndCustomApplicationOrThrow({
            workspaceId
        });
        const validateAndBuildResult = await this.workspaceMigrationValidateBuildAndRunService.validateBuildAndRunWorkspaceMigration({
            isSystemBuild: true,
            applicationUniversalIdentifier: twentyStandardFlatApplication.universalIdentifier,
            workspaceId,
            allFlatEntityOperationByMetadataName: {
                objectMetadata: {
                    flatEntityToCreate: [],
                    flatEntityToDelete: [],
                    flatEntityToUpdate: [
                        {
                            ...messageCampaignObjectMetadata,
                            isSearchable: true,
                            updatedAt: new Date().toISOString()
                        }
                    ]
                }
            }
        });
        if (validateAndBuildResult.status === 'fail') {
            throw new Error(`Failed to make messageCampaign searchable for workspace ${workspaceId}: ${JSON.stringify(validateAndBuildResult, null, 2)}`);
        }
        this.logger.log(`Made messageCampaign searchable for workspace ${workspaceId}`);
    }
    async syncCampaignMetadata({ workspaceId, options }) {
        const { flatFieldMetadataMaps, flatObjectMetadataMaps } = await this.workspaceCacheService.getOrRecompute(workspaceId, [
            'flatFieldMetadataMaps',
            'flatObjectMetadataMaps'
        ]);
        const messageCampaignObject = (0, _findflatentitybyuniversalidentifierutil.findFlatEntityByUniversalIdentifier)({
            flatEntityMaps: flatObjectMetadataMaps,
            universalIdentifier: MESSAGE_CAMPAIGN.universalIdentifier
        });
        if (!(0, _utils.isDefined)(messageCampaignObject)) {
            this.logger.log(`messageCampaign object does not exist for workspace ${workspaceId}, skipping`);
            return;
        }
        const { twentyStandardFlatApplication } = await this.applicationService.findWorkspaceTwentyStandardAndCustomApplicationOrThrow({
            workspaceId
        });
        const { allFlatEntityMaps: standardAllFlatEntityMaps } = (0, _twentystandardapplicationallflatentitymapsconstant.computeTwentyStandardApplicationAllFlatEntityMaps)({
            now: new Date().toISOString(),
            workspaceId,
            twentyStandardApplicationId: twentyStandardFlatApplication.id
        });
        const standardFieldMaps = standardAllFlatEntityMaps.flatFieldMetadataMaps;
        const flatEntityToCreate = [];
        const flatEntityToUpdate = [];
        const plannedChanges = [];
        const selectOptionsToSync = [
            {
                label: 'CANCELED messageCampaign status',
                universalIdentifier: CAMPAIGN_STATUS_FIELD.universalIdentifier,
                expectedValue: _types.MessageCampaignStatus.CANCELED
            }
        ];
        for (const selectOption of selectOptionsToSync){
            const fieldToUpdate = this.buildSelectOptionsUpdate({
                workspaceId,
                workspaceFieldMaps: flatFieldMetadataMaps,
                standardFieldMaps,
                ...selectOption
            });
            if ((0, _utils.isDefined)(fieldToUpdate)) {
                flatEntityToUpdate.push(fieldToUpdate);
                plannedChanges.push(selectOption.label);
            }
        }
        if (plannedChanges.length === 0) {
            return;
        }
        const isDryRun = options.dryRun ?? false;
        if (isDryRun) {
            this.logger.log(`[DRY RUN] Would add ${plannedChanges.join(', ')} for workspace ${workspaceId}`);
            return;
        }
        const result = await this.workspaceMigrationValidateBuildAndRunService.validateBuildAndRunLegacyWorkspaceMigration({
            isSystemBuild: true,
            workspaceId,
            applicationUniversalIdentifier: twentyStandardFlatApplication.universalIdentifier,
            allFlatEntityOperationByMetadataName: {
                fieldMetadata: {
                    flatEntityToCreate,
                    flatEntityToDelete: [],
                    flatEntityToUpdate
                }
            }
        });
        if (result.status === 'fail') {
            this.logger.error(`Failed to sync message campaign metadata:\n${JSON.stringify(result, null, 2)}`);
            throw new Error(`Failed to sync message campaign metadata for workspace ${workspaceId}`);
        }
        this.logger.log(`Added ${plannedChanges.join(', ')} for workspace ${workspaceId}`);
    }
    buildSelectOptionsUpdate({ workspaceId, workspaceFieldMaps, standardFieldMaps, universalIdentifier, expectedValue, label }) {
        const workspaceField = (0, _findflatentitybyuniversalidentifierutil.findFlatEntityByUniversalIdentifier)({
            flatEntityMaps: workspaceFieldMaps,
            universalIdentifier
        });
        if (!(0, _utils.isDefined)(workspaceField)) {
            this.logger.log(`${label} select does not exist for workspace ${workspaceId}, skipping that option`);
            return undefined;
        }
        if (workspaceField.type !== _types.FieldMetadataType.SELECT) {
            throw new Error(`${label} is not a SELECT field for workspace ${workspaceId}`);
        }
        const hasOption = (workspaceField.options ?? []).some((option)=>option.value === expectedValue);
        if (hasOption) {
            return undefined;
        }
        const standardField = (0, _findflatentitybyuniversalidentifierutil.findFlatEntityByUniversalIdentifier)({
            flatEntityMaps: standardFieldMaps,
            universalIdentifier
        });
        if (!(0, _utils.isDefined)(standardField) || standardField.type !== _types.FieldMetadataType.SELECT) {
            throw new Error(`Standard application is missing the ${label} select`);
        }
        return {
            ...workspaceField,
            options: standardField.options,
            updatedAt: new Date().toISOString()
        };
    }
    constructor(workspaceIteratorService, applicationService, workspaceCacheService, workspaceMigrationValidateBuildAndRunService){
        super(workspaceIteratorService), this.workspaceIteratorService = workspaceIteratorService, this.applicationService = applicationService, this.workspaceCacheService = workspaceCacheService, this.workspaceMigrationValidateBuildAndRunService = workspaceMigrationValidateBuildAndRunService;
    }
};
SyncMessageCampaignSchemaCommand = _ts_decorate([
    (0, _registeredworkspacecommanddecorator.RegisteredWorkspaceCommand)('2.38.0', 1788200701000),
    (0, _nestcommander.Command)({
        name: 'upgrade:2-38:sync-message-campaign-schema',
        description: 'Bring existing workspaces to the MessageCampaign schema: standard objects, search, campaign metadata and message delivery metadata'
    }),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _workspaceiteratorservice.WorkspaceIteratorService === "undefined" ? Object : _workspaceiteratorservice.WorkspaceIteratorService,
        typeof _applicationservice.ApplicationService === "undefined" ? Object : _applicationservice.ApplicationService,
        typeof _workspacecacheservice.WorkspaceCacheService === "undefined" ? Object : _workspacecacheservice.WorkspaceCacheService,
        typeof _workspacemigrationvalidatebuildandrunservice.WorkspaceMigrationValidateBuildAndRunService === "undefined" ? Object : _workspacemigrationvalidatebuildandrunservice.WorkspaceMigrationValidateBuildAndRunService
    ])
], SyncMessageCampaignSchemaCommand);

//# sourceMappingURL=2-38-workspace-command-1788200701000-sync-message-campaign-schema.command.js.map