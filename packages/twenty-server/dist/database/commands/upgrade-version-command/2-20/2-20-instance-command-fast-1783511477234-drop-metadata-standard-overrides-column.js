"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "DropMetadataStandardOverridesColumnFastInstanceCommand", {
    enumerable: true,
    get: function() {
        return DropMetadataStandardOverridesColumnFastInstanceCommand;
    }
});
const _registeredinstancecommanddecorator = require("../../../../engine/core-modules/upgrade/decorators/registered-instance-command.decorator");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
// Drops the legacy "standardOverrides" column, superseded by "overrides" in
// 2.19. Registered against 2.20.0 so it stays dormant until 2.20 is current
// (the sequence only runs previous + current versions). down() restores it.
const TABLES = [
    'objectMetadata',
    'fieldMetadata'
];
let DropMetadataStandardOverridesColumnFastInstanceCommand = class DropMetadataStandardOverridesColumnFastInstanceCommand {
    async up(queryRunner) {
        for (const table of TABLES){
            await queryRunner.query(`ALTER TABLE "core"."${table}" DROP COLUMN IF EXISTS "standardOverrides"`);
        }
    }
    async down(queryRunner) {
        for (const table of TABLES){
            await queryRunner.query(`ALTER TABLE "core"."${table}" ADD COLUMN IF NOT EXISTS "standardOverrides" jsonb`);
            // Unconditional copy: a WHERE "overrides" IS NOT NULL guard would leave a
            // stale value and resurrect a cleared override.
            await queryRunner.query(`UPDATE "core"."${table}" SET "standardOverrides" = "overrides"`);
        }
    }
};
DropMetadataStandardOverridesColumnFastInstanceCommand = _ts_decorate([
    (0, _registeredinstancecommanddecorator.RegisteredInstanceCommand)('2.20.0', 1783511477234)
], DropMetadataStandardOverridesColumnFastInstanceCommand);

//# sourceMappingURL=2-20-instance-command-fast-1783511477234-drop-metadata-standard-overrides-column.js.map