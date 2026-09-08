"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "aiGraphqlApiExceptionHandler", {
    enumerable: true,
    get: function() {
        return aiGraphqlApiExceptionHandler;
    }
});
const _utils = require("twenty-shared/utils");
const _billingexception = require("../../../core-modules/billing/billing.exception");
const _billinggraphqlapiexceptionhandlerutil = require("../../../core-modules/billing/utils/billing-graphql-api-exception-handler.util");
const _graphqlerrorsutil = require("../../../core-modules/graphql/utils/graphql-errors.util");
const _aiexception = require("../ai.exception");
const aiGraphqlApiExceptionHandler = (error)=>{
    if (error instanceof _billingexception.BillingException) {
        return (0, _billinggraphqlapiexceptionhandlerutil.billingGraphqlApiExceptionHandler)(error);
    }
    if (error instanceof _aiexception.AiException) {
        switch(error.code){
            case _aiexception.AiExceptionCode.AGENT_NOT_FOUND:
            case _aiexception.AiExceptionCode.THREAD_NOT_FOUND:
            case _aiexception.AiExceptionCode.WORKSPACE_NOT_FOUND:
            case _aiexception.AiExceptionCode.MESSAGE_NOT_FOUND:
            case _aiexception.AiExceptionCode.ROLE_NOT_FOUND:
            case _aiexception.AiExceptionCode.RUN_AS_WORKSPACE_MEMBER_NOT_FOUND:
                throw new _graphqlerrorsutil.NotFoundError(error);
            case _aiexception.AiExceptionCode.CONTEXT_WINDOW_EXCEEDED:
            case _aiexception.AiExceptionCode.INVALID_AGENT_INPUT:
            case _aiexception.AiExceptionCode.INVALID_CHAT_THREAD_TITLE:
            case _aiexception.AiExceptionCode.QUESTION_NOT_PENDING:
            case _aiexception.AiExceptionCode.INVALID_QUESTION_ANSWER:
                throw new _graphqlerrorsutil.UserInputError(error);
            case _aiexception.AiExceptionCode.AGENT_ALREADY_EXISTS:
            case _aiexception.AiExceptionCode.NO_FAILED_TURN_TO_RETRY:
                throw new _graphqlerrorsutil.ConflictError(error);
            case _aiexception.AiExceptionCode.AGENT_IS_STANDARD:
            case _aiexception.AiExceptionCode.ROLE_CANNOT_BE_ASSIGNED_TO_AGENTS:
            case _aiexception.AiExceptionCode.RUN_AS_WORKSPACE_MEMBER_NOT_ALLOWED:
            case _aiexception.AiExceptionCode.RUN_AGENT_NOT_ALLOWED:
                throw new _graphqlerrorsutil.ForbiddenError(error);
            case _aiexception.AiExceptionCode.AGENT_EXECUTION_FAILED:
            case _aiexception.AiExceptionCode.API_KEY_NOT_CONFIGURED:
            case _aiexception.AiExceptionCode.USER_WORKSPACE_ID_NOT_FOUND:
            case _aiexception.AiExceptionCode.STREAM_INTERRUPTED:
                throw new _graphqlerrorsutil.InternalServerError(error);
            default:
                {
                    return (0, _utils.assertUnreachable)(error.code);
                }
        }
    }
    throw error;
};

//# sourceMappingURL=ai-graphql-api-exception-handler.util.js.map