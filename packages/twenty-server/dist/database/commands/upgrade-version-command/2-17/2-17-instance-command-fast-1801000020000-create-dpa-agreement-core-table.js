"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "CreateDpaAgreementCoreTableFastInstanceCommand", {
    enumerable: true,
    get: function() {
        return CreateDpaAgreementCoreTableFastInstanceCommand;
    }
});
const _registeredinstancecommanddecorator = require("../../../../engine/core-modules/upgrade/decorators/registered-instance-command.decorator");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let CreateDpaAgreementCoreTableFastInstanceCommand = class CreateDpaAgreementCoreTableFastInstanceCommand {
    async up(queryRunner) {
        await queryRunner.query(`DO $$ BEGIN CREATE TYPE "core"."dpaAgreement_type_enum" AS ENUM ('CLICK_THROUGH', 'SIGNED'); EXCEPTION WHEN duplicate_object THEN null; END $$`);
        await queryRunner.query(`CREATE TABLE IF NOT EXISTS "core"."dpaAgreement" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "type" "core"."dpaAgreement_type_enum" NOT NULL,
        "templateVersion" character varying NOT NULL,
        "region" character varying NOT NULL,
        "processorEntity" character varying NOT NULL,
        "customerLegalEntityName" character varying,
        "signatoryName" character varying,
        "signatoryTitle" character varying,
        "signedFileId" uuid,
        "acceptedByUserId" uuid,
        "acceptedByEmail" character varying,
        "acceptedAt" TIMESTAMP WITH TIME ZONE NOT NULL,
        "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "workspaceId" uuid NOT NULL,
        CONSTRAINT "PK_dpaAgreement_id" PRIMARY KEY ("id"),
        -- FK name must match TypeORM's generated hash for the workspace relation.
        CONSTRAINT "FK_abba2f6707bd2bc18bbd52f3c3e" FOREIGN KEY ("workspaceId") REFERENCES "core"."workspace"("id") ON DELETE CASCADE
      )`);
        await queryRunner.query(`CREATE INDEX IF NOT EXISTS "IDX_DPA_AGREEMENT_WORKSPACE_ID"
        ON "core"."dpaAgreement" ("workspaceId")`);
    }
    async down(queryRunner) {
        await queryRunner.query(`DROP TABLE IF EXISTS "core"."dpaAgreement"`);
        await queryRunner.query(`DROP TYPE IF EXISTS "core"."dpaAgreement_type_enum"`);
    }
};
CreateDpaAgreementCoreTableFastInstanceCommand = _ts_decorate([
    (0, _registeredinstancecommanddecorator.RegisteredInstanceCommand)('2.17.0', 1801000020000)
], CreateDpaAgreementCoreTableFastInstanceCommand);

//# sourceMappingURL=2-17-instance-command-fast-1801000020000-create-dpa-agreement-core-table.js.map