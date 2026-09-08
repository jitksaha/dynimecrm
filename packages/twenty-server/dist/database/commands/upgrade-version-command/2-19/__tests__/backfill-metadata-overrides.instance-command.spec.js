"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _219instancecommandslow1782986476000backfillmetadataoverrides = require("../2-19-instance-command-slow-1782986476000-backfill-metadata-overrides");
describe('BackfillMetadataOverridesSlowInstanceCommand', ()=>{
    let command;
    beforeEach(()=>{
        command = new _219instancecommandslow1782986476000backfillmetadataoverrides.BackfillMetadataOverridesSlowInstanceCommand();
    });
    describe('runDataMigration', ()=>{
        it('copies standardOverrides into overrides for both tables', async ()=>{
            const query = jest.fn().mockResolvedValue([
                {
                    count: 3
                }
            ]);
            const dataSource = {
                query
            };
            await command.runDataMigration(dataSource);
            const statements = query.mock.calls.map((call)=>call[0]);
            for (const table of [
                'objectMetadata',
                'fieldMetadata'
            ]){
                expect(statements).toEqual(expect.arrayContaining([
                    expect.stringContaining(`UPDATE "core"."${table}" SET "overrides" = "standardOverrides"`)
                ]));
            }
        });
        it('aborts when the isActive row count changes', async ()=>{
            const query = jest.fn().mockResolvedValueOnce([
                {
                    count: 5
                }
            ]) // objectMetadata before
            .mockResolvedValueOnce(undefined) // UPDATE backfill
            .mockResolvedValueOnce([
                {
                    count: 4
                }
            ]); // objectMetadata after
            const dataSource = {
                query
            };
            await expect(command.runDataMigration(dataSource)).rejects.toThrow(/"isActive" changed on "core"\."objectMetadata"/);
        });
    });
});

//# sourceMappingURL=backfill-metadata-overrides.instance-command.spec.js.map