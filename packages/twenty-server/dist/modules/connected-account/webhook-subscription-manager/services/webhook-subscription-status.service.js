"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "WebhookSubscriptionStatusService", {
    enumerable: true,
    get: function() {
        return WebhookSubscriptionStatusService;
    }
});
const _common = require("@nestjs/common");
const _typeorm = require("@nestjs/typeorm");
const _types = require("twenty-shared/types");
const _utils = require("twenty-shared/utils");
const _typeorm1 = require("typeorm");
const _calendarchannelentity = require("../../../../engine/metadata-modules/calendar-channel/entities/calendar-channel.entity");
const _messagechannelentity = require("../../../../engine/metadata-modules/message-channel/entities/message-channel.entity");
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
let WebhookSubscriptionStatusService = class WebhookSubscriptionStatusService {
    async markAsActive(channelType, channelId, result, clientState) {
        await this.update(channelType, channelId, {
            webhookSubscriptionExternalId: result.externalSubscriptionId,
            webhookSubscriptionStatus: _types.WebhookSubscriptionStatus.ACTIVE,
            webhookSubscriptionExpiresAt: result.expiresAt,
            ...(0, _utils.isDefined)(clientState) ? {
                webhookSubscriptionClientState: clientState
            } : {},
            ...channelType === _types.WebhookSubscriptionChannelType.CALENDAR ? {
                webhookSubscriptionExternalResourceId: result.externalResourceId
            } : {}
        });
    }
    async markAsFailed(channelType, channelId) {
        await this.update(channelType, channelId, {
            webhookSubscriptionStatus: _types.WebhookSubscriptionStatus.FAILED
        });
    }
    async markAsExpired(channelType, channelId) {
        await this.update(channelType, channelId, {
            webhookSubscriptionStatus: _types.WebhookSubscriptionStatus.EXPIRED
        });
    }
    async resetPendingSubscription(channelType, channelId, clientState) {
        await this.update(channelType, channelId, {
            webhookSubscriptionClientState: clientState,
            webhookSubscriptionExpiresAt: null
        });
    }
    async clearRemovedSubscription(channelType, channelId, workspaceId, removedSubscriptionId) {
        const { affected } = await this.getRepository(channelType).update({
            id: channelId,
            workspaceId,
            ...(0, _utils.isDefined)(removedSubscriptionId) ? {
                webhookSubscriptionExternalId: removedSubscriptionId
            } : {}
        }, {
            webhookSubscriptionExternalId: null,
            webhookSubscriptionStatus: _types.WebhookSubscriptionStatus.FAILED,
            webhookSubscriptionExpiresAt: null,
            ...channelType === _types.WebhookSubscriptionChannelType.CALENDAR ? {
                webhookSubscriptionExternalResourceId: null
            } : {}
        });
        return (0, _utils.isDefined)(affected) && affected > 0;
    }
    update(channelType, channelId, payload) {
        return this.getRepository(channelType).update(channelId, payload);
    }
    getRepository(channelType) {
        return channelType === _types.WebhookSubscriptionChannelType.CALENDAR ? this.calendarChannelRepository : this.messageChannelRepository;
    }
    constructor(messageChannelRepository, calendarChannelRepository){
        this.messageChannelRepository = messageChannelRepository;
        this.calendarChannelRepository = calendarChannelRepository;
    }
};
WebhookSubscriptionStatusService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_param(0, (0, _typeorm.InjectRepository)(_messagechannelentity.MessageChannelEntity)),
    _ts_param(1, (0, _typeorm.InjectRepository)(_calendarchannelentity.CalendarChannelEntity)),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _typeorm1.Repository === "undefined" ? Object : _typeorm1.Repository,
        typeof _typeorm1.Repository === "undefined" ? Object : _typeorm1.Repository
    ])
], WebhookSubscriptionStatusService);

//# sourceMappingURL=webhook-subscription-status.service.js.map