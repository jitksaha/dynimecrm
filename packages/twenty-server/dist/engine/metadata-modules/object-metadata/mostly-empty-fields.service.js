"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "MostlyEmptyFieldsService", {
    enumerable: true,
    get: function() {
        return MostlyEmptyFieldsService;
    }
});
const _common = require("@nestjs/common");
const _typeorm = require("@nestjs/typeorm");
const _typeorm1 = require("typeorm");
const _workspacemanyorallflatentitymapscacheservice = require("../flat-entity/services/workspace-many-or-all-flat-entity-maps-cache.service");
const _findflatentitybyidinflatentitymapsorthrowutil = require("../flat-entity/utils/find-flat-entity-by-id-in-flat-entity-maps-or-throw.util");
const _findmanyflatentitybyidinflatentitymapsorthrowutil = require("../flat-entity/utils/find-many-flat-entity-by-id-in-flat-entity-maps-or-throw.util");
const _mostlyemptyminimumrowcountconstant = require("./constants/mostly-empty-minimum-row-count.constant");
const _objectrecordcountservice = require("./object-record-count.service");
const _computemostlyemptyfieldmetadataidsutil = require("./utils/compute-mostly-empty-field-metadata-ids.util");
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
let MostlyEmptyFieldsService = class MostlyEmptyFieldsService {
    async getMostlyEmptyFieldMetadataIds({ workspaceId, objectMetadataId }) {
        const { flatObjectMetadataMaps, flatFieldMetadataMaps } = await this.workspaceManyOrAllFlatEntityMapsCacheService.getOrRecomputeManyOrAllFlatEntityMaps({
            workspaceId,
            flatMapsKeys: [
                'flatObjectMetadataMaps',
                'flatFieldMetadataMaps'
            ]
        });
        const flatObjectMetadata = (0, _findflatentitybyidinflatentitymapsorthrowutil.findFlatEntityByIdInFlatEntityMapsOrThrow)({
            flatEntityId: objectMetadataId,
            flatEntityMaps: flatObjectMetadataMaps
        });
        const schemaName = (0, _getworkspaceschemanameutil.getWorkspaceSchemaName)(workspaceId);
        const tableName = (0, _computeobjecttargettableutil.computeObjectTargetTable)(flatObjectMetadata);
        const approximateRecordCountByTableName = await this.objectRecordCountService.getApproximateRecordCountByTableName(workspaceId);
        const approximateRowCount = approximateRecordCountByTableName.get(tableName) ?? 0;
        if (approximateRowCount < _mostlyemptyminimumrowcountconstant.MOSTLY_EMPTY_MINIMUM_ROW_COUNT) {
            return [];
        }
        // Per-column emptiness: null fraction plus the sampled frequency of the
        // column type's empty sentinel — '' for text columns (NOT NULL DEFAULT ''),
        // '{}' for arrays, '{}'/'[]' for json. Sentinels are matched per physical
        // column type so a text value that happens to be '{}' does not count
        const columnStatisticsRows = await this.coreDataSource.query(`SELECT s.attname AS column_name,
              (s.null_frac + COALESCE(empty_sentinel.frequency, 0))::float AS empty_fraction
       FROM pg_stats s
       JOIN pg_namespace n ON n.nspname = s.schemaname
       JOIN pg_class c ON c.relnamespace = n.oid AND c.relname = s.tablename
       JOIN pg_attribute a ON a.attrelid = c.oid AND a.attname = s.attname
       JOIN pg_type t ON t.oid = a.atttypid
       LEFT JOIN LATERAL (
         SELECT SUM(most_common_value_frequency) AS frequency
         FROM unnest(s.most_common_vals::text::text[], s.most_common_freqs)
           AS most_common_value_entry(most_common_value, most_common_value_frequency)
         WHERE most_common_value_entry.most_common_value = ANY (
           CASE
             WHEN t.typcategory = 'S' THEN ARRAY['']
             WHEN t.typcategory = 'A' THEN ARRAY['{}']
             WHEN t.typname IN ('json', 'jsonb') THEN ARRAY['{}', '[]']
             ELSE ARRAY[]::text[]
           END
         )
       ) empty_sentinel ON TRUE
       WHERE s.schemaname = $1
       AND s.tablename = $2
       AND NOT s.inherited`, [
            schemaName,
            tableName
        ]);
        const emptyFractionByColumnName = new Map(columnStatisticsRows.map((row)=>[
                row.column_name,
                Number(row.empty_fraction)
            ]));
        const flatFieldMetadatas = (0, _findmanyflatentitybyidinflatentitymapsorthrowutil.findManyFlatEntityByIdInFlatEntityMapsOrThrow)({
            flatEntityIds: flatObjectMetadata.fieldIds,
            flatEntityMaps: flatFieldMetadataMaps
        });
        return (0, _computemostlyemptyfieldmetadataidsutil.computeMostlyEmptyFieldMetadataIds)({
            fieldMetadatas: flatFieldMetadatas,
            labelIdentifierFieldMetadataId: flatObjectMetadata.labelIdentifierFieldMetadataId,
            emptyFractionByColumnName
        });
    }
    constructor(coreDataSource, workspaceManyOrAllFlatEntityMapsCacheService, objectRecordCountService){
        this.coreDataSource = coreDataSource;
        this.workspaceManyOrAllFlatEntityMapsCacheService = workspaceManyOrAllFlatEntityMapsCacheService;
        this.objectRecordCountService = objectRecordCountService;
    }
};
MostlyEmptyFieldsService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_param(0, (0, _typeorm.InjectDataSource)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _typeorm1.DataSource === "undefined" ? Object : _typeorm1.DataSource,
        typeof _workspacemanyorallflatentitymapscacheservice.WorkspaceManyOrAllFlatEntityMapsCacheService === "undefined" ? Object : _workspacemanyorallflatentitymapscacheservice.WorkspaceManyOrAllFlatEntityMapsCacheService,
        typeof _objectrecordcountservice.ObjectRecordCountService === "undefined" ? Object : _objectrecordcountservice.ObjectRecordCountService
    ])
], MostlyEmptyFieldsService);

//# sourceMappingURL=mostly-empty-fields.service.js.map