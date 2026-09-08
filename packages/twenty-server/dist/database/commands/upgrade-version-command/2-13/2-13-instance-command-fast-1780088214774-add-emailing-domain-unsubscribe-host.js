"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "AddEmailingDomainUnsubscribeHostFastInstanceCommand", {
    enumerable: true,
    get: function() {
        return AddEmailingDomainUnsubscribeHostFastInstanceCommand;
    }
});
const _registeredinstancecommanddecorator = require("../../../../engine/core-modules/upgrade/decorators/registered-instance-command.decorator");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let AddEmailingDomainUnsubscribeHostFastInstanceCommand = class AddEmailingDomainUnsubscribeHostFastInstanceCommand {
    async up(queryRunner) {
        await queryRunner.query('ALTER TABLE "core"."emailingDomain" ADD COLUMN IF NOT EXISTS "unsubscribeHostname" character varying');
        await queryRunner.query('ALTER TABLE "core"."emailingDomain" ADD COLUMN IF NOT EXISTS "unsubscribeHostnameId" character varying');
        await queryRunner.query('DO $$ BEGIN CREATE TYPE "core"."emailingDomain_unsubscribehostnamestatus_enum" AS ENUM(\'PENDING\', \'ACTIVE\', \'FAILED\'); EXCEPTION WHEN duplicate_object THEN null; END $$');
        await queryRunner.query('ALTER TABLE "core"."emailingDomain" ADD COLUMN IF NOT EXISTS "unsubscribeHostnameStatus" "core"."emailingDomain_unsubscribehostnamestatus_enum"');
    }
    async down(queryRunner) {
        await queryRunner.query('ALTER TABLE "core"."emailingDomain" DROP COLUMN IF EXISTS "unsubscribeHostnameStatus"');
        await queryRunner.query('DROP TYPE IF EXISTS "core"."emailingDomain_unsubscribehostnamestatus_enum"');
        await queryRunner.query('ALTER TABLE "core"."emailingDomain" DROP COLUMN IF EXISTS "unsubscribeHostnameId"');
        await queryRunner.query('ALTER TABLE "core"."emailingDomain" DROP COLUMN IF EXISTS "unsubscribeHostname"');
    }
};
AddEmailingDomainUnsubscribeHostFastInstanceCommand = _ts_decorate([
    (0, _registeredinstancecommanddecorator.RegisteredInstanceCommand)('2.13.0', 1780088214774)
], AddEmailingDomainUnsubscribeHostFastInstanceCommand);

//# sourceMappingURL=2-13-instance-command-fast-1780088214774-add-emailing-domain-unsubscribe-host.js.map