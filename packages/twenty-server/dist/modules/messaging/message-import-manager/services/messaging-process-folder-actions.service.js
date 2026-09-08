"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "MessagingProcessFolderActionsService", {
    enumerable: true,
    get: function() {
        return MessagingProcessFolderActionsService;
    }
});
const _common = require("@nestjs/common");
const _typeorm = require("@nestjs/typeorm");
const _utils = require("twenty-shared/utils");
const _typeorm1 = require("typeorm");
const _messagefolderentity = require("../../../../engine/metadata-modules/message-folder/entities/message-folder.entity");
const _workspaceormmanager = require("../../../../engine/twenty-orm/workspace-orm.manager");
const _buildsystemauthcontextutil = require("../../../../engine/twenty-orm/utils/build-system-auth-context.util");
const _types = require("twenty-shared/types");
const _messagingdeletefoldermessagesservice = require("./messaging-delete-folder-messages.service");
const _messagingimportfoldermessagesservice = require("./messaging-import-folder-messages.service");
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
let MessagingProcessFolderActionsService = class MessagingProcessFolderActionsService {
    async processFolderActions(messageChannel, messageFolders, workspaceId) {
        const foldersWithPendingActions = messageFolders.filter((folder)=>(0, _utils.isDefined)(folder.pendingSyncAction) && folder.pendingSyncAction !== _types.MessageFolderPendingSyncAction.NONE);
        if (foldersWithPendingActions.length === 0) {
            return {
                messageExternalIdsToImport: []
            };
        }
        this.logger.log(`WorkspaceId: ${workspaceId}, MessageChannelId: ${messageChannel.id} - Processing ${foldersWithPendingActions.length} folders with pending actions`);
        const messageExternalIdsToImport = new Set();
        const folderIdsToDelete = [];
        const processedFolderIds = [];
        const failedFolderIds = [];
        for (const folder of foldersWithPendingActions){
            try {
                this.logger.debug(`WorkspaceId: ${workspaceId}, MessageChannelId: ${messageChannel.id}, FolderId: ${folder.id} - Processing folder action: ${folder.pendingSyncAction}`);
                switch(folder.pendingSyncAction){
                    case _types.MessageFolderPendingSyncAction.FOLDER_DELETION:
                        {
                            await this.messagingDeleteFolderMessagesService.deleteFolderMessages(workspaceId, messageChannel, folder);
                            folderIdsToDelete.push(folder.id);
                            this.logger.debug(`WorkspaceId: ${workspaceId}, MessageChannelId: ${messageChannel.id}, FolderId: ${folder.id} - Completed FOLDER_DELETION action`);
                            break;
                        }
                    case _types.MessageFolderPendingSyncAction.FOLDER_IMPORT:
                        {
                            const folderMessageExternalIdsToImport = await this.messagingImportFolderMessagesService.getFolderMessageIdsToImport(messageChannel, folder);
                            for (const messageExternalId of folderMessageExternalIdsToImport){
                                messageExternalIdsToImport.add(messageExternalId);
                            }
                            this.logger.debug(`WorkspaceId: ${workspaceId}, MessageChannelId: ${messageChannel.id}, FolderId: ${folder.id} - Completed FOLDER_IMPORT action`);
                            break;
                        }
                }
                processedFolderIds.push(folder.id);
            } catch (error) {
                this.logger.error(`WorkspaceId: ${workspaceId}, MessageChannelId: ${messageChannel.id}, FolderId: ${folder.id} - Error processing folder action: ${error.message}`, error.stack);
                failedFolderIds.push({
                    folderId: folder.id,
                    error
                });
            }
        }
        if (failedFolderIds.length > 0) {
            this.logger.warn(`WorkspaceId: ${workspaceId}, MessageChannelId: ${messageChannel.id} - Failed to process ${failedFolderIds.length} folders. They will be retried on next sync.`);
        }
        if (processedFolderIds.length > 0 || folderIdsToDelete.length > 0) {
            const authContext = (0, _buildsystemauthcontextutil.buildSystemAuthContext)(workspaceId);
            await this.workspaceOrmManager.executeInWorkspaceContext(async ()=>{
                if (processedFolderIds.length > 0) {
                    await this.messageFolderRepository.update({
                        id: (0, _typeorm1.In)(processedFolderIds),
                        workspaceId
                    }, {
                        pendingSyncAction: _types.MessageFolderPendingSyncAction.NONE
                    });
                    this.logger.debug(`WorkspaceId: ${workspaceId}, MessageChannelId: ${messageChannel.id} - Reset pendingSyncAction to NONE for ${processedFolderIds.length} folders`);
                }
                if (folderIdsToDelete.length > 0) {
                    await this.messageFolderRepository.delete({
                        id: (0, _typeorm1.In)(folderIdsToDelete),
                        workspaceId
                    });
                    this.logger.log(`WorkspaceId: ${workspaceId}, MessageChannelId: ${messageChannel.id} - Deleted ${folderIdsToDelete.length} folders`);
                }
            }, authContext, {
                lite: true
            });
        }
        return {
            messageExternalIdsToImport: [
                ...messageExternalIdsToImport
            ]
        };
    }
    constructor(workspaceOrmManager, messageFolderRepository, messagingDeleteFolderMessagesService, messagingImportFolderMessagesService){
        this.workspaceOrmManager = workspaceOrmManager;
        this.messageFolderRepository = messageFolderRepository;
        this.messagingDeleteFolderMessagesService = messagingDeleteFolderMessagesService;
        this.messagingImportFolderMessagesService = messagingImportFolderMessagesService;
        this.logger = new _common.Logger(MessagingProcessFolderActionsService.name);
    }
};
MessagingProcessFolderActionsService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_param(1, (0, _typeorm.InjectRepository)(_messagefolderentity.MessageFolderEntity)),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _workspaceormmanager.WorkspaceOrmManager === "undefined" ? Object : _workspaceormmanager.WorkspaceOrmManager,
        typeof _typeorm1.Repository === "undefined" ? Object : _typeorm1.Repository,
        typeof _messagingdeletefoldermessagesservice.MessagingDeleteFolderMessagesService === "undefined" ? Object : _messagingdeletefoldermessagesservice.MessagingDeleteFolderMessagesService,
        typeof _messagingimportfoldermessagesservice.MessagingImportFolderMessagesService === "undefined" ? Object : _messagingimportfoldermessagesservice.MessagingImportFolderMessagesService
    ])
], MessagingProcessFolderActionsService);

//# sourceMappingURL=messaging-process-folder-actions.service.js.map