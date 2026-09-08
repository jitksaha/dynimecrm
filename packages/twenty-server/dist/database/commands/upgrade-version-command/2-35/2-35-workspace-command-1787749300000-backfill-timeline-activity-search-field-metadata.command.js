"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "BackfillTimelineActivitySearchFieldMetadataCommand", {
    enumerable: true,
    get: function() {
        return BackfillTimelineActivitySearchFieldMetadataCommand;
    }
});
const _nestcommander = require("nest-commander");
const _application = require("twenty-shared/application");
const _metadata = require("twenty-shared/metadata");
const _utils = require("twenty-shared/utils");
const _provisionedworkspacecommandrunner = require("../../command-runners/provisioned-workspace.command-runner");
const _workspaceiteratorservice = require("../../command-runners/workspace-iterator.service");
const _registeredworkspacecommanddecorator = require("../../../../engine/core-modules/upgrade/decorators/registered-workspace-command.decorator");
const _findflatentitybyuniversalidentifierutil = require("../../../../engine/metadata-modules/flat-entity/utils/find-flat-entity-by-universal-identifier.util");
const _buildflatsearchfieldmetadataforfieldutil = require("../../../../engine/metadata-modules/flat-search-field-metadata/utils/build-flat-search-field-metadata-for-field.util");
const _workspacecacheservice = require("../../../../engine/workspace-cache/services/workspace-cache.service");
const _twentystandardapplicationallflatentitymapsconstant = require("../../../../engine/workspace-manager/twenty-standard-application/utils/twenty-standard-application-all-flat-entity-maps.constant");
const _workspacemigrationvalidatebuildandrunservice = require("../../../../engine/workspace-manager/workspace-migration/services/workspace-migration-validate-build-and-run-service");
const _workspacemigrationactiontypeconstant = require("../../../../engine/workspace-manager/workspace-migration/workspace-migration-builder/constants/workspace-migration-action-type.constant");
const _workspacemigrationrunnerservice = require("../../../../engine/workspace-manager/workspace-migration/workspace-migration-runner/services/workspace-migration-runner.service");
const _getworkspaceschemacontextformigrationutil = require("../../../../engine/workspace-manager/workspace-migration/workspace-migration-runner/utils/get-workspace-schema-context-for-migration.util");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
const TIMELINE_ACTIVITY = _metadata.STANDARD_OBJECTS.timelineActivity;
const LINKED_RECORD_CACHED_NAME_FIELD_UNIVERSAL_IDENTIFIER = TIMELINE_ACTIVITY.fields.linkedRecordCachedName.universalIdentifier;
const SEARCH_VECTOR_FIELD_UNIVERSAL_IDENTIFIER = TIMELINE_ACTIVITY.fields.searchVector.universalIdentifier;
let BackfillTimelineActivitySearchFieldMetadataCommand = class BackfillTimelineActivitySearchFieldMetadataCommand extends _provisionedworkspacecommandrunner.ProvisionedWorkspaceCommandRunner {
    async runOnWorkspace({ workspaceId, dataSource, options }) {
        const isDryRun = options.dryRun ?? false;
        const { flatObjectMetadataMaps, flatFieldMetadataMaps, flatSearchFieldMetadataMaps } = await this.workspaceCacheService.getOrRecompute(workspaceId, [
            'flatObjectMetadataMaps',
            'flatFieldMetadataMaps',
            'flatSearchFieldMetadataMaps'
        ]);
        const timelineActivityFlatObjectMetadata = (0, _findflatentitybyuniversalidentifierutil.findFlatEntityByUniversalIdentifier)({
            flatEntityMaps: flatObjectMetadataMaps,
            universalIdentifier: TIMELINE_ACTIVITY.universalIdentifier
        });
        if (!(0, _utils.isDefined)(timelineActivityFlatObjectMetadata)) {
            this.logger.log(`timelineActivity object does not exist for workspace ${workspaceId}, skipping`);
            return;
        }
        const linkedRecordCachedNameFlatFieldMetadata = (0, _findflatentitybyuniversalidentifierutil.findFlatEntityByUniversalIdentifier)({
            flatEntityMaps: flatFieldMetadataMaps,
            universalIdentifier: LINKED_RECORD_CACHED_NAME_FIELD_UNIVERSAL_IDENTIFIER
        });
        if (!(0, _utils.isDefined)(linkedRecordCachedNameFlatFieldMetadata)) {
            this.logger.log(`timelineActivity.linkedRecordCachedName does not exist for workspace ${workspaceId}, skipping`);
            return;
        }
        if (!(0, _utils.isDefined)(dataSource)) {
            this.logger.error(`Cannot verify the timelineActivity searchVector column for workspace ${workspaceId}: no data source. Skipping, rerun once the workspace is reachable.`);
            return;
        }
        const searchVectorFlatFieldMetadata = (0, _findflatentitybyuniversalidentifierutil.findFlatEntityByUniversalIdentifier)({
            flatEntityMaps: flatFieldMetadataMaps,
            universalIdentifier: SEARCH_VECTOR_FIELD_UNIVERSAL_IDENTIFIER
        });
        const standardFlatSearchFieldMetadata = flatSearchFieldMetadataMaps.byUniversalIdentifier[(0, _application.getSearchFieldUniversalIdentifier)({
            applicationUniversalIdentifier: timelineActivityFlatObjectMetadata.applicationUniversalIdentifier,
            fieldMetadataUniversalIdentifier: LINKED_RECORD_CACHED_NAME_FIELD_UNIVERSAL_IDENTIFIER
        })];
        // Without field metadata there is no column name to probe; the column is
        // gone with it and the create path recreates both.
        const searchVectorColumnExists = (0, _utils.isDefined)(searchVectorFlatFieldMetadata) ? await this.checkSearchVectorColumnExists({
            dataSource,
            workspaceId,
            timelineActivityFlatObjectMetadata,
            columnName: searchVectorFlatFieldMetadata.name
        }) : false;
        if ((0, _utils.isDefined)(standardFlatSearchFieldMetadata) && (0, _utils.isDefined)(searchVectorFlatFieldMetadata) && searchVectorColumnExists) {
            this.logger.log(`timelineActivity search vector already indexes linkedRecordCachedName for workspace ${workspaceId}, skipping`);
            return;
        }
        this.logger.log(`${isDryRun ? '[DRY RUN] ' : ''}Restoring the timelineActivity ${[
            ...(0, _utils.isDefined)(standardFlatSearchFieldMetadata) ? [] : [
                'search field metadata'
            ],
            ...(0, _utils.isDefined)(searchVectorFlatFieldMetadata) ? [] : [
                'searchVector field'
            ],
            ...searchVectorColumnExists ? [] : [
                'searchVector column'
            ]
        ].join(' and ')} for workspace ${workspaceId}`);
        if (isDryRun) {
            return;
        }
        if ((0, _utils.isDefined)(standardFlatSearchFieldMetadata) && (0, _utils.isDefined)(searchVectorFlatFieldMetadata)) {
            // Metadata is already converged and only the physical column is missing.
            // The builder diffs metadata so it would produce no action here; dispatch
            // the rebuild directly to the update-field action handler instead, which
            // drops and recreates the generated column from the search field metadata.
            const rebuildSearchVectorAction = {
                type: _workspacemigrationactiontypeconstant.WORKSPACE_MIGRATION_ACTION_TYPE.update,
                metadataName: 'fieldMetadata',
                universalIdentifier: SEARCH_VECTOR_FIELD_UNIVERSAL_IDENTIFIER,
                update: {},
                rebuildSearchVector: true
            };
            await this.workspaceMigrationRunnerService.run({
                workspaceMigration: {
                    applicationUniversalIdentifier: timelineActivityFlatObjectMetadata.applicationUniversalIdentifier,
                    actions: [
                        rebuildSearchVectorAction
                    ]
                },
                workspaceId
            });
            this.logger.log(`Restored the timelineActivity search vector column for workspace ${workspaceId}`);
            return;
        }
        const validateAndBuildResult = await this.workspaceMigrationValidateBuildAndRunService.validateBuildAndRunLegacyWorkspaceMigration({
            isSystemBuild: true,
            workspaceId,
            applicationUniversalIdentifier: timelineActivityFlatObjectMetadata.applicationUniversalIdentifier,
            allFlatEntityOperationByMetadataName: {
                fieldMetadata: {
                    flatEntityToCreate: (0, _utils.isDefined)(searchVectorFlatFieldMetadata) ? [] : [
                        this.getStandardSearchVectorFlatFieldMetadata({
                            workspaceId,
                            twentyStandardApplicationId: timelineActivityFlatObjectMetadata.applicationId
                        })
                    ],
                    flatEntityToDelete: [],
                    flatEntityToUpdate: []
                },
                searchFieldMetadata: {
                    flatEntityToCreate: (0, _utils.isDefined)(standardFlatSearchFieldMetadata) ? [] : [
                        (0, _buildflatsearchfieldmetadataforfieldutil.buildFlatSearchFieldMetadataForField)({
                            flatObjectMetadata: timelineActivityFlatObjectMetadata,
                            flatFieldMetadata: linkedRecordCachedNameFlatFieldMetadata,
                            tsVectorFlatFieldMetadata: {
                                universalIdentifier: SEARCH_VECTOR_FIELD_UNIVERSAL_IDENTIFIER
                            },
                            position: 0
                        })
                    ],
                    flatEntityToDelete: [],
                    flatEntityToUpdate: []
                }
            }
        });
        if (validateAndBuildResult.status === 'fail') {
            throw new Error(`Failed to restore the timelineActivity search field metadata for workspace ${workspaceId}:\n${JSON.stringify(validateAndBuildResult, null, 2)}`);
        }
        this.logger.log(`Restored the timelineActivity search vector for workspace ${workspaceId}`);
    }
    async checkSearchVectorColumnExists({ dataSource, workspaceId, timelineActivityFlatObjectMetadata, columnName }) {
        const { schemaName, tableName } = (0, _getworkspaceschemacontextformigrationutil.getWorkspaceSchemaContextForMigration)({
            workspaceId,
            objectMetadata: timelineActivityFlatObjectMetadata
        });
        // pg_attribute scoped to the single table, not the instance-wide
        // information_schema.columns view, which is slow on many-tenant instances.
        const rows = await dataSource.query(`SELECT EXISTS (
         SELECT 1 FROM pg_attribute
         WHERE attrelid = to_regclass($1)
           AND attname = $2
           AND NOT attisdropped
       ) AS "exists"`, [
            `"${schemaName}"."${tableName}"`,
            columnName
        ]);
        return rows[0]?.exists === true;
    }
    getStandardSearchVectorFlatFieldMetadata({ workspaceId, twentyStandardApplicationId }) {
        const { allFlatEntityMaps: standardAllFlatEntityMaps } = (0, _twentystandardapplicationallflatentitymapsconstant.computeTwentyStandardApplicationAllFlatEntityMaps)({
            now: new Date().toISOString(),
            workspaceId,
            twentyStandardApplicationId
        });
        const standardSearchVectorFlatFieldMetadata = (0, _findflatentitybyuniversalidentifierutil.findFlatEntityByUniversalIdentifier)({
            flatEntityMaps: standardAllFlatEntityMaps.flatFieldMetadataMaps,
            universalIdentifier: SEARCH_VECTOR_FIELD_UNIVERSAL_IDENTIFIER
        });
        if (!(0, _utils.isDefined)(standardSearchVectorFlatFieldMetadata)) {
            throw new Error('Standard application is missing timelineActivity.searchVector');
        }
        return {
            ...standardSearchVectorFlatFieldMetadata,
            viewFieldIds: [],
            viewFieldUniversalIdentifiers: []
        };
    }
    constructor(workspaceIteratorService, workspaceCacheService, workspaceMigrationValidateBuildAndRunService, workspaceMigrationRunnerService){
        super(workspaceIteratorService), this.workspaceIteratorService = workspaceIteratorService, this.workspaceCacheService = workspaceCacheService, this.workspaceMigrationValidateBuildAndRunService = workspaceMigrationValidateBuildAndRunService, this.workspaceMigrationRunnerService = workspaceMigrationRunnerService;
    }
};
BackfillTimelineActivitySearchFieldMetadataCommand = _ts_decorate([
    (0, _registeredworkspacecommanddecorator.RegisteredWorkspaceCommand)('2.35.0', 1787749300000),
    (0, _nestcommander.Command)({
        name: 'upgrade:2-35:backfill-timeline-activity-search-field-metadata',
        description: 'Create the timelineActivity linkedRecordCachedName search field metadata row where it is missing, restoring the searchVector field itself when the workspace lost it, and rebuild the physical searchVector column when it was dropped at the database level while the metadata survived. Workspaces upgraded from before the 2.33 search repoint never had this row, and dropping the legacy name field cascades away both their old row and the generated column. Idempotent.'
    }),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _workspaceiteratorservice.WorkspaceIteratorService === "undefined" ? Object : _workspaceiteratorservice.WorkspaceIteratorService,
        typeof _workspacecacheservice.WorkspaceCacheService === "undefined" ? Object : _workspacecacheservice.WorkspaceCacheService,
        typeof _workspacemigrationvalidatebuildandrunservice.WorkspaceMigrationValidateBuildAndRunService === "undefined" ? Object : _workspacemigrationvalidatebuildandrunservice.WorkspaceMigrationValidateBuildAndRunService,
        typeof _workspacemigrationrunnerservice.WorkspaceMigrationRunnerService === "undefined" ? Object : _workspacemigrationrunnerservice.WorkspaceMigrationRunnerService
    ])
], BackfillTimelineActivitySearchFieldMetadataCommand);

//# sourceMappingURL=2-35-workspace-command-1787749300000-backfill-timeline-activity-search-field-metadata.command.js.map