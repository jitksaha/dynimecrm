"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "AddPendingMimeCheckToFileFastInstanceCommand", {
    enumerable: true,
    get: function() {
        return AddPendingMimeCheckToFileFastInstanceCommand;
    }
});
const _registeredinstancecommanddecorator = require("../../../../engine/core-modules/upgrade/decorators/registered-instance-command.decorator");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let AddPendingMimeCheckToFileFastInstanceCommand = class AddPendingMimeCheckToFileFastInstanceCommand {
    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE "core"."file" DROP CONSTRAINT IF EXISTS "CHK_FILE_PENDING_MIME_OCTET_STREAM"`);
        await queryRunner.query(`ALTER TABLE "core"."file" ADD CONSTRAINT "CHK_FILE_PENDING_MIME_OCTET_STREAM" CHECK ("status" != 'PENDING' OR "mimeType" = 'application/octet-stream') NOT VALID`);
    }
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "core"."file" DROP CONSTRAINT IF EXISTS "CHK_FILE_PENDING_MIME_OCTET_STREAM"`);
    }
};
AddPendingMimeCheckToFileFastInstanceCommand = _ts_decorate([
    (0, _registeredinstancecommanddecorator.RegisteredInstanceCommand)('2.19.0', 1783094691548)
], AddPendingMimeCheckToFileFastInstanceCommand);

//# sourceMappingURL=2-19-instance-command-fast-1783094691548-add-pending-mime-check-to-file.js.map