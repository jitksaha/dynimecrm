"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _types = require("twenty-shared/types");
const _typeorm = require("typeorm");
const _relationtypeinterface = require("../../../../metadata-modules/field-metadata/interfaces/relation-type.interface");
const _applyfindoptionsutil = require("../apply-find-options.util");
const _workspaceselectquerybuilder = require("../../workspace-select-query-builder");
const SCHEMA_NAME = 'workspace_test';
const buildColumn = (columnName)=>({
        columnName,
        fieldMetadataId: `field-${columnName}`,
        fieldName: columnName,
        fieldMetadataType: _types.FieldMetadataType.TEXT
    });
const personTableShape = {
    objectMetadataId: 'person-object-id',
    nameSingular: 'person',
    schemaName: SCHEMA_NAME,
    tableName: 'person',
    columnShapeByColumnName: {
        id: buildColumn('id'),
        name: buildColumn('name'),
        companyId: buildColumn('companyId'),
        deletedAt: buildColumn('deletedAt')
    },
    columnNames: [
        'id',
        'name',
        'companyId',
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
describe('applyFindOptionsToQueryBuilder', ()=>{
    it('returns the query builder unchanged when no options are given', ()=>{
        const queryBuilder = buildQueryBuilder();
        expect((0, _applyfindoptionsutil.applyFindOptionsToQueryBuilder)(queryBuilder)).toBe(queryBuilder);
        expect(queryBuilder.getQuery()).toContain(`FROM "${SCHEMA_NAME}"."person" AS "person" WHERE "person"."deletedAt" IS NULL`);
    });
    it('applies an equality where as an AND condition', ()=>{
        const queryBuilder = (0, _applyfindoptionsutil.applyFindOptionsToQueryBuilder)(buildQueryBuilder(), {
            where: {
                name: 'Twenty'
            }
        });
        const [text, values] = queryBuilder.getQueryAndParameters();
        expect(text).toContain('"person"."name" = $1');
        expect(text).toContain('"person"."deletedAt" IS NULL');
        expect(values).toContain('Twenty');
    });
    it('applies an In operator as an IN clause', ()=>{
        const queryBuilder = (0, _applyfindoptionsutil.applyFindOptionsToQueryBuilder)(buildQueryBuilder(), {
            where: {
                id: (0, _typeorm.In)([
                    'a',
                    'b'
                ])
            }
        });
        const [text, values] = queryBuilder.getQueryAndParameters();
        expect(text).toContain('"person"."id" IN ($1, $2)');
        expect(values).toEqual(expect.arrayContaining([
            'a',
            'b'
        ]));
    });
    it('renders a null where value as IS NULL', ()=>{
        const queryBuilder = (0, _applyfindoptionsutil.applyFindOptionsToQueryBuilder)(buildQueryBuilder(), {
            where: {
                companyId: null
            }
        });
        expect(queryBuilder.getQuery()).toContain('"person"."companyId" IS NULL');
    });
    it('treats a where array as a bracketed OR so an ANDed predicate covers all branches', ()=>{
        const queryBuilder = (0, _applyfindoptionsutil.applyFindOptionsToQueryBuilder)(buildQueryBuilder(), {
            where: [
                {
                    name: 'A'
                },
                {
                    name: 'B'
                }
            ]
        });
        const [text] = queryBuilder.getQueryAndParameters();
        expect(text).toContain('((("person"."name" = $1) OR ("person"."name" = $2))) AND "person"."deletedAt" IS NULL');
    });
    it('normalizes an array select into the builder column map', ()=>{
        const queryBuilder = (0, _applyfindoptionsutil.applyFindOptionsToQueryBuilder)(buildQueryBuilder(), {
            select: [
                'id',
                'name'
            ]
        });
        expect(queryBuilder.getQuery()).toContain('SELECT "person"."id" AS "person_id", "person"."name" AS "person_name"');
    });
    it('applies select, order, take and skip', ()=>{
        const queryBuilder = (0, _applyfindoptionsutil.applyFindOptionsToQueryBuilder)(buildQueryBuilder(), {
            select: {
                id: true,
                name: true
            },
            order: {
                name: 'DESC'
            },
            take: 10,
            skip: 5
        });
        const [text, values] = queryBuilder.getQueryAndParameters();
        expect(text).toContain('SELECT "person"."id" AS "person_id", "person"."name" AS "person_name"');
        expect(text).toContain('ORDER BY "person"."name" DESC');
        expect(text).toContain('LIMIT $');
        expect(text).toContain('OFFSET $');
        expect(values).toEqual(expect.arrayContaining([
            10,
            5
        ]));
    });
    it('drops the soft-delete predicate when withDeleted is set', ()=>{
        const queryBuilder = (0, _applyfindoptionsutil.applyFindOptionsToQueryBuilder)(buildQueryBuilder(), {
            withDeleted: true
        });
        expect(queryBuilder.getQuery()).not.toContain('"person"."deletedAt" IS NULL');
    });
    it('ignores relations in the base query (the repository loads them separately)', ()=>{
        const queryBuilder = (0, _applyfindoptionsutil.applyFindOptionsToQueryBuilder)(buildQueryBuilder(), {
            where: {
                id: 'x'
            },
            relations: {
                company: true
            }
        });
        expect(queryBuilder.getQuery()).not.toContain('JOIN');
        expect(queryBuilder.getQuery()).toContain('"person"."id" =');
    });
});
const messageShape = {
    objectMetadataId: 'message-object-id',
    nameSingular: 'message',
    schemaName: SCHEMA_NAME,
    tableName: 'message',
    columnShapeByColumnName: {
        id: buildColumn('id'),
        threadId: buildColumn('threadId'),
        receivedAt: buildColumn('receivedAt'),
        deletedAt: buildColumn('deletedAt')
    },
    columnNames: [
        'id',
        'threadId',
        'receivedAt',
        'deletedAt'
    ],
    relationShapeByFieldName: {
        thread: {
            fieldName: 'thread',
            fieldMetadataId: 'field-message-thread',
            relationType: _relationtypeinterface.RelationType.MANY_TO_ONE,
            targetObjectMetadataId: 'thread-object-id',
            targetFieldMetadataId: 'field-thread-messages',
            joinColumnName: 'threadId'
        }
    },
    hasDeletedAtColumn: true
};
const threadShape = {
    objectMetadataId: 'thread-object-id',
    nameSingular: 'thread',
    schemaName: SCHEMA_NAME,
    tableName: 'thread',
    columnShapeByColumnName: {
        id: buildColumn('id'),
        subject: buildColumn('subject'),
        deletedAt: buildColumn('deletedAt')
    },
    columnNames: [
        'id',
        'subject',
        'deletedAt'
    ],
    relationShapeByFieldName: {
        messages: {
            fieldName: 'messages',
            fieldMetadataId: 'field-thread-messages',
            relationType: _relationtypeinterface.RelationType.ONE_TO_MANY,
            targetObjectMetadataId: 'message-object-id',
            targetFieldMetadataId: 'field-message-thread'
        }
    },
    hasDeletedAtColumn: true
};
const buildThreadQueryBuilder = ()=>new _workspaceselectquerybuilder.WorkspaceSelectQueryBuilder('thread', {
        tableShape: threadShape,
        executor: {
            execute: async ()=>[]
        },
        objectRecordsPermissions: {},
        tableShapeByObjectMetadataId: ()=>messageShape,
        onBeforeExecute: ()=>undefined,
        formatResult: (records)=>records
    });
describe('applyFindOptionsToQueryBuilder relation order', ()=>{
    it('orders parents through a deduped to-many join whose representative follows the order', ()=>{
        const queryBuilder = (0, _applyfindoptionsutil.applyFindOptionsToQueryBuilder)(buildThreadQueryBuilder(), {
            order: {
                messages: {
                    receivedAt: 'DESC'
                }
            }
        });
        const sql = queryBuilder.getQuery();
        expect(sql).toContain(`LEFT JOIN (SELECT DISTINCT ON ("threadId") * ` + `FROM "${SCHEMA_NAME}"."message" ` + `WHERE "deletedAt" IS NULL ` + `ORDER BY "threadId", "receivedAt" DESC, "id") AS "messages" ` + 'ON ("messages"."threadId" = "thread"."id")');
        expect(sql).toContain('ORDER BY "messages"."receivedAt" DESC');
    });
    it('keeps mixed column and relation order entries in their original sequence', ()=>{
        const queryBuilder = (0, _applyfindoptionsutil.applyFindOptionsToQueryBuilder)(buildThreadQueryBuilder(), {
            order: {
                messages: {
                    receivedAt: {
                        order: 'DESC',
                        nulls: 'NULLS LAST'
                    }
                },
                subject: 'ASC'
            }
        });
        expect(queryBuilder.getQuery()).toContain('ORDER BY "messages"."receivedAt" DESC NULLS LAST, "thread"."subject" ASC');
    });
});
describe('splitFindOptionsOrder', ()=>{
    it('splits relation order entries from column order entries', ()=>{
        const { columnOrder, orderByRelationFieldName } = (0, _applyfindoptionsutil.splitFindOptionsOrder)(threadShape, {
            subject: 'ASC',
            messages: {
                receivedAt: 'DESC'
            }
        });
        expect(columnOrder).toEqual({
            subject: 'ASC'
        });
        expect(orderByRelationFieldName).toEqual({
            messages: {
                receivedAt: 'DESC'
            }
        });
    });
});
describe('normalizeFindOptionsRelations', ()=>{
    it('keeps an object form untouched', ()=>{
        expect((0, _applyfindoptionsutil.normalizeFindOptionsRelations)({
            messages: true
        })).toEqual({
            messages: true
        });
    });
    it('normalises an array of dotted relation paths into nested objects', ()=>{
        expect((0, _applyfindoptionsutil.normalizeFindOptionsRelations)([
            'messages',
            'messages.messageParticipants'
        ])).toEqual({
            messages: {
                messageParticipants: {}
            }
        });
    });
});

//# sourceMappingURL=apply-find-options.util.spec.js.map