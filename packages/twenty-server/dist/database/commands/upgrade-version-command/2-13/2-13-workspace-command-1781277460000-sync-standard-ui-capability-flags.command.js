"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "SyncStandardUiCapabilityFlagsCommand", {
    enumerable: true,
    get: function() {
        return SyncStandardUiCapabilityFlagsCommand;
    }
});
const _typeorm = require("@nestjs/typeorm");
const _nestcommander = require("nest-commander");
const _typeorm1 = require("typeorm");
const _utils = require("twenty-shared/utils");
const _provisionedworkspacecommandrunner = require("../../command-runners/provisioned-workspace.command-runner");
const _workspaceiteratorservice = require("../../command-runners/workspace-iterator.service");
const _applicationservice = require("../../../../engine/core-modules/application/application.service");
const _registeredworkspacecommanddecorator = require("../../../../engine/core-modules/upgrade/decorators/registered-workspace-command.decorator");
const _workspacecacheservice = require("../../../../engine/workspace-cache/services/workspace-cache.service");
const _twentystandardapplicationallflatentitymapsconstant = require("../../../../engine/workspace-manager/twenty-standard-application/utils/twenty-standard-application-all-flat-entity-maps.constant");
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
let SyncStandardUiCapabilityFlagsCommand = class SyncStandardUiCapabilityFlagsCommand extends _provisionedworkspacecommandrunner.ProvisionedWorkspaceCommandRunner {
    async runOnWorkspace({ workspaceId, options }) {
        const isDryRun = options.dryRun ?? false;
        this.logger.log(`${isDryRun ? '[DRY RUN] ' : ''}Syncing standard UI capability flags for workspace ${workspaceId}`);
        const { twentyStandardFlatApplication } = await this.applicationService.findWorkspaceTwentyStandardAndCustomApplicationOrThrow({
            workspaceId
        });
        const { flatObjectMetadataMaps: existingFlatObjectMetadataMaps, flatFieldMetadataMaps: existingFlatFieldMetadataMaps } = await this.workspaceCacheService.getOrRecompute(workspaceId, [
            'flatObjectMetadataMaps',
            'flatFieldMetadataMaps'
        ]);
        const { allFlatEntityMaps: standardAllFlatEntityMaps } = (0, _twentystandardapplicationallflatentitymapsconstant.computeTwentyStandardApplicationAllFlatEntityMaps)({
            now: new Date().toISOString(),
            workspaceId,
            twentyStandardApplicationId: twentyStandardFlatApplication.id
        });
        const objectsToUpdate = Object.values(standardAllFlatEntityMaps.flatObjectMetadataMaps.byUniversalIdentifier).filter(_utils.isDefined).map((standardObject)=>{
            const existingObject = existingFlatObjectMetadataMaps.byUniversalIdentifier[standardObject.universalIdentifier];
            if (!(0, _utils.isDefined)(existingObject) || existingObject.isUICreatable === standardObject.isUICreatable && existingObject.isUIEditable === standardObject.isUIEditable) {
                return undefined;
            }
            return {
                ...existingObject,
                isUICreatable: standardObject.isUICreatable,
                isUIEditable: standardObject.isUIEditable,
                updatedAt: new Date().toISOString()
            };
        }).filter(_utils.isDefined);
        const fieldsToUpdate = Object.values(standardAllFlatEntityMaps.flatFieldMetadataMaps.byUniversalIdentifier).filter(_utils.isDefined).map((standardField)=>{
            const existingField = existingFlatFieldMetadataMaps.byUniversalIdentifier[standardField.universalIdentifier];
            if (!(0, _utils.isDefined)(existingField) || existingField.isUIEditable === standardField.isUIEditable) {
                return undefined;
            }
            return {
                ...existingField,
                isUIEditable: standardField.isUIEditable,
                updatedAt: new Date().toISOString()
            };
        }).filter(_utils.isDefined);
        if (objectsToUpdate.length === 0 && fieldsToUpdate.length === 0) {
            this.logger.log(`Standard UI capability flags already up to date for workspace ${workspaceId}`);
            return;
        }
        this.logger.log(`Found ${objectsToUpdate.length} standard object(s) and ${fieldsToUpdate.length} standard field(s) with drifted UI capability flags for workspace ${workspaceId}`);
        if (isDryRun) {
            this.logger.log(`[DRY RUN] Would sync UI capability flags on ${objectsToUpdate.length} standard object(s) and ${fieldsToUpdate.length} standard field(s) for workspace ${workspaceId}`);
            return;
        }
        // isUIEditable/isUICreatable are UI-affordance flags stored directly on
        // core.objectMetadata/core.fieldMetadata — changing them needs no
        // workspace-schema migration. We write them straight to the metadata
        // tables instead of going through validateBuildAndRunWorkspaceMigration:
        // that pipeline enforces user-facing mutation guards (system-field and
        // relation-field property allow-lists) that reject this trusted system
        // backfill on cross-version-upgraded workspaces.
        const fieldIdsToSetEditable = fieldsToUpdate.filter((field)=>field.isUIEditable).map((field)=>field.id);
        const fieldIdsToSetNonEditable = fieldsToUpdate.filter((field)=>!field.isUIEditable).map((field)=>field.id);
        // All writes for a workspace run in one transaction so a mid-run failure
        // can't leave the flags partially applied.
        const queryRunner = this.coreDataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            if (fieldIdsToSetEditable.length > 0) {
                await queryRunner.query(`UPDATE "core"."fieldMetadata" SET "isUIEditable" = true, "updatedAt" = now() WHERE "id" = ANY($1)`, [
                    fieldIdsToSetEditable
                ]);
            }
            if (fieldIdsToSetNonEditable.length > 0) {
                await queryRunner.query(`UPDATE "core"."fieldMetadata" SET "isUIEditable" = false, "updatedAt" = now() WHERE "id" = ANY($1)`, [
                    fieldIdsToSetNonEditable
                ]);
            }
            for (const objectToUpdate of objectsToUpdate){
                await queryRunner.query(`UPDATE "core"."objectMetadata" SET "isUICreatable" = $1, "isUIEditable" = $2, "updatedAt" = now() WHERE "id" = $3`, [
                    objectToUpdate.isUICreatable,
                    objectToUpdate.isUIEditable,
                    objectToUpdate.id
                ]);
            }
            await queryRunner.commitTransaction();
        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        } finally{
            await queryRunner.release();
        }
        // The raw writes bypass the metadata cache, so invalidate the flat maps the
        // app reads these flags from (after the transaction has committed). The
        // flags are already persisted, so a cache hiccup must not fail the upgrade —
        // a stale cache self-heals on the next flush / version bump.
        try {
            await this.workspaceCacheService.invalidateAndRecompute(workspaceId, [
                'flatObjectMetadataMaps',
                'flatFieldMetadataMaps'
            ]);
        } catch (cacheError) {
            this.logger.warn(`Synced UI capability flags for workspace ${workspaceId} but failed to invalidate the metadata cache: ${cacheError instanceof Error ? cacheError.message : String(cacheError)}`);
        }
        this.logger.log(`Successfully synced UI capability flags on ${objectsToUpdate.length} standard object(s) and ${fieldsToUpdate.length} standard field(s) for workspace ${workspaceId}`);
    }
    constructor(workspaceIteratorService, applicationService, workspaceCacheService, coreDataSource){
        super(workspaceIteratorService), this.workspaceIteratorService = workspaceIteratorService, this.applicationService = applicationService, this.workspaceCacheService = workspaceCacheService, this.coreDataSource = coreDataSource;
    }
};
SyncStandardUiCapabilityFlagsCommand = _ts_decorate([
    (0, _registeredworkspacecommanddecorator.RegisteredWorkspaceCommand)('2.13.0', 1781277460000),
    (0, _nestcommander.Command)({
        name: 'upgrade:2-13:sync-standard-ui-capability-flags',
        description: 'Re-sync isUICreatable and isUIEditable on standard objects and isUIEditable on standard fields from the standard-application definitions'
    }),
    _ts_param(3, (0, _typeorm.InjectDataSource)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _workspaceiteratorservice.WorkspaceIteratorService === "undefined" ? Object : _workspaceiteratorservice.WorkspaceIteratorService,
        typeof _applicationservice.ApplicationService === "undefined" ? Object : _applicationservice.ApplicationService,
        typeof _workspacecacheservice.WorkspaceCacheService === "undefined" ? Object : _workspacecacheservice.WorkspaceCacheService,
        typeof _typeorm1.DataSource === "undefined" ? Object : _typeorm1.DataSource
    ])
], SyncStandardUiCapabilityFlagsCommand);

//# sourceMappingURL=2-13-workspace-command-1781277460000-sync-standard-ui-capability-flags.command.js.map