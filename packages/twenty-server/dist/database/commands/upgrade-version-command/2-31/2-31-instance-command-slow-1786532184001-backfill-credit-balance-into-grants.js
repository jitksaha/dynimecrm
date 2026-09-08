"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "BackfillCreditBalanceIntoGrantsSlowInstanceCommand", {
    enumerable: true,
    get: function() {
        return BackfillCreditBalanceIntoGrantsSlowInstanceCommand;
    }
});
const _registeredinstancecommanddecorator = require("../../../../engine/core-modules/upgrade/decorators/registered-instance-command.decorator");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
const BACKFILL_IDEMPOTENCY_KEY_PREFIX = 'backfill-credit-balance:';
let BackfillCreditBalanceIntoGrantsSlowInstanceCommand = class BackfillCreditBalanceIntoGrantsSlowInstanceCommand {
    async runDataMigration(dataSource) {
        const presentTables = await dataSource.query(`SELECT tablename FROM pg_tables
        WHERE schemaname = 'core'
          AND tablename IN ('billingCreditGrant', 'billingCustomer', 'billingSubscription')`);
        // Nothing to move on an instance without billing: neither the ledger nor
        // the column it mirrors exists there.
        if (presentTables.length < 3) {
            return;
        }
        // Expiry follows the workspace's current period, but never lands in the
        // past: a backfilled grant that expires on creation would silently delete
        // the balance it was meant to preserve.
        //
        // billingCustomer has no foreign key to workspace, so it outlives deleted
        // workspaces, while billingCreditGrant does have one. Without the join
        // those orphans fail the insert and take the whole upgrade down with them.
        await dataSource.query(`INSERT INTO "core"."billingCreditGrant" (
        "workspaceId", "amountMicro", "type", "effectiveAt", "expiresAt", "reason", "idempotencyKey"
      )
      SELECT
        "billingCustomer"."workspaceId",
        "billingCustomer"."creditBalanceMicro",
        'ROLLOVER',
        now(),
        GREATEST(
          COALESCE(
            (
              SELECT "billingSubscription"."currentPeriodEnd"
              FROM "core"."billingSubscription"
              WHERE "billingSubscription"."workspaceId" = "billingCustomer"."workspaceId"
                AND "billingSubscription"."status" <> 'canceled'
              ORDER BY "billingSubscription"."currentPeriodEnd" DESC
              LIMIT 1
            ),
            now()
          ),
          now() + interval '1 day'
        ),
        'Backfilled from billingCustomer.creditBalanceMicro',
        $1 || "billingCustomer"."workspaceId"
      FROM "core"."billingCustomer"
      INNER JOIN "core"."workspace"
        ON "workspace"."id" = "billingCustomer"."workspaceId"
      WHERE "billingCustomer"."creditBalanceMicro" > 0
      ON CONFLICT ("idempotencyKey") DO NOTHING`, [
            BACKFILL_IDEMPOTENCY_KEY_PREFIX
        ]);
    }
    async up(_queryRunner) {
        return;
    }
    async down(queryRunner) {
        // An instance without billing never grew the table, so deleting from it
        // unconditionally would fail the rollback on exactly the instances that
        // had nothing to roll back.
        const isLedgerPresent = await queryRunner.query(`SELECT 1 FROM pg_tables WHERE schemaname = 'core' AND tablename = 'billingCreditGrant'`);
        if (isLedgerPresent.length === 0) {
            return;
        }
        await queryRunner.query(`DELETE FROM "core"."billingCreditGrant" WHERE "idempotencyKey" LIKE $1`, [
            `${BACKFILL_IDEMPOTENCY_KEY_PREFIX}%`
        ]);
    }
};
BackfillCreditBalanceIntoGrantsSlowInstanceCommand = _ts_decorate([
    (0, _registeredinstancecommanddecorator.RegisteredInstanceCommand)('2.31.0', 1786532184001, {
        type: 'slow'
    })
], BackfillCreditBalanceIntoGrantsSlowInstanceCommand);

//# sourceMappingURL=2-31-instance-command-slow-1786532184001-backfill-credit-balance-into-grants.js.map