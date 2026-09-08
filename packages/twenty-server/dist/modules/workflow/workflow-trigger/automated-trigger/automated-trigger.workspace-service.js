"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "AutomatedTriggerWorkspaceService", {
    enumerable: true,
    get: function() {
        return AutomatedTriggerWorkspaceService;
    }
});
const _common = require("@nestjs/common");
const _utils = require("twenty-shared/utils");
const _workspaceormmanager = require("../../../../engine/twenty-orm/workspace-orm.manager");
const _buildsystemauthcontextutil = require("../../../../engine/twenty-orm/utils/build-system-auth-context.util");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let AutomatedTriggerWorkspaceService = class AutomatedTriggerWorkspaceService {
    async addAutomatedTrigger({ workflowId, type, settings, workspaceId, transactionScope }) {
        if ((0, _utils.isDefined)(transactionScope)) {
            await transactionScope.getRepository('workflowAutomatedTrigger').insert({
                type,
                settings,
                workflowId
            });
            return;
        }
        const authContext = (0, _buildsystemauthcontextutil.buildSystemAuthContext)(workspaceId);
        await this.workspaceOrmManager.executeInWorkspaceContext(async ()=>{
            const workflowAutomatedTriggerRepository = this.workspaceOrmManager.getRepository('workflowAutomatedTrigger');
            await workflowAutomatedTriggerRepository.insert({
                type,
                settings,
                workflowId
            });
        }, authContext);
    }
    async deleteAutomatedTrigger({ workflowId, workspaceId, transactionScope }) {
        if ((0, _utils.isDefined)(transactionScope)) {
            await transactionScope.getRepository('workflowAutomatedTrigger').delete({
                workflowId
            });
            return;
        }
        const authContext = (0, _buildsystemauthcontextutil.buildSystemAuthContext)(workspaceId);
        await this.workspaceOrmManager.executeInWorkspaceContext(async ()=>{
            const workflowAutomatedTriggerRepository = this.workspaceOrmManager.getRepository('workflowAutomatedTrigger');
            await workflowAutomatedTriggerRepository.delete({
                workflowId
            });
        }, authContext);
    }
    constructor(workspaceOrmManager){
        this.workspaceOrmManager = workspaceOrmManager;
    }
};
AutomatedTriggerWorkspaceService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _workspaceormmanager.WorkspaceOrmManager === "undefined" ? Object : _workspaceormmanager.WorkspaceOrmManager
    ])
], AutomatedTriggerWorkspaceService);

//# sourceMappingURL=automated-trigger.workspace-service.js.map