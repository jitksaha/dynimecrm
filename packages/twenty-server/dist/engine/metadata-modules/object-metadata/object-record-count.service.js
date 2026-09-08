"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "ObjectRecordCountService", {
    enumerable: true,
    get: function() {
        return ObjectRecordCountService;
    }
});
const _common = require("@nestjs/common");
const _typeorm = require("@nestjs/typeorm");
const _utils = require("twenty-shared/utils");
const _typeorm1 = require("typeorm");
const _workspacemanyorallflatentitymapscacheservice = require("../flat-entity/services/workspace-many-or-all-flat-entity-maps-cache.service");
const _computeobjecttargettableutil = require("../../utils/compute-object-target-table.util");
const _getworkspaceschemanameutil = require("../../workspace-datasource/utils/get-workspace-schema-name.util");
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
let ObjectRecordCountService = class ObjectRecordCountService {
    // reltuples is the planner's row estimate, refreshed by autovacuum's
    // ANALYZE; never-analyzed tables report -1, clamped to 0 here
    async getApproximateRecordCountByTableName(workspaceId) {
        const schemaName = (0, _getworkspaceschemanameutil.getWorkspaceSchemaName)(workspaceId);
        const rows = await this.coreDataSource.query(`SELECT relname, reltuples::bigint AS approximate_count
         FROM pg_class c
         JOIN pg_namespace n ON c.relnamespace = n.oid
         WHERE n.nspname = $1
         AND c.relkind = 'r'`, [
            schemaName
        ]);
        const countByTableName = new Map();
        for (const row of rows){
            countByTableName.set(row.relname, Math.max(0, Number(row.approximate_count)));
        }
        return countByTableName;
    }
    async getRecordCounts(workspaceId) {
        const { flatObjectMetadataMaps } = await this.workspaceManyOrAllFlatEntityMapsCacheService.getOrRecomputeManyOrAllFlatEntityMaps({
            workspaceId,
            flatMapsKeys: [
                'flatObjectMetadataMaps'
            ]
        });
        const flatObjectMetadatas = Object.values(flatObjectMetadataMaps.byUniversalIdentifier).filter(_utils.isDefined);
        const countByTableName = await this.getApproximateRecordCountByTableName(workspaceId);
        return flatObjectMetadatas.map((flatObjectMetadata)=>({
                objectNamePlural: flatObjectMetadata.namePlural,
                totalCount: countByTableName.get((0, _computeobjecttargettableutil.computeObjectTargetTable)(flatObjectMetadata)) ?? 0
            }));
    }
    constructor(coreDataSource, workspaceManyOrAllFlatEntityMapsCacheService){
        this.coreDataSource = coreDataSource;
        this.workspaceManyOrAllFlatEntityMapsCacheService = workspaceManyOrAllFlatEntityMapsCacheService;
    }
};
ObjectRecordCountService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_param(0, (0, _typeorm.InjectDataSource)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _typeorm1.DataSource === "undefined" ? Object : _typeorm1.DataSource,
        typeof _workspacemanyorallflatentitymapscacheservice.WorkspaceManyOrAllFlatEntityMapsCacheService === "undefined" ? Object : _workspacemanyorallflatentitymapscacheservice.WorkspaceManyOrAllFlatEntityMapsCacheService
    ])
], ObjectRecordCountService);

//# sourceMappingURL=object-record-count.service.js.map