"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "isTransientClickHouseNetworkError", {
    enumerable: true,
    get: function() {
        return isTransientClickHouseNetworkError;
    }
});
const TRANSIENT_NETWORK_ERROR_CODES = new Set([
    'ECONNRESET',
    'ECONNABORTED',
    'EPIPE',
    'ETIMEDOUT'
]);
const TRANSIENT_NETWORK_ERROR_MESSAGES = new Set([
    'Timeout error.',
    'socket hang up'
]);
const isTransientClickHouseNetworkError = (error)=>{
    if (!(error instanceof Error)) {
        return false;
    }
    const code = error.code;
    if (code !== undefined && TRANSIENT_NETWORK_ERROR_CODES.has(code) || TRANSIENT_NETWORK_ERROR_MESSAGES.has(error.message)) {
        return true;
    }
    return isTransientClickHouseNetworkError(error.cause);
};

//# sourceMappingURL=is-transient-clickhouse-network-error.util.js.map