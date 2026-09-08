"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "CalDavFetchEventsService", {
    enumerable: true,
    get: function() {
        return CalDavFetchEventsService;
    }
});
const _common = require("@nestjs/common");
const _guards = require("@sniptt/guards");
const _tsdav = require("tsdav");
const _utils = require("twenty-shared/utils");
const _extracticaldatautil = require("../utils/extract-ical-data.util");
const _iscaldavcollectionhrefutil = require("../utils/is-caldav-collection-href.util");
const _iseventintimerangeutil = require("../utils/is-event-in-time-range.util");
const _isinvalidsynctokenresponseutil = require("../utils/is-invalid-sync-token-response.util");
const _issamecaldavresourceutil = require("../utils/is-same-caldav-resource.util");
const _isvalidcaldavhrefutil = require("../utils/is-valid-caldav-href.util");
const _mapcaldavstatustoexceptioncodeutil = require("../utils/map-caldav-status-to-exception-code.util");
const _parseicaleventutil = require("../utils/parse-ical-event.util");
const _calendareventimportdriverexception = require("../../exceptions/calendar-event-import-driver.exception");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let CalDavFetchEventsService = class CalDavFetchEventsService {
    async listEventCalendars(client) {
        const calendars = await client.fetchCalendars();
        return calendars.filter((calendar)=>calendar.components?.includes('VEVENT'));
    }
    async fetchChangedEventHrefs(client, syncCursor) {
        const calendars = await this.listEventCalendars(client);
        const results = await Promise.all(calendars.map((calendar)=>this.syncCalendar(client, calendar, syncCursor)));
        return {
            changedHrefs: results.flatMap((result)=>result.changedHrefs),
            cancelledHrefs: results.flatMap((result)=>result.cancelledHrefs),
            syncCursor: this.mergeSyncCursor(results)
        };
    }
    async fetchEventsByHrefs(client, eventHrefs) {
        if (eventHrefs.length === 0) return [];
        const startDate = new Date(Date.now() - CalDavFetchEventsService.PAST_DAYS_WINDOW * 24 * 60 * 60 * 1000);
        const endDate = new Date(Date.now() + CalDavFetchEventsService.FUTURE_DAYS_WINDOW * 24 * 60 * 60 * 1000);
        const collectionUrls = [
            ...new Set(eventHrefs.map((href)=>this.resolveCollectionUrl(client, href)))
        ];
        const calendarObjects = (await Promise.all(collectionUrls.map((collectionUrl)=>this.fetchCalendarObjects(client, collectionUrl, eventHrefs.filter((href)=>this.resolveCollectionUrl(client, href) === collectionUrl))))).flat();
        return calendarObjects.flatMap((calendarObject)=>{
            const iCalData = (0, _extracticaldatautil.extractICalData)(calendarObject.props?.calendarData);
            if (!(0, _guards.isNonEmptyString)(calendarObject.href) || !iCalData) return [];
            return (0, _parseicaleventutil.parseICalEvents)(iCalData, calendarObject.href).filter((event)=>(0, _iseventintimerangeutil.isEventInTimeRange)(event, startDate, endDate));
        });
    }
    async fetchCalendarObjects(client, collectionUrl, objectUrls) {
        const responses = await client.davRequest({
            url: collectionUrl,
            init: {
                method: 'REPORT',
                namespace: _tsdav.DAVNamespaceShort.CALDAV,
                headers: {
                    depth: '1'
                },
                body: {
                    'calendar-multiget': {
                        _attributes: (0, _tsdav.getDAVAttribute)([
                            _tsdav.DAVNamespace.DAV,
                            _tsdav.DAVNamespace.CALDAV
                        ]),
                        [`${_tsdav.DAVNamespaceShort.DAV}:prop`]: {
                            [`${_tsdav.DAVNamespaceShort.DAV}:getetag`]: {},
                            [`${_tsdav.DAVNamespaceShort.CALDAV}:calendar-data`]: {}
                        },
                        [`${_tsdav.DAVNamespaceShort.DAV}:href`]: objectUrls
                    }
                }
            }
        });
        const unreadableResponses = responses.filter((response)=>(0, _utils.isDefined)(response.status) && response.status >= 400);
        const failedRequest = unreadableResponses.find((response)=>!(0, _guards.isNonEmptyString)(response.href) || (0, _issamecaldavresourceutil.isSameCalDavResource)(response.href, collectionUrl));
        if ((0, _utils.isDefined)(failedRequest)) {
            throw new _calendareventimportdriverexception.CalendarEventImportDriverException(`calendar-multiget on ${collectionUrl} failed: ${failedRequest.status} ${failedRequest.statusText}`, (0, _mapcaldavstatustoexceptioncodeutil.mapCalDavStatusToExceptionCode)(failedRequest.status));
        }
        const removedResponses = unreadableResponses.filter((response)=>response.status === 404 || response.status === 410);
        const unexpectedResponses = unreadableResponses.filter((response)=>response.status !== 404 && response.status !== 410);
        if (removedResponses.length > 0) {
            this.logger.debug(`Skipping ${removedResponses.length} calendar events removed from ${collectionUrl} since the last list fetch`);
        }
        if (unexpectedResponses.length > 0) {
            this.logger.warn(`Skipping ${unexpectedResponses.length} unreadable calendar events in ${collectionUrl}: ${unexpectedResponses.map((response)=>`${response.href} ${response.status}`).join(', ')}`);
        }
        return responses.filter((response)=>!(0, _utils.isDefined)(response.status) || response.status < 400);
    }
    resolveCollectionUrl(client, href) {
        const collectionPath = href.slice(0, href.lastIndexOf('/') + 1);
        return new URL(collectionPath, client.serverUrl).href;
    }
    async syncCalendar(client, calendar, syncCursor) {
        const supportsSyncCollection = calendar.reports?.includes('syncCollection') ?? false;
        try {
            return supportsSyncCollection ? await this.fetchHrefsViaSyncCollection(client, calendar, syncCursor) : await this.fetchHrefsViaCtagEtag(client, calendar, syncCursor);
        } catch (error) {
            this.logger.error(`Per-calendar sync failed for ${calendar.url}`, error);
            return {
                calendarUrl: calendar.url,
                changedHrefs: [],
                cancelledHrefs: [],
                newSyncToken: syncCursor?.syncTokens[calendar.url],
                newCtag: syncCursor?.ctags?.[calendar.url],
                newEtags: syncCursor?.etags?.[calendar.url]
            };
        }
    }
    async fetchHrefsViaSyncCollection(client, calendar, syncCursor) {
        const previousSyncToken = syncCursor?.syncTokens[calendar.url];
        const syncResult = await this.runSyncCollection(client, calendar.url, previousSyncToken);
        const memberResponses = syncResult.filter((entry)=>(0, _guards.isNonEmptyString)(entry.href) && (0, _isvalidcaldavhrefutil.isValidCalDavHref)(entry.href) && !(0, _iscaldavcollectionhrefutil.isCalDavCollectionHref)(entry.href, calendar.url));
        const changedHrefs = memberResponses.filter((entry)=>entry.status !== 404).map((entry)=>entry.href);
        const cancelledHrefs = memberResponses.filter((entry)=>entry.status === 404).map((entry)=>entry.href);
        const rawSyncToken = syncResult[0]?.raw?.multistatus?.syncToken;
        const newSyncToken = (0, _utils.isDefined)(rawSyncToken) ? String(rawSyncToken) : previousSyncToken;
        return {
            calendarUrl: calendar.url,
            changedHrefs,
            cancelledHrefs,
            newSyncToken
        };
    }
    async runSyncCollection(client, url, previousSyncToken) {
        const send = (token)=>client.syncCollection({
                url,
                props: {
                    [`${_tsdav.DAVNamespaceShort.DAV}:getetag`]: {},
                    [`${_tsdav.DAVNamespaceShort.CALDAV}:calendar-data`]: {}
                },
                syncLevel: 1,
                ...(0, _guards.isNonEmptyString)(token) ? {
                    syncToken: token
                } : {}
            });
        const result = await send(previousSyncToken);
        if ((0, _guards.isNonEmptyString)(previousSyncToken) && (0, _isinvalidsynctokenresponseutil.isInvalidSyncTokenResponse)(result)) {
            this.logger.warn(`Sync-token invalidated for ${url}; falling back to full re-sync`);
            return send(undefined);
        }
        return result;
    }
    async fetchHrefsViaCtagEtag(client, calendar, syncCursor) {
        const storedEtags = syncCursor?.etags?.[calendar.url] ?? {};
        const newCtag = (0, _utils.isDefined)(calendar.ctag) ? String(calendar.ctag) : undefined;
        const storedCtag = syncCursor?.ctags?.[calendar.url];
        if ((0, _utils.isDefined)(newCtag) && (0, _utils.isDefined)(storedCtag) && newCtag === storedCtag) {
            return {
                calendarUrl: calendar.url,
                changedHrefs: [],
                cancelledHrefs: [],
                newCtag,
                newEtags: storedEtags
            };
        }
        const currentEtags = await this.fetchEtagsByHref(client, calendar.url);
        const changedHrefs = Object.keys(currentEtags).filter((href)=>storedEtags[href] !== currentEtags[href]);
        const cancelledHrefs = Object.keys(storedEtags).filter((href)=>!(href in currentEtags) && !(0, _iscaldavcollectionhrefutil.isCalDavCollectionHref)(href, calendar.url));
        return {
            calendarUrl: calendar.url,
            changedHrefs,
            cancelledHrefs,
            newCtag,
            newEtags: currentEtags
        };
    }
    mergeSyncCursor(results) {
        const syncTokens = {};
        const ctags = {};
        const etags = {};
        for (const result of results){
            if (result.newSyncToken) syncTokens[result.calendarUrl] = result.newSyncToken;
            if (result.newCtag) ctags[result.calendarUrl] = result.newCtag;
            if (result.newEtags) etags[result.calendarUrl] = result.newEtags;
        }
        return {
            syncTokens,
            ctags: Object.keys(ctags).length > 0 ? ctags : undefined,
            etags: Object.keys(etags).length > 0 ? etags : undefined
        };
    }
    async fetchEtagsByHref(client, calendarUrl) {
        const responses = await client.propfind({
            url: calendarUrl,
            props: {
                [`${_tsdav.DAVNamespaceShort.DAV}:getetag`]: {}
            },
            depth: '1'
        });
        return responses.reduce((map, response)=>{
            const href = response.href;
            const etag = response.props?.getetag;
            if (!(0, _guards.isNonEmptyString)(href) || !(0, _guards.isNonEmptyString)(etag) || !(0, _isvalidcaldavhrefutil.isValidCalDavHref)(href) || (0, _iscaldavcollectionhrefutil.isCalDavCollectionHref)(href, calendarUrl)) {
                return map;
            }
            map[href] = etag;
            return map;
        }, {});
    }
    constructor(){
        this.logger = new _common.Logger(CalDavFetchEventsService.name);
    }
};
CalDavFetchEventsService.PAST_DAYS_WINDOW = 365 * 5;
CalDavFetchEventsService.FUTURE_DAYS_WINDOW = 365;
CalDavFetchEventsService = _ts_decorate([
    (0, _common.Injectable)()
], CalDavFetchEventsService);

//# sourceMappingURL=caldav-fetch-events.service.js.map