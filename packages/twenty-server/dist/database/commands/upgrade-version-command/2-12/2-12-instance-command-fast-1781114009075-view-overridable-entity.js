"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "ViewOverridableEntityFastInstanceCommand", {
    enumerable: true,
    get: function() {
        return ViewOverridableEntityFastInstanceCommand;
    }
});
const _registeredinstancecommanddecorator = require("../../../../engine/core-modules/upgrade/decorators/registered-instance-command.decorator");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let ViewOverridableEntityFastInstanceCommand = class ViewOverridableEntityFastInstanceCommand {
    async up(queryRunner) {
        await queryRunner.query('ALTER TABLE "core"."view" ADD "overrides" jsonb');
        await queryRunner.query('ALTER TABLE "core"."view" ADD "isActive" boolean NOT NULL DEFAULT true');
    }
    async down(queryRunner) {
        await queryRunner.query('ALTER TABLE "core"."view" DROP COLUMN "isActive"');
        await queryRunner.query('ALTER TABLE "core"."view" DROP COLUMN "overrides"');
    }
};
ViewOverridableEntityFastInstanceCommand = _ts_decorate([
    (0, _registeredinstancecommanddecorator.RegisteredInstanceCommand)('2.12.0', 1781114009075)
], ViewOverridableEntityFastInstanceCommand);

//# sourceMappingURL=2-12-instance-command-fast-1781114009075-view-overridable-entity.js.map