"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "WebhookSubscriptionDriverFactory", {
    enumerable: true,
    get: function() {
        return WebhookSubscriptionDriverFactory;
    }
});
const _common = require("@nestjs/common");
const _types = require("twenty-shared/types");
const _webhooksubscriptiondriverexception = require("../drivers/exceptions/webhook-subscription-driver.exception");
const _googlewebhooksubscriptiondriver = require("../drivers/google/google-webhook-subscription.driver");
const _microsoftwebhooksubscriptiondriver = require("../drivers/microsoft/microsoft-webhook-subscription.driver");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let WebhookSubscriptionDriverFactory = class WebhookSubscriptionDriverFactory {
    isProviderSupported(provider) {
        return provider in this.driversByProvider;
    }
    getDriver(provider) {
        const driver = this.driversByProvider[provider];
        if (!driver) {
            throw new _webhooksubscriptiondriverexception.WebhookSubscriptionDriverException(`Webhook subscriptions are not supported for provider ${provider}`, _webhooksubscriptiondriverexception.WebhookSubscriptionDriverExceptionCode.UNSUPPORTED_PROVIDER);
        }
        return driver;
    }
    constructor(googleWebhookSubscriptionDriver, microsoftWebhookSubscriptionDriver){
        this.googleWebhookSubscriptionDriver = googleWebhookSubscriptionDriver;
        this.microsoftWebhookSubscriptionDriver = microsoftWebhookSubscriptionDriver;
        this.driversByProvider = {
            [_types.ConnectedAccountProvider.GOOGLE]: this.googleWebhookSubscriptionDriver,
            [_types.ConnectedAccountProvider.MICROSOFT]: this.microsoftWebhookSubscriptionDriver
        };
    }
};
WebhookSubscriptionDriverFactory = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _googlewebhooksubscriptiondriver.GoogleWebhookSubscriptionDriver === "undefined" ? Object : _googlewebhooksubscriptiondriver.GoogleWebhookSubscriptionDriver,
        typeof _microsoftwebhooksubscriptiondriver.MicrosoftWebhookSubscriptionDriver === "undefined" ? Object : _microsoftwebhooksubscriptiondriver.MicrosoftWebhookSubscriptionDriver
    ])
], WebhookSubscriptionDriverFactory);

//# sourceMappingURL=webhook-subscription-driver-factory.service.js.map