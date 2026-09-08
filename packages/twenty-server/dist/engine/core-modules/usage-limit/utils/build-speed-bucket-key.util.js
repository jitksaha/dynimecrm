"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "buildSpeedBucketKey", {
    enumerable: true,
    get: function() {
        return buildSpeedBucketKey;
    }
});
const ABSENT = '-';
const SERVER_SCOPE = 'server';
const buildSpeedBucketKey = ({ counterScope, workspaceId, resourceType, operationType, spenderType, spenderId, windowSeconds })=>{
    const scope = counterScope === 'crossWorkspace' ? SERVER_SCOPE : workspaceId;
    return `{${scope}}:speed:${resourceType}:${operationType}:${spenderType}:${spenderId || ABSENT}:${windowSeconds}`;
};

//# sourceMappingURL=build-speed-bucket-key.util.js.map