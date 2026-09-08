"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "AddMessageChannelDisplayNameFastInstanceCommand", {
    enumerable: true,
    get: function() {
        return AddMessageChannelDisplayNameFastInstanceCommand;
    }
});
const _registeredinstancecommanddecorator = require("../../../../engine/core-modules/upgrade/decorators/registered-instance-command.decorator");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let AddMessageChannelDisplayNameFastInstanceCommand = class AddMessageChannelDisplayNameFastInstanceCommand {
    async up(queryRunner) {
        await queryRunner.query('ALTER TABLE "core"."messageChannel" ADD COLUMN IF NOT EXISTS "displayName" character varying');
    }
    async down(queryRunner) {
        await queryRunner.query('ALTER TABLE "core"."messageChannel" DROP COLUMN IF EXISTS "displayName"');
    }
};
AddMessageChannelDisplayNameFastInstanceCommand = _ts_decorate([
    (0, _registeredinstancecommanddecorator.RegisteredInstanceCommand)('2.25.0', 1784904030252)
], AddMessageChannelDisplayNameFastInstanceCommand);

//# sourceMappingURL=2-25-instance-command-fast-1784904030252-add-message-channel-display-name.js.map