"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "OnboardingInviteSuggestionsModule", {
    enumerable: true,
    get: function() {
        return OnboardingInviteSuggestionsModule;
    }
});
const _common = require("@nestjs/common");
const _typeorm = require("@nestjs/typeorm");
const _connectedaccountentity = require("../../engine/metadata-modules/connected-account/entities/connected-account.entity");
const _oauth2clientmanagermodule = require("../connected-account/oauth2-client-manager/oauth2-client-manager.module");
const _calendarattendeesservice = require("./services/calendar-attendees.service");
const _googlecalendarattendeesservice = require("./services/google-calendar-attendees.service");
const _microsoftcalendarattendeesservice = require("./services/microsoft-calendar-attendees.service");
const _onboardinginvitesuggestionsservice = require("./services/onboarding-invite-suggestions.service");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let OnboardingInviteSuggestionsModule = class OnboardingInviteSuggestionsModule {
};
OnboardingInviteSuggestionsModule = _ts_decorate([
    (0, _common.Module)({
        imports: [
            _oauth2clientmanagermodule.OAuth2ClientManagerModule,
            _typeorm.TypeOrmModule.forFeature([
                _connectedaccountentity.ConnectedAccountEntity
            ])
        ],
        providers: [
            _googlecalendarattendeesservice.GoogleCalendarAttendeesService,
            _microsoftcalendarattendeesservice.MicrosoftCalendarAttendeesService,
            _calendarattendeesservice.CalendarAttendeesService,
            _onboardinginvitesuggestionsservice.OnboardingInviteSuggestionsService
        ],
        exports: [
            _onboardinginvitesuggestionsservice.OnboardingInviteSuggestionsService
        ]
    })
], OnboardingInviteSuggestionsModule);

//# sourceMappingURL=onboarding-invite-suggestions.module.js.map