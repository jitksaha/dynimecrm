"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "AddLogoFileIdToApplicationRegistrationFastInstanceCommand", {
    enumerable: true,
    get: function() {
        return AddLogoFileIdToApplicationRegistrationFastInstanceCommand;
    }
});
const _registeredinstancecommanddecorator = require("../../../../engine/core-modules/upgrade/decorators/registered-instance-command.decorator");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let AddLogoFileIdToApplicationRegistrationFastInstanceCommand = class AddLogoFileIdToApplicationRegistrationFastInstanceCommand {
    async up(queryRunner) {
        await queryRunner.query('ALTER TABLE "core"."applicationRegistration" ADD COLUMN IF NOT EXISTS "logoFileId" uuid');
        await queryRunner.query('ALTER TABLE "core"."applicationRegistration" DROP CONSTRAINT IF EXISTS "UQ_796819fb23559c233e6ebd49f34"');
        await queryRunner.query('ALTER TABLE "core"."applicationRegistration" ADD CONSTRAINT "UQ_796819fb23559c233e6ebd49f34" UNIQUE ("logoFileId")');
        await queryRunner.query('ALTER TABLE "core"."applicationRegistration" DROP CONSTRAINT IF EXISTS "FK_796819fb23559c233e6ebd49f34"');
        await queryRunner.query('ALTER TABLE "core"."applicationRegistration" ADD CONSTRAINT "FK_796819fb23559c233e6ebd49f34" FOREIGN KEY ("logoFileId") REFERENCES "core"."file"("id") ON DELETE SET NULL ON UPDATE NO ACTION');
    }
    async down(queryRunner) {
        await queryRunner.query('ALTER TABLE "core"."applicationRegistration" DROP CONSTRAINT IF EXISTS "FK_796819fb23559c233e6ebd49f34"');
        await queryRunner.query('ALTER TABLE "core"."applicationRegistration" DROP CONSTRAINT IF EXISTS "UQ_796819fb23559c233e6ebd49f34"');
        await queryRunner.query('ALTER TABLE "core"."applicationRegistration" DROP COLUMN IF EXISTS "logoFileId"');
    }
};
AddLogoFileIdToApplicationRegistrationFastInstanceCommand = _ts_decorate([
    (0, _registeredinstancecommanddecorator.RegisteredInstanceCommand)('2.21.0', 1783945979243)
], AddLogoFileIdToApplicationRegistrationFastInstanceCommand);

//# sourceMappingURL=2-21-instance-command-fast-1783945979243-add-logo-file-id-to-application-registration.js.map