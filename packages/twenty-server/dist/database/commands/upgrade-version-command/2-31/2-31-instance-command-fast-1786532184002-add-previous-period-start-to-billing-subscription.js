"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "AddPreviousPeriodStartToBillingSubscriptionFastInstanceCommand", {
    enumerable: true,
    get: function() {
        return AddPreviousPeriodStartToBillingSubscriptionFastInstanceCommand;
    }
});
const _registeredinstancecommanddecorator = require("../../../../engine/core-modules/upgrade/decorators/registered-instance-command.decorator");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let AddPreviousPeriodStartToBillingSubscriptionFastInstanceCommand = class AddPreviousPeriodStartToBillingSubscriptionFastInstanceCommand {
    async up(queryRunner) {
        const isBillingSchemaPresent = await queryRunner.query(`SELECT 1 FROM pg_tables WHERE schemaname = 'core' AND tablename = 'billingSubscription'`);
        if (isBillingSchemaPresent.length === 0) {
            return;
        }
        await queryRunner.query(`ALTER TABLE "core"."billingSubscription" ADD COLUMN IF NOT EXISTS "previousPeriodStart" TIMESTAMP WITH TIME ZONE`);
    }
    async down(queryRunner) {
        const isBillingSchemaPresent = await queryRunner.query(`SELECT 1 FROM pg_tables WHERE schemaname = 'core' AND tablename = 'billingSubscription'`);
        if (isBillingSchemaPresent.length === 0) {
            return;
        }
        await queryRunner.query(`ALTER TABLE "core"."billingSubscription" DROP COLUMN IF EXISTS "previousPeriodStart"`);
    }
};
AddPreviousPeriodStartToBillingSubscriptionFastInstanceCommand = _ts_decorate([
    (0, _registeredinstancecommanddecorator.RegisteredInstanceCommand)('2.31.0', 1786532184002)
], AddPreviousPeriodStartToBillingSubscriptionFastInstanceCommand);

//# sourceMappingURL=2-31-instance-command-fast-1786532184002-add-previous-period-start-to-billing-subscription.js.map