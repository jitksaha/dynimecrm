"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "AddFolderImportToMessageFolderPendingSyncActionFastInstanceCommand", {
    enumerable: true,
    get: function() {
        return AddFolderImportToMessageFolderPendingSyncActionFastInstanceCommand;
    }
});
const _registeredinstancecommanddecorator = require("../../../../engine/core-modules/upgrade/decorators/registered-instance-command.decorator");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let AddFolderImportToMessageFolderPendingSyncActionFastInstanceCommand = class AddFolderImportToMessageFolderPendingSyncActionFastInstanceCommand {
    async up(queryRunner) {
        await queryRunner.query('ALTER TYPE "core"."messageFolder_pendingsyncaction_enum" RENAME TO "messageFolder_pendingsyncaction_enum_old"');
        await queryRunner.query('CREATE TYPE "core"."messageFolder_pendingsyncaction_enum" AS ENUM(\'FOLDER_DELETION\', \'FOLDER_IMPORT\', \'NONE\')');
        await queryRunner.query('ALTER TABLE "core"."messageFolder" ALTER COLUMN "pendingSyncAction" DROP DEFAULT');
        await queryRunner.query('ALTER TABLE "core"."messageFolder" ALTER COLUMN "pendingSyncAction" TYPE "core"."messageFolder_pendingsyncaction_enum" USING "pendingSyncAction"::"text"::"core"."messageFolder_pendingsyncaction_enum"');
        await queryRunner.query('ALTER TABLE "core"."messageFolder" ALTER COLUMN "pendingSyncAction" SET DEFAULT \'NONE\'');
        await queryRunner.query('DROP TYPE "core"."messageFolder_pendingsyncaction_enum_old"');
    }
    async down(queryRunner) {
        await queryRunner.query('CREATE TYPE "core"."messageFolder_pendingsyncaction_enum_old" AS ENUM(\'FOLDER_DELETION\', \'NONE\')');
        await queryRunner.query('ALTER TABLE "core"."messageFolder" ALTER COLUMN "pendingSyncAction" DROP DEFAULT');
        await queryRunner.query('ALTER TABLE "core"."messageFolder" ALTER COLUMN "pendingSyncAction" TYPE "core"."messageFolder_pendingsyncaction_enum_old" USING (CASE WHEN "pendingSyncAction"::"text" = \'FOLDER_IMPORT\' THEN \'NONE\' ELSE "pendingSyncAction"::"text" END)::"core"."messageFolder_pendingsyncaction_enum_old"');
        await queryRunner.query('ALTER TABLE "core"."messageFolder" ALTER COLUMN "pendingSyncAction" SET DEFAULT \'NONE\'');
        await queryRunner.query('DROP TYPE "core"."messageFolder_pendingsyncaction_enum"');
        await queryRunner.query('ALTER TYPE "core"."messageFolder_pendingsyncaction_enum_old" RENAME TO "messageFolder_pendingsyncaction_enum"');
    }
};
AddFolderImportToMessageFolderPendingSyncActionFastInstanceCommand = _ts_decorate([
    (0, _registeredinstancecommanddecorator.RegisteredInstanceCommand)('2.15.0', 1781714499016)
], AddFolderImportToMessageFolderPendingSyncActionFastInstanceCommand);

//# sourceMappingURL=2-15-instance-command-fast-1781714499016-add-folder-import-to-message-folder-pending-sync-action.js.map