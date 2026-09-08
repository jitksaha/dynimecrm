"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "AddOnDisconnectLogicFunctionToConnectionProviderFastInstanceCommand", {
    enumerable: true,
    get: function() {
        return AddOnDisconnectLogicFunctionToConnectionProviderFastInstanceCommand;
    }
});
const _registeredinstancecommanddecorator = require("../../../../engine/core-modules/upgrade/decorators/registered-instance-command.decorator");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let AddOnDisconnectLogicFunctionToConnectionProviderFastInstanceCommand = class AddOnDisconnectLogicFunctionToConnectionProviderFastInstanceCommand {
    async up(queryRunner) {
        await queryRunner.query('ALTER TABLE "core"."connectionProvider" ADD COLUMN IF NOT EXISTS "onDisconnectLogicFunctionUniversalIdentifier" uuid');
    }
    async down(queryRunner) {
        await queryRunner.query('ALTER TABLE "core"."connectionProvider" DROP COLUMN IF EXISTS "onDisconnectLogicFunctionUniversalIdentifier"');
    }
};
AddOnDisconnectLogicFunctionToConnectionProviderFastInstanceCommand = _ts_decorate([
    (0, _registeredinstancecommanddecorator.RegisteredInstanceCommand)('2.27.0', 1785810340935)
], AddOnDisconnectLogicFunctionToConnectionProviderFastInstanceCommand);

//# sourceMappingURL=2-27-instance-command-fast-1785810340935-add-on-disconnect-logic-function-to-connection-provider.js.map