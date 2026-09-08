"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "CreateApplicationTranslationCoreTableFastInstanceCommand", {
    enumerable: true,
    get: function() {
        return CreateApplicationTranslationCoreTableFastInstanceCommand;
    }
});
const _registeredinstancecommanddecorator = require("../../../../engine/core-modules/upgrade/decorators/registered-instance-command.decorator");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let CreateApplicationTranslationCoreTableFastInstanceCommand = class CreateApplicationTranslationCoreTableFastInstanceCommand {
    async up(queryRunner) {
        await queryRunner.query(`CREATE TABLE IF NOT EXISTS "core"."applicationTranslation" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "applicationRegistrationId" uuid,
        "locale" text NOT NULL,
        "messages" jsonb NOT NULL DEFAULT '{}',
        "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "deletedAt" TIMESTAMP WITH TIME ZONE,
        CONSTRAINT "PK_applicationTranslation_id" PRIMARY KEY ("id"),
        CONSTRAINT "FK_62da06a264eae9a1e84f6c611bd" FOREIGN KEY ("applicationRegistrationId") REFERENCES "core"."applicationRegistration"("id") ON DELETE CASCADE
      )`);
        await queryRunner.query(`CREATE UNIQUE INDEX IF NOT EXISTS "IDX_APPLICATION_TRANSLATION_REGISTRATION_LOCALE_UNIQUE"
        ON "core"."applicationTranslation" ("applicationRegistrationId", "locale")
        WHERE "deletedAt" IS NULL`);
        await queryRunner.query(`CREATE UNIQUE INDEX IF NOT EXISTS "IDX_APPLICATION_TRANSLATION_STANDARD_LOCALE_UNIQUE"
        ON "core"."applicationTranslation" ("locale")
        WHERE "deletedAt" IS NULL AND "applicationRegistrationId" IS NULL`);
    }
    async down(queryRunner) {
        await queryRunner.query(`DROP INDEX IF EXISTS "core"."IDX_APPLICATION_TRANSLATION_STANDARD_LOCALE_UNIQUE"`);
        await queryRunner.query(`DROP INDEX IF EXISTS "core"."IDX_APPLICATION_TRANSLATION_REGISTRATION_LOCALE_UNIQUE"`);
        await queryRunner.query(`DROP TABLE IF EXISTS "core"."applicationTranslation"`);
    }
};
CreateApplicationTranslationCoreTableFastInstanceCommand = _ts_decorate([
    (0, _registeredinstancecommanddecorator.RegisteredInstanceCommand)('2.17.0', 1801000100000)
], CreateApplicationTranslationCoreTableFastInstanceCommand);

//# sourceMappingURL=2-17-instance-command-fast-1801000100000-create-application-translation-core-table.js.map