"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _220instancecommandfast1783511477234dropmetadatastandardoverridescolumn = require("../2-20-instance-command-fast-1783511477234-drop-metadata-standard-overrides-column");
const _dropmetadatastandardoverridescolumnupgradecommandnameconstant = require("../drop-metadata-standard-overrides-column-upgrade-command-name.constant");
const _registeredinstancecommanddecorator = require("../../../../../engine/core-modules/upgrade/decorators/registered-instance-command.decorator");
describe('DropMetadataStandardOverridesColumnFastInstanceCommand', ()=>{
    let command;
    beforeEach(()=>{
        command = new _220instancecommandfast1783511477234dropmetadatastandardoverridescolumn.DropMetadataStandardOverridesColumnFastInstanceCommand();
    });
    describe('registration', ()=>{
        it('is registered against 2.20.0 so it stays dormant until 2.20 is current', ()=>{
            const metadata = (0, _registeredinstancecommanddecorator.getRegisteredInstanceCommandMetadata)(_220instancecommandfast1783511477234dropmetadatastandardoverridescolumn.DropMetadataStandardOverridesColumnFastInstanceCommand);
            expect(metadata).toEqual({
                version: '2.20.0',
                timestamp: 1783511477234,
                type: 'fast'
            });
        });
        it('has a name constant matching its computed registered name', ()=>{
            const metadata = (0, _registeredinstancecommanddecorator.getRegisteredInstanceCommandMetadata)(_220instancecommandfast1783511477234dropmetadatastandardoverridescolumn.DropMetadataStandardOverridesColumnFastInstanceCommand);
            expect(`${metadata?.version}_${_220instancecommandfast1783511477234dropmetadatastandardoverridescolumn.DropMetadataStandardOverridesColumnFastInstanceCommand.name}_${metadata?.timestamp}`).toBe(_dropmetadatastandardoverridescolumnupgradecommandnameconstant.DROP_METADATA_STANDARD_OVERRIDES_COLUMN_UPGRADE_COMMAND_NAME);
        });
    });
    describe('up', ()=>{
        it('drops standardOverrides from both tables', async ()=>{
            const query = jest.fn().mockResolvedValue(undefined);
            const queryRunner = {
                query
            };
            await command.up(queryRunner);
            const statements = query.mock.calls.map((call)=>call[0]);
            expect(statements).toEqual([
                'ALTER TABLE "core"."objectMetadata" DROP COLUMN IF EXISTS "standardOverrides"',
                'ALTER TABLE "core"."fieldMetadata" DROP COLUMN IF EXISTS "standardOverrides"'
            ]);
        });
    });
    describe('down', ()=>{
        it('recreates and backfills standardOverrides from overrides', async ()=>{
            const query = jest.fn().mockResolvedValue(undefined);
            const queryRunner = {
                query
            };
            await command.down(queryRunner);
            const statements = query.mock.calls.map((call)=>call[0]);
            expect(statements).toEqual([
                'ALTER TABLE "core"."objectMetadata" ADD COLUMN IF NOT EXISTS "standardOverrides" jsonb',
                'UPDATE "core"."objectMetadata" SET "standardOverrides" = "overrides"',
                'ALTER TABLE "core"."fieldMetadata" ADD COLUMN IF NOT EXISTS "standardOverrides" jsonb',
                'UPDATE "core"."fieldMetadata" SET "standardOverrides" = "overrides"'
            ]);
        });
    });
});

//# sourceMappingURL=drop-metadata-standard-overrides-column.instance-command.spec.js.map