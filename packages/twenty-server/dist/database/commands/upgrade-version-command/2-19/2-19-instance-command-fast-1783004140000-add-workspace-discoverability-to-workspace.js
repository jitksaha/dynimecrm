"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "AddWorkspaceDiscoverabilityToWorkspaceFastInstanceCommand", {
    enumerable: true,
    get: function() {
        return AddWorkspaceDiscoverabilityToWorkspaceFastInstanceCommand;
    }
});
const _registeredinstancecommanddecorator = require("../../../../engine/core-modules/upgrade/decorators/registered-instance-command.decorator");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let AddWorkspaceDiscoverabilityToWorkspaceFastInstanceCommand = class AddWorkspaceDiscoverabilityToWorkspaceFastInstanceCommand {
    async up(queryRunner) {
        await queryRunner.query(`DO $$ BEGIN
        CREATE TYPE "core"."workspace_discoverability_enum" AS ENUM('PUBLIC', 'MEMBERS_AND_INVITEES', 'HIDDEN');
      EXCEPTION
        WHEN duplicate_object THEN NULL;
      END $$`);
        await queryRunner.query(`ALTER TABLE "core"."workspace" ADD COLUMN IF NOT EXISTS "workspaceDiscoverability" "core"."workspace_discoverability_enum" NOT NULL DEFAULT 'PUBLIC'`);
    }
    async down(queryRunner) {
        await queryRunner.query('ALTER TABLE "core"."workspace" DROP COLUMN "workspaceDiscoverability"');
        await queryRunner.query(`DROP TYPE "core"."workspace_discoverability_enum"`);
    }
};
AddWorkspaceDiscoverabilityToWorkspaceFastInstanceCommand = _ts_decorate([
    (0, _registeredinstancecommanddecorator.RegisteredInstanceCommand)('2.19.0', 1783004140000)
], AddWorkspaceDiscoverabilityToWorkspaceFastInstanceCommand);

//# sourceMappingURL=2-19-instance-command-fast-1783004140000-add-workspace-discoverability-to-workspace.js.map