"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "DropEmailingDomainDriverColumnFastInstanceCommand", {
    enumerable: true,
    get: function() {
        return DropEmailingDomainDriverColumnFastInstanceCommand;
    }
});
const _registeredinstancecommanddecorator = require("../../../../engine/core-modules/upgrade/decorators/registered-instance-command.decorator");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let DropEmailingDomainDriverColumnFastInstanceCommand = class DropEmailingDomainDriverColumnFastInstanceCommand {
    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE "core"."emailingDomain" DROP COLUMN IF EXISTS "driver"`);
        await queryRunner.query(`DROP TYPE IF EXISTS "core"."emailingDomain_driver_enum"`);
    }
    async down(queryRunner) {
        await queryRunner.query(`CREATE TYPE "core"."emailingDomain_driver_enum" AS ENUM('AWS_SES')`);
        await queryRunner.query(`ALTER TABLE "core"."emailingDomain" ADD COLUMN IF NOT EXISTS "driver" "core"."emailingDomain_driver_enum" NOT NULL DEFAULT 'AWS_SES'`);
        await queryRunner.query(`ALTER TABLE "core"."emailingDomain" ALTER COLUMN "driver" DROP DEFAULT`);
    }
};
DropEmailingDomainDriverColumnFastInstanceCommand = _ts_decorate([
    (0, _registeredinstancecommanddecorator.RegisteredInstanceCommand)('2.11.0', 1780926908000)
], DropEmailingDomainDriverColumnFastInstanceCommand);

//# sourceMappingURL=2-11-instance-command-fast-1780926908000-drop-emailing-domain-driver-column.js.map