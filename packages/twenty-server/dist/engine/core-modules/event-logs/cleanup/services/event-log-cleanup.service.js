/* @license Enterprise */ "use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "EventLogCleanupService", {
    enumerable: true,
    get: function() {
        return EventLogCleanupService;
    }
});
const _common = require("@nestjs/common");
const _types = require("twenty-shared/types");
const _clickhouseservice = require("../../../../../database/clickhouse/clickhouse.service");
const _formatdatetimeforclickhouseutil = require("../../../../../database/clickhouse/utils/format-date-time-for-clickhouse.util");
const _eventlogregistry = require("../../registry/event-log-registry");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let EventLogCleanupService = class EventLogCleanupService {
    async cleanupWorkspaceEventLogs({ workspaceId, retentionDays }) {
        if (!this.clickHouseService.getMainClient()) {
            this.logger.debug('ClickHouse not configured, skipping event log cleanup');
            return;
        }
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - retentionDays);
        for (const table of Object.values(_types.EventLogTable)){
            const tableName = (0, _eventlogregistry.getClickHouseTableName)(table);
            try {
                const success = await this.clickHouseService.executeCommand(`ALTER TABLE ${tableName} DELETE WHERE "workspaceId" = {workspaceId:String} AND "timestamp" < {cutoffDate:DateTime64(3)}`, {
                    workspaceId,
                    cutoffDate: (0, _formatdatetimeforclickhouseutil.formatDateTimeForClickHouse)(cutoffDate)
                });
                if (success) {
                    this.logger.log(`Scheduled deletion of old ${tableName} events for workspace ${workspaceId} (retention: ${retentionDays} days)`);
                } else {
                    this.logger.warn(`Failed to schedule deletion for ${tableName} in workspace ${workspaceId}`);
                }
            } catch (error) {
                this.logger.error(`Error cleaning up ${tableName} for workspace ${workspaceId}`, error instanceof Error ? error.stack : String(error));
            }
        }
    }
    constructor(clickHouseService){
        this.clickHouseService = clickHouseService;
        this.logger = new _common.Logger(EventLogCleanupService.name);
    }
};
EventLogCleanupService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _clickhouseservice.ClickHouseService === "undefined" ? Object : _clickhouseservice.ClickHouseService
    ])
], EventLogCleanupService);

//# sourceMappingURL=event-log-cleanup.service.js.map