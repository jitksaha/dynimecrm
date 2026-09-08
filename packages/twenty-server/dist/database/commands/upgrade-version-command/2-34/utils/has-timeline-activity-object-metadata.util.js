"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "hasTimelineActivityObjectMetadata", {
    enumerable: true,
    get: function() {
        return hasTimelineActivityObjectMetadata;
    }
});
const _metadata = require("twenty-shared/metadata");
const _utils = require("twenty-shared/utils");
const hasTimelineActivityObjectMetadata = ({ byUniversalIdentifier })=>(0, _utils.isDefined)(byUniversalIdentifier[_metadata.STANDARD_OBJECTS.timelineActivity.universalIdentifier]);

//# sourceMappingURL=has-timeline-activity-object-metadata.util.js.map