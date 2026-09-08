"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _attachrelationsutil = require("../attach-relations.util");
const asRecords = (records)=>records;
describe('attach-relations util', ()=>{
    describe('collectForeignKeys', ()=>{
        it('returns unique non-empty foreign keys', ()=>{
            const records = asRecords([
                {
                    id: '1',
                    companyId: 'c1'
                },
                {
                    id: '2',
                    companyId: 'c1'
                },
                {
                    id: '3',
                    companyId: 'c2'
                },
                {
                    id: '4',
                    companyId: null
                }
            ]);
            expect((0, _attachrelationsutil.collectForeignKeys)(records, 'companyId')).toEqual([
                'c1',
                'c2'
            ]);
        });
    });
    describe('collectRecordIds', ()=>{
        it('returns unique ids', ()=>{
            const records = asRecords([
                {
                    id: 'a'
                },
                {
                    id: 'a'
                },
                {
                    id: 'b'
                }
            ]);
            expect((0, _attachrelationsutil.collectRecordIds)(records)).toEqual([
                'a',
                'b'
            ]);
        });
    });
    describe('attachToOneRelationToRecords', ()=>{
        it('attaches the matching target or null', ()=>{
            const records = asRecords([
                {
                    id: '1',
                    companyId: 'c1'
                },
                {
                    id: '2',
                    companyId: 'c2'
                },
                {
                    id: '3',
                    companyId: null
                }
            ]);
            const targets = asRecords([
                {
                    id: 'c1',
                    name: 'Twenty'
                }
            ]);
            (0, _attachrelationsutil.attachToOneRelationToRecords)({
                records,
                fieldName: 'company',
                joinColumnName: 'companyId',
                targets
            });
            expect(records[0].company).toEqual({
                id: 'c1',
                name: 'Twenty'
            });
            expect(records[1].company).toBeNull();
            expect(records[2].company).toBeNull();
        });
    });
    describe('attachToManyRelationToRecords', ()=>{
        it('groups children under each parent and defaults to an empty array', ()=>{
            const records = asRecords([
                {
                    id: 'c1'
                },
                {
                    id: 'c2'
                }
            ]);
            const children = asRecords([
                {
                    id: 'p1',
                    companyId: 'c1'
                },
                {
                    id: 'p2',
                    companyId: 'c1'
                },
                {
                    id: 'p3',
                    companyId: 'cX'
                }
            ]);
            (0, _attachrelationsutil.attachToManyRelationToRecords)({
                records,
                fieldName: 'people',
                inverseForeignKeyColumnName: 'companyId',
                children
            });
            expect(records[0].people).toEqual([
                {
                    id: 'p1',
                    companyId: 'c1'
                },
                {
                    id: 'p2',
                    companyId: 'c1'
                }
            ]);
            expect(records[1].people).toEqual([]);
        });
    });
});

//# sourceMappingURL=attach-relations.util.spec.js.map