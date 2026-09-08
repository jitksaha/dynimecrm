"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "CalendarEventCleanerService", {
    enumerable: true,
    get: function() {
        return CalendarEventCleanerService;
    }
});
const _common = require("@nestjs/common");
const _utils = require("twenty-shared/utils");
const _typeorm = require("typeorm");
const _workspaceormmanager = require("../../../../engine/twenty-orm/workspace-orm.manager");
const _buildsystemauthcontextutil = require("../../../../engine/twenty-orm/utils/build-system-auth-context.util");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
const CALENDAR_CLEANUP_PAGE_SIZE = 500;
let CalendarEventCleanerService = class CalendarEventCleanerService {
    async deleteCalendarChannelEventAssociationsByChannelId({ workspaceId, calendarChannelId }) {
        const authContext = (0, _buildsystemauthcontextutil.buildSystemAuthContext)(workspaceId);
        await this.workspaceOrmManager.executeInWorkspaceContext(async ()=>{
            await this.workspaceOrmManager.runInWorkspaceTransaction(async (transactionScope)=>{
                const calendarChannelEventAssociationRepository = transactionScope.getRepository('calendarChannelEventAssociation');
                for(;;){
                    const associations = await calendarChannelEventAssociationRepository.find({
                        where: {
                            calendarChannelId
                        },
                        take: CALENDAR_CLEANUP_PAGE_SIZE,
                        select: {
                            id: true
                        }
                    });
                    if (associations.length === 0) {
                        break;
                    }
                    const ids = associations.map(({ id })=>id);
                    this.logger.log(`WorkspaceId: ${workspaceId} Deleting ${ids.length} calendar channel event associations for channel ${calendarChannelId}`);
                    await calendarChannelEventAssociationRepository.delete(ids);
                }
            });
        }, authContext, {
            lite: true
        });
    }
    async deleteOrphanedCalendarEvents({ calendarEventIds, workspaceId }) {
        if (calendarEventIds.length === 0) {
            return;
        }
        const authContext = (0, _buildsystemauthcontextutil.buildSystemAuthContext)(workspaceId);
        await this.workspaceOrmManager.executeInWorkspaceContext(async ()=>{
            await this.workspaceOrmManager.runInWorkspaceTransaction(async (transactionScope)=>{
                const calendarEventRepository = transactionScope.getRepository('calendarEvent');
                const calendarChannelEventAssociationRepository = transactionScope.getRepository('calendarChannelEventAssociation');
                for(let index = 0; index < calendarEventIds.length; index += CALENDAR_CLEANUP_PAGE_SIZE){
                    const pageIds = calendarEventIds.slice(index, index + CALENDAR_CLEANUP_PAGE_SIZE);
                    const associations = await calendarChannelEventAssociationRepository.find({
                        where: {
                            calendarEventId: (0, _typeorm.In)(pageIds)
                        },
                        select: {
                            calendarEventId: true
                        }
                    });
                    const referencedEventIds = new Set(associations.map(({ calendarEventId })=>calendarEventId));
                    const orphanEventIds = pageIds.filter((eventId)=>!referencedEventIds.has(eventId));
                    if (orphanEventIds.length > 0) {
                        await calendarEventRepository.delete(orphanEventIds);
                    }
                }
            });
        }, authContext, {
            lite: true
        });
    }
    async cleanWorkspaceCalendarEvents(workspaceId) {
        const authContext = (0, _buildsystemauthcontextutil.buildSystemAuthContext)(workspaceId);
        await this.workspaceOrmManager.executeInWorkspaceContext(async ()=>{
            await this.workspaceOrmManager.runInWorkspaceTransaction(async (transactionScope)=>{
                const calendarEventRepository = transactionScope.getRepository('calendarEvent');
                const calendarChannelEventAssociationRepository = transactionScope.getRepository('calendarChannelEventAssociation');
                let cursor;
                for(;;){
                    const page = await calendarEventRepository.find({
                        where: (0, _utils.isDefined)(cursor) ? {
                            id: (0, _typeorm.MoreThan)(cursor)
                        } : {},
                        order: {
                            id: 'ASC'
                        },
                        take: CALENDAR_CLEANUP_PAGE_SIZE,
                        select: {
                            id: true
                        }
                    });
                    if (page.length === 0) {
                        break;
                    }
                    cursor = page[page.length - 1].id;
                    const pageIds = page.map(({ id })=>id);
                    const associations = await calendarChannelEventAssociationRepository.find({
                        where: {
                            calendarEventId: (0, _typeorm.In)(pageIds)
                        },
                        select: {
                            calendarEventId: true
                        }
                    });
                    const referencedEventIds = new Set(associations.map(({ calendarEventId })=>calendarEventId));
                    const orphanEventIds = pageIds.filter((eventId)=>!referencedEventIds.has(eventId));
                    if (orphanEventIds.length > 0) {
                        await calendarEventRepository.delete(orphanEventIds);
                    }
                }
            });
        }, authContext, {
            lite: true
        });
    }
    constructor(workspaceOrmManager){
        this.workspaceOrmManager = workspaceOrmManager;
        this.logger = new _common.Logger(CalendarEventCleanerService.name);
    }
};
CalendarEventCleanerService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _workspaceormmanager.WorkspaceOrmManager === "undefined" ? Object : _workspaceormmanager.WorkspaceOrmManager
    ])
], CalendarEventCleanerService);

//# sourceMappingURL=calendar-event-cleaner.service.js.map