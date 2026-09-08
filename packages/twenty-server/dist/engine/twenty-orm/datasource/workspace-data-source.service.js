"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "WorkspaceDataSourceService", {
    enumerable: true,
    get: function() {
        return WorkspaceDataSourceService;
    }
});
const _common = require("@nestjs/common");
const _typeorm = require("@nestjs/typeorm");
const _pg = require("pg");
const _typeorm1 = require("typeorm");
const _utils = require("twenty-shared/utils");
const _databasepoolmetricsservice = require("../../../database/typeorm/database-pool-metrics.service");
const _twentyconfigservice = require("../../core-modules/twenty-config/twenty-config.service");
const _ormworkspacecontextstorage = require("../storage/orm-workspace-context.storage");
const _workspacedatasource = require("./workspace-data-source");
const _twentyormexception = require("../exceptions/twenty-orm.exception");
const _workspaceeventemitter = require("../../workspace-event-emitter/workspace-event-emitter");
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
// node-postgres parses a `date` column into a JS Date (which serializes with a
// time component). Workspace DATE fields are date-only, so parse them as the raw
// 'YYYY-MM-DD' string Postgres returns, matching the v1 TypeORM datasource.
const DATE_ONLY_POOL_TYPES = {
    getTypeParser: (oid, format)=>oid === _pg.types.builtins.DATE ? (value)=>value : _pg.types.getTypeParser(oid, format)
};
let WorkspaceDataSourceService = class WorkspaceDataSourceService {
    onModuleInit() {
        this.primaryPool = this.createPool({
            connectionString: this.twentyConfigService.get('PG_DATABASE_URL'),
            queryTimeoutMs: this.twentyConfigService.get('PG_DATABASE_PRIMARY_TIMEOUT_MS')
        });
        this.databasePoolMetricsService.registerPool({
            poolName: _databasepoolmetricsservice.DatabasePoolName.WorkspaceV2Primary,
            pool: this.primaryPool
        });
        const replicaUrl = this.twentyConfigService.get('PG_DATABASE_REPLICA_URL');
        if ((0, _utils.isDefined)(replicaUrl)) {
            this.replicaPool = this.createPool({
                connectionString: replicaUrl,
                queryTimeoutMs: this.twentyConfigService.get('PG_DATABASE_REPLICA_TIMEOUT_MS')
            });
            this.databasePoolMetricsService.registerPool({
                poolName: _databasepoolmetricsservice.DatabasePoolName.WorkspaceV2Replica,
                pool: this.replicaPool
            });
        }
    }
    getDataSource({ useReplica }) {
        const pool = useReplica ? this.replicaPool ?? this.primaryPool : this.primaryPool;
        if (!(0, _utils.isDefined)(pool)) {
            throw new _twentyormexception.TwentyOrmException('WorkspaceDataSourceService has not been initialized. Make sure the module has been initialized.', _twentyormexception.TwentyOrmExceptionCode.UNSUPPORTED_OPERATION);
        }
        const workspaceContext = (0, _ormworkspacecontextstorage.getWorkspaceContext)();
        return new _workspacedatasource.WorkspaceDataSource({
            pool,
            internalContext: this.buildInternalContext(workspaceContext),
            authContext: workspaceContext.authContext,
            objectPermissionsByRoleId: workspaceContext.permissionsPerRoleId
        });
    }
    buildInternalContext(workspaceContext) {
        return {
            workspaceId: workspaceContext.authContext.workspace.id,
            flatObjectMetadataMaps: workspaceContext.flatObjectMetadataMaps,
            flatFieldMetadataMaps: workspaceContext.flatFieldMetadataMaps,
            flatIndexMaps: workspaceContext.flatIndexMaps,
            flatRowLevelPermissionPredicateMaps: workspaceContext.flatRowLevelPermissionPredicateMaps,
            flatRowLevelPermissionPredicateGroupMaps: workspaceContext.flatRowLevelPermissionPredicateGroupMaps,
            objectIdByNameSingular: workspaceContext.objectIdByNameSingular,
            featureFlagsMap: workspaceContext.featureFlagsMap,
            userWorkspaceRoleMap: workspaceContext.userWorkspaceRoleMap,
            apiKeyRoleMap: workspaceContext.apiKeyRoleMap,
            eventEmitterService: this.workspaceEventEmitter,
            coreDataSource: this.coreDataSource
        };
    }
    createPool({ connectionString, queryTimeoutMs }) {
        const pool = new _pg.Pool({
            connectionString,
            types: DATE_ONLY_POOL_TYPES,
            max: this.twentyConfigService.get('PG_POOL_MAX_CONNECTIONS'),
            idleTimeoutMillis: this.twentyConfigService.get('PG_POOL_IDLE_TIMEOUT_MS'),
            allowExitOnIdle: this.twentyConfigService.get('PG_POOL_ALLOW_EXIT_ON_IDLE'),
            query_timeout: queryTimeoutMs,
            ssl: this.twentyConfigService.get('PG_SSL_ALLOW_SELF_SIGNED') ? {
                rejectUnauthorized: false
            } : undefined
        });
        pool.on('error', (error)=>{
            this.logger.error(`Idle client error: ${error.message}`, error.stack);
        });
        return pool;
    }
    async onApplicationShutdown() {
        this.databasePoolMetricsService.unregisterPool(_databasepoolmetricsservice.DatabasePoolName.WorkspaceV2Primary);
        this.databasePoolMetricsService.unregisterPool(_databasepoolmetricsservice.DatabasePoolName.WorkspaceV2Replica);
        await this.primaryPool?.end();
        await this.replicaPool?.end();
        this.primaryPool = null;
        this.replicaPool = null;
    }
    constructor(twentyConfigService, workspaceEventEmitter, coreDataSource, databasePoolMetricsService){
        this.twentyConfigService = twentyConfigService;
        this.workspaceEventEmitter = workspaceEventEmitter;
        this.coreDataSource = coreDataSource;
        this.databasePoolMetricsService = databasePoolMetricsService;
        this.logger = new _common.Logger(WorkspaceDataSourceService.name);
        this.primaryPool = null;
        this.replicaPool = null;
    }
};
WorkspaceDataSourceService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_param(2, (0, _typeorm.InjectDataSource)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _twentyconfigservice.TwentyConfigService === "undefined" ? Object : _twentyconfigservice.TwentyConfigService,
        typeof _workspaceeventemitter.WorkspaceEventEmitter === "undefined" ? Object : _workspaceeventemitter.WorkspaceEventEmitter,
        typeof _typeorm1.DataSource === "undefined" ? Object : _typeorm1.DataSource,
        typeof _databasepoolmetricsservice.DatabasePoolMetricsService === "undefined" ? Object : _databasepoolmetricsservice.DatabasePoolMetricsService
    ])
], WorkspaceDataSourceService);

//# sourceMappingURL=workspace-data-source.service.js.map