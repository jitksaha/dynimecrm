"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "formatEnrichmentLocation", {
    enumerable: true,
    get: function() {
        return formatEnrichmentLocation;
    }
});
const _guards = require("@sniptt/guards");
const formatEnrichmentLocation = ({ locality, region, country })=>{
    const location = [
        locality,
        region,
        country
    ].filter(_guards.isNonEmptyString).join(', ');
    return (0, _guards.isNonEmptyString)(location) ? location : null;
};

//# sourceMappingURL=format-enrichment-location.util.js.map