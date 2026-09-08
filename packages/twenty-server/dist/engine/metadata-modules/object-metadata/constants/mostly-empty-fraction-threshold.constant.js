// A field is hinted as "mostly empty" when at least this fraction of records
// leave it empty, per Postgres planner statistics (pg_stats)
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "MOSTLY_EMPTY_FRACTION_THRESHOLD", {
    enumerable: true,
    get: function() {
        return MOSTLY_EMPTY_FRACTION_THRESHOLD;
    }
});
const MOSTLY_EMPTY_FRACTION_THRESHOLD = 0.95;

//# sourceMappingURL=mostly-empty-fraction-threshold.constant.js.map