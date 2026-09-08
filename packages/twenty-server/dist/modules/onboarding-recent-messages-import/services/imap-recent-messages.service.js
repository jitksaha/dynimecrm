"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "ImapRecentMessagesService", {
    enumerable: true,
    get: function() {
        return ImapRecentMessagesService;
    }
});
const _common = require("@nestjs/common");
const _utils = require("twenty-shared/utils");
const _imapclientprovider = require("../../messaging/message-import-manager/drivers/imap/providers/imap-client.provider");
const _getimapfolderpathutil = require("../../messaging/message-import-manager/drivers/imap/utils/get-imap-folder-path.util");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let ImapRecentMessagesService = class ImapRecentMessagesService {
    async getExternalIds({ connectedAccountId, messageFolders, maxCount }) {
        const sentFolders = messageFolders.filter((messageFolder)=>messageFolder.isSentFolder);
        if (sentFolders.length === 0) {
            return [];
        }
        const imapClient = await this.imapClientProvider.getClient(connectedAccountId);
        try {
            const messageExternalIds = [];
            for (const messageFolder of sentFolders){
                messageExternalIds.push(...await this.getFolderExternalIds({
                    imapClient,
                    messageFolder,
                    maxCount
                }));
            }
            return messageExternalIds;
        } finally{
            await this.imapClientProvider.closeClient(imapClient);
        }
    }
    async getFolderExternalIds({ imapClient, messageFolder, maxCount }) {
        const folderPath = (0, _getimapfolderpathutil.getImapFolderPath)(messageFolder.externalId, imapClient);
        if (!(0, _utils.isDefined)(folderPath)) {
            return [];
        }
        const mailboxLock = await imapClient.getMailboxLock(folderPath);
        try {
            const mailbox = imapClient.mailbox;
            if (!mailbox || typeof mailbox === 'boolean' || mailbox.exists === 0) {
                return [];
            }
            const firstSequenceNumber = Math.max(1, mailbox.exists - maxCount + 1);
            const messageExternalIds = [];
            for await (const message of imapClient.fetch(`${firstSequenceNumber}:*`, {
                uid: true
            })){
                messageExternalIds.push(`${folderPath}:${message.uid}`);
            }
            return messageExternalIds.reverse();
        } finally{
            mailboxLock.release();
        }
    }
    constructor(imapClientProvider){
        this.imapClientProvider = imapClientProvider;
    }
};
ImapRecentMessagesService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _imapclientprovider.ImapClientProvider === "undefined" ? Object : _imapclientprovider.ImapClientProvider
    ])
], ImapRecentMessagesService);

//# sourceMappingURL=imap-recent-messages.service.js.map