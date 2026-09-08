"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "AddCreatedWorkspaceActivationStatusSlowInstanceCommand", {
    enumerable: true,
    get: function() {
        return AddCreatedWorkspaceActivationStatusSlowInstanceCommand;
    }
});
const _registeredinstancecommanddecorator = require("../../../../engine/core-modules/upgrade/decorators/registered-instance-command.decorator");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let AddCreatedWorkspaceActivationStatusSlowInstanceCommand = class AddCreatedWorkspaceActivationStatusSlowInstanceCommand {
    async runDataMigration(_dataSource) {}
    async up(queryRunner) {
        await this.swapActivationStatusEnum(queryRunner, {
            enumValues: "'ONGOING_CREATION', 'PENDING_CREATION', 'CREATED', 'ACTIVE', 'INACTIVE', 'SUSPENDED'",
            castExpression: '"activationStatus"::"text"'
        });
    }
    async down(queryRunner) {
        await this.swapActivationStatusEnum(queryRunner, {
            enumValues: "'ONGOING_CREATION', 'PENDING_CREATION', 'ACTIVE', 'INACTIVE', 'SUSPENDED'",
            castExpression: `CASE WHEN "activationStatus"::"text" = 'CREATED' THEN 'ACTIVE' ELSE "activationStatus"::"text" END`
        });
    }
    async swapActivationStatusEnum(queryRunner, { enumValues, castExpression }) {
        const checkConstraints = await queryRunner.query(`SELECT conname, pg_get_constraintdef(oid) AS definition
         FROM pg_constraint
         WHERE conrelid = 'core.workspace'::regclass
           AND contype = 'c'
           AND pg_get_constraintdef(oid) ILIKE '%activationStatus%'`);
        for (const { conname } of checkConstraints){
            await queryRunner.query(`ALTER TABLE "core"."workspace" DROP CONSTRAINT "${conname}"`);
        }
        await queryRunner.query(`ALTER TYPE "core"."workspace_activationStatus_enum" RENAME TO "workspace_activationStatus_enum_old"`);
        await queryRunner.query(`CREATE TYPE "core"."workspace_activationStatus_enum" AS ENUM(${enumValues})`);
        await queryRunner.query(`ALTER TABLE "core"."workspace" ALTER COLUMN "activationStatus" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "core"."workspace" ALTER COLUMN "activationStatus" TYPE "core"."workspace_activationStatus_enum" USING (${castExpression})::"core"."workspace_activationStatus_enum"`);
        await queryRunner.query(`ALTER TABLE "core"."workspace" ALTER COLUMN "activationStatus" SET DEFAULT 'INACTIVE'`);
        await queryRunner.query(`DROP TYPE "core"."workspace_activationStatus_enum_old"`);
        for (const { conname, definition } of checkConstraints){
            await queryRunner.query(`ALTER TABLE "core"."workspace" ADD CONSTRAINT "${conname}" ${definition}`);
        }
    }
};
AddCreatedWorkspaceActivationStatusSlowInstanceCommand = _ts_decorate([
    (0, _registeredinstancecommanddecorator.RegisteredInstanceCommand)('2.22.0', 1784106205000, {
        type: 'slow'
    })
], AddCreatedWorkspaceActivationStatusSlowInstanceCommand);

//# sourceMappingURL=2-22-instance-command-slow-1784106205000-add-created-workspace-activation-status.js.map