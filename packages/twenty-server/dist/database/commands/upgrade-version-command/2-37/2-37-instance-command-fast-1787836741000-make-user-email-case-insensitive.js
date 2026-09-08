"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "MakeUserEmailCaseInsensitiveFastInstanceCommand", {
    enumerable: true,
    get: function() {
        return MakeUserEmailCaseInsensitiveFastInstanceCommand;
    }
});
const _registeredinstancecommanddecorator = require("../../../../engine/core-modules/upgrade/decorators/registered-instance-command.decorator");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let MakeUserEmailCaseInsensitiveFastInstanceCommand = class MakeUserEmailCaseInsensitiveFastInstanceCommand {
    async up(queryRunner) {
        await queryRunner.query('CREATE EXTENSION IF NOT EXISTS citext');
        await queryRunner.query(`
      DO $$
      BEGIN
        IF EXISTS (
          SELECT 1 FROM "core"."user"
          WHERE "deletedAt" IS NULL
          GROUP BY lower("email")
          HAVING count(*) > 1
        ) THEN
          RAISE WARNING 'core."user"."email" left case-sensitive: addresses that differ only by casing already exist and must be merged first';
          RETURN;
        END IF;

        DROP INDEX IF EXISTS "core"."UQ_USER_EMAIL";
        ALTER TABLE "core"."user" ALTER COLUMN "email" TYPE citext USING "email"::citext;
        CREATE UNIQUE INDEX "UQ_USER_EMAIL" ON "core"."user" ("email") WHERE "deletedAt" IS NULL;
      END $$;
    `);
    }
    async down(queryRunner) {
        await queryRunner.query('DROP INDEX IF EXISTS "core"."UQ_USER_EMAIL"');
        await queryRunner.query('ALTER TABLE "core"."user" ALTER COLUMN "email" TYPE character varying USING "email"::character varying');
        await queryRunner.query('CREATE UNIQUE INDEX "UQ_USER_EMAIL" ON "core"."user" ("email") WHERE "deletedAt" IS NULL');
    }
};
MakeUserEmailCaseInsensitiveFastInstanceCommand = _ts_decorate([
    (0, _registeredinstancecommanddecorator.RegisteredInstanceCommand)('2.37.0', 1787836741000)
], MakeUserEmailCaseInsensitiveFastInstanceCommand);

//# sourceMappingURL=2-37-instance-command-fast-1787836741000-make-user-email-case-insensitive.js.map