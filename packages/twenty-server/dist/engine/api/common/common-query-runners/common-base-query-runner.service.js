"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "CommonBaseQueryRunnerService", {
    enumerable: true,
    get: function() {
        return CommonBaseQueryRunnerService;
    }
});
const _common = require("@nestjs/common");
const _types = require("twenty-shared/types");
const _utils = require("twenty-shared/utils");
const _dataargprocessorservice = require("../common-args-processors/data-arg-processor/data-arg-processor.service");
const _filterargprocessorservice = require("../common-args-processors/filter-arg-processor/filter-arg-processor.service");
const _groupbyargprocessorservice = require("../common-args-processors/group-by-arg-processor/group-by-arg-processor.service");
const _orderbyargprocessorservice = require("../common-args-processors/order-by-arg-processor/order-by-arg-processor.service");
const _orderbywithgroupbyargprocessorservice = require("../common-args-processors/order-by-with-group-by-arg-processor/order-by-with-group-by-arg-processor.service");
const _queryrunnerargsfactory = require("../common-args-processors/query-runner-args.factory");
const _processnestedrelationshelper = require("../common-nested-relations-processor/process-nested-relations.helper");
const _commonqueryrunnerexception = require("./errors/common-query-runner.exception");
const _standarderrormessageconstant = require("./errors/standard-error-message.constant");
const _buildmutationquerybuilderutil = require("./utils/build-mutation-query-builder.util");
const _isrecordfilteremptyutil = require("./utils/is-record-filter-empty.util");
const _commonresultgettersservice = require("../common-result-getters/common-result-getters.service");
const _objectswithsettingspermissionsrequirements = require("../../graphql/graphql-query-runner/constants/objects-with-settings-permissions-requirements");
const _graphqlqueryparser = require("../../graphql/graphql-query-runner/graphql-query-parsers/graphql-query.parser");
const _workspacequeryhookservice = require("../../graphql/workspace-query-runner/workspace-query-hook/workspace-query-hook.service");
const _isapikeyauthcontextguard = require("../../../core-modules/auth/guards/is-api-key-auth-context.guard");
const _isapplicationauthcontextguard = require("../../../core-modules/auth/guards/is-application-auth-context.guard");
const _isuserauthcontextguard = require("../../../core-modules/auth/guards/is-user-auth-context.guard");
const _featureflagservice = require("../../../core-modules/feature-flag/services/feature-flag.service");
const _metricsservice = require("../../../core-modules/metrics/metrics.service");
const _metricskeystype = require("../../../core-modules/metrics/types/metrics-keys.type");
const _throttlerexception = require("../../../core-modules/throttler/throttler.exception");
const _throttlerservice = require("../../../core-modules/throttler/throttler.service");
const _twentyconfigservice = require("../../../core-modules/twenty-config/twenty-config.service");
const _usagelimitexception = require("../../../core-modules/usage-limit/exceptions/usage-limit.exception");
const _usagelimitspeedservice = require("../../../core-modules/usage-limit/services/usage-limit-speed.service");
const _usageoperationtypeenum = require("../../../core-modules/usage/enums/usage-operation-type.enum");
const _usageresourcetypeenum = require("../../../core-modules/usage/enums/usage-resource-type.enum");
const _usageunitenum = require("../../../core-modules/usage/enums/usage-unit.enum");
const _usagerecorderservice = require("../../../core-modules/usage/services/usage-recorder.service");
const _apirequestcontextstorage = require("../../../core-modules/usage/storage/api-request-context.storage");
const _buildusagespendersfromauthcontextutil = require("../../../core-modules/usage/utils/build-usage-spenders-from-auth-context.util");
const _findflatentitybyidinflatentitymapsutil = require("../../../metadata-modules/flat-entity/utils/find-flat-entity-by-id-in-flat-entity-maps.util");
const _buildfieldmapsfromflatobjectmetadatautil = require("../../../metadata-modules/flat-field-metadata/utils/build-field-maps-from-flat-object-metadata.util");
const _permissionsexception = require("../../../metadata-modules/permissions/permissions.exception");
const _permissionsservice = require("../../../metadata-modules/permissions/permissions.service");
const _relationnestedqueries = require("../../../twenty-orm/field-operations/relation-nested-queries/relation-nested-queries");
const _ormworkspacecontextstorage = require("../../../twenty-orm/storage/orm-workspace-context.storage");
const _resolverolepermissionconfigutil = require("../../../twenty-orm/utils/resolve-role-permission-config.util");
const _workspaceormmanager = require("../../../twenty-orm/workspace-orm.manager");
const _workspacecacheservice = require("../../../workspace-cache/services/workspace-cache.service");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let CommonBaseQueryRunnerService = class CommonBaseQueryRunnerService {
    async execute(args, queryRunnerContext) {
        const { authContext, flatObjectMetadata, flatObjectMetadataMaps, flatFieldMetadataMaps } = queryRunnerContext;
        if ((queryRunnerContext.nestedOperationDepth ?? 0) === 0) {
            await this.throttleQueryExecution(authContext);
        }
        this.recordApiUsage(authContext);
        await this.validate(args, queryRunnerContext);
        if (flatObjectMetadata.isSystem === true) {
            await this.validateSettingsPermissionsOnObjectOrThrow(authContext, queryRunnerContext);
        }
        const commonQueryParser = new _graphqlqueryparser.GraphqlQueryParser(flatObjectMetadata, flatObjectMetadataMaps, flatFieldMetadataMaps);
        const selectedFieldsResult = commonQueryParser.parseSelectedFields(args.selectedFields);
        const processedArgs = {
            ...await this.processArgs(args, queryRunnerContext, this.operationName),
            selectedFieldsResult
        };
        this.validateQueryComplexity(selectedFieldsResult, processedArgs, queryRunnerContext);
        const results = await this.workspaceOrmManager.executeInWorkspaceContext(async ()=>this.executeQueryAndEnrichResults(processedArgs, queryRunnerContext, commonQueryParser), authContext);
        return {
            results,
            args: processedArgs
        };
    }
    computeQueryComplexity(selectedFieldsResult, _args, _queryRunnerContext) {
        const simpleFieldsComplexity = 1;
        const selectedFieldsComplexity = simpleFieldsComplexity + (selectedFieldsResult.relationFieldsCount ?? 0);
        return selectedFieldsComplexity;
    }
    async processArgs(args, queryRunnerContext, operationName) {
        const { authContext, flatObjectMetadata } = queryRunnerContext;
        const computedArgs = await this.computeArgs(args, queryRunnerContext);
        const hookedArgs = await this.workspaceQueryHookService.executePreQueryHooks(authContext, flatObjectMetadata.nameSingular, operationName, computedArgs);
        return hookedArgs;
    }
    async executeQueryAndEnrichResults(processedArgs, queryRunnerContext, commonQueryParser) {
        const extendedQueryRunnerContext = await this.prepareExtendedQueryRunnerContextWithGlobalDatasource(queryRunnerContext);
        const results = await this.run(processedArgs, {
            ...extendedQueryRunnerContext,
            commonQueryParser
        });
        return this.enrichResultsWithGettersAndHooks({
            results,
            operationName: this.operationName,
            authContext: extendedQueryRunnerContext.authContext,
            flatObjectMetadata: queryRunnerContext.flatObjectMetadata,
            flatObjectMetadataMaps: queryRunnerContext.flatObjectMetadataMaps,
            flatFieldMetadataMaps: queryRunnerContext.flatFieldMetadataMaps,
            transactionScope: queryRunnerContext.transactionScope
        });
    }
    async enrichResultsWithGettersAndHooks({ results, operationName, authContext, flatObjectMetadata, flatObjectMetadataMaps, flatFieldMetadataMaps, transactionScope }) {
        const resultWithGetters = await this.processQueryResult(results, flatObjectMetadata, flatObjectMetadataMaps, flatFieldMetadataMaps, authContext);
        const executePostQueryHooks = ()=>this.workspaceQueryHookService.executePostQueryHooks(authContext, flatObjectMetadata.nameSingular, operationName, resultWithGetters);
        if ((0, _utils.isDefined)(transactionScope)) {
            transactionScope.afterCommit(executePostQueryHooks);
        } else {
            await executePostQueryHooks();
        }
        return resultWithGetters;
    }
    async validateSettingsPermissionsOnObjectOrThrow(authContext, queryRunnerContext) {
        const { flatObjectMetadata } = queryRunnerContext;
        const workspace = authContext.workspace;
        if (Object.keys(_objectswithsettingspermissionsrequirements.OBJECTS_WITH_SETTINGS_PERMISSIONS_REQUIREMENTS).includes(flatObjectMetadata.nameSingular)) {
            const permissionRequired = _objectswithsettingspermissionsrequirements.OBJECTS_WITH_SETTINGS_PERMISSIONS_REQUIREMENTS[flatObjectMetadata.nameSingular];
            const userHasPermission = await this.permissionsService.userHasWorkspaceSettingPermission({
                userWorkspaceId: (0, _isuserauthcontextguard.isUserAuthContext)(authContext) ? authContext.userWorkspaceId : undefined,
                setting: permissionRequired,
                workspaceId: workspace.id,
                apiKeyId: (0, _isapikeyauthcontextguard.isApiKeyAuthContext)(authContext) ? authContext.apiKey.id : undefined
            });
            if (!userHasPermission) {
                throw new _permissionsexception.PermissionsException(_permissionsexception.PermissionsExceptionMessage.PERMISSION_DENIED, _permissionsexception.PermissionsExceptionCode.PERMISSION_DENIED);
            }
        }
    }
    async prepareExtendedQueryRunnerContextWithGlobalDatasource(queryRunnerContext) {
        const context = (0, _ormworkspacecontextstorage.getWorkspaceContext)();
        const rolePermissionConfig = queryRunnerContext.rolePermissionConfig ?? (0, _resolverolepermissionconfigutil.resolveRolePermissionConfig)({
            authContext: context.authContext,
            userWorkspaceRoleMap: context.userWorkspaceRoleMap,
            apiKeyRoleMap: context.apiKeyRoleMap
        });
        if (!rolePermissionConfig) {
            throw new _commonqueryrunnerexception.CommonQueryRunnerException('Invalid auth context', _commonqueryrunnerexception.CommonQueryRunnerExceptionCode.INVALID_AUTH_CONTEXT, {
                userFriendlyMessage: _standarderrormessageconstant.STANDARD_ERROR_MESSAGE
            });
        }
        const repository = (0, _utils.isDefined)(queryRunnerContext.transactionScope) ? queryRunnerContext.transactionScope.getRepository(queryRunnerContext.flatObjectMetadata.nameSingular, rolePermissionConfig) : this.workspaceOrmManager.getRepository(queryRunnerContext.flatObjectMetadata.nameSingular, rolePermissionConfig, {
            useReplica: this.isReadOnly
        });
        return {
            ...queryRunnerContext,
            authContext: context.authContext,
            rolePermissionConfig,
            repository,
            featureFlagsMap: context.featureFlagsMap
        };
    }
    // useReplica follows isReadOnly so reads on read-only runners hit the replica
    // and everything else the primary, keeping root read and nested-relation
    // loading consistent.
    getReadRepository({ repository }) {
        this.metricsService.incrementCounterBy({
            key: _metricskeystype.MetricsKeys.OrmV2ReadPathUsed,
            amount: 1,
            attributes: {
                operation: this.operationName
            }
        });
        return repository;
    }
    getWriteRepository({ repository }) {
        this.metricsService.incrementCounterBy({
            key: _metricskeystype.MetricsKeys.OrmV2WritePathUsed,
            amount: 1,
            attributes: {
                operation: this.operationName
            }
        });
        return repository;
    }
    async runFilteredMutation({ queryRunnerContext, filter, columnsToReturn, kind, data }) {
        const { flatObjectMetadata, commonQueryParser } = queryRunnerContext;
        const alias = flatObjectMetadata.nameSingular;
        if ((0, _isrecordfilteremptyutil.isRecordFilterEmpty)(filter)) {
            throw new _commonqueryrunnerexception.CommonQueryRunnerException('A non-empty filter is required for a bulk mutation', _commonqueryrunnerexception.CommonQueryRunnerExceptionCode.INVALID_ARGS_FILTER, {
                userFriendlyMessage: _standarderrormessageconstant.STANDARD_ERROR_MESSAGE
            });
        }
        const writeRepository = this.getWriteRepository(queryRunnerContext);
        const resolvedData = kind === 'update' && (0, _utils.isDefined)(data) ? (await this.resolveNestedRelations({
            records: [
                data
            ],
            queryRunnerContext,
            writeRepository
        }))[0] : data;
        const { selectQueryBuilder, rowLevelPermissionsApplied } = (0, _buildmutationquerybuilderutil.buildMutationQueryBuilder)({
            repository: writeRepository,
            alias,
            filter,
            commonQueryParser
        });
        return writeRepository.runMutation({
            selectQueryBuilder,
            rowLevelPermissionsApplied,
            kind,
            columnsToReturn,
            data: resolvedData
        });
    }
    async resolveNestedRelations({ records, queryRunnerContext, writeRepository, createRecords }) {
        const { flatObjectMetadata, flatFieldMetadataMaps } = queryRunnerContext;
        const nameSingular = flatObjectMetadata.nameSingular;
        const relationNestedQueries = new _relationnestedqueries.RelationNestedQueries(writeRepository);
        const relationNestedConfig = relationNestedQueries.prepareNestedRelationQueries(records, nameSingular);
        if (!(0, _utils.isDefined)(relationNestedConfig)) {
            return records;
        }
        const resolvedRecords = await relationNestedQueries.processRelationNestedQueries({
            entities: records,
            relationNestedConfig,
            target: nameSingular,
            createRecords
        });
        const { fieldIdByName } = (0, _buildfieldmapsfromflatobjectmetadatautil.buildFieldMapsFromFlatObjectMetadata)(flatFieldMetadataMaps, flatObjectMetadata);
        return resolvedRecords.map((record)=>{
            const columnKeyedRecord = {};
            for (const [fieldName, value] of Object.entries(record)){
                const fieldMetadata = (0, _findflatentitybyidinflatentitymapsutil.findFlatEntityByIdInFlatEntityMaps)({
                    flatEntityId: fieldIdByName[fieldName],
                    flatEntityMaps: flatFieldMetadataMaps
                });
                if ((0, _utils.isDefined)(fieldMetadata) && (fieldMetadata.type === _types.FieldMetadataType.RELATION || fieldMetadata.type === _types.FieldMetadataType.MORPH_RELATION)) {
                    continue;
                }
                columnKeyedRecord[fieldName] = value;
            }
            return columnKeyedRecord;
        });
    }
    getNestedRelationsReadPathOptions() {
        return {
            useReplica: this.isReadOnly
        };
    }
    recordApiUsage(authContext) {
        const apiType = (0, _apirequestcontextstorage.getApiType)();
        if (!(0, _utils.isDefined)(apiType)) {
            return;
        }
        const spenders = (0, _buildusagespendersfromauthcontextutil.buildUsageSpendersFromAuthContext)(authContext);
        if (!(0, _utils.isDefined)(spenders.apiKeyId) && !(0, _utils.isDefined)(spenders.applicationId)) {
            return;
        }
        this.usageRecorderService.accumulate(authContext.workspace.id, {
            resourceType: _usageresourcetypeenum.UsageResourceType.API,
            operationType: _usageoperationtypeenum.UsageOperationType.API_REQUEST,
            quantity: 1,
            unit: _usageunitenum.UsageUnit.REQUEST,
            resourceContext: apiType,
            spenders
        });
    }
    async throttleQueryExecution(authContext) {
        const isApiRateLimitV2Enabled = await this.featureFlagService.isFeatureEnabled(_types.FeatureFlagKey.IS_API_RATE_LIMIT_V2_ENABLED, authContext.workspace.id);
        if (isApiRateLimitV2Enabled) {
            await this.consumeApiSpeedLimit(authContext);
            return;
        }
        await this.throttleApiKeyQueryExecution(authContext);
        await this.throttleApplicationQueryExecution(authContext);
    }
    async consumeApiSpeedLimit(authContext) {
        try {
            await this.usageLimitSpeedService.consumeOrThrow({
                resourceType: _usageresourcetypeenum.UsageResourceType.API,
                authContext,
                operationType: _usageoperationtypeenum.UsageOperationType.API_REQUEST
            });
        } catch (error) {
            if (error instanceof _usagelimitexception.UsageLimitException && (0, _utils.isDefined)(error.exhaustedScope) && error.exhaustedScope.isFallback) {
                await this.incrementApiSpeedCeilingMetrics({
                    authContext,
                    exhaustedScope: error.exhaustedScope
                });
            }
            throw error;
        }
    }
    async incrementApiSpeedCeilingMetrics({ authContext, exhaustedScope }) {
        if (exhaustedScope.spenderType === 'apiKey') {
            await this.metricsService.incrementCounterForEvent({
                key: _metricskeystype.MetricsKeys.CommonApiQueryRateLimited,
                shouldStoreInCache: false
            });
        }
        if (exhaustedScope.spenderType === 'application' && (0, _isapplicationauthcontextguard.isApplicationAuthContext)(authContext)) {
            await this.metricsService.incrementCounterForEvent({
                key: _metricskeystype.MetricsKeys.CommonApiApplicationQueryRateLimited,
                shouldStoreInCache: false,
                attributes: {
                    universal_identifier: authContext.application.universalIdentifier,
                    app_name: authContext.application.name,
                    source_type: authContext.application.sourceType
                }
            });
        }
    }
    async throttleApplicationQueryExecution(authContext) {
        if (!(0, _isapplicationauthcontextguard.isApplicationAuthContext)(authContext)) return;
        try {
            await this.throttlerService.tokenBucketThrottleOrThrow(`api:throttler:application:${authContext.application.universalIdentifier}`, 1, this.twentyConfigService.get('APPLICATION_API_RATE_LIMITING_LIMIT'), this.twentyConfigService.get('APPLICATION_API_RATE_LIMITING_TTL_IN_MS'));
        } catch (error) {
            if (error instanceof _throttlerexception.ThrottlerException) {
                await this.metricsService.incrementCounterForEvent({
                    key: _metricskeystype.MetricsKeys.CommonApiApplicationQueryRateLimited,
                    shouldStoreInCache: false,
                    attributes: {
                        universal_identifier: authContext.application.universalIdentifier,
                        app_name: authContext.application.name,
                        source_type: authContext.application.sourceType
                    }
                });
            }
            throw error;
        }
    }
    async throttleApiKeyQueryExecution(authContext) {
        try {
            if (!(0, _isapikeyauthcontextguard.isApiKeyAuthContext)(authContext)) return;
            const workspaceId = authContext.workspace.id;
            const shortConfig = {
                key: `api:throttler:${workspaceId}-short-limit`,
                maxTokens: this.twentyConfigService.get('API_RATE_LIMITING_SHORT_LIMIT'),
                timeWindow: this.twentyConfigService.get('API_RATE_LIMITING_SHORT_TTL_IN_MS')
            };
            const longConfig = {
                key: `api:throttler:${workspaceId}-long-limit`,
                maxTokens: this.twentyConfigService.get('API_RATE_LIMITING_LONG_LIMIT'),
                timeWindow: this.twentyConfigService.get('API_RATE_LIMITING_LONG_TTL_IN_MS')
            };
            await this.throttlerService.tokenBucketThrottleOrThrow(shortConfig.key, 1, shortConfig.maxTokens, shortConfig.timeWindow);
            await this.throttlerService.tokenBucketThrottleOrThrow(longConfig.key, 1, longConfig.maxTokens, longConfig.timeWindow);
        } catch (error) {
            await this.metricsService.incrementCounterForEvent({
                key: _metricskeystype.MetricsKeys.CommonApiQueryRateLimited,
                shouldStoreInCache: false
            });
            throw error;
        }
    }
    validateQueryComplexity(selectedFieldsResult, args, queryRunnerContext) {
        const maximumComplexity = this.twentyConfigService.get('COMMON_QUERY_COMPLEXITY_LIMIT');
        if (selectedFieldsResult.hasAtLeastTwoNestedOneToManyRelations) {
            throw new _commonqueryrunnerexception.CommonQueryRunnerException(`Query complexity is too high. One-to-Many relation cannot be nested in another One-to-Many relation.`, _commonqueryrunnerexception.CommonQueryRunnerExceptionCode.TOO_COMPLEX_QUERY, {
                userFriendlyMessage: _standarderrormessageconstant.STANDARD_ERROR_MESSAGE
            });
        }
        const queryComplexity = this.computeQueryComplexity(selectedFieldsResult, args, queryRunnerContext);
        if (queryComplexity > maximumComplexity) {
            throw new _commonqueryrunnerexception.CommonQueryRunnerException(`Query complexity is too high. Please, reduce the amount of relation fields requested. Query complexity: ${queryComplexity}. Maximum complexity: ${maximumComplexity}.`, _commonqueryrunnerexception.CommonQueryRunnerExceptionCode.TOO_COMPLEX_QUERY, {
                userFriendlyMessage: _standarderrormessageconstant.STANDARD_ERROR_MESSAGE
            });
        }
    }
    constructor(){
        this.isReadOnly = false;
    }
};
_ts_decorate([
    (0, _common.Inject)(),
    _ts_metadata("design:type", typeof _workspacequeryhookservice.WorkspaceQueryHookService === "undefined" ? Object : _workspacequeryhookservice.WorkspaceQueryHookService)
], CommonBaseQueryRunnerService.prototype, "workspaceQueryHookService", void 0);
_ts_decorate([
    (0, _common.Inject)(),
    _ts_metadata("design:type", typeof _queryrunnerargsfactory.QueryRunnerArgsFactory === "undefined" ? Object : _queryrunnerargsfactory.QueryRunnerArgsFactory)
], CommonBaseQueryRunnerService.prototype, "queryRunnerArgsFactory", void 0);
_ts_decorate([
    (0, _common.Inject)(),
    _ts_metadata("design:type", typeof _dataargprocessorservice.DataArgProcessorService === "undefined" ? Object : _dataargprocessorservice.DataArgProcessorService)
], CommonBaseQueryRunnerService.prototype, "dataArgProcessor", void 0);
_ts_decorate([
    (0, _common.Inject)(),
    _ts_metadata("design:type", typeof _filterargprocessorservice.FilterArgProcessorService === "undefined" ? Object : _filterargprocessorservice.FilterArgProcessorService)
], CommonBaseQueryRunnerService.prototype, "filterArgProcessor", void 0);
_ts_decorate([
    (0, _common.Inject)(),
    _ts_metadata("design:type", typeof _groupbyargprocessorservice.GroupByArgProcessorService === "undefined" ? Object : _groupbyargprocessorservice.GroupByArgProcessorService)
], CommonBaseQueryRunnerService.prototype, "groupByArgProcessor", void 0);
_ts_decorate([
    (0, _common.Inject)(),
    _ts_metadata("design:type", typeof _orderbyargprocessorservice.OrderByArgProcessorService === "undefined" ? Object : _orderbyargprocessorservice.OrderByArgProcessorService)
], CommonBaseQueryRunnerService.prototype, "orderByArgProcessor", void 0);
_ts_decorate([
    (0, _common.Inject)(),
    _ts_metadata("design:type", typeof _orderbywithgroupbyargprocessorservice.OrderByWithGroupByArgProcessorService === "undefined" ? Object : _orderbywithgroupbyargprocessorservice.OrderByWithGroupByArgProcessorService)
], CommonBaseQueryRunnerService.prototype, "orderByWithGroupByArgProcessor", void 0);
_ts_decorate([
    (0, _common.Inject)(),
    _ts_metadata("design:type", typeof _workspaceormmanager.WorkspaceOrmManager === "undefined" ? Object : _workspaceormmanager.WorkspaceOrmManager)
], CommonBaseQueryRunnerService.prototype, "workspaceOrmManager", void 0);
_ts_decorate([
    (0, _common.Inject)(),
    _ts_metadata("design:type", typeof _processnestedrelationshelper.ProcessNestedRelationsHelper === "undefined" ? Object : _processnestedrelationshelper.ProcessNestedRelationsHelper)
], CommonBaseQueryRunnerService.prototype, "processNestedRelationsHelper", void 0);
_ts_decorate([
    (0, _common.Inject)(),
    _ts_metadata("design:type", typeof _permissionsservice.PermissionsService === "undefined" ? Object : _permissionsservice.PermissionsService)
], CommonBaseQueryRunnerService.prototype, "permissionsService", void 0);
_ts_decorate([
    (0, _common.Inject)(),
    _ts_metadata("design:type", typeof _workspacecacheservice.WorkspaceCacheService === "undefined" ? Object : _workspacecacheservice.WorkspaceCacheService)
], CommonBaseQueryRunnerService.prototype, "workspaceCacheService", void 0);
_ts_decorate([
    (0, _common.Inject)(),
    _ts_metadata("design:type", typeof _commonresultgettersservice.CommonResultGettersService === "undefined" ? Object : _commonresultgettersservice.CommonResultGettersService)
], CommonBaseQueryRunnerService.prototype, "commonResultGettersService", void 0);
_ts_decorate([
    (0, _common.Inject)(),
    _ts_metadata("design:type", typeof _throttlerservice.ThrottlerService === "undefined" ? Object : _throttlerservice.ThrottlerService)
], CommonBaseQueryRunnerService.prototype, "throttlerService", void 0);
_ts_decorate([
    (0, _common.Inject)(),
    _ts_metadata("design:type", typeof _usagelimitspeedservice.UsageLimitSpeedService === "undefined" ? Object : _usagelimitspeedservice.UsageLimitSpeedService)
], CommonBaseQueryRunnerService.prototype, "usageLimitSpeedService", void 0);
_ts_decorate([
    (0, _common.Inject)(),
    _ts_metadata("design:type", typeof _usagerecorderservice.UsageRecorderService === "undefined" ? Object : _usagerecorderservice.UsageRecorderService)
], CommonBaseQueryRunnerService.prototype, "usageRecorderService", void 0);
_ts_decorate([
    (0, _common.Inject)(),
    _ts_metadata("design:type", typeof _twentyconfigservice.TwentyConfigService === "undefined" ? Object : _twentyconfigservice.TwentyConfigService)
], CommonBaseQueryRunnerService.prototype, "twentyConfigService", void 0);
_ts_decorate([
    (0, _common.Inject)(),
    _ts_metadata("design:type", typeof _metricsservice.MetricsService === "undefined" ? Object : _metricsservice.MetricsService)
], CommonBaseQueryRunnerService.prototype, "metricsService", void 0);
_ts_decorate([
    (0, _common.Inject)(),
    _ts_metadata("design:type", typeof _featureflagservice.FeatureFlagService === "undefined" ? Object : _featureflagservice.FeatureFlagService)
], CommonBaseQueryRunnerService.prototype, "featureFlagService", void 0);
CommonBaseQueryRunnerService = _ts_decorate([
    (0, _common.Injectable)()
], CommonBaseQueryRunnerService);

//# sourceMappingURL=common-base-query-runner.service.js.map