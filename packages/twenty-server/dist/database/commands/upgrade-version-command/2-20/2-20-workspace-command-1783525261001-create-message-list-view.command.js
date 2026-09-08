"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "CreateMessageListViewCommand", {
    enumerable: true,
    get: function() {
        return CreateMessageListViewCommand;
    }
});
const _nestcommander = require("nest-commander");
const _metadata = require("twenty-shared/metadata");
const _utils = require("twenty-shared/utils");
const _provisionedworkspacecommandrunner = require("../../command-runners/provisioned-workspace.command-runner");
const _workspaceiteratorservice = require("../../command-runners/workspace-iterator.service");
const _applicationservice = require("../../../../engine/core-modules/application/application.service");
const _registeredworkspacecommanddecorator = require("../../../../engine/core-modules/upgrade/decorators/registered-workspace-command.decorator");
const _findflatentitybyuniversalidentifierutil = require("../../../../engine/metadata-modules/flat-entity/utils/find-flat-entity-by-universal-identifier.util");
const _twentystandardapplicationallflatentitymapsconstant = require("../../../../engine/workspace-manager/twenty-standard-application/utils/twenty-standard-application-all-flat-entity-maps.constant");
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
const LIST = _metadata.STANDARD_OBJECTS.messageList;
const LIST_VIEW_UNIVERSAL_IDENTIFIER = LIST.views.allMessageLists.universalIdentifier;
const LIST_VIEW_FIELD_UNIVERSAL_IDENTIFIERS = Object.values(LIST.views.allMessageLists.viewFields).map((viewField)=>viewField.universalIdentifier);
let CreateMessageListViewCommand = class CreateMessageListViewCommand extends _provisionedworkspacecommandrunner.ProvisionedWorkspaceCommandRunner {
    async runOnWorkspace({ workspaceId, options }) {
        const isDryRun = options.dryRun ?? false;
        const { flatObjectMetadataMaps, flatViewMaps, flatViewFieldMaps } = await this.workspaceCacheService.getOrRecompute(workspaceId, [
            'flatObjectMetadataMaps',
            'flatViewMaps',
            'flatViewFieldMaps'
        ]);
        const listObjectMetadata = (0, _findflatentitybyuniversalidentifierutil.findFlatEntityByUniversalIdentifier)({
            flatEntityMaps: flatObjectMetadataMaps,
            universalIdentifier: LIST.universalIdentifier
        });
        if (!(0, _utils.isDefined)(listObjectMetadata)) {
            this.logger.log(`messageList object does not exist for workspace ${workspaceId}, skipping`);
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
        const viewsToCreate = this.resolveViewsToCreate({
            flatViewMaps,
            standardAllFlatEntityMaps
        });
        const viewFieldsToCreate = LIST_VIEW_FIELD_UNIVERSAL_IDENTIFIERS.filter((universalIdentifier)=>!(0, _utils.isDefined)(flatViewFieldMaps.byUniversalIdentifier[universalIdentifier])).map((universalIdentifier)=>{
            const standardViewField = (0, _findflatentitybyuniversalidentifierutil.findFlatEntityByUniversalIdentifier)({
                flatEntityMaps: standardAllFlatEntityMaps.flatViewFieldMaps,
                universalIdentifier
            });
            if (!(0, _utils.isDefined)(standardViewField)) {
                throw new Error(`Standard application is missing messageList view column ${universalIdentifier}`);
            }
            return standardViewField;
        });
        if (viewsToCreate.length === 0 && viewFieldsToCreate.length === 0) {
            this.logger.log(`messageList view already exists for workspace ${workspaceId}, skipping`);
            return;
        }
        if (isDryRun) {
            this.logger.log(`[DRY RUN] Workspace ${workspaceId}: ${viewsToCreate.length} view(s), ${viewFieldsToCreate.length} view column(s)`);
            return;
        }
        const result = await this.workspaceMigrationValidateBuildAndRunService.validateBuildAndRunWorkspaceMigration({
            isSystemBuild: true,
            workspaceId,
            applicationUniversalIdentifier: twentyStandardFlatApplication.universalIdentifier,
            allFlatEntityOperationByMetadataName: {
                view: {
                    flatEntityToCreate: viewsToCreate,
                    flatEntityToDelete: [],
                    flatEntityToUpdate: []
                },
                viewField: {
                    flatEntityToCreate: viewFieldsToCreate,
                    flatEntityToDelete: [],
                    flatEntityToUpdate: []
                }
            }
        });
        if (result.status === 'fail') {
            this.logger.error(`Failed to create messageList view:\n${JSON.stringify(result, null, 2)}`);
            throw new Error(`Failed to create messageList view for workspace ${workspaceId}`);
        }
        this.logger.log(`Created messageList view for workspace ${workspaceId}`);
    }
    resolveViewsToCreate({ flatViewMaps, standardAllFlatEntityMaps }) {
        if ((0, _utils.isDefined)(flatViewMaps.byUniversalIdentifier[LIST_VIEW_UNIVERSAL_IDENTIFIER])) {
            return [];
        }
        const standardView = (0, _findflatentitybyuniversalidentifierutil.findFlatEntityByUniversalIdentifier)({
            flatEntityMaps: standardAllFlatEntityMaps.flatViewMaps,
            universalIdentifier: LIST_VIEW_UNIVERSAL_IDENTIFIER
        });
        if (!(0, _utils.isDefined)(standardView)) {
            throw new Error(`Standard application is missing messageList view ${LIST_VIEW_UNIVERSAL_IDENTIFIER}`);
        }
        return [
            standardView
        ];
    }
    constructor(workspaceIteratorService, applicationService, workspaceCacheService, workspaceMigrationValidateBuildAndRunService){
        super(workspaceIteratorService), this.workspaceIteratorService = workspaceIteratorService, this.applicationService = applicationService, this.workspaceCacheService = workspaceCacheService, this.workspaceMigrationValidateBuildAndRunService = workspaceMigrationValidateBuildAndRunService;
    }
};
CreateMessageListViewCommand = _ts_decorate([
    (0, _registeredworkspacecommanddecorator.RegisteredWorkspaceCommand)('2.20.0', 1783525261001),
    (0, _nestcommander.Command)({
        name: 'upgrade:2-20:create-message-list-view',
        description: 'Create the MessageList standard view and its columns on existing workspaces'
    }),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _workspaceiteratorservice.WorkspaceIteratorService === "undefined" ? Object : _workspaceiteratorservice.WorkspaceIteratorService,
        typeof _applicationservice.ApplicationService === "undefined" ? Object : _applicationservice.ApplicationService,
        typeof _workspacecacheservice.WorkspaceCacheService === "undefined" ? Object : _workspacecacheservice.WorkspaceCacheService,
        typeof _workspacemigrationvalidatebuildandrunservice.WorkspaceMigrationValidateBuildAndRunService === "undefined" ? Object : _workspacemigrationvalidatebuildandrunservice.WorkspaceMigrationValidateBuildAndRunService
    ])
], CreateMessageListViewCommand);

//# sourceMappingURL=2-20-workspace-command-1783525261001-create-message-list-view.command.js.map