"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "AddUninstallHookCompletedForRequestedAtToApplicationFastInstanceCommand", {
    enumerable: true,
    get: function() {
        return AddUninstallHookCompletedForRequestedAtToApplicationFastInstanceCommand;
    }
});
const _registeredinstancecommanddecorator = require("../../../../engine/core-modules/upgrade/decorators/registered-instance-command.decorator");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let AddUninstallHookCompletedForRequestedAtToApplicationFastInstanceCommand = class AddUninstallHookCompletedForRequestedAtToApplicationFastInstanceCommand {
    async up(queryRunner) {
        await queryRunner.query('ALTER TABLE "core"."application" ADD COLUMN IF NOT EXISTS "uninstallHookCompletedForRequestedAt" TIMESTAMP WITH TIME ZONE');
    }
    async down(queryRunner) {
        await queryRunner.query('ALTER TABLE "core"."application" DROP COLUMN IF EXISTS "uninstallHookCompletedForRequestedAt"');
    }
};
AddUninstallHookCompletedForRequestedAtToApplicationFastInstanceCommand = _ts_decorate([
    (0, _registeredinstancecommanddecorator.RegisteredInstanceCommand)('2.33.0', 1787151824000)
], AddUninstallHookCompletedForRequestedAtToApplicationFastInstanceCommand);

//# sourceMappingURL=2-33-instance-command-fast-1787151824000-add-uninstall-hook-completed-for-requested-at-to-application.js.map