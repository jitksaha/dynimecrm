"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "MESSAGE_QUEUE_WORKER_CONFIG", {
    enumerable: true,
    get: function() {
        return MESSAGE_QUEUE_WORKER_CONFIG;
    }
});
const _messagequeueconstants = require("./message-queue.constants");
const MESSAGE_QUEUE_WORKER_CONFIG = {
    [_messagequeueconstants.MessageQueue.taskAssignedQueue]: {
        priority: 4,
        workerOptions: {
            concurrency: 1,
            lockDuration: 30_000,
            maxStalledCount: 1,
            boundedShutdownDrain: false
        }
    },
    [_messagequeueconstants.MessageQueue.messagingQueue]: {
        priority: 2,
        workerOptions: {
            concurrency: 1,
            lockDuration: 30_000,
            maxStalledCount: 1,
            boundedShutdownDrain: false
        }
    },
    [_messagequeueconstants.MessageQueue.webhookQueue]: {
        priority: 2,
        workerOptions: {
            concurrency: 1,
            lockDuration: 30_000,
            maxStalledCount: 1,
            boundedShutdownDrain: false
        }
    },
    [_messagequeueconstants.MessageQueue.cronQueue]: {
        priority: 7,
        workerOptions: {
            concurrency: 1,
            lockDuration: 30_000,
            maxStalledCount: 1,
            boundedShutdownDrain: false
        }
    },
    [_messagequeueconstants.MessageQueue.emailQueue]: {
        priority: 1,
        workerOptions: {
            concurrency: 1,
            lockDuration: 30_000,
            maxStalledCount: 1,
            boundedShutdownDrain: false
        }
    },
    [_messagequeueconstants.MessageQueue.campaignQueue]: {
        priority: 6,
        workerOptions: {
            concurrency: 10,
            lockDuration: 30_000,
            maxStalledCount: 1,
            boundedShutdownDrain: false
        }
    },
    [_messagequeueconstants.MessageQueue.calendarQueue]: {
        priority: 4,
        workerOptions: {
            concurrency: 1,
            lockDuration: 30_000,
            maxStalledCount: 1,
            boundedShutdownDrain: false
        }
    },
    [_messagequeueconstants.MessageQueue.connectedAccountSyncWebhookQueue]: {
        priority: 1,
        workerOptions: {
            concurrency: 5,
            lockDuration: 30_000,
            maxStalledCount: 1,
            boundedShutdownDrain: false
        }
    },
    [_messagequeueconstants.MessageQueue.contactCreationQueue]: {
        priority: 4,
        workerOptions: {
            concurrency: 1,
            lockDuration: 30_000,
            maxStalledCount: 1,
            boundedShutdownDrain: false
        }
    },
    [_messagequeueconstants.MessageQueue.billingQueue]: {
        priority: 1,
        workerOptions: {
            concurrency: 1,
            lockDuration: 30_000,
            maxStalledCount: 1,
            boundedShutdownDrain: false
        }
    },
    [_messagequeueconstants.MessageQueue.workspaceQueue]: {
        priority: 5,
        workerOptions: {
            concurrency: 1,
            lockDuration: 30_000,
            maxStalledCount: 1,
            boundedShutdownDrain: false
        }
    },
    [_messagequeueconstants.MessageQueue.entityEventsToDbQueue]: {
        priority: 1,
        workerOptions: {
            concurrency: 1,
            lockDuration: 30_000,
            maxStalledCount: 1,
            boundedShutdownDrain: false
        }
    },
    [_messagequeueconstants.MessageQueue.workflowQueue]: {
        priority: 2,
        workerOptions: {
            concurrency: 1,
            lockDuration: 30_000,
            maxStalledCount: 1,
            boundedShutdownDrain: false
        }
    },
    [_messagequeueconstants.MessageQueue.delayedJobsQueue]: {
        priority: 3,
        workerOptions: {
            concurrency: 1,
            lockDuration: 30_000,
            maxStalledCount: 1,
            boundedShutdownDrain: false
        }
    },
    [_messagequeueconstants.MessageQueue.deleteCascadeQueue]: {
        priority: 6,
        workerOptions: {
            concurrency: 1,
            lockDuration: 30_000,
            maxStalledCount: 1,
            boundedShutdownDrain: false
        }
    },
    [_messagequeueconstants.MessageQueue.logicFunctionQueue]: {
        priority: 4,
        workerOptions: {
            concurrency: 10,
            lockDuration: 30_000,
            maxStalledCount: 1,
            boundedShutdownDrain: false
        }
    },
    [_messagequeueconstants.MessageQueue.triggerQueue]: {
        priority: 5,
        workerOptions: {
            concurrency: 1,
            lockDuration: 30_000,
            maxStalledCount: 1,
            boundedShutdownDrain: false
        }
    },
    [_messagequeueconstants.MessageQueue.aiQueue]: {
        priority: 5,
        workerOptions: {
            concurrency: 1,
            lockDuration: 30_000,
            maxStalledCount: 1,
            boundedShutdownDrain: false
        }
    },
    [_messagequeueconstants.MessageQueue.aiStreamQueue]: {
        priority: 2,
        workerOptions: {
            concurrency: 20,
            // 10 minutes: a stream job holds its lock for the whole stream duration
            lockDuration: 600_000,
            // A stalled stream cannot be resumed client-side, never re-queue it
            maxStalledCount: 0,
            boundedShutdownDrain: true
        }
    }
};

//# sourceMappingURL=message-queue-worker-config.constant.js.map