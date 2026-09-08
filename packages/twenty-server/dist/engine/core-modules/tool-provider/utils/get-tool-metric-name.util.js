"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "getToolMetricName", {
    enumerable: true,
    get: function() {
        return getToolMetricName;
    }
});
const _databasecrudoperationconst = require("../constants/database-crud-operation.const");
const getToolMetricName = (toolName)=>{
    const operation = _databasecrudoperationconst.DATABASE_CRUD_OPERATIONS.find((crudOperation)=>toolName === crudOperation || toolName.startsWith(`${crudOperation}_`));
    return operation ?? toolName;
};

//# sourceMappingURL=get-tool-metric-name.util.js.map