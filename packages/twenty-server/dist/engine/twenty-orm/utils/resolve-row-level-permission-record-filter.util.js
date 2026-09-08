/* @license Enterprise */ "use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "resolveRowLevelPermissionRecordFilter", {
    enumerable: true,
    get: function() {
        return resolveRowLevelPermissionRecordFilter;
    }
});
const _utils = require("twenty-shared/utils");
const _isuserauthcontextguard = require("../../core-modules/auth/guards/is-user-auth-context.guard");
const _buildrowlevelpermissionrecordfilterutil = require("./build-row-level-permission-record-filter.util");
const _resolveroleidsfromauthcontextutil = require("./resolve-role-ids-from-auth-context.util");
const resolveRowLevelPermissionRecordFilter = ({ internalContext, authContext, objectMetadata })=>{
    const roleIds = (0, _resolveroleidsfromauthcontextutil.resolveRoleIdsFromAuthContext)({
        authContext,
        userWorkspaceRoleMap: internalContext.userWorkspaceRoleMap,
        apiKeyRoleMap: internalContext.apiKeyRoleMap
    });
    const recordFilter = (0, _buildrowlevelpermissionrecordfilterutil.buildRowLevelPermissionRecordFilter)({
        flatRowLevelPermissionPredicateMaps: internalContext.flatRowLevelPermissionPredicateMaps,
        flatRowLevelPermissionPredicateGroupMaps: internalContext.flatRowLevelPermissionPredicateGroupMaps,
        flatFieldMetadataMaps: internalContext.flatFieldMetadataMaps,
        objectMetadata,
        roleIds,
        workspaceMember: (0, _isuserauthcontextguard.isUserAuthContext)(authContext) ? authContext.workspaceMember : undefined
    });
    if (!(0, _utils.isDefined)(recordFilter) || Object.keys(recordFilter).length === 0) {
        return null;
    }
    return recordFilter;
};

//# sourceMappingURL=resolve-row-level-permission-record-filter.util.js.map