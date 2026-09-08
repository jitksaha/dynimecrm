/* @license Enterprise */ "use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "BillingWebhookSubscriptionService", {
    enumerable: true,
    get: function() {
        return BillingWebhookSubscriptionService;
    }
});
const _common = require("@nestjs/common");
const _typeorm = require("@nestjs/typeorm");
const _utils = require("twenty-shared/utils");
const _workspace = require("twenty-shared/workspace");
const _typeorm1 = require("typeorm");
const _getdeletedstripesubscriptionitemidsfromstripesubscriptioneventutil = require("../utils/get-deleted-stripe-subscription-item-ids-from-stripe-subscription-event.util");
const _transformstripesubscriptioneventtodatabasecustomerutil = require("../utils/transform-stripe-subscription-event-to-database-customer.util");
const _transformstripesubscriptioneventtodatabasesubscriptionitemutil = require("../utils/transform-stripe-subscription-event-to-database-subscription-item.util");
const _transformstripesubscriptioneventtodatabasesubscriptionutil = require("../utils/transform-stripe-subscription-event-to-database-subscription.util");
const _billingexception = require("../../billing/billing.exception");
const _workspaceactivatingsubscriptionstatusesconstant = require("../../billing/constants/workspace-activating-subscription-statuses.constant");
const _billingcustomerentity = require("../../billing/entities/billing-customer.entity");
const _billingsubscriptionitementity = require("../../billing/entities/billing-subscription-item.entity");
const _billingsubscriptionentity = require("../../billing/entities/billing-subscription.entity");
const _billingsubscriptionstatusenum = require("../../billing/enums/billing-subscription-status.enum");
const _billingwebhookeventsenum = require("../../billing/enums/billing-webhook-events.enum");
const _billingusagecacheservice = require("../../billing/services/billing-usage-cache.service");
const _stripecustomerservice = require("../../billing/stripe/services/stripe-customer.service");
const _stripesubscriptionscheduleservice = require("../../billing/stripe/services/stripe-subscription-schedule.service");
const _resolvebillingperiodboundaryupdateutil = require("../../billing/utils/resolve-billing-period-boundary-update.util");
const _messagequeuedecorator = require("../../message-queue/decorators/message-queue.decorator");
const _messagequeueconstants = require("../../message-queue/message-queue.constants");
const _messagequeueservice = require("../../message-queue/services/message-queue.service");
const _workspaceservice = require("../../workspace/services/workspace.service");
const _workspaceentity = require("../../workspace/workspace.entity");
const _injectworkspacescopedrepositorydecorator = require("../../../twenty-orm/workspace-scoped-repository/inject-workspace-scoped-repository.decorator");
const _workspacescopedrepository = require("../../../twenty-orm/workspace-scoped-repository/workspace-scoped-repository");
const _workspacecacheservice = require("../../../workspace-cache/services/workspace-cache.service");
const _cleanworkspacedeletionwarninguservarsjob = require("../../../workspace-manager/workspace-cleaner/jobs/clean-workspace-deletion-warning-user-vars.job");
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
let BillingWebhookSubscriptionService = class BillingWebhookSubscriptionService {
    async processStripeEvent(workspaceId, event) {
        const { data, type } = event;
        const workspace = await this.workspaceRepository.findOne({
            where: {
                id: workspaceId
            },
            withDeleted: true
        });
        if (!(0, _utils.isDefined)(workspace)) {
            throw new _billingexception.BillingException(`Workspace not found for subscription event ${event.id} / workspaceId: ${workspaceId}`, _billingexception.BillingExceptionCode.BILLING_SUBSCRIPTION_EVENT_WORKSPACE_NOT_FOUND, {
                userFriendlyMessage: /*i18n*/ {
                    id: "bK8AyJ",
                    message: "Workspace {workspaceId} is not found.",
                    values: {
                        workspaceId: workspaceId
                    }
                }
            });
        }
        if ((0, _utils.isDefined)(workspace.deletedAt) && type !== _billingwebhookeventsenum.BillingWebhookEvent.CUSTOMER_SUBSCRIPTION_DELETED) {
            throw new _billingexception.BillingException(`Workspace not found for subscription event ${event.id} / workspaceId: ${workspaceId}`, _billingexception.BillingExceptionCode.BILLING_SUBSCRIPTION_EVENT_WORKSPACE_NOT_FOUND, {
                userFriendlyMessage: /*i18n*/ {
                    id: "bK8AyJ",
                    message: "Workspace {workspaceId} is not found.",
                    values: {
                        workspaceId: workspaceId
                    }
                }
            });
        }
        await this.billingCustomerRepository.upsert(workspaceId, (0, _transformstripesubscriptioneventtodatabasecustomerutil.transformStripeSubscriptionEventToDatabaseCustomer)(workspaceId, data), {
            conflictPaths: [
                'workspaceId'
            ],
            skipUpdateIfNoValuesChanged: true
        });
        const liveCustomerSubscriptions = await this.stripeSubscriptionScheduleService.listCustomerNotEndedSubscriptionsWithSchedule(String(data.object.customer));
        const subscriptionFromList = liveCustomerSubscriptions.find((customerSubscription)=>customerSubscription.id === data.object.id);
        const subscriptionWithSchedule = (0, _utils.isDefined)(subscriptionFromList) ? subscriptionFromList : await this.stripeSubscriptionScheduleService.getSubscriptionWithSchedule(data.object.id);
        const allLiveSubscriptions = (0, _utils.isDefined)(subscriptionFromList) ? liveCustomerSubscriptions : [
            ...liveCustomerSubscriptions,
            subscriptionWithSchedule
        ];
        const incomingSubscription = (0, _transformstripesubscriptioneventtodatabasesubscriptionutil.transformStripeSubscriptionEventToDatabaseSubscription)(workspaceId, subscriptionWithSchedule);
        const storedSubscription = await this.billingSubscriptionRepository.findOne({
            where: {
                stripeSubscriptionId: incomingSubscription.stripeSubscriptionId
            },
            select: {
                id: true,
                currentPeriodStart: true,
                currentPeriodEnd: true
            }
        });
        await this.billingSubscriptionRepository.upsert({
            ...incomingSubscription,
            ...(0, _resolvebillingperiodboundaryupdateutil.resolveBillingPeriodBoundaryUpdate)({
                incomingPeriodStart: incomingSubscription.currentPeriodStart,
                storedSubscription
            })
        }, {
            conflictPaths: [
                'stripeSubscriptionId'
            ],
            skipUpdateIfNoValuesChanged: true
        });
        const updatedBillingSubscription = await this.billingSubscriptionRepository.findOne({
            where: {
                workspaceId,
                stripeSubscriptionId: data.object.id
            }
        });
        if (!(0, _utils.isDefined)(updatedBillingSubscription)) {
            throw new _billingexception.BillingException('Billing subscription not found after upsert', _billingexception.BillingExceptionCode.BILLING_SUBSCRIPTION_NOT_FOUND);
        }
        await this.updateBillingSubscriptionItems(updatedBillingSubscription.id, event, workspaceId);
        await this.billingUsageCacheService.flushAvailableCredits(workspace.id);
        await this.workspaceCacheService.invalidateAndRecompute(workspace.id, [
            'currentBillingSubscription'
        ]);
        const shouldSuspendWorkspace = allLiveSubscriptions.every((customerSubscription)=>this.shouldSuspendWorkspace(customerSubscription));
        const shouldReactivateWorkspace = allLiveSubscriptions.some((customerSubscription)=>this.shouldReactivateWorkspace(customerSubscription));
        if (shouldSuspendWorkspace) {
            const refreshedWorkspace = await this.workspaceRepository.findOne({
                where: {
                    id: workspaceId
                },
                withDeleted: true
            });
            if (!(0, _utils.isDefined)(refreshedWorkspace)) {
                throw new _billingexception.BillingException(`Workspace not found on re-read for subscription event ${event.id} / workspaceId: ${workspaceId}`, _billingexception.BillingExceptionCode.BILLING_SUBSCRIPTION_EVENT_WORKSPACE_NOT_FOUND, {
                    userFriendlyMessage: /*i18n*/ {
                        id: "bK8AyJ",
                        message: "Workspace {workspaceId} is not found.",
                        values: {
                            workspaceId: workspaceId
                        }
                    }
                });
            }
            if (!(0, _utils.isDefined)(refreshedWorkspace.deletedAt)) {
                switch(refreshedWorkspace.activationStatus){
                    case _workspace.WorkspaceActivationStatus.PENDING_CREATION:
                        await this.workspaceService.deleteWorkspace(workspaceId, true);
                        break;
                    case _workspace.WorkspaceActivationStatus.ACTIVE:
                        await this.workspaceService.suspendWorkspace(workspaceId);
                        break;
                    case _workspace.WorkspaceActivationStatus.SUSPENDED:
                    case _workspace.WorkspaceActivationStatus.CREATED:
                    case _workspace.WorkspaceActivationStatus.ONGOING_CREATION:
                    case _workspace.WorkspaceActivationStatus.INACTIVE:
                        break;
                    default:
                        (0, _utils.assertUnreachable)(refreshedWorkspace.activationStatus);
                }
            }
        } else if (shouldReactivateWorkspace) {
            const hasBeenReactivated = await this.workspaceService.reactivateWorkspace(workspaceId);
            if (hasBeenReactivated) {
                await this.messageQueueService.add(_cleanworkspacedeletionwarninguservarsjob.CleanWorkspaceDeletionWarningUserVarsJob.name, {
                    workspaceId
                });
            }
        }
        await this.stripeCustomerService.updateCustomerMetadataWorkspaceId(String(data.object.customer), workspaceId);
        return {
            stripeSubscriptionId: data.object.id,
            stripeCustomerId: data.object.customer
        };
    }
    shouldSuspendWorkspace(subscription) {
        const status = subscription.status;
        const suspendedStatuses = [
            _billingsubscriptionstatusenum.SubscriptionStatus.Canceled,
            _billingsubscriptionstatusenum.SubscriptionStatus.Unpaid
        ];
        if (suspendedStatuses.includes(status)) {
            return true;
        }
        const timeSinceTrialEnd = Date.now() / 1000 - (subscription.trial_end || 0);
        const hasTrialJustEnded = timeSinceTrialEnd > 0 && timeSinceTrialEnd < 60 * 60 * 24;
        const canceledDuringTrial = subscription.cancel_at_period_end && (0, _utils.isDefined)(subscription.canceled_at) && (0, _utils.isDefined)(subscription.trial_end) && subscription.canceled_at <= subscription.trial_end;
        return hasTrialJustEnded && (status === _billingsubscriptionstatusenum.SubscriptionStatus.PastDue || canceledDuringTrial);
    }
    shouldReactivateWorkspace(subscription) {
        const status = subscription.status;
        return _workspaceactivatingsubscriptionstatusesconstant.WORKSPACE_ACTIVATING_SUBSCRIPTION_STATUSES.includes(status);
    }
    async updateBillingSubscriptionItems(subscriptionId, event, workspaceId) {
        const deletedSubscriptionItemIds = (0, _getdeletedstripesubscriptionitemidsfromstripesubscriptioneventutil.getDeletedStripeSubscriptionItemIdsFromStripeSubscriptionEvent)(event);
        if (deletedSubscriptionItemIds.length > 0) {
            await this.billingSubscriptionItemRepository.delete({
                billingSubscriptionId: subscriptionId,
                stripeSubscriptionItemId: (0, _typeorm1.In)(deletedSubscriptionItemIds)
            });
        }
        await this.billingSubscriptionItemRepository.upsert((0, _transformstripesubscriptioneventtodatabasesubscriptionitemutil.transformStripeSubscriptionEventToDatabaseSubscriptionItem)(subscriptionId, event.data, workspaceId), {
            conflictPaths: [
                'stripeSubscriptionItemId'
            ],
            skipUpdateIfNoValuesChanged: true
        });
    }
    constructor(stripeCustomerService, messageQueueService, // Stripe webhook upserts conflict-resolve globally on stripeSubscriptionId.
    // eslint-disable-next-line twenty/prefer-workspace-scoped-repository
    billingSubscriptionRepository, billingSubscriptionItemRepository, workspaceRepository, billingCustomerRepository, workspaceService, stripeSubscriptionScheduleService, billingUsageCacheService, workspaceCacheService){
        this.stripeCustomerService = stripeCustomerService;
        this.messageQueueService = messageQueueService;
        this.billingSubscriptionRepository = billingSubscriptionRepository;
        this.billingSubscriptionItemRepository = billingSubscriptionItemRepository;
        this.workspaceRepository = workspaceRepository;
        this.billingCustomerRepository = billingCustomerRepository;
        this.workspaceService = workspaceService;
        this.stripeSubscriptionScheduleService = stripeSubscriptionScheduleService;
        this.billingUsageCacheService = billingUsageCacheService;
        this.workspaceCacheService = workspaceCacheService;
        this.logger = new _common.Logger(BillingWebhookSubscriptionService.name);
    }
};
BillingWebhookSubscriptionService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_param(1, (0, _messagequeuedecorator.InjectMessageQueue)(_messagequeueconstants.MessageQueue.workspaceQueue)),
    _ts_param(2, (0, _typeorm.InjectRepository)(_billingsubscriptionentity.BillingSubscriptionEntity)),
    _ts_param(3, (0, _typeorm.InjectRepository)(_billingsubscriptionitementity.BillingSubscriptionItemEntity)),
    _ts_param(4, (0, _typeorm.InjectRepository)(_workspaceentity.WorkspaceEntity)),
    _ts_param(5, (0, _injectworkspacescopedrepositorydecorator.InjectWorkspaceScopedRepository)(_billingcustomerentity.BillingCustomerEntity)),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _stripecustomerservice.StripeCustomerService === "undefined" ? Object : _stripecustomerservice.StripeCustomerService,
        typeof _messagequeueservice.MessageQueueService === "undefined" ? Object : _messagequeueservice.MessageQueueService,
        typeof _typeorm1.Repository === "undefined" ? Object : _typeorm1.Repository,
        typeof _typeorm1.Repository === "undefined" ? Object : _typeorm1.Repository,
        typeof _typeorm1.Repository === "undefined" ? Object : _typeorm1.Repository,
        typeof _workspacescopedrepository.WorkspaceScopedRepository === "undefined" ? Object : _workspacescopedrepository.WorkspaceScopedRepository,
        typeof _workspaceservice.WorkspaceService === "undefined" ? Object : _workspaceservice.WorkspaceService,
        typeof _stripesubscriptionscheduleservice.StripeSubscriptionScheduleService === "undefined" ? Object : _stripesubscriptionscheduleservice.StripeSubscriptionScheduleService,
        typeof _billingusagecacheservice.BillingUsageCacheService === "undefined" ? Object : _billingusagecacheservice.BillingUsageCacheService,
        typeof _workspacecacheservice.WorkspaceCacheService === "undefined" ? Object : _workspacecacheservice.WorkspaceCacheService
    ])
], BillingWebhookSubscriptionService);

//# sourceMappingURL=billing-webhook-subscription.service.js.map