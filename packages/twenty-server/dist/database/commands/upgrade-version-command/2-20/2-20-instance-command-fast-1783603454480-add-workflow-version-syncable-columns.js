"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "AddWorkflowVersionSyncableColumnsFastInstanceCommand", {
    enumerable: true,
    get: function() {
        return AddWorkflowVersionSyncableColumnsFastInstanceCommand;
    }
});
const _registeredinstancecommanddecorator = require("../../../../engine/core-modules/upgrade/decorators/registered-instance-command.decorator");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let AddWorkflowVersionSyncableColumnsFastInstanceCommand = class AddWorkflowVersionSyncableColumnsFastInstanceCommand {
    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE "core"."workflowVersion" ADD COLUMN IF NOT EXISTS "universalIdentifier" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "core"."workflowVersion" ADD COLUMN IF NOT EXISTS "applicationId" uuid NOT NULL`);
        await queryRunner.query(`CREATE UNIQUE INDEX IF NOT EXISTS "IDX_c67a90cc29887078286205457e"
        ON "core"."workflowVersion" ("workspaceId", "universalIdentifier")`);
        await queryRunner.query(`DO $$ BEGIN
        ALTER TABLE "core"."workflowVersion" ADD CONSTRAINT "FK_29f62766c5b109981244b97060d" FOREIGN KEY ("applicationId") REFERENCES "core"."application"("id") ON DELETE CASCADE;
      EXCEPTION WHEN duplicate_object THEN null; END $$`);
        await queryRunner.query(`CREATE INDEX IF NOT EXISTS "IDX_WORKFLOW_VERSION_APPLICATION_ID"
        ON "core"."workflowVersion" ("applicationId")`);
    }
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "core"."workflowVersion" DROP CONSTRAINT IF EXISTS "FK_29f62766c5b109981244b97060d"`);
        await queryRunner.query(`DROP INDEX IF EXISTS "core"."IDX_c67a90cc29887078286205457e"`);
        await queryRunner.query(`DROP INDEX IF EXISTS "core"."IDX_WORKFLOW_VERSION_APPLICATION_ID"`);
        await queryRunner.query(`ALTER TABLE "core"."workflowVersion" DROP COLUMN IF EXISTS "applicationId"`);
        await queryRunner.query(`ALTER TABLE "core"."workflowVersion" DROP COLUMN IF EXISTS "universalIdentifier"`);
    }
};
AddWorkflowVersionSyncableColumnsFastInstanceCommand = _ts_decorate([
    (0, _registeredinstancecommanddecorator.RegisteredInstanceCommand)('2.20.0', 1783603454480)
], AddWorkflowVersionSyncableColumnsFastInstanceCommand);

//# sourceMappingURL=2-20-instance-command-fast-1783603454480-add-workflow-version-syncable-columns.js.map