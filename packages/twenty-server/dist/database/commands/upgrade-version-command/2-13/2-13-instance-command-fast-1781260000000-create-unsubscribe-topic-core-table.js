"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "CreateUnsubscribeTopicCoreTableFastInstanceCommand", {
    enumerable: true,
    get: function() {
        return CreateUnsubscribeTopicCoreTableFastInstanceCommand;
    }
});
const _registeredinstancecommanddecorator = require("../../../../engine/core-modules/upgrade/decorators/registered-instance-command.decorator");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let CreateUnsubscribeTopicCoreTableFastInstanceCommand = class CreateUnsubscribeTopicCoreTableFastInstanceCommand {
    async up(queryRunner) {
        await queryRunner.query(`DO $$ BEGIN CREATE TYPE "core"."unsubscribeTopic_visibility_enum" AS ENUM ('PUBLIC', 'PRIVATE'); EXCEPTION WHEN duplicate_object THEN null; END $$`);
        await queryRunner.query(`CREATE TABLE IF NOT EXISTS "core"."unsubscribeTopic" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "name" character varying,
        "description" character varying,
        "visibility" "core"."unsubscribeTopic_visibility_enum" NOT NULL DEFAULT 'PRIVATE',
        "workspaceId" uuid NOT NULL,
        CONSTRAINT "PK_unsubscribeTopic_id" PRIMARY KEY ("id"),
        -- FK name must match TypeORM's generated hash for WorkspaceRelatedEntity.workspace (schema drift otherwise).
        CONSTRAINT "FK_16d7bf6f90fac4745c89e1e8d56" FOREIGN KEY ("workspaceId") REFERENCES "core"."workspace"("id") ON DELETE CASCADE
      )`);
        await queryRunner.query(`CREATE INDEX IF NOT EXISTS "IDX_UNSUBSCRIBE_TOPIC_WORKSPACE_ID"
        ON "core"."unsubscribeTopic" ("workspaceId")`);
    }
    async down(queryRunner) {
        await queryRunner.query(`DROP TABLE IF EXISTS "core"."unsubscribeTopic"`);
        await queryRunner.query(`DROP TYPE IF EXISTS "core"."unsubscribeTopic_visibility_enum"`);
    }
};
CreateUnsubscribeTopicCoreTableFastInstanceCommand = _ts_decorate([
    (0, _registeredinstancecommanddecorator.RegisteredInstanceCommand)('2.13.0', 1781260000000)
], CreateUnsubscribeTopicCoreTableFastInstanceCommand);

//# sourceMappingURL=2-13-instance-command-fast-1781260000000-create-unsubscribe-topic-core-table.js.map