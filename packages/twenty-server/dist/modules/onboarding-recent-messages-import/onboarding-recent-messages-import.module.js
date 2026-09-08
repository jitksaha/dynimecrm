"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "OnboardingRecentMessagesImportModule", {
    enumerable: true,
    get: function() {
        return OnboardingRecentMessagesImportModule;
    }
});
const _common = require("@nestjs/common");
const _typeorm = require("@nestjs/typeorm");
const _messagechannelentity = require("../../engine/metadata-modules/message-channel/entities/message-channel.entity");
const _oauth2clientmanagermodule = require("../connected-account/oauth2-client-manager/oauth2-client-manager.module");
const _messagingcommonmodule = require("../messaging/common/messaging-common.module");
const _messagingimapdrivermodule = require("../messaging/message-import-manager/drivers/imap/messaging-imap-driver.module");
const _messagingimportmanagermodule = require("../messaging/message-import-manager/messaging-import-manager.module");
const _gmailrecentmessagesservice = require("./services/gmail-recent-messages.service");
const _imaprecentmessagesservice = require("./services/imap-recent-messages.service");
const _microsoftrecentmessagesservice = require("./services/microsoft-recent-messages.service");
const _onboardingrecentmessagesimportservice = require("./services/onboarding-recent-messages-import.service");
const _recentmessagesservice = require("./services/recent-messages.service");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let OnboardingRecentMessagesImportModule = class OnboardingRecentMessagesImportModule {
};
OnboardingRecentMessagesImportModule = _ts_decorate([
    (0, _common.Module)({
        imports: [
            _typeorm.TypeOrmModule.forFeature([
                _messagechannelentity.MessageChannelEntity
            ]),
            _oauth2clientmanagermodule.OAuth2ClientManagerModule,
            _messagingimapdrivermodule.MessagingIMAPDriverModule,
            _messagingcommonmodule.MessagingCommonModule,
            _messagingimportmanagermodule.MessagingImportManagerModule
        ],
        providers: [
            _gmailrecentmessagesservice.GmailRecentMessagesService,
            _microsoftrecentmessagesservice.MicrosoftRecentMessagesService,
            _imaprecentmessagesservice.ImapRecentMessagesService,
            _recentmessagesservice.RecentMessagesService,
            _onboardingrecentmessagesimportservice.OnboardingRecentMessagesImportService
        ],
        exports: [
            _onboardingrecentmessagesimportservice.OnboardingRecentMessagesImportService
        ]
    })
], OnboardingRecentMessagesImportModule);

//# sourceMappingURL=onboarding-recent-messages-import.module.js.map