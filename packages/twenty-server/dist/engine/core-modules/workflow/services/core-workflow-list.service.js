"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "CoreWorkflowListService", {
    enumerable: true,
    get: function() {
        return CoreWorkflowListService;
    }
});
const _common = require("@nestjs/common");
const _typeorm = require("@nestjs/typeorm");
const _utils = require("twenty-shared/utils");
const _typeorm1 = require("typeorm");
const _cursorsutil = require("../../../api/graphql/graphql-query-runner/utils/cursors.util");
const _coreworkflowsinput = require("../dtos/core-workflows.input");
const _buildcoreworkflowfilterpredicateutil = require("../utils/build-core-workflow-filter-predicate.util");
const _computecoreworkflowstatusesutil = require("../utils/compute-core-workflow-statuses.util");
const _removesqlinjectionutil = require("../../../workspace-manager/workspace-migration/utils/remove-sql-injection.util");
const _getworkspaceschemanameutil = require("../../../workspace-datasource/utils/get-workspace-schema-name.util");
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
// sorting and the keyset comparison stay on the raw columns so a btree index
// can serve them; only the cursor value is rendered to text
const SORT_COLUMN_BY_FIELD = {
    [_coreworkflowsinput.CoreWorkflowOrderByField.NAME]: {
        column: 'c.name',
        cursorExpression: 'c.name',
        nullable: true,
        cast: ''
    },
    [_coreworkflowsinput.CoreWorkflowOrderByField.UPDATED_AT]: {
        column: 'c."updatedAt"',
        // microsecond-precise text so the cursor round-trips exactly
        cursorExpression: `to_char(c."updatedAt" at time zone 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.US"Z"')`,
        nullable: false,
        cast: '::timestamptz'
    }
};
const GROUPED_WORKFLOW_COLUMNS = `c.id, c.name, c."updatedAt"`;
const buildWorkflowVersionsJoinClause = (schemaName)=>`LEFT JOIN ${schemaName}."workflow" wf
     ON wf."coreWorkflowId" = c.id AND wf."deletedAt" IS NULL
   LEFT JOIN core."workflowVersion" v
     ON v."workflowId" = wf.id AND v."workspaceId" = $1`;
let CoreWorkflowListService = class CoreWorkflowListService {
    async findManyByWorkspaceId(workspaceId, { first, after, orderBy, orderByDirection, filter }) {
        const schemaName = (0, _removesqlinjectionutil.escapeIdentifier)((0, _getworkspaceschemanameutil.getWorkspaceSchemaName)(workspaceId));
        const { column, cursorExpression, nullable, cast } = SORT_COLUMN_BY_FIELD[orderBy];
        const isAscending = orderByDirection === _coreworkflowsinput.CoreWorkflowOrderByDirection.ASC;
        const comparator = isAscending ? '>' : '<';
        const direction = isAscending ? 'ASC' : 'DESC';
        const nullsClause = nullable ? ' NULLS LAST' : '';
        const parameters = [
            workspaceId
        ];
        const { predicate: filterPredicate, parameters: filterParameters } = (0, _buildcoreworkflowfilterpredicateutil.buildCoreWorkflowFilterPredicate)({
            filter,
            firstParameterIndex: parameters.length + 1
        });
        parameters.push(...filterParameters);
        let keysetCondition = '';
        if ((0, _utils.isDefined)(after)) {
            const cursor = (0, _cursorsutil.decodeCursor)(after);
            if (cursor.sortValue === null) {
                parameters.push(cursor.id);
                keysetCondition = `AND (${column} IS NULL AND c.id ${comparator} $${parameters.length}::uuid)`;
            } else {
                parameters.push(cursor.sortValue);
                const sortValueParameter = `$${parameters.length}`;
                parameters.push(cursor.id);
                const idParameter = `$${parameters.length}`;
                keysetCondition = nullable ? `AND (${column} ${comparator} ${sortValueParameter}${cast}
               OR (${column} = ${sortValueParameter}${cast} AND c.id ${comparator} ${idParameter}::uuid)
               OR ${column} IS NULL)` : `AND (${column}, c.id) ${comparator} (${sortValueParameter}${cast}, ${idParameter}::uuid)`;
            }
        }
        const havingClause = (0, _utils.isDefined)(filterPredicate) ? `HAVING ${filterPredicate}` : '';
        parameters.push(first + 1);
        const limitParameter = `$${parameters.length}`;
        const rows = await this.coreDataSource.query(`SELECT
         c.id,
         ${cursorExpression} AS "cursorSortValue",
         c.name,
         c."applicationId",
         min(wf.id::text) AS "workspaceWorkflowId",
         c."updatedAt",
         coalesce(bool_or(v.status = 'DRAFT'), false) AS "hasDraftVersion",
         coalesce(bool_or(v.status = 'ACTIVE'), false) AS "hasActiveVersion",
         coalesce(bool_or(v.status = 'DEACTIVATED'), false) AS "hasDeactivatedVersion"
       FROM core."workflow" c
       ${buildWorkflowVersionsJoinClause(schemaName)}
       WHERE c."workspaceId" = $1
       ${keysetCondition}
       GROUP BY ${GROUPED_WORKFLOW_COLUMNS}, c."applicationId"
       ${havingClause}
       ORDER BY ${column} ${direction}${nullsClause}, c.id ${direction}
       LIMIT ${limitParameter}`, parameters);
        const totalCount = await this.countByWorkspaceId({
            workspaceId,
            schemaName,
            filterPredicate,
            filterParameters
        });
        const hasNextPage = rows.length > first;
        const pageRows = hasNextPage ? rows.slice(0, first) : rows;
        const edges = pageRows.map((row)=>({
                node: {
                    id: row.id,
                    name: row.name,
                    statuses: (0, _computecoreworkflowstatusesutil.computeCoreWorkflowStatuses)({
                        hasDraftVersion: row.hasDraftVersion,
                        hasActiveVersion: row.hasActiveVersion,
                        hasDeactivatedVersion: row.hasDeactivatedVersion
                    }),
                    applicationId: row.applicationId,
                    workspaceWorkflowId: row.workspaceWorkflowId,
                    updatedAt: row.updatedAt.toISOString()
                },
                cursor: (0, _cursorsutil.encodeCursorData)({
                    sortValue: row.cursorSortValue,
                    id: row.id
                })
            }));
        return {
            edges,
            pageInfo: {
                endCursor: edges.length > 0 ? edges[edges.length - 1].cursor : null,
                hasNextPage
            },
            totalCount
        };
    }
    async countByWorkspaceId({ workspaceId, schemaName, filterPredicate, filterParameters }) {
        const parameters = [
            workspaceId
        ];
        if (!(0, _utils.isDefined)(filterPredicate)) {
            const [{ totalCount }] = await this.coreDataSource.query(`SELECT count(*)::int AS "totalCount"
           FROM core."workflow" c
           WHERE c."workspaceId" = $1`, parameters);
            return totalCount;
        }
        parameters.push(...filterParameters);
        const [{ totalCount }] = await this.coreDataSource.query(`SELECT count(*)::int AS "totalCount"
         FROM (
           SELECT c.id
           FROM core."workflow" c
           ${buildWorkflowVersionsJoinClause(schemaName)}
           WHERE c."workspaceId" = $1
           GROUP BY ${GROUPED_WORKFLOW_COLUMNS}
           HAVING ${filterPredicate}
         ) filtered`, parameters);
        return totalCount;
    }
    constructor(coreDataSource){
        this.coreDataSource = coreDataSource;
    }
};
CoreWorkflowListService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_param(0, (0, _typeorm.InjectDataSource)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _typeorm1.DataSource === "undefined" ? Object : _typeorm1.DataSource
    ])
], CoreWorkflowListService);

//# sourceMappingURL=core-workflow-list.service.js.map