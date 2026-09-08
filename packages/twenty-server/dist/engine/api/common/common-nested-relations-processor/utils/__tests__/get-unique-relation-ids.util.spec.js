"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _getuniquerelationidsutil = require("../get-unique-relation-ids.util");
const buildRecords = (targetCompanyIds)=>targetCompanyIds.map((targetCompanyId, index)=>({
            id: `record-${index}`,
            targetCompanyId
        }));
describe('getUniqueRelationIds', ()=>{
    it('should drop nullish join column values', ()=>{
        const relationIds = (0, _getuniquerelationidsutil.getUniqueRelationIds)({
            records: buildRecords([
                'company-1',
                null,
                undefined,
                'company-2'
            ]),
            idField: 'targetCompanyId'
        });
        expect(relationIds).toEqual([
            'company-1',
            'company-2'
        ]);
    });
    it('should return no id when the join column is unset on every record', ()=>{
        const relationIds = (0, _getuniquerelationidsutil.getUniqueRelationIds)({
            records: buildRecords([
                null,
                null,
                null
            ]),
            idField: 'targetCompanyId'
        });
        expect(relationIds).toEqual([]);
    });
    it('should deduplicate repeated ids', ()=>{
        const relationIds = (0, _getuniquerelationidsutil.getUniqueRelationIds)({
            records: buildRecords([
                'company-1',
                'company-1',
                'company-2'
            ]),
            idField: 'targetCompanyId'
        });
        expect(relationIds).toEqual([
            'company-1',
            'company-2'
        ]);
    });
    it('should return no id for an empty record list', ()=>{
        expect((0, _getuniquerelationidsutil.getUniqueRelationIds)({
            records: [],
            idField: 'targetCompanyId'
        })).toEqual([]);
    });
});

//# sourceMappingURL=get-unique-relation-ids.util.spec.js.map