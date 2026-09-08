"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "AddChannelWebhookSubscriptionFieldsFastInstanceCommand", {
    enumerable: true,
    get: function() {
        return AddChannelWebhookSubscriptionFieldsFastInstanceCommand;
    }
});
const _registeredinstancecommanddecorator = require("../../../../engine/core-modules/upgrade/decorators/registered-instance-command.decorator");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let AddChannelWebhookSubscriptionFieldsFastInstanceCommand = class AddChannelWebhookSubscriptionFieldsFastInstanceCommand {
    async up(queryRunner) {
        await queryRunner.query('ALTER TABLE "core"."calendarChannel" ADD "webhookSubscriptionExternalId" character varying');
        await queryRunner.query('ALTER TABLE "core"."calendarChannel" ADD "webhookSubscriptionExternalResourceId" character varying');
        await queryRunner.query('ALTER TABLE "core"."calendarChannel" ADD "webhookSubscriptionClientState" character varying');
        await queryRunner.query('CREATE TYPE "core"."calendarChannel_webhooksubscriptionstatus_enum" AS ENUM(\'PENDING\', \'ACTIVE\', \'FAILED\', \'EXPIRED\')');
        await queryRunner.query('ALTER TABLE "core"."calendarChannel" ADD "webhookSubscriptionStatus" "core"."calendarChannel_webhooksubscriptionstatus_enum"');
        await queryRunner.query('ALTER TABLE "core"."calendarChannel" ADD "webhookSubscriptionExpiresAt" TIMESTAMP WITH TIME ZONE');
        await queryRunner.query('ALTER TABLE "core"."messageChannel" ADD "webhookSubscriptionExternalId" character varying');
        await queryRunner.query('ALTER TABLE "core"."messageChannel" ADD "webhookSubscriptionClientState" character varying');
        await queryRunner.query('CREATE TYPE "core"."messageChannel_webhooksubscriptionstatus_enum" AS ENUM(\'PENDING\', \'ACTIVE\', \'FAILED\', \'EXPIRED\')');
        await queryRunner.query('ALTER TABLE "core"."messageChannel" ADD "webhookSubscriptionStatus" "core"."messageChannel_webhooksubscriptionstatus_enum"');
        await queryRunner.query('ALTER TABLE "core"."messageChannel" ADD "webhookSubscriptionExpiresAt" TIMESTAMP WITH TIME ZONE');
    }
    async down(queryRunner) {
        await queryRunner.query('ALTER TABLE "core"."messageChannel" DROP COLUMN "webhookSubscriptionExpiresAt"');
        await queryRunner.query('ALTER TABLE "core"."messageChannel" DROP COLUMN "webhookSubscriptionStatus"');
        await queryRunner.query('DROP TYPE "core"."messageChannel_webhooksubscriptionstatus_enum"');
        await queryRunner.query('ALTER TABLE "core"."messageChannel" DROP COLUMN "webhookSubscriptionClientState"');
        await queryRunner.query('ALTER TABLE "core"."messageChannel" DROP COLUMN "webhookSubscriptionExternalId"');
        await queryRunner.query('ALTER TABLE "core"."calendarChannel" DROP COLUMN "webhookSubscriptionExpiresAt"');
        await queryRunner.query('ALTER TABLE "core"."calendarChannel" DROP COLUMN "webhookSubscriptionStatus"');
        await queryRunner.query('DROP TYPE "core"."calendarChannel_webhooksubscriptionstatus_enum"');
        await queryRunner.query('ALTER TABLE "core"."calendarChannel" DROP COLUMN "webhookSubscriptionClientState"');
        await queryRunner.query('ALTER TABLE "core"."calendarChannel" DROP COLUMN "webhookSubscriptionExternalResourceId"');
        await queryRunner.query('ALTER TABLE "core"."calendarChannel" DROP COLUMN "webhookSubscriptionExternalId"');
    }
};
AddChannelWebhookSubscriptionFieldsFastInstanceCommand = _ts_decorate([
    (0, _registeredinstancecommanddecorator.RegisteredInstanceCommand)('2.16.0', 1782152096938)
], AddChannelWebhookSubscriptionFieldsFastInstanceCommand);

//# sourceMappingURL=2-16-instance-command-fast-1782152096938-add-channel-webhook-subscription-fields.js.map