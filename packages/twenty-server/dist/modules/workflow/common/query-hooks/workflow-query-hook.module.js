"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "WorkflowQueryHookModule", {
    enumerable: true,
    get: function() {
        return WorkflowQueryHookModule;
    }
});
const _common = require("@nestjs/common");
const _commandmenuitemmodule = require("../../../../engine/metadata-modules/command-menu-item/command-menu-item.module");
const _featureflagmodule = require("../../../../engine/core-modules/feature-flag/feature-flag.module");
const _recordpositionmodule = require("../../../../engine/core-modules/record-position/record-position.module");
const _workflowversioncoremodule = require("../../../../engine/core-modules/workflow/workflow-version-core.module");
const _workspacemanyorallflatentitymapscachemodule = require("../../../../engine/metadata-modules/flat-entity/services/workspace-many-or-all-flat-entity-maps-cache.module");
const _logicfunctionmodule = require("../../../../engine/metadata-modules/logic-function/logic-function.module");
const _objectmetadatamodule = require("../../../../engine/metadata-modules/object-metadata/object-metadata.module");
const _codestepbuildmodule = require("../../workflow-builder/workflow-version-step/code-step/code-step-build.module");
const _workflowcreatemanypostqueryhook = require("./workflow-create-many.post-query.hook");
const _workflowcreatemanyprequeryhook = require("./workflow-create-many.pre-query.hook");
const _workflowcreateonepostqueryhook = require("./workflow-create-one.post-query.hook");
const _workflowcreateoneprequeryhook = require("./workflow-create-one.pre-query.hook");
const _workflowdeletemanypostqueryhook = require("./workflow-delete-many.post-query.hook");
const _workflowdeleteonepostqueryhook = require("./workflow-delete-one.post-query.hook");
const _workflowdestroymanypostqueryhook = require("./workflow-destroy-many.post-query.hook");
const _workflowdestroymanyprequeryhook = require("./workflow-destroy-many.pre-query.hook");
const _workflowdestroyonepostqueryhook = require("./workflow-destroy-one.post-query.hook");
const _workflowdestroyoneprequeryhook = require("./workflow-destroy-one.pre-query.hook");
const _workflowrestoremanypostqueryhook = require("./workflow-restore-many.post-query.hook");
const _workflowrestoreonepostqueryhook = require("./workflow-restore-one.post-query.hook");
const _workflowruncreatemanyprequeryhook = require("./workflow-run-create-many.pre-query.hook");
const _workflowruncreateoneprequeryhook = require("./workflow-run-create-one.pre-query.hook");
const _workflowrundeletemanyprequeryhook = require("./workflow-run-delete-many.pre-query.hook");
const _workflowrundeleteoneprequeryhook = require("./workflow-run-delete-one.pre-query.hook");
const _workflowrunupdatemanyprequeryhook = require("./workflow-run-update-many.pre-query.hook");
const _workflowrunupdateoneprequeryhook = require("./workflow-run-update-one.pre-query.hook");
const _workflowupdatemanypostqueryhook = require("./workflow-update-many.post-query.hook");
const _workflowupdatemanyprequeryhook = require("./workflow-update-many.pre-query.hook");
const _workflowupdateonepostqueryhook = require("./workflow-update-one.post-query.hook");
const _workflowupdateoneprequeryhook = require("./workflow-update-one.pre-query.hook");
const _workflowversioncreatemanyprequeryhook = require("./workflow-version-create-many.pre-query.hook");
const _workflowversioncreateoneprequeryhook = require("./workflow-version-create-one.pre-query.hook");
const _workflowversiondeletemanyprequeryhook = require("./workflow-version-delete-many.pre-query.hook");
const _workflowversiondeleteonepostqueryhook = require("./workflow-version-delete-one.post-query.hook");
const _workflowversiondeleteoneprequeryhook = require("./workflow-version-delete-one.pre-query.hook");
const _workflowversiondestroymanyprequeryhook = require("./workflow-version-destroy-many.pre-query.hook");
const _workflowversiondestroyoneprequeryhook = require("./workflow-version-destroy-one.pre-query.hook");
const _workflowversionrestoremanyprequeryhook = require("./workflow-version-restore-many.pre-query.hook");
const _workflowversionrestoreoneprequeryhook = require("./workflow-version-restore-one.pre-query.hook");
const _workflowversionupdatemanyprequeryhook = require("./workflow-version-update-many.pre-query.hook");
const _workflowversionupdateoneprequeryhook = require("./workflow-version-update-one.pre-query.hook");
const _workflowcommonworkspaceservice = require("../workspace-services/workflow-common.workspace-service");
const _workflowmetadatareadmodule = require("../workspace-services/workflow-metadata-read.module");
const _workflowversionvalidationworkspaceservice = require("../workspace-services/workflow-version-validation.workspace-service");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let WorkflowQueryHookModule = class WorkflowQueryHookModule {
};
WorkflowQueryHookModule = _ts_decorate([
    (0, _common.Module)({
        imports: [
            _logicfunctionmodule.LogicFunctionModule,
            _recordpositionmodule.RecordPositionModule,
            _workspacemanyorallflatentitymapscachemodule.WorkspaceManyOrAllFlatEntityMapsCacheModule,
            _objectmetadatamodule.ObjectMetadataModule,
            _codestepbuildmodule.CodeStepBuildModule,
            _commandmenuitemmodule.CommandMenuItemModule,
            _featureflagmodule.FeatureFlagModule,
            _workflowversioncoremodule.WorkflowVersionCoreModule,
            _workflowmetadatareadmodule.WorkflowMetadataReadModule
        ],
        providers: [
            _workflowcreateoneprequeryhook.WorkflowCreateOnePreQueryHook,
            _workflowcreatemanyprequeryhook.WorkflowCreateManyPreQueryHook,
            _workflowupdateoneprequeryhook.WorkflowUpdateOnePreQueryHook,
            _workflowupdatemanyprequeryhook.WorkflowUpdateManyPreQueryHook,
            _workflowupdateonepostqueryhook.WorkflowUpdateOnePostQueryHook,
            _workflowupdatemanypostqueryhook.WorkflowUpdateManyPostQueryHook,
            _workflowruncreateoneprequeryhook.WorkflowRunCreateOnePreQueryHook,
            _workflowruncreatemanyprequeryhook.WorkflowRunCreateManyPreQueryHook,
            _workflowrunupdateoneprequeryhook.WorkflowRunUpdateOnePreQueryHook,
            _workflowrunupdatemanyprequeryhook.WorkflowRunUpdateManyPreQueryHook,
            _workflowrundeleteoneprequeryhook.WorkflowRunDeleteOnePreQueryHook,
            _workflowrundeletemanyprequeryhook.WorkflowRunDeleteManyPreQueryHook,
            _workflowrestoreonepostqueryhook.WorkflowRestoreOnePostQueryHook,
            _workflowrestoremanypostqueryhook.WorkflowRestoreManyPostQueryHook,
            _workflowversioncreateoneprequeryhook.WorkflowVersionCreateOnePreQueryHook,
            _workflowversioncreatemanyprequeryhook.WorkflowVersionCreateManyPreQueryHook,
            _workflowversionupdateoneprequeryhook.WorkflowVersionUpdateOnePreQueryHook,
            _workflowversionupdatemanyprequeryhook.WorkflowVersionUpdateManyPreQueryHook,
            _workflowversiondeleteoneprequeryhook.WorkflowVersionDeleteOnePreQueryHook,
            _workflowversiondeleteonepostqueryhook.WorkflowVersionDeleteOnePostQueryHook,
            _workflowversiondeletemanyprequeryhook.WorkflowVersionDeleteManyPreQueryHook,
            _workflowversiondestroyoneprequeryhook.WorkflowVersionDestroyOnePreQueryHook,
            _workflowversiondestroymanyprequeryhook.WorkflowVersionDestroyManyPreQueryHook,
            _workflowversionrestoreoneprequeryhook.WorkflowVersionRestoreOnePreQueryHook,
            _workflowversionrestoremanyprequeryhook.WorkflowVersionRestoreManyPreQueryHook,
            _workflowcreateonepostqueryhook.WorkflowCreateOnePostQueryHook,
            _workflowcreatemanypostqueryhook.WorkflowCreateManyPostQueryHook,
            _workflowversionvalidationworkspaceservice.WorkflowVersionValidationWorkspaceService,
            _workflowcommonworkspaceservice.WorkflowCommonWorkspaceService,
            _workflowdeletemanypostqueryhook.WorkflowDeleteManyPostQueryHook,
            _workflowdeleteonepostqueryhook.WorkflowDeleteOnePostQueryHook,
            _workflowdestroyoneprequeryhook.WorkflowDestroyOnePreQueryHook,
            _workflowdestroymanyprequeryhook.WorkflowDestroyManyPreQueryHook,
            _workflowdestroyonepostqueryhook.WorkflowDestroyOnePostQueryHook,
            _workflowdestroymanypostqueryhook.WorkflowDestroyManyPostQueryHook
        ]
    })
], WorkflowQueryHookModule);

//# sourceMappingURL=workflow-query-hook.module.js.map