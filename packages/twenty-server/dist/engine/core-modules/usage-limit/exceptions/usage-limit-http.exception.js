"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "UsageLimitHttpException", {
    enumerable: true,
    get: function() {
        return UsageLimitHttpException;
    }
});
const _common = require("@nestjs/common");
let UsageLimitHttpException = class UsageLimitHttpException extends _common.HttpException {
    getResponseBody() {
        return this.responseBody;
    }
    getResponseHeaders() {
        return this.responseHeaders;
    }
    constructor(responseBody, responseHeaders){
        super(responseBody, _common.HttpStatus.TOO_MANY_REQUESTS), this.responseBody = responseBody, this.responseHeaders = responseHeaders;
        this.message = responseBody.messages[0];
    }
};

//# sourceMappingURL=usage-limit-http.exception.js.map