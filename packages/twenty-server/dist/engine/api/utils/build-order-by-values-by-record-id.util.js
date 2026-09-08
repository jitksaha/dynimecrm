"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "buildOrderByValuesByRecordId", {
    enumerable: true,
    get: function() {
        return buildOrderByValuesByRecordId;
    }
});
const _utils = require("twenty-shared/utils");
const _computeorderbyleafcolumnutil = require("./compute-order-by-leaf-column.util");
const _resolveorderbyleavesutils = require("./resolve-order-by-leaves.utils");
const buildOrderByValuesByRecordId = ({ orderByLeaves, records, rawRows, objectNameSingular })=>{
    const cursorLeaves = orderByLeaves.filter(_resolveorderbyleavesutils.checkIfLeafCanCarryCursorValue);
    if (cursorLeaves.length === 0 || records.length === 0) {
        return {};
    }
    // The runner rejects row-multiplying joins, so raw rows and entities match
    // one to one; the root id raw alias keys the pairing when available
    const rootIdRawAlias = `${objectNameSingular}_id`;
    const rawRowsByRecordId = new Map();
    rawRows.forEach((rawRow, index)=>{
        const recordId = rawRow[rootIdRawAlias] ?? records[index]?.id;
        if ((0, _utils.isDefined)(recordId)) {
            rawRowsByRecordId.set(recordId, rawRow);
        }
    });
    const orderByValuesByRecordId = {};
    for (const record of records){
        const rawRow = rawRowsByRecordId.get(record.id);
        if (!(0, _utils.isDefined)(rawRow)) {
            continue;
        }
        const orderByValues = {};
        for (const leaf of cursorLeaves){
            const leafColumn = (0, _computeorderbyleafcolumnutil.computeOrderByLeafColumn)(leaf, objectNameSingular);
            if (!(0, _utils.isDefined)(leafColumn)) {
                continue;
            }
            // Every ordered column is selected under this raw alias, by the find
            // options for root columns and by addRelationOrderColumnsToBuilder for
            // joined ones
            const rawValue = rawRow[`${leafColumn.tableAlias}_${leafColumn.columnName}`];
            let container = orderByValues;
            for (const key of leaf.path.slice(0, -1)){
                container[key] = (0, _utils.isDefined)(container[key]) ? container[key] : {};
                container = container[key];
            }
            container[leaf.path[leaf.path.length - 1]] = rawValue;
        }
        orderByValuesByRecordId[record.id] = orderByValues;
    }
    return orderByValuesByRecordId;
};

//# sourceMappingURL=build-order-by-values-by-record-id.util.js.map