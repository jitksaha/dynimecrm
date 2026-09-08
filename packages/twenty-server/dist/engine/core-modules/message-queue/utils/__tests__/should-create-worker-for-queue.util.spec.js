"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _messagequeueconstants = require("../../message-queue.constants");
const _shouldcreateworkerforqueueutil = require("../should-create-worker-for-queue.util");
describe('shouldCreateWorkerForQueue', ()=>{
    it('should create a worker for every queue when no filters are set', ()=>{
        expect((0, _shouldcreateworkerforqueueutil.shouldCreateWorkerForQueue)({
            queueName: _messagequeueconstants.MessageQueue.workspaceQueue,
            enabledQueues: [],
            excludedQueues: []
        })).toBe(true);
    });
    it('should only create a worker for queues in the enabled list', ()=>{
        expect((0, _shouldcreateworkerforqueueutil.shouldCreateWorkerForQueue)({
            queueName: _messagequeueconstants.MessageQueue.workspaceQueue,
            enabledQueues: [
                _messagequeueconstants.MessageQueue.workspaceQueue
            ],
            excludedQueues: []
        })).toBe(true);
        expect((0, _shouldcreateworkerforqueueutil.shouldCreateWorkerForQueue)({
            queueName: _messagequeueconstants.MessageQueue.workflowQueue,
            enabledQueues: [
                _messagequeueconstants.MessageQueue.workspaceQueue
            ],
            excludedQueues: []
        })).toBe(false);
    });
    it('should not create a worker for excluded queues', ()=>{
        expect((0, _shouldcreateworkerforqueueutil.shouldCreateWorkerForQueue)({
            queueName: _messagequeueconstants.MessageQueue.workspaceQueue,
            enabledQueues: [],
            excludedQueues: [
                _messagequeueconstants.MessageQueue.workspaceQueue
            ]
        })).toBe(false);
    });
    it('should create a worker when the queue passes the allowlist and is not in the denylist', ()=>{
        expect((0, _shouldcreateworkerforqueueutil.shouldCreateWorkerForQueue)({
            queueName: _messagequeueconstants.MessageQueue.workspaceQueue,
            enabledQueues: [
                _messagequeueconstants.MessageQueue.workspaceQueue,
                _messagequeueconstants.MessageQueue.workflowQueue
            ],
            excludedQueues: [
                _messagequeueconstants.MessageQueue.aiQueue
            ]
        })).toBe(true);
    });
    it('should apply the excluded list after the enabled list', ()=>{
        expect((0, _shouldcreateworkerforqueueutil.shouldCreateWorkerForQueue)({
            queueName: _messagequeueconstants.MessageQueue.workspaceQueue,
            enabledQueues: [
                _messagequeueconstants.MessageQueue.workspaceQueue
            ],
            excludedQueues: [
                _messagequeueconstants.MessageQueue.workspaceQueue
            ]
        })).toBe(false);
    });
});

//# sourceMappingURL=should-create-worker-for-queue.util.spec.js.map