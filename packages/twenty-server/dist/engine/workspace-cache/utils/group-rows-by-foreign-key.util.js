"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "groupRowsByForeignKey", {
    enumerable: true,
    get: function() {
        return groupRowsByForeignKey;
    }
});
const _utils = require("twenty-shared/utils");
const groupRowsByForeignKey = ({ rows, foreignKey })=>{
    const rowsByForeignKeyValue = new Map();
    for (const row of rows){
        const foreignKeyValue = row[foreignKey];
        if (!(0, _utils.isDefined)(foreignKeyValue)) {
            continue;
        }
        const existingRows = rowsByForeignKeyValue.get(foreignKeyValue);
        if ((0, _utils.isDefined)(existingRows)) {
            existingRows.push(row);
        } else {
            rowsByForeignKeyValue.set(foreignKeyValue, [
                row
            ]);
        }
    }
    return rowsByForeignKeyValue;
};

//# sourceMappingURL=group-rows-by-foreign-key.util.js.map