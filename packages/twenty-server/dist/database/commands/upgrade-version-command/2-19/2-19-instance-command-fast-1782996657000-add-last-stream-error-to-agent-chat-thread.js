"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "AddLastStreamErrorToAgentChatThreadFastInstanceCommand", {
    enumerable: true,
    get: function() {
        return AddLastStreamErrorToAgentChatThreadFastInstanceCommand;
    }
});
const _registeredinstancecommanddecorator = require("../../../../engine/core-modules/upgrade/decorators/registered-instance-command.decorator");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let AddLastStreamErrorToAgentChatThreadFastInstanceCommand = class AddLastStreamErrorToAgentChatThreadFastInstanceCommand {
    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE "core"."agentChatThread" ADD COLUMN IF NOT EXISTS "lastStreamError" jsonb`);
    }
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "core"."agentChatThread" DROP COLUMN IF EXISTS "lastStreamError"`);
    }
};
AddLastStreamErrorToAgentChatThreadFastInstanceCommand = _ts_decorate([
    (0, _registeredinstancecommanddecorator.RegisteredInstanceCommand)('2.19.0', 1782996657000)
], AddLastStreamErrorToAgentChatThreadFastInstanceCommand);

//# sourceMappingURL=2-19-instance-command-fast-1782996657000-add-last-stream-error-to-agent-chat-thread.js.map