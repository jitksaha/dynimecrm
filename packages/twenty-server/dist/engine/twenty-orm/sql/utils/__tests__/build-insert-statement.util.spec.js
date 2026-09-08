"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _types = require("twenty-shared/types");
const _twentyormexception = require("../../../exceptions/twenty-orm.exception");
const _buildinsertstatementutil = require("../build-insert-statement.util");
const SCHEMA_NAME = 'workspace_1wgvd1injqtife6y4rvfbu3h5';
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
        nameFirstName: buildColumn('nameFirstName'),
        jobTitle: buildColumn('jobTitle')
    },
    columnNames: [
        'id',
        'nameFirstName',
        'jobTitle'
    ],
    relationShapeByFieldName: {},
    hasDeletedAtColumn: false
};
describe('buildInsertStatement', ()=>{
    it('should build a single-row insert with RETURNING', ()=>{
        expect((0, _buildinsertstatementutil.buildInsertStatement)({
            tableShape: personTableShape,
            columnNames: [
                'id',
                'jobTitle'
            ],
            rows: [
                [
                    {
                        kind: 'parameter',
                        parameterName: 'ormInsert_0'
                    },
                    {
                        kind: 'parameter',
                        parameterName: 'ormInsert_1'
                    }
                ]
            ],
            returningColumns: [
                'id',
                'jobTitle'
            ]
        })).toBe(`INSERT INTO "${SCHEMA_NAME}"."person" ("id", "jobTitle") ` + 'VALUES (:ormInsert_0, :ormInsert_1) ' + 'RETURNING "id", "jobTitle"');
    });
    it('should emit DEFAULT for columns a row omits', ()=>{
        expect((0, _buildinsertstatementutil.buildInsertStatement)({
            tableShape: personTableShape,
            columnNames: [
                'id',
                'jobTitle'
            ],
            rows: [
                [
                    {
                        kind: 'parameter',
                        parameterName: 'ormInsert_0'
                    },
                    {
                        kind: 'parameter',
                        parameterName: 'ormInsert_1'
                    }
                ],
                [
                    {
                        kind: 'parameter',
                        parameterName: 'ormInsert_2'
                    },
                    {
                        kind: 'default'
                    }
                ]
            ],
            returningColumns: [
                'id'
            ]
        })).toBe(`INSERT INTO "${SCHEMA_NAME}"."person" ("id", "jobTitle") ` + 'VALUES (:ormInsert_0, :ormInsert_1), (:ormInsert_2, DEFAULT) ' + 'RETURNING "id"');
    });
    it('should omit RETURNING when no columns are requested', ()=>{
        expect((0, _buildinsertstatementutil.buildInsertStatement)({
            tableShape: personTableShape,
            columnNames: [
                'id'
            ],
            rows: [
                [
                    {
                        kind: 'parameter',
                        parameterName: 'ormInsert_0'
                    }
                ]
            ],
            returningColumns: []
        })).toBe(`INSERT INTO "${SCHEMA_NAME}"."person" ("id") VALUES (:ormInsert_0)`);
    });
    it('should support conflict-safe inserts', ()=>{
        expect((0, _buildinsertstatementutil.buildInsertStatement)({
            tableShape: personTableShape,
            columnNames: [
                'id'
            ],
            rows: [
                [
                    {
                        kind: 'parameter',
                        parameterName: 'ormInsert_0'
                    }
                ]
            ],
            returningColumns: [
                'id'
            ],
            onConflictDoNothing: true
        })).toBe(`INSERT INTO "${SCHEMA_NAME}"."person" ("id") ` + 'VALUES (:ormInsert_0) ON CONFLICT DO NOTHING RETURNING "id"');
    });
    it('should reject an insert with no rows', ()=>{
        expect(()=>(0, _buildinsertstatementutil.buildInsertStatement)({
                tableShape: personTableShape,
                columnNames: [
                    'id'
                ],
                rows: [],
                returningColumns: [
                    'id'
                ]
            })).toThrow(_twentyormexception.TwentyOrmException);
    });
});

//# sourceMappingURL=build-insert-statement.util.spec.js.map