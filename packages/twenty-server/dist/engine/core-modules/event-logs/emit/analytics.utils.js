"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
}
_export(exports, {
    get makePageview () {
        return makePageview;
    },
    get makeTrackEvent () {
        return makeTrackEvent;
    }
});
const _formatdatetimeforclickhouseutil = require("../../../../database/clickhouse/utils/format-date-time-for-clickhouse.util");
const _pageview = require("./events/pageview/pageview");
const _track = require("./events/workspace-event/track");
const common = ()=>({
        timestamp: (0, _formatdatetimeforclickhouseutil.formatDateTimeForClickHouse)(new Date()),
        version: '1'
    });
function makePageview(name, properties = {}) {
    return _pageview.pageviewSchema.parse({
        type: 'page',
        name,
        ...common(),
        properties
    });
}
function makeTrackEvent(event, properties) {
    const schema = _track.eventsRegistry.get(event);
    if (!schema) {
        throw new Error(`Schema for event ${event} is not implemented`);
    }
    return schema.parse({
        type: 'track',
        event,
        properties,
        ...common()
    });
}

//# sourceMappingURL=analytics.utils.js.map