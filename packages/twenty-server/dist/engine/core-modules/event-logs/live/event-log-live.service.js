"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "EventLogLiveService", {
    enumerable: true,
    get: function() {
        return EventLogLiveService;
    }
});
const _common = require("@nestjs/common");
const _utils = require("twenty-shared/utils");
const _cachestoragedecorator = require("../../cache-storage/decorators/cache-storage.decorator");
const _cachestorageservice = require("../../cache-storage/services/cache-storage.service");
const _cachestoragenamespaceenum = require("../../cache-storage/types/cache-storage-namespace.enum");
const _eventloglivettlconstant = require("./event-log-live-ttl.constant");
const _subscriptionchannelenum = require("../../../subscriptions/enums/subscription-channel.enum");
const _subscriptionservice = require("../../../subscriptions/subscription.service");
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
let EventLogLiveService = class EventLogLiveService {
    getPresenceKey(workspaceId, key) {
        return `workspaceEventLive:${workspaceId}:${key}`;
    }
    async markWatched(workspaceId, key) {
        await this.cacheStorageService.set(this.getPresenceKey(workspaceId, key), true, _eventloglivettlconstant.EVENT_LOG_LIVE_TTL_MS);
    }
    async isWatched(workspaceId, key) {
        const value = await this.cacheStorageService.get(this.getPresenceKey(workspaceId, key));
        return (0, _utils.isDefined)(value);
    }
    async publishWatched(events) {
        const groups = new Map();
        for (const event of events){
            const workspaceId = event.row.workspaceId;
            if (!(0, _utils.isDefined)(workspaceId)) {
                continue;
            }
            const key = `${workspaceId}:${event.table}`;
            const group = groups.get(key) ?? {
                workspaceId,
                table: event.table,
                rows: []
            };
            group.rows.push(event.row);
            groups.set(key, group);
        }
        const results = await Promise.allSettled([
            ...groups.values()
        ].map(async ({ workspaceId, table, rows })=>{
            if (!await this.isWatched(workspaceId, table)) {
                return;
            }
            await this.subscriptionService.publish({
                channel: _subscriptionchannelenum.SubscriptionChannel.WORKSPACE_EVENTS_CHANNEL,
                workspaceId,
                payload: {
                    table,
                    rows
                }
            });
        }));
        for (const result of results){
            if (result.status === 'rejected') {
                this.logger.error('Failed to publish live workspace events', result.reason);
            }
        }
    }
    constructor(cacheStorageService, subscriptionService){
        this.cacheStorageService = cacheStorageService;
        this.subscriptionService = subscriptionService;
        this.logger = new _common.Logger(EventLogLiveService.name);
    }
};
EventLogLiveService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_param(0, (0, _cachestoragedecorator.InjectCacheStorage)(_cachestoragenamespaceenum.CacheStorageNamespace.EngineSubscriptions)),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _cachestorageservice.CacheStorageService === "undefined" ? Object : _cachestorageservice.CacheStorageService,
        typeof _subscriptionservice.SubscriptionService === "undefined" ? Object : _subscriptionservice.SubscriptionService
    ])
], EventLogLiveService);

//# sourceMappingURL=event-log-live.service.js.map