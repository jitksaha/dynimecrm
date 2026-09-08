"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "GmailRecentMessagesService", {
    enumerable: true,
    get: function() {
        return GmailRecentMessagesService;
    }
});
const _common = require("@nestjs/common");
const _googleapis = require("googleapis");
const _utils = require("twenty-shared/utils");
const _googleoauth2clientprovider = require("../../connected-account/oauth2-client-manager/drivers/google/google-oauth2-client.provider");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
const GMAIL_SENT_SEARCH_FILTER = 'in:sent';
let GmailRecentMessagesService = class GmailRecentMessagesService {
    async getExternalIds({ connectedAccountId, maxCount }) {
        const oAuth2Client = await this.googleOAuth2ClientProvider.getClient(connectedAccountId);
        const gmailClient = _googleapis.google.gmail({
            version: 'v1',
            auth: oAuth2Client
        });
        const messageList = await gmailClient.users.messages.list({
            userId: 'me',
            maxResults: maxCount,
            q: GMAIL_SENT_SEARCH_FILTER
        });
        return (messageList.data.messages ?? []).map((message)=>message.id).filter(_utils.isDefined);
    }
    constructor(googleOAuth2ClientProvider){
        this.googleOAuth2ClientProvider = googleOAuth2ClientProvider;
    }
};
GmailRecentMessagesService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _googleoauth2clientprovider.GoogleOAuth2ClientProvider === "undefined" ? Object : _googleoauth2clientprovider.GoogleOAuth2ClientProvider
    ])
], GmailRecentMessagesService);

//# sourceMappingURL=gmail-recent-messages.service.js.map