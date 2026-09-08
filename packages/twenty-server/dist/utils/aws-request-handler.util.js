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
    get AWS_DEFAULT_CONNECTION_TIMEOUT_MS () {
        return AWS_DEFAULT_CONNECTION_TIMEOUT_MS;
    },
    get AWS_DEFAULT_MAX_SOCKETS () {
        return AWS_DEFAULT_MAX_SOCKETS;
    },
    get AWS_DEFAULT_REQUEST_TIMEOUT_MS () {
        return AWS_DEFAULT_REQUEST_TIMEOUT_MS;
    },
    get buildAwsRequestHandlerOptions () {
        return buildAwsRequestHandlerOptions;
    }
});
const AWS_DEFAULT_CONNECTION_TIMEOUT_MS = 10_000;
const AWS_DEFAULT_REQUEST_TIMEOUT_MS = 30_000;
const AWS_DEFAULT_MAX_SOCKETS = 100;
const buildAwsRequestHandlerOptions = ({ requestTimeoutMs = AWS_DEFAULT_REQUEST_TIMEOUT_MS, connectionTimeoutMs = AWS_DEFAULT_CONNECTION_TIMEOUT_MS, maxSockets = AWS_DEFAULT_MAX_SOCKETS } = {})=>({
        connectionTimeout: connectionTimeoutMs,
        requestTimeout: requestTimeoutMs,
        throwOnRequestTimeout: true,
        httpsAgent: {
            maxSockets
        }
    });

//# sourceMappingURL=aws-request-handler.util.js.map