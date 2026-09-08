"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "CreateWorkflowCoreTableFastInstanceCommand", {
    enumerable: true,
    get: function() {
        return CreateWorkflowCoreTableFastInstanceCommand;
    }
});
const _registeredinstancecommanddecorator = require("../../../../engine/core-modules/upgrade/decorators/registered-instance-command.decorator");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let CreateWorkflowCoreTableFastInstanceCommand = class CreateWorkflowCoreTableFastInstanceCommand {
    async up(queryRunner) {
        await queryRunner.query(`CREATE TABLE IF NOT EXISTS "core"."workflow" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "name" text,
        "lastPublishedVersionId" uuid,
        "universalIdentifier" uuid NOT NULL,
        "applicationId" uuid NOT NULL,
        "workspaceId" uuid NOT NULL,
        "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        CONSTRAINT "PK_eb5e4cc1a9ef2e94805b676751b" PRIMARY KEY ("id"),
        CONSTRAINT "FK_fbce9a986a577698821a7e301b6" FOREIGN KEY ("workspaceId") REFERENCES "core"."workspace"("id") ON DELETE CASCADE,
        CONSTRAINT "FK_6819d862ed54fbf00cecaa0da4b" FOREIGN KEY ("applicationId") REFERENCES "core"."application"("id") ON DELETE CASCADE
      )`);
        await queryRunner.query(`CREATE UNIQUE INDEX IF NOT EXISTS "IDX_8ef15993c0e4bb37d1ceb9b87d"
        ON "core"."workflow" ("workspaceId", "universalIdentifier")`);
        await queryRunner.query(`CREATE INDEX IF NOT EXISTS "IDX_WORKFLOW_WORKSPACE_ID"
        ON "core"."workflow" ("workspaceId")`);
        await queryRunner.query(`CREATE INDEX IF NOT EXISTS "IDX_WORKFLOW_APPLICATION_ID"
        ON "core"."workflow" ("applicationId")`);
    }
    async down(queryRunner) {
        await queryRunner.query(`DROP TABLE IF EXISTS "core"."workflow"`);
    }
};
CreateWorkflowCoreTableFastInstanceCommand = _ts_decorate([
    (0, _registeredinstancecommanddecorator.RegisteredInstanceCommand)('2.20.0', 1783603454479)
], CreateWorkflowCoreTableFastInstanceCommand);

//# sourceMappingURL=2-20-instance-command-fast-1783603454479-create-workflow-core-table.js.map