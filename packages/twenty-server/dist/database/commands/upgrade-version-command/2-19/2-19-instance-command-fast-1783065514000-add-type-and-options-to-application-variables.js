"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "AddTypeAndOptionsToApplicationVariablesFastInstanceCommand", {
    enumerable: true,
    get: function() {
        return AddTypeAndOptionsToApplicationVariablesFastInstanceCommand;
    }
});
const _registeredinstancecommanddecorator = require("../../../../engine/core-modules/upgrade/decorators/registered-instance-command.decorator");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let AddTypeAndOptionsToApplicationVariablesFastInstanceCommand = class AddTypeAndOptionsToApplicationVariablesFastInstanceCommand {
    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE "core"."applicationVariable" ADD COLUMN IF NOT EXISTS "type" text NOT NULL DEFAULT 'TEXT'`);
        await queryRunner.query(`ALTER TABLE "core"."applicationVariable" ADD COLUMN IF NOT EXISTS "options" jsonb`);
        await queryRunner.query(`ALTER TABLE "core"."applicationRegistrationVariable" ADD COLUMN IF NOT EXISTS "type" text NOT NULL DEFAULT 'TEXT'`);
        await queryRunner.query(`ALTER TABLE "core"."applicationRegistrationVariable" ADD COLUMN IF NOT EXISTS "options" jsonb`);
    }
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "core"."applicationRegistrationVariable" DROP COLUMN IF EXISTS "options"`);
        await queryRunner.query(`ALTER TABLE "core"."applicationRegistrationVariable" DROP COLUMN IF EXISTS "type"`);
        await queryRunner.query(`ALTER TABLE "core"."applicationVariable" DROP COLUMN IF EXISTS "options"`);
        await queryRunner.query(`ALTER TABLE "core"."applicationVariable" DROP COLUMN IF EXISTS "type"`);
    }
};
AddTypeAndOptionsToApplicationVariablesFastInstanceCommand = _ts_decorate([
    (0, _registeredinstancecommanddecorator.RegisteredInstanceCommand)('2.19.0', 1783065514000)
], AddTypeAndOptionsToApplicationVariablesFastInstanceCommand);

//# sourceMappingURL=2-19-instance-command-fast-1783065514000-add-type-and-options-to-application-variables.js.map