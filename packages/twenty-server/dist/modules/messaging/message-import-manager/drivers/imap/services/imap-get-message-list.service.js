"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "ImapGetMessageListService", {
    enumerable: true,
    get: function() {
        return ImapGetMessageListService;
    }
});
const _common = require("@nestjs/common");
const _utils = require("twenty-shared/utils");
const _types = require("twenty-shared/types");
const _messageimportdriverexception = require("../../exceptions/message-import-driver.exception");
const _imapclientprovider = require("../providers/imap-client.provider");
const _imapmessagelistfetcherrorhandlerservice = require("./imap-message-list-fetch-error-handler.service");
const _imapsyncservice = require("./imap-sync.service");
const _createsynccursorutil = require("../utils/create-sync-cursor.util");
const _extractmailboxstateutil = require("../utils/extract-mailbox-state.util");
const _getimapfolderpathutil = require("../utils/get-imap-folder-path.util");
const _isimapmailboxnotfounderrorutil = require("../utils/is-imap-mailbox-not-found-error.util");
const _normalizeimapunicodeutil = require("../utils/normalize-imap-unicode.util");
const _parsesynccursorutil = require("../utils/parse-sync-cursor.util");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let ImapGetMessageListService = class ImapGetMessageListService {
    async getMessageLists({ connectedAccount, messageFolders, messageChannel }) {
        const foldersToProcess = messageChannel.messageFolderImportPolicy === _types.MessageFolderImportPolicy.SELECTED_FOLDERS ? messageFolders.filter((folder)=>folder.isSynced) : messageFolders;
        if (foldersToProcess.length === 0) {
            this.logger.warn(`Connected account ${connectedAccount.id}: No folders to process`);
            return [];
        }
        const client = await this.imapClientProvider.getClient(connectedAccount.id);
        try {
            const results = [];
            for (const folder of foldersToProcess){
                try {
                    const response = await this.getMessageList(client, folder);
                    results.push({
                        ...response,
                        folderId: folder.id
                    });
                } catch (error) {
                    if ((0, _isimapmailboxnotfounderrorutil.isImapMailboxNotFoundError)(error)) {
                        this.logger.warn(`Skipping unavailable mailbox for folder ${folder.name}`);
                        continue;
                    }
                    throw error;
                }
            }
            return results;
        } catch (error) {
            this.logger.error(`Connected account ${connectedAccount.id}: Error fetching message list: ${error.message}`);
            this.errorHandler.handleError(error);
            throw error;
        } finally{
            await this.imapClientProvider.closeClient(client);
        }
    }
    async getMessageList(client, folder) {
        const messageExternalIdPrefix = (0, _getimapfolderpathutil.getImapFolderPath)(folder.externalId);
        if (!(0, _utils.isDefined)(messageExternalIdPrefix)) {
            throw new _messageimportdriverexception.MessageImportDriverException(`Folder ${folder.name} has no path`, _messageimportdriverexception.MessageImportDriverExceptionCode.NOT_FOUND);
        }
        const folderPath = (0, _normalizeimapunicodeutil.normalizeImapUnicode)(messageExternalIdPrefix, client);
        if (await this.canSkipFolderSync(client, folder)) {
            this.logger.log(`Skipping folder ${folder.name}: no new messages`);
            return {
                messageExternalIds: [],
                messageExternalIdsToDelete: [],
                nextSyncCursor: folder.syncCursor ?? '',
                previousSyncCursor: folder.syncCursor,
                folderId: folder.id
            };
        }
        this.logger.log(`Processing folder: ${folder.name}`);
        const previousCursor = (0, _parsesynccursorutil.parseSyncCursor)(folder.syncCursor);
        const lock = await client.getMailboxLock(folderPath);
        try {
            const mailbox = client.mailbox;
            if (!mailbox || typeof mailbox === 'boolean') {
                throw new _messageimportdriverexception.MessageImportDriverException(`Invalid mailbox state for folder ${folderPath}`, _messageimportdriverexception.MessageImportDriverExceptionCode.UNKNOWN);
            }
            const mailboxState = await (0, _extractmailboxstateutil.resolveMailboxState)(client, folderPath, mailbox);
            const { messageUids } = await this.imapSyncService.syncFolder(client, folderPath, previousCursor, mailboxState);
            const nextCursor = (0, _createsynccursorutil.createSyncCursor)(messageUids, previousCursor, mailboxState);
            const messageExternalIds = messageUids.sort((a, b)=>b - a).map((uid)=>`${messageExternalIdPrefix}:${uid}`);
            return {
                messageExternalIds,
                messageExternalIdsToDelete: [],
                nextSyncCursor: JSON.stringify(nextCursor),
                previousSyncCursor: folder.syncCursor,
                folderId: folder.id
            };
        } catch (error) {
            if ((0, _isimapmailboxnotfounderrorutil.isImapMailboxNotFoundError)(error)) {
                throw error;
            }
            this.logger.error(`Error syncing folder ${folder.name}: ${error.message}`);
            this.errorHandler.handleError(error);
            throw error;
        } finally{
            lock.release();
        }
    }
    async canSkipFolderSync(client, folder) {
        const folderPath = (0, _getimapfolderpathutil.getImapFolderPath)(folder.externalId, client);
        const previousCursor = (0, _parsesynccursorutil.parseSyncCursor)(folder.syncCursor);
        if (!(0, _utils.isDefined)(folderPath) || !(0, _utils.isDefined)(previousCursor)) {
            return false;
        }
        try {
            const supportsCondstore = client.capabilities.has('CONDSTORE');
            const status = await client.status(folderPath, {
                uidNext: true,
                uidValidity: true,
                ...supportsCondstore && {
                    highestModseq: true
                }
            });
            if (!(0, _utils.isDefined)(status.uidValidity)) {
                this.logger.debug(`Folder ${folderPath}: Server missing UIDVALIDITY. Sync required.`);
                return false;
            }
            if (!(0, _utils.isDefined)(status.uidNext)) {
                this.logger.debug(`Folder ${folderPath}: Server missing UIDNEXT. Sync required.`);
                return false;
            }
            const uidNext = Number(status.uidNext);
            const uidValidity = Number(status.uidValidity);
            if (previousCursor.uidValidity !== uidValidity) {
                this.logger.debug(`Folder ${folderPath}: UIDVALIDITY changed (${previousCursor.uidValidity} → ${uidValidity}). Full sync required.`);
                return false;
            }
            const hasModSeqChanged = (0, _utils.isDefined)(previousCursor.modSeq) && (0, _utils.isDefined)(status.highestModseq) && previousCursor.modSeq !== status.highestModseq.toString();
            if (hasModSeqChanged) {
                this.logger.debug(`Folder ${folderPath}: MODSEQ changed (${previousCursor.modSeq} → ${status.highestModseq}). Sync required.`);
                return false;
            }
            const maxUid = Math.max(0, uidNext - 1);
            return previousCursor.highestUid >= maxUid;
        } catch (error) {
            this.logger.warn(`Failed to get status for folder ${folderPath}: ${error.message}`);
            return false;
        }
    }
    constructor(imapClientProvider, imapSyncService, errorHandler){
        this.imapClientProvider = imapClientProvider;
        this.imapSyncService = imapSyncService;
        this.errorHandler = errorHandler;
        this.logger = new _common.Logger(ImapGetMessageListService.name);
    }
};
ImapGetMessageListService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _imapclientprovider.ImapClientProvider === "undefined" ? Object : _imapclientprovider.ImapClientProvider,
        typeof _imapsyncservice.ImapSyncService === "undefined" ? Object : _imapsyncservice.ImapSyncService,
        typeof _imapmessagelistfetcherrorhandlerservice.ImapMessageListFetchErrorHandler === "undefined" ? Object : _imapmessagelistfetcherrorhandlerservice.ImapMessageListFetchErrorHandler
    ])
], ImapGetMessageListService);

//# sourceMappingURL=imap-get-message-list.service.js.map