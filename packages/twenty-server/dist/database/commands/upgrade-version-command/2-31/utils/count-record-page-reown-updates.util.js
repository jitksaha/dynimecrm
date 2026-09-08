"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "countRecordPageReownUpdates", {
    enumerable: true,
    get: function() {
        return countRecordPageReownUpdates;
    }
});
const countRecordPageReownUpdates = (reownUpdates)=>Object.values(reownUpdates).reduce((count, updates)=>count + updates.length, 0);

//# sourceMappingURL=count-record-page-reown-updates.util.js.map