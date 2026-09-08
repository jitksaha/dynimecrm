"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "buildGroupByRecordConditions", {
    enumerable: true,
    get: function() {
        return buildGroupByRecordConditions;
    }
});
const _utils = require("twenty-shared/utils");
const buildGroupByRecordConditions = ({ groupsResult, groupByDefinitions })=>{
    const parameters = {};
    const groupConditions = groupsResult.map((group, groupIndex)=>{
        const conditions = groupByDefinitions.map((groupByDefinition, definitionIndex)=>{
            const parameterValue = group[groupByDefinition.alias];
            if (!(0, _utils.isDefined)(parameterValue)) {
                return `${groupByDefinition.expression} IS NULL`;
            }
            const parameterName = `groupValue_${groupIndex}_${definitionIndex}`;
            parameters[parameterName] = parameterValue;
            return `${groupByDefinition.expression} = :${parameterName}`;
        }).join(' AND ');
        return `(${conditions})`;
    });
    return {
        sql: `(${groupConditions.join(' OR ')})`,
        parameters
    };
};

//# sourceMappingURL=build-group-by-record-conditions.util.js.map