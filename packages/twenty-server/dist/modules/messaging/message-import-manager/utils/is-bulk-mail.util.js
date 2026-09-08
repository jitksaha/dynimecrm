"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "isBulkMail", {
    enumerable: true,
    get: function() {
        return isBulkMail;
    }
});
const _guards = require("@sniptt/guards");
const BULK_LIST_HEADER_NAMES = [
    'list-unsubscribe',
    'list-id'
];
const BULK_PRECEDENCE_VALUES = [
    'bulk',
    'list',
    'junk'
];
const isBulkMail = (headers)=>headers.some(({ name, value })=>{
        const headerName = name.toLowerCase();
        const headerValue = value.trim().toLowerCase();
        if (BULK_LIST_HEADER_NAMES.includes(headerName)) {
            return (0, _guards.isNonEmptyString)(headerValue);
        }
        if (headerName === 'precedence') {
            return BULK_PRECEDENCE_VALUES.includes(headerValue);
        }
        if (headerName === 'auto-submitted') {
            return (0, _guards.isNonEmptyString)(headerValue) && headerValue !== 'no';
        }
        return false;
    });

//# sourceMappingURL=is-bulk-mail.util.js.map