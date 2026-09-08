"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "AddLabelToApplicationVariableFastInstanceCommand", {
    enumerable: true,
    get: function() {
        return AddLabelToApplicationVariableFastInstanceCommand;
    }
});
const _registeredinstancecommanddecorator = require("../../../../engine/core-modules/upgrade/decorators/registered-instance-command.decorator");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let AddLabelToApplicationVariableFastInstanceCommand = class AddLabelToApplicationVariableFastInstanceCommand {
    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE "core"."applicationVariable" ADD COLUMN IF NOT EXISTS "label" text NOT NULL DEFAULT ''`);
    }
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "core"."applicationVariable" DROP COLUMN IF EXISTS "label"`);
    }
};
AddLabelToApplicationVariableFastInstanceCommand = _ts_decorate([
    (0, _registeredinstancecommanddecorator.RegisteredInstanceCommand)('2.36.0', 1787761629092)
], AddLabelToApplicationVariableFastInstanceCommand);

//# sourceMappingURL=2-36-instance-command-fast-1787761629092-add-label-to-application-variable.js.map