"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "CreateWorkflowVersionCoreTableFastInstanceCommand", {
    enumerable: true,
    get: function() {
        return CreateWorkflowVersionCoreTableFastInstanceCommand;
    }
});
const _registeredinstancecommanddecorator = require("../../../../engine/core-modules/upgrade/decorators/registered-instance-command.decorator");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let CreateWorkflowVersionCoreTableFastInstanceCommand = class CreateWorkflowVersionCoreTableFastInstanceCommand {
    async up(queryRunner) {
        await queryRunner.query(`DO $$ BEGIN CREATE TYPE "core"."workflowVersion_status_enum" AS ENUM ('DRAFT', 'ACTIVE', 'DEACTIVATED', 'ARCHIVED'); EXCEPTION WHEN duplicate_object THEN null; END $$`);
        await queryRunner.query(`CREATE TABLE IF NOT EXISTS "core"."workflowVersion" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "triggers" jsonb,
        "steps" jsonb,
        "status" "core"."workflowVersion_status_enum" NOT NULL DEFAULT 'DRAFT',
        "workflowId" uuid NOT NULL,
        "workspaceId" uuid NOT NULL,
        CONSTRAINT "PK_workflowVersion_id" PRIMARY KEY ("id"),
        CONSTRAINT "FK_4316468725741b8e11e02b144f3" FOREIGN KEY ("workspaceId") REFERENCES "core"."workspace"("id") ON DELETE CASCADE
      )`);
        await queryRunner.query(`CREATE INDEX IF NOT EXISTS "IDX_WORKFLOW_VERSION_WORKSPACE_ID"
        ON "core"."workflowVersion" ("workspaceId")`);
        await queryRunner.query(`CREATE UNIQUE INDEX IF NOT EXISTS "IDX_WORKFLOW_VERSION_ONE_ACTIVE_PER_WORKFLOW"
        ON "core"."workflowVersion" ("workspaceId", "workflowId")
        WHERE "status" = 'ACTIVE'`);
    }
    async down(queryRunner) {
        await queryRunner.query(`DROP TABLE IF EXISTS "core"."workflowVersion"`);
        await queryRunner.query(`DROP TYPE IF EXISTS "core"."workflowVersion_status_enum"`);
    }
};
CreateWorkflowVersionCoreTableFastInstanceCommand = _ts_decorate([
    (0, _registeredinstancecommanddecorator.RegisteredInstanceCommand)('2.20.0', 1783512000000)
], CreateWorkflowVersionCoreTableFastInstanceCommand);

//# sourceMappingURL=2-20-instance-command-fast-1783512000000-create-workflow-version-core-table.js.map