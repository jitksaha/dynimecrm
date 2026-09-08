"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "fromTimelineActivityTypeManifestToUniversalFlatTimelineActivityType", {
    enumerable: true,
    get: function() {
        return fromTimelineActivityTypeManifestToUniversalFlatTimelineActivityType;
    }
});
const fromTimelineActivityTypeManifestToUniversalFlatTimelineActivityType = ({ timelineActivityTypeManifest, applicationUniversalIdentifier, now })=>({
        universalIdentifier: timelineActivityTypeManifest.universalIdentifier,
        applicationUniversalIdentifier,
        name: timelineActivityTypeManifest.name,
        label: timelineActivityTypeManifest.label,
        action: timelineActivityTypeManifest.emit?.on ?? null,
        icon: timelineActivityTypeManifest.icon ?? null,
        frontComponentUniversalIdentifier: timelineActivityTypeManifest.frontComponentUniversalIdentifier ?? null,
        objectUniversalIdentifier: timelineActivityTypeManifest.emit?.objectUniversalIdentifier ?? null,
        targetRelationFieldUniversalIdentifier: timelineActivityTypeManifest.emit?.through?.relationFieldUniversalIdentifier ?? null,
        triggerFieldUniversalIdentifiers: timelineActivityTypeManifest.emit?.through?.triggerFieldUniversalIdentifiers ?? null,
        happensAtFieldUniversalIdentifier: timelineActivityTypeManifest.emit?.through?.happensAtFieldUniversalIdentifier ?? null,
        replacesTimelineActivityTypeUniversalIdentifier: timelineActivityTypeManifest.replacesTimelineActivityTypeUniversalIdentifier ?? null,
        isActive: true,
        overrides: null,
        createdAt: now,
        updatedAt: now
    });

//# sourceMappingURL=from-timeline-activity-type-manifest-to-universal-flat-timeline-activity-type.util.js.map