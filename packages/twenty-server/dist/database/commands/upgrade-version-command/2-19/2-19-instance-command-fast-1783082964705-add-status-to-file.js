"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "AddStatusToFileFastInstanceCommand", {
    enumerable: true,
    get: function() {
        return AddStatusToFileFastInstanceCommand;
    }
});
const _registeredinstancecommanddecorator = require("../../../../engine/core-modules/upgrade/decorators/registered-instance-command.decorator");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let AddStatusToFileFastInstanceCommand = class AddStatusToFileFastInstanceCommand {
    async up(queryRunner) {
        await queryRunner.query(`DO $$ BEGIN CREATE TYPE "core"."file_status_enum" AS ENUM('PENDING', 'UPLOADED'); EXCEPTION WHEN duplicate_object THEN null; END $$`);
        await queryRunner.query(`ALTER TABLE "core"."file" ADD COLUMN IF NOT EXISTS "status" "core"."file_status_enum" NOT NULL DEFAULT 'UPLOADED'`);
        await queryRunner.query(`CREATE INDEX IF NOT EXISTS "IDX_FILE_STATUS" ON "core"."file" ("status")`);
    }
    async down(queryRunner) {
        await queryRunner.query(`DROP INDEX IF EXISTS "core"."IDX_FILE_STATUS"`);
        await queryRunner.query(`ALTER TABLE "core"."file" DROP COLUMN IF EXISTS "status"`);
        await queryRunner.query(`DROP TYPE IF EXISTS "core"."file_status_enum"`);
    }
};
AddStatusToFileFastInstanceCommand = _ts_decorate([
    (0, _registeredinstancecommanddecorator.RegisteredInstanceCommand)('2.19.0', 1783082964705)
], AddStatusToFileFastInstanceCommand);

//# sourceMappingURL=2-19-instance-command-fast-1783082964705-add-status-to-file.js.map