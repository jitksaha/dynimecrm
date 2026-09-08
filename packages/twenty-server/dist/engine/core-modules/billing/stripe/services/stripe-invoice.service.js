/* @license Enterprise */ "use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "StripeInvoiceService", {
    enumerable: true,
    get: function() {
        return StripeInvoiceService;
    }
});
const _common = require("@nestjs/common");
const _utils = require("twenty-shared/utils");
const _billingexception = require("../../billing.exception");
const _stripesdkservice = require("../stripe-sdk/services/stripe-sdk.service");
const _twentyconfigservice = require("../../../twenty-config/twenty-config.service");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let StripeInvoiceService = class StripeInvoiceService {
    async listDraftInvoices(stripeSubscriptionId) {
        const invoices = await this.stripe.invoices.list({
            subscription: stripeSubscriptionId,
            status: 'draft'
        });
        return invoices.data;
    }
    async finalizeInvoice(invoiceId) {
        return this.stripe.invoices.finalizeInvoice(invoiceId, {
            auto_advance: true
        });
    }
    async createImmediateUpgradeInvoice({ stripeCustomerId, stripeSubscriptionId, diffAmountInCents, currency, description }) {
        const invoice = await this.stripe.invoices.create({
            customer: stripeCustomerId,
            subscription: stripeSubscriptionId
        });
        let finalizedInvoice;
        let invoiceItemId;
        try {
            const invoiceItem = await this.stripe.invoiceItems.create({
                customer: stripeCustomerId,
                subscription: stripeSubscriptionId,
                invoice: invoice.id,
                amount: diffAmountInCents,
                currency,
                description
            });
            invoiceItemId = invoiceItem.id;
            finalizedInvoice = await this.stripe.invoices.finalizeInvoice(invoice.id, {
                auto_advance: false
            });
        } catch (error) {
            await this.deleteDraftUpgradeInvoice({
                invoiceId: invoice.id,
                invoiceItemId
            });
            throw error;
        }
        if (finalizedInvoice.status === 'paid') {
            return;
        }
        try {
            await this.stripe.invoices.pay(invoice.id);
        } catch (payError) {
            await this.settleFailedUpgradeInvoiceOrThrow({
                invoiceId: invoice.id,
                payError
            });
        }
    }
    async settleFailedUpgradeInvoiceOrThrow({ invoiceId, payError }) {
        const invoice = await this.stripe.invoices.retrieve(invoiceId);
        if (invoice.status === 'paid') {
            return;
        }
        const payErrorMessage = this.getErrorMessage(payError);
        try {
            await this.stripe.invoices.voidInvoice(invoiceId);
        } catch (voidError) {
            const refreshedInvoice = await this.stripe.invoices.retrieve(invoiceId);
            if (refreshedInvoice.status === 'paid') {
                return;
            }
            if (refreshedInvoice.status !== 'void') {
                throw new _billingexception.BillingException(`Failed to void upgrade invoice ${invoiceId} after payment failure (${payErrorMessage}): ${this.getErrorMessage(voidError)}`, _billingexception.BillingExceptionCode.BILLING_UPGRADE_INVOICE_VOID_FAILED);
            }
        }
        const isCardDecline = payError instanceof this.stripe.errors.StripeCardError;
        throw new _billingexception.BillingException(`Failed to pay upgrade invoice ${invoiceId}: ${payErrorMessage}`, isCardDecline ? _billingexception.BillingExceptionCode.BILLING_UPGRADE_INVOICE_PAYMENT_FAILED : _billingexception.BillingExceptionCode.BILLING_STRIPE_ERROR);
    }
    async deleteDraftUpgradeInvoice({ invoiceId, invoiceItemId }) {
        try {
            await this.stripe.invoices.del(invoiceId);
        } catch (deleteError) {
            this.logger.error(`Failed to delete draft upgrade invoice ${invoiceId}: ${this.getErrorMessage(deleteError)}`);
        }
        if (!(0, _utils.isDefined)(invoiceItemId)) {
            return;
        }
        try {
            await this.stripe.invoiceItems.del(invoiceItemId);
        } catch (deleteError) {
            this.logger.error(`Failed to delete upgrade invoice item ${invoiceItemId}: ${this.getErrorMessage(deleteError)}`);
        }
    }
    getErrorMessage(error) {
        return error instanceof Error ? error.message : 'unknown error';
    }
    constructor(twentyConfigService, stripeSDKService){
        this.twentyConfigService = twentyConfigService;
        this.stripeSDKService = stripeSDKService;
        this.logger = new _common.Logger(StripeInvoiceService.name);
        if (!this.twentyConfigService.get('IS_BILLING_ENABLED')) {
            return;
        }
        this.stripe = this.stripeSDKService.getStripe(this.twentyConfigService.get('BILLING_STRIPE_API_KEY'));
    }
};
StripeInvoiceService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _twentyconfigservice.TwentyConfigService === "undefined" ? Object : _twentyconfigservice.TwentyConfigService,
        typeof _stripesdkservice.StripeSDKService === "undefined" ? Object : _stripesdkservice.StripeSDKService
    ])
], StripeInvoiceService);

//# sourceMappingURL=stripe-invoice.service.js.map