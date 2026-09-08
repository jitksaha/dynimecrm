"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "CreateCampaignDeliveryFastInstanceCommand", {
    enumerable: true,
    get: function() {
        return CreateCampaignDeliveryFastInstanceCommand;
    }
});
const _registeredinstancecommanddecorator = require("../../../../engine/core-modules/upgrade/decorators/registered-instance-command.decorator");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let CreateCampaignDeliveryFastInstanceCommand = class CreateCampaignDeliveryFastInstanceCommand {
    async up(queryRunner) {
        await queryRunner.query('CREATE TABLE "core"."campaignDelivery" ("workspaceId" uuid NOT NULL, "id" uuid NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "campaignId" uuid NOT NULL, "personId" uuid NOT NULL, "recipientEmail" character varying NOT NULL, "state" character varying NOT NULL DEFAULT \'QUEUED\', "skipReason" character varying, "failureReason" character varying, "claimToken" uuid, "claimExpiresAt" TIMESTAMP WITH TIME ZONE, "providerMessageId" character varying, "sentAt" TIMESTAMP WITH TIME ZONE, "deliveredAt" TIMESTAMP WITH TIME ZONE, "bouncedAt" TIMESTAMP WITH TIME ZONE, "complainedAt" TIMESTAMP WITH TIME ZONE, "rejectedAt" TIMESTAMP WITH TIME ZONE, "renderingFailedAt" TIMESTAMP WITH TIME ZONE, CONSTRAINT "CHK_CAMPAIGN_DELIVERY_CLAIM_HAS_LEASE" CHECK ("state" <> \'SENDING\' OR "claimExpiresAt" IS NOT NULL), CONSTRAINT "CHK_CAMPAIGN_DELIVERY_CLAIM_IS_WHOLE" CHECK (("claimToken" IS NULL) = ("claimExpiresAt" IS NULL)), CONSTRAINT "PK_ceb21bdf267212ad5d7e0c3ce75" PRIMARY KEY ("id"))');
        await queryRunner.query('CREATE UNIQUE INDEX "IDX_CAMPAIGN_DELIVERY_PROVIDER_MESSAGE_ID" ON "core"."campaignDelivery" ("workspaceId", "providerMessageId") WHERE "providerMessageId" IS NOT NULL');
        await queryRunner.query('CREATE INDEX "IDX_CAMPAIGN_DELIVERY_COUNTS" ON "core"."campaignDelivery" ("workspaceId", "campaignId", "state") ');
        await queryRunner.query('CREATE INDEX "IDX_CAMPAIGN_DELIVERY_EXPIRED_CLAIM" ON "core"."campaignDelivery" ("claimExpiresAt") WHERE "state" = \'SENDING\'');
        await queryRunner.query('CREATE INDEX "IDX_CAMPAIGN_DELIVERY_UNFINISHED" ON "core"."campaignDelivery" ("campaignId") WHERE "state" IN (\'QUEUED\', \'SENDING\')');
        await queryRunner.query('CREATE UNIQUE INDEX "IDX_CAMPAIGN_DELIVERY_UNIQUE" ON "core"."campaignDelivery" ("campaignId", "personId") ');
        await queryRunner.query('ALTER TABLE "core"."campaignDelivery" ADD CONSTRAINT "FK_9121b71f743c6f44efa2357021c" FOREIGN KEY ("workspaceId") REFERENCES "core"."workspace"("id") ON DELETE CASCADE ON UPDATE NO ACTION');
    }
    async down(queryRunner) {
        await queryRunner.query('ALTER TABLE "core"."campaignDelivery" DROP CONSTRAINT "FK_9121b71f743c6f44efa2357021c"');
        await queryRunner.query('DROP INDEX "core"."IDX_CAMPAIGN_DELIVERY_UNIQUE"');
        await queryRunner.query('DROP INDEX "core"."IDX_CAMPAIGN_DELIVERY_UNFINISHED"');
        await queryRunner.query('DROP INDEX "core"."IDX_CAMPAIGN_DELIVERY_EXPIRED_CLAIM"');
        await queryRunner.query('DROP INDEX "core"."IDX_CAMPAIGN_DELIVERY_COUNTS"');
        await queryRunner.query('DROP INDEX "core"."IDX_CAMPAIGN_DELIVERY_PROVIDER_MESSAGE_ID"');
        await queryRunner.query('DROP TABLE "core"."campaignDelivery"');
    }
};
CreateCampaignDeliveryFastInstanceCommand = _ts_decorate([
    (0, _registeredinstancecommanddecorator.RegisteredInstanceCommand)('2.38.0', 1788200700000)
], CreateCampaignDeliveryFastInstanceCommand);

//# sourceMappingURL=2-38-instance-command-fast-1788200700000-create-campaign-delivery.js.map