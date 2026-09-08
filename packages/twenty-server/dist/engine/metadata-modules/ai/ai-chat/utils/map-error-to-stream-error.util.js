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
    get STREAM_EXECUTION_FAILED_CODE () {
        return STREAM_EXECUTION_FAILED_CODE;
    },
    get mapErrorToStreamError () {
        return mapErrorToStreamError;
    }
});
const _aiexception = require("../../ai.exception");
const STREAM_EXECUTION_FAILED_CODE = 'STREAM_EXECUTION_FAILED';
const STREAM_ERROR_MESSAGE_MAX_LENGTH = 2000;
const truncateMessage = (message)=>message.length > STREAM_ERROR_MESSAGE_MAX_LENGTH ? `${message.slice(0, STREAM_ERROR_MESSAGE_MAX_LENGTH)}…` : message;
const mapErrorToStreamError = (error)=>{
    if (error instanceof _aiexception.AiException) {
        return {
            code: error.code,
            message: truncateMessage(error.message)
        };
    }
    return {
        code: STREAM_EXECUTION_FAILED_CODE,
        message: truncateMessage(error instanceof Error ? error.message : 'Stream execution failed')
    };
};

//# sourceMappingURL=map-error-to-stream-error.util.js.map