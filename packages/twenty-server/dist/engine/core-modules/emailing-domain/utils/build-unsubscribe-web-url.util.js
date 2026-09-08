"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "buildUnsubscribeWebUrl", {
    enumerable: true,
    get: function() {
        return buildUnsubscribeWebUrl;
    }
});
const buildUnsubscribeWebUrl = ({ unsubscribeBaseUrl, token })=>`${unsubscribeBaseUrl}/emailing/unsubscribe?t=${token}`;

//# sourceMappingURL=build-unsubscribe-web-url.util.js.map