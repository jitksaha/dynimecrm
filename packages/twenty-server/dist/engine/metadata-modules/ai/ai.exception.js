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
    get AiException () {
        return AiException;
    },
    get AiExceptionCode () {
        return AiExceptionCode;
    }
});
const _utils = require("twenty-shared/utils");
const _customexception = require("../../../utils/custom-exception");
var AiExceptionCode = /*#__PURE__*/ function(AiExceptionCode) {
    AiExceptionCode["AGENT_NOT_FOUND"] = "AGENT_NOT_FOUND";
    AiExceptionCode["AGENT_ALREADY_EXISTS"] = "AGENT_ALREADY_EXISTS";
    AiExceptionCode["AGENT_IS_STANDARD"] = "AGENT_IS_STANDARD";
    AiExceptionCode["AGENT_EXECUTION_FAILED"] = "AGENT_EXECUTION_FAILED";
    AiExceptionCode["INVALID_AGENT_INPUT"] = "INVALID_AGENT_INPUT";
    AiExceptionCode["THREAD_NOT_FOUND"] = "THREAD_NOT_FOUND";
    AiExceptionCode["WORKSPACE_NOT_FOUND"] = "WORKSPACE_NOT_FOUND";
    AiExceptionCode["CONTEXT_WINDOW_EXCEEDED"] = "CONTEXT_WINDOW_EXCEEDED";
    AiExceptionCode["INVALID_CHAT_THREAD_TITLE"] = "INVALID_CHAT_THREAD_TITLE";
    AiExceptionCode["MESSAGE_NOT_FOUND"] = "MESSAGE_NOT_FOUND";
    AiExceptionCode["QUESTION_NOT_PENDING"] = "QUESTION_NOT_PENDING";
    AiExceptionCode["INVALID_QUESTION_ANSWER"] = "INVALID_QUESTION_ANSWER";
    AiExceptionCode["API_KEY_NOT_CONFIGURED"] = "API_KEY_NOT_CONFIGURED";
    AiExceptionCode["USER_WORKSPACE_ID_NOT_FOUND"] = "USER_WORKSPACE_ID_NOT_FOUND";
    AiExceptionCode["ROLE_NOT_FOUND"] = "ROLE_NOT_FOUND";
    AiExceptionCode["ROLE_CANNOT_BE_ASSIGNED_TO_AGENTS"] = "ROLE_CANNOT_BE_ASSIGNED_TO_AGENTS";
    AiExceptionCode["RUN_AS_WORKSPACE_MEMBER_NOT_ALLOWED"] = "RUN_AS_WORKSPACE_MEMBER_NOT_ALLOWED";
    AiExceptionCode["RUN_AS_WORKSPACE_MEMBER_NOT_FOUND"] = "RUN_AS_WORKSPACE_MEMBER_NOT_FOUND";
    AiExceptionCode["RUN_AGENT_NOT_ALLOWED"] = "RUN_AGENT_NOT_ALLOWED";
    AiExceptionCode["NO_FAILED_TURN_TO_RETRY"] = "NO_FAILED_TURN_TO_RETRY";
    AiExceptionCode["STREAM_INTERRUPTED"] = "STREAM_INTERRUPTED";
    return AiExceptionCode;
}({});
const getAiExceptionUserFriendlyMessage = (code)=>{
    switch(code){
        case "AGENT_NOT_FOUND":
            return /*i18n*/ {
                id: "UxwIFr",
                message: "Agent not found."
            };
        case "AGENT_ALREADY_EXISTS":
            return /*i18n*/ {
                id: "Wnol69",
                message: "An agent with this name already exists."
            };
        case "AGENT_IS_STANDARD":
            return /*i18n*/ {
                id: "7XNKWU",
                message: "Standard agents cannot be modified."
            };
        case "AGENT_EXECUTION_FAILED":
            return /*i18n*/ {
                id: "kmAKx+",
                message: "Agent execution failed."
            };
        case "INVALID_AGENT_INPUT":
            return /*i18n*/ {
                id: "D/IcuN",
                message: "Invalid agent input."
            };
        case "THREAD_NOT_FOUND":
            return /*i18n*/ {
                id: "/VxChJ",
                message: "Chat thread not found."
            };
        case "WORKSPACE_NOT_FOUND":
            return /*i18n*/ {
                id: "EhVOPs",
                message: "Workspace not found."
            };
        case "CONTEXT_WINDOW_EXCEEDED":
            return /*i18n*/ {
                id: "y3SNqs",
                message: "This conversation is too long for the model. Start a new thread to continue."
            };
        case "INVALID_CHAT_THREAD_TITLE":
            return /*i18n*/ {
                id: "eLQjKW",
                message: "Chat thread title cannot be empty."
            };
        case "MESSAGE_NOT_FOUND":
            return /*i18n*/ {
                id: "erTWgO",
                message: "Chat message not found."
            };
        case "QUESTION_NOT_PENDING":
            return /*i18n*/ {
                id: "z7QJbR",
                message: "This question has already been answered."
            };
        case "INVALID_QUESTION_ANSWER":
            return /*i18n*/ {
                id: "pvMXsN",
                message: "Invalid answer for this question."
            };
        case "API_KEY_NOT_CONFIGURED":
            return /*i18n*/ {
                id: "fRWsMD",
                message: "API key is not configured."
            };
        case "USER_WORKSPACE_ID_NOT_FOUND":
            return /*i18n*/ {
                id: "lUEEso",
                message: "User workspace not found."
            };
        case "ROLE_NOT_FOUND":
            return /*i18n*/ {
                id: "/BTyf+",
                message: "Role not found."
            };
        case "ROLE_CANNOT_BE_ASSIGNED_TO_AGENTS":
            return /*i18n*/ {
                id: "rExecr",
                message: "This role cannot be assigned to agents."
            };
        case "RUN_AS_WORKSPACE_MEMBER_NOT_ALLOWED":
            return /*i18n*/ {
                id: "jrTmnG",
                message: "This action is not available for your request."
            };
        case "RUN_AS_WORKSPACE_MEMBER_NOT_FOUND":
            return /*i18n*/ {
                id: "rnnLQA",
                message: "Workspace member not found."
            };
        case "RUN_AGENT_NOT_ALLOWED":
            return /*i18n*/ {
                id: "jrTmnG",
                message: "This action is not available for your request."
            };
        case "NO_FAILED_TURN_TO_RETRY":
            return /*i18n*/ {
                id: "/RcKVn",
                message: "There is no failed message to retry."
            };
        case "STREAM_INTERRUPTED":
            return /*i18n*/ {
                id: "978SFC",
                message: "The response was interrupted before it could finish."
            };
        default:
            (0, _utils.assertUnreachable)(code);
    }
};
let AiException = class AiException extends _customexception.CustomException {
    constructor(message, code, { userFriendlyMessage } = {}){
        super(message, code, {
            userFriendlyMessage: userFriendlyMessage ?? getAiExceptionUserFriendlyMessage(code)
        });
    }
};

//# sourceMappingURL=ai.exception.js.map