"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
}
_export(exports, {
    get decodeCursor () {
        return decodeCursor;
    },
    get encodeCursor () {
        return encodeCursor;
    },
    get encodeCursorData () {
        return encodeCursorData;
    },
    get getCursor () {
        return getCursor;
    }
});
const _utils = require("twenty-shared/utils");
const _commonqueryrunnerexception = require("../../../common/common-query-runners/errors/common-query-runner.exception");
const _standarderrormessageconstant = require("../../../common/common-query-runners/errors/standard-error-message.constant");
const _resolveorderbyleavesutils = require("../../../utils/resolve-order-by-leaves.utils");
const decodeCursor = (cursor)=>{
    try {
        return JSON.parse(Buffer.from(cursor, 'base64').toString());
    } catch  {
        throw new _commonqueryrunnerexception.CommonQueryRunnerException(`Invalid cursor: ${cursor}`, _commonqueryrunnerexception.CommonQueryRunnerExceptionCode.INVALID_CURSOR, {
            userFriendlyMessage: _standarderrormessageconstant.STANDARD_ERROR_MESSAGE
        });
    }
};
const encodeCursor = ({ objectRecord, order, flatObjectMetadata, flatObjectMetadataMaps, flatFieldMetadataMaps, orderByValuesFromScan })=>{
    // oxlint-disable-next-line typescript/no-explicit-any
    const orderByValues = {};
    for (const leaf of (0, _resolveorderbyleavesutils.resolveOrderByLeaves)({
        orderBy: order,
        flatObjectMetadata,
        flatObjectMetadataMaps,
        flatFieldMetadataMaps
    }).filter(_resolveorderbyleavesutils.checkIfLeafCanCarryCursorValue)){
        // Read the ordered value along the leaf's path: a null container yields
        // null (the row belongs to the NULL block of the ordering), a missing one
        // yields undefined, which JSON serialization drops
        const [rootKey, ...nestedKeys] = leaf.path;
        const valueSource = orderByValuesFromScan ?? objectRecord;
        let leafValue = valueSource[rootKey];
        for (const key of nestedKeys){
            if (leafValue === null) {
                break;
            }
            leafValue = (0, _utils.isPlainObject)(leafValue) ? leafValue[key] : undefined;
        }
        // An unloaded relation cannot contribute a value at all: leave the key out
        // instead of writing an empty object
        if (leaf.kind === 'relation' && leafValue === undefined) {
            continue;
        }
        // Write it back under the same path
        let container = orderByValues;
        for (const key of leaf.path.slice(0, -1)){
            container[key] = (0, _utils.isPlainObject)(container[key]) ? container[key] : {};
            container = container[key];
        }
        container[leaf.path[leaf.path.length - 1]] = leafValue;
    }
    const cursorData = {
        ...orderByValues,
        id: objectRecord.id
    };
    return encodeCursorData(cursorData);
};
const encodeCursorData = (cursorData)=>{
    return Buffer.from(JSON.stringify(cursorData)).toString('base64');
};
const getCursor = (// oxlint-disable-next-line typescript/no-explicit-any
args)=>{
    if (args.after) return decodeCursor(args.after);
    if (args.before) return decodeCursor(args.before);
    return undefined;
};

//# sourceMappingURL=cursors.util.js.map