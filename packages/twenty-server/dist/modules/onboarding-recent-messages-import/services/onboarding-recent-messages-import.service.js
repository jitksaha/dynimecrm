"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "OnboardingRecentMessagesImportService", {
    enumerable: true,
    get: function() {
        return OnboardingRecentMessagesImportService;
    }
});
const _common = require("@nestjs/common");
const _typeorm = require("@nestjs/typeorm");
const _types = require("twenty-shared/types");
const _utils = require("twenty-shared/utils");
const _typeorm1 = require("typeorm");
const _cachestoragedecorator = require("../../../engine/core-modules/cache-storage/decorators/cache-storage.decorator");
const _cachestorageservice = require("../../../engine/core-modules/cache-storage/services/cache-storage.service");
const _cachestoragenamespaceenum = require("../../../engine/core-modules/cache-storage/types/cache-storage-namespace.enum");
const _messagechannelentity = require("../../../engine/metadata-modules/message-channel/entities/message-channel.entity");
const _workspaceormmanager = require("../../../engine/twenty-orm/workspace-orm.manager");
const _buildsystemauthcontextutil = require("../../../engine/twenty-orm/utils/build-system-auth-context.util");
const _messagechannelsyncstatusservice = require("../../messaging/common/services/message-channel-sync-status.service");
const _messagingmessagesimportservice = require("../../messaging/message-import-manager/services/messaging-messages-import.service");
const _recentmessagesimportcachettlmsconstant = require("../constants/recent-messages-import-cache-ttl-ms.constant");
const _recentmessagesservice = require("./recent-messages.service");
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
let OnboardingRecentMessagesImportService = class OnboardingRecentMessagesImportService {
    async importRecentMessages({ messageChannelId, workspaceId }) {
        const authContext = (0, _buildsystemauthcontextutil.buildSystemAuthContext)(workspaceId);
        try {
            await this.workspaceOrmManager.executeInWorkspaceContext(async ()=>{
                const messageChannel = await this.messageChannelRepository.findOne({
                    where: {
                        id: messageChannelId,
                        workspaceId
                    },
                    relations: {
                        connectedAccount: true,
                        messageFolders: true
                    }
                });
                if (!(0, _utils.isDefined)(messageChannel) || !messageChannel.isSyncEnabled) {
                    return;
                }
                const hasAlreadyCompletedASync = (0, _utils.isDefined)(messageChannel.syncedAt);
                if (hasAlreadyCompletedASync) {
                    return;
                }
                const messageExternalIds = await this.recentMessagesService.getExternalIds({
                    connectedAccount: messageChannel.connectedAccount,
                    messageFolders: messageChannel.messageFolders ?? []
                });
                if (messageExternalIds.length === 0) {
                    return;
                }
                await this.cacheStorage.setAdd(`messages-to-import:${workspaceId}:${messageChannel.id}`, messageExternalIds, _recentmessagesimportcachettlmsconstant.RECENT_MESSAGES_IMPORT_CACHE_TTL_MS);
                await this.messageChannelSyncStatusService.markAsMessagesImportScheduled([
                    messageChannel.id
                ], workspaceId);
                await this.messagingMessagesImportService.processMessageBatchImport({
                    ...messageChannel,
                    syncStage: _types.MessageChannelSyncStage.MESSAGES_IMPORT_SCHEDULED
                }, messageChannel.connectedAccount, workspaceId, messageExternalIds.length);
                await this.messageChannelSyncStatusService.markAsMessagesListFetchPending([
                    messageChannel.id
                ], workspaceId);
                this.logger.log(`WorkspaceId: ${workspaceId}, MessageChannelId: ${messageChannel.id} - Imported ${messageExternalIds.length} recent messages`);
            }, authContext, {
                lite: true
            });
        } catch (error) {
            this.logger.warn(`WorkspaceId: ${workspaceId}, MessageChannelId: ${messageChannelId} - Could not import recent messages: ${error.message}`);
        }
    }
    constructor(cacheStorage, messageChannelRepository, workspaceOrmManager, messageChannelSyncStatusService, messagingMessagesImportService, recentMessagesService){
        this.cacheStorage = cacheStorage;
        this.messageChannelRepository = messageChannelRepository;
        this.workspaceOrmManager = workspaceOrmManager;
        this.messageChannelSyncStatusService = messageChannelSyncStatusService;
        this.messagingMessagesImportService = messagingMessagesImportService;
        this.recentMessagesService = recentMessagesService;
        this.logger = new _common.Logger(OnboardingRecentMessagesImportService.name);
    }
};
OnboardingRecentMessagesImportService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_param(0, (0, _cachestoragedecorator.InjectCacheStorage)(_cachestoragenamespaceenum.CacheStorageNamespace.ModuleMessaging)),
    _ts_param(1, (0, _typeorm.InjectRepository)(_messagechannelentity.MessageChannelEntity)),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _cachestorageservice.CacheStorageService === "undefined" ? Object : _cachestorageservice.CacheStorageService,
        typeof _typeorm1.Repository === "undefined" ? Object : _typeorm1.Repository,
        typeof _workspaceormmanager.WorkspaceOrmManager === "undefined" ? Object : _workspaceormmanager.WorkspaceOrmManager,
        typeof _messagechannelsyncstatusservice.MessageChannelSyncStatusService === "undefined" ? Object : _messagechannelsyncstatusservice.MessageChannelSyncStatusService,
        typeof _messagingmessagesimportservice.MessagingMessagesImportService === "undefined" ? Object : _messagingmessagesimportservice.MessagingMessagesImportService,
        typeof _recentmessagesservice.RecentMessagesService === "undefined" ? Object : _recentmessagesservice.RecentMessagesService
    ])
], OnboardingRecentMessagesImportService);

//# sourceMappingURL=onboarding-recent-messages-import.service.js.map