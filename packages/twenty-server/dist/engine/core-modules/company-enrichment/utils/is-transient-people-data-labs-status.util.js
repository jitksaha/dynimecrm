"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "isTransientPeopleDataLabsStatus", {
    enumerable: true,
    get: function() {
        return isTransientPeopleDataLabsStatus;
    }
});
const isTransientPeopleDataLabsStatus = (status)=>status === 408 || status === 429 || status >= 500;

//# sourceMappingURL=is-transient-people-data-labs-status.util.js.map