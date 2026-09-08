"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "AddDisplayFieldsToApplicationRegistrationFastInstanceCommand", {
    enumerable: true,
    get: function() {
        return AddDisplayFieldsToApplicationRegistrationFastInstanceCommand;
    }
});
const _registeredinstancecommanddecorator = require("../../../../engine/core-modules/upgrade/decorators/registered-instance-command.decorator");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let AddDisplayFieldsToApplicationRegistrationFastInstanceCommand = class AddDisplayFieldsToApplicationRegistrationFastInstanceCommand {
    async up(queryRunner) {
        await queryRunner.query('ALTER TABLE "core"."applicationRegistration" ADD COLUMN IF NOT EXISTS "description" text');
        await queryRunner.query('ALTER TABLE "core"."applicationRegistration" ADD COLUMN IF NOT EXISTS "author" text');
        await queryRunner.query('ALTER TABLE "core"."applicationRegistration" ADD COLUMN IF NOT EXISTS "category" text');
        await queryRunner.query('ALTER TABLE "core"."applicationRegistration" ADD COLUMN IF NOT EXISTS "websiteUrl" text');
        await queryRunner.query('ALTER TABLE "core"."applicationRegistration" ADD COLUMN IF NOT EXISTS "aboutDescription" text');
        await queryRunner.query('ALTER TABLE "core"."applicationRegistration" ADD COLUMN IF NOT EXISTS "termsUrl" text');
        await queryRunner.query('ALTER TABLE "core"."applicationRegistration" ADD COLUMN IF NOT EXISTS "emailSupport" text');
        await queryRunner.query('ALTER TABLE "core"."applicationRegistration" ADD COLUMN IF NOT EXISTS "issueReportUrl" text');
        await queryRunner.query(`ALTER TABLE "core"."applicationRegistration" ADD COLUMN IF NOT EXISTS "screenshots" text array NOT NULL DEFAULT '{}'`);
    }
    async down(queryRunner) {
        await queryRunner.query('ALTER TABLE "core"."applicationRegistration" DROP COLUMN "description"');
        await queryRunner.query('ALTER TABLE "core"."applicationRegistration" DROP COLUMN "author"');
        await queryRunner.query('ALTER TABLE "core"."applicationRegistration" DROP COLUMN "category"');
        await queryRunner.query('ALTER TABLE "core"."applicationRegistration" DROP COLUMN "websiteUrl"');
        await queryRunner.query('ALTER TABLE "core"."applicationRegistration" DROP COLUMN "aboutDescription"');
        await queryRunner.query('ALTER TABLE "core"."applicationRegistration" DROP COLUMN "termsUrl"');
        await queryRunner.query('ALTER TABLE "core"."applicationRegistration" DROP COLUMN "emailSupport"');
        await queryRunner.query('ALTER TABLE "core"."applicationRegistration" DROP COLUMN "issueReportUrl"');
        await queryRunner.query('ALTER TABLE "core"."applicationRegistration" DROP COLUMN "screenshots"');
    }
};
AddDisplayFieldsToApplicationRegistrationFastInstanceCommand = _ts_decorate([
    (0, _registeredinstancecommanddecorator.RegisteredInstanceCommand)('2.19.0', 1783073776590)
], AddDisplayFieldsToApplicationRegistrationFastInstanceCommand);

//# sourceMappingURL=2-19-instance-command-fast-1783073776590-add-display-fields-to-application-registration.js.map