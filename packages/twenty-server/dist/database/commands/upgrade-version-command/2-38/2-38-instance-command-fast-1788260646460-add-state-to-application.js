"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "AddStateToApplicationFastInstanceCommand", {
    enumerable: true,
    get: function() {
        return AddStateToApplicationFastInstanceCommand;
    }
});
const _registeredinstancecommanddecorator = require("../../../../engine/core-modules/upgrade/decorators/registered-instance-command.decorator");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let AddStateToApplicationFastInstanceCommand = class AddStateToApplicationFastInstanceCommand {
    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE "core"."application" ADD COLUMN IF NOT EXISTS "state" text NOT NULL DEFAULT 'INSTALLED'`);
    }
    async down(queryRunner) {
        await queryRunner.query('ALTER TABLE "core"."application" DROP COLUMN IF EXISTS "state"');
    }
};
AddStateToApplicationFastInstanceCommand = _ts_decorate([
    (0, _registeredinstancecommanddecorator.RegisteredInstanceCommand)('2.38.0', 1788260646460)
], AddStateToApplicationFastInstanceCommand);

//# sourceMappingURL=2-38-instance-command-fast-1788260646460-add-state-to-application.js.map