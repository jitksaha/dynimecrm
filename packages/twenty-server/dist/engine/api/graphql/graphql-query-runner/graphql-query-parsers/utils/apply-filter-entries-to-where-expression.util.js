"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "applyFilterEntriesToWhereExpression", {
    enumerable: true,
    get: function() {
        return applyFilterEntriesToWhereExpression;
    }
});
const _typeorm = require("typeorm");
const applyFilterEntriesToWhereExpression = ({ whereExpression, outerQueryBuilder, objectNameSingular, filter, fieldParser, useDirectTableReference = false })=>{
    applyFilterEntries(whereExpression, filter, {
        outerQueryBuilder,
        objectNameSingular,
        fieldParser,
        useDirectTableReference
    });
};
const applyFilterEntries = (whereExpression, filter, context)=>{
    Object.entries(filter).forEach(([filterKey, filterValue], index)=>{
        applyFilterEntry(whereExpression, filterKey, filterValue, index === 0, context);
    });
};
const applyFilterEntry = (whereExpression, filterKey, // oxlint-disable-next-line typescript/no-explicit-any
filterValue, isFirst, context)=>{
    switch(filterKey){
        case 'and':
            applyLogicalGroup(whereExpression, filterValue, 'and', isFirst, context);
            break;
        case 'or':
            applyLogicalGroup(whereExpression, filterValue, 'or', isFirst, context);
            break;
        case 'not':
            applyCondition(whereExpression, new _typeorm.NotBrackets((negatedWhereExpression)=>{
                applyFilterEntries(negatedWhereExpression, filterValue, context);
            }), isFirst);
            break;
        default:
            context.fieldParser.parse(whereExpression, context.outerQueryBuilder, context.objectNameSingular, filterKey, filterValue, isFirst, context.useDirectTableReference);
            break;
    }
};
const applyLogicalGroup = (whereExpression, filters, logicalOperator, isFirst, context)=>{
    const filterList = Array.isArray(filters) ? filters : [
        filters
    ];
    const groupCondition = new _typeorm.Brackets((groupWhereExpression)=>{
        filterList.forEach((filter, index)=>{
            const elementCondition = new _typeorm.Brackets((elementWhereExpression)=>{
                applyFilterEntries(elementWhereExpression, filter, context);
            });
            if (index === 0) {
                groupWhereExpression.where(elementCondition);
            } else if (logicalOperator === 'or') {
                groupWhereExpression.orWhere(elementCondition);
            } else {
                groupWhereExpression.andWhere(elementCondition);
            }
        });
    });
    applyCondition(whereExpression, groupCondition, isFirst);
};
const applyCondition = (whereExpression, condition, isFirst)=>{
    if (isFirst) {
        whereExpression.where(condition);
    } else {
        whereExpression.andWhere(condition);
    }
};

//# sourceMappingURL=apply-filter-entries-to-where-expression.util.js.map