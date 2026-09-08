"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "CalendarEventWebhookSyncService", {
    enumerable: true,
    get: function() {
        return CalendarEventWebhookSyncService;
    }
});
const _common = require("@nestjs/common");
const _typeorm = require("@nestjs/typeorm");
const _types = require("twenty-shared/types");
const _utils = require("twenty-shared/utils");
const _typeorm1 = require("typeorm");
const _cachestoragedecorator = require("../../../../engine/core-modules/cache-storage/decorators/cache-storage.decorator");
const _cachestorageservice = require("../../../../engine/core-modules/cache-storage/services/cache-storage.service");
const _cachestoragenamespaceenum = require("../../../../engine/core-modules/cache-storage/types/cache-storage-namespace.enum");
const _calendarchannelentity = require("../../../../engine/metadata-modules/calendar-channel/entities/calendar-channel.entity");
const _calendareventsimportservice = require("../../../calendar/calendar-event-import-manager/services/calendar-events-import.service");
const _calendarfetcheventsservice = require("../../../calendar/calendar-event-import-manager/services/calendar-fetch-events.service");
const _calendareventwebhooksyncexception = require("../calendar-event-webhook-sync.exception");
const _calendareventwebhooksyncinlineimportmaxeventsconstant = require("../constants/calendar-event-webhook-sync-inline-import-max-events.constant");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
function _ts_param(paramIndex, decorator) {
    return function(target, key) {
        decorator(target, key, paramIndex);
    };
}
let CalendarEventWebhookSyncService = class CalendarEventWebhookSyncService {
    async processCalendarEventWebhookSync({ calendarChannelId, workspaceId }) {
        const isCalendarChannelScheduled = await this.markCalendarChannelAsListFetchScheduledIfPending({
            calendarChannelId,
            workspaceId
        });
        if (!isCalendarChannelScheduled) {
            throw new _calendareventwebhooksyncexception.CalendarEventWebhookSyncException(`Calendar channel ${calendarChannelId} is not available for a webhook sync`, _calendareventwebhooksyncexception.CalendarEventWebhookSyncExceptionCode.CALENDAR_CHANNEL_SYNC_ALREADY_IN_PROGRESS);
        }
        const calendarChannel = await this.findSyncEnabledCalendarChannel({
            calendarChannelId,
            workspaceId
        });
        if (!(0, _utils.isDefined)(calendarChannel)) {
            return;
        }
        await this.calendarFetchEventsService.fetchCalendarEvents(calendarChannel, calendarChannel.connectedAccount, workspaceId);
        await this.importFetchedCalendarEvents({
            calendarChannelId,
            workspaceId
        });
    }
    async markCalendarChannelAsListFetchScheduledIfPending({ calendarChannelId, workspaceId }) {
        const updateResult = await this.calendarChannelRepository.createQueryBuilder().update().set({
            syncStage: _types.CalendarChannelSyncStage.CALENDAR_EVENT_LIST_FETCH_SCHEDULED,
            syncStageStartedAt: new Date()
        }).where({
            id: calendarChannelId,
            workspaceId,
            isSyncEnabled: true,
            syncStage: _types.CalendarChannelSyncStage.CALENDAR_EVENT_LIST_FETCH_PENDING
        }).returning('id').execute();
        return updateResult.raw.length > 0;
    }
    async findSyncEnabledCalendarChannel({ calendarChannelId, workspaceId }) {
        return this.calendarChannelRepository.findOne({
            where: {
                id: calendarChannelId,
                workspaceId,
                isSyncEnabled: true
            },
            relations: [
                'connectedAccount'
            ]
        });
    }
    async importFetchedCalendarEvents({ calendarChannelId, workspaceId }) {
        const calendarEventsToImportCount = await this.cacheStorage.getSetLength(`calendar-events-to-import:${workspaceId}:${calendarChannelId}`);
        if (calendarEventsToImportCount === 0) {
            return;
        }
        if (this.shouldDeferImportToCron(calendarEventsToImportCount)) {
            this.logger.log(`Deferring ${calendarEventsToImportCount} calendar events to the import cron for calendar channel ${calendarChannelId}`);
            return;
        }
        const calendarChannel = await this.findSyncEnabledCalendarChannel({
            calendarChannelId,
            workspaceId
        });
        if (!(0, _utils.isDefined)(calendarChannel)) {
            return;
        }
        await this.calendarEventsImportService.processCalendarEventsImport(calendarChannel, calendarChannel.connectedAccount, workspaceId);
    }
    shouldDeferImportToCron(calendarEventsToImportCount) {
        return calendarEventsToImportCount > _calendareventwebhooksyncinlineimportmaxeventsconstant.CALENDAR_EVENT_WEBHOOK_SYNC_INLINE_IMPORT_MAX_EVENTS;
    }
    constructor(cacheStorage, calendarChannelRepository, calendarFetchEventsService, calendarEventsImportService){
        this.cacheStorage = cacheStorage;
        this.calendarChannelRepository = calendarChannelRepository;
        this.calendarFetchEventsService = calendarFetchEventsService;
        this.calendarEventsImportService = calendarEventsImportService;
        this.logger = new _common.Logger(CalendarEventWebhookSyncService.name);
    }
};
CalendarEventWebhookSyncService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_param(0, (0, _cachestoragedecorator.InjectCacheStorage)(_cachestoragenamespaceenum.CacheStorageNamespace.ModuleCalendar)),
    _ts_param(1, (0, _typeorm.InjectRepository)(_calendarchannelentity.CalendarChannelEntity)),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _cachestorageservice.CacheStorageService === "undefined" ? Object : _cachestorageservice.CacheStorageService,
        typeof _typeorm1.Repository === "undefined" ? Object : _typeorm1.Repository,
        typeof _calendarfetcheventsservice.CalendarFetchEventsService === "undefined" ? Object : _calendarfetcheventsservice.CalendarFetchEventsService,
        typeof _calendareventsimportservice.CalendarEventsImportService === "undefined" ? Object : _calendareventsimportservice.CalendarEventsImportService
    ])
], CalendarEventWebhookSyncService);

//# sourceMappingURL=calendar-event-webhook-sync.service.js.map