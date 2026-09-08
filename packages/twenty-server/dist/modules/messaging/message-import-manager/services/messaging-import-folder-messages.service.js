"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "MessagingImportFolderMessagesService", {
    enumerable: true,
    get: function() {
        return MessagingImportFolderMessagesService;
    }
});
const _common = require("@nestjs/common");
const _types = require("twenty-shared/types");
const _gmailgetmessagelistservice = require("../drivers/gmail/services/gmail-get-message-list.service");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let MessagingImportFolderMessagesService = class MessagingImportFolderMessagesService {
    async getFolderMessageIdsToImport(messageChannel, messageFolder) {
        switch(messageChannel.connectedAccount.provider){
            case _types.ConnectedAccountProvider.GOOGLE:
                {
                    const foldersScopedToImportedFolder = messageChannel.messageFolders.map((folder)=>({
                            name: folder.name,
                            externalId: folder.externalId,
                            parentFolderId: folder.parentFolderId,
                            isSynced: folder.id === messageFolder.id
                        }));
                    const [messageList] = await this.gmailGetMessageListService.getMessageListWithoutCursor(messageChannel.connectedAccount, foldersScopedToImportedFolder, {
                        messageFolderImportPolicy: _types.MessageFolderImportPolicy.SELECTED_FOLDERS
                    });
                    return messageList?.messageExternalIds ?? [];
                }
            default:
                return [];
        }
    }
    constructor(gmailGetMessageListService){
        this.gmailGetMessageListService = gmailGetMessageListService;
    }
};
MessagingImportFolderMessagesService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _gmailgetmessagelistservice.GmailGetMessageListService === "undefined" ? Object : _gmailgetmessagelistservice.GmailGetMessageListService
    ])
], MessagingImportFolderMessagesService);

//# sourceMappingURL=messaging-import-folder-messages.service.js.map