"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _types = require("twenty-shared/types");
const _twentyormexception = require("../../../exceptions/twenty-orm.exception");
const _applymutationcriteriautil = require("../apply-mutation-criteria.util");
const _workspaceselectquerybuilder = require("../../workspace-select-query-builder");
const buildColumn = (columnName)=>({
        columnName,
        fieldMetadataId: `field-${columnName}`,
        fieldName: columnName,
        fieldMetadataType: _types.FieldMetadataType.TEXT
    });
const personTableShape = {
    objectMetadataId: 'person-object-id',
    nameSingular: 'person',
    schemaName: 'workspace_test',
    tableName: 'person',
    columnShapeByColumnName: {
        id: buildColumn('id'),
        name: buildColumn('name'),
        deletedAt: buildColumn('deletedAt')
    },
    columnNames: [
        'id',
        'name',
        'deletedAt'
    ],
    relationShapeByFieldName: {},
    hasDeletedAtColumn: true
};
const buildQueryBuilder = ()=>new _workspaceselectquerybuilder.WorkspaceSelectQueryBuilder('person', {
        tableShape: personTableShape,
        executor: {
            execute: async ()=>[]
        },
        objectRecordsPermissions: {},
        tableShapeByObjectMetadataId: ()=>personTableShape,
        onBeforeExecute: ()=>undefined,
        formatResult: (records)=>records
    });
describe('applyMutationCriteriaToQueryBuilder', ()=>{
    it('turns a bare id into an equality predicate', ()=>{
        const [text, values] = (0, _applymutationcriteriautil.applyMutationCriteriaToQueryBuilder)(buildQueryBuilder(), 'record-id').getQueryAndParameters();
        expect(text).toContain('"person"."id" = $1');
        expect(values).toContain('record-id');
    });
    it('turns a list of ids into an IN predicate', ()=>{
        const [text, values] = (0, _applymutationcriteriautil.applyMutationCriteriaToQueryBuilder)(buildQueryBuilder(), [
            'a',
            'b'
        ]).getQueryAndParameters();
        expect(text).toContain('"person"."id" IN ($1, $2)');
        expect(values).toEqual(expect.arrayContaining([
            'a',
            'b'
        ]));
    });
    it('applies a where object', ()=>{
        const [text, values] = (0, _applymutationcriteriautil.applyMutationCriteriaToQueryBuilder)(buildQueryBuilder(), {
            name: 'Twenty'
        }).getQueryAndParameters();
        expect(text).toContain('"person"."name" = $1');
        expect(values).toContain('Twenty');
    });
    it('treats a where array as a bracketed OR', ()=>{
        const [text] = (0, _applymutationcriteriautil.applyMutationCriteriaToQueryBuilder)(buildQueryBuilder(), [
            {
                name: 'A'
            },
            {
                name: 'B'
            }
        ]).getQueryAndParameters();
        expect(text).toContain('((("person"."name" = $1) OR ("person"."name" = $2)))');
    });
    it('throws on an empty criteria array', ()=>{
        expect(()=>(0, _applymutationcriteriautil.applyMutationCriteriaToQueryBuilder)(buildQueryBuilder(), [])).toThrow(_twentyormexception.TwentyOrmException);
    });
    it('throws on an empty-string id criterion', ()=>{
        expect(()=>(0, _applymutationcriteriautil.applyMutationCriteriaToQueryBuilder)(buildQueryBuilder(), '')).toThrow(_twentyormexception.TwentyOrmException);
    });
});

//# sourceMappingURL=apply-mutation-criteria.util.spec.js.map