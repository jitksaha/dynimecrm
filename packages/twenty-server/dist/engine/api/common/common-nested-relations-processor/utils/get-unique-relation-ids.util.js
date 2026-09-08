"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "getUniqueRelationIds", {
    enumerable: true,
    get: function() {
        return getUniqueRelationIds;
    }
});
const _utils = require("twenty-shared/utils");
const getUniqueRelationIds = ({ records, idField })=>[
        ...new Set(records.map((record)=>record[idField]).filter(_utils.isDefined))
    ];

//# sourceMappingURL=get-unique-relation-ids.util.js.map