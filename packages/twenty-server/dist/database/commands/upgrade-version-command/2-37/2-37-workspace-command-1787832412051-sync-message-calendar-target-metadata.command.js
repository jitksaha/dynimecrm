"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "SyncMessageCalendarTargetMetadataCommand", {
    enumerable: true,
    get: function() {
        return SyncMessageCalendarTargetMetadataCommand;
    }
});
const _nestcommander = require("nest-commander");
const _metadata = require("twenty-shared/metadata");
const _provisionedworkspacecommandrunner = require("../../command-runners/provisioned-workspace.command-runner");
const _workspaceiteratorservice = require("../../command-runners/workspace-iterator.service");
const _getstandardflatentitiestocreateorthrowutil = require("../2-10/utils/get-standard-flat-entities-to-create-or-throw.util");
const _buildtargetmetadatacollisionrenamesutil = require("./utils/build-target-metadata-collision-renames.util");
const _applicationservice = require("../../../../engine/core-modules/application/application.service");
const _registeredworkspacecommanddecorator = require("../../../../engine/core-modules/upgrade/decorators/registered-workspace-command.decorator");
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
const getUniversalIdentifiers = (entitiesByName)=>Object.values(entitiesByName).map(({ universalIdentifier })=>universalIdentifier);
const TARGET_OBJECT_UNIVERSAL_IDENTIFIERS = [
    _metadata.STANDARD_OBJECTS.calendarEventTarget.universalIdentifier,
    _metadata.STANDARD_OBJECTS.messageThreadTarget.universalIdentifier
];
const TARGET_FIELD_UNIVERSAL_IDENTIFIERS = [
    ...getUniversalIdentifiers(_metadata.STANDARD_OBJECTS.calendarEventTarget.fields),
    ...getUniversalIdentifiers(_metadata.STANDARD_OBJECTS.messageThreadTarget.fields),
    _metadata.STANDARD_OBJECTS.calendarEvent.fields.calendarEventTargets.universalIdentifier,
    _metadata.STANDARD_OBJECTS.messageThread.fields.messageThreadTargets.universalIdentifier,
    ...[
        'person',
        'company',
        'opportunity'
    ].flatMap((objectName)=>[
            _metadata.STANDARD_OBJECTS[objectName].fields.calendarEventTargets.universalIdentifier,
            _metadata.STANDARD_OBJECTS[objectName].fields.messageThreadTargets.universalIdentifier
        ])
];
const TARGET_INDEX_UNIVERSAL_IDENTIFIERS = [
    ...getUniversalIdentifiers(_metadata.STANDARD_OBJECTS.calendarEventTarget.indexes),
    ...getUniversalIdentifiers(_metadata.STANDARD_OBJECTS.messageThreadTarget.indexes)
];
let SyncMessageCalendarTargetMetadataCommand = class SyncMessageCalendarTargetMetadataCommand extends _provisionedworkspacecommandrunner.ProvisionedWorkspaceCommandRunner {
    async runOnWorkspace({ workspaceId, options }) {
        const isDryRun = options.dryRun ?? false;
        const { flatObjectMetadataMaps, flatFieldMetadataMaps, flatIndexMaps } = await this.workspaceCacheService.getOrRecompute(workspaceId, [
            'flatObjectMetadataMaps',
            'flatFieldMetadataMaps',
            'flatIndexMaps'
        ]);
        const requiredObjectNames = [
            'calendarEvent',
            'messageThread',
            'person',
            'company',
            'opportunity'
        ];
        const missingObjectNames = requiredObjectNames.filter((objectName)=>!flatObjectMetadataMaps.byUniversalIdentifier[_metadata.STANDARD_OBJECTS[objectName].universalIdentifier]);
        if (missingObjectNames.length > 0) {
            this.logger.warn(`Skipping message and calendar target metadata for workspace ${workspaceId}: missing ${missingObjectNames.join(', ')} metadata`);
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
        const objectRenameUpdates = (0, _buildtargetmetadatacollisionrenamesutil.buildTargetObjectCollisionRenameUpdates)({
            flatObjectMetadataMaps,
            now
        });
        const fieldRenameUpdates = (0, _buildtargetmetadatacollisionrenamesutil.buildTargetFieldCollisionRenameUpdates)({
            flatFieldMetadataMaps,
            now
        });
        const allFlatEntityOperationByMetadataName = {
            objectMetadata: {
                flatEntityToCreate: (0, _getstandardflatentitiestocreateorthrowutil.getStandardFlatEntitiesToCreateOrThrow)({
                    standardFlatEntityMaps: standardAllFlatEntityMaps.flatObjectMetadataMaps,
                    existingFlatEntityMaps: flatObjectMetadataMaps,
                    universalIdentifiers: TARGET_OBJECT_UNIVERSAL_IDENTIFIERS
                }),
                flatEntityToDelete: [],
                flatEntityToUpdate: []
            },
            fieldMetadata: {
                flatEntityToCreate: (0, _getstandardflatentitiestocreateorthrowutil.getStandardFlatEntitiesToCreateOrThrow)({
                    standardFlatEntityMaps: standardAllFlatEntityMaps.flatFieldMetadataMaps,
                    existingFlatEntityMaps: flatFieldMetadataMaps,
                    universalIdentifiers: TARGET_FIELD_UNIVERSAL_IDENTIFIERS
                }),
                flatEntityToDelete: [],
                flatEntityToUpdate: []
            },
            index: {
                flatEntityToCreate: (0, _getstandardflatentitiestocreateorthrowutil.getStandardFlatEntitiesToCreateOrThrow)({
                    standardFlatEntityMaps: standardAllFlatEntityMaps.flatIndexMaps,
                    existingFlatEntityMaps: flatIndexMaps,
                    universalIdentifiers: TARGET_INDEX_UNIVERSAL_IDENTIFIERS
                }),
                flatEntityToDelete: [],
                flatEntityToUpdate: []
            }
        };
        const createOperationCount = Object.values(allFlatEntityOperationByMetadataName).reduce((count, operations)=>count + operations.flatEntityToCreate.length, 0);
        const totalOperationCount = objectRenameUpdates.length + fieldRenameUpdates.length + createOperationCount;
        if (totalOperationCount === 0) {
            this.logger.log(`Message and calendar target metadata already exists for workspace ${workspaceId}, skipping`);
            return;
        }
        if (isDryRun) {
            this.logger.log(`[DRY RUN] Would rename ${objectRenameUpdates.length} object and ${fieldRenameUpdates.length} field collision(s), then create ${createOperationCount} target metadata entities for workspace ${workspaceId}`);
            return;
        }
        for (const flatObjectMetadata of objectRenameUpdates){
            await this.runRenameMigration({
                workspaceId,
                applicationUniversalIdentifier: flatObjectMetadata.applicationUniversalIdentifier,
                allFlatEntityOperationByMetadataName: {
                    objectMetadata: {
                        flatEntityToCreate: [],
                        flatEntityToDelete: [],
                        flatEntityToUpdate: [
                            flatObjectMetadata
                        ]
                    }
                }
            });
        }
        for (const flatFieldMetadata of fieldRenameUpdates){
            await this.runRenameMigration({
                workspaceId,
                applicationUniversalIdentifier: flatFieldMetadata.applicationUniversalIdentifier,
                allFlatEntityOperationByMetadataName: {
                    fieldMetadata: {
                        flatEntityToCreate: [],
                        flatEntityToDelete: [],
                        flatEntityToUpdate: [
                            flatFieldMetadata
                        ]
                    }
                }
            });
        }
        if (createOperationCount > 0) {
            const result = await this.workspaceMigrationValidateBuildAndRunService.validateBuildAndRunLegacyWorkspaceMigration({
                allFlatEntityOperationByMetadataName,
                workspaceId,
                isSystemBuild: true,
                applicationUniversalIdentifier: twentyStandardFlatApplication.universalIdentifier
            });
            if (result.status === 'fail') {
                throw new Error(`Failed to create message and calendar target metadata for workspace ${workspaceId}: ${JSON.stringify(result, null, 2)}`);
            }
        }
        this.logger.log(`Created message and calendar target metadata for workspace ${workspaceId}`);
    }
    async runRenameMigration({ workspaceId, applicationUniversalIdentifier, allFlatEntityOperationByMetadataName }) {
        const result = await this.workspaceMigrationValidateBuildAndRunService.validateBuildAndRunLegacyWorkspaceMigration({
            allFlatEntityOperationByMetadataName,
            workspaceId,
            isSystemBuild: true,
            applicationUniversalIdentifier
        });
        if (result.status === 'fail') {
            throw new Error(`Failed to rename target metadata collision for workspace ${workspaceId}: ${JSON.stringify(result, null, 2)}`);
        }
    }
    constructor(workspaceIteratorService, applicationService, workspaceCacheService, workspaceMigrationValidateBuildAndRunService){
        super(workspaceIteratorService), this.workspaceIteratorService = workspaceIteratorService, this.applicationService = applicationService, this.workspaceCacheService = workspaceCacheService, this.workspaceMigrationValidateBuildAndRunService = workspaceMigrationValidateBuildAndRunService;
    }
};
SyncMessageCalendarTargetMetadataCommand = _ts_decorate([
    (0, _registeredworkspacecommanddecorator.RegisteredWorkspaceCommand)('2.37.0', 1787832412051),
    (0, _nestcommander.Command)({
        name: 'upgrade:2-37:sync-message-calendar-target-metadata',
        description: 'Create messageThreadTarget and calendarEventTarget standard metadata in existing workspaces'
    }),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _workspaceiteratorservice.WorkspaceIteratorService === "undefined" ? Object : _workspaceiteratorservice.WorkspaceIteratorService,
        typeof _applicationservice.ApplicationService === "undefined" ? Object : _applicationservice.ApplicationService,
        typeof _workspacecacheservice.WorkspaceCacheService === "undefined" ? Object : _workspacecacheservice.WorkspaceCacheService,
        typeof _workspacemigrationvalidatebuildandrunservice.WorkspaceMigrationValidateBuildAndRunService === "undefined" ? Object : _workspacemigrationvalidatebuildandrunservice.WorkspaceMigrationValidateBuildAndRunService
    ])
], SyncMessageCalendarTargetMetadataCommand);

//# sourceMappingURL=2-37-workspace-command-1787832412051-sync-message-calendar-target-metadata.command.js.map