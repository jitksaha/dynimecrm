"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "RenameConflictingCustomFieldsCommand", {
    enumerable: true,
    get: function() {
        return RenameConflictingCustomFieldsCommand;
    }
});
const _nestcommander = require("nest-commander");
const _metadata = require("twenty-shared/metadata");
const _utils = require("twenty-shared/utils");
const _provisionedworkspacecommandrunner = require("../../command-runners/provisioned-workspace.command-runner");
const _workspaceiteratorservice = require("../../command-runners/workspace-iterator.service");
const _registeredworkspacecommanddecorator = require("../../../../engine/core-modules/upgrade/decorators/registered-workspace-command.decorator");
const _workspacecacheservice = require("../../../../engine/workspace-cache/services/workspace-cache.service");
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
const NEW_STANDARD_FIELDS = [
    {
        fieldName: 'annualRevenue',
        objectUniversalIdentifier: _metadata.STANDARD_OBJECTS.company.universalIdentifier
    }
];
const computeAvailableFieldName = (baseFieldName, takenFieldNames)=>{
    let candidateFieldName = `${baseFieldName}Custom`;
    let suffix = 2;
    while(takenFieldNames.has(candidateFieldName)){
        candidateFieldName = `${baseFieldName}Custom${suffix}`;
        suffix++;
    }
    return candidateFieldName;
};
let RenameConflictingCustomFieldsCommand = class RenameConflictingCustomFieldsCommand extends _provisionedworkspacecommandrunner.ProvisionedWorkspaceCommandRunner {
    async runOnWorkspace({ workspaceId, options }) {
        const isDryRun = options.dryRun ?? false;
        const { flatFieldMetadataMaps } = await this.workspaceCacheService.getOrRecompute(workspaceId, [
            'flatFieldMetadataMaps'
        ]);
        const allFlatFieldMetadatas = Object.values(flatFieldMetadataMaps.byUniversalIdentifier).filter(_utils.isDefined);
        const takenFieldNamesByObject = new Map();
        for (const flatFieldMetadata of allFlatFieldMetadatas){
            const takenFieldNames = takenFieldNamesByObject.get(flatFieldMetadata.objectMetadataUniversalIdentifier) ?? new Set();
            takenFieldNames.add(flatFieldMetadata.name);
            takenFieldNamesByObject.set(flatFieldMetadata.objectMetadataUniversalIdentifier, takenFieldNames);
        }
        const fieldsToRename = [];
        for (const { fieldName, objectUniversalIdentifier } of NEW_STANDARD_FIELDS){
            const conflictingField = allFlatFieldMetadatas.find((flatFieldMetadata)=>flatFieldMetadata.objectMetadataUniversalIdentifier === objectUniversalIdentifier && flatFieldMetadata.name === fieldName);
            if (!(0, _utils.isDefined)(conflictingField)) {
                continue;
            }
            if (!conflictingField.isCustom) {
                this.logger.warn(`Non-custom field named "${fieldName}" exists on object ${objectUniversalIdentifier} for workspace ${workspaceId}; skipping rename`);
                continue;
            }
            const takenFieldNames = takenFieldNamesByObject.get(objectUniversalIdentifier) ?? new Set();
            const newName = computeAvailableFieldName(fieldName, takenFieldNames);
            takenFieldNames.add(newName);
            fieldsToRename.push({
                field: conflictingField,
                newName
            });
        }
        if (fieldsToRename.length === 0) {
            this.logger.log(`No custom fields conflict with the new standard field names for workspace ${workspaceId}`);
            return;
        }
        this.logger.log(`${isDryRun ? '[DRY RUN] ' : ''}Renaming ${fieldsToRename.length} conflicting custom field(s) for workspace ${workspaceId}: ${fieldsToRename.map(({ field, newName })=>`${field.name} -> ${newName}`).join(', ')}`);
        if (isDryRun) {
            return;
        }
        const fieldsToRenameByApplication = fieldsToRename.reduce((fieldsByApplication, fieldToRename)=>{
            const applicationUniversalIdentifier = fieldToRename.field.applicationUniversalIdentifier;
            const fieldsForApplication = fieldsByApplication.get(applicationUniversalIdentifier) ?? [];
            fieldsForApplication.push(fieldToRename);
            fieldsByApplication.set(applicationUniversalIdentifier, fieldsForApplication);
            return fieldsByApplication;
        }, new Map());
        for (const [applicationUniversalIdentifier, fieldsForApplication] of fieldsToRenameByApplication){
            const flatEntityToUpdate = fieldsForApplication.map(({ field, newName })=>({
                    ...field,
                    name: newName,
                    label: `${field.label} (custom)`,
                    isLabelSyncedWithName: false
                }));
            const validateAndBuildResult = await this.workspaceMigrationValidateBuildAndRunService.validateBuildAndRunLegacyWorkspaceMigration({
                allFlatEntityOperationByMetadataName: {
                    fieldMetadata: {
                        flatEntityToCreate: [],
                        flatEntityToDelete: [],
                        flatEntityToUpdate
                    }
                },
                workspaceId,
                isSystemBuild: true,
                applicationUniversalIdentifier
            });
            if (validateAndBuildResult.status === 'fail') {
                this.logger.error(`Failed to rename conflicting custom fields:\n${JSON.stringify(validateAndBuildResult, null, 2)}`);
                throw new Error(`Failed to rename conflicting custom fields for workspace ${workspaceId}`);
            }
        }
        this.logger.log(`Renamed ${fieldsToRename.length} conflicting custom field(s) for workspace ${workspaceId}`);
    }
    constructor(workspaceIteratorService, workspaceCacheService, workspaceMigrationValidateBuildAndRunService){
        super(workspaceIteratorService), this.workspaceIteratorService = workspaceIteratorService, this.workspaceCacheService = workspaceCacheService, this.workspaceMigrationValidateBuildAndRunService = workspaceMigrationValidateBuildAndRunService;
    }
};
RenameConflictingCustomFieldsCommand = _ts_decorate([
    (0, _registeredworkspacecommanddecorator.RegisteredWorkspaceCommand)('2.10.0', 1799000045000),
    (0, _nestcommander.Command)({
        name: 'upgrade:2-10:rename-conflicting-custom-fields',
        description: 'Rename a pre-existing custom field whose name collides with the new generic standard field (Company annualRevenue), preserving its data, so the standard field can be added'
    }),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _workspaceiteratorservice.WorkspaceIteratorService === "undefined" ? Object : _workspaceiteratorservice.WorkspaceIteratorService,
        typeof _workspacecacheservice.WorkspaceCacheService === "undefined" ? Object : _workspacecacheservice.WorkspaceCacheService,
        typeof _workspacemigrationvalidatebuildandrunservice.WorkspaceMigrationValidateBuildAndRunService === "undefined" ? Object : _workspacemigrationvalidatebuildandrunservice.WorkspaceMigrationValidateBuildAndRunService
    ])
], RenameConflictingCustomFieldsCommand);

//# sourceMappingURL=2-10-workspace-command-1799000045000-rename-conflicting-custom-fields.command.js.map