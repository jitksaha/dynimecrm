"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "AddPageLayoutIsFirstTabPinnedFastInstanceCommand", {
    enumerable: true,
    get: function() {
        return AddPageLayoutIsFirstTabPinnedFastInstanceCommand;
    }
});
const _registeredinstancecommanddecorator = require("../../../../engine/core-modules/upgrade/decorators/registered-instance-command.decorator");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let AddPageLayoutIsFirstTabPinnedFastInstanceCommand = class AddPageLayoutIsFirstTabPinnedFastInstanceCommand {
    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE "core"."pageLayout" ADD COLUMN IF NOT EXISTS "isFirstTabPinned" boolean NOT NULL DEFAULT true`);
    }
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "core"."pageLayout" DROP COLUMN IF EXISTS "isFirstTabPinned"`);
    }
};
AddPageLayoutIsFirstTabPinnedFastInstanceCommand = _ts_decorate([
    (0, _registeredinstancecommanddecorator.RegisteredInstanceCommand)('2.38.0', 1787929843737)
], AddPageLayoutIsFirstTabPinnedFastInstanceCommand);

//# sourceMappingURL=2-38-instance-command-fast-1787929843737-add-page-layout-is-first-tab-pinned.js.map