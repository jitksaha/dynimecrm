"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "WorkflowVersionStepModule", {
    enumerable: true,
    get: function() {
        return WorkflowVersionStepModule;
    }
});
const _common = require("@nestjs/common");
const _typeorm = require("@nestjs/typeorm");
const _workflowversioncoremodule = require("../../../../engine/core-modules/workflow/workflow-version-core.module");
const _workspaceentity = require("../../../../engine/core-modules/workspace/workspace.entity");
const _aiagentrolemodule = require("../../../../engine/metadata-modules/ai/ai-agent-role/ai-agent-role.module");
const _aiagentmodule = require("../../../../engine/metadata-modules/ai/ai-agent/ai-agent.module");
const _workspacemanyorallflatentitymapscachemodule = require("../../../../engine/metadata-modules/flat-entity/services/workspace-many-or-all-flat-entity-maps-cache.module");
const _logicfunctionmodule = require("../../../../engine/metadata-modules/logic-function/logic-function.module");
const _objectmetadataentity = require("../../../../engine/metadata-modules/object-metadata/object-metadata.entity");
const _roletargetentity = require("../../../../engine/metadata-modules/role-target/role-target.entity");
const _provideworkspacescopedrepository = require("../../../../engine/twenty-orm/workspace-scoped-repository/provide-workspace-scoped-repository");
const _workspacecachemodule = require("../../../../engine/workspace-cache/workspace-cache.module");
const _workflowcommonmodule = require("../../common/workflow-common.module");
const _workflowschemamodule = require("../workflow-schema/workflow-schema.module");
const _codestepbuildmodule = require("./code-step/code-step-build.module");
const _workflowversionstepcreationworkspaceservice = require("./workflow-version-step-creation.workspace-service");
const _workflowversionstepdeletionworkspaceservice = require("./workflow-version-step-deletion.workspace-service");
const _workflowversionstephelpersworkspaceservice = require("./workflow-version-step-helpers.workspace-service");
const _workflowversionstepoperationsworkspaceservice = require("./workflow-version-step-operations.workspace-service");
const _workflowversionstepupdateworkspaceservice = require("./workflow-version-step-update.workspace-service");
const _workflowversionstepworkspaceservice = require("./workflow-version-step.workspace-service");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let WorkflowVersionStepModule = class WorkflowVersionStepModule {
};
WorkflowVersionStepModule = _ts_decorate([
    (0, _common.Module)({
        imports: [
            _workflowschemamodule.WorkflowSchemaModule,
            _logicfunctionmodule.LogicFunctionModule,
            _workflowcommonmodule.WorkflowCommonModule,
            _codestepbuildmodule.CodeStepBuildModule,
            _aiagentrolemodule.AiAgentRoleModule,
            _aiagentmodule.AiAgentModule,
            _workspacecachemodule.WorkspaceCacheModule,
            _typeorm.TypeOrmModule.forFeature([
                _objectmetadataentity.ObjectMetadataEntity,
                _roletargetentity.RoleTargetEntity,
                _workspaceentity.WorkspaceEntity
            ]),
            _workspacemanyorallflatentitymapscachemodule.WorkspaceManyOrAllFlatEntityMapsCacheModule,
            _workflowversioncoremodule.WorkflowVersionCoreModule
        ],
        providers: [
            _workflowversionstepworkspaceservice.WorkflowVersionStepWorkspaceService,
            _workflowversionstepoperationsworkspaceservice.WorkflowVersionStepOperationsWorkspaceService,
            _workflowversionstephelpersworkspaceservice.WorkflowVersionStepHelpersWorkspaceService,
            _workflowversionstepcreationworkspaceservice.WorkflowVersionStepCreationWorkspaceService,
            _workflowversionstepupdateworkspaceservice.WorkflowVersionStepUpdateWorkspaceService,
            _workflowversionstepdeletionworkspaceservice.WorkflowVersionStepDeletionWorkspaceService,
            (0, _provideworkspacescopedrepository.provideWorkspaceScopedRepository)(_roletargetentity.RoleTargetEntity)
        ],
        exports: [
            _workflowversionstepworkspaceservice.WorkflowVersionStepWorkspaceService,
            _workflowversionstepoperationsworkspaceservice.WorkflowVersionStepOperationsWorkspaceService,
            _workflowversionstephelpersworkspaceservice.WorkflowVersionStepHelpersWorkspaceService
        ]
    })
], WorkflowVersionStepModule);

//# sourceMappingURL=workflow-version-step.module.js.map