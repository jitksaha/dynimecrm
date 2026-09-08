"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "FILE_STATUS", {
    enumerable: true,
    get: function() {
        return FILE_STATUS;
    }
});
const FILE_STATUS = {
    // File record exists but bytes have not been confirmed in storage yet
    // (direct upload initiated, waiting for the client to upload and confirm).
    PENDING: 'PENDING',
    UPLOADED: 'UPLOADED'
};

//# sourceMappingURL=file-status.types.js.map