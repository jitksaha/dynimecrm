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
    get KNOWN_SINK_NAMES () {
        return KNOWN_SINK_NAMES;
    },
    get getAvailableSinkNames () {
        return getAvailableSinkNames;
    }
});
const KNOWN_SINK_NAMES = [
    'clickhouse',
    'console'
];
const getAvailableSinkNames = (configuredSinkNames, { hasClickhouseUrl })=>configuredSinkNames.filter((name)=>{
        const lowerCasedName = name.toLowerCase();
        if (lowerCasedName === 'clickhouse') {
            return hasClickhouseUrl;
        }
        if (lowerCasedName === 'console') {
            return true;
        }
        return false;
    });

//# sourceMappingURL=event-sink-availability.js.map