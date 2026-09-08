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
    get LogicFunctionExecutionException () {
        return LogicFunctionExecutionException;
    },
    get LogicFunctionExecutionExceptionCode () {
        return LogicFunctionExecutionExceptionCode;
    },
    get LogicFunctionExecutorService () {
        return LogicFunctionExecutorService;
    }
});
const _common = require("@nestjs/common");
const _typeorm = require("@nestjs/typeorm");
const _application = require("twenty-shared/application");
const _types = require("twenty-shared/types");
const _utils = require("twenty-shared/utils");
const _typeorm1 = require("typeorm");
const _uuid = require("uuid");
const _isbillingexemptapplicationutil = require("../../application/application-marketplace/utils/is-billing-exempt-application.util");
const _applicationregistrationvariableentity = require("../../application/application-registration-variable/application-registration-variable.entity");
const _applicationstopservice = require("../../application/application-stop/application-stop.service");
const _applicationvariableservice = require("../../application/application-variable/application-variable.service");
const _applicationservice = require("../../application/application.service");
const _applicationtokenservice = require("../../auth/token/services/application-token.service");
const _nobillingsubscriptionconstant = require("../../billing/constants/no-billing-subscription.constant");
const _billingusageservice = require("../../billing/services/billing-usage.service");
const _billingservice = require("../../billing/services/billing.service");
const _workspacedomainsservice = require("../../domain/workspace-domains/services/workspace-domains.service");
const _eventlogemitterservice = require("../../event-logs/emit/event-log-emitter.service");
const _logicfunctionexecuted = require("../../event-logs/emit/events/workspace-event/logic-function/logic-function-executed");
const _eventlogliveservice = require("../../event-logs/live/event-log-live.service");
const _buildapplicationlogenvelopes = require("../../event-logs/producers/application-log/build-application-log-envelopes");
const _parseapplicationloglines = require("../../event-logs/producers/application-log/parse-application-log-lines");
const _featureflagservice = require("../../feature-flag/services/feature-flag.service");
const _logicfunctiondriverfactory = require("../logic-function-drivers/logic-function-driver.factory");
const _computelogicfunctionexecutioncreditsmicroutil = require("./utils/compute-logic-function-execution-credits-micro.util");
const _resolveworkspacememberidforuserutil = require("./utils/resolve-workspace-member-id-for-user.util");
const _secretencryptionservice = require("../../secret-encryption/secret-encryption.service");
const _throttlerservice = require("../../throttler/throttler.service");
const _twentyconfigservice = require("../../twenty-config/twenty-config.service");
const _usageoperationtypeenum = require("../../usage/enums/usage-operation-type.enum");
const _usageresourcetypeenum = require("../../usage/enums/usage-resource-type.enum");
const _usageunitenum = require("../../usage/enums/usage-unit.enum");
const _usagerecorderservice = require("../../usage/services/usage-recorder.service");
const _workspaceentity = require("../../workspace/workspace.entity");
const _findflatentitybyidinflatentitymapsutil = require("../../../metadata-modules/flat-entity/utils/find-flat-entity-by-id-in-flat-entity-maps.util");
const _logicfunctionentity = require("../../../metadata-modules/logic-function/logic-function.entity");
const _logicfunctionexception = require("../../../metadata-modules/logic-function/logic-function.exception");
const _subscriptionchannelenum = require("../../../subscriptions/enums/subscription-channel.enum");
const _subscriptionservice = require("../../../subscriptions/subscription.service");
const _workspacecacheservice = require("../../../workspace-cache/services/workspace-cache.service");
const _cleanserverurl = require("../../../../utils/clean-server-url");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
function _ts_param(paramIndex, decorator) {
    return function(target, key) {
        decorator(target, key, paramIndex);
    };
}
let LogicFunctionExecutionException = class LogicFunctionExecutionException extends Error {
    constructor(message, code){
        super(message), this.code = code;
        this.name = 'LogicFunctionExecutionException';
    }
};
var LogicFunctionExecutionExceptionCode = /*#__PURE__*/ function(LogicFunctionExecutionExceptionCode) {
    LogicFunctionExecutionExceptionCode["LOGIC_FUNCTION_NOT_FOUND"] = "LOGIC_FUNCTION_NOT_FOUND";
    LogicFunctionExecutionExceptionCode["RATE_LIMIT_EXCEEDED"] = "RATE_LIMIT_EXCEEDED";
    return LogicFunctionExecutionExceptionCode;
}({});
let LogicFunctionExecutorService = class LogicFunctionExecutorService {
    async execute({ logicFunctionId, workspaceId, payload, userId, userWorkspaceId, executionMode, workspaceDeletionRequestTimestamp, retry = {
        retryCount: 0,
        maxRetries: 0
    } }) {
        const { flatApplication, flatLogicFunction, applicationVariableMaps } = await this.getFlatEntitiesOrThrow({
            workspaceId,
            logicFunctionId
        });
        // Checked before the shared workspace throttle so a flood from a stopped
        // application cannot exhaust the token bucket of the other applications.
        await this.assertApplicationNotStopped(flatApplication);
        await this.throttleExecution(workspaceId);
        const envVariables = await this.getExecutionEnvVariables({
            workspaceId,
            flatApplication,
            applicationVariableMaps,
            userId,
            userWorkspaceId,
            workspaceDeletionRequestTimestamp
        });
        const context = await this.buildExecutionContext({
            workspaceId,
            retry,
            userId,
            userWorkspaceId
        });
        const driver = this.logicFunctionDriverFactory.getCurrentDriver();
        const effectiveExecutionMode = await this.resolveEffectiveExecutionMode({
            workspaceId,
            flatLogicFunction,
            callerOverride: executionMode
        });
        if (effectiveExecutionMode === _logicfunctionentity.LogicFunctionExecutionMode.PREBUILT) {
            await this.ensurePrebuiltBundleInstalled({
                driver,
                flatLogicFunction,
                flatApplication
            });
        }
        let resultLogicFunction;
        try {
            resultLogicFunction = await driver.execute({
                flatLogicFunction,
                flatApplication,
                applicationUniversalIdentifier: flatApplication.universalIdentifier,
                payload,
                context,
                env: envVariables,
                timeoutMs: flatLogicFunction.timeoutSeconds * 1_000,
                forceExecutionMode: effectiveExecutionMode
            });
        } catch (error) {
            this.logger.error(`Logic function execution failed: ` + `functionId=${logicFunctionId}, ` + `workspaceId=${workspaceId}, ` + `driver=${driver.constructor.name}, ` + `mode=${effectiveExecutionMode}: ` + `${error instanceof Error ? error.message : String(error)}`, error instanceof Error ? error.stack : undefined);
            throw error;
        }
        await this.handleExecutionResult({
            result: resultLogicFunction,
            flatApplication,
            flatLogicFunction,
            workspaceId
        });
        return resultLogicFunction;
    }
    async resolveEffectiveExecutionMode({ workspaceId, flatLogicFunction, callerOverride }) {
        if ((0, _utils.isDefined)(callerOverride)) {
            return callerOverride;
        }
        const isPrebuiltModeEnabled = await this.featureFlagService.isFeatureEnabled(_types.FeatureFlagKey.IS_LOGIC_FUNCTION_PREBUILT_MODE_ENABLED, workspaceId);
        if (!isPrebuiltModeEnabled) {
            return _logicfunctionentity.LogicFunctionExecutionMode.LIVE;
        }
        return flatLogicFunction.executionMode ?? _logicfunctionentity.LogicFunctionExecutionMode.LIVE;
    }
    async ensurePrebuiltBundleInstalled({ driver, flatLogicFunction, flatApplication }) {
        const installedChecksum = await driver.getInstalledBundleChecksum(flatLogicFunction);
        if (installedChecksum === flatLogicFunction.checksum) {
            return;
        }
        try {
            await driver.installPrebuiltBundle({
                flatLogicFunction,
                flatApplication,
                applicationUniversalIdentifier: flatApplication.universalIdentifier
            });
        } catch (error) {
            const cause = error instanceof Error ? error.message : String(error);
            this.logger.error(`Failed to install prebuilt bundle on-demand for function '${flatLogicFunction.id}' ` + `(installed=${installedChecksum ?? 'none'}, expected=${flatLogicFunction.checksum ?? 'none'}): ` + `${cause}`, error instanceof Error ? error.stack : undefined);
            throw new _logicfunctionexception.LogicFunctionException(`Failed to install the prebuilt bundle for function '${flatLogicFunction.id}' ` + `(installed=${installedChecksum ?? 'none'}, expected=${flatLogicFunction.checksum ?? 'none'}): ` + `${cause}`, _logicfunctionexception.LogicFunctionExceptionCode.LOGIC_FUNCTION_PREBUILT_BUNDLE_NOT_INSTALLED);
        }
    }
    async transpile(params) {
        const driver = this.logicFunctionDriverFactory.getCurrentDriver();
        return driver.transpile(params);
    }
    async assertApplicationNotStopped(flatApplication) {
        if (await this.applicationStopService.isApplicationStopped(flatApplication.universalIdentifier)) {
            throw new _logicfunctionexception.LogicFunctionException(`Application ${flatApplication.universalIdentifier} is temporarily stopped`, _logicfunctionexception.LogicFunctionExceptionCode.LOGIC_FUNCTION_DISABLED);
        }
    }
    async throttleExecution(workspaceId) {
        try {
            await this.throttlerService.tokenBucketThrottleOrThrow(`${workspaceId}-logic-function-execution`, 1, this.twentyConfigService.get('LOGIC_FUNCTION_EXEC_THROTTLE_LIMIT'), this.twentyConfigService.get('LOGIC_FUNCTION_EXEC_THROTTLE_TTL'));
        } catch  {
            throw new LogicFunctionExecutionException('Logic function execution rate limit exceeded', "RATE_LIMIT_EXCEEDED");
        }
    }
    async getFlatEntitiesOrThrow({ workspaceId, logicFunctionId }) {
        const { flatLogicFunctionMaps, flatApplicationMaps, applicationVariableMaps } = await this.workspaceCacheService.getOrRecompute(workspaceId, [
            'flatLogicFunctionMaps',
            'flatApplicationMaps',
            'applicationVariableMaps'
        ]);
        const flatLogicFunction = (0, _findflatentitybyidinflatentitymapsutil.findFlatEntityByIdInFlatEntityMaps)({
            flatEntityId: logicFunctionId,
            flatEntityMaps: flatLogicFunctionMaps
        });
        if (!(0, _utils.isDefined)(flatLogicFunction) || (0, _utils.isDefined)(flatLogicFunction.deletedAt)) {
            throw new LogicFunctionExecutionException(`Logic function with id ${logicFunctionId} not found`, "LOGIC_FUNCTION_NOT_FOUND");
        }
        const flatApplication = (0, _utils.isDefined)(flatLogicFunction.applicationId) ? flatApplicationMaps.byId[flatLogicFunction.applicationId] : undefined;
        if (!(0, _utils.isDefined)(flatApplication)) {
            throw new LogicFunctionExecutionException(`Application not found for logic function ${logicFunctionId}`, "LOGIC_FUNCTION_NOT_FOUND");
        }
        return {
            flatApplication,
            flatLogicFunction,
            applicationVariableMaps
        };
    }
    async buildExecutionContext({ workspaceId, retry, userId, userWorkspaceId }) {
        return {
            ...retry,
            workspaceId,
            userWorkspaceId: userWorkspaceId ?? null,
            workspaceMemberId: (0, _utils.isDefined)(userId) ? await this.resolveWorkspaceMemberId({
                workspaceId,
                userId
            }) : null
        };
    }
    async resolveWorkspaceMemberId({ workspaceId, userId }) {
        const { flatWorkspaceMemberMaps } = await this.workspaceCacheService.getOrRecompute(workspaceId, [
            'flatWorkspaceMemberMaps'
        ]);
        return (0, _resolveworkspacememberidforuserutil.resolveWorkspaceMemberIdForUser)({
            userId,
            flatWorkspaceMemberMaps
        });
    }
    async getExecutionEnvVariables({ workspaceId, flatApplication, applicationVariableMaps, userId, userWorkspaceId, workspaceDeletionRequestTimestamp }) {
        // Two tokens so a handler can choose per call which access it acts with,
        // rather than the whole run being locked to one of them.
        const hasTriggeringPerson = (0, _utils.isDefined)(userId) && (0, _utils.isDefined)(userWorkspaceId);
        const [applicationAccessToken, delegatedAccessToken] = await Promise.all([
            (0, _utils.isDefined)(workspaceDeletionRequestTimestamp) ? this.applicationTokenService.generateWorkspaceDeletionApplicationAccessToken({
                workspaceId,
                applicationId: flatApplication.id,
                workspaceDeletionRequestTimestamp
            }) : this.applicationTokenService.generateApplicationAccessToken({
                workspaceId,
                applicationId: flatApplication.id
            }),
            hasTriggeringPerson && !(0, _utils.isDefined)(workspaceDeletionRequestTimestamp) ? this.applicationTokenService.generateApplicationAccessToken({
                workspaceId,
                applicationId: flatApplication.id,
                userId,
                userWorkspaceId
            }) : null
        ]);
        const baseUrl = (0, _cleanserverurl.cleanServerUrl)(this.twentyConfigService.get('SERVER_URL'));
        const functionsBaseUrl = await this.buildFunctionsBaseUrl({
            workspaceId,
            flatApplication
        });
        const serverVariables = await this.buildServerVariableEnvMap(flatApplication.applicationRegistrationId);
        const workspaceVariables = await this.applicationVariableService.getServerEnvVariables({
            workspaceId,
            applicationId: flatApplication.id,
            applicationVariableMaps
        });
        return {
            [_application.DEFAULT_API_URL_NAME]: baseUrl ?? '',
            // Falls back to the application when nobody triggered the run, so a cron
            // schedule or an install hook keeps working without asking for anything.
            [_application.DEFAULT_APP_ACCESS_TOKEN_NAME]: (delegatedAccessToken ?? applicationAccessToken).token,
            [_application.DEFAULT_APP_APPLICATION_ACCESS_TOKEN_NAME]: applicationAccessToken.token,
            [_application.DEFAULT_API_KEY_NAME]: applicationAccessToken.token,
            [_application.DEFAULT_FUNCTIONS_URL_NAME]: functionsBaseUrl ?? '',
            APPLICATION_ID: flatApplication.id,
            ...serverVariables,
            ...workspaceVariables
        };
    }
    async buildFunctionsBaseUrl({ workspaceId, flatApplication }) {
        const workspace = await this.workspaceRepository.findOne({
            where: {
                id: workspaceId
            },
            select: {
                subdomain: true
            },
            withDeleted: true
        });
        if (!(0, _utils.isDefined)(workspace)) {
            return undefined;
        }
        const primaryPublicDomain = await this.applicationService.findPrimaryPublicDomainName({
            applicationId: flatApplication.id,
            workspaceId
        });
        return this.workspaceDomainsService.buildPublicFunctionBaseUrl({
            workspace,
            primaryPublicDomain
        });
    }
    async buildServerVariableEnvMap(applicationRegistrationId) {
        if (!(0, _utils.isDefined)(applicationRegistrationId)) {
            return {};
        }
        const serverVariables = await this.applicationRegistrationVariableRepository.find({
            where: {
                applicationRegistrationId
            }
        });
        const envMap = {};
        for (const variable of serverVariables){
            const plaintextValue = this.secretEncryptionService.decryptVersionedOrThrow(variable.encryptedValue);
            if (plaintextValue !== '') {
                envMap[variable.key] = plaintextValue;
            }
        }
        return envMap;
    }
    async publishLogicFunctionLogsToCli({ result, flatApplication, flatLogicFunction, workspaceId }) {
        try {
            const isWatched = await this.eventLogLiveService.isWatched(workspaceId, _subscriptionchannelenum.SubscriptionChannel.LOGIC_FUNCTION_LOGS_CHANNEL);
            if (!isWatched) {
                return;
            }
            await this.subscriptionService.publish({
                channel: _subscriptionchannelenum.SubscriptionChannel.LOGIC_FUNCTION_LOGS_CHANNEL,
                workspaceId,
                payload: {
                    logicFunctionLogs: {
                        logs: result.logs,
                        id: flatLogicFunction.id,
                        name: flatLogicFunction.name,
                        universalIdentifier: flatLogicFunction.universalIdentifier,
                        applicationId: flatApplication.id,
                        applicationUniversalIdentifier: flatApplication.universalIdentifier
                    }
                }
            });
        } catch (error) {
            this.logger.error('Failed to publish logic function logs', error);
        }
    }
    async handleExecutionResult({ result, flatApplication, flatLogicFunction, workspaceId }) {
        const executionId = (0, _uuid.v4)();
        const parsedLines = (0, _parseapplicationloglines.parseApplicationLogLines)(result.logs);
        const logEntries = parsedLines.map((line)=>({
                ...line,
                workspaceId,
                applicationId: flatApplication.id,
                logicFunctionId: flatLogicFunction.id,
                logicFunctionName: flatLogicFunction.name,
                executionId
            }));
        if (this.eventLogEmitterService.isEnabled()) {
            void this.eventLogEmitterService.dispatch((0, _buildapplicationlogenvelopes.buildApplicationLogEnvelopes)(logEntries)).catch((error)=>{
                this.logger.error('Failed to record application logs', error);
            });
        }
        void this.publishLogicFunctionLogsToCli({
            result,
            flatApplication,
            flatLogicFunction,
            workspaceId
        });
        void this.eventLogEmitterService.createContext({
            workspaceId
        }).insertWorkspaceEvent(_logicfunctionexecuted.LOGIC_FUNCTION_EXECUTED_EVENT, {
            duration: result.duration,
            status: result.status,
            ...result.error && {
                errorType: result.error.errorType
            },
            functionId: flatLogicFunction.id,
            functionName: flatLogicFunction.name
        });
        // Billing-exempt apps (first-party maintenance apps whose per-record
        // triggers fire during mailbox/calendar import) do not consume the
        // workspace's credits for the execution itself. Explicit chargeCredits
        // calls and AI token usage from within the function are billed separately
        // and stay untouched.
        const { invocationCreditsMicro, durationCreditsMicro, billedDurationMs } = (0, _computelogicfunctionexecutioncreditsmicroutil.computeLogicFunctionExecutionCreditsMicro)({
            durationMs: result.billedDurationMs,
            isBillingExempt: (0, _isbillingexemptapplicationutil.isBillingExemptApplication)(flatApplication.universalIdentifier)
        });
        const totalCreditsMicro = invocationCreditsMicro + durationCreditsMicro;
        if (this.billingService.isBillingEnabled()) {
            const { currentBillingSubscription } = await this.workspaceCacheService.getOrRecompute(workspaceId, [
                'currentBillingSubscription'
            ]);
            if (currentBillingSubscription !== _nobillingsubscriptionconstant.NO_BILLING_SUBSCRIPTION && totalCreditsMicro > 0) {
                await this.billingUsageService.decrementAvailableCreditsInCache({
                    workspaceId,
                    usedCredits: totalCreditsMicro
                });
            }
        }
        const spenders = {
            logicFunctionId: flatLogicFunction.id,
            applicationId: flatApplication.id
        };
        await this.usageRecorderService.record(workspaceId, [
            {
                resourceType: _usageresourcetypeenum.UsageResourceType.LOGIC_FUNCTION,
                operationType: _usageoperationtypeenum.UsageOperationType.CODE_EXECUTION,
                creditsUsedMicro: invocationCreditsMicro,
                quantity: 1,
                unit: _usageunitenum.UsageUnit.INVOCATION,
                resourceId: flatLogicFunction.id,
                spenders
            },
            {
                resourceType: _usageresourcetypeenum.UsageResourceType.LOGIC_FUNCTION,
                operationType: _usageoperationtypeenum.UsageOperationType.CODE_EXECUTION,
                creditsUsedMicro: durationCreditsMicro,
                quantity: billedDurationMs,
                unit: _usageunitenum.UsageUnit.MILLISECOND,
                resourceId: flatLogicFunction.id,
                spenders
            }
        ]);
    }
    constructor(logicFunctionDriverFactory, throttlerService, twentyConfigService, workspaceCacheService, applicationTokenService, secretEncryptionService, applicationVariableService, subscriptionService, eventLogLiveService, eventLogEmitterService, usageRecorderService, billingService, billingUsageService, featureFlagService, workspaceDomainsService, applicationService, applicationStopService, workspaceRepository, applicationRegistrationVariableRepository){
        this.logicFunctionDriverFactory = logicFunctionDriverFactory;
        this.throttlerService = throttlerService;
        this.twentyConfigService = twentyConfigService;
        this.workspaceCacheService = workspaceCacheService;
        this.applicationTokenService = applicationTokenService;
        this.secretEncryptionService = secretEncryptionService;
        this.applicationVariableService = applicationVariableService;
        this.subscriptionService = subscriptionService;
        this.eventLogLiveService = eventLogLiveService;
        this.eventLogEmitterService = eventLogEmitterService;
        this.usageRecorderService = usageRecorderService;
        this.billingService = billingService;
        this.billingUsageService = billingUsageService;
        this.featureFlagService = featureFlagService;
        this.workspaceDomainsService = workspaceDomainsService;
        this.applicationService = applicationService;
        this.applicationStopService = applicationStopService;
        this.workspaceRepository = workspaceRepository;
        this.applicationRegistrationVariableRepository = applicationRegistrationVariableRepository;
        this.logger = new _common.Logger(LogicFunctionExecutorService.name);
    }
};
LogicFunctionExecutorService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_param(17, (0, _typeorm.InjectRepository)(_workspaceentity.WorkspaceEntity)),
    _ts_param(18, (0, _typeorm.InjectRepository)(_applicationregistrationvariableentity.ApplicationRegistrationVariableEntity)),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _logicfunctiondriverfactory.LogicFunctionDriverFactory === "undefined" ? Object : _logicfunctiondriverfactory.LogicFunctionDriverFactory,
        typeof _throttlerservice.ThrottlerService === "undefined" ? Object : _throttlerservice.ThrottlerService,
        typeof _twentyconfigservice.TwentyConfigService === "undefined" ? Object : _twentyconfigservice.TwentyConfigService,
        typeof _workspacecacheservice.WorkspaceCacheService === "undefined" ? Object : _workspacecacheservice.WorkspaceCacheService,
        typeof _applicationtokenservice.ApplicationTokenService === "undefined" ? Object : _applicationtokenservice.ApplicationTokenService,
        typeof _secretencryptionservice.SecretEncryptionService === "undefined" ? Object : _secretencryptionservice.SecretEncryptionService,
        typeof _applicationvariableservice.ApplicationVariableEntityService === "undefined" ? Object : _applicationvariableservice.ApplicationVariableEntityService,
        typeof _subscriptionservice.SubscriptionService === "undefined" ? Object : _subscriptionservice.SubscriptionService,
        typeof _eventlogliveservice.EventLogLiveService === "undefined" ? Object : _eventlogliveservice.EventLogLiveService,
        typeof _eventlogemitterservice.EventLogEmitterService === "undefined" ? Object : _eventlogemitterservice.EventLogEmitterService,
        typeof _usagerecorderservice.UsageRecorderService === "undefined" ? Object : _usagerecorderservice.UsageRecorderService,
        typeof _billingservice.BillingService === "undefined" ? Object : _billingservice.BillingService,
        typeof _billingusageservice.BillingUsageService === "undefined" ? Object : _billingusageservice.BillingUsageService,
        typeof _featureflagservice.FeatureFlagService === "undefined" ? Object : _featureflagservice.FeatureFlagService,
        typeof _workspacedomainsservice.WorkspaceDomainsService === "undefined" ? Object : _workspacedomainsservice.WorkspaceDomainsService,
        typeof _applicationservice.ApplicationService === "undefined" ? Object : _applicationservice.ApplicationService,
        typeof _applicationstopservice.ApplicationStopService === "undefined" ? Object : _applicationstopservice.ApplicationStopService,
        typeof _typeorm1.Repository === "undefined" ? Object : _typeorm1.Repository,
        typeof _typeorm1.Repository === "undefined" ? Object : _typeorm1.Repository
    ])
], LogicFunctionExecutorService);

//# sourceMappingURL=logic-function-executor.service.js.map