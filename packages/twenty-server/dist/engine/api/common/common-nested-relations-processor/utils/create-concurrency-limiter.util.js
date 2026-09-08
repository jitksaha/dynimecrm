"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "createConcurrencyLimiter", {
    enumerable: true,
    get: function() {
        return createConcurrencyLimiter;
    }
});
const createConcurrencyLimiter = (maxConcurrency)=>{
    if (!Number.isInteger(maxConcurrency) || maxConcurrency < 1) {
        throw new Error('Maximum concurrency must be a positive integer');
    }
    let activeTaskCount = 0;
    const waitingTaskResolvers = [];
    const acquire = ()=>{
        if (activeTaskCount < maxConcurrency) {
            activeTaskCount++;
            return Promise.resolve();
        }
        return new Promise((resolve)=>{
            waitingTaskResolvers.push(resolve);
        });
    };
    const release = ()=>{
        const nextTaskResolver = waitingTaskResolvers.shift();
        if (nextTaskResolver) {
            nextTaskResolver();
            return;
        }
        activeTaskCount--;
    };
    return async (task)=>{
        await acquire();
        try {
            return await task();
        } finally{
            release();
        }
    };
};

//# sourceMappingURL=create-concurrency-limiter.util.js.map