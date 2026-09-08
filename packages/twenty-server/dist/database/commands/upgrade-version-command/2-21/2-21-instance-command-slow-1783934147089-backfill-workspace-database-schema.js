"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "BackfillWorkspaceDatabaseSchemaSlowInstanceCommand", {
    enumerable: true,
    get: function() {
        return BackfillWorkspaceDatabaseSchemaSlowInstanceCommand;
    }
});
const _registeredinstancecommanddecorator = require("../../../../engine/core-modules/upgrade/decorators/registered-instance-command.decorator");
const _getworkspaceschemanameutil = require("../../../../engine/workspace-datasource/utils/get-workspace-schema-name.util");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let BackfillWorkspaceDatabaseSchemaSlowInstanceCommand = class BackfillWorkspaceDatabaseSchemaSlowInstanceCommand {
    // Schema names are deterministic from the workspace id, so we backfill them
    // unconditionally — even if the schema doesn't exist yet in Postgres — which
    // lets up() add the check constraint fully validated.
    async runDataMigration(dataSource) {
        const workspacesWithoutSchema = await dataSource.query(`SELECT id FROM "core"."workspace"
       WHERE ("databaseSchema" IS NULL OR "databaseSchema" = '')
         AND "activationStatus" NOT IN ('PENDING_CREATION', 'ONGOING_CREATION')`);
        if (workspacesWithoutSchema.length === 0) {
            return;
        }
        await dataSource.query(`UPDATE "core"."workspace" AS w
       SET "databaseSchema" = data.schema_name
       FROM (
         SELECT UNNEST($1::uuid[]) AS id, UNNEST($2::text[]) AS schema_name
       ) AS data
       WHERE w.id = data.id`, [
            workspacesWithoutSchema.map((workspace)=>workspace.id),
            workspacesWithoutSchema.map((workspace)=>(0, _getworkspaceschemanameutil.getWorkspaceSchemaName)(workspace.id))
        ]);
    }
    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE "core"."workspace" DROP CONSTRAINT IF EXISTS "workspace_requires_database_schema"`);
        await queryRunner.query(`ALTER TABLE "core"."workspace" ADD CONSTRAINT "workspace_requires_database_schema" CHECK ("activationStatus" IN ('PENDING_CREATION', 'ONGOING_CREATION') OR ("databaseSchema" IS NOT NULL AND "databaseSchema" <> ''))`);
    }
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "core"."workspace" DROP CONSTRAINT IF EXISTS "workspace_requires_database_schema"`);
    }
};
BackfillWorkspaceDatabaseSchemaSlowInstanceCommand = _ts_decorate([
    (0, _registeredinstancecommanddecorator.RegisteredInstanceCommand)('2.21.0', 1783934147089, {
        type: 'slow'
    })
], BackfillWorkspaceDatabaseSchemaSlowInstanceCommand);

//# sourceMappingURL=2-21-instance-command-slow-1783934147089-backfill-workspace-database-schema.js.map