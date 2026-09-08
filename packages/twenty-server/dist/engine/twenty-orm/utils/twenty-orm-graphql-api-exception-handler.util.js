"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "twentyOrmGraphqlApiExceptionHandler", {
    enumerable: true,
    get: function() {
        return twentyOrmGraphqlApiExceptionHandler;
    }
});
const _utils = require("twenty-shared/utils");
const _graphqlerrorsutil = require("../../core-modules/graphql/utils/graphql-errors.util");
const _twentyormexception = require("../exceptions/twenty-orm.exception");
const _istwentyormuserinputerrorutil = require("./is-twenty-orm-user-input-error.util");
const twentyOrmGraphqlApiExceptionHandler = (error)=>{
    switch(true){
        case error.code === _twentyormexception.TwentyOrmExceptionCode.DUPLICATE_ENTRY_DETECTED:
            {
                const duplicateKeyError = error;
                const extensions = {
                    userFriendlyMessage: error.userFriendlyMessage,
                    ...(0, _utils.isDefined)(duplicateKeyError.conflictingRecordId) && (0, _utils.isDefined)(duplicateKeyError.conflictingObjectNameSingular) ? {
                        conflictingRecordId: duplicateKeyError.conflictingRecordId,
                        conflictingObjectNameSingular: duplicateKeyError.conflictingObjectNameSingular
                    } : {}
                };
                throw new _graphqlerrorsutil.UserInputError(error.message, extensions);
            }
        case (0, _istwentyormuserinputerrorutil.isTwentyOrmUserInputError)(error):
            throw new _graphqlerrorsutil.UserInputError(error.message, {
                userFriendlyMessage: error.userFriendlyMessage
            });
        default:
            {
                throw error;
            }
    }
};

//# sourceMappingURL=twenty-orm-graphql-api-exception-handler.util.js.map