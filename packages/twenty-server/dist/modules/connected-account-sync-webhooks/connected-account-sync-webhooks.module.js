"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "ConnectedAccountSyncWebhooksModule", {
    enumerable: true,
    get: function() {
        return ConnectedAccountSyncWebhooksModule;
    }
});
const _common = require("@nestjs/common");
const _connectedaccountsyncwebhookscontroller = require("./connected-account-sync-webhooks.controller");
const _calendareventwebhooksyncmodule = require("./calendar-event-webhook-sync/calendar-event-webhook-sync.module");
const _googlewebhookdrivermodule = require("./drivers/google/google-webhook-driver.module");
const _microsoftwebhookdrivermodule = require("./drivers/microsoft/microsoft-webhook-driver.module");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let ConnectedAccountSyncWebhooksModule = class ConnectedAccountSyncWebhooksModule {
};
ConnectedAccountSyncWebhooksModule = _ts_decorate([
    (0, _common.Module)({
        imports: [
            _googlewebhookdrivermodule.GoogleWebhookDriverModule,
            _microsoftwebhookdrivermodule.MicrosoftWebhookDriverModule,
            _calendareventwebhooksyncmodule.CalendarEventWebhookSyncModule
        ],
        controllers: [
            _connectedaccountsyncwebhookscontroller.ConnectedAccountSyncWebhooksController
        ]
    })
], ConnectedAccountSyncWebhooksModule);

//# sourceMappingURL=connected-account-sync-webhooks.module.js.map