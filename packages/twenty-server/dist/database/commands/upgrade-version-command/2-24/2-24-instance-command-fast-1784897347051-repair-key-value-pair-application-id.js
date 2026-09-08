"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "RepairKeyValuePairApplicationIdFastInstanceCommand", {
    enumerable: true,
    get: function() {
        return RepairKeyValuePairApplicationIdFastInstanceCommand;
    }
});
const _registeredinstancecommanddecorator = require("../../../../engine/core-modules/upgrade/decorators/registered-instance-command.decorator");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let RepairKeyValuePairApplicationIdFastInstanceCommand = class RepairKeyValuePairApplicationIdFastInstanceCommand {
    async up(queryRunner) {
        await queryRunner.query(`ALTER TYPE "core"."keyValuePair_type_enum" ADD VALUE IF NOT EXISTS 'APPLICATION_VARIABLE'`);
        await queryRunner.query('ALTER TABLE "core"."keyValuePair" ADD COLUMN IF NOT EXISTS "applicationId" uuid');
        await queryRunner.query('ALTER TABLE "core"."keyValuePair" DROP CONSTRAINT IF EXISTS "FK_e31d245e30cd82307e5416450fc"');
        await queryRunner.query('ALTER TABLE "core"."keyValuePair" ADD CONSTRAINT "FK_e31d245e30cd82307e5416450fc" FOREIGN KEY ("applicationId") REFERENCES "core"."application"("id") ON DELETE CASCADE ON UPDATE NO ACTION');
        await queryRunner.query('CREATE INDEX IF NOT EXISTS "IDX_KEY_VALUE_PAIR_APPLICATION_ID" ON "core"."keyValuePair" ("applicationId")');
        await queryRunner.query('DROP INDEX IF EXISTS "core"."IDX_KEY_VALUE_PAIR_KEY_WORKSPACE_ID_NULL_USER_ID_UNIQUE"');
        await queryRunner.query('CREATE UNIQUE INDEX "IDX_KEY_VALUE_PAIR_KEY_WORKSPACE_ID_NULL_USER_ID_UNIQUE" ON "core"."keyValuePair" ("key", "workspaceId") WHERE "userId" IS NULL AND "applicationId" IS NULL');
        await queryRunner.query('DROP INDEX IF EXISTS "core"."IDX_KEY_VALUE_PAIR_KEY_NULL_USER_ID_NULL_WORKSPACE_ID_UNIQUE"');
        await queryRunner.query('CREATE UNIQUE INDEX "IDX_KEY_VALUE_PAIR_KEY_NULL_USER_ID_NULL_WORKSPACE_ID_UNIQUE" ON "core"."keyValuePair" ("key") WHERE "userId" IS NULL AND "workspaceId" IS NULL AND "applicationId" IS NULL');
        await queryRunner.query('CREATE UNIQUE INDEX IF NOT EXISTS "IDX_KEY_VALUE_PAIR_KEY_APPLICATION_ID_WORKSPACE_UNIQUE" ON "core"."keyValuePair" ("key", "applicationId") WHERE "applicationId" IS NOT NULL AND "workspaceId" IS NOT NULL');
        await queryRunner.query('CREATE UNIQUE INDEX IF NOT EXISTS "IDX_KEY_VALUE_PAIR_KEY_APPLICATION_ID_GLOBAL_UNIQUE" ON "core"."keyValuePair" ("key", "applicationId") WHERE "applicationId" IS NOT NULL AND "workspaceId" IS NULL');
    }
    // No-op: the applicationId column lifecycle is owned by the 2.23.0
    // introduction command. This command only repairs instances that skipped it,
    // so rolling it back must not drop the column or its constraints.
    async down() {}
};
RepairKeyValuePairApplicationIdFastInstanceCommand = _ts_decorate([
    (0, _registeredinstancecommanddecorator.RegisteredInstanceCommand)('2.24.0', 1784897347051)
], RepairKeyValuePairApplicationIdFastInstanceCommand);

//# sourceMappingURL=2-24-instance-command-fast-1784897347051-repair-key-value-pair-application-id.js.map