"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "WorkspaceMutationQueryBuilder", {
    enumerable: true,
    get: function() {
        return WorkspaceMutationQueryBuilder;
    }
});
const _utils = require("twenty-shared/utils");
const _twentyormexception = require("../exceptions/twenty-orm.exception");
const _buildselectstatementutil = require("../sql/utils/build-select-statement.util");
const _compilenamedparametersutil = require("../sql/utils/compile-named-parameters.util");
const _serializejsonbwritevalueutil = require("../sql/utils/serialize-jsonb-write-value.util");
const _buildmutationstatementutil = require("../sql/utils/build-mutation-statement.util");
let mutationSetParameterSequence = 0;
const UPDATED_AT_COLUMN_NAME = 'updatedAt';
const DELETED_AT_COLUMN_NAME = 'deletedAt';
let WorkspaceMutationQueryBuilder = class WorkspaceMutationQueryBuilder {
    set(record) {
        this.setRecord = record;
        return this;
    }
    returning(columns) {
        this.returningColumns = columns;
        return this;
    }
    getQueryAndParameters() {
        const { sql, parameters } = this.buildStatement();
        const compiled = (0, _compilenamedparametersutil.compileNamedParameters)(sql, parameters);
        return [
            compiled.text,
            compiled.values
        ];
    }
    getQuery() {
        return this.buildStatement().sql;
    }
    async execute() {
        const { sql, parameters } = this.buildStatement();
        const compiled = (0, _compilenamedparametersutil.compileNamedParameters)(sql, parameters);
        const rows = await this.context.executor.execute(compiled);
        const columnNameByResultAlias = (0, _buildselectstatementutil.buildColumnNameByResultAlias)(this.alias, this.returningColumns);
        const entities = rows.map((row)=>(0, _buildselectstatementutil.mapRowToEntity)(row, columnNameByResultAlias));
        return {
            generatedMaps: this.context.formatResult(entities)
        };
    }
    buildStatement() {
        const parameters = {
            ...this.parameters
        };
        const setClauses = this.buildSetClauses(parameters);
        const sql = (0, _buildmutationstatementutil.buildMutationStatement)({
            alias: this.alias,
            tableShape: this.tableShape,
            kind: this.kind,
            setClauses,
            whereClauses: this.whereClauses,
            returningColumns: this.returningColumns
        });
        return {
            sql,
            parameters
        };
    }
    buildSetClauses(parameters) {
        if (this.kind === 'delete') {
            return [];
        }
        if (this.kind === 'soft-delete') {
            this.assertDeletedAtColumnExists();
            return this.withUpdatedAtMaintenance([
                {
                    columnName: DELETED_AT_COLUMN_NAME,
                    valueExpression: 'CURRENT_TIMESTAMP'
                }
            ]);
        }
        if (this.kind === 'restore') {
            this.assertDeletedAtColumnExists();
            return this.withUpdatedAtMaintenance([
                {
                    columnName: DELETED_AT_COLUMN_NAME,
                    valueExpression: 'NULL'
                }
            ]);
        }
        const setClauses = [];
        for (const [columnName, value] of Object.entries(this.setRecord)){
            this.assertColumnExists(columnName);
            if (typeof value === 'function') {
                throw new _twentyormexception.TwentyOrmException(`Function-valued updates are not supported on "${columnName}"`, _twentyormexception.TwentyOrmExceptionCode.UNSUPPORTED_OPERATION);
            }
            let parameterName = `ormSet_${mutationSetParameterSequence++}`;
            while(parameterName in parameters){
                parameterName = `ormSet_${mutationSetParameterSequence++}`;
            }
            parameters[parameterName] = (0, _serializejsonbwritevalueutil.serializeJsonbWriteValue)(this.tableShape.columnShapeByColumnName[columnName], value);
            setClauses.push({
                columnName,
                valueExpression: `:${parameterName}`
            });
        }
        const callerSetUpdatedAt = Object.prototype.hasOwnProperty.call(this.setRecord, UPDATED_AT_COLUMN_NAME);
        return callerSetUpdatedAt ? setClauses : this.withUpdatedAtMaintenance(setClauses);
    }
    withUpdatedAtMaintenance(setClauses) {
        if (!(0, _utils.isDefined)(this.tableShape.columnShapeByColumnName[UPDATED_AT_COLUMN_NAME])) {
            return setClauses;
        }
        return [
            ...setClauses,
            {
                columnName: UPDATED_AT_COLUMN_NAME,
                valueExpression: 'CURRENT_TIMESTAMP'
            }
        ];
    }
    assertDeletedAtColumnExists() {
        if (!this.tableShape.hasDeletedAtColumn) {
            throw new _twentyormexception.TwentyOrmException(`"${this.tableShape.nameSingular}" has no "${DELETED_AT_COLUMN_NAME}" column, so it cannot be soft-deleted or restored`, _twentyormexception.TwentyOrmExceptionCode.UNSUPPORTED_OPERATION);
        }
    }
    assertColumnExists(columnName) {
        if (!(0, _utils.isDefined)(this.tableShape.columnShapeByColumnName[columnName])) {
            throw new _twentyormexception.TwentyOrmException(`Column "${columnName}" does not exist on "${this.tableShape.nameSingular}"`, _twentyormexception.TwentyOrmExceptionCode.UNKNOWN_COLUMN);
        }
    }
    constructor({ alias, kind, context, whereClauses, parameters }){
        this.setRecord = {};
        this.returningColumns = [];
        this.alias = alias;
        this.kind = kind;
        this.context = context;
        this.tableShape = context.tableShape;
        this.whereClauses = [
            ...whereClauses
        ];
        this.parameters = {
            ...parameters
        };
    }
};

//# sourceMappingURL=workspace-mutation-query-builder.js.map