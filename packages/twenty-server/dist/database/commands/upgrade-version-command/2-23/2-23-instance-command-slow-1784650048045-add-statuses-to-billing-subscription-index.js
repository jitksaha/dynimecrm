"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "AddStatusesToBillingSubscriptionIndexSlowInstanceCommand", {
    enumerable: true,
    get: function() {
        return AddStatusesToBillingSubscriptionIndexSlowInstanceCommand;
    }
});
const _registeredinstancecommanddecorator = require("../../../../engine/core-modules/upgrade/decorators/registered-instance-command.decorator");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let AddStatusesToBillingSubscriptionIndexSlowInstanceCommand = class AddStatusesToBillingSubscriptionIndexSlowInstanceCommand {
    async runDataMigration(_dataSource) {}
    async up(queryRunner) {
        const tableExists = await queryRunner.query(`SELECT 1 FROM pg_tables WHERE schemaname = 'core' AND tablename = 'billingSubscription'`);
        if (tableExists.length === 0) {
            return;
        }
        await queryRunner.query('DROP INDEX IF EXISTS "core"."IDX_BILLING_SUBSCRIPTION_WORKSPACE_ID_UNIQUE"');
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_BILLING_SUBSCRIPTION_WORKSPACE_ID_UNIQUE" ON "core"."billingSubscription" ("workspaceId") WHERE status IN ('trialing', 'active', 'past_due', 'incomplete', 'incomplete_expired', 'unpaid', 'paused')`);
    }
    async down(queryRunner) {
        const tableExists = await queryRunner.query(`SELECT 1 FROM pg_tables WHERE schemaname = 'core' AND tablename = 'billingSubscription'`);
        if (tableExists.length === 0) {
            return;
        }
        await queryRunner.query('DROP INDEX IF EXISTS "core"."IDX_BILLING_SUBSCRIPTION_WORKSPACE_ID_UNIQUE"');
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_BILLING_SUBSCRIPTION_WORKSPACE_ID_UNIQUE" ON "core"."billingSubscription" ("workspaceId") WHERE status IN ('trialing', 'active', 'past_due')`);
    }
};
AddStatusesToBillingSubscriptionIndexSlowInstanceCommand = _ts_decorate([
    (0, _registeredinstancecommanddecorator.RegisteredInstanceCommand)('2.23.0', 1784650048045, {
        type: 'slow'
    })
], AddStatusesToBillingSubscriptionIndexSlowInstanceCommand);

//# sourceMappingURL=2-23-instance-command-slow-1784650048045-add-statuses-to-billing-subscription-index.js.map