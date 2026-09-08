"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "MicrosoftGetMessageListService", {
    enumerable: true,
    get: function() {
        return MicrosoftGetMessageListService;
    }
});
const _common = require("@nestjs/common");
const _microsoftgraphclient = require("@microsoft/microsoft-graph-client");
const _guards = require("@sniptt/guards");
const _types = require("twenty-shared/types");
const _microsoftoauth2clientprovider = require("../../../../../connected-account/oauth2-client-manager/drivers/microsoft/microsoft-oauth2-client.provider");
const _microsoftmessagelistfetcherrorhandlerservice = require("./microsoft-message-list-fetch-error-handler.service");
const _torelativegraphurlutil = require("../utils/to-relative-graph-url.util");
const _utils = require("twenty-shared/utils");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
// Microsoft API limit is 999 messages per request on this endpoint
const MESSAGING_MICROSOFT_USERS_MESSAGES_LIST_MAX_RESULT = 999;
const MESSAGE_LIST_PREFER_HEADER = `odata.maxpagesize=${MESSAGING_MICROSOFT_USERS_MESSAGES_LIST_MAX_RESULT}, IdType="ImmutableId"`;
const MICROSOFT_GRAPH_BATCH_LIMIT = 20;
let MicrosoftGetMessageListService = class MicrosoftGetMessageListService {
    async getMessageLists({ messageChannel, connectedAccount, messageFolders }) {
        const foldersToProcess = messageChannel.messageFolderImportPolicy === _types.MessageFolderImportPolicy.SELECTED_FOLDERS ? messageFolders.filter((folder)=>folder.isSynced) : messageFolders;
        if (foldersToProcess.length === 0) {
            this.logger.warn(`Connected account ${connectedAccount.id}: Message Channel: ${messageChannel.id}: No folders to process`);
            return [];
        }
        const microsoftClient = await this.microsoftOAuth2ClientProvider.getClient(connectedAccount.id);
        const results = [];
        for(let batchStart = 0; batchStart < foldersToProcess.length; batchStart += MICROSOFT_GRAPH_BATCH_LIMIT){
            const foldersBatch = foldersToProcess.slice(batchStart, batchStart + MICROSOFT_GRAPH_BATCH_LIMIT);
            const batchResults = await this.getMessageListBatch(microsoftClient, foldersBatch);
            results.push(...batchResults);
        }
        return results;
    }
    async getMessageListBatch(microsoftClient, foldersBatch) {
        const folderByRequestId = new Map();
        const requests = foldersBatch.map((folder, index)=>{
            const requestId = (index + 1).toString();
            folderByRequestId.set(requestId, folder);
            return {
                id: requestId,
                method: 'GET',
                url: this.buildInitialDeltaUrl(folder),
                headers: {
                    Prefer: MESSAGE_LIST_PREFER_HEADER
                }
            };
        });
        const batchResponse = await microsoftClient.api('/$batch').version('beta').post({
            requests
        }).catch((error)=>this.microsoftMessageListFetchErrorHandler.handleError(error));
        const results = [];
        for (const response of batchResponse.responses){
            const folder = folderByRequestId.get(response.id);
            if (!(0, _utils.isDefined)(folder)) {
                throw new Error(`Microsoft batch response references unknown request id ${response.id}`);
            }
            if (response.status !== 200) {
                this.microsoftMessageListFetchErrorHandler.handleError({
                    statusCode: response.status,
                    message: response.body?.error?.message,
                    code: response.body?.error?.code
                });
            }
            results.push(await this.iterateFolderPages(microsoftClient, folder, response.body));
        }
        return results;
    }
    buildInitialDeltaUrl(folder) {
        if ((0, _guards.isNonEmptyString)(folder.syncCursor)) {
            return (0, _torelativegraphurlutil.toRelativeGraphUrl)(folder.syncCursor);
        }
        const folderId = folder.externalId || folder.name;
        return `/me/mailfolders/${folderId}/messages/delta?$select=id`;
    }
    async iterateFolderPages(microsoftClient, folder, firstPage) {
        const messageExternalIds = [];
        const messageExternalIdsToDelete = [];
        const callback = (data)=>{
            if ('@removed' in data) {
                messageExternalIdsToDelete.push(data.id);
            } else {
                messageExternalIds.push(data.id);
            }
            return true;
        };
        const pageCollection = {
            value: firstPage?.value ?? [],
            '@odata.nextLink': firstPage?.['@odata.nextLink'],
            '@odata.deltaLink': firstPage?.['@odata.deltaLink']
        };
        const pageIterator = new _microsoftgraphclient.PageIterator(microsoftClient, pageCollection, callback, {
            headers: {
                Prefer: MESSAGE_LIST_PREFER_HEADER
            }
        });
        await pageIterator.iterate().catch((error)=>{
            this.microsoftMessageListFetchErrorHandler.handleError(error);
        });
        return {
            messageExternalIds,
            messageExternalIdsToDelete,
            previousSyncCursor: folder.syncCursor,
            nextSyncCursor: pageIterator.getDeltaLink() || '',
            folderId: folder.id
        };
    }
    constructor(microsoftOAuth2ClientProvider, microsoftMessageListFetchErrorHandler){
        this.microsoftOAuth2ClientProvider = microsoftOAuth2ClientProvider;
        this.microsoftMessageListFetchErrorHandler = microsoftMessageListFetchErrorHandler;
        this.logger = new _common.Logger(MicrosoftGetMessageListService.name);
    }
};
MicrosoftGetMessageListService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _microsoftoauth2clientprovider.MicrosoftOAuth2ClientProvider === "undefined" ? Object : _microsoftoauth2clientprovider.MicrosoftOAuth2ClientProvider,
        typeof _microsoftmessagelistfetcherrorhandlerservice.MicrosoftMessageListFetchErrorHandler === "undefined" ? Object : _microsoftmessagelistfetcherrorhandlerservice.MicrosoftMessageListFetchErrorHandler
    ])
], MicrosoftGetMessageListService);

//# sourceMappingURL=microsoft-get-message-list.service.js.map