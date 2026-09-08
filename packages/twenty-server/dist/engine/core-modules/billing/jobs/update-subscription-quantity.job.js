/* @license Enterprise */ "use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "UpdateSubscriptionQuantityJob", {
    enumerable: true,
    get: function() {
        return UpdateSubscriptionQuantityJob;
    }
});
const _common = require("@nestjs/common");
const _billingsubscriptionupdateservice = require("../services/billing-subscription-update.service");
const _processdecorator = require("../../message-queue/decorators/process.decorator");
const _processordecorator = require("../../message-queue/decorators/processor.decorator");
const _messagequeueconstants = require("../../message-queue/message-queue.constants");
const _workspaceormmanager = require("../../../twenty-orm/workspace-orm.manager");
const _buildsystemauthcontextutil = require("../../../twenty-orm/utils/build-system-auth-context.util");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let UpdateSubscriptionQuantityJob = class UpdateSubscriptionQuantityJob {
    async handle(data) {
        const authContext = (0, _buildsystemauthcontextutil.buildSystemAuthContext)(data.workspaceId);
        await this.workspaceOrmManager.executeInWorkspaceContext(async ()=>{
            const workspaceMemberRepository = this.workspaceOrmManager.getRepository('workspaceMember', {
                shouldBypassPermissionChecks: true
            });
            const workspaceMembersCount = await workspaceMemberRepository.count();
            if (!workspaceMembersCount || workspaceMembersCount <= 0) {
                return;
            }
            try {
                await this.billingSubscriptionUpdateService.changeSeats(data.workspaceId, workspaceMembersCount);
                this.logger.log(`Updating workspace ${data.workspaceId} subscription quantity to ${workspaceMembersCount} members`);
            } catch (e) {
                this.logger.warn(`Failed to update workspace ${data.workspaceId} subscription quantity to ${workspaceMembersCount} members. Error: ${e}`);
            }
        }, authContext);
    }
    constructor(billingSubscriptionUpdateService, workspaceOrmManager){
        this.billingSubscriptionUpdateService = billingSubscriptionUpdateService;
        this.workspaceOrmManager = workspaceOrmManager;
        this.logger = new _common.Logger(UpdateSubscriptionQuantityJob.name);
    }
};
_ts_decorate([
    (0, _processdecorator.Process)(UpdateSubscriptionQuantityJob.name),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof UpdateSubscriptionQuantityJobData === "undefined" ? Object : UpdateSubscriptionQuantityJobData
    ]),
    _ts_metadata("design:returntype", Promise)
], UpdateSubscriptionQuantityJob.prototype, "handle", null);
UpdateSubscriptionQuantityJob = _ts_decorate([
    (0, _processordecorator.Processor)({
        queueName: _messagequeueconstants.MessageQueue.billingQueue,
        scope: _common.Scope.REQUEST
    }),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _billingsubscriptionupdateservice.BillingSubscriptionUpdateService === "undefined" ? Object : _billingsubscriptionupdateservice.BillingSubscriptionUpdateService,
        typeof _workspaceormmanager.WorkspaceOrmManager === "undefined" ? Object : _workspaceormmanager.WorkspaceOrmManager
    ])
], UpdateSubscriptionQuantityJob);

//# sourceMappingURL=update-subscription-quantity.job.js.map