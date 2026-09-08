"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "ProcessAggregateHelper", {
    enumerable: true,
    get: function() {
        return ProcessAggregateHelper;
    }
});
const _types = require("twenty-shared/types");
const _utils = require("twenty-shared/utils");
const _formatcolumnnamesfromcompositefieldandsubfieldutil = require("../../../../twenty-orm/utils/format-column-names-from-composite-field-and-subfield.util");
let ProcessAggregateHelper = class ProcessAggregateHelper {
};
ProcessAggregateHelper.addSelectedAggregatedFieldsQueriesToQueryBuilder = ({ selectedAggregatedFields, queryBuilder, objectMetadataNameSingular })=>{
    queryBuilder.select([]);
    for (const [aggregatedFieldName, aggregatedField] of Object.entries(selectedAggregatedFields)){
        const aggregateExpression = ProcessAggregateHelper.getAggregateExpression(aggregatedField, objectMetadataNameSingular);
        if (!(0, _utils.isDefined)(aggregateExpression)) {
            continue;
        }
        queryBuilder.addSelect(aggregateExpression, aggregatedFieldName);
    }
};
ProcessAggregateHelper.getAggregateExpression = (aggregatedField, objectMetadataNameSingular)=>{
    if (!(0, _utils.isDefined)(aggregatedField?.fromField) || !(0, _utils.isDefined)(aggregatedField?.aggregateOperation)) {
        return;
    }
    const columnNames = (0, _formatcolumnnamesfromcompositefieldandsubfieldutil.formatColumnNamesFromCompositeFieldAndSubfields)(aggregatedField.fromField, aggregatedField.fromSubFields);
    const columnNameForNumericOperation = (0, _utils.isDefined)(aggregatedField.subFieldForNumericOperation) ? (0, _formatcolumnnamesfromcompositefieldandsubfieldutil.formatColumnNamesFromCompositeFieldAndSubfields)(aggregatedField.fromField, [
        aggregatedField.subFieldForNumericOperation
    ])[0] : columnNames[0];
    if (!Object.values(_types.AggregateOperations).includes(aggregatedField.aggregateOperation)) {
        return;
    }
    const concatenatedColumns = columnNames.map((col)=>`"${objectMetadataNameSingular}"."${col}"`).join(',');
    const columnExpression = `NULLIF(CONCAT(${concatenatedColumns}), '')`;
    switch(aggregatedField.aggregateOperation){
        case _types.AggregateOperations.COUNT_EMPTY:
            return `CASE WHEN COUNT(*) = 0 THEN NULL ELSE COUNT(*) - COUNT(${columnExpression}) END`;
        case _types.AggregateOperations.COUNT_NOT_EMPTY:
            return `CASE WHEN COUNT(*) = 0 THEN NULL ELSE COUNT(${columnExpression}) END`;
        case _types.AggregateOperations.COUNT_UNIQUE_VALUES:
            return `CASE WHEN COUNT(*) = 0 THEN NULL ELSE COUNT(DISTINCT ${columnExpression}) END`;
        case _types.AggregateOperations.PERCENTAGE_EMPTY:
            return `CASE WHEN COUNT(*) = 0 THEN NULL ELSE CAST(((COUNT(*) - COUNT(${columnExpression})::decimal) / COUNT(*)) AS DECIMAL) END`;
        case _types.AggregateOperations.PERCENTAGE_NOT_EMPTY:
            return `CASE WHEN COUNT(*) = 0 THEN NULL ELSE CAST((COUNT(${columnExpression})::decimal / COUNT(*)) AS DECIMAL) END`;
        case _types.AggregateOperations.COUNT_TRUE:
            return `CASE WHEN COUNT(*) = 0 THEN NULL ELSE COUNT(CASE WHEN ${columnExpression}::boolean = TRUE THEN 1 ELSE NULL END) END`;
        case _types.AggregateOperations.COUNT_FALSE:
            return `CASE WHEN COUNT(*) = 0 THEN NULL ELSE COUNT(CASE WHEN ${columnExpression}::boolean = FALSE THEN 1 ELSE NULL END) END`;
        default:
            {
                return `${aggregatedField.aggregateOperation}("${objectMetadataNameSingular}"."${columnNameForNumericOperation}")`;
            }
    }
};

//# sourceMappingURL=process-aggregate.helper.js.map