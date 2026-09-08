"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "getWorkspaceRepositoryWithOptionalTransaction", {
    enumerable: true,
    get: function() {
        return getWorkspaceRepositoryWithOptionalTransaction;
    }
});
const _utils = require("twenty-shared/utils");
const getWorkspaceRepositoryWithOptionalTransaction = ({ objectMetadataName, transactionScope, workspaceOrmManager, rolePermissionConfig })=>(0, _utils.isDefined)(transactionScope) ? transactionScope.getRepository(objectMetadataName, rolePermissionConfig) : workspaceOrmManager.getRepository(objectMetadataName, rolePermissionConfig);

//# sourceMappingURL=get-workspace-repository-with-optional-transaction.util.js.map