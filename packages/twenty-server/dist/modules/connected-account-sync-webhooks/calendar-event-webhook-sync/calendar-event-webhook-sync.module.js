"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "CalendarEventWebhookSyncModule", {
    enumerable: true,
    get: function() {
        return CalendarEventWebhookSyncModule;
    }
});
const _common = require("@nestjs/common");
const _typeorm = require("@nestjs/typeorm");
const _calendarchannelentity = require("../../../engine/metadata-modules/calendar-channel/entities/calendar-channel.entity");
const _calendareventimportmanagermodule = require("../../calendar/calendar-event-import-manager/calendar-event-import-manager.module");
const _calendareventwebhooksyncjob = require("./jobs/calendar-event-webhook-sync.job");
const _calendareventwebhooksyncservice = require("./services/calendar-event-webhook-sync.service");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let CalendarEventWebhookSyncModule = class CalendarEventWebhookSyncModule {
};
CalendarEventWebhookSyncModule = _ts_decorate([
    (0, _common.Module)({
        imports: [
            _calendareventimportmanagermodule.CalendarEventImportManagerModule,
            _typeorm.TypeOrmModule.forFeature([
                _calendarchannelentity.CalendarChannelEntity
            ])
        ],
        providers: [
            _calendareventwebhooksyncservice.CalendarEventWebhookSyncService,
            _calendareventwebhooksyncjob.CalendarEventWebhookSyncJob
        ]
    })
], CalendarEventWebhookSyncModule);

//# sourceMappingURL=calendar-event-webhook-sync.module.js.map