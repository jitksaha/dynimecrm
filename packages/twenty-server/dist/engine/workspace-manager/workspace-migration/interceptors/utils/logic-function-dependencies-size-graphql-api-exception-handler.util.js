"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "logicFunctionDependenciesSizeGraphqlApiExceptionHandler", {
    enumerable: true,
    get: function() {
        return logicFunctionDependenciesSizeGraphqlApiExceptionHandler;
    }
});
const _graphqlerrorsutil = require("../../../../core-modules/graphql/utils/graphql-errors.util");
const logicFunctionDependenciesSizeGraphqlApiExceptionHandler = (exception)=>{
    const payload = {
        summary: {
            totalErrors: 1,
            logicFunction: 1
        },
        errors: {
            logicFunction: [
                {
                    type: 'update',
                    metadataName: 'logicFunction',
                    errors: [
                        {
                            code: exception.code,
                            message: 'Production dependencies are too large to install. Move packages that are not imported by your logic functions (UI libraries, dev tooling) out of "dependencies".',
                            userFriendlyMessage: exception.userFriendlyMessage,
                            value: exception.message
                        }
                    ],
                    flatEntityMinimalInformation: {}
                }
            ]
        }
    };
    throw new _graphqlerrorsutil.BaseGraphQLError(exception.message, _graphqlerrorsutil.ErrorCode.METADATA_VALIDATION_FAILED, {
        code: 'METADATA_VALIDATION_ERROR',
        ...payload,
        userFriendlyMessage: exception.userFriendlyMessage,
        message: 'Validation failed for 1 logicFunction'
    });
};

//# sourceMappingURL=logic-function-dependencies-size-graphql-api-exception-handler.util.js.map