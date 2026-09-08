"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "RoleToolWorkspaceService", {
    enumerable: true,
    get: function() {
        return RoleToolWorkspaceService;
    }
});
const _common = require("@nestjs/common");
const _applicationservice = require("../../../../core-modules/application/application.service");
const _objectpermissionservice = require("../../../object-permission/object-permission.service");
const _roleservice = require("../../role.service");
const _assignroletoworkspacemembertool = require("../assign-role-to-workspace-member.tool");
const _createroletool = require("../create-role.tool");
const _deleteroletool = require("../delete-role.tool");
const _listrolestool = require("../list-roles.tool");
const _updateroletool = require("../update-role.tool");
const _upsertobjectpermissionstool = require("../upsert-object-permissions.tool");
const _upsertrowlevelpermissionrulestool = require("../upsert-row-level-permission-rules.tool");
const _rowlevelpermissionpredicategroupservice = require("../../../row-level-permission-predicate/services/row-level-permission-predicate-group.service");
const _rowlevelpermissionpredicateservice = require("../../../row-level-permission-predicate/services/row-level-permission-predicate.service");
const _userroleservice = require("../../../user-role/user-role.service");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let RoleToolWorkspaceService = class RoleToolWorkspaceService {
    generateRoleTools(context) {
        const listRoles = (0, _listrolestool.createListRolesTool)(this.deps, context);
        const createRole = (0, _createroletool.createCreateRoleTool)(this.deps, context);
        const updateRole = (0, _updateroletool.createUpdateRoleTool)(this.deps, context);
        const deleteRole = (0, _deleteroletool.createDeleteRoleTool)(this.deps, context);
        const assignRoleToWorkspaceMember = (0, _assignroletoworkspacemembertool.createAssignRoleToWorkspaceMemberTool)(this.deps, context);
        const upsertObjectPermissions = (0, _upsertobjectpermissionstool.createUpsertObjectPermissionsTool)(this.deps, context);
        const upsertRowLevelPermissionRules = (0, _upsertrowlevelpermissionrulestool.createUpsertRowLevelPermissionRulesTool)(this.deps, context);
        return {
            [listRoles.name]: listRoles,
            [createRole.name]: createRole,
            [updateRole.name]: updateRole,
            [deleteRole.name]: deleteRole,
            [assignRoleToWorkspaceMember.name]: assignRoleToWorkspaceMember,
            [upsertObjectPermissions.name]: upsertObjectPermissions,
            [upsertRowLevelPermissionRules.name]: upsertRowLevelPermissionRules
        };
    }
    constructor(roleService, userRoleService, objectPermissionService, rowLevelPermissionPredicateService, rowLevelPermissionPredicateGroupService, applicationService){
        this.deps = {
            roleService,
            userRoleService,
            objectPermissionService,
            rowLevelPermissionPredicateService,
            rowLevelPermissionPredicateGroupService,
            applicationService
        };
    }
};
RoleToolWorkspaceService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _roleservice.RoleService === "undefined" ? Object : _roleservice.RoleService,
        typeof _userroleservice.UserRoleService === "undefined" ? Object : _userroleservice.UserRoleService,
        typeof _objectpermissionservice.ObjectPermissionService === "undefined" ? Object : _objectpermissionservice.ObjectPermissionService,
        typeof _rowlevelpermissionpredicateservice.RowLevelPermissionPredicateService === "undefined" ? Object : _rowlevelpermissionpredicateservice.RowLevelPermissionPredicateService,
        typeof _rowlevelpermissionpredicategroupservice.RowLevelPermissionPredicateGroupService === "undefined" ? Object : _rowlevelpermissionpredicategroupservice.RowLevelPermissionPredicateGroupService,
        typeof _applicationservice.ApplicationService === "undefined" ? Object : _applicationservice.ApplicationService
    ])
], RoleToolWorkspaceService);

//# sourceMappingURL=role-tool.workspace-service.js.map