"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "CalendarEventCreationManagerModule", {
    enumerable: true,
    get: function() {
        return CalendarEventCreationManagerModule;
    }
});
const _common = require("@nestjs/common");
const _typeorm = require("@nestjs/typeorm");
const _calendarchannelentity = require("../../../engine/metadata-modules/calendar-channel/entities/calendar-channel.entity");
const _connectedaccountentity = require("../../../engine/metadata-modules/connected-account/entities/connected-account.entity");
const _caldavcreateeventservice = require("./drivers/caldav/services/caldav-create-event.service");
const _googlecalendarcreateeventservice = require("./drivers/google-calendar/services/google-calendar-create-event.service");
const _microsoftcalendarcreateeventservice = require("./drivers/microsoft-calendar/services/microsoft-calendar-create-event.service");
const _calendareventcomposerservice = require("./services/calendar-event-composer.service");
const _createcalendareventservice = require("./services/create-calendar-event.service");
const _caldavdrivermodule = require("../calendar-event-import-manager/drivers/caldav/caldav-driver.module");
const _calendareventimportmanagermodule = require("../calendar-event-import-manager/calendar-event-import-manager.module");
const _oauth2clientmanagermodule = require("../../connected-account/oauth2-client-manager/oauth2-client-manager.module");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let CalendarEventCreationManagerModule = class CalendarEventCreationManagerModule {
};
CalendarEventCreationManagerModule = _ts_decorate([
    (0, _common.Module)({
        imports: [
            _typeorm.TypeOrmModule.forFeature([
                _connectedaccountentity.ConnectedAccountEntity,
                _calendarchannelentity.CalendarChannelEntity
            ]),
            _oauth2clientmanagermodule.OAuth2ClientManagerModule,
            _calendareventimportmanagermodule.CalendarEventImportManagerModule,
            _caldavdrivermodule.CalDavDriverModule
        ],
        providers: [
            _calendareventcomposerservice.CalendarEventComposerService,
            _createcalendareventservice.CreateCalendarEventService,
            _googlecalendarcreateeventservice.GoogleCalendarCreateEventService,
            _microsoftcalendarcreateeventservice.MicrosoftCalendarCreateEventService,
            _caldavcreateeventservice.CalDavCreateEventService
        ],
        exports: [
            _calendareventcomposerservice.CalendarEventComposerService,
            _createcalendareventservice.CreateCalendarEventService
        ]
    })
], CalendarEventCreationManagerModule);

//# sourceMappingURL=calendar-event-creation-manager.module.js.map