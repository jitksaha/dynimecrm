"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "WebhookSubscriptionManagerModule", {
    enumerable: true,
    get: function() {
        return WebhookSubscriptionManagerModule;
    }
});
const _common = require("@nestjs/common");
const _googlewebhooksubscriptiondriver = require("./drivers/google/google-webhook-subscription.driver");
const _microsoftwebhooksubscriptiondriver = require("./drivers/microsoft/microsoft-webhook-subscription.driver");
const _webhooksubscriptiondriverfactoryservice = require("./services/webhook-subscription-driver-factory.service");
const _oauth2clientmanagermodule = require("../oauth2-client-manager/oauth2-client-manager.module");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let WebhookSubscriptionManagerModule = class WebhookSubscriptionManagerModule {
};
WebhookSubscriptionManagerModule = _ts_decorate([
    (0, _common.Module)({
        imports: [
            _oauth2clientmanagermodule.OAuth2ClientManagerModule
        ],
        providers: [
            _googlewebhooksubscriptiondriver.GoogleWebhookSubscriptionDriver,
            _microsoftwebhooksubscriptiondriver.MicrosoftWebhookSubscriptionDriver,
            _webhooksubscriptiondriverfactoryservice.WebhookSubscriptionDriverFactory
        ],
        exports: [
            _webhooksubscriptiondriverfactoryservice.WebhookSubscriptionDriverFactory
        ]
    })
], WebhookSubscriptionManagerModule);

//# sourceMappingURL=webhook-subscription-manager.module.js.map