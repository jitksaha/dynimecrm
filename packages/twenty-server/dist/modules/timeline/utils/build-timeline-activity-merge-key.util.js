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
    get buildTimelineActivityMergeKey () {
        return buildTimelineActivityMergeKey;
    },
    get buildTimelineActivityMergeKeyCandidates () {
        return buildTimelineActivityMergeKeyCandidates;
    }
});
const buildTimelineActivityMergeKey = ({ recordId, workspaceMemberId, timelineActivityTypeId, timelineActivityTypeSnapshot })=>JSON.stringify([
        recordId,
        workspaceMemberId ?? null,
        timelineActivityTypeId,
        timelineActivityTypeSnapshot?.universalIdentifier,
        timelineActivityTypeSnapshot?.action,
        timelineActivityTypeSnapshot?.objectUniversalIdentifier
    ]);
const buildTimelineActivityMergeKeyCandidates = (args)=>{
    const exactKey = buildTimelineActivityMergeKey(args);
    if (args.timelineActivityTypeSnapshot === null) {
        return [
            exactKey
        ];
    }
    return [
        exactKey,
        buildTimelineActivityMergeKey({
            ...args,
            timelineActivityTypeSnapshot: null
        })
    ];
};

//# sourceMappingURL=build-timeline-activity-merge-key.util.js.map