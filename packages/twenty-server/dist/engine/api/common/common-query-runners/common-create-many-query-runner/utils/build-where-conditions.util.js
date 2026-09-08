"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "buildWhereConditions", {
    enumerable: true,
    get: function() {
        return buildWhereConditions;
    }
});
const _utils = require("twenty-shared/utils");
const _typeorm = require("typeorm");
const _getvaluefrompathutil = require("./get-value-from-path.util");
const buildCompositeConditionKey = (conditionEntries)=>{
    const sortedEntries = [
        ...conditionEntries
    ].sort(([columnA], [columnB])=>columnA.localeCompare(columnB));
    return JSON.stringify(sortedEntries);
};
const buildSingleColumnCondition = (records, conflictingProperty)=>{
    const distinctValues = [
        ...new Set(records.map((record)=>(0, _getvaluefrompathutil.getValueFromPath)(record, conflictingProperty.fullPath)).filter(_utils.isDefined))
    ];
    if (distinctValues.length === 0) {
        return undefined;
    }
    return {
        [conflictingProperty.column]: (0, _typeorm.In)(distinctValues)
    };
};
const buildCompositeConditionEntries = (record, conflictingProperties)=>{
    const conditionEntries = [];
    for (const conflictingProperty of conflictingProperties){
        const fieldValue = (0, _getvaluefrompathutil.getValueFromPath)(record, conflictingProperty.fullPath);
        if (!(0, _utils.isDefined)(fieldValue)) {
            return undefined;
        }
        conditionEntries.push([
            conflictingProperty.column,
            fieldValue
        ]);
    }
    return conditionEntries;
};
const buildWhereConditions = (records, conflictingFieldGroups)=>{
    const whereConditions = [];
    const seenCompositeConditionKeys = new Set();
    for (const conflictingFieldGroup of conflictingFieldGroups){
        const { conflictingProperties } = conflictingFieldGroup;
        if (conflictingProperties.length === 1) {
            const condition = buildSingleColumnCondition(records, conflictingProperties[0]);
            if ((0, _utils.isDefined)(condition)) {
                whereConditions.push(condition);
            }
            continue;
        }
        for (const record of records){
            const conditionEntries = buildCompositeConditionEntries(record, conflictingProperties);
            if (!(0, _utils.isDefined)(conditionEntries)) {
                continue;
            }
            const conditionKey = buildCompositeConditionKey(conditionEntries);
            if (seenCompositeConditionKeys.has(conditionKey)) {
                continue;
            }
            seenCompositeConditionKeys.add(conditionKey);
            whereConditions.push(conditionEntries.reduce((accumulator, [column, value])=>{
                accumulator[column] = (0, _typeorm.Equal)(value);
                return accumulator;
            }, {}));
        }
    }
    return whereConditions;
};

//# sourceMappingURL=build-where-conditions.util.js.map