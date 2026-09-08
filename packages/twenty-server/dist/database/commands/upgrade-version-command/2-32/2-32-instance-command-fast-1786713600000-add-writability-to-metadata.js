"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "AddWritabilityToMetadataFastInstanceCommand", {
    enumerable: true,
    get: function() {
        return AddWritabilityToMetadataFastInstanceCommand;
    }
});
const _registeredinstancecommanddecorator = require("../../../../engine/core-modules/upgrade/decorators/registered-instance-command.decorator");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let AddWritabilityToMetadataFastInstanceCommand = class AddWritabilityToMetadataFastInstanceCommand {
    async up(queryRunner) {
        await queryRunner.query(`CREATE TYPE "core"."objectMetadata_writability_enum" AS ENUM('OPEN', 'APPLICATION', 'SYSTEM')`);
        await queryRunner.query(`ALTER TABLE "core"."objectMetadata" ADD "writability" "core"."objectMetadata_writability_enum" NOT NULL DEFAULT 'OPEN'`);
        await queryRunner.query(`CREATE TYPE "core"."fieldMetadata_writability_enum" AS ENUM('OPEN', 'APPLICATION', 'SYSTEM')`);
        await queryRunner.query(`ALTER TABLE "core"."fieldMetadata" ADD "writability" "core"."fieldMetadata_writability_enum" NOT NULL DEFAULT 'OPEN'`);
    }
    async down(queryRunner) {
        await queryRunner.query('ALTER TABLE "core"."fieldMetadata" DROP COLUMN "writability"');
        await queryRunner.query('DROP TYPE "core"."fieldMetadata_writability_enum"');
        await queryRunner.query('ALTER TABLE "core"."objectMetadata" DROP COLUMN "writability"');
        await queryRunner.query('DROP TYPE "core"."objectMetadata_writability_enum"');
    }
};
AddWritabilityToMetadataFastInstanceCommand = _ts_decorate([
    (0, _registeredinstancecommanddecorator.RegisteredInstanceCommand)('2.32.0', 1786713600000)
], AddWritabilityToMetadataFastInstanceCommand);

//# sourceMappingURL=2-32-instance-command-fast-1786713600000-add-writability-to-metadata.js.map