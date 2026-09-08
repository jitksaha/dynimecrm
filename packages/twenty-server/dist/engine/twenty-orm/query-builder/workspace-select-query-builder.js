"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "WorkspaceSelectQueryBuilder", {
    enumerable: true,
    get: function() {
        return WorkspaceSelectQueryBuilder;
    }
});
const _utils = require("twenty-shared/utils");
const _typeorm = require("typeorm");
const _relationtypeinterface = require("../../metadata-modules/field-metadata/interfaces/relation-type.interface");
const _twentyormexception = require("../exceptions/twenty-orm.exception");
const _querybuildertype = require("./types/query-builder.type");
const _workspacemutationquerybuilder = require("./workspace-mutation-query-builder");
const _buildorderbyclausesutil = require("../sql/utils/build-order-by-clauses.util");
const _collectreferencedcolumnnamesutil = require("../sql/utils/collect-referenced-column-names.util");
const _compilenamedparametersutil = require("../sql/utils/compile-named-parameters.util");
const _buildselectstatementutil = require("../sql/utils/build-select-statement.util");
const _removesqlinjectionutil = require("../../workspace-manager/workspace-migration/utils/remove-sql-injection.util");
let objectWhereParameterSequence = 0;
let existsFilterSequence = 0;
const isNestedWhereObject = (value)=>(0, _utils.isDefined)(value) && typeof value === 'object' && !Array.isArray(value) && !(value instanceof _typeorm.FindOperator) && !(value instanceof Date);
let WorkspaceSelectQueryBuilder = class WorkspaceSelectQueryBuilder {
    getJoinAliases() {
        return [
            ...this.joinClauses.map((joinClause)=>({
                    name: joinClause.alias,
                    isToMany: joinClause.relationType === _relationtypeinterface.RelationType.ONE_TO_MANY
                })),
            ...this.existsFilterClauses.map((existsFilterClause)=>({
                    name: existsFilterClause.alias,
                    isToMany: false
                }))
        ];
    }
    clone() {
        const cloned = new WorkspaceSelectQueryBuilder(this.alias, this.context);
        cloned.whereClauses.push(...this.whereClauses);
        cloned.existsFilterClauses.push(...this.existsFilterClauses.map((existsFilterClause)=>({
                ...existsFilterClause,
                additionalOnConditions: [
                    ...existsFilterClause.additionalOnConditions
                ]
            })));
        cloned.joinClauses.push(...this.joinClauses.map((joinClause)=>({
                ...joinClause,
                additionalOnConditions: [
                    ...joinClause.additionalOnConditions
                ]
            })));
        cloned.extraSelectClauses.push(...this.extraSelectClauses);
        cloned.pendingColumnSelections.push(...this.pendingColumnSelections);
        cloned.orderByClauses = [
            ...this.orderByClauses
        ];
        cloned.groupByExpressions = [
            ...this.groupByExpressions
        ];
        cloned.distinctOnExpressions = [
            ...this.distinctOnExpressions
        ];
        cloned.parameters = {
            ...this.parameters
        };
        cloned.findOptions = {
            ...this.findOptions
        };
        cloned.limitValue = this.limitValue;
        cloned.offsetValue = this.offsetValue;
        cloned.includeDeleted = this.includeDeleted;
        cloned.explicitSelection = this.explicitSelection === undefined ? undefined : [
            ...this.explicitSelection
        ];
        for (const alias of this.aliasesWithRowLevelPermissionApplied){
            cloned.aliasesWithRowLevelPermissionApplied.add(alias);
        }
        return cloned;
    }
    where(condition, parameters) {
        this.whereClauses.length = 0;
        this.aliasesWithRowLevelPermissionApplied.delete(this.alias);
        return this.appendWhere('and', condition, parameters);
    }
    copyWhereFrom(source) {
        this.whereClauses.push(...source.whereClauses);
        this.existsFilterClauses.push(...source.existsFilterClauses.map((existsFilterClause)=>({
                ...existsFilterClause,
                additionalOnConditions: [
                    ...existsFilterClause.additionalOnConditions
                ]
            })));
        this.parameters = {
            ...this.parameters,
            ...source.parameters
        };
        return this;
    }
    andWhere(condition, parameters) {
        return this.appendWhere('and', condition, parameters);
    }
    orWhere(condition, parameters) {
        return this.appendWhere('or', condition, parameters);
    }
    setParameters(parameters) {
        for (const parameterName of Object.keys(parameters)){
            if (_buildselectstatementutil.RESERVED_PARAMETER_NAMES.includes(parameterName)) {
                throw new _twentyormexception.TwentyOrmException(`Parameter name "${parameterName}" is reserved for pagination`, _twentyormexception.TwentyOrmExceptionCode.INVALID_PARAMETER);
            }
        }
        this.parameters = {
            ...this.parameters,
            ...parameters
        };
        return this;
    }
    setParameter(key, value) {
        return this.setParameters({
            [key]: value
        });
    }
    getParameters() {
        return {
            ...this.parameters
        };
    }
    setFindOptions(findOptions) {
        this.findOptions = findOptions;
        return this;
    }
    getFindOptions() {
        return this.findOptions;
    }
    select(selection, alias) {
        this.extraSelectClauses.length = 0;
        this.pendingColumnSelections.length = 0;
        if (selection === undefined) {
            this.explicitSelection = undefined;
            return this;
        }
        if (Array.isArray(selection)) {
            this.explicitSelection = selection;
            return this;
        }
        if (selection === this.alias && alias === undefined) {
            this.explicitSelection = [
                ...this.tableShape.columnNames
            ];
            return this;
        }
        this.explicitSelection = [];
        this.extraSelectClauses.push({
            expression: this.normaliseColumnExpression(selection),
            alias: alias ?? selection
        });
        return this;
    }
    addSelect(expression, alias) {
        if ((0, _utils.isDefined)(alias)) {
            this.extraSelectClauses.push({
                expression,
                alias
            });
            return this;
        }
        if (/^\w+\.\w+$/.test(expression)) {
            this.pendingColumnSelections.push(expression);
            return this;
        }
        this.extraSelectClauses.push({
            expression,
            alias: expression
        });
        return this;
    }
    orderBy(orderByOrExpression, direction = 'ASC', nulls) {
        this.orderByClauses = [];
        return this.appendOrderBy(orderByOrExpression, direction, nulls);
    }
    addOrderBy(orderByOrExpression, direction = 'ASC', nulls) {
        return this.appendOrderBy(orderByOrExpression, direction, nulls);
    }
    distinctOn(columns) {
        this.distinctOnExpressions = columns.map((column)=>this.normaliseColumnExpression(column));
        return this;
    }
    groupBy(expression) {
        this.groupByExpressions = [
            this.normaliseColumnExpression(expression)
        ];
        return this;
    }
    addGroupBy(expression) {
        this.groupByExpressions.push(this.normaliseColumnExpression(expression));
        return this;
    }
    leftJoin(relationPath, alias, condition, options) {
        return this.addJoin('LEFT', relationPath, alias, condition, options);
    }
    innerJoin(relationPath, alias, condition, options) {
        return this.addJoin('INNER', relationPath, alias, condition, options);
    }
    leftJoinAndSelect(relationPath, alias, condition) {
        return this.addJoin('LEFT', relationPath, alias, condition, {
            select: true
        });
    }
    innerJoinAndSelect(relationPath, alias, condition) {
        return this.addJoin('INNER', relationPath, alias, condition, {
            select: true
        });
    }
    addJoin(joinType, relationPath, alias, condition, options) {
        const [parentAlias, relationFieldName] = relationPath.split('.');
        if (!(0, _utils.isDefined)(relationFieldName)) {
            throw new _twentyormexception.TwentyOrmException(`Join path "${relationPath}" must be of the form "<alias>.<relationField>"`, _twentyormexception.TwentyOrmExceptionCode.UNKNOWN_RELATION);
        }
        if (alias === this.alias) {
            throw new _twentyormexception.TwentyOrmException(`Join alias "${alias}" collides with the main query alias`, _twentyormexception.TwentyOrmExceptionCode.INVALID_PARAMETER);
        }
        if (this.joinClauses.some((joinClause)=>joinClause.alias === alias)) {
            return this;
        }
        const parentTableShape = this.getTableShapeForAlias(parentAlias);
        if (!(0, _utils.isDefined)(parentTableShape)) {
            throw new _twentyormexception.TwentyOrmException(`Join path "${relationPath}" references "${parentAlias}", which is neither the main alias nor a joined alias`, _twentyormexception.TwentyOrmExceptionCode.UNKNOWN_RELATION);
        }
        const relationShape = parentTableShape.relationShapeByFieldName[relationFieldName];
        if (!(0, _utils.isDefined)(relationShape)) {
            throw new _twentyormexception.TwentyOrmException(`Relation "${relationFieldName}" does not exist on "${parentTableShape.nameSingular}"`, _twentyormexception.TwentyOrmExceptionCode.UNKNOWN_RELATION);
        }
        const targetTableShape = this.context.tableShapeByObjectMetadataId(relationShape.targetObjectMetadataId);
        const joinColumnName = relationShape.joinColumnName;
        const toManyJoin = (0, _utils.isDefined)(joinColumnName) ? undefined : this.buildToManyJoin({
            parentAlias,
            alias,
            targetTableShape,
            targetFieldMetadataId: relationShape.targetFieldMetadataId
        });
        const shouldJoinDedupedToMany = options?.allowToManyJoin === true;
        this.joinClauses.push({
            alias,
            parentAlias,
            relationFieldName,
            targetTableShape,
            relationType: relationShape.relationType,
            joinType,
            isSelected: options?.select === true,
            condition: (0, _utils.isDefined)(joinColumnName) ? condition ?? `${this.quoteColumn(parentAlias, joinColumnName)} = ${this.quoteColumn(alias, 'id')}` : shouldJoinDedupedToMany ? condition ?? toManyJoin?.condition : undefined,
            toManyForeignKeyColumnName: shouldJoinDedupedToMany ? toManyJoin?.foreignKeyColumnName : undefined,
            toManyPlainCondition: condition ?? toManyJoin?.condition,
            toManyDedupOrder: shouldJoinDedupedToMany ? options?.toManyDedupOrder : undefined,
            additionalOnConditions: []
        });
        return this;
    }
    getTableShapeForAlias(alias) {
        if (alias === this.alias) {
            return this.tableShape;
        }
        return this.joinClauses.find((joinClause)=>joinClause.alias === alias)?.targetTableShape;
    }
    resolveColumnSelections() {
        return this.pendingColumnSelections.map((expression)=>{
            const [alias, columnName] = expression.split('.');
            const tableShape = this.getTableShapeForAlias(alias);
            if (!(0, _utils.isDefined)(tableShape)) {
                throw new _twentyormexception.TwentyOrmException(`Selection "${expression}" references "${alias}", which is neither the main alias nor a joined alias`, _twentyormexception.TwentyOrmExceptionCode.UNKNOWN_RELATION);
            }
            if (!(0, _utils.isDefined)(tableShape.columnShapeByColumnName[columnName])) {
                throw new _twentyormexception.TwentyOrmException(`Column "${columnName}" does not exist on "${tableShape.nameSingular}"`, _twentyormexception.TwentyOrmExceptionCode.UNKNOWN_COLUMN);
            }
            return {
                alias,
                columnName
            };
        });
    }
    buildToManyJoin({ parentAlias, alias, targetTableShape, targetFieldMetadataId }) {
        if (!(0, _utils.isDefined)(targetFieldMetadataId)) {
            return undefined;
        }
        const inverseRelationShape = Object.values(targetTableShape.relationShapeByFieldName).find((relationShape)=>relationShape.fieldMetadataId === targetFieldMetadataId);
        const foreignKeyColumnName = inverseRelationShape?.joinColumnName;
        if (!(0, _utils.isDefined)(foreignKeyColumnName)) {
            return undefined;
        }
        return {
            condition: `${this.quoteColumn(alias, foreignKeyColumnName)} = ${this.quoteColumn(parentAlias, 'id')}`,
            foreignKeyColumnName
        };
    }
    withDeleted() {
        this.includeDeleted = true;
        return this;
    }
    limit(count) {
        this.limitValue = count;
        return this;
    }
    offset(count) {
        this.offsetValue = count;
        return this;
    }
    take(count) {
        return this.limit(count);
    }
    skip(count) {
        return this.offset(count);
    }
    getQuery() {
        return this.buildSelectStatement().sql;
    }
    getQueryAndParameters() {
        const { sql, parameters } = this.buildSelectStatement();
        const compiled = (0, _compilenamedparametersutil.compileNamedParameters)(sql, parameters);
        return [
            compiled.text,
            compiled.values
        ];
    }
    materializeEntities(rows) {
        const columnNameByResultAlias = this.buildColumnNameByResultAlias();
        return rows.map((row)=>(0, _buildselectstatementutil.mapRowToEntity)(row, columnNameByResultAlias));
    }
    async getMany(options) {
        const entities = this.materializeEntities(await this.executeSelect());
        if (options?.noFormatting) {
            return entities;
        }
        return this.context.formatResult(entities);
    }
    async getRawAndEntities() {
        const rows = await this.executeSelect();
        return {
            raw: rows,
            entities: this.context.formatResult(this.materializeEntities(rows))
        };
    }
    async getOne(options) {
        const previousLimit = this.limitValue;
        this.limitValue = 1;
        let rows;
        try {
            rows = await this.executeSelect();
        } finally{
            this.limitValue = previousLimit;
        }
        if (rows.length === 0) {
            return null;
        }
        const [entity] = this.materializeEntities([
            rows[0]
        ]);
        if (options?.noFormatting) {
            return entity;
        }
        return this.context.formatResult(entity);
    }
    async getRawOne() {
        const previousLimit = this.limitValue;
        this.limitValue = this.limitValue ?? 1;
        try {
            const rows = await this.executeSelect({
                allowPlainToManyJoins: true
            });
            return rows[0];
        } finally{
            this.limitValue = previousLimit;
        }
    }
    async getRawMany() {
        const rows = await this.executeSelect({
            allowPlainToManyJoins: true
        });
        return rows;
    }
    applyRowLevelPermissions() {
        this.context.onBeforeExecute(this);
        return this;
    }
    async getCount() {
        this.context.onBeforeExecute(this);
        const sql = (0, _buildselectstatementutil.buildCountStatement)(this.toSelectStatementState({
            allowPlainToManyJoins: true
        }));
        const compiled = (0, _compilenamedparametersutil.compileNamedParameters)(sql, this.parameters);
        const rows = await this.context.executor.execute(compiled);
        return Number(rows[0]?.count ?? 0);
    }
    addJoinCondition(alias, condition) {
        const joinClause = this.joinClauses.find((candidate)=>candidate.alias === alias);
        if ((0, _utils.isDefined)(joinClause)) {
            joinClause.additionalOnConditions.push(condition);
        }
        for (const existsFilterClause of this.existsFilterClauses){
            if (existsFilterClause.alias === alias) {
                existsFilterClause.additionalOnConditions.push(condition);
            }
        }
        return this;
    }
    getJoinedTableShape(alias) {
        return this.joinClauses.find((joinClause)=>joinClause.alias === alias)?.targetTableShape ?? this.existsFilterClauses.find((existsFilterClause)=>existsFilterClause.alias === alias)?.targetTableShape;
    }
    markRowLevelPermissionApplied(alias) {
        if (this.aliasesWithRowLevelPermissionApplied.has(alias)) {
            return false;
        }
        this.aliasesWithRowLevelPermissionApplied.add(alias);
        return true;
    }
    getReferencedColumnNamesByAlias() {
        const state = this.toSelectStatementState();
        const aliases = (0, _buildselectstatementutil.collectStatementAliases)(state);
        return (0, _collectreferencedcolumnnamesutil.collectReferencedColumnNames)({
            mainAlias: this.alias,
            mainAliasColumnNames: this.buildProjection().mainAliasColumnNames,
            extraSelectClauses: this.extraSelectClauses.map((selectClause)=>({
                    ...selectClause,
                    expression: (0, _buildselectstatementutil.quoteQualifiedAliasReferences)(selectClause.expression, aliases)
                })),
            orderByClauses: this.orderByClauses.filter((orderByClause)=>!this.extraSelectClauses.some((selectClause)=>(0, _removesqlinjectionutil.escapeIdentifier)(selectClause.alias) === orderByClause.expression)).map((orderByClause)=>({
                    ...orderByClause,
                    expression: (0, _buildselectstatementutil.quoteQualifiedAliasReferences)(orderByClause.expression, aliases)
                })),
            distinctOnExpressions: this.distinctOnExpressions
        });
    }
    getSelectedColumnNames() {
        return this.getReferencedColumnNamesByAlias()[this.alias] ?? [];
    }
    update() {
        return this.toMutationQueryBuilder('update');
    }
    delete() {
        return this.toMutationQueryBuilder('delete');
    }
    softDelete() {
        return this.toMutationQueryBuilder('soft-delete');
    }
    restore() {
        return this.toMutationQueryBuilder('restore');
    }
    toMutationQueryBuilder(kind) {
        if (this.joinClauses.length > 0) {
            throw new _twentyormexception.TwentyOrmException(`A mutation cannot carry a relation join; rewrite the filter as an "id IN (subquery)" predicate first`, _twentyormexception.TwentyOrmExceptionCode.UNSUPPORTED_OPERATION);
        }
        // Row-level permission predicates are injected on the select path only, so an
        // EXISTS rendered here would filter the related table with no predicate at all.
        if (this.existsFilterClauses.length > 0) {
            throw new _twentyormexception.TwentyOrmException(`A mutation cannot carry a relation filter; rewrite the filter as an "id IN (subquery)" predicate first`, _twentyormexception.TwentyOrmExceptionCode.UNSUPPORTED_OPERATION);
        }
        return new _workspacemutationquerybuilder.WorkspaceMutationQueryBuilder({
            alias: this.alias,
            kind,
            context: {
                tableShape: this.tableShape,
                executor: this.context.executor,
                formatResult: this.context.formatResult
            },
            whereClauses: this.whereClauses,
            parameters: this.parameters
        });
    }
    appendWhere(operator, condition, parameters) {
        if ((0, _utils.isDefined)(parameters)) {
            this.setParameters(parameters);
        }
        if ((0, _querybuildertype.isWhereFactoryLike)(condition)) {
            const nestedBuilder = new WorkspaceSelectQueryBuilder(this.alias, this.context);
            condition.whereFactory(nestedBuilder);
            const nestedSql = nestedBuilder.buildWhereExpression({
                includeSoftDeletePredicate: false,
                substituteExistsFilters: false
            });
            this.setParameters(nestedBuilder.parameters);
            this.existsFilterClauses.push(...nestedBuilder.existsFilterClauses);
            if (nestedSql.length > 0) {
                this.whereClauses.push({
                    operator,
                    sql: (0, _querybuildertype.isNegatedWhereFactoryLike)(condition) ? `NOT (${nestedSql})` : `(${nestedSql})`
                });
            }
            return this;
        }
        if ((0, _querybuildertype.isObjectWhereLike)(condition)) {
            const { sql, parameters: objectParameters } = this.buildObjectWhereClause(condition);
            this.setParameters(objectParameters);
            if (sql.length > 0) {
                this.whereClauses.push({
                    operator,
                    sql: `(${sql})`
                });
            }
            return this;
        }
        if (condition.length > 0) {
            this.whereClauses.push({
                operator,
                sql: `(${condition})`
            });
        }
        return this;
    }
    buildObjectWhereClause(where) {
        const conditions = [];
        const parameters = {};
        for (const [columnName, value] of Object.entries(where)){
            if ((0, _utils.isDefined)(this.tableShape.columnShapeByColumnName[columnName])) {
                conditions.push(this.buildValueCondition((0, _buildselectstatementutil.quoteColumn)(this.alias, columnName), columnName, value, parameters));
                continue;
            }
            const relationShape = this.tableShape.relationShapeByFieldName[columnName];
            if ((0, _utils.isDefined)(relationShape) && isNestedWhereObject(value)) {
                conditions.push(this.buildRelationExistsCondition({
                    relationFieldName: columnName,
                    relationShape,
                    where: value,
                    parameters
                }));
                continue;
            }
            const hasCompositeChildColumns = Object.values(this.tableShape.columnShapeByColumnName).some((shape)=>shape.compositeParentFieldName === columnName);
            if (hasCompositeChildColumns && (0, _utils.isDefined)(value) && typeof value === 'object' && !(value instanceof _typeorm.FindOperator) && !Array.isArray(value)) {
                for (const [subFieldName, subValue] of Object.entries(value)){
                    const compositeColumnName = `${columnName}${(0, _utils.pascalCase)(subFieldName)}`;
                    if (!(0, _utils.isDefined)(this.tableShape.columnShapeByColumnName[compositeColumnName])) {
                        throw new _twentyormexception.TwentyOrmException(`Column "${compositeColumnName}" does not exist on "${this.tableShape.nameSingular}"`, _twentyormexception.TwentyOrmExceptionCode.UNKNOWN_COLUMN);
                    }
                    conditions.push(this.buildValueCondition((0, _buildselectstatementutil.quoteColumn)(this.alias, compositeColumnName), compositeColumnName, subValue, parameters));
                }
                continue;
            }
            throw new _twentyormexception.TwentyOrmException(`Column "${columnName}" does not exist on "${this.tableShape.nameSingular}"`, _twentyormexception.TwentyOrmExceptionCode.UNKNOWN_COLUMN);
        }
        return {
            sql: conditions.join(' AND '),
            parameters
        };
    }
    buildRelationExistsCondition({ relationFieldName, relationShape, where, parameters }) {
        const targetTableShape = this.context.tableShapeByObjectMetadataId(relationShape.targetObjectMetadataId);
        const alias = this.buildExistsFilterAlias(relationFieldName);
        const correlationCondition = (0, _utils.isDefined)(relationShape.joinColumnName) ? `${this.quoteColumn(this.alias, relationShape.joinColumnName)} = ${this.quoteColumn(alias, 'id')}` : this.buildToManyJoin({
            parentAlias: this.alias,
            alias,
            targetTableShape,
            targetFieldMetadataId: relationShape.targetFieldMetadataId
        })?.condition;
        if (!(0, _utils.isDefined)(correlationCondition)) {
            throw new _twentyormexception.TwentyOrmException(`Relation "${relationFieldName}" on "${this.tableShape.nameSingular}" cannot be filtered on because its inverse foreign key could not be resolved`, _twentyormexception.TwentyOrmExceptionCode.UNKNOWN_RELATION);
        }
        const nestedBuilder = new WorkspaceSelectQueryBuilder(alias, {
            ...this.context,
            tableShape: targetTableShape
        });
        nestedBuilder.where(where);
        Object.assign(parameters, nestedBuilder.parameters);
        const token = `__ormExistsFilter_${existsFilterSequence++}__`;
        this.existsFilterClauses.push({
            token,
            alias,
            parentAlias: this.alias,
            relationFieldName,
            targetTableShape,
            correlationCondition,
            conditionSql: nestedBuilder.buildWhereExpression({
                includeSoftDeletePredicate: false,
                substituteExistsFilters: false
            }),
            additionalOnConditions: []
        }, ...nestedBuilder.existsFilterClauses);
        return token;
    }
    buildExistsFilterAlias(relationFieldName) {
        const baseAlias = `${this.alias}_${relationFieldName}_filter`;
        const takenAliases = new Set([
            this.alias,
            ...this.joinClauses.map((joinClause)=>joinClause.alias),
            ...this.existsFilterClauses.map((existsFilterClause)=>existsFilterClause.alias)
        ]);
        if (!takenAliases.has(baseAlias)) {
            return baseAlias;
        }
        let suffix = 2;
        while(takenAliases.has(`${baseAlias}_${suffix}`)){
            suffix++;
        }
        return `${baseAlias}_${suffix}`;
    }
    buildValueCondition(quotedColumn, columnName, value, parameters) {
        if (value === null) {
            return `${quotedColumn} IS NULL`;
        }
        const nextParameter = (parameterValue)=>{
            const parameterName = `ormObjectWhere_${objectWhereParameterSequence++}`;
            parameters[parameterName] = parameterValue;
            return parameterName;
        };
        if (value instanceof _typeorm.FindOperator) {
            switch(value.type){
                case 'in':
                    return `${quotedColumn} IN (:...${nextParameter(value.value)})`;
                case 'any':
                    return `${quotedColumn} = ANY(:${nextParameter(value.value)})`;
                case 'equal':
                    return `${quotedColumn} = :${nextParameter(value.value)}`;
                case 'lessThan':
                    return `${quotedColumn} < :${nextParameter(value.value)}`;
                case 'lessThanOrEqual':
                    return `${quotedColumn} <= :${nextParameter(value.value)}`;
                case 'moreThan':
                    return `${quotedColumn} > :${nextParameter(value.value)}`;
                case 'moreThanOrEqual':
                    return `${quotedColumn} >= :${nextParameter(value.value)}`;
                case 'like':
                    return `${quotedColumn} LIKE :${nextParameter(value.value)}`;
                case 'ilike':
                    return `${quotedColumn} ILIKE :${nextParameter(value.value)}`;
                case 'arrayContains':
                    return `${quotedColumn} @> :${nextParameter(value.value)}`;
                case 'isNull':
                    return `${quotedColumn} IS NULL`;
                case 'between':
                    {
                        const [from, to] = value.value;
                        return `${quotedColumn} BETWEEN :${nextParameter(from)} AND :${nextParameter(to)}`;
                    }
                case 'not':
                    return `NOT (${this.buildValueCondition(quotedColumn, columnName, value.child ?? value.value, parameters)})`;
                case 'and':
                case 'or':
                    {
                        const childOperators = value.value;
                        const separator = value.type === 'and' ? ' AND ' : ' OR ';
                        return `(${childOperators.map((childOperator)=>this.buildValueCondition(quotedColumn, columnName, childOperator, parameters)).join(separator)})`;
                    }
                case 'raw':
                    {
                        const rawValue = value.value;
                        let rawSql;
                        if (typeof rawValue === 'function') {
                            rawSql = rawValue(quotedColumn);
                        } else if (typeof rawValue === 'string') {
                            rawSql = rawValue;
                        } else {
                            rawSql = value.getSql?.(quotedColumn) ?? '';
                        }
                        Object.assign(parameters, value.objectLiteralParameters ?? {});
                        return rawSql;
                    }
                default:
                    throw new _twentyormexception.TwentyOrmException(`Object where does not support the "${value.type}" operator on "${columnName}"`, _twentyormexception.TwentyOrmExceptionCode.UNSUPPORTED_OPERATION);
            }
        }
        return `${quotedColumn} = :${nextParameter(value)}`;
    }
    appendOrderBy(orderByOrExpression, direction, nulls) {
        this.orderByClauses.push(...(0, _buildorderbyclausesutil.buildOrderByClauses)({
            orderByOrExpression,
            direction,
            nulls,
            normaliseColumnExpression: (expression)=>this.normaliseOrderByExpression(expression)
        }));
        return this;
    }
    normaliseOrderByExpression(expression) {
        const isBareIdentifier = /^\w+$/.test(expression);
        if (isBareIdentifier && this.extraSelectClauses.some((selectClause)=>selectClause.alias === expression)) {
            return (0, _removesqlinjectionutil.escapeIdentifier)(expression);
        }
        return this.normaliseColumnExpression(expression);
    }
    async executeSelect(options) {
        this.context.onBeforeExecute(this);
        const { sql, parameters } = this.buildSelectStatement(options);
        const compiled = (0, _compilenamedparametersutil.compileNamedParameters)(sql, parameters);
        return this.context.executor.execute(compiled);
    }
    buildSelectStatement(options) {
        const state = this.toSelectStatementState(options);
        return {
            sql: (0, _buildselectstatementutil.buildSelectStatement)(state),
            parameters: {
                ...this.parameters,
                ...(0, _buildselectstatementutil.buildPaginationParameters)(state)
            }
        };
    }
    buildProjection() {
        return (0, _buildselectstatementutil.buildProjection)(this.toSelectStatementState());
    }
    buildColumnNameByResultAlias() {
        return (0, _buildselectstatementutil.buildHydrationPathByResultAlias)(this.toSelectStatementState());
    }
    buildWhereExpression(options) {
        return (0, _buildselectstatementutil.buildWhereExpression)(this.toSelectStatementState(), options);
    }
    normaliseColumnExpression(expression) {
        return (0, _buildselectstatementutil.normaliseColumnExpression)(expression, this.alias);
    }
    quoteColumn(alias, columnName) {
        return (0, _buildselectstatementutil.quoteColumn)(alias, columnName);
    }
    toSelectStatementState(options) {
        return {
            alias: this.alias,
            tableShape: this.tableShape,
            findOptions: this.findOptions,
            explicitSelection: this.explicitSelection,
            extraSelectClauses: this.extraSelectClauses,
            columnSelections: this.resolveColumnSelections(),
            joinClauses: this.joinClauses,
            whereClauses: this.whereClauses,
            existsFilterClauses: this.existsFilterClauses,
            groupByExpressions: this.groupByExpressions,
            orderByClauses: this.orderByClauses,
            distinctOnExpressions: this.distinctOnExpressions,
            includeDeleted: this.includeDeleted,
            allowPlainToManyJoins: options?.allowPlainToManyJoins ?? false,
            limitValue: this.limitValue,
            offsetValue: this.offsetValue
        };
    }
    constructor(alias, context){
        this.whereClauses = [];
        this.joinClauses = [];
        this.existsFilterClauses = [];
        this.extraSelectClauses = [];
        this.pendingColumnSelections = [];
        this.orderByClauses = [];
        this.groupByExpressions = [];
        this.distinctOnExpressions = [];
        this.parameters = {};
        this.findOptions = {};
        this.includeDeleted = false;
        this.aliasesWithRowLevelPermissionApplied = new Set();
        this.alias = alias;
        this.tableShape = context.tableShape;
        this.objectRecordsPermissions = context.objectRecordsPermissions;
        this.context = context;
    }
};

//# sourceMappingURL=workspace-select-query-builder.js.map