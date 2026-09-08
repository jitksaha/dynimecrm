"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "ClickHouseEventSink", {
    enumerable: true,
    get: function() {
        return ClickHouseEventSink;
    }
});
const _common = require("@nestjs/common");
const _clickhouseservice = require("../../../../database/clickhouse/clickhouse.service");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
const CLICKHOUSE_INSERT_OPTIONS_BY_TABLE = {
    pageview: {
        asyncInsertBusyTimeoutMaxMs: 100
    }
};
let ClickHouseEventSink = class ClickHouseEventSink {
    async write(events) {
        if (events.length === 0 || !this.clickHouseService.getMainClient()) {
            return;
        }
        const rowsByTable = new Map();
        for (const event of events){
            const rows = rowsByTable.get(event.table) ?? [];
            rows.push(event.row);
            rowsByTable.set(event.table, rows);
        }
        await Promise.all([
            ...rowsByTable.entries()
        ].map(async ([table, rows])=>{
            const result = await this.clickHouseService.insert(table, rows, CLICKHOUSE_INSERT_OPTIONS_BY_TABLE[table]);
            if (!result.success) {
                throw Object.assign(new Error(`Failed to insert ${rows.length} ${table} row(s) into ClickHouse: ${result.error.message}`), {
                    cause: result.error
                });
            }
        }));
    }
    constructor(clickHouseService){
        this.clickHouseService = clickHouseService;
    }
};
ClickHouseEventSink = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _clickhouseservice.ClickHouseService === "undefined" ? Object : _clickhouseservice.ClickHouseService
    ])
], ClickHouseEventSink);

//# sourceMappingURL=clickhouse-event.sink.js.map