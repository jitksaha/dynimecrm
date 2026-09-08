"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "AddUniversalIdentifierAndApplicationIdToSearchFieldMetadataFastInstanceCommand", {
    enumerable: true,
    get: function() {
        return AddUniversalIdentifierAndApplicationIdToSearchFieldMetadataFastInstanceCommand;
    }
});
const _registeredinstancecommanddecorator = require("../../../../engine/core-modules/upgrade/decorators/registered-instance-command.decorator");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let AddUniversalIdentifierAndApplicationIdToSearchFieldMetadataFastInstanceCommand = class AddUniversalIdentifierAndApplicationIdToSearchFieldMetadataFastInstanceCommand {
    async up(queryRunner) {
        await queryRunner.query('ALTER TABLE "core"."searchFieldMetadata" ADD "universalIdentifier" uuid NOT NULL');
        await queryRunner.query('ALTER TABLE "core"."searchFieldMetadata" ADD "applicationId" uuid NOT NULL');
        // The column is NOT NULL but added without a default: searchFieldMetadata is dormant/empty
        // at instance-command time and the 2-16 backfill workspace command populates positions.
        await queryRunner.query('ALTER TABLE "core"."searchFieldMetadata" ADD "position" double precision NOT NULL');
        await queryRunner.query('CREATE UNIQUE INDEX "IDX_c2e441c901b45221a70d325349" ON "core"."searchFieldMetadata" ("workspaceId", "universalIdentifier") ');
        await queryRunner.query('ALTER TABLE "core"."searchFieldMetadata" ADD CONSTRAINT "FK_927b6101a5d9562a558a18ed412" FOREIGN KEY ("applicationId") REFERENCES "core"."application"("id") ON DELETE CASCADE ON UPDATE NO ACTION');
    }
    async down(queryRunner) {
        await queryRunner.query('ALTER TABLE "core"."searchFieldMetadata" DROP CONSTRAINT "FK_927b6101a5d9562a558a18ed412"');
        await queryRunner.query('DROP INDEX "core"."IDX_c2e441c901b45221a70d325349"');
        await queryRunner.query('ALTER TABLE "core"."searchFieldMetadata" DROP COLUMN "position"');
        await queryRunner.query('ALTER TABLE "core"."searchFieldMetadata" DROP COLUMN "applicationId"');
        await queryRunner.query('ALTER TABLE "core"."searchFieldMetadata" DROP COLUMN "universalIdentifier"');
    }
};
AddUniversalIdentifierAndApplicationIdToSearchFieldMetadataFastInstanceCommand = _ts_decorate([
    (0, _registeredinstancecommanddecorator.RegisteredInstanceCommand)('2.16.0', 1782200000000)
], AddUniversalIdentifierAndApplicationIdToSearchFieldMetadataFastInstanceCommand);

//# sourceMappingURL=2-16-instance-command-fast-1782200000000-add-universal-identifier-and-application-id-to-search-field-metadata.js.map