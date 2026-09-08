"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "AddServerTriggerSettingsToLogicFunctionFastInstanceCommand", {
    enumerable: true,
    get: function() {
        return AddServerTriggerSettingsToLogicFunctionFastInstanceCommand;
    }
});
const _registeredinstancecommanddecorator = require("../../../../engine/core-modules/upgrade/decorators/registered-instance-command.decorator");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let AddServerTriggerSettingsToLogicFunctionFastInstanceCommand = class AddServerTriggerSettingsToLogicFunctionFastInstanceCommand {
    async up(queryRunner) {
        await queryRunner.query('ALTER TABLE "core"."logicFunction" ADD "serverRouteTriggerSettings" jsonb');
    }
    async down(queryRunner) {
        await queryRunner.query('ALTER TABLE "core"."logicFunction" DROP COLUMN "serverRouteTriggerSettings"');
    }
};
AddServerTriggerSettingsToLogicFunctionFastInstanceCommand = _ts_decorate([
    (0, _registeredinstancecommanddecorator.RegisteredInstanceCommand)('2.16.0', 1782211913427)
], AddServerTriggerSettingsToLogicFunctionFastInstanceCommand);

//# sourceMappingURL=2-16-instance-command-fast-1782211913427-add-server-trigger-settings-to-logic-function.js.map