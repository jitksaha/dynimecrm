"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "AddOpenRecordInToObjectMetadataFastInstanceCommand", {
    enumerable: true,
    get: function() {
        return AddOpenRecordInToObjectMetadataFastInstanceCommand;
    }
});
const _registeredinstancecommanddecorator = require("../../../../engine/core-modules/upgrade/decorators/registered-instance-command.decorator");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let AddOpenRecordInToObjectMetadataFastInstanceCommand = class AddOpenRecordInToObjectMetadataFastInstanceCommand {
    async up(queryRunner) {
        await queryRunner.query(`CREATE TYPE "core"."objectMetadata_openrecordin_enum" AS ENUM('SIDE_PANEL', 'RECORD_PAGE', 'USER_CHOICE')`);
        await queryRunner.query(`ALTER TABLE "core"."objectMetadata" ADD "openRecordIn" "core"."objectMetadata_openrecordin_enum" NOT NULL DEFAULT 'USER_CHOICE'`);
    }
    async down(queryRunner) {
        await queryRunner.query('ALTER TABLE "core"."objectMetadata" DROP COLUMN "openRecordIn"');
        await queryRunner.query('DROP TYPE "core"."objectMetadata_openrecordin_enum"');
    }
};
AddOpenRecordInToObjectMetadataFastInstanceCommand = _ts_decorate([
    (0, _registeredinstancecommanddecorator.RegisteredInstanceCommand)('2.27.0', 1785504900000)
], AddOpenRecordInToObjectMetadataFastInstanceCommand);

//# sourceMappingURL=2-27-instance-command-fast-1785504900000-add-open-record-in-to-object-metadata.js.map