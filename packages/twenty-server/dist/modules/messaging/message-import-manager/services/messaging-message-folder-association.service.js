"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "MessagingMessageFolderAssociationService", {
    enumerable: true,
    get: function() {
        return MessagingMessageFolderAssociationService;
    }
});
const _common = require("@nestjs/common");
const _typeorm = require("typeorm");
const _workspaceormmanager = require("../../../../engine/twenty-orm/workspace-orm.manager");
const _buildsystemauthcontextutil = require("../../../../engine/twenty-orm/utils/build-system-auth-context.util");
const _buildmessagefolderassociationstoinsertutil = require("../utils/build-message-folder-associations-to-insert.util");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let MessagingMessageFolderAssociationService = class MessagingMessageFolderAssociationService {
    async saveMessageFolderAssociations(associations, workspaceId, transactionScope) {
        const associationIds = [
            ...new Set(associations.filter((association)=>association.messageFolderIds.length > 0).map((association)=>association.messageChannelMessageAssociationId))
        ];
        if (associationIds.length === 0) {
            return;
        }
        const authContext = (0, _buildsystemauthcontextutil.buildSystemAuthContext)(workspaceId);
        await this.workspaceOrmManager.executeInWorkspaceContext(async ()=>{
            const repository = transactionScope.getRepository('messageChannelMessageAssociationMessageFolder');
            const existingRecords = await repository.find({
                where: {
                    messageChannelMessageAssociationId: (0, _typeorm.In)(associationIds)
                }
            });
            const recordsToInsert = (0, _buildmessagefolderassociationstoinsertutil.buildMessageFolderAssociationsToInsert)({
                associations,
                existingRecords
            });
            if (recordsToInsert.length > 0) {
                await repository.insert(recordsToInsert);
            }
        }, authContext, {
            lite: true
        });
    }
    constructor(workspaceOrmManager){
        this.workspaceOrmManager = workspaceOrmManager;
    }
};
MessagingMessageFolderAssociationService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _workspaceormmanager.WorkspaceOrmManager === "undefined" ? Object : _workspaceormmanager.WorkspaceOrmManager
    ])
], MessagingMessageFolderAssociationService);

//# sourceMappingURL=messaging-message-folder-association.service.js.map