"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "LogicFunctionExecutorModule", {
    enumerable: true,
    get: function() {
        return LogicFunctionExecutorModule;
    }
});
const _common = require("@nestjs/common");
const _typeorm = require("@nestjs/typeorm");
const _applicationregistrationvariableentity = require("../../application/application-registration-variable/application-registration-variable.entity");
const _applicationvariablemodule = require("../../application/application-variable/application-variable.module");
const _applicationmodule = require("../../application/application.module");
const _eventlogemittermodule = require("../../event-logs/emit/event-log-emitter.module");
const _eventloglivemodule = require("../../event-logs/live/event-log-live.module");
const _tokenmodule = require("../../auth/token/token.module");
const _billingmodule = require("../../billing/billing.module");
const _workspacedomainsmodule = require("../../domain/workspace-domains/workspace-domains.module");
const _featureflagmodule = require("../../feature-flag/feature-flag.module");
const _logicfunctionexecutorservice = require("./logic-function-executor.service");
const _secretencryptionmodule = require("../../secret-encryption/secret-encryption.module");
const _throttlermodule = require("../../throttler/throttler.module");
const _usagemodule = require("../../usage/usage.module");
const _workspaceentity = require("../../workspace/workspace.entity");
const _subscriptionsmodule = require("../../../subscriptions/subscriptions.module");
const _workspacecachemodule = require("../../../workspace-cache/workspace-cache.module");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let LogicFunctionExecutorModule = class LogicFunctionExecutorModule {
};
LogicFunctionExecutorModule = _ts_decorate([
    (0, _common.Module)({
        imports: [
            _throttlermodule.ThrottlerModule,
            _eventlogemittermodule.EventLogEmitterModule,
            _eventloglivemodule.EventLogLiveModule,
            _tokenmodule.TokenModule,
            _secretencryptionmodule.SecretEncryptionModule,
            _subscriptionsmodule.SubscriptionsModule,
            _workspacecachemodule.WorkspaceCacheModule,
            _billingmodule.BillingModule,
            _featureflagmodule.FeatureFlagModule,
            _workspacedomainsmodule.WorkspaceDomainsModule,
            _applicationmodule.ApplicationModule,
            _applicationvariablemodule.ApplicationVariableEntityModule,
            _usagemodule.UsageModule,
            _typeorm.TypeOrmModule.forFeature([
                _applicationregistrationvariableentity.ApplicationRegistrationVariableEntity,
                _workspaceentity.WorkspaceEntity
            ])
        ],
        providers: [
            _logicfunctionexecutorservice.LogicFunctionExecutorService
        ],
        exports: [
            _logicfunctionexecutorservice.LogicFunctionExecutorService
        ]
    })
], LogicFunctionExecutorModule);

//# sourceMappingURL=logic-function-executor.module.js.map