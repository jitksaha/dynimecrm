"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "AddChannelWebhookSubscriptionExternalIdIndexesFastInstanceCommand", {
    enumerable: true,
    get: function() {
        return AddChannelWebhookSubscriptionExternalIdIndexesFastInstanceCommand;
    }
});
const _registeredinstancecommanddecorator = require("../../../../engine/core-modules/upgrade/decorators/registered-instance-command.decorator");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
const CALENDAR_CHANNEL_WEBHOOK_SUBSCRIPTION_EXTERNAL_ID_INDEX_NAME = 'IDX_CALENDAR_CHANNEL_WEBHOOK_SUBSCRIPTION_EXTERNAL_ID';
const MESSAGE_CHANNEL_WEBHOOK_SUBSCRIPTION_EXTERNAL_ID_INDEX_NAME = 'IDX_MESSAGE_CHANNEL_WEBHOOK_SUBSCRIPTION_EXTERNAL_ID';
let AddChannelWebhookSubscriptionExternalIdIndexesFastInstanceCommand = class AddChannelWebhookSubscriptionExternalIdIndexesFastInstanceCommand {
    async up(queryRunner) {
        await queryRunner.query(`CREATE INDEX IF NOT EXISTS "${CALENDAR_CHANNEL_WEBHOOK_SUBSCRIPTION_EXTERNAL_ID_INDEX_NAME}" ON "core"."calendarChannel" ("webhookSubscriptionExternalId") WHERE "webhookSubscriptionExternalId" IS NOT NULL`);
        await queryRunner.query(`CREATE INDEX IF NOT EXISTS "${MESSAGE_CHANNEL_WEBHOOK_SUBSCRIPTION_EXTERNAL_ID_INDEX_NAME}" ON "core"."messageChannel" ("webhookSubscriptionExternalId") WHERE "webhookSubscriptionExternalId" IS NOT NULL`);
    }
    async down(queryRunner) {
        await queryRunner.query(`DROP INDEX IF EXISTS "core"."${MESSAGE_CHANNEL_WEBHOOK_SUBSCRIPTION_EXTERNAL_ID_INDEX_NAME}"`);
        await queryRunner.query(`DROP INDEX IF EXISTS "core"."${CALENDAR_CHANNEL_WEBHOOK_SUBSCRIPTION_EXTERNAL_ID_INDEX_NAME}"`);
    }
};
AddChannelWebhookSubscriptionExternalIdIndexesFastInstanceCommand = _ts_decorate([
    (0, _registeredinstancecommanddecorator.RegisteredInstanceCommand)('2.25.0', 1785173910915)
], AddChannelWebhookSubscriptionExternalIdIndexesFastInstanceCommand);

//# sourceMappingURL=2-25-instance-command-fast-1785173910915-add-channel-webhook-subscription-external-id-indexes.js.map