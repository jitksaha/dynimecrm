"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "tagAiChatKindScope", {
    enumerable: true,
    get: function() {
        return tagAiChatKindScope;
    }
});
const _node = /*#__PURE__*/ _interop_require_wildcard(require("@sentry/node"));
const _aichatstreamfunctionidconstant = require("../constants/ai-chat-stream-function-id.constant");
const _aichatworkspacesetupstreamfunctionidconstant = require("../constants/ai-chat-workspace-setup-stream-function-id.constant");
function _getRequireWildcardCache(nodeInterop) {
    if (typeof WeakMap !== "function") return null;
    var cacheBabelInterop = new WeakMap();
    var cacheNodeInterop = new WeakMap();
    return (_getRequireWildcardCache = function(nodeInterop) {
        return nodeInterop ? cacheNodeInterop : cacheBabelInterop;
    })(nodeInterop);
}
function _interop_require_wildcard(obj, nodeInterop) {
    if (!nodeInterop && obj && obj.__esModule) {
        return obj;
    }
    if (obj === null || typeof obj !== "object" && typeof obj !== "function") {
        return {
            default: obj
        };
    }
    var cache = _getRequireWildcardCache(nodeInterop);
    if (cache && cache.has(obj)) {
        return cache.get(obj);
    }
    var newObj = {
        __proto__: null
    };
    var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;
    for(var key in obj){
        if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) {
            var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;
            if (desc && (desc.get || desc.set)) {
                Object.defineProperty(newObj, key, desc);
            } else {
                newObj[key] = obj[key];
            }
        }
    }
    newObj.default = obj;
    if (cache) {
        cache.set(obj, newObj);
    }
    return newObj;
}
const tagAiChatKindScope = ({ isWorkspaceSetupThread })=>{
    _node.getCurrentScope().setTag('chatKind', isWorkspaceSetupThread ? _aichatworkspacesetupstreamfunctionidconstant.AI_CHAT_WORKSPACE_SETUP_STREAM_FUNCTION_ID : _aichatstreamfunctionidconstant.AI_CHAT_STREAM_FUNCTION_ID);
};

//# sourceMappingURL=tag-ai-chat-kind-scope.util.js.map