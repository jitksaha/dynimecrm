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
    get evaluateRelativeDateFilter () {
        return evaluateRelativeDateFilter;
    },
    get parseAndEvaluateRelativeDateFilter () {
        return parseAndEvaluateRelativeDateFilter;
    }
});
const _temporalpolyfill = require("temporal-polyfill");
const _utils = require("twenty-shared/utils");
const parseAndEvaluateRelativeDateFilter = ({ dateToCheck, relativeDateString })=>{
    const relativeDateFilterValue = (0, _utils.safeParseRelativeDateFilterJsonStringified)(relativeDateString);
    if (!relativeDateFilterValue) {
        return false;
    }
    return evaluateRelativeDateFilter({
        dateToCheck,
        relativeDateFilterValue
    });
};
const evaluateRelativeDateFilter = ({ dateToCheck, relativeDateFilterValue })=>{
    if (relativeDateFilterValue.direction !== 'THIS' && !(0, _utils.isDefined)(relativeDateFilterValue.amount)) {
        return false;
    }
    const referenceZonedDateTime = _temporalpolyfill.Temporal.Instant.fromEpochMilliseconds(new Date().getTime()).toZonedDateTimeISO('UTC');
    const { start, end } = (0, _utils.resolveRelativeDateTimeFilter)(relativeDateFilterValue, referenceZonedDateTime);
    const dateToCheckInstant = _temporalpolyfill.Temporal.Instant.fromEpochMilliseconds(dateToCheck.getTime());
    // Half-open [start, end): the period end is exclusive (it is the start of the
    // next period), so a value that lands exactly on a boundary is only counted in
    // one of two adjacent periods.
    return _temporalpolyfill.Temporal.Instant.compare(dateToCheckInstant, start.toInstant()) >= 0 && _temporalpolyfill.Temporal.Instant.compare(dateToCheckInstant, end.toInstant()) < 0;
};

//# sourceMappingURL=parse-and-evaluate-relative-date-filter.util.js.map