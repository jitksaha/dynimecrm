"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "buildOrderByColumnsToSelect", {
    enumerable: true,
    get: function() {
        return buildOrderByColumnsToSelect;
    }
});
const _utils = require("twenty-shared/utils");
const _computeorderbyleafcolumnutil = require("../../../utils/compute-order-by-leaf-column.util");
const _resolveorderbyleavesutils = require("../../../utils/resolve-order-by-leaves.utils");
const buildOrderByColumnsToSelect = ({ orderBy, flatObjectMetadata, flatFieldMetadataMaps })=>{
    const columnsToSelect = {};
    for (const leaf of (0, _resolveorderbyleavesutils.resolveOrderByLeaves)({
        orderBy,
        flatObjectMetadata,
        flatFieldMetadataMaps
    }).filter(_resolveorderbyleavesutils.checkIfLeafCanCarryCursorValue)){
        // Relation orderBy values live on a joined alias, not on a root column:
        // cursors read them from the ordering join's raw rows instead
        if (leaf.kind === 'relation') {
            continue;
        }
        const leafColumn = (0, _computeorderbyleafcolumnutil.computeOrderByLeafColumn)(leaf, flatObjectMetadata.nameSingular);
        if ((0, _utils.isDefined)(leafColumn)) {
            columnsToSelect[leafColumn.columnName] = true;
        }
    }
    return columnsToSelect;
};

//# sourceMappingURL=build-order-by-columns-to-select.js.map