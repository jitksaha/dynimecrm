"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "AddIsDeprecatedToApplicationVariablesFastInstanceCommand", {
    enumerable: true,
    get: function() {
        return AddIsDeprecatedToApplicationVariablesFastInstanceCommand;
    }
});
const _registeredinstancecommanddecorator = require("../../../../engine/core-modules/upgrade/decorators/registered-instance-command.decorator");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let AddIsDeprecatedToApplicationVariablesFastInstanceCommand = class AddIsDeprecatedToApplicationVariablesFastInstanceCommand {
    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE "core"."applicationVariable" ADD COLUMN IF NOT EXISTS "isDeprecated" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "core"."applicationRegistrationVariable" ADD COLUMN IF NOT EXISTS "isDeprecated" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "core"."applicationRegistrationVariable" DROP CONSTRAINT IF EXISTS "CHK_applicationRegistrationVariable_deprecated_not_required"`);
        await queryRunner.query(`ALTER TABLE "core"."applicationRegistrationVariable" ADD CONSTRAINT "CHK_applicationRegistrationVariable_deprecated_not_required" CHECK (NOT ("isRequired" AND "isDeprecated"))`);
    }
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "core"."applicationRegistrationVariable" DROP CONSTRAINT IF EXISTS "CHK_applicationRegistrationVariable_deprecated_not_required"`);
        await queryRunner.query(`ALTER TABLE "core"."applicationRegistrationVariable" DROP COLUMN IF EXISTS "isDeprecated"`);
        await queryRunner.query(`ALTER TABLE "core"."applicationVariable" DROP COLUMN IF EXISTS "isDeprecated"`);
    }
};
AddIsDeprecatedToApplicationVariablesFastInstanceCommand = _ts_decorate([
    (0, _registeredinstancecommanddecorator.RegisteredInstanceCommand)('2.31.0', 1786533439000)
], AddIsDeprecatedToApplicationVariablesFastInstanceCommand);

//# sourceMappingURL=2-31-instance-command-fast-1786533439000-add-is-deprecated-to-application-variables.js.map