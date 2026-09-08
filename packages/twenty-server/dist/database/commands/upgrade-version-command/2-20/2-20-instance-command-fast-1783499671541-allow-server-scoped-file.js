"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "AllowServerScopedFileFastInstanceCommand", {
    enumerable: true,
    get: function() {
        return AllowServerScopedFileFastInstanceCommand;
    }
});
const _registeredinstancecommanddecorator = require("../../../../engine/core-modules/upgrade/decorators/registered-instance-command.decorator");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let AllowServerScopedFileFastInstanceCommand = class AllowServerScopedFileFastInstanceCommand {
    async up(queryRunner) {
        await queryRunner.query('ALTER TABLE "core"."file" ADD "applicationRegistrationId" uuid');
        await queryRunner.query('ALTER TABLE "core"."file" DROP CONSTRAINT "FK_de468b3d8dcf7e94f7074220929"');
        await queryRunner.query('ALTER TABLE "core"."file" DROP CONSTRAINT "IDX_APPLICATION_PATH_WORKSPACE_ID_APPLICATION_ID_UNIQUE"');
        await queryRunner.query('ALTER TABLE "core"."file" ALTER COLUMN "workspaceId" DROP NOT NULL');
        await queryRunner.query('ALTER TABLE "core"."file" ADD CONSTRAINT "IDX_FILE_APPLICATION_REGISTRATION_ID_PATH_UNIQUE" UNIQUE ("applicationRegistrationId", "path")');
        await queryRunner.query('CREATE INDEX "IDX_FILE_APPLICATION_REGISTRATION_ID" ON "core"."file" ("applicationRegistrationId") ');
        await queryRunner.query('ALTER TABLE "core"."file" ADD CONSTRAINT "IDX_APPLICATION_PATH_WORKSPACE_ID_APPLICATION_ID_UNIQUE" UNIQUE ("workspaceId", "applicationId", "path")');
        await queryRunner.query('ALTER TABLE "core"."file" ADD CONSTRAINT "FK_de468b3d8dcf7e94f7074220929" FOREIGN KEY ("workspaceId") REFERENCES "core"."workspace"("id") ON DELETE CASCADE ON UPDATE NO ACTION');
        await queryRunner.query('ALTER TABLE "core"."file" ADD CONSTRAINT "FK_feffd2addf9467be6d7cd51db76" FOREIGN KEY ("applicationRegistrationId") REFERENCES "core"."applicationRegistration"("id") ON DELETE CASCADE ON UPDATE NO ACTION');
        await queryRunner.query('ALTER TABLE "core"."file" ADD CONSTRAINT "CHK_FILE_WORKSPACE_ID_OR_APPLICATION_REGISTRATION_ID" CHECK ("workspaceId" IS NOT NULL OR "applicationRegistrationId" IS NOT NULL)');
        await queryRunner.query('ALTER TABLE "core"."file" ADD CONSTRAINT "CHK_FILE_WORKSPACE_ID_XOR_APPLICATION_REGISTRATION_ID" CHECK ("workspaceId" IS NULL OR "applicationRegistrationId" IS NULL)');
    }
    async down(queryRunner) {
        await queryRunner.query('ALTER TABLE "core"."file" DROP CONSTRAINT "CHK_FILE_WORKSPACE_ID_XOR_APPLICATION_REGISTRATION_ID"');
        await queryRunner.query('ALTER TABLE "core"."file" DROP CONSTRAINT "CHK_FILE_WORKSPACE_ID_OR_APPLICATION_REGISTRATION_ID"');
        await queryRunner.query('ALTER TABLE "core"."file" DROP CONSTRAINT "FK_feffd2addf9467be6d7cd51db76"');
        await queryRunner.query('ALTER TABLE "core"."file" DROP CONSTRAINT "FK_de468b3d8dcf7e94f7074220929"');
        await queryRunner.query('ALTER TABLE "core"."file" DROP CONSTRAINT "IDX_APPLICATION_PATH_WORKSPACE_ID_APPLICATION_ID_UNIQUE"');
        await queryRunner.query('DROP INDEX "core"."IDX_FILE_APPLICATION_REGISTRATION_ID"');
        await queryRunner.query('ALTER TABLE "core"."file" DROP CONSTRAINT "IDX_FILE_APPLICATION_REGISTRATION_ID_PATH_UNIQUE"');
        // Server-scoped rows cannot survive the NOT NULL restore.
        await queryRunner.query('DELETE FROM "core"."file" WHERE "workspaceId" IS NULL');
        await queryRunner.query('ALTER TABLE "core"."file" ALTER COLUMN "workspaceId" SET NOT NULL');
        await queryRunner.query('ALTER TABLE "core"."file" ADD CONSTRAINT "IDX_APPLICATION_PATH_WORKSPACE_ID_APPLICATION_ID_UNIQUE" UNIQUE ("workspaceId", "applicationId", "path")');
        await queryRunner.query('ALTER TABLE "core"."file" ADD CONSTRAINT "FK_de468b3d8dcf7e94f7074220929" FOREIGN KEY ("workspaceId") REFERENCES "core"."workspace"("id") ON DELETE CASCADE ON UPDATE NO ACTION');
        await queryRunner.query('ALTER TABLE "core"."file" DROP COLUMN "applicationRegistrationId"');
    }
};
AllowServerScopedFileFastInstanceCommand = _ts_decorate([
    (0, _registeredinstancecommanddecorator.RegisteredInstanceCommand)('2.20.0', 1783499671541)
], AllowServerScopedFileFastInstanceCommand);

//# sourceMappingURL=2-20-instance-command-fast-1783499671541-allow-server-scoped-file.js.map