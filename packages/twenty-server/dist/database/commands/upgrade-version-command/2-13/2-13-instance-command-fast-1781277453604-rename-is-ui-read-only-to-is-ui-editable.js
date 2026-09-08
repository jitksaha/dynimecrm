// Grandfathered: this 2.13 command already shipped to cloud and is recorded
// complete there, so per "never rewrite a committed instance command" it is
// frozen as-is. Its up() does ADD COLUMN + bulk UPDATE in one transaction — the
// exact pattern that held an ACCESS EXCLUSIVE lock and stalled prod reads, and
// the reason no-data-mutation-in-fast-instance-command exists. This is an
// exception, not a precedent: new backfills go in a slow instance command.
/* oxlint-disable twenty/no-data-mutation-in-fast-instance-command */ "use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "RenameIsUiReadOnlyToIsUiEditableFastInstanceCommand", {
    enumerable: true,
    get: function() {
        return RenameIsUiReadOnlyToIsUiEditableFastInstanceCommand;
    }
});
const _registeredinstancecommanddecorator = require("../../../../engine/core-modules/upgrade/decorators/registered-instance-command.decorator");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let RenameIsUiReadOnlyToIsUiEditableFastInstanceCommand = class RenameIsUiReadOnlyToIsUiEditableFastInstanceCommand {
    async up(queryRunner) {
        await queryRunner.query('ALTER TABLE "core"."objectMetadata" ADD COLUMN IF NOT EXISTS "isUIEditable" boolean NOT NULL DEFAULT true');
        await queryRunner.query(`UPDATE "core"."objectMetadata" SET "isUIEditable" = false WHERE "isUIReadOnly" = true`);
        await queryRunner.query('ALTER TABLE "core"."objectMetadata" ADD COLUMN IF NOT EXISTS "isUICreatable" boolean NOT NULL DEFAULT true');
        await queryRunner.query('ALTER TABLE "core"."fieldMetadata" ADD COLUMN IF NOT EXISTS "isUIEditable" boolean NOT NULL DEFAULT true');
        await queryRunner.query(`UPDATE "core"."fieldMetadata" SET "isUIEditable" = false WHERE "isUIReadOnly" = true`);
    }
    async down(queryRunner) {
        await queryRunner.query('ALTER TABLE "core"."fieldMetadata" DROP COLUMN IF EXISTS "isUIEditable"');
        await queryRunner.query('ALTER TABLE "core"."objectMetadata" DROP COLUMN IF EXISTS "isUICreatable"');
        await queryRunner.query('ALTER TABLE "core"."objectMetadata" DROP COLUMN IF EXISTS "isUIEditable"');
    }
};
RenameIsUiReadOnlyToIsUiEditableFastInstanceCommand = _ts_decorate([
    (0, _registeredinstancecommanddecorator.RegisteredInstanceCommand)('2.13.0', 1781277453604)
], RenameIsUiReadOnlyToIsUiEditableFastInstanceCommand);

//# sourceMappingURL=2-13-instance-command-fast-1781277453604-rename-is-ui-read-only-to-is-ui-editable.js.map