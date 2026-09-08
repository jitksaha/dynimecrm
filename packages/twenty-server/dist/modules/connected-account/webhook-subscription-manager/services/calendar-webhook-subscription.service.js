"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "CalendarWebhookSubscriptionService", {
    enumerable: true,
    get: function() {
        return CalendarWebhookSubscriptionService;
    }
});
const _common = require("@nestjs/common");
const _typeorm = require("@nestjs/typeorm");
const _types = require("twenty-shared/types");
const _utils = require("twenty-shared/utils");
const _typeorm1 = require("typeorm");
const _uuid = require("uuid");
const _exceptionhandlerservice = require("../../../../engine/core-modules/exception-handler/exception-handler.service");
const _metricsservice = require("../../../../engine/core-modules/metrics/metrics.service");
const _metricskeystype = require("../../../../engine/core-modules/metrics/types/metrics-keys.type");
const _calendarchannelentity = require("../../../../engine/metadata-modules/calendar-channel/entities/calendar-channel.entity");
const _connectedaccountentity = require("../../../../engine/metadata-modules/connected-account/entities/connected-account.entity");
const _webhooksubscriptiondriverexception = require("../drivers/exceptions/webhook-subscription-driver.exception");
const _webhooksubscriptiondriverfactoryservice = require("./webhook-subscription-driver-factory.service");
const _webhooksubscriptionexceptionhandlerservice = require("./webhook-subscription-exception-handler.service");
const _webhooksubscriptionstatusservice = require("./webhook-subscription-status.service");
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
let CalendarWebhookSubscriptionService = class CalendarWebhookSubscriptionService {
    async createSubscription(calendarChannelId, workspaceId) {
        const calendarChannel = await this.calendarChannelRepository.findOne({
            where: {
                id: calendarChannelId,
                workspaceId
            },
            relations: [
                'connectedAccount'
            ]
        });
        if (!(0, _utils.isDefined)(calendarChannel?.connectedAccount)) {
            return;
        }
        const { connectedAccount } = calendarChannel;
        if (!this.webhookSubscriptionDriverFactory.isProviderSupported(connectedAccount.provider)) {
            return;
        }
        if (calendarChannel.webhookSubscriptionStatus === _types.WebhookSubscriptionStatus.ACTIVE) {
            return;
        }
        const clientState = calendarChannel.webhookSubscriptionClientState ?? (0, _uuid.v4)();
        const driver = this.webhookSubscriptionDriverFactory.getDriver(connectedAccount.provider);
        // Keep any existing watch live until the replacement is created, then stop it.
        const previousSubscription = (0, _utils.isDefined)(calendarChannel.webhookSubscriptionExternalId) ? this.toContext(calendarChannel) : null;
        try {
            const result = await driver.createSubscription(calendarChannel.connectedAccountId, _types.WebhookSubscriptionChannelType.CALENDAR, clientState);
            await this.webhookSubscriptionStatusService.markAsActive(_types.WebhookSubscriptionChannelType.CALENDAR, calendarChannel.id, result, clientState);
            this.metricsService.incrementCounterBy({
                key: _metricskeystype.MetricsKeys.ConnectedAccountWebhookSubscriptionCreated,
                amount: 1,
                attributes: this.buildMetricAttributes(connectedAccount.provider)
            });
        } catch (error) {
            await this.webhookSubscriptionStatusService.resetPendingSubscription(_types.WebhookSubscriptionChannelType.CALENDAR, calendarChannel.id, clientState);
            this.metricsService.incrementCounterBy({
                key: _metricskeystype.MetricsKeys.ConnectedAccountWebhookSubscriptionCreationFailed,
                amount: 1,
                attributes: this.buildMetricAttributes(connectedAccount.provider)
            });
            await this.webhookSubscriptionExceptionHandlerService.handleDriverException(error, 'CREATE', _types.WebhookSubscriptionChannelType.CALENDAR, calendarChannel, workspaceId);
            return;
        }
        if ((0, _utils.isDefined)(previousSubscription)) {
            await driver.deleteSubscription(previousSubscription).catch(()=>undefined);
        }
    }
    async recreateSubscription({ calendarChannelId, workspaceId, removedSubscriptionId }) {
        const cleared = await this.webhookSubscriptionStatusService.clearRemovedSubscription(_types.WebhookSubscriptionChannelType.CALENDAR, calendarChannelId, workspaceId, removedSubscriptionId);
        if (!cleared) {
            return;
        }
        await this.createSubscription(calendarChannelId, workspaceId);
    }
    async renewSubscription({ calendarChannelId, workspaceId }) {
        const calendarChannel = await this.calendarChannelRepository.findOne({
            where: {
                id: calendarChannelId,
                workspaceId
            },
            relations: [
                'connectedAccount'
            ]
        });
        if (!(0, _utils.isDefined)(calendarChannel)) {
            return;
        }
        if (calendarChannel.webhookSubscriptionStatus !== _types.WebhookSubscriptionStatus.ACTIVE) {
            await this.createSubscription(calendarChannelId, workspaceId);
            return;
        }
        const { connectedAccount } = calendarChannel;
        if (!(0, _utils.isDefined)(connectedAccount)) {
            return;
        }
        const driver = this.webhookSubscriptionDriverFactory.getDriver(connectedAccount.provider);
        try {
            const result = await driver.renewSubscription(this.toContext(calendarChannel));
            await this.webhookSubscriptionStatusService.markAsActive(_types.WebhookSubscriptionChannelType.CALENDAR, calendarChannel.id, result);
            this.metricsService.incrementCounterBy({
                key: _metricskeystype.MetricsKeys.ConnectedAccountWebhookSubscriptionRenewed,
                amount: 1,
                attributes: this.buildMetricAttributes(connectedAccount.provider)
            });
        } catch (error) {
            this.metricsService.incrementCounterBy({
                key: _metricskeystype.MetricsKeys.ConnectedAccountWebhookSubscriptionRenewalFailed,
                amount: 1,
                attributes: this.buildMetricAttributes(connectedAccount.provider)
            });
            const recoveryAction = await this.webhookSubscriptionExceptionHandlerService.handleDriverException(error, 'RENEW', _types.WebhookSubscriptionChannelType.CALENDAR, calendarChannel, calendarChannel.workspaceId);
            if (recoveryAction === 'RECREATE') {
                await this.createSubscription(calendarChannelId, workspaceId);
            }
        }
    }
    async deleteSubscription(calendarChannelId, workspaceId) {
        const calendarChannel = await this.calendarChannelRepository.findOne({
            where: {
                id: calendarChannelId,
                workspaceId
            }
        });
        if (!(0, _utils.isDefined)(calendarChannel)) {
            return;
        }
        const connectedAccount = await this.connectedAccountRepository.findOne({
            where: {
                id: calendarChannel.connectedAccountId,
                workspaceId: calendarChannel.workspaceId
            }
        });
        if (!(0, _utils.isDefined)(connectedAccount)) {
            return;
        }
        const driver = this.webhookSubscriptionDriverFactory.getDriver(connectedAccount.provider);
        try {
            await driver.deleteSubscription(this.toContext(calendarChannel));
            this.metricsService.incrementCounterBy({
                key: _metricskeystype.MetricsKeys.ConnectedAccountWebhookSubscriptionDeleted,
                amount: 1,
                attributes: this.buildMetricAttributes(connectedAccount.provider)
            });
        } catch (error) {
            if (error instanceof _webhooksubscriptiondriverexception.WebhookSubscriptionDriverException && error.code === _webhooksubscriptiondriverexception.WebhookSubscriptionDriverExceptionCode.NOT_FOUND) {
                return;
            }
            this.metricsService.incrementCounterBy({
                key: _metricskeystype.MetricsKeys.ConnectedAccountWebhookSubscriptionDeletionFailed,
                amount: 1,
                attributes: this.buildMetricAttributes(connectedAccount.provider)
            });
            this.exceptionHandlerService.captureExceptions([
                error
            ], {
                workspace: {
                    id: calendarChannel.workspaceId
                }
            });
        }
    }
    buildMetricAttributes(provider) {
        return {
            channel_type: _types.WebhookSubscriptionChannelType.CALENDAR,
            provider
        };
    }
    toContext(calendarChannel) {
        return {
            connectedAccountId: calendarChannel.connectedAccountId,
            channelType: _types.WebhookSubscriptionChannelType.CALENDAR,
            externalSubscriptionId: calendarChannel.webhookSubscriptionExternalId,
            externalResourceId: calendarChannel.webhookSubscriptionExternalResourceId,
            clientState: calendarChannel.webhookSubscriptionClientState ?? ''
        };
    }
    constructor(connectedAccountRepository, calendarChannelRepository, webhookSubscriptionDriverFactory, exceptionHandlerService, metricsService, webhookSubscriptionStatusService, webhookSubscriptionExceptionHandlerService){
        this.connectedAccountRepository = connectedAccountRepository;
        this.calendarChannelRepository = calendarChannelRepository;
        this.webhookSubscriptionDriverFactory = webhookSubscriptionDriverFactory;
        this.exceptionHandlerService = exceptionHandlerService;
        this.metricsService = metricsService;
        this.webhookSubscriptionStatusService = webhookSubscriptionStatusService;
        this.webhookSubscriptionExceptionHandlerService = webhookSubscriptionExceptionHandlerService;
    }
};
CalendarWebhookSubscriptionService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_param(0, (0, _typeorm.InjectRepository)(_connectedaccountentity.ConnectedAccountEntity)),
    _ts_param(1, (0, _typeorm.InjectRepository)(_calendarchannelentity.CalendarChannelEntity)),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _typeorm1.Repository === "undefined" ? Object : _typeorm1.Repository,
        typeof _typeorm1.Repository === "undefined" ? Object : _typeorm1.Repository,
        typeof _webhooksubscriptiondriverfactoryservice.WebhookSubscriptionDriverFactory === "undefined" ? Object : _webhooksubscriptiondriverfactoryservice.WebhookSubscriptionDriverFactory,
        typeof _exceptionhandlerservice.ExceptionHandlerService === "undefined" ? Object : _exceptionhandlerservice.ExceptionHandlerService,
        typeof _metricsservice.MetricsService === "undefined" ? Object : _metricsservice.MetricsService,
        typeof _webhooksubscriptionstatusservice.WebhookSubscriptionStatusService === "undefined" ? Object : _webhooksubscriptionstatusservice.WebhookSubscriptionStatusService,
        typeof _webhooksubscriptionexceptionhandlerservice.WebhookSubscriptionExceptionHandlerService === "undefined" ? Object : _webhooksubscriptionexceptionhandlerservice.WebhookSubscriptionExceptionHandlerService
    ])
], CalendarWebhookSubscriptionService);

//# sourceMappingURL=calendar-webhook-subscription.service.js.map