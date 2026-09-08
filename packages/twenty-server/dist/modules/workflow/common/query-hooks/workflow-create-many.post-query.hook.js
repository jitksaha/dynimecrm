"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "WorkflowCreateManyPostQueryHook", {
    enumerable: true,
    get: function() {
        return WorkflowCreateManyPostQueryHook;
    }
});
const _utils = require("twenty-shared/utils");
const _workspacequeryhookdecorator = require("../../../../engine/api/graphql/workspace-query-runner/workspace-query-hook/decorators/workspace-query-hook.decorator");
const _workspacequeryhooktype = require("../../../../engine/api/graphql/workspace-query-runner/workspace-query-hook/types/workspace-query-hook.type");
const _recordpositionservice = require("../../../../engine/core-modules/record-position/services/record-position.service");
const _workflowversioncoresyncservice = require("../../../../engine/core-modules/workflow/services/workflow-version-core-sync.service");
const _workspaceexception = require("../../../../engine/core-modules/workspace/workspace.exception");
const _workspaceormmanager = require("../../../../engine/twenty-orm/workspace-orm.manager");
const _workflowversionworkspaceentity = require("../standard-objects/workflow-version.workspace-entity");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let WorkflowCreateManyPostQueryHook = class WorkflowCreateManyPostQueryHook {
    async execute(authContext, _objectName, payload) {
        const workspace = authContext.workspace;
        (0, _utils.assertIsDefinedOrThrow)(workspace, _workspaceexception.WorkspaceNotFoundDefaultError);
        const position = await this.workspaceOrmManager.executeInWorkspaceContext(()=>this.recordPositionService.buildRecordPosition({
                value: 'first',
                objectMetadata: {
                    isCustom: false,
                    nameSingular: 'workflowVersion'
                },
                workspaceId: workspace.id
            }), authContext);
        for (const workflow of payload){
            await this.workflowVersionCoreSyncService.writeWorkflowVersionAndMirror(workspace.id, async (workflowVersionRepository)=>{
                const insertResult = await workflowVersionRepository.insert({
                    workflowId: workflow.id,
                    status: _workflowversionworkspaceentity.WorkflowVersionStatus.DRAFT,
                    name: 'v1',
                    position
                });
                return insertResult.generatedMaps[0].id;
            });
        }
    }
    constructor(workspaceOrmManager, recordPositionService, workflowVersionCoreSyncService){
        this.workspaceOrmManager = workspaceOrmManager;
        this.recordPositionService = recordPositionService;
        this.workflowVersionCoreSyncService = workflowVersionCoreSyncService;
    }
};
WorkflowCreateManyPostQueryHook = _ts_decorate([
    (0, _workspacequeryhookdecorator.WorkspaceQueryHook)({
        key: `workflow.createMany`,
        type: _workspacequeryhooktype.WorkspaceQueryHookType.POST_HOOK
    }),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _workspaceormmanager.WorkspaceOrmManager === "undefined" ? Object : _workspaceormmanager.WorkspaceOrmManager,
        typeof _recordpositionservice.RecordPositionService === "undefined" ? Object : _recordpositionservice.RecordPositionService,
        typeof _workflowversioncoresyncservice.WorkflowVersionCoreSyncService === "undefined" ? Object : _workflowversioncoresyncservice.WorkflowVersionCoreSyncService
    ])
], WorkflowCreateManyPostQueryHook);

//# sourceMappingURL=workflow-create-many.post-query.hook.js.map