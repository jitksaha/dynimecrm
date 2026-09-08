"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "EventLogIngestionModule", {
    enumerable: true,
    get: function() {
        return EventLogIngestionModule;
    }
});
const _common = require("@nestjs/common");
const _utils = require("twenty-shared/utils");
const _clickhousemodule = require("../../../../database/clickhouse/clickhouse.module");
const _clickhouseeventsink = require("./clickhouse-event.sink");
const _consoleeventsink = require("./console-event.sink");
const _createeventlogfrominternalevent = require("./create-event-log-from-internal-event");
const _eventsinkavailability = require("./event-sink-availability");
const _eventsink = require("./event-sink");
const _workspaceeventsinkservice = require("./workspace-event-sink.service");
const _eventloglivemodule = require("../live/event-log-live.module");
const _twentyconfigservice = require("../../twenty-config/twenty-config.service");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
const eventSinksProvider = {
    provide: _eventsink.EVENT_SINKS,
    useFactory: (twentyConfigService, clickHouseEventSink, consoleEventSink)=>{
        const sinkByName = {
            clickhouse: clickHouseEventSink,
            console: consoleEventSink
        };
        const configuredSinkNames = twentyConfigService.get('EVENT_SINKS');
        const unknownSinkNames = configuredSinkNames.filter((name)=>!_eventsinkavailability.KNOWN_SINK_NAMES.includes(name.toLowerCase()));
        if (unknownSinkNames.length > 0) {
            new _common.Logger('WorkspaceEventSinks').warn(`Ignoring unknown EVENT_SINKS: ${unknownSinkNames.join(', ')}`);
        }
        return (0, _eventsinkavailability.getAvailableSinkNames)(configuredSinkNames, {
            hasClickhouseUrl: Boolean(twentyConfigService.get('CLICKHOUSE_URL'))
        }).map((name)=>sinkByName[name.toLowerCase()]).filter(_utils.isDefined);
    },
    inject: [
        _twentyconfigservice.TwentyConfigService,
        _clickhouseeventsink.ClickHouseEventSink,
        _consoleeventsink.ConsoleEventSink
    ]
};
let EventLogIngestionModule = class EventLogIngestionModule {
};
EventLogIngestionModule = _ts_decorate([
    (0, _common.Module)({
        imports: [
            _clickhousemodule.ClickHouseModule,
            _eventloglivemodule.EventLogLiveModule
        ],
        providers: [
            _clickhouseeventsink.ClickHouseEventSink,
            _consoleeventsink.ConsoleEventSink,
            eventSinksProvider,
            _workspaceeventsinkservice.WorkspaceEventSinkService,
            _createeventlogfrominternalevent.CreateEventLogFromInternalEvent
        ],
        exports: [
            _workspaceeventsinkservice.WorkspaceEventSinkService
        ]
    })
], EventLogIngestionModule);

//# sourceMappingURL=event-log-ingestion.module.js.map