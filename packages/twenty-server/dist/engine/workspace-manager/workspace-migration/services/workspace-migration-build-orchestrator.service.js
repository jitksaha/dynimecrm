"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "WorkspaceMigrationBuildOrchestratorService", {
    enumerable: true,
    get: function() {
        return WorkspaceMigrationBuildOrchestratorService;
    }
});
const _common = require("@nestjs/common");
const _metadata = require("twenty-shared/metadata");
const _utils = require("twenty-shared/utils");
const _createemptyallflatentitymapsconstant = require("../../../metadata-modules/flat-entity/constant/create-empty-all-flat-entity-maps.constant");
const _getmetadataflatentitymapskeyutil = require("../../../metadata-modules/flat-entity/utils/get-metadata-flat-entity-maps-key.util");
const _emptyorchestratoractionsreportconstant = require("../constant/empty-orchestrator-actions-report.constant");
const _emptyorchestratorfailurereportconstant = require("../constant/empty-orchestrator-failure-report.constant");
const _aggregateorchestratoractionsreportutil = require("../utils/aggregate-orchestrator-actions-report.util");
const _computeorderedmigrationactionsutil = require("../utils/compute-ordered-migration-actions.util");
const _computesearchvectorrebuildtargetuniversalidentifiersutil = require("../utils/compute-search-vector-rebuild-target-universal-identifiers.util");
const _crossentitytransversalvalidationutil = require("../utils/cross-entity-transversal-validation.util");
const _mergeorchestratorfailurereportsutil = require("../utils/merge-orchestrator-failure-reports.util");
const _workspacemigrationagentactionsbuilderservice = require("../workspace-migration-builder/builders/agent/workspace-migration-agent-actions-builder.service");
const _workspacemigrationapplicationvariableactionsbuilderservice = require("../workspace-migration-builder/builders/application-variable/workspace-migration-application-variable-actions-builder.service");
const _workspacemigrationcommandmenuitemactionsbuilderservice = require("../workspace-migration-builder/builders/command-menu-item/workspace-migration-command-menu-item-actions-builder.service");
const _workspacemigrationconnectionprovideractionsbuilderservice = require("../workspace-migration-builder/builders/connection-provider/workspace-migration-connection-provider-actions-builder.service");
const _workspacemigrationtimelineactivitytypeactionsbuilderservice = require("../workspace-migration-builder/builders/timeline-activity-type/workspace-migration-timeline-activity-type-actions-builder.service");
const _workspacemigrationfieldpermissionactionsbuilderservice = require("../workspace-migration-builder/builders/field-permission/workspace-migration-field-permission-actions-builder.service");
const _workspacemigrationfieldactionsbuilderservice = require("../workspace-migration-builder/builders/field/workspace-migration-field-actions-builder.service");
const _workspacemigrationfrontcomponentactionsbuilderservice = require("../workspace-migration-builder/builders/front-component/workspace-migration-front-component-actions-builder.service");
const _workspacemigrationindexactionsbuilderservice = require("../workspace-migration-builder/builders/index/workspace-migration-index-actions-builder.service");
const _workspacemigrationlogicfunctionactionsbuilderservice = require("../workspace-migration-builder/builders/logic-function/workspace-migration-logic-function-actions-builder.service");
const _workspacemigrationnavigationmenuitemactionsbuilderservice = require("../workspace-migration-builder/builders/navigation-menu-item/workspace-migration-navigation-menu-item-actions-builder.service");
const _workspacemigrationobjectpermissionactionsbuilderservice = require("../workspace-migration-builder/builders/object-permission/workspace-migration-object-permission-actions-builder.service");
const _workspacemigrationobjectactionsbuilderservice = require("../workspace-migration-builder/builders/object/workspace-migration-object-actions-builder.service");
const _workspacemigrationpagelayouttabactionsbuilderservice = require("../workspace-migration-builder/builders/page-layout-tab/workspace-migration-page-layout-tab-actions-builder.service");
const _workspacemigrationpagelayoutwidgetactionsbuilderservice = require("../workspace-migration-builder/builders/page-layout-widget/workspace-migration-page-layout-widget-actions-builder.service");
const _workspacemigrationpagelayoutactionsbuilderservice = require("../workspace-migration-builder/builders/page-layout/workspace-migration-page-layout-actions-builder.service");
const _workspacemigrationpermissionflagactionsbuilderservice = require("../workspace-migration-builder/builders/permission-flag/workspace-migration-permission-flag-actions-builder.service");
const _workspacemigrationrolepermissionflagactionsbuilderservice = require("../workspace-migration-builder/builders/role-permission-flag/workspace-migration-role-permission-flag-actions-builder.service");
const _workspacemigrationroletargetactionsbuilderservice = require("../workspace-migration-builder/builders/role-target/workspace-migration-role-target-actions-builder.service");
const _workspacemigrationroleactionsbuilderservice = require("../workspace-migration-builder/builders/role/workspace-migration-role-actions-builder.service");
const _workspacemigrationrowlevelpermissionpredicategroupactionsbuilderservice = require("../workspace-migration-builder/builders/row-level-permission-predicate-group/workspace-migration-row-level-permission-predicate-group-actions-builder.service");
const _workspacemigrationrowlevelpermissionpredicateactionsbuilderservice = require("../workspace-migration-builder/builders/row-level-permission-predicate/workspace-migration-row-level-permission-predicate-actions-builder.service");
const _workspacemigrationsearchfieldmetadataactionsbuilderservice = require("../workspace-migration-builder/builders/search-field-metadata/workspace-migration-search-field-metadata-actions.builder.service");
const _workspacemigrationskillactionsbuilderservice = require("../workspace-migration-builder/builders/skill/workspace-migration-skill-actions-builder.service");
const _workspacemigrationviewfieldgroupactionsbuilderservice = require("../workspace-migration-builder/builders/view-field-group/workspace-migration-view-field-group-actions-builder.service");
const _workspacemigrationviewfieldactionsbuilderservice = require("../workspace-migration-builder/builders/view-field/workspace-migration-view-field-actions-builder.service");
const _workspacemigrationviewfiltergroupactionsbuilderservice = require("../workspace-migration-builder/builders/view-filter-group/workspace-migration-view-filter-group-actions-builder.service");
const _workspacemigrationviewfilteractionsbuilderservice = require("../workspace-migration-builder/builders/view-filter/workspace-migration-view-filter-actions-builder.service");
const _workspacemigrationviewgroupactionsbuilderservice = require("../workspace-migration-builder/builders/view-group/workspace-migration-view-group-actions-builder.service");
const _workspacemigrationviewsortactionsbuilderservice = require("../workspace-migration-builder/builders/view-sort/workspace-migration-view-sort-actions.builder.service");
const _workspacemigrationviewactionsbuilderservice = require("../workspace-migration-builder/builders/view/workspace-migration-view-actions-builder.service");
const _workspacemigrationwebhookactionsbuilderservice = require("../workspace-migration-builder/builders/webhook/workspace-migration-webhook-actions-builder.service");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
const createEntityActionsBuilderTask = (metadataName, builderService)=>({
        metadataName,
        run: async ({ additionalCacheDataMaps, buildOptions, fromToAllFlatEntityMaps, optimisticAllFlatEntityMaps, orchestratorActionsReport, orchestratorFailureReport, workspaceId })=>{
            const flatEntityMapsKey = (0, _getmetadataflatentitymapskeyutil.getMetadataFlatEntityMapsKey)(metadataName);
            const fromToFlatEntityMaps = fromToAllFlatEntityMaps[flatEntityMapsKey];
            if (!(0, _utils.isDefined)(fromToFlatEntityMaps)) {
                return;
            }
            const result = await builderService.validateAndBuild({
                additionalCacheDataMaps,
                buildOptions,
                dependencyOptimisticFlatEntityMaps: optimisticAllFlatEntityMaps,
                from: fromToFlatEntityMaps.from,
                to: fromToFlatEntityMaps.to,
                workspaceId
            });
            if (result.status === 'fail') {
                orchestratorFailureReport[metadataName].push(...result.errors);
            } else {
                // TS mapped-type invariance: writing into a generic key of a mapped
                // type widens the expected value to the intersection of all variants.
                // The runtime value is correctly typed as
                // MetadataUniversalWorkspaceMigrationActionsRecord<T>, but TS cannot
                // narrow OrchestratorActionsReport[T] on the assignment side.
                orchestratorActionsReport[metadataName] = result.actions;
            }
        }
    });
let WorkspaceMigrationBuildOrchestratorService = class WorkspaceMigrationBuildOrchestratorService {
    setupOptimisticCache({ fromToAllFlatEntityMaps, dependencyAllFlatEntityMaps }) {
        if ((0, _utils.isDefined)(dependencyAllFlatEntityMaps)) {
            return {
                ...(0, _createemptyallflatentitymapsconstant.createEmptyAllFlatEntityMaps)(),
                ...dependencyAllFlatEntityMaps
            };
        }
        const allFromToFlatEntityMapsKeys = Object.keys(fromToAllFlatEntityMaps);
        return allFromToFlatEntityMapsKeys.reduce((allFlatEntityMaps, currFlatMaps)=>{
            const fromToOccurence = fromToAllFlatEntityMaps[currFlatMaps];
            if (!(0, _utils.isDefined)(fromToOccurence)) {
                return allFlatEntityMaps;
            }
            return {
                ...allFlatEntityMaps,
                [currFlatMaps]: fromToOccurence.from
            };
        }, {
            ...(0, _createemptyallflatentitymapsconstant.createEmptyAllFlatEntityMaps)()
        });
    }
    async buildWorkspaceMigration({ workspaceId, buildOptions, fromToAllFlatEntityMaps, dependencyAllFlatEntityMaps, additionalCacheDataMaps }) {
        const orchestratorActionsReport = structuredClone({
            ...(0, _emptyorchestratoractionsreportconstant.createEmptyOrchestratorActionsReport)()
        });
        const orchestratorFailureReport = structuredClone((0, _emptyorchestratorfailurereportconstant.EMPTY_ORCHESTRATOR_FAILURE_REPORT)());
        const optimisticAllFlatEntityMaps = this.setupOptimisticCache({
            fromToAllFlatEntityMaps,
            dependencyAllFlatEntityMaps
        });
        const preDeletionFlatViewFieldMaps = structuredClone(optimisticAllFlatEntityMaps.flatViewFieldMaps);
        const runContext = {
            additionalCacheDataMaps,
            buildOptions,
            fromToAllFlatEntityMaps,
            optimisticAllFlatEntityMaps,
            orchestratorActionsReport,
            orchestratorFailureReport,
            workspaceId
        };
        for (const task of this.entityActionsBuilderTasksInExecutionOrder){
            await task.run(runContext);
        }
        const crossEntityFailureReport = (0, _crossentitytransversalvalidationutil.crossEntityTransversalValidation)({
            optimisticUniversalFlatMaps: optimisticAllFlatEntityMaps,
            orchestratorActionsReport,
            preDeletionFlatViewFieldMaps
        });
        (0, _mergeorchestratorfailurereportsutil.mergeOrchestratorFailureReports)({
            target: orchestratorFailureReport,
            source: crossEntityFailureReport
        });
        const allErrors = Object.values(orchestratorFailureReport);
        if (allErrors.some((report)=>report.length > 0)) {
            return {
                status: 'fail',
                report: orchestratorFailureReport
            };
        }
        const searchVectorUniversalIdentifiersToRebuild = (0, _computesearchvectorrebuildtargetuniversalidentifiersutil.computeSearchVectorRebuildTargetUniversalIdentifiers)({
            orchestratorActionsReport,
            fromFlatSearchFieldMetadataMaps: fromToAllFlatEntityMaps.flatSearchFieldMetadataMaps?.from,
            toFlatSearchFieldMetadataMaps: optimisticAllFlatEntityMaps.flatSearchFieldMetadataMaps,
            toFlatFieldMetadataMaps: optimisticAllFlatEntityMaps.flatFieldMetadataMaps
        });
        const { aggregatedOrchestratorActionsReport } = (0, _aggregateorchestratoractionsreportutil.aggregateOrchestratorActionsReport)({
            orchestratorActionsReport,
            flatFieldMetadataMaps: optimisticAllFlatEntityMaps.flatFieldMetadataMaps,
            searchVectorUniversalIdentifiersToRebuild
        });
        return {
            status: 'success',
            workspaceMigration: {
                applicationUniversalIdentifier: buildOptions.applicationUniversalIdentifier,
                actions: (0, _computeorderedmigrationactionsutil.computeOrderedMigrationActions)(aggregatedOrchestratorActionsReport)
            }
        };
    }
    constructor(workspaceMigrationObjectActionsBuilderService, workspaceMigrationIndexActionsBuilderService, workspaceMigrationViewActionsBuilderService, workspaceMigrationViewFieldActionsBuilderService, workspaceMigrationViewFilterActionsBuilderService, workspaceMigrationViewFilterGroupActionsBuilderService, workspaceMigrationViewGroupActionsBuilderService, workspaceMigrationViewFieldGroupActionsBuilderService, workspaceMigrationViewSortActionsBuilderService, workspaceMigrationFieldPermissionActionsBuilderService, workspaceMigrationObjectPermissionActionsBuilderService, workspaceMigrationRolePermissionFlagActionsBuilderService, workspaceMigrationPermissionFlagActionsBuilderService, workspaceMigrationLogicFunctionActionsBuilderService, workspaceMigrationRoleTargetActionsBuilderService, workspaceMigrationFieldActionsBuilderService, workspaceMigrationRoleActionsBuilderService, workspaceMigrationAgentActionsBuilderService, workspaceMigrationSkillActionsBuilderService, workspaceMigrationCommandMenuItemActionsBuilderService, workspaceMigrationNavigationMenuItemActionsBuilderService, workspaceMigrationPageLayoutActionsBuilderService, workspaceMigrationPageLayoutWidgetActionsBuilderService, workspaceMigrationPageLayoutTabActionsBuilderService, workspaceMigrationRowLevelPermissionPredicateActionsBuilderService, workspaceMigrationRowLevelPermissionPredicateGroupActionsBuilderService, workspaceMigrationFrontComponentActionsBuilderService, workspaceMigrationWebhookActionsBuilderService, workspaceMigrationApplicationVariableActionsBuilderService, workspaceMigrationConnectionProviderActionsBuilderService, workspaceMigrationTimelineActivityTypeActionsBuilderService, workspaceMigrationSearchFieldMetadataActionsBuilderService){
        // The order of this array defines the execution order of the per-entity
        // builders. Each builder may mutate `optimisticAllFlatEntityMaps`, so
        // subsequent builders see those mutations and downstream entities depend
        // on upstream ones being processed first. Do not reorder casually.
        // The constructor parameter order above is irrelevant: NestJS DI resolves
        // dependencies by type, not by position.
        this.entityActionsBuilderTasksInExecutionOrder = [
            createEntityActionsBuilderTask(_metadata.ALL_METADATA_NAME.objectMetadata, workspaceMigrationObjectActionsBuilderService),
            createEntityActionsBuilderTask(_metadata.ALL_METADATA_NAME.fieldMetadata, workspaceMigrationFieldActionsBuilderService),
            createEntityActionsBuilderTask(_metadata.ALL_METADATA_NAME.index, workspaceMigrationIndexActionsBuilderService),
            createEntityActionsBuilderTask(_metadata.ALL_METADATA_NAME.view, workspaceMigrationViewActionsBuilderService),
            createEntityActionsBuilderTask(_metadata.ALL_METADATA_NAME.viewFieldGroup, workspaceMigrationViewFieldGroupActionsBuilderService),
            createEntityActionsBuilderTask(_metadata.ALL_METADATA_NAME.viewField, workspaceMigrationViewFieldActionsBuilderService),
            createEntityActionsBuilderTask(_metadata.ALL_METADATA_NAME.viewFilterGroup, workspaceMigrationViewFilterGroupActionsBuilderService),
            createEntityActionsBuilderTask(_metadata.ALL_METADATA_NAME.viewFilter, workspaceMigrationViewFilterActionsBuilderService),
            createEntityActionsBuilderTask(_metadata.ALL_METADATA_NAME.viewGroup, workspaceMigrationViewGroupActionsBuilderService),
            createEntityActionsBuilderTask(_metadata.ALL_METADATA_NAME.viewSort, workspaceMigrationViewSortActionsBuilderService),
            createEntityActionsBuilderTask(_metadata.ALL_METADATA_NAME.searchFieldMetadata, workspaceMigrationSearchFieldMetadataActionsBuilderService),
            createEntityActionsBuilderTask(_metadata.ALL_METADATA_NAME.logicFunction, workspaceMigrationLogicFunctionActionsBuilderService),
            createEntityActionsBuilderTask(_metadata.ALL_METADATA_NAME.role, workspaceMigrationRoleActionsBuilderService),
            createEntityActionsBuilderTask(_metadata.ALL_METADATA_NAME.rowLevelPermissionPredicateGroup, workspaceMigrationRowLevelPermissionPredicateGroupActionsBuilderService),
            createEntityActionsBuilderTask(_metadata.ALL_METADATA_NAME.rowLevelPermissionPredicate, workspaceMigrationRowLevelPermissionPredicateActionsBuilderService),
            createEntityActionsBuilderTask(_metadata.ALL_METADATA_NAME.objectPermission, workspaceMigrationObjectPermissionActionsBuilderService),
            createEntityActionsBuilderTask(_metadata.ALL_METADATA_NAME.fieldPermission, workspaceMigrationFieldPermissionActionsBuilderService),
            createEntityActionsBuilderTask(_metadata.ALL_METADATA_NAME.permissionFlag, workspaceMigrationPermissionFlagActionsBuilderService),
            createEntityActionsBuilderTask(_metadata.ALL_METADATA_NAME.rolePermissionFlag, workspaceMigrationRolePermissionFlagActionsBuilderService),
            createEntityActionsBuilderTask(_metadata.ALL_METADATA_NAME.agent, workspaceMigrationAgentActionsBuilderService),
            createEntityActionsBuilderTask(_metadata.ALL_METADATA_NAME.roleTarget, workspaceMigrationRoleTargetActionsBuilderService),
            createEntityActionsBuilderTask(_metadata.ALL_METADATA_NAME.skill, workspaceMigrationSkillActionsBuilderService),
            createEntityActionsBuilderTask(_metadata.ALL_METADATA_NAME.frontComponent, workspaceMigrationFrontComponentActionsBuilderService),
            createEntityActionsBuilderTask(_metadata.ALL_METADATA_NAME.commandMenuItem, workspaceMigrationCommandMenuItemActionsBuilderService),
            createEntityActionsBuilderTask(_metadata.ALL_METADATA_NAME.navigationMenuItem, workspaceMigrationNavigationMenuItemActionsBuilderService),
            createEntityActionsBuilderTask(_metadata.ALL_METADATA_NAME.pageLayout, workspaceMigrationPageLayoutActionsBuilderService),
            createEntityActionsBuilderTask(_metadata.ALL_METADATA_NAME.pageLayoutTab, workspaceMigrationPageLayoutTabActionsBuilderService),
            createEntityActionsBuilderTask(_metadata.ALL_METADATA_NAME.pageLayoutWidget, workspaceMigrationPageLayoutWidgetActionsBuilderService),
            createEntityActionsBuilderTask(_metadata.ALL_METADATA_NAME.webhook, workspaceMigrationWebhookActionsBuilderService),
            createEntityActionsBuilderTask(_metadata.ALL_METADATA_NAME.applicationVariable, workspaceMigrationApplicationVariableActionsBuilderService),
            createEntityActionsBuilderTask(_metadata.ALL_METADATA_NAME.connectionProvider, workspaceMigrationConnectionProviderActionsBuilderService),
            createEntityActionsBuilderTask(_metadata.ALL_METADATA_NAME.timelineActivityType, workspaceMigrationTimelineActivityTypeActionsBuilderService)
        ];
    }
};
WorkspaceMigrationBuildOrchestratorService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _workspacemigrationobjectactionsbuilderservice.WorkspaceMigrationObjectActionsBuilderService === "undefined" ? Object : _workspacemigrationobjectactionsbuilderservice.WorkspaceMigrationObjectActionsBuilderService,
        typeof _workspacemigrationindexactionsbuilderservice.WorkspaceMigrationIndexActionsBuilderService === "undefined" ? Object : _workspacemigrationindexactionsbuilderservice.WorkspaceMigrationIndexActionsBuilderService,
        typeof _workspacemigrationviewactionsbuilderservice.WorkspaceMigrationViewActionsBuilderService === "undefined" ? Object : _workspacemigrationviewactionsbuilderservice.WorkspaceMigrationViewActionsBuilderService,
        typeof _workspacemigrationviewfieldactionsbuilderservice.WorkspaceMigrationViewFieldActionsBuilderService === "undefined" ? Object : _workspacemigrationviewfieldactionsbuilderservice.WorkspaceMigrationViewFieldActionsBuilderService,
        typeof _workspacemigrationviewfilteractionsbuilderservice.WorkspaceMigrationViewFilterActionsBuilderService === "undefined" ? Object : _workspacemigrationviewfilteractionsbuilderservice.WorkspaceMigrationViewFilterActionsBuilderService,
        typeof _workspacemigrationviewfiltergroupactionsbuilderservice.WorkspaceMigrationViewFilterGroupActionsBuilderService === "undefined" ? Object : _workspacemigrationviewfiltergroupactionsbuilderservice.WorkspaceMigrationViewFilterGroupActionsBuilderService,
        typeof _workspacemigrationviewgroupactionsbuilderservice.WorkspaceMigrationViewGroupActionsBuilderService === "undefined" ? Object : _workspacemigrationviewgroupactionsbuilderservice.WorkspaceMigrationViewGroupActionsBuilderService,
        typeof _workspacemigrationviewfieldgroupactionsbuilderservice.WorkspaceMigrationViewFieldGroupActionsBuilderService === "undefined" ? Object : _workspacemigrationviewfieldgroupactionsbuilderservice.WorkspaceMigrationViewFieldGroupActionsBuilderService,
        typeof _workspacemigrationviewsortactionsbuilderservice.WorkspaceMigrationViewSortActionsBuilderService === "undefined" ? Object : _workspacemigrationviewsortactionsbuilderservice.WorkspaceMigrationViewSortActionsBuilderService,
        typeof _workspacemigrationfieldpermissionactionsbuilderservice.WorkspaceMigrationFieldPermissionActionsBuilderService === "undefined" ? Object : _workspacemigrationfieldpermissionactionsbuilderservice.WorkspaceMigrationFieldPermissionActionsBuilderService,
        typeof _workspacemigrationobjectpermissionactionsbuilderservice.WorkspaceMigrationObjectPermissionActionsBuilderService === "undefined" ? Object : _workspacemigrationobjectpermissionactionsbuilderservice.WorkspaceMigrationObjectPermissionActionsBuilderService,
        typeof _workspacemigrationrolepermissionflagactionsbuilderservice.WorkspaceMigrationRolePermissionFlagActionsBuilderService === "undefined" ? Object : _workspacemigrationrolepermissionflagactionsbuilderservice.WorkspaceMigrationRolePermissionFlagActionsBuilderService,
        typeof _workspacemigrationpermissionflagactionsbuilderservice.WorkspaceMigrationPermissionFlagActionsBuilderService === "undefined" ? Object : _workspacemigrationpermissionflagactionsbuilderservice.WorkspaceMigrationPermissionFlagActionsBuilderService,
        typeof _workspacemigrationlogicfunctionactionsbuilderservice.WorkspaceMigrationLogicFunctionActionsBuilderService === "undefined" ? Object : _workspacemigrationlogicfunctionactionsbuilderservice.WorkspaceMigrationLogicFunctionActionsBuilderService,
        typeof _workspacemigrationroletargetactionsbuilderservice.WorkspaceMigrationRoleTargetActionsBuilderService === "undefined" ? Object : _workspacemigrationroletargetactionsbuilderservice.WorkspaceMigrationRoleTargetActionsBuilderService,
        typeof _workspacemigrationfieldactionsbuilderservice.WorkspaceMigrationFieldActionsBuilderService === "undefined" ? Object : _workspacemigrationfieldactionsbuilderservice.WorkspaceMigrationFieldActionsBuilderService,
        typeof _workspacemigrationroleactionsbuilderservice.WorkspaceMigrationRoleActionsBuilderService === "undefined" ? Object : _workspacemigrationroleactionsbuilderservice.WorkspaceMigrationRoleActionsBuilderService,
        typeof _workspacemigrationagentactionsbuilderservice.WorkspaceMigrationAgentActionsBuilderService === "undefined" ? Object : _workspacemigrationagentactionsbuilderservice.WorkspaceMigrationAgentActionsBuilderService,
        typeof _workspacemigrationskillactionsbuilderservice.WorkspaceMigrationSkillActionsBuilderService === "undefined" ? Object : _workspacemigrationskillactionsbuilderservice.WorkspaceMigrationSkillActionsBuilderService,
        typeof _workspacemigrationcommandmenuitemactionsbuilderservice.WorkspaceMigrationCommandMenuItemActionsBuilderService === "undefined" ? Object : _workspacemigrationcommandmenuitemactionsbuilderservice.WorkspaceMigrationCommandMenuItemActionsBuilderService,
        typeof _workspacemigrationnavigationmenuitemactionsbuilderservice.WorkspaceMigrationNavigationMenuItemActionsBuilderService === "undefined" ? Object : _workspacemigrationnavigationmenuitemactionsbuilderservice.WorkspaceMigrationNavigationMenuItemActionsBuilderService,
        typeof _workspacemigrationpagelayoutactionsbuilderservice.WorkspaceMigrationPageLayoutActionsBuilderService === "undefined" ? Object : _workspacemigrationpagelayoutactionsbuilderservice.WorkspaceMigrationPageLayoutActionsBuilderService,
        typeof _workspacemigrationpagelayoutwidgetactionsbuilderservice.WorkspaceMigrationPageLayoutWidgetActionsBuilderService === "undefined" ? Object : _workspacemigrationpagelayoutwidgetactionsbuilderservice.WorkspaceMigrationPageLayoutWidgetActionsBuilderService,
        typeof _workspacemigrationpagelayouttabactionsbuilderservice.WorkspaceMigrationPageLayoutTabActionsBuilderService === "undefined" ? Object : _workspacemigrationpagelayouttabactionsbuilderservice.WorkspaceMigrationPageLayoutTabActionsBuilderService,
        typeof _workspacemigrationrowlevelpermissionpredicateactionsbuilderservice.WorkspaceMigrationRowLevelPermissionPredicateActionsBuilderService === "undefined" ? Object : _workspacemigrationrowlevelpermissionpredicateactionsbuilderservice.WorkspaceMigrationRowLevelPermissionPredicateActionsBuilderService,
        typeof _workspacemigrationrowlevelpermissionpredicategroupactionsbuilderservice.WorkspaceMigrationRowLevelPermissionPredicateGroupActionsBuilderService === "undefined" ? Object : _workspacemigrationrowlevelpermissionpredicategroupactionsbuilderservice.WorkspaceMigrationRowLevelPermissionPredicateGroupActionsBuilderService,
        typeof _workspacemigrationfrontcomponentactionsbuilderservice.WorkspaceMigrationFrontComponentActionsBuilderService === "undefined" ? Object : _workspacemigrationfrontcomponentactionsbuilderservice.WorkspaceMigrationFrontComponentActionsBuilderService,
        typeof _workspacemigrationwebhookactionsbuilderservice.WorkspaceMigrationWebhookActionsBuilderService === "undefined" ? Object : _workspacemigrationwebhookactionsbuilderservice.WorkspaceMigrationWebhookActionsBuilderService,
        typeof _workspacemigrationapplicationvariableactionsbuilderservice.WorkspaceMigrationApplicationVariableActionsBuilderService === "undefined" ? Object : _workspacemigrationapplicationvariableactionsbuilderservice.WorkspaceMigrationApplicationVariableActionsBuilderService,
        typeof _workspacemigrationconnectionprovideractionsbuilderservice.WorkspaceMigrationConnectionProviderActionsBuilderService === "undefined" ? Object : _workspacemigrationconnectionprovideractionsbuilderservice.WorkspaceMigrationConnectionProviderActionsBuilderService,
        typeof _workspacemigrationtimelineactivitytypeactionsbuilderservice.WorkspaceMigrationTimelineActivityTypeActionsBuilderService === "undefined" ? Object : _workspacemigrationtimelineactivitytypeactionsbuilderservice.WorkspaceMigrationTimelineActivityTypeActionsBuilderService,
        typeof _workspacemigrationsearchfieldmetadataactionsbuilderservice.WorkspaceMigrationSearchFieldMetadataActionsBuilderService === "undefined" ? Object : _workspacemigrationsearchfieldmetadataactionsbuilderservice.WorkspaceMigrationSearchFieldMetadataActionsBuilderService
    ])
], WorkspaceMigrationBuildOrchestratorService);

//# sourceMappingURL=workspace-migration-build-orchestrator.service.js.map