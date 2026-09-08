"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "MicrosoftRecentMessagesService", {
    enumerable: true,
    get: function() {
        return MicrosoftRecentMessagesService;
    }
});
const _common = require("@nestjs/common");
const _utils = require("twenty-shared/utils");
const _microsoftoauth2clientprovider = require("../../connected-account/oauth2-client-manager/drivers/microsoft/microsoft-oauth2-client.provider");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
const GRAPH_SENT_MAIL_FOLDER_ID = 'sentitems';
let MicrosoftRecentMessagesService = class MicrosoftRecentMessagesService {
    async getExternalIds({ connectedAccountId, maxCount }) {
        const microsoftClient = await this.microsoftOAuth2ClientProvider.getClient(connectedAccountId);
        const response = await microsoftClient.api(`/me/mailFolders/${GRAPH_SENT_MAIL_FOLDER_ID}/messages?$select=id&$orderby=sentDateTime desc&$top=${maxCount}`).header('Prefer', 'IdType="ImmutableId"').get();
        return (response?.value ?? []).map((message)=>message.id).filter(_utils.isDefined);
    }
    constructor(microsoftOAuth2ClientProvider){
        this.microsoftOAuth2ClientProvider = microsoftOAuth2ClientProvider;
    }
};
MicrosoftRecentMessagesService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _microsoftoauth2clientprovider.MicrosoftOAuth2ClientProvider === "undefined" ? Object : _microsoftoauth2clientprovider.MicrosoftOAuth2ClientProvider
    ])
], MicrosoftRecentMessagesService);

//# sourceMappingURL=microsoft-recent-messages.service.js.map