"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "shouldCreateWorkerForQueue", {
    enumerable: true,
    get: function() {
        return shouldCreateWorkerForQueue;
    }
});
const shouldCreateWorkerForQueue = ({ queueName, enabledQueues, excludedQueues })=>{
    if (enabledQueues.length > 0 && !enabledQueues.includes(queueName)) {
        return false;
    }
    return !excludedQueues.includes(queueName);
};

//# sourceMappingURL=should-create-worker-for-queue.util.js.map