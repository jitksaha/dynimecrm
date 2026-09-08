"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "getDatabaseCrudToolFlatObjects", {
    enumerable: true,
    get: function() {
        return getDatabaseCrudToolFlatObjects;
    }
});
const _utils = require("twenty-shared/utils");
const _isworkflowrelatedobjectutil = require("./is-workflow-related-object.util");
const getDatabaseCrudToolFlatObjects = (byUniversalIdentifier)=>{
    return Object.values(byUniversalIdentifier).filter(_utils.isDefined).filter((obj)=>obj.isActive && !(0, _isworkflowrelatedobjectutil.isWorkflowRelatedObject)(obj));
};

//# sourceMappingURL=get-database-crud-tool-flat-objects.util.js.map