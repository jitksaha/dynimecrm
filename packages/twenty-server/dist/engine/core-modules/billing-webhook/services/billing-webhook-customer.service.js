/* @license Enterprise */ "use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "BillingWebhookCustomerService", {
    enumerable: true,
    get: function() {
        return BillingWebhookCustomerService;
    }
});
const _common = require("@nestjs/common");
const _typeorm = require("@nestjs/typeorm");
const _billingexception = require("../../billing/billing.exception");
const _billingcustomerentity = require("../../billing/entities/billing-customer.entity");
const _billingwebhookeventsenum = require("../../billing/enums/billing-webhook-events.enum");
const _stripecustomerservice = require("../../billing/stripe/services/stripe-customer.service");
const _injectworkspacescopedrepositorydecorator = require("../../../twenty-orm/workspace-scoped-repository/inject-workspace-scoped-repository.decorator");
const _workspacescopedrepository = require("../../../twenty-orm/workspace-scoped-repository/workspace-scoped-repository");
const _utils = require("twenty-shared/utils");
const _guards = require("@sniptt/guards");
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
let BillingWebhookCustomerService = class BillingWebhookCustomerService {
    async processStripeEvent(event) {
        if (event.type === _billingwebhookeventsenum.BillingWebhookEvent.CUSTOMER_CREATED) {
            return this.processCustomerCreated(event.data);
        }
        if (event.type === _billingwebhookeventsenum.BillingWebhookEvent.PAYMENT_METHOD_ATTACHED) {
            return this.processPaymentMethodAttachedEvent(event.data);
        }
        if (event.type === _billingwebhookeventsenum.BillingWebhookEvent.PAYMENT_METHOD_DETACHED) {
            return this.processPaymentMethodDetachedEvent(event.data);
        }
    }
    async processCustomerCreated(data) {
        const { id: stripeCustomerId, metadata } = data.object;
        const workspaceId = metadata?.workspaceId;
        if (!workspaceId) {
            throw new _billingexception.BillingException('Workspace ID is required for customer events', _billingexception.BillingExceptionCode.BILLING_CUSTOMER_EVENT_WORKSPACE_NOT_FOUND);
        }
        await this.billingCustomerRepository.upsert(workspaceId, {
            stripeCustomerId
        }, {
            conflictPaths: [
                'workspaceId'
            ],
            skipUpdateIfNoValuesChanged: true
        });
    }
    async processPaymentMethodAttachedEvent(data) {
        const stripeCustomerId = this.extractStripeCustomerId(data.object.customer);
        if (!stripeCustomerId) {
            return {};
        }
        const workspaceId = await this.getWorkspaceIdFromStripeCustomerId(stripeCustomerId);
        if (!workspaceId) {
            return {};
        }
        await this.billingCustomerRepository.update(workspaceId, {
            stripeCustomerId
        }, {
            hasPaymentMethod: true
        });
    }
    async processPaymentMethodDetachedEvent(data) {
        const stripeCustomerId = this.extractStripeCustomerId(data.previous_attributes?.customer);
        if (!(0, _utils.isDefined)(stripeCustomerId)) {
            return;
        }
        const workspaceId = await this.getWorkspaceIdFromStripeCustomerId(stripeCustomerId);
        if (!(0, _utils.isDefined)(workspaceId)) {
            return;
        }
        const hasPaymentMethod = await this.stripeCustomerService.hasPaymentMethod(stripeCustomerId);
        await this.billingCustomerRepository.update(workspaceId, {
            stripeCustomerId
        }, {
            hasPaymentMethod
        });
    }
    async getWorkspaceIdFromStripeCustomerId(stripeCustomerId) {
        const billingCustomer = await this.billingCustomerRepositoryUnscoped.findOne({
            where: {
                stripeCustomerId
            },
            select: {
                workspaceId: true
            }
        });
        return billingCustomer?.workspaceId ?? null;
    }
    extractStripeCustomerId(customer) {
        if (!customer) {
            return null;
        }
        return (0, _guards.isString)(customer) ? customer : customer.id;
    }
    constructor(billingCustomerRepository, // eslint-disable-next-line twenty/prefer-workspace-scoped-repository -- resolves workspaceId from a Stripe customerId before any workspace context exists
    billingCustomerRepositoryUnscoped, stripeCustomerService){
        this.billingCustomerRepository = billingCustomerRepository;
        this.billingCustomerRepositoryUnscoped = billingCustomerRepositoryUnscoped;
        this.stripeCustomerService = stripeCustomerService;
        this.logger = new _common.Logger(BillingWebhookCustomerService.name);
    }
};
BillingWebhookCustomerService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_param(0, (0, _injectworkspacescopedrepositorydecorator.InjectWorkspaceScopedRepository)(_billingcustomerentity.BillingCustomerEntity)),
    _ts_param(1, (0, _typeorm.InjectRepository)(_billingcustomerentity.BillingCustomerEntity)),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _workspacescopedrepository.WorkspaceScopedRepository === "undefined" ? Object : _workspacescopedrepository.WorkspaceScopedRepository,
        typeof Repository === "undefined" ? Object : Repository,
        typeof _stripecustomerservice.StripeCustomerService === "undefined" ? Object : _stripecustomerservice.StripeCustomerService
    ])
], BillingWebhookCustomerService);

//# sourceMappingURL=billing-webhook-customer.service.js.map