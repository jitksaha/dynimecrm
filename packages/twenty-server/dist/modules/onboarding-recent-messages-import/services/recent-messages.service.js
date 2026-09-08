"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "RecentMessagesService", {
    enumerable: true,
    get: function() {
        return RecentMessagesService;
    }
});
const _common = require("@nestjs/common");
const _types = require("twenty-shared/types");
const _messageimportdriverexception = require("../../messaging/message-import-manager/drivers/exceptions/message-import-driver.exception");
const _recentmessagesmaxcountconstant = require("../constants/recent-messages-max-count.constant");
const _gmailrecentmessagesservice = require("./gmail-recent-messages.service");
const _imaprecentmessagesservice = require("./imap-recent-messages.service");
const _microsoftrecentmessagesservice = require("./microsoft-recent-messages.service");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let RecentMessagesService = class RecentMessagesService {
    async getExternalIds({ connectedAccount, messageFolders }) {
        const externalIds = await this.getExternalIdsByProvider({
            connectedAccount,
            messageFolders
        });
        return [
            ...new Set(externalIds)
        ];
    }
    async getExternalIdsByProvider({ connectedAccount, messageFolders }) {
        const maxCount = _recentmessagesmaxcountconstant.RECENT_MESSAGES_MAX_COUNT;
        switch(connectedAccount.provider){
            case _types.ConnectedAccountProvider.GOOGLE:
                return this.gmailRecentMessagesService.getExternalIds({
                    connectedAccountId: connectedAccount.id,
                    maxCount
                });
            case _types.ConnectedAccountProvider.MICROSOFT:
                return this.microsoftRecentMessagesService.getExternalIds({
                    connectedAccountId: connectedAccount.id,
                    maxCount
                });
            case _types.ConnectedAccountProvider.IMAP_SMTP_CALDAV:
                return this.imapRecentMessagesService.getExternalIds({
                    connectedAccountId: connectedAccount.id,
                    messageFolders,
                    maxCount
                });
            default:
                throw new _messageimportdriverexception.MessageImportDriverException(`Provider ${connectedAccount.provider} is not supported`, _messageimportdriverexception.MessageImportDriverExceptionCode.PROVIDER_NOT_SUPPORTED);
        }
    }
    constructor(gmailRecentMessagesService, microsoftRecentMessagesService, imapRecentMessagesService){
        this.gmailRecentMessagesService = gmailRecentMessagesService;
        this.microsoftRecentMessagesService = microsoftRecentMessagesService;
        this.imapRecentMessagesService = imapRecentMessagesService;
    }
};
RecentMessagesService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _gmailrecentmessagesservice.GmailRecentMessagesService === "undefined" ? Object : _gmailrecentmessagesservice.GmailRecentMessagesService,
        typeof _microsoftrecentmessagesservice.MicrosoftRecentMessagesService === "undefined" ? Object : _microsoftrecentmessagesservice.MicrosoftRecentMessagesService,
        typeof _imaprecentmessagesservice.ImapRecentMessagesService === "undefined" ? Object : _imaprecentmessagesservice.ImapRecentMessagesService
    ])
], RecentMessagesService);

//# sourceMappingURL=recent-messages.service.js.map