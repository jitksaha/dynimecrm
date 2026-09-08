"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "BackfillFieldsWidgetNewFieldDefaultVisibilityCommand", {
    enumerable: true,
    get: function() {
        return BackfillFieldsWidgetNewFieldDefaultVisibilityCommand;
    }
});
const _nestcommander = require("nest-commander");
const _utils = require("twenty-shared/utils");
const _provisionedworkspacecommandrunner = require("../../command-runners/provisioned-workspace.command-runner");
const _workspaceiteratorservice = require("../../command-runners/workspace-iterator.service");
const _registeredworkspacecommanddecorator = require("../../../../engine/core-modules/upgrade/decorators/registered-workspace-command.decorator");
const _isflatpagelayoutwidgetconfigurationoftypeutil = require("../../../../engine/metadata-modules/flat-page-layout-widget/utils/is-flat-page-layout-widget-configuration-of-type.util");
const _widgetconfigurationtypetype = require("../../../../engine/metadata-modules/page-layout-widget/enums/widget-configuration-type.type");
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
let BackfillFieldsWidgetNewFieldDefaultVisibilityCommand = class BackfillFieldsWidgetNewFieldDefaultVisibilityCommand extends _provisionedworkspacecommandrunner.ProvisionedWorkspaceCommandRunner {
    async runOnWorkspace({ workspaceId, options }) {
        const isDryRun = options.dryRun ?? false;
        const { flatPageLayoutWidgetMaps } = await this.workspaceCacheService.getOrRecompute(workspaceId, [
            'flatPageLayoutWidgetMaps'
        ]);
        const widgetsToBackfill = Object.values(flatPageLayoutWidgetMaps.byUniversalIdentifier).filter(_utils.isDefined).filter((widget)=>(0, _isflatpagelayoutwidgetconfigurationoftypeutil.isFlatPageLayoutWidgetConfigurationOfType)(widget, _widgetconfigurationtypetype.WidgetConfigurationType.FIELDS) && !(0, _utils.isDefined)(widget.configuration.newFieldDefaultVisibility));
        if (widgetsToBackfill.length === 0) {
            this.logger.log(`No FIELDS widgets to backfill in workspace ${workspaceId}`);
            return;
        }
        if (isDryRun) {
            this.logger.log(`[DRY RUN] Would backfill ${widgetsToBackfill.length} FIELDS widget(s) in workspace ${workspaceId}`);
            return;
        }
        const widgetsToBackfillByApplicationUniversalIdentifier = new Map();
        for (const widget of widgetsToBackfill){
            const updatedWidget = {
                ...widget,
                configuration: {
                    ...widget.configuration,
                    newFieldDefaultVisibility: true
                },
                universalConfiguration: (0, _utils.isDefined)(widget.universalConfiguration) ? {
                    ...widget.universalConfiguration,
                    newFieldDefaultVisibility: true
                } : widget.universalConfiguration
            };
            const existingWidgets = widgetsToBackfillByApplicationUniversalIdentifier.get(widget.applicationUniversalIdentifier) ?? [];
            widgetsToBackfillByApplicationUniversalIdentifier.set(widget.applicationUniversalIdentifier, [
                ...existingWidgets,
                updatedWidget
            ]);
        }
        for (const [applicationUniversalIdentifier, updatedWidgets] of widgetsToBackfillByApplicationUniversalIdentifier){
            const result = await this.workspaceMigrationValidateBuildAndRunService.validateBuildAndRunLegacyWorkspaceMigration({
                allFlatEntityOperationByMetadataName: {
                    pageLayoutWidget: {
                        flatEntityToCreate: [],
                        flatEntityToDelete: [],
                        flatEntityToUpdate: updatedWidgets
                    }
                },
                workspaceId,
                applicationUniversalIdentifier
            });
            if (result.status === 'fail') {
                this.logger.error(`Failed to backfill FIELDS widgets for application ${applicationUniversalIdentifier} in workspace ${workspaceId}:\n${JSON.stringify(result, null, 2)}`);
                throw new Error(`Failed to backfill FIELDS widgets for workspace ${workspaceId}`);
            }
            this.logger.log(`Backfilled ${updatedWidgets.length} FIELDS widget(s) for application ${applicationUniversalIdentifier} in workspace ${workspaceId}`);
        }
    }
    constructor(workspaceIteratorService, workspaceCacheService, workspaceMigrationValidateBuildAndRunService){
        super(workspaceIteratorService), this.workspaceIteratorService = workspaceIteratorService, this.workspaceCacheService = workspaceCacheService, this.workspaceMigrationValidateBuildAndRunService = workspaceMigrationValidateBuildAndRunService;
    }
};
BackfillFieldsWidgetNewFieldDefaultVisibilityCommand = _ts_decorate([
    (0, _registeredworkspacecommanddecorator.RegisteredWorkspaceCommand)('2.9.0', 1799000030000),
    (0, _nestcommander.Command)({
        name: 'upgrade:2-9:backfill-fields-widget-new-field-default-visibility',
        description: 'Backfill newFieldDefaultVisibility to true on FIELDS page layout widgets where it is null'
    }),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _workspaceiteratorservice.WorkspaceIteratorService === "undefined" ? Object : _workspaceiteratorservice.WorkspaceIteratorService,
        typeof _workspacecacheservice.WorkspaceCacheService === "undefined" ? Object : _workspacecacheservice.WorkspaceCacheService,
        typeof _workspacemigrationvalidatebuildandrunservice.WorkspaceMigrationValidateBuildAndRunService === "undefined" ? Object : _workspacemigrationvalidatebuildandrunservice.WorkspaceMigrationValidateBuildAndRunService
    ])
], BackfillFieldsWidgetNewFieldDefaultVisibilityCommand);

//# sourceMappingURL=2-9-workspace-command-1799000030000-backfill-fields-widget-new-field-default-visibility.command.js.map