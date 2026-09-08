"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "UserModule", {
    enumerable: true,
    get: function() {
        return UserModule;
    }
});
const _common = require("@nestjs/common");
const _typeorm = require("@nestjs/typeorm");
const _typeormmodule = require("../../../database/typeorm/typeorm.module");
const _coreentitycachemodule = require("../../core-entity-cache/core-entity-cache.module");
const _workspacedomainsmodule = require("../domain/workspace-domains/workspace-domains.module");
const _emailverificationmodule = require("../email-verification/email-verification.module");
const _featureflagmodule = require("../feature-flag/feature-flag.module");
const _filemodule = require("../file/file.module");
const _keyvaluepairentity = require("../key-value-pair/key-value-pair.entity");
const _onboardingmodule = require("../onboarding/onboarding.module");
const _userworkspaceentity = require("../user-workspace/user-workspace.entity");
const _userworkspacemodule = require("../user-workspace/user-workspace.module");
const _globalworkspacememberlistener = require("./services/global-workspace-member.listener");
const _userentitycacheproviderservice = require("./services/user-entity-cache-provider.service");
const _workspaceflatworkspacemembermapcacheservice = require("./services/workspace-flat-workspace-member-map-cache.service");
const _workspacemembertranspilerservice = require("./services/workspace-member-transpiler.service");
const _uservarsmodule = require("./user-vars/user-vars.module");
const _userentity = require("./user.entity");
const _userresolver = require("./user.resolver");
const _workspacemodule = require("../workspace/workspace.module");
const _connectedaccountmetadatamodule = require("../../metadata-modules/connected-account/connected-account-metadata.module");
const _permissionsmodule = require("../../metadata-modules/permissions/permissions.module");
const _userrolemodule = require("../../metadata-modules/user-role/user-role.module");
const _workspacecachemodule = require("../../workspace-cache/workspace-cache.module");
const _userservice = require("./services/user.service");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let UserModule = class UserModule {
};
UserModule = _ts_decorate([
    (0, _common.Module)({
        imports: [
            _typeorm.TypeOrmModule.forFeature([
                _userentity.UserEntity
            ]),
            _typeormmodule.TypeORMModule,
            _filemodule.FileModule,
            _workspacemodule.WorkspaceModule,
            _onboardingmodule.OnboardingModule,
            _typeorm.TypeOrmModule.forFeature([
                _keyvaluepairentity.KeyValuePairEntity,
                _userworkspaceentity.UserWorkspaceEntity
            ]),
            _uservarsmodule.UserVarsModule,
            _userworkspacemodule.UserWorkspaceModule,
            _userrolemodule.UserRoleModule,
            _connectedaccountmetadatamodule.ConnectedAccountMetadataModule,
            _featureflagmodule.FeatureFlagModule,
            _permissionsmodule.PermissionsModule,
            _emailverificationmodule.EmailVerificationModule,
            _workspacedomainsmodule.WorkspaceDomainsModule,
            _workspacecachemodule.WorkspaceCacheModule,
            _coreentitycachemodule.CoreEntityCacheModule
        ],
        exports: [
            _userservice.UserService,
            _workspacemembertranspilerservice.WorkspaceMemberTranspiler
        ],
        providers: [
            _userservice.UserService,
            _userresolver.UserResolver,
            _userentitycacheproviderservice.UserEntityCacheProviderService,
            _workspacemembertranspilerservice.WorkspaceMemberTranspiler,
            _workspaceflatworkspacemembermapcacheservice.WorkspaceFlatWorkspaceMemberMapCacheService,
            _globalworkspacememberlistener.GlobalWorkspaceMemberListener
        ]
    })
], UserModule);

//# sourceMappingURL=user.module.js.map