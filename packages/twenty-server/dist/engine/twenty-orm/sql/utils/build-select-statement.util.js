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
    get LIMIT_PARAMETER_NAME () {
        return LIMIT_PARAMETER_NAME;
    },
    get OFFSET_PARAMETER_NAME () {
        return OFFSET_PARAMETER_NAME;
    },
    get RESERVED_PARAMETER_NAMES () {
        return RESERVED_PARAMETER_NAMES;
    },
    get buildColumnNameByResultAlias () {
        return buildColumnNameByResultAlias;
    },
    get buildCountStatement () {
        return buildCountStatement;
    },
    get buildFromClause () {
        return buildFromClause;
    },
    get buildGroupByClause () {
        return buildGroupByClause;
    },
    get buildHydrationPathByResultAlias () {
        return buildHydrationPathByResultAlias;
    },
    get buildJoinClause () {
        return buildJoinClause;
    },
    get buildOrderByClause () {
        return buildOrderByClause;
    },
    get buildPaginationParameters () {
        return buildPaginationParameters;
    },
    get buildProjection () {
        return buildProjection;
    },
    get buildSelectStatement () {
        return buildSelectStatement;
    },
    get buildWhereExpression () {
        return buildWhereExpression;
    },
    get collectJoinedColumnProjections () {
        return collectJoinedColumnProjections;
    },
    get collectStatementAliases () {
        return collectStatementAliases;
    },
    get mapRowToEntity () {
        return mapRowToEntity;
    },
    get normaliseColumnExpression () {
        return normaliseColumnExpression;
    },
    get quoteColumn () {
        return quoteColumn;
    },
    get quoteQualifiedAliasReferences () {
        return quoteQualifiedAliasReferences;
    },
    get renderUserWhereExpression () {
        return renderUserWhereExpression;
    },
    get substituteExistsFilterTokens () {
        return substituteExistsFilterTokens;
    }
});
const _utils = require("twenty-shared/utils");
const _relationtypeinterface = require("../../../metadata-modules/field-metadata/interfaces/relation-type.interface");
const _removesqlinjectionutil = require("../../../workspace-manager/workspace-migration/utils/remove-sql-injection.util");
const _buildcolumnresultaliasutil = require("./build-column-result-alias.util");
const _twentyormexception = require("../../exceptions/twenty-orm.exception");
const quoteColumn = (alias, columnName)=>`${(0, _removesqlinjectionutil.escapeIdentifier)(alias)}.${(0, _removesqlinjectionutil.escapeIdentifier)(columnName)}`;
const normaliseColumnExpression = (expression, defaultAlias)=>{
    if (expression.includes('"') || expression.includes('(')) {
        return expression;
    }
    const parts = expression.split('.');
    if (parts.length === 2) {
        return quoteColumn(parts[0], parts[1]);
    }
    return quoteColumn(defaultAlias, expression);
};
const SQL_TEXT_SEGMENTS = /('(?:[^']|'')*'|"[^"]*")/;
const quoteQualifiedAliasReferencesInSegment = (segment, aliases)=>aliases.reduce((quotedSegment, alias)=>quotedSegment.replace(new RegExp(`(?<![\\w".:])${alias.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\.(\\w+)`, 'g'), (_, columnName)=>quoteColumn(alias, columnName)), segment);
const quoteQualifiedAliasReferences = (expression, aliases)=>expression.split(SQL_TEXT_SEGMENTS).map((segment, segmentIndex)=>segmentIndex % 2 === 1 ? segment : quoteQualifiedAliasReferencesInSegment(segment, aliases)).join('');
const collectStatementAliases = (state)=>[
        state.alias,
        ...state.joinClauses.map((joinClause)=>joinClause.alias)
    ];
const buildJoinPropertyPath = (state, joinAlias)=>{
    const propertySegments = [];
    let currentAlias = joinAlias;
    while(currentAlias !== state.alias){
        const joinClause = state.joinClauses.find((candidate)=>candidate.alias === currentAlias);
        if (!(0, _utils.isDefined)(joinClause)) {
            throw new _twentyormexception.TwentyOrmException(`Alias "${currentAlias}" does not belong to this statement`, _twentyormexception.TwentyOrmExceptionCode.UNKNOWN_RELATION);
        }
        propertySegments.unshift(joinClause.relationFieldName);
        currentAlias = joinClause.parentAlias;
    }
    return propertySegments.join('.');
};
const collectJoinedColumnProjections = (state)=>{
    const projections = [];
    const seenResultAliases = new Set();
    const addProjection = (joinAlias, columnName)=>{
        const resultAlias = (0, _buildcolumnresultaliasutil.buildColumnResultAlias)(joinAlias, columnName);
        if (seenResultAliases.has(resultAlias)) {
            return;
        }
        seenResultAliases.add(resultAlias);
        projections.push({
            joinAlias,
            columnName,
            resultAlias,
            propertyPath: buildJoinPropertyPath(state, joinAlias)
        });
    };
    for (const joinClause of state.joinClauses){
        if (joinClause.isSelected !== true) {
            continue;
        }
        for (const columnName of joinClause.targetTableShape.columnNames){
            addProjection(joinClause.alias, columnName);
        }
    }
    for (const columnSelection of state.columnSelections){
        if (columnSelection.alias === state.alias) {
            continue;
        }
        addProjection(columnSelection.alias, columnSelection.columnName);
    }
    return projections;
};
const buildProjection = (state)=>{
    const selectedColumnNames = Object.entries(state.findOptions.select ?? {}).filter(([, isSelected])=>isSelected).map(([columnName])=>columnName);
    for (const columnName of selectedColumnNames){
        if (!(0, _utils.isDefined)(state.tableShape.columnShapeByColumnName[columnName])) {
            throw new _twentyormexception.TwentyOrmException(`Column "${columnName}" does not exist on "${state.tableShape.nameSingular}"`, _twentyormexception.TwentyOrmExceptionCode.UNKNOWN_COLUMN);
        }
    }
    const mainAliasColumnNames = state.explicitSelection ?? (selectedColumnNames.length > 0 ? selectedColumnNames : state.tableShape.columnNames);
    const expressions = mainAliasColumnNames.map((columnName)=>`${quoteColumn(state.alias, columnName)} AS ${(0, _removesqlinjectionutil.escapeIdentifier)((0, _buildcolumnresultaliasutil.buildColumnResultAlias)(state.alias, columnName))}`);
    const projectedMainColumnNames = new Set(mainAliasColumnNames);
    for (const columnSelection of state.columnSelections){
        if (columnSelection.alias !== state.alias || projectedMainColumnNames.has(columnSelection.columnName)) {
            continue;
        }
        projectedMainColumnNames.add(columnSelection.columnName);
        expressions.push(`${quoteColumn(state.alias, columnSelection.columnName)} AS ${(0, _removesqlinjectionutil.escapeIdentifier)((0, _buildcolumnresultaliasutil.buildColumnResultAlias)(state.alias, columnSelection.columnName))}`);
    }
    for (const joinedProjection of collectJoinedColumnProjections(state)){
        expressions.push(`${quoteColumn(joinedProjection.joinAlias, joinedProjection.columnName)} AS ${(0, _removesqlinjectionutil.escapeIdentifier)(joinedProjection.resultAlias)}`);
    }
    const aliases = collectStatementAliases(state);
    for (const extraSelect of state.extraSelectClauses){
        expressions.push(`${quoteQualifiedAliasReferences(extraSelect.expression, aliases)} AS ${(0, _removesqlinjectionutil.escapeIdentifier)(extraSelect.alias)}`);
    }
    return {
        expressions,
        mainAliasColumnNames
    };
};
const renderUserWhereExpression = (whereClauses)=>whereClauses.map((clause, index)=>index === 0 ? clause.sql : `${clause.operator.toUpperCase()} ${clause.sql}`).join(' ');
const renderExistsFilter = (existsFilterClause, includeDeleted)=>{
    const conditions = [
        existsFilterClause.correlationCondition,
        ...existsFilterClause.additionalOnConditions
    ];
    if (existsFilterClause.conditionSql.length > 0) {
        conditions.push(existsFilterClause.conditionSql);
    }
    if (!includeDeleted && existsFilterClause.targetTableShape.hasDeletedAtColumn) {
        conditions.push(`${quoteColumn(existsFilterClause.alias, 'deletedAt')} IS NULL`);
    }
    const tableExpression = `${(0, _removesqlinjectionutil.escapeIdentifier)(existsFilterClause.targetTableShape.schemaName)}.${(0, _removesqlinjectionutil.escapeIdentifier)(existsFilterClause.targetTableShape.tableName)}`;
    return `EXISTS (SELECT 1 FROM ${tableExpression} AS ${(0, _removesqlinjectionutil.escapeIdentifier)(existsFilterClause.alias)} WHERE ${conditions.join(' AND ')})`;
};
const substituteExistsFilterTokens = ({ expression, existsFilterClauses, includeDeleted })=>existsFilterClauses.reduce((substituted, existsFilterClause)=>substituted.split(existsFilterClause.token).join(renderExistsFilter(existsFilterClause, includeDeleted)), expression);
const buildWhereExpression = (state, { includeSoftDeletePredicate = true, substituteExistsFilters = true } = {})=>{
    const renderedWhereClauses = quoteQualifiedAliasReferences(renderUserWhereExpression(state.whereClauses), collectStatementAliases(state));
    const userExpression = substituteExistsFilters ? substituteExistsFilterTokens({
        expression: renderedWhereClauses,
        existsFilterClauses: state.existsFilterClauses,
        includeDeleted: state.includeDeleted
    }) : renderedWhereClauses;
    const shouldAddSoftDeletePredicate = includeSoftDeletePredicate && !state.includeDeleted && state.tableShape.hasDeletedAtColumn;
    if (!shouldAddSoftDeletePredicate) {
        return userExpression;
    }
    const softDeletePredicate = `${quoteColumn(state.alias, 'deletedAt')} IS NULL`;
    if (userExpression.length === 0) {
        return softDeletePredicate;
    }
    return `(${userExpression}) AND ${softDeletePredicate}`;
};
const buildFromClause = (state)=>`FROM ${(0, _removesqlinjectionutil.escapeIdentifier)(state.tableShape.schemaName)}.${(0, _removesqlinjectionutil.escapeIdentifier)(state.tableShape.tableName)} AS ${(0, _removesqlinjectionutil.escapeIdentifier)(state.alias)}`;
const buildToManyDedupedJoinSource = ({ tableExpression, foreignKeyColumnName, includeSoftDeleteFilter, dedupOrder = [] })=>{
    const foreignKey = (0, _removesqlinjectionutil.escapeIdentifier)(foreignKeyColumnName);
    const whereClause = includeSoftDeleteFilter ? ` WHERE ${(0, _removesqlinjectionutil.escapeIdentifier)('deletedAt')} IS NULL` : '';
    const orderExpressions = [
        foreignKey,
        ...dedupOrder.map((order)=>`${(0, _removesqlinjectionutil.escapeIdentifier)(order.columnName)} ${order.direction}${(0, _utils.isDefined)(order.nulls) ? ` ${order.nulls}` : ''}`),
        (0, _removesqlinjectionutil.escapeIdentifier)('id')
    ];
    return `(SELECT DISTINCT ON (${foreignKey}) * FROM ${tableExpression}${whereClause} ORDER BY ${orderExpressions.join(', ')})`;
};
const buildJoinClause = (state)=>state.joinClauses.map((joinClause)=>{
        const condition = joinClause.condition ?? (state.allowPlainToManyJoins ? joinClause.toManyPlainCondition : undefined);
        if (!(0, _utils.isDefined)(condition)) {
            throw new _twentyormexception.TwentyOrmException(`Only to-one relations can be joined; "${joinClause.alias}" is to-many and must be loaded as a separate query`, _twentyormexception.TwentyOrmExceptionCode.UNSUPPORTED_OPERATION);
        }
        const softDeletePredicateApplies = !state.includeDeleted && joinClause.targetTableShape.hasDeletedAtColumn;
        const toManyForeignKeyColumnName = joinClause.relationType === _relationtypeinterface.RelationType.ONE_TO_MANY ? joinClause.toManyForeignKeyColumnName : undefined;
        const onConditions = [
            condition,
            ...joinClause.additionalOnConditions
        ];
        if (softDeletePredicateApplies && !(0, _utils.isDefined)(toManyForeignKeyColumnName)) {
            onConditions.push(`${quoteColumn(joinClause.alias, 'deletedAt')} IS NULL`);
        }
        const tableExpression = `${(0, _removesqlinjectionutil.escapeIdentifier)(joinClause.targetTableShape.schemaName)}.${(0, _removesqlinjectionutil.escapeIdentifier)(joinClause.targetTableShape.tableName)}`;
        const joinSource = (0, _utils.isDefined)(toManyForeignKeyColumnName) ? buildToManyDedupedJoinSource({
            tableExpression,
            foreignKeyColumnName: toManyForeignKeyColumnName,
            includeSoftDeleteFilter: softDeletePredicateApplies,
            dedupOrder: joinClause.toManyDedupOrder
        }) : tableExpression;
        return `${joinClause.joinType} JOIN ${joinSource} AS ${(0, _removesqlinjectionutil.escapeIdentifier)(joinClause.alias)} ON ${onConditions.map((condition)=>`(${condition})`).join(' AND ')}`;
    }).join(' ');
const buildGroupByClause = (state)=>{
    if (state.groupByExpressions.length === 0) {
        return '';
    }
    return `GROUP BY ${state.groupByExpressions.join(', ')}`;
};
const buildOrderByClause = (state)=>{
    if (state.orderByClauses.length === 0) {
        return '';
    }
    const aliases = collectStatementAliases(state);
    return `ORDER BY ${state.orderByClauses.map((orderByClause)=>`${quoteQualifiedAliasReferences(orderByClause.expression, aliases)} ${orderByClause.direction}${(0, _utils.isDefined)(orderByClause.nulls) ? ` ${orderByClause.nulls}` : ''}`).join(', ')}`;
};
const LIMIT_PARAMETER_NAME = 'ormLimit';
const OFFSET_PARAMETER_NAME = 'ormOffset';
const RESERVED_PARAMETER_NAMES = [
    LIMIT_PARAMETER_NAME,
    OFFSET_PARAMETER_NAME
];
const buildPaginationParameters = (state)=>({
        ...(0, _utils.isDefined)(state.limitValue) ? {
            [LIMIT_PARAMETER_NAME]: Number(state.limitValue)
        } : {},
        ...(0, _utils.isDefined)(state.offsetValue) ? {
            [OFFSET_PARAMETER_NAME]: Number(state.offsetValue)
        } : {}
    });
const buildDistinctOnClause = (state)=>{
    if (state.distinctOnExpressions.length === 0) {
        return '';
    }
    const aliases = collectStatementAliases(state);
    return `DISTINCT ON (${state.distinctOnExpressions.map((expression)=>quoteQualifiedAliasReferences(expression, aliases)).join(', ')}) `;
};
const buildSelectStatement = (state)=>{
    const whereExpression = buildWhereExpression(state);
    return [
        `SELECT ${buildDistinctOnClause(state)}${buildProjection(state).expressions.join(', ')}`,
        buildFromClause(state),
        buildJoinClause(state),
        whereExpression.length > 0 ? `WHERE ${whereExpression}` : '',
        buildGroupByClause(state),
        buildOrderByClause(state),
        (0, _utils.isDefined)(state.limitValue) ? `LIMIT :${LIMIT_PARAMETER_NAME}` : '',
        (0, _utils.isDefined)(state.offsetValue) ? `OFFSET :${OFFSET_PARAMETER_NAME}` : ''
    ].filter((part)=>part.length > 0).join(' ');
};
const buildCountStatement = (state)=>{
    const whereExpression = buildWhereExpression(state);
    const countExpression = state.joinClauses.length > 0 ? `COUNT(DISTINCT ${quoteColumn(state.alias, 'id')})` : 'COUNT(1)';
    return [
        `SELECT ${countExpression} AS "count"`,
        buildFromClause(state),
        buildJoinClause(state),
        whereExpression.length > 0 ? `WHERE ${whereExpression}` : ''
    ].filter((part)=>part.length > 0).join(' ');
};
const buildRelationValue = (leaves)=>{
    const idLeaf = leaves.find((leaf)=>leaf.propertySegments.length === 1 && leaf.propertySegments[0] === 'id');
    if ((0, _utils.isDefined)(idLeaf) && idLeaf.value === null) {
        return null;
    }
    const relationValue = {};
    const nestedLeavesByProperty = new Map();
    for (const leaf of leaves){
        const [propertyName, ...remainingSegments] = leaf.propertySegments;
        if (remainingSegments.length === 0) {
            relationValue[propertyName] = leaf.value;
            continue;
        }
        const nestedLeaves = nestedLeavesByProperty.get(propertyName) ?? [];
        nestedLeaves.push({
            propertySegments: remainingSegments,
            value: leaf.value
        });
        nestedLeavesByProperty.set(propertyName, nestedLeaves);
    }
    for (const [propertyName, nestedLeaves] of nestedLeavesByProperty){
        relationValue[propertyName] = buildRelationValue(nestedLeaves);
    }
    return relationValue;
};
const mapRowToEntity = (row, columnNameByResultAlias)=>{
    const entity = {};
    const relationLeavesByProperty = new Map();
    for (const [resultAlias, propertyPath] of Object.entries(columnNameByResultAlias)){
        if (!(resultAlias in row)) {
            continue;
        }
        const propertySegments = propertyPath.split('.');
        if (propertySegments.length === 1) {
            entity[propertyPath] = row[resultAlias];
            continue;
        }
        const [relationProperty, ...remainingSegments] = propertySegments;
        const relationLeaves = relationLeavesByProperty.get(relationProperty) ?? [];
        relationLeaves.push({
            propertySegments: remainingSegments,
            value: row[resultAlias]
        });
        relationLeavesByProperty.set(relationProperty, relationLeaves);
    }
    for (const [relationProperty, relationLeaves] of relationLeavesByProperty){
        entity[relationProperty] = buildRelationValue(relationLeaves);
    }
    return entity;
};
const buildColumnNameByResultAlias = (alias, mainAliasColumnNames)=>Object.fromEntries(mainAliasColumnNames.map((columnName)=>[
            (0, _buildcolumnresultaliasutil.buildColumnResultAlias)(alias, columnName),
            columnName
        ]));
const buildHydrationPathByResultAlias = (state)=>{
    const { mainAliasColumnNames } = buildProjection(state);
    const mainColumnNames = [
        ...mainAliasColumnNames,
        ...state.columnSelections.filter((columnSelection)=>columnSelection.alias === state.alias).map((columnSelection)=>columnSelection.columnName)
    ];
    return {
        ...buildColumnNameByResultAlias(state.alias, mainColumnNames),
        ...Object.fromEntries(collectJoinedColumnProjections(state).map((joinedProjection)=>[
                joinedProjection.resultAlias,
                `${joinedProjection.propertyPath}.${joinedProjection.columnName}`
            ]))
    };
};

//# sourceMappingURL=build-select-statement.util.js.map