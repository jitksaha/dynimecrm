"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "isValidTimeZone", {
    enumerable: true,
    get: function() {
        return isValidTimeZone;
    }
});
const isValidTimeZone = (timeZone)=>{
    try {
        new Intl.DateTimeFormat('en-US', {
            timeZone
        });
        return true;
    } catch  {
        return false;
    }
};

//# sourceMappingURL=is-valid-time-zone.util.js.map