"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "AddUsageLimitFastInstanceCommand", {
    enumerable: true,
    get: function() {
        return AddUsageLimitFastInstanceCommand;
    }
});
const _registeredinstancecommanddecorator = require("../../../../engine/core-modules/upgrade/decorators/registered-instance-command.decorator");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let AddUsageLimitFastInstanceCommand = class AddUsageLimitFastInstanceCommand {
    async up(queryRunner) {
        await queryRunner.query('CREATE TABLE "core"."usageLimit" ("workspaceId" uuid NOT NULL, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "resourceType" character varying NOT NULL, "operationType" character varying NOT NULL, "spenderType" character varying NOT NULL, "spenderId" character varying NOT NULL DEFAULT \'\', "limitKind" character varying NOT NULL, "windowSeconds" integer NOT NULL DEFAULT \'0\', "limitValueType" character varying NOT NULL DEFAULT \'absolute\', "limitValue" bigint NOT NULL, "burstValue" bigint, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "UQ_USAGE_LIMIT_SCOPE" UNIQUE ("workspaceId", "resourceType", "operationType", "spenderType", "spenderId", "limitKind", "windowSeconds"), CONSTRAINT "PK_aa789af8757d2ef28a0416df290" PRIMARY KEY ("id"))');
        await queryRunner.query('ALTER TABLE "core"."usageLimit" ADD CONSTRAINT "FK_262e7eabfa66b9724f7bf45628e" FOREIGN KEY ("workspaceId") REFERENCES "core"."workspace"("id") ON DELETE CASCADE ON UPDATE NO ACTION');
    }
    async down(queryRunner) {
        await queryRunner.query('ALTER TABLE "core"."usageLimit" DROP CONSTRAINT "FK_262e7eabfa66b9724f7bf45628e"');
        await queryRunner.query('DROP TABLE "core"."usageLimit"');
    }
};
AddUsageLimitFastInstanceCommand = _ts_decorate([
    (0, _registeredinstancecommanddecorator.RegisteredInstanceCommand)('2.36.0', 1787821567133)
], AddUsageLimitFastInstanceCommand);

//# sourceMappingURL=2-36-instance-command-fast-1787821567133-add-usage-limit.js.map