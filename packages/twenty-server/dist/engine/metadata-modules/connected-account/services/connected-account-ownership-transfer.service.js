"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "ConnectedAccountOwnershipTransferService", {
    enumerable: true,
    get: function() {
        return ConnectedAccountOwnershipTransferService;
    }
});
const _common = require("@nestjs/common");
const _typeorm = require("@nestjs/typeorm");
const _typeorm1 = require("typeorm");
const _utils = require("twenty-shared/utils");
const _userworkspaceentity = require("../../../core-modules/user-workspace/user-workspace.entity");
const _connectedaccountmetadataservice = require("../connected-account-metadata.service");
const _userroleservice = require("../../user-role/user-role.service");
const _standardroleconstant = require("../../../workspace-manager/twenty-standard-application/constants/standard-role.constant");
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
let ConnectedAccountOwnershipTransferService = class ConnectedAccountOwnershipTransferService {
    // Reassigns app connections owned by a departing member to another member
    // instead of leaving them orphaned against a userWorkspaceId that's about
    // to be deleted. Every path that removes a member from a workspace while
    // it stays active must call this before deleting the userWorkspace.
    async transferConnectedAccountsOwnershipToCustodian({ removedUserWorkspace, actingUserWorkspaceId }) {
        const custodianUserWorkspaceId = await this.resolveConnectedAccountsCustodianUserWorkspaceId({
            removedUserWorkspace,
            actingUserWorkspaceId
        });
        if ((0, _utils.isDefined)(custodianUserWorkspaceId)) {
            await this.connectedAccountMetadataService.transferOwnership({
                fromUserWorkspaceId: removedUserWorkspace.id,
                toUserWorkspaceId: custodianUserWorkspaceId,
                workspaceId: removedUserWorkspace.workspaceId
            });
        }
    }
    async resolveConnectedAccountsCustodianUserWorkspaceId({ removedUserWorkspace, actingUserWorkspaceId }) {
        const otherUserWorkspaces = await this.userWorkspaceRepository.find({
            where: {
                workspaceId: removedUserWorkspace.workspaceId,
                id: (0, _typeorm1.Not)(removedUserWorkspace.id)
            },
            order: {
                createdAt: 'ASC'
            }
        });
        if (otherUserWorkspaces.length === 0) {
            return undefined;
        }
        const actingUserWorkspace = otherUserWorkspaces.find((otherUserWorkspace)=>otherUserWorkspace.id === actingUserWorkspaceId);
        if ((0, _utils.isDefined)(actingUserWorkspace)) {
            return actingUserWorkspace.id;
        }
        const rolesByUserWorkspaceId = await this.userRoleService.getRolesByUserWorkspaces({
            userWorkspaceIds: otherUserWorkspaces.map((otherUserWorkspace)=>otherUserWorkspace.id),
            workspaceId: removedUserWorkspace.workspaceId
        });
        const oldestAdminUserWorkspace = otherUserWorkspaces.find((otherUserWorkspace)=>rolesByUserWorkspaceId.get(otherUserWorkspace.id)?.some((role)=>role.universalIdentifier === _standardroleconstant.STANDARD_ROLE.admin.universalIdentifier));
        return (oldestAdminUserWorkspace ?? otherUserWorkspaces[0]).id;
    }
    constructor(userWorkspaceRepository, userRoleService, connectedAccountMetadataService){
        this.userWorkspaceRepository = userWorkspaceRepository;
        this.userRoleService = userRoleService;
        this.connectedAccountMetadataService = connectedAccountMetadataService;
    }
};
ConnectedAccountOwnershipTransferService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_param(0, (0, _typeorm.InjectRepository)(_userworkspaceentity.UserWorkspaceEntity)),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _typeorm1.Repository === "undefined" ? Object : _typeorm1.Repository,
        typeof _userroleservice.UserRoleService === "undefined" ? Object : _userroleservice.UserRoleService,
        typeof _connectedaccountmetadataservice.ConnectedAccountMetadataService === "undefined" ? Object : _connectedaccountmetadataservice.ConnectedAccountMetadataService
    ])
], ConnectedAccountOwnershipTransferService);

//# sourceMappingURL=connected-account-ownership-transfer.service.js.map