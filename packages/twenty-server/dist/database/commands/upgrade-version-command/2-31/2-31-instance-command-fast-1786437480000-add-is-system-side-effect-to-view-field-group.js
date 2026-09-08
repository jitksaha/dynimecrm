"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "AddIsSystemSideEffectToViewFieldGroupFastInstanceCommand", {
    enumerable: true,
    get: function() {
        return AddIsSystemSideEffectToViewFieldGroupFastInstanceCommand;
    }
});
const _registeredinstancecommanddecorator = require("../../../../engine/core-modules/upgrade/decorators/registered-instance-command.decorator");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let AddIsSystemSideEffectToViewFieldGroupFastInstanceCommand = class AddIsSystemSideEffectToViewFieldGroupFastInstanceCommand {
    async up(queryRunner) {
        await queryRunner.query('ALTER TABLE "core"."viewFieldGroup" ADD COLUMN IF NOT EXISTS "isSystemSideEffect" boolean NOT NULL DEFAULT false');
    }
    async down(queryRunner) {
        await queryRunner.query('ALTER TABLE "core"."viewFieldGroup" DROP COLUMN IF EXISTS "isSystemSideEffect"');
    }
};
AddIsSystemSideEffectToViewFieldGroupFastInstanceCommand = _ts_decorate([
    (0, _registeredinstancecommanddecorator.RegisteredInstanceCommand)('2.31.0', 1786437480000)
], AddIsSystemSideEffectToViewFieldGroupFastInstanceCommand);

//# sourceMappingURL=2-31-instance-command-fast-1786437480000-add-is-system-side-effect-to-view-field-group.js.map