"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "MessageQueueExplorer", {
    enumerable: true,
    get: function() {
        return MessageQueueExplorer;
    }
});
const _common = require("@nestjs/common");
const _core = require("@nestjs/core");
const _injector = require("@nestjs/core/injector/injector");
const _exceptionhandlerservice = require("../exception-handler/exception-handler.service");
const _messagequeuemetadataaccessor = require("./message-queue-metadata.accessor");
const _messagequeueworkerconfigconstant = require("./message-queue-worker-config.constant");
const _messagequeueconstants = require("./message-queue.constants");
const _eventloopstallmonitorservice = require("./services/event-loop-stall-monitor.service");
const _getqueuetokenutil = require("./utils/get-queue-token.util");
const _shouldcreateworkerforqueueutil = require("./utils/should-create-worker-for-queue.util");
const _twentyconfigservice = require("../twenty-config/twenty-config.service");
const _globalexceptionhandlerutil = require("../../utils/global-exception-handler.util");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let MessageQueueExplorer = class MessageQueueExplorer {
    onModuleInit() {
        this.explore();
    }
    explore() {
        const processors = this.discoveryService.getProviders().filter((wrapper)=>this.metadataAccessor.isProcessor(!wrapper.metatype || wrapper.inject ? wrapper.instance?.constructor : wrapper.metatype));
        const groupedProcessors = this.groupProcessorsByQueueName(processors);
        // Filter out empty entries: an explicit empty env value is parsed as ['']
        // by the shared ARRAY transformer, which would otherwise turn an empty
        // allowlist (meaning "all queues") into "no queues"
        const enabledQueues = this.twentyConfigService.get('WORKER_ENABLED_QUEUES').filter((queueName)=>queueName.length > 0);
        const excludedQueues = this.twentyConfigService.get('WORKER_EXCLUDED_QUEUES').filter((queueName)=>queueName.length > 0);
        this.warnAboutUnknownQueueNames([
            ...enabledQueues,
            ...excludedQueues
        ]);
        const groupedProcessorEntries = Object.entries(groupedProcessors);
        for (const [queueName, processorGroupCollection] of groupedProcessorEntries){
            if (!(0, _shouldcreateworkerforqueueutil.shouldCreateWorkerForQueue)({
                queueName,
                enabledQueues,
                excludedQueues
            })) {
                this.logger.log(`Skipping worker creation for queue ${queueName} (filtered out by WORKER_ENABLED_QUEUES/WORKER_EXCLUDED_QUEUES)`);
                continue;
            }
            const queueToken = (0, _getqueuetokenutil.getQueueToken)(queueName);
            const messageQueueService = this.getQueueService(queueToken);
            this.handleProcessorGroupCollection(processorGroupCollection, messageQueueService, _messagequeueworkerconfigconstant.MESSAGE_QUEUE_WORKER_CONFIG[queueName].workerOptions, queueName);
        }
    }
    warnAboutUnknownQueueNames(queueNames) {
        const knownQueueNames = Object.values(_messagequeueconstants.MessageQueue);
        for (const queueName of queueNames){
            if (!knownQueueNames.includes(queueName)) {
                this.logger.warn(`Unknown queue name "${queueName}" in WORKER_ENABLED_QUEUES/WORKER_EXCLUDED_QUEUES, expected one of: ${knownQueueNames.join(', ')}`);
            }
        }
    }
    groupProcessorsByQueueName(processors) {
        return processors.reduce((acc, wrapper)=>{
            const { instance, metatype } = wrapper;
            const methodNames = this.metadataScanner.getAllMethodNames(instance);
            const { queueName } = this.metadataAccessor.getProcessorMetadata(instance.constructor || metatype) ?? {};
            const processMethodNames = methodNames.filter((name)=>this.metadataAccessor.isProcess(instance[name]));
            if (!queueName) {
                this.logger.error(`Processor ${wrapper.name} is missing queue name metadata`);
                return acc;
            }
            if (!wrapper.host) {
                this.logger.error(`Processor ${wrapper.name} is missing host metadata`);
                return acc;
            }
            if (!acc[queueName]) {
                acc[queueName] = [];
            }
            acc[queueName].push({
                instance,
                host: wrapper.host,
                processMethodNames,
                isRequestScoped: !wrapper.isDependencyTreeStatic()
            });
            return acc;
        }, {});
    }
    getQueueService(queueToken) {
        try {
            return this.moduleRef.get(queueToken, {
                strict: false
            });
        } catch (err) {
            this.logger.error(`No queue found for token ${queueToken}`);
            throw err;
        }
    }
    handleProcessorGroupCollection(processorGroupCollection, queue, options, queueName) {
        queue.work(async (job)=>{
            const stallMonitorToken = this.eventLoopStallMonitorService.registerJobStart({
                queueName,
                jobName: job.name,
                workspaceId: job.data?.workspaceId
            });
            try {
                for (const processorGroup of processorGroupCollection){
                    await this.handleProcessor(processorGroup, job);
                }
            } finally{
                this.eventLoopStallMonitorService.registerJobEnd(stallMonitorToken);
            }
        }, options);
    }
    async handleProcessor({ instance, host, processMethodNames, isRequestScoped }, job) {
        const filteredProcessMethodNames = processMethodNames.filter((processMethodName)=>{
            const metadata = this.metadataAccessor.getProcessMetadata(// @ts-expect-error legacy noImplicitAny
            instance[processMethodName]);
            return metadata && job.name === metadata.jobName;
        });
        if (filteredProcessMethodNames.length === 0) {
            return;
        }
        if (isRequestScoped) {
            const contextId = (0, _core.createContextId)();
            if (this.moduleRef.registerRequestByContextId) {
                this.moduleRef.registerRequestByContextId({
                    req: {
                        workspaceId: job.data?.workspaceId
                    }
                }, contextId);
            }
            const contextInstance = await this.injector.loadPerContext(instance, host, host.providers, contextId);
            await this.invokeProcessMethods(contextInstance, filteredProcessMethodNames, job);
        } else {
            await this.invokeProcessMethods(instance, filteredProcessMethodNames, job);
        }
    }
    async invokeProcessMethods(instance, processMethodNames, job) {
        for (const processMethodName of processMethodNames){
            try {
                // @ts-expect-error legacy noImplicitAny
                await instance[processMethodName].call(instance, job.data, {
                    abortSignal: job.abortSignal,
                    retryLimit: job.retryLimit,
                    updateData: job.updateData
                });
            } catch (err) {
                if ((0, _globalexceptionhandlerutil.shouldCaptureException)(err)) {
                    this.exceptionHandlerService.captureExceptions([
                        err
                    ]);
                }
                throw err;
            }
        }
    }
    constructor(moduleRef, discoveryService, metadataAccessor, metadataScanner, exceptionHandlerService, twentyConfigService, eventLoopStallMonitorService){
        this.moduleRef = moduleRef;
        this.discoveryService = discoveryService;
        this.metadataAccessor = metadataAccessor;
        this.metadataScanner = metadataScanner;
        this.exceptionHandlerService = exceptionHandlerService;
        this.twentyConfigService = twentyConfigService;
        this.eventLoopStallMonitorService = eventLoopStallMonitorService;
        this.logger = new _common.Logger('MessageQueueModule');
        this.injector = new _injector.Injector();
    }
};
MessageQueueExplorer = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _core.ModuleRef === "undefined" ? Object : _core.ModuleRef,
        typeof _core.DiscoveryService === "undefined" ? Object : _core.DiscoveryService,
        typeof _messagequeuemetadataaccessor.MessageQueueMetadataAccessor === "undefined" ? Object : _messagequeuemetadataaccessor.MessageQueueMetadataAccessor,
        typeof _core.MetadataScanner === "undefined" ? Object : _core.MetadataScanner,
        typeof _exceptionhandlerservice.ExceptionHandlerService === "undefined" ? Object : _exceptionhandlerservice.ExceptionHandlerService,
        typeof _twentyconfigservice.TwentyConfigService === "undefined" ? Object : _twentyconfigservice.TwentyConfigService,
        typeof _eventloopstallmonitorservice.EventLoopStallMonitorService === "undefined" ? Object : _eventloopstallmonitorservice.EventLoopStallMonitorService
    ])
], MessageQueueExplorer);

//# sourceMappingURL=message-queue.explorer.js.map