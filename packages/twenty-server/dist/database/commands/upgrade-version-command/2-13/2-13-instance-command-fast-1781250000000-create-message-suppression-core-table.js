"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "CreateMessageSuppressionCoreTableFastInstanceCommand", {
    enumerable: true,
    get: function() {
        return CreateMessageSuppressionCoreTableFastInstanceCommand;
    }
});
const _registeredinstancecommanddecorator = require("../../../../engine/core-modules/upgrade/decorators/registered-instance-command.decorator");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let CreateMessageSuppressionCoreTableFastInstanceCommand = class CreateMessageSuppressionCoreTableFastInstanceCommand {
    async up(queryRunner) {
        await queryRunner.query(`DO $$ BEGIN CREATE TYPE "core"."messageSuppression_reason_enum" AS ENUM ('BOUNCE', 'COMPLAINT', 'UNSUBSCRIBE'); EXCEPTION WHEN duplicate_object THEN null; END $$`);
        await queryRunner.query(`DO $$ BEGIN CREATE TYPE "core"."messageSuppression_source_enum" AS ENUM ('WEBHOOK', 'SYSTEM'); EXCEPTION WHEN duplicate_object THEN null; END $$`);
        await queryRunner.query(`CREATE TABLE IF NOT EXISTS "core"."messageSuppression" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "emailAddress" character varying NOT NULL,
        "reason" "core"."messageSuppression_reason_enum" NOT NULL,
        "source" "core"."messageSuppression_source_enum" NOT NULL,
        "providerEventId" character varying,
        "unsubscribeTopicId" uuid,
        "workspaceId" uuid NOT NULL,
        CONSTRAINT "PK_messageSuppression_id" PRIMARY KEY ("id"),
        CONSTRAINT "FK_6eba121ed8e57afaa1f052cb685" FOREIGN KEY ("workspaceId") REFERENCES "core"."workspace"("id") ON DELETE CASCADE
      )`);
        await queryRunner.query(`CREATE UNIQUE INDEX IF NOT EXISTS "IDX_MESSAGE_SUPPRESSION_GLOBAL_UNIQUE"
        ON "core"."messageSuppression" ("workspaceId", "emailAddress")
        WHERE "unsubscribeTopicId" IS NULL`);
        await queryRunner.query(`CREATE UNIQUE INDEX IF NOT EXISTS "IDX_MESSAGE_SUPPRESSION_TOPIC_UNIQUE"
        ON "core"."messageSuppression" ("workspaceId", "emailAddress", "unsubscribeTopicId")
        WHERE "unsubscribeTopicId" IS NOT NULL`);
        await queryRunner.query(`CREATE INDEX IF NOT EXISTS "IDX_MESSAGE_SUPPRESSION_WORKSPACE_ID"
        ON "core"."messageSuppression" ("workspaceId")`);
    }
    async down(queryRunner) {
        await queryRunner.query(`DROP TABLE IF EXISTS "core"."messageSuppression"`);
        await queryRunner.query(`DROP TYPE IF EXISTS "core"."messageSuppression_reason_enum"`);
        await queryRunner.query(`DROP TYPE IF EXISTS "core"."messageSuppression_source_enum"`);
    }
};
CreateMessageSuppressionCoreTableFastInstanceCommand = _ts_decorate([
    (0, _registeredinstancecommanddecorator.RegisteredInstanceCommand)('2.13.0', 1781250000000)
], CreateMessageSuppressionCoreTableFastInstanceCommand);

//# sourceMappingURL=2-13-instance-command-fast-1781250000000-create-message-suppression-core-table.js.map