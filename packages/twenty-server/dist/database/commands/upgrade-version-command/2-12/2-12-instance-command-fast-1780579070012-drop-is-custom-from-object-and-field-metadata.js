"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "DropIsCustomFromObjectAndFieldMetadataFastInstanceCommand", {
    enumerable: true,
    get: function() {
        return DropIsCustomFromObjectAndFieldMetadataFastInstanceCommand;
    }
});
const _registeredinstancecommanddecorator = require("../../../../engine/core-modules/upgrade/decorators/registered-instance-command.decorator");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
const TWENTY_STANDARD_APPLICATION_UNIVERSAL_IDENTIFIER = '20202020-64aa-4b6f-b003-9c74b97cee20';
let DropIsCustomFromObjectAndFieldMetadataFastInstanceCommand = class DropIsCustomFromObjectAndFieldMetadataFastInstanceCommand {
    async up(queryRunner) {
        await queryRunner.query('ALTER TABLE "core"."fieldMetadata" DROP COLUMN IF EXISTS "isCustom"');
        await queryRunner.query('ALTER TABLE "core"."objectMetadata" DROP COLUMN IF EXISTS "isCustom"');
    }
    async down(queryRunner) {
        await queryRunner.query('ALTER TABLE "core"."objectMetadata" ADD COLUMN IF NOT EXISTS "isCustom" boolean NOT NULL DEFAULT false');
        await queryRunner.query('ALTER TABLE "core"."fieldMetadata" ADD COLUMN IF NOT EXISTS "isCustom" boolean NOT NULL DEFAULT false');
        await queryRunner.query(`UPDATE "core"."objectMetadata" "objectMetadata"
       SET "isCustom" = ("objectMetadata"."applicationId" <> "standardApplication"."id")
       FROM "core"."application" "standardApplication"
       WHERE "standardApplication"."workspaceId" = "objectMetadata"."workspaceId"
         AND "standardApplication"."universalIdentifier" = '${TWENTY_STANDARD_APPLICATION_UNIVERSAL_IDENTIFIER}'`);
        await queryRunner.query(`UPDATE "core"."fieldMetadata" "fieldMetadata"
       SET "isCustom" = ("fieldMetadata"."applicationId" <> "standardApplication"."id")
       FROM "core"."application" "standardApplication"
       WHERE "standardApplication"."workspaceId" = "fieldMetadata"."workspaceId"
         AND "standardApplication"."universalIdentifier" = '${TWENTY_STANDARD_APPLICATION_UNIVERSAL_IDENTIFIER}'`);
    }
};
DropIsCustomFromObjectAndFieldMetadataFastInstanceCommand = _ts_decorate([
    (0, _registeredinstancecommanddecorator.RegisteredInstanceCommand)('2.12.0', 1780579070012)
], DropIsCustomFromObjectAndFieldMetadataFastInstanceCommand);

//# sourceMappingURL=2-12-instance-command-fast-1780579070012-drop-is-custom-from-object-and-field-metadata.js.map