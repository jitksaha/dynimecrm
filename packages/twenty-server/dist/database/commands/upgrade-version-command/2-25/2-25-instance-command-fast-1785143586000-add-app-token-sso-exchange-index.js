"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "AddAppTokenSsoExchangeIndexFastInstanceCommand", {
    enumerable: true,
    get: function() {
        return AddAppTokenSsoExchangeIndexFastInstanceCommand;
    }
});
const _registeredinstancecommanddecorator = require("../../../../engine/core-modules/upgrade/decorators/registered-instance-command.decorator");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let AddAppTokenSsoExchangeIndexFastInstanceCommand = class AddAppTokenSsoExchangeIndexFastInstanceCommand {
    async up(queryRunner) {
        await queryRunner.query(`CREATE UNIQUE INDEX IF NOT EXISTS "IDX_APP_TOKEN_TYPE_VALUE_SSO_EXCHANGE_UNIQUE" ON "core"."appToken" ("type", "value") WHERE "type" = 'SSO_EXCHANGE_TOKEN' AND "deletedAt" IS NULL AND "revokedAt" IS NULL`);
    }
    async down(queryRunner) {
        await queryRunner.query(`DROP INDEX IF EXISTS "core"."IDX_APP_TOKEN_TYPE_VALUE_SSO_EXCHANGE_UNIQUE"`);
    }
};
AddAppTokenSsoExchangeIndexFastInstanceCommand = _ts_decorate([
    (0, _registeredinstancecommanddecorator.RegisteredInstanceCommand)('2.25.0', 1785143586000)
], AddAppTokenSsoExchangeIndexFastInstanceCommand);

//# sourceMappingURL=2-25-instance-command-fast-1785143586000-add-app-token-sso-exchange-index.js.map