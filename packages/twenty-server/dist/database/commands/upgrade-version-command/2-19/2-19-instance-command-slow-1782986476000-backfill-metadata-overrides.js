"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "BackfillMetadataOverridesSlowInstanceCommand", {
    enumerable: true,
    get: function() {
        return BackfillMetadataOverridesSlowInstanceCommand;
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
let BackfillMetadataOverridesSlowInstanceCommand = class BackfillMetadataOverridesSlowInstanceCommand {
    async runDataMigration(dataSource) {
        for (const table of TABLES){
            const activeCountBefore = await this.getActiveCount(dataSource, table);
            await dataSource.query(`UPDATE "core"."${table}" SET "overrides" = "standardOverrides" WHERE "standardOverrides" IS NOT NULL AND "overrides" IS NULL`);
            const activeCountAfter = await this.getActiveCount(dataSource, table);
            if (activeCountBefore !== activeCountAfter) {
                throw new Error(`BackfillMetadataOverrides: "isActive" changed on "core"."${table}" (${activeCountBefore} -> ${activeCountAfter}), aborting.`);
            }
        }
    }
    async up(_queryRunner) {
        return;
    }
    async down(_queryRunner) {
        return;
    }
    async getActiveCount(dataSource, table) {
        const [{ count }] = await dataSource.query(`SELECT count(*)::int AS count FROM "core"."${table}" WHERE "isActive" = true`);
        return count;
    }
};
BackfillMetadataOverridesSlowInstanceCommand = _ts_decorate([
    (0, _registeredinstancecommanddecorator.RegisteredInstanceCommand)('2.19.0', 1782986476000, {
        type: 'slow'
    })
], BackfillMetadataOverridesSlowInstanceCommand);

//# sourceMappingURL=2-19-instance-command-slow-1782986476000-backfill-metadata-overrides.js.map