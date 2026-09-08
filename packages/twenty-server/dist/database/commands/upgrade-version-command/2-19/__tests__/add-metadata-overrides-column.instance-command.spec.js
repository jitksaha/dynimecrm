"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _219instancecommandfast1782986475000addmetadataoverridescolumn = require("../2-19-instance-command-fast-1782986475000-add-metadata-overrides-column");
describe('AddMetadataOverridesColumnFastInstanceCommand', ()=>{
    let command;
    beforeEach(()=>{
        command = new _219instancecommandfast1782986475000addmetadataoverridescolumn.AddMetadataOverridesColumnFastInstanceCommand();
    });
    describe('up', ()=>{
        it('adds the overrides column to both tables without mutating data or dropping standardOverrides', async ()=>{
            const query = jest.fn().mockResolvedValue(undefined);
            const queryRunner = {
                query
            };
            await command.up(queryRunner);
            const statements = query.mock.calls.map((call)=>call[0]);
            expect(statements).toEqual([
                'ALTER TABLE "core"."objectMetadata" ADD COLUMN IF NOT EXISTS "overrides" jsonb',
                'ALTER TABLE "core"."fieldMetadata" ADD COLUMN IF NOT EXISTS "overrides" jsonb'
            ]);
            expect(statements.some((statement)=>statement.includes('UPDATE') || statement.includes('DROP COLUMN'))).toBe(false);
        });
    });
    describe('down', ()=>{
        it('copies overrides back into standardOverrides before dropping the column', async ()=>{
            const query = jest.fn().mockResolvedValue(undefined);
            const queryRunner = {
                query
            };
            await command.down(queryRunner);
            const statements = query.mock.calls.map((call)=>call[0]);
            expect(statements).toEqual([
                'UPDATE "core"."objectMetadata" SET "standardOverrides" = "overrides"',
                'ALTER TABLE "core"."objectMetadata" DROP COLUMN IF EXISTS "overrides"',
                'UPDATE "core"."fieldMetadata" SET "standardOverrides" = "overrides"',
                'ALTER TABLE "core"."fieldMetadata" DROP COLUMN IF EXISTS "overrides"'
            ]);
        });
    });
});

//# sourceMappingURL=add-metadata-overrides-column.instance-command.spec.js.map