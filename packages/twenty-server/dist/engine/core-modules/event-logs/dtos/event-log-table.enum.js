"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "registerEventLogTableEnum", {
    enumerable: true,
    get: function() {
        return registerEventLogTableEnum;
    }
});
const _graphql = require("@nestjs/graphql");
const _types = require("twenty-shared/types");
const registerEventLogTableEnum = ()=>{
    (0, _graphql.registerEnumType)(_types.EventLogTable, {
        name: 'EventLogTable'
    });
};

//# sourceMappingURL=event-log-table.enum.js.map