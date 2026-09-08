"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "AddTsVectorFieldMetadataIdToSearchFieldMetadataFastInstanceCommand", {
    enumerable: true,
    get: function() {
        return AddTsVectorFieldMetadataIdToSearchFieldMetadataFastInstanceCommand;
    }
});
const _registeredinstancecommanddecorator = require("../../../../engine/core-modules/upgrade/decorators/registered-instance-command.decorator");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let AddTsVectorFieldMetadataIdToSearchFieldMetadataFastInstanceCommand = class AddTsVectorFieldMetadataIdToSearchFieldMetadataFastInstanceCommand {
    async up(queryRunner) {
        await queryRunner.query('ALTER TABLE "core"."searchFieldMetadata" ADD "tsVectorFieldMetadataId" uuid');
        await queryRunner.query('ALTER TABLE "core"."searchFieldMetadata" ADD CONSTRAINT "FK_31102b31f7338b6a298fc22996a" FOREIGN KEY ("tsVectorFieldMetadataId") REFERENCES "core"."fieldMetadata"("id") ON DELETE CASCADE ON UPDATE NO ACTION DEFERRABLE INITIALLY DEFERRED');
        await queryRunner.query('ALTER TABLE "core"."searchFieldMetadata" DROP CONSTRAINT IF EXISTS "FK_1b78544eb06f82059a2a01013a3"');
        await queryRunner.query('ALTER TABLE "core"."searchFieldMetadata" ADD CONSTRAINT "FK_1b78544eb06f82059a2a01013a3" FOREIGN KEY ("objectMetadataId") REFERENCES "core"."objectMetadata"("id") ON DELETE CASCADE ON UPDATE NO ACTION DEFERRABLE INITIALLY DEFERRED');
        await queryRunner.query('ALTER TABLE "core"."searchFieldMetadata" DROP CONSTRAINT IF EXISTS "FK_6d5c6922bfd1578b1eff2abb9d6"');
        await queryRunner.query('ALTER TABLE "core"."searchFieldMetadata" ADD CONSTRAINT "FK_6d5c6922bfd1578b1eff2abb9d6" FOREIGN KEY ("fieldMetadataId") REFERENCES "core"."fieldMetadata"("id") ON DELETE CASCADE ON UPDATE NO ACTION DEFERRABLE INITIALLY DEFERRED');
    }
    async down(queryRunner) {
        await queryRunner.query('ALTER TABLE "core"."searchFieldMetadata" DROP CONSTRAINT IF EXISTS "FK_6d5c6922bfd1578b1eff2abb9d6"');
        await queryRunner.query('ALTER TABLE "core"."searchFieldMetadata" ADD CONSTRAINT "FK_6d5c6922bfd1578b1eff2abb9d6" FOREIGN KEY ("fieldMetadataId") REFERENCES "core"."fieldMetadata"("id") ON DELETE CASCADE ON UPDATE NO ACTION');
        await queryRunner.query('ALTER TABLE "core"."searchFieldMetadata" DROP CONSTRAINT IF EXISTS "FK_1b78544eb06f82059a2a01013a3"');
        await queryRunner.query('ALTER TABLE "core"."searchFieldMetadata" ADD CONSTRAINT "FK_1b78544eb06f82059a2a01013a3" FOREIGN KEY ("objectMetadataId") REFERENCES "core"."objectMetadata"("id") ON DELETE CASCADE ON UPDATE NO ACTION');
        await queryRunner.query('ALTER TABLE "core"."searchFieldMetadata" DROP CONSTRAINT "FK_31102b31f7338b6a298fc22996a"');
        await queryRunner.query('ALTER TABLE "core"."searchFieldMetadata" DROP COLUMN "tsVectorFieldMetadataId"');
    }
};
AddTsVectorFieldMetadataIdToSearchFieldMetadataFastInstanceCommand = _ts_decorate([
    (0, _registeredinstancecommanddecorator.RegisteredInstanceCommand)('2.18.0', 1810000001000)
], AddTsVectorFieldMetadataIdToSearchFieldMetadataFastInstanceCommand);

//# sourceMappingURL=2-18-instance-command-fast-1810000001000-add-ts-vector-field-metadata-id-to-search-field-metadata.js.map