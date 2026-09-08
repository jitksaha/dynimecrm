"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "BullMQDriver", {
    enumerable: true,
    get: function() {
        return BullMQDriver;
    }
});
const _common = require("@nestjs/common");
const _node = /*#__PURE__*/ _interop_require_wildcard(require("@sentry/node"));
const _bullmq = require("bullmq");
const _utils = require("twenty-shared/utils");
const _uuid = require("uuid");
const _queueretentionconstants = require("../constants/queue-retention.constants");
const _messagequeueworkerconfigconstant = require("../message-queue-worker-config.constant");
const _getjobkeyutil = require("../utils/get-job-key.util");
const _metricskeystype = require("../../metrics/types/metrics-keys.type");
const _applyworkspacesentrycontextfromjobdatautil = require("../../sentry/utils/apply-workspace-sentry-context-from-job-data.util");
function _getRequireWildcardCache(nodeInterop) {
    if (typeof WeakMap !== "function") return null;
    var cacheBabelInterop = new WeakMap();
    var cacheNodeInterop = new WeakMap();
    return (_getRequireWildcardCache = function(nodeInterop) {
        return nodeInterop ? cacheNodeInterop : cacheBabelInterop;
    })(nodeInterop);
}
function _interop_require_wildcard(obj, nodeInterop) {
    if (!nodeInterop && obj && obj.__esModule) {
        return obj;
    }
    if (obj === null || typeof obj !== "object" && typeof obj !== "function") {
        return {
            default: obj
        };
    }
    var cache = _getRequireWildcardCache(nodeInterop);
    if (cache && cache.has(obj)) {
        return cache.get(obj);
    }
    var newObj = {
        __proto__: null
    };
    var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;
    for(var key in obj){
        if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) {
            var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;
            if (desc && (desc.get || desc.set)) {
                Object.defineProperty(newObj, key, desc);
            } else {
                newObj[key] = obj[key];
            }
        }
    }
    newObj.default = obj;
    if (cache) {
        cache.set(obj, newObj);
    }
    return newObj;
}
const V4_LENGTH = 36;
let BullMQDriver = class BullMQDriver {
    onModuleInit() {
        this.metricsService.createMultiObservableGauge({
            metricName: 'twenty_queue_jobs_waiting_total',
            options: {
                description: 'Current number of jobs waiting in queue'
            },
            callback: async ()=>{
                const observations = [];
                for (const [queueName, queue] of Object.entries(this.queueMap)){
                    try {
                        const waitingCount = await queue.count();
                        observations.push({
                            value: waitingCount,
                            attributes: {
                                queue: queueName
                            }
                        });
                    } catch (error) {
                        this.logger.error(`Failed to collect waiting jobs metrics for queue ${queueName}`, error);
                    }
                }
                return observations;
            }
        });
    }
    register(queueName) {
        this.queueMap[queueName] = new _bullmq.Queue(queueName, this.options);
    }
    async onModuleDestroy() {
        const workers = Object.entries(this.workerMap);
        const queues = Object.values(this.queueMap);
        if (workers.length > 0) {
            this.logger.log(`Draining active jobs on queues: ${workers.map(([queueName])=>queueName).join(', ')}`);
        }
        let workerCloseError;
        try {
            await Promise.all(workers.map(([queueName, worker])=>this.closeWorker(queueName, worker)));
        } catch (error) {
            workerCloseError = error;
        }
        try {
            await Promise.all(queues.map((queue)=>queue.close()));
        } catch (error) {
            if (!(0, _utils.isDefined)(workerCloseError)) {
                throw error;
            }
            this.logger.error(`Failed to close queues during shutdown: ${error instanceof Error ? error.message : String(error)}`);
        }
        if ((0, _utils.isDefined)(workerCloseError)) {
            throw workerCloseError;
        }
        this.logger.log('Message queue shutdown complete');
    }
    async closeWorker(queueName, worker) {
        if (!this.workerOptionsMap[queueName]?.boundedShutdownDrain) {
            await worker.close();
            return;
        }
        const shutdownTimeoutMs = this.twentyConfigService.get('AI_STREAM_SHUTDOWN_DRAIN_MS');
        const abortTimer = setTimeout(()=>{
            this.logger.warn(`Queue ${queueName} still has active jobs after draining for ${shutdownTimeoutMs}ms, aborting them`);
            worker.cancelAllJobs('worker shutdown');
        }, shutdownTimeoutMs);
        try {
            await worker.close();
        } finally{
            clearTimeout(abortTimer);
        }
    }
    work(queueName, handler, options) {
        const workerOptions = {
            ...this.options,
            ...(0, _utils.isDefined)(options?.concurrency) ? {
                concurrency: options.concurrency
            } : {},
            ...(0, _utils.isDefined)(options?.lockDuration) ? {
                lockDuration: options.lockDuration
            } : {},
            ...(0, _utils.isDefined)(options?.maxStalledCount) ? {
                maxStalledCount: options.maxStalledCount
            } : {},
            metrics: {
                maxDataPoints: _bullmq.MetricsTime.ONE_WEEK,
                collectInterval: 60000
            }
        };
        this.workerOptionsMap[queueName] = options;
        this.workerMap[queueName] = new _bullmq.Worker(queueName, async (job, _token, abortSignal)=>_node.withIsolationScope(async ()=>{
                (0, _applyworkspacesentrycontextfromjobdatautil.applyWorkspaceSentryContextFromJobData)(job.data);
                const queueLatency = Math.max(0, Date.now() - job.timestamp);
                this.metricsService.recordHistogram({
                    key: _metricskeystype.MetricsKeys.JobLatencyMs,
                    value: queueLatency,
                    unit: 'ms',
                    attributes: {
                        queue: queueName,
                        job_name: job.name
                    }
                });
                // TODO: Correctly support for job.id
                const timeStart = performance.now();
                const workspaceId = job.data?.workspaceId;
                const workspaceSuffix = workspaceId ? ` [workspace=${workspaceId}]` : '';
                this.logger.log(`Processing job ${job.id} with name ${job.name} on queue ${queueName}${workspaceSuffix}`);
                await handler({
                    data: job.data,
                    id: job.id ?? '',
                    name: job.name,
                    retryLimit: Math.max(0, (job.opts.attempts ?? 1) - 1),
                    updateData: (data)=>job.updateData(data),
                    abortSignal
                });
                const timeEnd = performance.now();
                const executionTime = timeEnd - timeStart;
                this.logger.log(`Job ${job.id} with name ${job.name} processed on queue ${queueName} in ${executionTime.toFixed(2)}ms${workspaceSuffix}`);
            }), workerOptions);
        this.workerMap[queueName].on('completed', (job)=>{
            void this.metricsService.incrementCounterForEvent({
                key: _metricskeystype.MetricsKeys.JobCompleted,
                attributes: {
                    queue: queueName,
                    job_name: job?.name ?? ''
                },
                shouldStoreInCache: false
            });
        });
        this.workerMap[queueName].on('failed', (job, error)=>{
            if (!(0, _utils.isDefined)(job) || !(0, _utils.isDefined)(error)) {
                return;
            }
            void this.metricsService.incrementCounterForEvent({
                key: _metricskeystype.MetricsKeys.JobFailed,
                attributes: {
                    queue: queueName,
                    job_name: job.name,
                    error_type: error.name
                },
                shouldStoreInCache: false
            });
        });
        this.workerMap[queueName].on('stalled', (jobId)=>{
            this.logger.warn(`Job ${jobId} stalled on queue ${queueName}: its worker stopped processing it without completing or failing it`);
            void this.metricsService.incrementCounterForEvent({
                key: _metricskeystype.MetricsKeys.JobStalled,
                attributes: {
                    queue: queueName
                },
                shouldStoreInCache: false
            });
        });
    }
    async addCron({ queueName, jobName, data, options, jobId }) {
        if (!this.queueMap[queueName]) {
            throw new Error(`Queue ${queueName} is not registered, make sure you have added it as a queue provider`);
        }
        const queueOptions = {
            priority: options?.priority,
            repeat: options?.repeat,
            removeOnComplete: {
                age: _queueretentionconstants.QUEUE_RETENTION.completedMaxAge,
                count: _queueretentionconstants.QUEUE_RETENTION.completedMaxCount
            },
            removeOnFail: {
                age: _queueretentionconstants.QUEUE_RETENTION.failedMaxAge,
                count: _queueretentionconstants.QUEUE_RETENTION.failedMaxCount
            }
        };
        await this.queueMap[queueName].upsertJobScheduler((0, _getjobkeyutil.getJobKey)({
            jobName,
            jobId
        }), options?.repeat, {
            name: jobName,
            data,
            opts: queueOptions
        });
    }
    async removeCron({ queueName, jobName, jobId }) {
        await this.queueMap[queueName].removeJobScheduler((0, _getjobkeyutil.getJobKey)({
            jobName,
            jobId
        }));
    }
    buildJobsOptions({ queueName, options }) {
        return {
            // We suffix the id with V4() to make sure ids are unique so we can add a waiting job when a job related with the same option.id is running
            jobId: options?.id ? `${options.id}-${(0, _uuid.v4)()}` : undefined,
            priority: options?.priority ?? _messagequeueworkerconfigconstant.MESSAGE_QUEUE_WORKER_CONFIG[queueName].priority,
            attempts: 1 + (options?.retryLimit || 0),
            backoff: options?.backoff ? {
                type: options.backoff.strategy,
                delay: options.backoff.initialDelayMilliseconds,
                jitter: options.backoff.jitter
            } : undefined,
            removeOnComplete: {
                age: _queueretentionconstants.QUEUE_RETENTION.completedMaxAge,
                count: _queueretentionconstants.QUEUE_RETENTION.completedMaxCount
            },
            removeOnFail: {
                age: _queueretentionconstants.QUEUE_RETENTION.failedMaxAge,
                count: _queueretentionconstants.QUEUE_RETENTION.failedMaxCount
            },
            delay: options?.delay
        };
    }
    async add(queueName, jobName, data, options) {
        if (!this.queueMap[queueName]) {
            throw new Error(`Queue ${queueName} is not registered, make sure you have added it as a queue provider`);
        }
        // This ensures only one waiting job can be queued for a specific option.id
        if (options?.id && !options?.allowDuplicatedPrefixes) {
            const waitingJobs = await this.queueMap[queueName].getJobs([
                'waiting'
            ]);
            const isJobAlreadyWaiting = waitingJobs.some((job)=>job.id?.slice(0, -(V4_LENGTH + 1)) === options.id);
            if (isJobAlreadyWaiting) {
                return;
            }
        }
        const queueOptions = this.buildJobsOptions({
            queueName,
            options
        });
        await this.queueMap[queueName].add(jobName, data, queueOptions);
    }
    async bulkAdd(queueName, jobName, dataItems, options) {
        if (!this.queueMap[queueName]) {
            throw new Error(`Queue ${queueName} is not registered, make sure you have added it as a queue provider`);
        }
        if (dataItems.length === 0) {
            return;
        }
        const queueOptions = this.buildJobsOptions({
            queueName,
            options
        });
        await this.queueMap[queueName].addBulk(dataItems.map((data, index)=>({
                name: jobName,
                data,
                opts: {
                    ...queueOptions,
                    jobId: queueOptions.jobId ? `${queueOptions.jobId}-${index}` : undefined
                }
            })));
    }
    async getInFlightJobs(queueName) {
        if (!this.queueMap[queueName]) {
            throw new Error(`Queue ${queueName} is not registered, make sure you have added it as a queue provider`);
        }
        const jobs = await this.queueMap[queueName].getJobs([
            'active',
            'waiting',
            'waiting-children',
            'paused',
            'prioritized',
            'delayed'
        ]);
        return jobs.filter(_utils.isDefined).map((job)=>({
                id: job.id,
                data: job.data
            }));
    }
    constructor(options, metricsService, twentyConfigService){
        this.options = options;
        this.metricsService = metricsService;
        this.twentyConfigService = twentyConfigService;
        this.logger = new _common.Logger(BullMQDriver.name);
        this.queueMap = {};
        this.workerMap = {};
        this.workerOptionsMap = {};
    }
};

//# sourceMappingURL=bullmq.driver.js.map