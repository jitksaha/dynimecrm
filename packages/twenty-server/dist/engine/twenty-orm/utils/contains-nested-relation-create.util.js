"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "containsNestedRelationCreate", {
    enumerable: true,
    get: function() {
        return containsNestedRelationCreate;
    }
});
const _constants = require("twenty-shared/constants");
const _utils = require("twenty-shared/utils");
const containsNestedRelationCreate = (records, relationFieldNames)=>records.some((record)=>Object.entries(record).some(([fieldName, value])=>relationFieldNames.has(fieldName) && (0, _utils.isDefined)(value) && typeof value === 'object' && (0, _utils.isDefined)(value[_constants.RELATION_NESTED_QUERY_KEYWORDS.CREATE])));

//# sourceMappingURL=contains-nested-relation-create.util.js.map