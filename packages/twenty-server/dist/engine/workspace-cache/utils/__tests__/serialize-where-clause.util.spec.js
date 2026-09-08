"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _typeorm = require("typeorm");
const _serializewhereclauseutil = require("../serialize-where-clause.util");
describe('serializeWhereClause', ()=>{
    it('serializes structurally equal clauses to the same key whatever the instances and key order', ()=>{
        expect((0, _serializewhereclauseutil.serializeWhereClause)({
            agentId: (0, _typeorm.Not)((0, _typeorm.IsNull)()),
            isVisible: true
        })).toBe((0, _serializewhereclauseutil.serializeWhereClause)({
            isVisible: true,
            agentId: (0, _typeorm.Not)((0, _typeorm.IsNull)())
        }));
    });
    it('distinguishes different operators on the same column', ()=>{
        expect((0, _serializewhereclauseutil.serializeWhereClause)({
            agentId: (0, _typeorm.Not)((0, _typeorm.IsNull)())
        })).not.toBe((0, _serializewhereclauseutil.serializeWhereClause)({
            agentId: (0, _typeorm.IsNull)()
        }));
        expect((0, _serializewhereclauseutil.serializeWhereClause)({
            name: (0, _typeorm.Equal)('a')
        })).not.toBe((0, _serializewhereclauseutil.serializeWhereClause)({
            name: (0, _typeorm.ILike)('a')
        }));
    });
    it('distinguishes plain values from their string representations', ()=>{
        expect((0, _serializewhereclauseutil.serializeWhereClause)({
            position: 1
        })).not.toBe((0, _serializewhereclauseutil.serializeWhereClause)({
            position: '1'
        }));
        expect((0, _serializewhereclauseutil.serializeWhereClause)({
            isVisible: true
        })).not.toBe((0, _serializewhereclauseutil.serializeWhereClause)({
            isVisible: 'true'
        }));
    });
    it('serializes operator values, keeping array order significant', ()=>{
        expect((0, _serializewhereclauseutil.serializeWhereClause)({
            id: (0, _typeorm.In)([
                'a',
                'b'
            ])
        })).toBe((0, _serializewhereclauseutil.serializeWhereClause)({
            id: (0, _typeorm.In)([
                'a',
                'b'
            ])
        }));
        expect((0, _serializewhereclauseutil.serializeWhereClause)({
            id: (0, _typeorm.In)([
                'a',
                'b'
            ])
        })).not.toBe((0, _serializewhereclauseutil.serializeWhereClause)({
            id: (0, _typeorm.In)([
                'b',
                'a'
            ])
        }));
    });
    it('serializes nested relation clauses with sorted keys', ()=>{
        expect((0, _serializewhereclauseutil.serializeWhereClause)({
            view: {
                objectMetadataId: 'x',
                deletedAt: (0, _typeorm.IsNull)()
            }
        })).toBe((0, _serializewhereclauseutil.serializeWhereClause)({
            view: {
                deletedAt: (0, _typeorm.IsNull)(),
                objectMetadataId: 'x'
            }
        }));
    });
    it('serializes dates by their ISO timestamp', ()=>{
        const timestamp = '2026-01-01T00:00:00.000Z';
        expect((0, _serializewhereclauseutil.serializeWhereClause)({
            createdAt: new Date(timestamp)
        })).toBe((0, _serializewhereclauseutil.serializeWhereClause)({
            createdAt: new Date(timestamp)
        }));
        expect((0, _serializewhereclauseutil.serializeWhereClause)({
            createdAt: new Date(timestamp)
        })).toContain(timestamp);
    });
    it('distinguishes null from undefined values', ()=>{
        expect((0, _serializewhereclauseutil.serializeWhereClause)({
            deletedAt: null
        })).not.toBe((0, _serializewhereclauseutil.serializeWhereClause)({
            deletedAt: undefined
        }));
    });
    it('serializes clauses into readable fetch key fragments', ()=>{
        expect((0, _serializewhereclauseutil.serializeWhereClause)({
            agentId: (0, _typeorm.Not)((0, _typeorm.IsNull)())
        })).toMatchInlineSnapshot(`"{agentId:op(not:op(isNull:undefined))}"`);
        expect((0, _serializewhereclauseutil.serializeWhereClause)({
            position: 1,
            name: 'a',
            isVisible: true
        })).toMatchInlineSnapshot(`"{isVisible:true,name:"a",position:1}"`);
        expect((0, _serializewhereclauseutil.serializeWhereClause)({
            id: (0, _typeorm.In)([
                'a',
                'b'
            ])
        })).toMatchInlineSnapshot(`"{id:op(in:["a","b"])}"`);
        expect((0, _serializewhereclauseutil.serializeWhereClause)({
            createdAt: new Date('2026-01-01T00:00:00.000Z')
        })).toMatchInlineSnapshot(`"{createdAt:date(2026-01-01T00:00:00.000Z)}"`);
        expect((0, _serializewhereclauseutil.serializeWhereClause)({
            view: {
                deletedAt: (0, _typeorm.IsNull)(),
                objectMetadataId: 'x'
            }
        })).toMatchInlineSnapshot(`"{view:{deletedAt:op(isNull:undefined),objectMetadataId:"x"}}"`);
    });
    it('throws on function-bearing predicates', ()=>{
        expect(()=>(0, _serializewhereclauseutil.serializeWhereClause)({
                id: (0, _typeorm.Raw)((alias)=>`${alias} > 0`)
            })).toThrow(/Raw\(\) and computed predicates are not supported/);
    });
});

//# sourceMappingURL=serialize-where-clause.util.spec.js.map