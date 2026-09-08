"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "isWorkspaceObjectNotFoundError", {
    enumerable: true,
    get: function() {
        return isWorkspaceObjectNotFoundError;
    }
});
const _EntityMetadataNotFoundError = require("typeorm/error/EntityMetadataNotFoundError");
const _twentyormexception = require("../../../../engine/twenty-orm/exceptions/twenty-orm.exception");
const isWorkspaceObjectNotFoundError = (error)=>error instanceof _EntityMetadataNotFoundError.EntityMetadataNotFoundError || error instanceof _twentyormexception.TwentyOrmException && error.code === _twentyormexception.TwentyOrmExceptionCode.UNKNOWN_OBJECT;

//# sourceMappingURL=is-workspace-object-not-found-error.util.js.map