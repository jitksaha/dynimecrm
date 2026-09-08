"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "ConnectedAccountListener", {
    enumerable: true,
    get: function() {
        return ConnectedAccountListener;
    }
});
const _common = require("@nestjs/common");
const _typeorm = require("@nestjs/typeorm");
const _utils = require("twenty-shared/utils");
const _oncustombatcheventdecorator = require("../../../engine/api/graphql/graphql-query-runner/decorators/on-custom-batch-event.decorator");
const _userworkspaceentity = require("../../../engine/core-modules/user-workspace/user-workspace.entity");
const _connectedaccountdeletedconstant = require("../../../engine/metadata-modules/connected-account/constants/connected-account-deleted.constant");
const _workspaceormmanager = require("../../../engine/twenty-orm/workspace-orm.manager");
const _buildsystemauthcontextutil = require("../../../engine/twenty-orm/utils/build-system-auth-context.util");
const _customworkspacebatcheventtype = require("../../../engine/workspace-event-emitter/types/custom-workspace-batch-event.type");
const _accountstoreconnectservice = require("../services/accounts-to-reconnect.service");
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
let ConnectedAccountListener = class ConnectedAccountListener {
    async handleDeletedEvent(batchEvent) {
        const { workspaceId } = batchEvent;
        if (!(0, _utils.isDefined)(workspaceId)) {
            return;
        }
        const authContext = (0, _buildsystemauthcontextutil.buildSystemAuthContext)(workspaceId);
        await this.workspaceOrmManager.executeInWorkspaceContext(async ()=>{
            for (const event of batchEvent.events){
                const userWorkspace = await this.userWorkspaceRepository.findOne({
                    where: {
                        id: event.userWorkspaceId
                    }
                });
                if (!userWorkspace) {
                    continue;
                }
                await this.accountsToReconnectService.removeAccountToReconnect(userWorkspace.userId, workspaceId, event.connectedAccountId);
            }
        }, authContext);
    }
    constructor(workspaceOrmManager, accountsToReconnectService, userWorkspaceRepository){
        this.workspaceOrmManager = workspaceOrmManager;
        this.accountsToReconnectService = accountsToReconnectService;
        this.userWorkspaceRepository = userWorkspaceRepository;
    }
};
_ts_decorate([
    (0, _oncustombatcheventdecorator.OnCustomBatchEvent)(_connectedaccountdeletedconstant.CONNECTED_ACCOUNT_DELETED_EVENT),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _customworkspacebatcheventtype.CustomWorkspaceEventBatch === "undefined" ? Object : _customworkspacebatcheventtype.CustomWorkspaceEventBatch
    ]),
    _ts_metadata("design:returntype", Promise)
], ConnectedAccountListener.prototype, "handleDeletedEvent", null);
ConnectedAccountListener = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_param(2, (0, _typeorm.InjectRepository)(_userworkspaceentity.UserWorkspaceEntity)),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _workspaceormmanager.WorkspaceOrmManager === "undefined" ? Object : _workspaceormmanager.WorkspaceOrmManager,
        typeof _accountstoreconnectservice.AccountsToReconnectService === "undefined" ? Object : _accountstoreconnectservice.AccountsToReconnectService,
        typeof Repository === "undefined" ? Object : Repository
    ])
], ConnectedAccountListener);

//# sourceMappingURL=connected-account.listener.js.map