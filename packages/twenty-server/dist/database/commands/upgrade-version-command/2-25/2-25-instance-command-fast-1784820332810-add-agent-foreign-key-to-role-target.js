"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "AddAgentForeignKeyToRoleTargetFastInstanceCommand", {
    enumerable: true,
    get: function() {
        return AddAgentForeignKeyToRoleTargetFastInstanceCommand;
    }
});
const _registeredinstancecommanddecorator = require("../../../../engine/core-modules/upgrade/decorators/registered-instance-command.decorator");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let AddAgentForeignKeyToRoleTargetFastInstanceCommand = class AddAgentForeignKeyToRoleTargetFastInstanceCommand {
    async up(queryRunner) {
        await queryRunner.query('ALTER TABLE "core"."roleTarget" DROP CONSTRAINT IF EXISTS "FK_16433a32ab13a294569e52a10e0"');
        await queryRunner.query('ALTER TABLE "core"."roleTarget" ADD CONSTRAINT "FK_16433a32ab13a294569e52a10e0" FOREIGN KEY ("agentId") REFERENCES "core"."agent"("id") ON DELETE CASCADE ON UPDATE NO ACTION');
    }
    async down(queryRunner) {
        await queryRunner.query('ALTER TABLE "core"."roleTarget" DROP CONSTRAINT IF EXISTS "FK_16433a32ab13a294569e52a10e0"');
    }
};
AddAgentForeignKeyToRoleTargetFastInstanceCommand = _ts_decorate([
    (0, _registeredinstancecommanddecorator.RegisteredInstanceCommand)('2.25.0', 1784820332810)
], AddAgentForeignKeyToRoleTargetFastInstanceCommand);

//# sourceMappingURL=2-25-instance-command-fast-1784820332810-add-agent-foreign-key-to-role-target.js.map