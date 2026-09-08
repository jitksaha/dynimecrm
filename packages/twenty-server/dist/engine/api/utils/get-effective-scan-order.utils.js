"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "getEffectiveScanOrder", {
    enumerable: true,
    get: function() {
        return getEffectiveScanOrder;
    }
});
const _types = require("twenty-shared/types");
const _isascendingorderutils = require("./is-ascending-order.utils");
const getEffectiveScanOrder = (direction, isForwardPagination)=>{
    const areNullsPresentedLast = direction === _types.OrderByDirection.AscNullsLast || direction === _types.OrderByDirection.DescNullsLast;
    return {
        isAscending: (0, _isascendingorderutils.isAscendingOrder)(direction) === isForwardPagination,
        areNullsScannedLast: isForwardPagination ? areNullsPresentedLast : !areNullsPresentedLast
    };
};

//# sourceMappingURL=get-effective-scan-order.utils.js.map