"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
}
_export(exports, {
    get SCHEMA_NAME () {
        return SCHEMA_NAME;
    },
    get buildColumn () {
        return buildColumn;
    },
    get buildQueryBuilder () {
        return buildQueryBuilder;
    },
    get companyTableShape () {
        return companyTableShape;
    },
    get personTableShape () {
        return personTableShape;
    }
});
const _types = require("twenty-shared/types");
const _relationtypeinterface = require("../../../metadata-modules/field-metadata/interfaces/relation-type.interface");
const _workspaceselectquerybuilder = require("../workspace-select-query-builder");
const SCHEMA_NAME = 'workspace_1wgvd1injqtife6y4rvfbu3h5';
const buildColumn = (columnName, compositeParentFieldName)=>({
        columnName,
        fieldMetadataId: `field-${columnName}`,
        fieldName: compositeParentFieldName ?? columnName,
        fieldMetadataType: _types.FieldMetadataType.TEXT,
        ...compositeParentFieldName !== undefined ? {
            compositeParentFieldName
        } : {}
    });
const companyTableShape = {
    objectMetadataId: 'company-object-id',
    nameSingular: 'company',
    schemaName: SCHEMA_NAME,
    tableName: 'company',
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
    relationShapeByFieldName: {
        person: {
            fieldName: 'person',
            fieldMetadataId: 'field-company',
            relationType: _relationtypeinterface.RelationType.MANY_TO_ONE,
            targetObjectMetadataId: 'person-object-id',
            targetFieldMetadataId: 'field-people',
            joinColumnName: 'personId'
        }
    },
    hasDeletedAtColumn: true
};
const personTableShape = {
    objectMetadataId: 'person-object-id',
    nameSingular: 'person',
    schemaName: SCHEMA_NAME,
    tableName: 'person',
    columnShapeByColumnName: {
        id: buildColumn('id'),
        nameFirstName: buildColumn('nameFirstName', 'name'),
        nameLastName: buildColumn('nameLastName', 'name'),
        companyId: buildColumn('companyId'),
        deletedAt: buildColumn('deletedAt')
    },
    columnNames: [
        'id',
        'nameFirstName',
        'nameLastName',
        'companyId',
        'deletedAt'
    ],
    relationShapeByFieldName: {
        company: {
            fieldName: 'company',
            fieldMetadataId: 'field-company',
            relationType: _relationtypeinterface.RelationType.MANY_TO_ONE,
            targetObjectMetadataId: 'company-object-id',
            targetFieldMetadataId: 'field-people',
            joinColumnName: 'companyId'
        },
        people: {
            fieldName: 'people',
            fieldMetadataId: 'field-people',
            relationType: _relationtypeinterface.RelationType.ONE_TO_MANY,
            targetObjectMetadataId: 'company-object-id',
            targetFieldMetadataId: 'field-company'
        }
    },
    hasDeletedAtColumn: true
};
const buildQueryBuilder = ({ rows = [], tableShape = personTableShape } = {})=>{
    const executedStatements = [];
    const queryBuilder = new _workspaceselectquerybuilder.WorkspaceSelectQueryBuilder('person', {
        tableShape,
        executor: {
            execute: async (statement)=>{
                executedStatements.push(statement);
                return rows;
            }
        },
        objectRecordsPermissions: {},
        tableShapeByObjectMetadataId: ()=>companyTableShape,
        onBeforeExecute: ()=>undefined,
        formatResult: (records)=>records
    });
    return {
        queryBuilder,
        executedStatements
    };
};

//# sourceMappingURL=workspace-select-query-builder-test-shapes.util.js.map