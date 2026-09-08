"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "CreateBillingCreditGrantTableFastInstanceCommand", {
    enumerable: true,
    get: function() {
        return CreateBillingCreditGrantTableFastInstanceCommand;
    }
});
const _registeredinstancecommanddecorator = require("../../../../engine/core-modules/upgrade/decorators/registered-instance-command.decorator");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let CreateBillingCreditGrantTableFastInstanceCommand = class CreateBillingCreditGrantTableFastInstanceCommand {
    async up(queryRunner) {
        // Billing entities only exist when billing is enabled, so an instance
        // without billing must not grow a billing table its entity set has no
        // counterpart for.
        const isBillingSchemaPresent = await queryRunner.query(`SELECT 1 FROM pg_tables WHERE schemaname = 'core' AND tablename = 'billingCustomer'`);
        if (isBillingSchemaPresent.length === 0) {
            return;
        }
        await queryRunner.query(`DO $$ BEGIN CREATE TYPE "core"."billingCreditGrant_type_enum" AS ENUM ('ROLLOVER', 'ONBOARDING_REWARD', 'COMPENSATION', 'SALES'); EXCEPTION WHEN duplicate_object THEN null; END $$`);
        // An instance that ran a pre-release build of this command has the type
        // already, so the create above is swallowed and its value set is whatever
        // that build declared. Reconcile rather than leave a value the entity can
        // write but the type does not accept.
        await queryRunner.query(`ALTER TYPE "core"."billingCreditGrant_type_enum" ADD VALUE IF NOT EXISTS 'SALES'`);
        await queryRunner.query(`CREATE TABLE IF NOT EXISTS "core"."billingCreditGrant" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "workspaceId" uuid NOT NULL,
        "amountMicro" bigint NOT NULL,
        "type" "core"."billingCreditGrant_type_enum" NOT NULL,
        "effectiveAt" TIMESTAMP WITH TIME ZONE NOT NULL,
        "expiresAt" TIMESTAMP WITH TIME ZONE NOT NULL,
        "revokedAt" TIMESTAMP WITH TIME ZONE,
        "revokedByUserId" uuid,
        "grantedByUserId" uuid,
        "reason" character varying(500),
        "idempotencyKey" character varying,
        "sourceGrantId" uuid,
        "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        CONSTRAINT "PK_eef2376084c6ef14cf8a6ffb3c4" PRIMARY KEY ("id"),
        CONSTRAINT "FK_e516eeab5b1dda05b823f235041" FOREIGN KEY ("workspaceId") REFERENCES "core"."workspace"("id") ON DELETE CASCADE ON UPDATE NO ACTION
      )`);
        // Nulls never conflict in a Postgres unique index, so grants without an
        // idempotency key are unconstrained.
        await queryRunner.query(`CREATE UNIQUE INDEX IF NOT EXISTS "IDX_BILLING_CREDIT_GRANT_IDEMPOTENCY_KEY_UNIQUE"
        ON "core"."billingCreditGrant" ("idempotencyKey")`);
        await queryRunner.query(`CREATE INDEX IF NOT EXISTS "IDX_BILLING_CREDIT_GRANT_WORKSPACE_ID_EXPIRES_AT"
        ON "core"."billingCreditGrant" ("workspaceId", "expiresAt")`);
    }
    async down(queryRunner) {
        await queryRunner.query(`DROP TABLE IF EXISTS "core"."billingCreditGrant"`);
        // After the table, which depends on it. Leaving it behind would make a
        // later re-run reuse the old value set rather than create the current one.
        await queryRunner.query(`DROP TYPE IF EXISTS "core"."billingCreditGrant_type_enum"`);
    }
};
CreateBillingCreditGrantTableFastInstanceCommand = _ts_decorate([
    (0, _registeredinstancecommanddecorator.RegisteredInstanceCommand)('2.31.0', 1786532184000)
], CreateBillingCreditGrantTableFastInstanceCommand);

//# sourceMappingURL=2-31-instance-command-fast-1786532184000-create-billing-credit-grant-table.js.map