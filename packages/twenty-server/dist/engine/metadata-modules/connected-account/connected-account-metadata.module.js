"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "ConnectedAccountMetadataModule", {
    enumerable: true,
    get: function() {
        return ConnectedAccountMetadataModule;
    }
});
const _common = require("@nestjs/common");
const _typeorm = require("@nestjs/typeorm");
const _connectionprovidermodule = require("../../core-modules/application/connection-provider/connection-provider.module");
const _appoauthrefreshmodule = require("../../core-modules/application/connection-provider/refresh/app-oauth-refresh.module");
const _featureflagmodule = require("../../core-modules/feature-flag/feature-flag.module");
const _userworkspaceentity = require("../../core-modules/user-workspace/user-workspace.entity");
const _calendarchannelentity = require("../calendar-channel/entities/calendar-channel.entity");
const _connectedaccountmetadataservice = require("./connected-account-metadata.service");
const _connectedaccountentity = require("./entities/connected-account.entity");
const _connectedaccountgraphqlapiexceptioninterceptor = require("./interceptors/connected-account-graphql-api-exception.interceptor");
const _connectedaccountresolver = require("./resolvers/connected-account.resolver");
const _connectedaccountownershiptransferservice = require("./services/connected-account-ownership-transfer.service");
const _workspacemanyorallflatentitymapscachemodule = require("../flat-entity/services/workspace-many-or-all-flat-entity-maps-cache.module");
const _messagechannelentity = require("../message-channel/entities/message-channel.entity");
const _permissionsmodule = require("../permissions/permissions.module");
const _userrolemodule = require("../user-role/user-role.module");
const _workspaceeventemittermodule = require("../../workspace-event-emitter/workspace-event-emitter.module");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let ConnectedAccountMetadataModule = class ConnectedAccountMetadataModule {
};
ConnectedAccountMetadataModule = _ts_decorate([
    (0, _common.Module)({
        imports: [
            _typeorm.TypeOrmModule.forFeature([
                _connectedaccountentity.ConnectedAccountEntity,
                _calendarchannelentity.CalendarChannelEntity,
                _messagechannelentity.MessageChannelEntity,
                _userworkspaceentity.UserWorkspaceEntity
            ]),
            _appoauthrefreshmodule.AppOAuthRefreshModule,
            _connectionprovidermodule.ConnectionProviderModule,
            _featureflagmodule.FeatureFlagModule,
            _permissionsmodule.PermissionsModule,
            _userrolemodule.UserRoleModule,
            _workspaceeventemittermodule.WorkspaceEventEmitterModule,
            _workspacemanyorallflatentitymapscachemodule.WorkspaceManyOrAllFlatEntityMapsCacheModule
        ],
        providers: [
            _connectedaccountmetadataservice.ConnectedAccountMetadataService,
            _connectedaccountownershiptransferservice.ConnectedAccountOwnershipTransferService,
            _connectedaccountresolver.ConnectedAccountResolver,
            _connectedaccountgraphqlapiexceptioninterceptor.ConnectedAccountGraphqlApiExceptionInterceptor
        ],
        exports: [
            _connectedaccountmetadataservice.ConnectedAccountMetadataService,
            _connectedaccountownershiptransferservice.ConnectedAccountOwnershipTransferService
        ]
    })
], ConnectedAccountMetadataModule);

//# sourceMappingURL=connected-account-metadata.module.js.map