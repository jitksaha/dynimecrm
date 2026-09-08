"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "AddMetadataOverridesColumnFastInstanceCommand", {
    enumerable: true,
    get: function() {
        return AddMetadataOverridesColumnFastInstanceCommand;
    }
});
const _registeredinstancecommanddecorator = require("../../../../engine/core-modules/upgrade/decorators/registered-instance-command.decorator");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
const TABLES = [
    'objectMetadata',
    'fieldMetadata'
];
let AddMetadataOverridesColumnFastInstanceCommand = class AddMetadataOverridesColumnFastInstanceCommand {
    async up(queryRunner) {
        for (const table of TABLES){
            await queryRunner.query(`ALTER TABLE "core"."${table}" ADD COLUMN IF NOT EXISTS "overrides" jsonb`);
        }
    }
    async down(queryRunner) {
        for (const table of TABLES){
            // Unconditional copy: a WHERE "overrides" IS NOT NULL guard would leave a
            // stale value in standardOverrides and resurrect a cleared override.
            await queryRunner.query(`UPDATE "core"."${table}" SET "standardOverrides" = "overrides"`);
            await queryRunner.query(`ALTER TABLE "core"."${table}" DROP COLUMN IF EXISTS "overrides"`);
        }
    }
};
AddMetadataOverridesColumnFastInstanceCommand = _ts_decorate([
    (0, _registeredinstancecommanddecorator.RegisteredInstanceCommand)('2.19.0', 1782986475000)
], AddMetadataOverridesColumnFastInstanceCommand);

//# sourceMappingURL=2-19-instance-command-fast-1782986475000-add-metadata-overrides-column.js.map