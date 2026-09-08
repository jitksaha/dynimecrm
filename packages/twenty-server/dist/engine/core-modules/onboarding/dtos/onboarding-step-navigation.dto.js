"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "OnboardingStepNavigationDTO", {
    enumerable: true,
    get: function() {
        return OnboardingStepNavigationDTO;
    }
});
const _graphql = require("@nestjs/graphql");
const _onboardingstatusenum = require("../enums/onboarding-status.enum");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let OnboardingStepNavigationDTO = class OnboardingStepNavigationDTO {
};
_ts_decorate([
    (0, _graphql.Field)(()=>_onboardingstatusenum.OnboardingStatus, {
        nullable: true,
        description: 'Onboarding status the user landed on'
    }),
    _ts_metadata("design:type", Object)
], OnboardingStepNavigationDTO.prototype, "onboardingStatus", void 0);
_ts_decorate([
    (0, _graphql.Field)(()=>_onboardingstatusenum.OnboardingStatus, {
        nullable: true,
        description: 'Step the user can go back to from there, if any'
    }),
    _ts_metadata("design:type", Object)
], OnboardingStepNavigationDTO.prototype, "previousOnboardingStatus", void 0);
OnboardingStepNavigationDTO = _ts_decorate([
    (0, _graphql.ObjectType)('OnboardingStepNavigation')
], OnboardingStepNavigationDTO);

//# sourceMappingURL=onboarding-step-navigation.dto.js.map