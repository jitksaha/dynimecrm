"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "toRoleToolErrorMessage", {
    enumerable: true,
    get: function() {
        return toRoleToolErrorMessage;
    }
});
const _formatvalidationerrorsutil = require("../../../../core-modules/tool-provider/utils/format-validation-errors.util");
const _workspacemigrationbuilderexception = require("../../../../workspace-manager/workspace-migration/exceptions/workspace-migration-builder-exception");
const toRoleToolErrorMessage = (error)=>{
    if (error instanceof _workspacemigrationbuilderexception.WorkspaceMigrationBuilderException) {
        return (0, _formatvalidationerrorsutil.formatValidationErrors)(error);
    }
    return error instanceof Error ? error.message : String(error);
};

//# sourceMappingURL=to-role-tool-error-message.util.js.map