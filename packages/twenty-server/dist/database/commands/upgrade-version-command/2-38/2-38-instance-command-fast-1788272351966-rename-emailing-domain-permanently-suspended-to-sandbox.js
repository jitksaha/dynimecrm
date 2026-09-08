"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "RenameEmailingDomainPermanentlySuspendedToSandboxFastInstanceCommand", {
    enumerable: true,
    get: function() {
        return RenameEmailingDomainPermanentlySuspendedToSandboxFastInstanceCommand;
    }
});
const _registeredinstancecommanddecorator = require("../../../../engine/core-modules/upgrade/decorators/registered-instance-command.decorator");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let RenameEmailingDomainPermanentlySuspendedToSandboxFastInstanceCommand = class RenameEmailingDomainPermanentlySuspendedToSandboxFastInstanceCommand {
    async up(queryRunner) {
        if (!await this.hasEnumLabel(queryRunner, 'PERMANENTLY_SUSPENDED')) {
            return;
        }
        await queryRunner.query(`ALTER TYPE "core"."emailingDomain_tenantstatus_enum" RENAME VALUE 'PERMANENTLY_SUSPENDED' TO 'SANDBOX'`);
    }
    async down(queryRunner) {
        if (!await this.hasEnumLabel(queryRunner, 'SANDBOX')) {
            return;
        }
        await queryRunner.query(`ALTER TYPE "core"."emailingDomain_tenantstatus_enum" RENAME VALUE 'SANDBOX' TO 'PERMANENTLY_SUSPENDED'`);
    }
    async hasEnumLabel(queryRunner, enumLabel) {
        const [{ exists }] = await queryRunner.query(`SELECT EXISTS (
         SELECT 1 FROM pg_enum e
         JOIN pg_type t ON t.oid = e.enumtypid
         JOIN pg_namespace n ON n.oid = t.typnamespace
         WHERE n.nspname = 'core'
           AND t.typname = 'emailingDomain_tenantstatus_enum'
           AND e.enumlabel = $1
       ) AS exists`, [
            enumLabel
        ]);
        return exists;
    }
};
RenameEmailingDomainPermanentlySuspendedToSandboxFastInstanceCommand = _ts_decorate([
    (0, _registeredinstancecommanddecorator.RegisteredInstanceCommand)('2.38.0', 1788272351966)
], RenameEmailingDomainPermanentlySuspendedToSandboxFastInstanceCommand);

//# sourceMappingURL=2-38-instance-command-fast-1788272351966-rename-emailing-domain-permanently-suspended-to-sandbox.js.map