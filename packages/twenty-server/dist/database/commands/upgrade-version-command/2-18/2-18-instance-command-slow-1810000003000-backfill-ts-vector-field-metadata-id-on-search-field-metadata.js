"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "BackfillTsVectorFieldMetadataIdOnSearchFieldMetadataSlowInstanceCommand", {
    enumerable: true,
    get: function() {
        return BackfillTsVectorFieldMetadataIdOnSearchFieldMetadataSlowInstanceCommand;
    }
});
const _common = require("@nestjs/common");
const _registeredinstancecommanddecorator = require("../../../../engine/core-modules/upgrade/decorators/registered-instance-command.decorator");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let BackfillTsVectorFieldMetadataIdOnSearchFieldMetadataSlowInstanceCommand = class BackfillTsVectorFieldMetadataIdOnSearchFieldMetadataSlowInstanceCommand {
    async runDataMigration(dataSource) {
        await dataSource.query(`UPDATE "core"."searchFieldMetadata" "searchFieldMetadata"
       SET "tsVectorFieldMetadataId" = "fieldMetadata"."id"
       FROM "core"."fieldMetadata" "fieldMetadata"
       WHERE "fieldMetadata"."objectMetadataId" = "searchFieldMetadata"."objectMetadataId"
       AND "fieldMetadata"."type" = 'TS_VECTOR'
       AND "fieldMetadata"."name" = 'searchVector'
       AND "searchFieldMetadata"."tsVectorFieldMetadataId" IS NULL`);
        const deletedRows = await dataSource.query(`WITH "deleted" AS (
         DELETE FROM "core"."searchFieldMetadata"
         WHERE "tsVectorFieldMetadataId" IS NULL
         RETURNING "id"
       )
       SELECT COUNT(*) AS "count" FROM "deleted"`);
        const deletedCount = Number(deletedRows[0]?.count ?? 0);
        if (deletedCount > 0) {
            this.logger.warn(`Deleted ${deletedCount} orphaned searchFieldMetadata row(s) referencing an object without a searchVector (TS_VECTOR) field`);
        }
    }
    async up(queryRunner) {
        await queryRunner.query('ALTER TABLE "core"."searchFieldMetadata" ALTER COLUMN "tsVectorFieldMetadataId" SET NOT NULL');
    }
    async down(queryRunner) {
        await queryRunner.query('ALTER TABLE "core"."searchFieldMetadata" ALTER COLUMN "tsVectorFieldMetadataId" DROP NOT NULL');
    }
    constructor(){
        this.logger = new _common.Logger(BackfillTsVectorFieldMetadataIdOnSearchFieldMetadataSlowInstanceCommand.name);
    }
};
BackfillTsVectorFieldMetadataIdOnSearchFieldMetadataSlowInstanceCommand = _ts_decorate([
    (0, _registeredinstancecommanddecorator.RegisteredInstanceCommand)('2.18.0', 1810000003000, {
        type: 'slow'
    })
], BackfillTsVectorFieldMetadataIdOnSearchFieldMetadataSlowInstanceCommand);

//# sourceMappingURL=2-18-instance-command-slow-1810000003000-backfill-ts-vector-field-metadata-id-on-search-field-metadata.js.map