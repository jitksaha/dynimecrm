"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "AddIsHiddenToAgentMessageFastInstanceCommand", {
    enumerable: true,
    get: function() {
        return AddIsHiddenToAgentMessageFastInstanceCommand;
    }
});
const _registeredinstancecommanddecorator = require("../../../../engine/core-modules/upgrade/decorators/registered-instance-command.decorator");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let AddIsHiddenToAgentMessageFastInstanceCommand = class AddIsHiddenToAgentMessageFastInstanceCommand {
    async up(queryRunner) {
        await queryRunner.query('ALTER TABLE "core"."agentMessage" ADD COLUMN IF NOT EXISTS "isHidden" boolean NOT NULL DEFAULT false');
        await queryRunner.query('CREATE UNIQUE INDEX IF NOT EXISTS "IDX_AGENT_MESSAGE_THREAD_ID_IS_HIDDEN_UNIQUE" ON "core"."agentMessage" ("threadId") WHERE "isHidden" = true');
    }
    async down(queryRunner) {
        await queryRunner.query('DROP INDEX IF EXISTS "core"."IDX_AGENT_MESSAGE_THREAD_ID_IS_HIDDEN_UNIQUE"');
        await queryRunner.query('ALTER TABLE "core"."agentMessage" DROP COLUMN IF EXISTS "isHidden"');
    }
};
AddIsHiddenToAgentMessageFastInstanceCommand = _ts_decorate([
    (0, _registeredinstancecommanddecorator.RegisteredInstanceCommand)('2.25.0', 1785230296000)
], AddIsHiddenToAgentMessageFastInstanceCommand);

//# sourceMappingURL=2-25-instance-command-fast-1785230296000-add-is-hidden-to-agent-message.js.map