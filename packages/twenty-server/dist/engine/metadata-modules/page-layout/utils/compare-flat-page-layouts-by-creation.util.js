"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "compareFlatPageLayoutsByCreation", {
    enumerable: true,
    get: function() {
        return compareFlatPageLayoutsByCreation;
    }
});
const compareFlatPageLayoutsByCreation = (first, second)=>first.createdAt.localeCompare(second.createdAt) || first.id.localeCompare(second.id);

//# sourceMappingURL=compare-flat-page-layouts-by-creation.util.js.map