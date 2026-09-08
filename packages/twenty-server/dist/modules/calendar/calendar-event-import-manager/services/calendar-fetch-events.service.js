"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "CalendarFetchEventsService", {
    enumerable: true,
    get: function() {
        return CalendarFetchEventsService;
    }
});
const _common = require("@nestjs/common");
const _typeorm = require("@nestjs/typeorm");
const _typeorm1 = require("typeorm");
const _cachestoragedecorator = require("../../../../engine/core-modules/cache-storage/decorators/cache-storage.decorator");
const _cachestorageservice = require("../../../../engine/core-modules/cache-storage/services/cache-storage.service");
const _cachestoragenamespaceenum = require("../../../../engine/core-modules/cache-storage/types/cache-storage-namespace.enum");
const _workspaceormmanager = require("../../../../engine/twenty-orm/workspace-orm.manager");
const _buildsystemauthcontextutil = require("../../../../engine/twenty-orm/utils/build-system-auth-context.util");
const _calendareventcleanerservice = require("../../calendar-event-cleaner/services/calendar-event-cleaner.service");
const _calendareventimportexceptionhandlerservice = require("./calendar-event-import-exception-handler.service");
const _calendargeteventsservice = require("./calendar-get-events.service");
const _calendarchannelsyncstatusservice = require("../../common/services/calendar-channel-sync-status.service");
const _calendarchannelentity = require("../../../../engine/metadata-modules/calendar-channel/entities/calendar-channel.entity");
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
let CalendarFetchEventsService = class CalendarFetchEventsService {
    async fetchCalendarEvents(calendarChannel, connectedAccount, workspaceId) {
        this.logger.log(`WorkspaceId: ${workspaceId}, CalendarChannelId: ${calendarChannel.id} - Fetching calendar events`);
        await this.calendarChannelSyncStatusService.markAsCalendarEventListFetchOngoing([
            calendarChannel.id
        ], workspaceId);
        const authContext = (0, _buildsystemauthcontextutil.buildSystemAuthContext)(workspaceId);
        await this.workspaceOrmManager.executeInWorkspaceContext(async ()=>{
            try {
                const { calendarEventIds, calendarEventIdsToDelete, nextSyncCursor } = await this.getCalendarEventsService.getCalendarEvents(connectedAccount, calendarChannel.syncCursor || undefined);
                if (calendarEventIdsToDelete.length > 0) {
                    const calendarChannelEventAssociationRepository = this.workspaceOrmManager.getRepository('calendarChannelEventAssociation');
                    const associationsToDelete = await calendarChannelEventAssociationRepository.find({
                        where: {
                            eventExternalId: (0, _typeorm1.Any)(calendarEventIdsToDelete),
                            calendarChannelId: calendarChannel.id
                        },
                        select: {
                            calendarEventId: true
                        }
                    });
                    await calendarChannelEventAssociationRepository.delete({
                        eventExternalId: (0, _typeorm1.Any)(calendarEventIdsToDelete),
                        calendarChannelId: calendarChannel.id
                    });
                    await this.calendarEventCleanerService.deleteOrphanedCalendarEvents({
                        calendarEventIds: associationsToDelete.map(({ calendarEventId })=>calendarEventId),
                        workspaceId
                    });
                }
                if (calendarEventIds.length > 0) {
                    await this.cacheStorage.setAdd(`calendar-events-to-import:${workspaceId}:${calendarChannel.id}`, calendarEventIds);
                    await this.calendarChannelSyncStatusService.markAsCalendarEventsImportPending([
                        calendarChannel.id
                    ], workspaceId);
                } else {
                    await this.calendarChannelSyncStatusService.markAsCalendarEventSyncCompleted([
                        calendarChannel.id
                    ], workspaceId);
                }
                await this.calendarChannelRepository.update({
                    id: calendarChannel.id,
                    workspaceId
                }, {
                    syncCursor: nextSyncCursor
                });
            } catch (error) {
                this.logger.error(`WorkspaceId: ${workspaceId}, CalendarChannelId: ${calendarChannel.id} - Calendar event fetch error: ${error.message}`);
                await this.calendarEventImportErrorHandlerService.handleDriverException(error, _calendareventimportexceptionhandlerservice.CalendarEventImportSyncStep.CALENDAR_EVENT_LIST_FETCH, calendarChannel, workspaceId);
            }
        }, authContext, {
            lite: true
        });
    }
    constructor(cacheStorage, workspaceOrmManager, calendarChannelRepository, calendarChannelSyncStatusService, getCalendarEventsService, calendarEventImportErrorHandlerService, calendarEventCleanerService){
        this.cacheStorage = cacheStorage;
        this.workspaceOrmManager = workspaceOrmManager;
        this.calendarChannelRepository = calendarChannelRepository;
        this.calendarChannelSyncStatusService = calendarChannelSyncStatusService;
        this.getCalendarEventsService = getCalendarEventsService;
        this.calendarEventImportErrorHandlerService = calendarEventImportErrorHandlerService;
        this.calendarEventCleanerService = calendarEventCleanerService;
        this.logger = new _common.Logger(CalendarFetchEventsService.name);
    }
};
CalendarFetchEventsService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_param(0, (0, _cachestoragedecorator.InjectCacheStorage)(_cachestoragenamespaceenum.CacheStorageNamespace.ModuleCalendar)),
    _ts_param(2, (0, _typeorm.InjectRepository)(_calendarchannelentity.CalendarChannelEntity)),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _cachestorageservice.CacheStorageService === "undefined" ? Object : _cachestorageservice.CacheStorageService,
        typeof _workspaceormmanager.WorkspaceOrmManager === "undefined" ? Object : _workspaceormmanager.WorkspaceOrmManager,
        typeof _typeorm1.Repository === "undefined" ? Object : _typeorm1.Repository,
        typeof _calendarchannelsyncstatusservice.CalendarChannelSyncStatusService === "undefined" ? Object : _calendarchannelsyncstatusservice.CalendarChannelSyncStatusService,
        typeof _calendargeteventsservice.CalendarGetCalendarEventsService === "undefined" ? Object : _calendargeteventsservice.CalendarGetCalendarEventsService,
        typeof _calendareventimportexceptionhandlerservice.CalendarEventImportErrorHandlerService === "undefined" ? Object : _calendareventimportexceptionhandlerservice.CalendarEventImportErrorHandlerService,
        typeof _calendareventcleanerservice.CalendarEventCleanerService === "undefined" ? Object : _calendareventcleanerservice.CalendarEventCleanerService
    ])
], CalendarFetchEventsService);

//# sourceMappingURL=calendar-fetch-events.service.js.map