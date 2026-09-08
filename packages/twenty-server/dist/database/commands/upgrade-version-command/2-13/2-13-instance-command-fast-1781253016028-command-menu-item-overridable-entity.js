"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "CommandMenuItemOverridableEntityFastInstanceCommand", {
    enumerable: true,
    get: function() {
        return CommandMenuItemOverridableEntityFastInstanceCommand;
    }
});
const _registeredinstancecommanddecorator = require("../../../../engine/core-modules/upgrade/decorators/registered-instance-command.decorator");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let CommandMenuItemOverridableEntityFastInstanceCommand = class CommandMenuItemOverridableEntityFastInstanceCommand {
    async up(queryRunner) {
        await queryRunner.query('ALTER TABLE "core"."commandMenuItem" ADD "overrides" jsonb, ADD "isActive" boolean NOT NULL DEFAULT true');
    }
    async down(queryRunner) {
        await queryRunner.query('ALTER TABLE "core"."commandMenuItem" DROP COLUMN "isActive", DROP COLUMN "overrides"');
    }
};
CommandMenuItemOverridableEntityFastInstanceCommand = _ts_decorate([
    (0, _registeredinstancecommanddecorator.RegisteredInstanceCommand)('2.13.0', 1781253016028)
], CommandMenuItemOverridableEntityFastInstanceCommand);

//# sourceMappingURL=2-13-instance-command-fast-1781253016028-command-menu-item-overridable-entity.js.map