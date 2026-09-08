"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "SyncDriver", {
    enumerable: true,
    get: function() {
        return SyncDriver;
    }
});
const _common = require("@nestjs/common");
const _utils = require("twenty-shared/utils");
let SyncDriver = class SyncDriver {
    async add(queueName, jobName, data) {
        await this.processJob(queueName, this.createJob(jobName, data));
    }
    async bulkAdd(queueName, jobName, dataItems) {
        let firstError = undefined;
        // Each payload is an independent job in BullMQ, so a failing one must not
        // prevent the others from being processed
        for (const data of dataItems){
            try {
                await this.processJob(queueName, this.createJob(jobName, data));
            } catch (error) {
                firstError = firstError ?? error;
            }
        }
        if ((0, _utils.isDefined)(firstError)) {
            throw firstError;
        }
    }
    async addCron({ queueName, jobName, data }) {
        this.logger.log(`Running cron job with SyncDriver`);
        await this.processJob(queueName, this.createJob(jobName, data));
    }
    async removeCron({ queueName }) {
        this.logger.log(`Removing '${queueName}' cron job with SyncDriver`);
    }
    work(queueName, handler) {
        this.logger.log(`Registering handler for queue: ${queueName}`);
        this.workersMap[queueName] = handler;
    }
    async processJob(queueName, job) {
        const worker = this.workersMap[queueName];
        if (worker) {
            await worker(job);
        } else {
            if (process.env.NODE_ENV !== 'test') {
                this.logger.error(`No handler found for job: ${queueName}`);
            }
        }
    }
    createJob(name, data) {
        const job = {
            id: '',
            name,
            data,
            retryLimit: 0,
            updateData: async (updatedData)=>{
                job.data = updatedData;
            }
        };
        return job;
    }
    constructor(){
        this.logger = new _common.Logger(SyncDriver.name);
        this.workersMap = {};
    }
};

//# sourceMappingURL=sync.driver.js.map