"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "AddConnectedAccountHandleProviderIndexFastInstanceCommand", {
    enumerable: true,
    get: function() {
        return AddConnectedAccountHandleProviderIndexFastInstanceCommand;
    }
});
const _registeredinstancecommanddecorator = require("../../../../engine/core-modules/upgrade/decorators/registered-instance-command.decorator");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let AddConnectedAccountHandleProviderIndexFastInstanceCommand = class AddConnectedAccountHandleProviderIndexFastInstanceCommand {
    async up(queryRunner) {
        await queryRunner.query('CREATE INDEX IF NOT EXISTS "IDX_CONNECTED_ACCOUNT_HANDLE_PROVIDER" ON "core"."connectedAccount" ("handle", "provider")');
    }
    async down(queryRunner) {
        await queryRunner.query('DROP INDEX IF EXISTS "core"."IDX_CONNECTED_ACCOUNT_HANDLE_PROVIDER"');
    }
};
AddConnectedAccountHandleProviderIndexFastInstanceCommand = _ts_decorate([
    (0, _registeredinstancecommanddecorator.RegisteredInstanceCommand)('2.26.0', 1785420705255)
], AddConnectedAccountHandleProviderIndexFastInstanceCommand);

//# sourceMappingURL=2-26-instance-command-fast-1785420705255-add-connected-account-handle-provider-index.js.map