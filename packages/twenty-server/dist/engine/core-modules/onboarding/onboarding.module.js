"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "OnboardingModule", {
    enumerable: true,
    get: function() {
        return OnboardingModule;
    }
});
const _common = require("@nestjs/common");
const _typeorm = require("@nestjs/typeorm");
const _billingmodule = require("../billing/billing.module");
const _onboardingresolver = require("./onboarding.resolver");
const _onboardingservice = require("./onboarding.service");
const _uservarsmodule = require("../user/user-vars/user-vars.module");
const _userworkspaceentity = require("../user-workspace/user-workspace.entity");
const _workspaceentity = require("../workspace/workspace.entity");
const _onboardinginvitesuggestionsmodule = require("../../../modules/onboarding-invite-suggestions/onboarding-invite-suggestions.module");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let OnboardingModule = class OnboardingModule {
};
OnboardingModule = _ts_decorate([
    (0, _common.Module)({
        imports: [
            _billingmodule.BillingModule,
            _uservarsmodule.UserVarsModule,
            _onboardinginvitesuggestionsmodule.OnboardingInviteSuggestionsModule,
            _typeorm.TypeOrmModule.forFeature([
                _workspaceentity.WorkspaceEntity,
                _userworkspaceentity.UserWorkspaceEntity
            ])
        ],
        exports: [
            _onboardingservice.OnboardingService
        ],
        providers: [
            _onboardingservice.OnboardingService,
            _onboardingresolver.OnboardingResolver
        ]
    })
], OnboardingModule);

//# sourceMappingURL=onboarding.module.js.map