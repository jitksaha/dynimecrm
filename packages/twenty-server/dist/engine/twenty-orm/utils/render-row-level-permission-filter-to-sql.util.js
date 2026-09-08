/* @license Enterprise */ "use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "renderRowLevelPermissionFilterToSql", {
    enumerable: true,
    get: function() {
        return renderRowLevelPermissionFilterToSql;
    }
});
const _guards = require("@sniptt/guards");
const _types = require("twenty-shared/types");
const _utils = require("twenty-shared/utils");
const _resolvefilterkeyfieldmetadatautil = require("../../api/graphql/graphql-query-runner/graphql-query-parsers/utils/resolve-filter-key-field-metadata.util");
const _assertarrayoperatorvalueisnonemptyarrayutil = require("../../api/graphql/graphql-query-runner/utils/assert-array-operator-value-is-non-empty-array.util");
const _computewhereconditionparts = require("../../api/graphql/graphql-query-runner/utils/compute-where-condition-parts");
const _iscompositefieldmetadatatypeutil = require("../../metadata-modules/field-metadata/utils/is-composite-field-metadata-type.util");
const _buildfieldmapsfromflatobjectmetadatautil = require("../../metadata-modules/flat-field-metadata/utils/build-field-maps-from-flat-object-metadata.util");
const _ismorphorrelationflatfieldmetadatautil = require("../../metadata-modules/flat-field-metadata/utils/is-morph-or-relation-flat-field-metadata.util");
const _twentyormexception = require("../exceptions/twenty-orm.exception");
const ALWAYS_TRUE_CONDITION = '1=1';
const renderRowLevelPermissionFilterToSql = ({ recordFilter, tableAlias, objectMetadata, flatFieldMetadataMaps })=>{
    const { fieldIdByName, fieldIdByJoinColumnName } = (0, _buildfieldmapsfromflatobjectmetadatautil.buildFieldMapsFromFlatObjectMetadata)(flatFieldMetadataMaps, objectMetadata);
    const collectedParameters = {};
    const sql = renderFilterAsConjunction(recordFilter, {
        tableAlias,
        fieldIdByName,
        fieldIdByJoinColumnName,
        flatFieldMetadataMaps,
        collectedParameters
    });
    if (!(0, _guards.isNonEmptyString)(sql)) {
        return null;
    }
    return {
        sql,
        parameters: collectedParameters
    };
};
const renderFilterAsConjunction = (filter, context)=>{
    const conditions = Object.entries(filter).map(([filterKey, filterValue])=>renderFilterEntry(filterKey, filterValue, context)).filter(_guards.isNonEmptyString);
    return joinConditions(conditions, 'AND');
};
const renderFilterEntry = (filterKey, filterValue, context)=>{
    switch(filterKey){
        case 'and':
            return renderLogicalGroup(filterValue, 'AND', context);
        case 'or':
            return renderLogicalGroup(filterValue, 'OR', context);
        case 'not':
            {
                const negatedCondition = renderFilterAsConjunction(filterValue, context);
                const conditionToNegate = (0, _guards.isNonEmptyString)(negatedCondition) ? negatedCondition : ALWAYS_TRUE_CONDITION;
                return `NOT (${conditionToNegate})`;
            }
        default:
            return renderFieldCondition(filterKey, filterValue, context);
    }
};
const renderLogicalGroup = (filters, logicalOperator, context)=>{
    const filterList = Array.isArray(filters) ? filters : [
        filters
    ];
    const conditions = filterList.map((filter)=>{
        const renderedCondition = renderFilterAsConjunction(filter, context);
        return (0, _guards.isNonEmptyString)(renderedCondition) ? renderedCondition : ALWAYS_TRUE_CONDITION;
    });
    if (conditions.length === 0) {
        return ALWAYS_TRUE_CONDITION;
    }
    return `(${conditions.join(` ${logicalOperator} `)})`;
};
const joinConditions = (conditions, logicalOperator)=>{
    if (conditions.length === 0) {
        return '';
    }
    if (conditions.length === 1) {
        return conditions[0];
    }
    return `(${conditions.join(` ${logicalOperator} `)})`;
};
const renderFieldCondition = (fieldNameOrJoinColumnName, filterValue, context)=>{
    const { tableAlias, fieldIdByName, fieldIdByJoinColumnName, flatFieldMetadataMaps } = context;
    const { fieldMetadata, isReferencedByFieldName } = (0, _resolvefilterkeyfieldmetadatautil.resolveFilterKeyFieldMetadata)({
        filterKey: fieldNameOrJoinColumnName,
        fieldIdByName,
        fieldIdByJoinColumnName,
        flatFieldMetadataMaps
    });
    if (!(0, _utils.isDefined)(fieldMetadata)) {
        throw new _twentyormexception.TwentyOrmException(`Cannot render row level permission predicate: field "${fieldNameOrJoinColumnName}" does not exist on object "${tableAlias}"`, _twentyormexception.TwentyOrmExceptionCode.MALFORMED_METADATA);
    }
    if (isReferencedByFieldName && (0, _ismorphorrelationflatfieldmetadatautil.isMorphOrRelationFlatFieldMetadata)(fieldMetadata)) {
        throw new _twentyormexception.TwentyOrmException(`Cannot render row level permission predicate on relation "${fieldNameOrJoinColumnName}": traversing a relation requires an additional join, which a join condition cannot express`, _twentyormexception.TwentyOrmExceptionCode.MALFORMED_METADATA);
    }
    if ((0, _iscompositefieldmetadatatypeutil.isCompositeFieldMetadataType)(fieldMetadata.type)) {
        return renderCompositeFieldCondition(fieldMetadata, filterValue, context);
    }
    const operatorConditions = Object.entries(filterValue).map(([operator, operatorValue])=>{
        (0, _assertarrayoperatorvalueisnonemptyarrayutil.assertArrayOperatorValueIsNonEmptyArray)({
            operator,
            value: operatorValue,
            key: fieldNameOrJoinColumnName
        });
        const { sql, params } = (0, _computewhereconditionparts.computeWhereConditionParts)({
            operator,
            objectNameSingular: tableAlias,
            key: fieldNameOrJoinColumnName,
            value: operatorValue,
            fieldMetadataType: fieldMetadata.type
        });
        Object.assign(context.collectedParameters, params);
        return `(${sql})`;
    });
    return joinConditions(operatorConditions, 'AND');
};
const renderCompositeFieldCondition = (fieldMetadata, filterValue, context)=>{
    const compositeType = _types.compositeTypeDefinitions.get(fieldMetadata.type);
    if (!(0, _utils.isDefined)(compositeType)) {
        throw new _twentyormexception.TwentyOrmException(`Cannot render row level permission predicate: composite type definition not found for type "${fieldMetadata.type}"`, _twentyormexception.TwentyOrmExceptionCode.MALFORMED_METADATA);
    }
    const conditions = Object.entries(filterValue).flatMap(([subFieldName, subFieldFilter])=>{
        const isKnownSubField = compositeType.properties.some((property)=>property.name === subFieldName);
        if (!isKnownSubField) {
            throw new _twentyormexception.TwentyOrmException(`Cannot render row level permission predicate: "${subFieldName}" is not a sub field of composite type "${fieldMetadata.type}"`, _twentyormexception.TwentyOrmExceptionCode.MALFORMED_METADATA);
        }
        return Object.entries(subFieldFilter).map(([operator, operatorValue])=>{
            (0, _assertarrayoperatorvalueisnonemptyarrayutil.assertArrayOperatorValueIsNonEmptyArray)({
                operator,
                value: operatorValue,
                key: subFieldName
            });
            const { sql, params } = (0, _computewhereconditionparts.computeWhereConditionParts)({
                operator,
                objectNameSingular: context.tableAlias,
                key: `${fieldMetadata.name}${(0, _utils.capitalize)(subFieldName)}`,
                subFieldKey: subFieldName,
                value: operatorValue,
                fieldMetadataType: fieldMetadata.type
            });
            Object.assign(context.collectedParameters, params);
            return `(${sql})`;
        });
    });
    return joinConditions(conditions, 'AND');
};

//# sourceMappingURL=render-row-level-permission-filter-to-sql.util.js.map