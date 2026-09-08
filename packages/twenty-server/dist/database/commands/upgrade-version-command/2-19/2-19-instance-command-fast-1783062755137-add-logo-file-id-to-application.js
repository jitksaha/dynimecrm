"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "AddLogoFileIdToApplicationFastInstanceCommand", {
    enumerable: true,
    get: function() {
        return AddLogoFileIdToApplicationFastInstanceCommand;
    }
});
const _registeredinstancecommanddecorator = require("../../../../engine/core-modules/upgrade/decorators/registered-instance-command.decorator");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let AddLogoFileIdToApplicationFastInstanceCommand = class AddLogoFileIdToApplicationFastInstanceCommand {
    async up(queryRunner) {
        await queryRunner.query('ALTER TABLE "core"."application" ADD "logoFileId" uuid');
        await queryRunner.query('ALTER TABLE "core"."application" ADD CONSTRAINT "UQ_3d6ee2b75b81933c1708918f647" UNIQUE ("logoFileId")');
        await queryRunner.query('ALTER TABLE "core"."application" ADD CONSTRAINT "FK_3d6ee2b75b81933c1708918f647" FOREIGN KEY ("logoFileId") REFERENCES "core"."file"("id") ON DELETE SET NULL ON UPDATE NO ACTION');
    }
    async down(queryRunner) {
        await queryRunner.query('ALTER TABLE "core"."application" DROP CONSTRAINT "FK_3d6ee2b75b81933c1708918f647"');
        await queryRunner.query('ALTER TABLE "core"."application" DROP CONSTRAINT "UQ_3d6ee2b75b81933c1708918f647"');
        await queryRunner.query('ALTER TABLE "core"."application" DROP COLUMN "logoFileId"');
    }
};
AddLogoFileIdToApplicationFastInstanceCommand = _ts_decorate([
    (0, _registeredinstancecommanddecorator.RegisteredInstanceCommand)('2.19.0', 1783062755137)
], AddLogoFileIdToApplicationFastInstanceCommand);

//# sourceMappingURL=2-19-instance-command-fast-1783062755137-add-logo-file-id-to-application.js.map