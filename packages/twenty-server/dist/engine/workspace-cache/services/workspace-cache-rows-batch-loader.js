"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "WorkspaceCacheRowsBatchLoader", {
    enumerable: true,
    get: function() {
        return WorkspaceCacheRowsBatchLoader;
    }
});
const _utils = require("twenty-shared/utils");
const _allworkspacecacheentitybynameconstant = require("../constants/all-workspace-cache-entity-by-name.constant");
const _workspacecacheexception = require("../exceptions/workspace-cache.exception");
const _grouprowsbyforeignkeyutil = require("../utils/group-rows-by-foreign-key.util");
const _isobjectentityrowsrequirementutil = require("../utils/is-object-entity-rows-requirement.util");
const _serializewhereclauseutil = require("../utils/serialize-where-clause.util");
const normalizeEntityRowsRequirement = (entityRowsRequirement)=>(0, _isobjectentityrowsrequirementutil.isObjectEntityRowsRequirement)(entityRowsRequirement) ? {
        columns: entityRowsRequirement.columns,
        groupBy: entityRowsRequirement.groupBy ?? [],
        where: entityRowsRequirement.where
    } : {
        columns: entityRowsRequirement,
        groupBy: []
    };
const buildFetchKey = (entityName, where)=>(0, _utils.isDefined)(where) ? `${entityName}:${(0, _serializewhereclauseutil.serializeWhereClause)(where)}` : entityName;
let WorkspaceCacheRowsBatchLoader = class WorkspaceCacheRowsBatchLoader {
    async loadRows(rowsRequirements) {
        if (this.hasLoadedRows) {
            throw new _workspacecacheexception.WorkspaceCacheException('Rows were already loaded for this batch loader: merge all requirements into a single loadRows call', _workspacecacheexception.WorkspaceCacheExceptionCode.INVALID_PARAMETERS);
        }
        this.hasLoadedRows = true;
        const plannedFetchByFetchKey = new Map();
        for (const rowsRequirement of rowsRequirements){
            for (const [entityName, entityRowsRequirement] of Object.entries(rowsRequirement)){
                if (!(0, _utils.isDefined)(entityRowsRequirement)) {
                    continue;
                }
                const { columns, groupBy, where } = normalizeEntityRowsRequirement(entityRowsRequirement);
                const fetchKey = buildFetchKey(entityName, where);
                const plannedFetch = plannedFetchByFetchKey.get(fetchKey);
                if (columns === true) {
                    plannedFetchByFetchKey.set(fetchKey, {
                        entityName,
                        where,
                        columns: null
                    });
                    continue;
                }
                const columnsWithGroupByKeys = [
                    ...columns,
                    ...groupBy
                ];
                if (!(0, _utils.isDefined)(plannedFetch)) {
                    plannedFetchByFetchKey.set(fetchKey, {
                        entityName,
                        where,
                        columns: new Set(columnsWithGroupByKeys)
                    });
                    continue;
                }
                if (plannedFetch.columns === null) {
                    continue;
                }
                for (const column of columnsWithGroupByKeys){
                    plannedFetch.columns.add(column);
                }
            }
        }
        await Promise.all([
            ...plannedFetchByFetchKey
        ].map(async ([fetchKey, plannedFetch])=>{
            const rows = await this.runFetch(plannedFetch);
            this.rowsByFetchKey.set(fetchKey, rows);
        }));
    }
    readRows(rowsRequirement) {
        const rowsByEntityName = {};
        for (const [entityName, entityRowsRequirement] of Object.entries(rowsRequirement)){
            if (!(0, _utils.isDefined)(entityRowsRequirement)) {
                continue;
            }
            if (!(0, _isobjectentityrowsrequirementutil.isObjectEntityRowsRequirement)(entityRowsRequirement)) {
                rowsByEntityName[entityName] = this.getRowsForFetchKey(entityName, buildFetchKey(entityName, undefined));
                continue;
            }
            const fetchKey = buildFetchKey(entityName, entityRowsRequirement.where);
            const rows = this.getRowsForFetchKey(entityName, fetchKey);
            if (!(0, _utils.isDefined)(entityRowsRequirement.groupBy)) {
                rowsByEntityName[entityName] = rows;
                continue;
            }
            const groupedEntry = {
                rows
            };
            for (const foreignKey of entityRowsRequirement.groupBy){
                groupedEntry[`by${(0, _utils.capitalize)(foreignKey)}`] = this.getGroupedRows(fetchKey, foreignKey, rows);
            }
            rowsByEntityName[entityName] = groupedEntry;
        }
        return rowsByEntityName;
    }
    getGroupedRows(fetchKey, foreignKey, rows) {
        const memoKey = `${fetchKey}:${foreignKey}`;
        const memoizedGroupedRows = this.groupedRowsByFetchKeyAndForeignKey.get(memoKey);
        if ((0, _utils.isDefined)(memoizedGroupedRows)) {
            return memoizedGroupedRows;
        }
        const groupedRows = (0, _grouprowsbyforeignkeyutil.groupRowsByForeignKey)({
            rows,
            foreignKey
        });
        this.groupedRowsByFetchKeyAndForeignKey.set(memoKey, groupedRows);
        return groupedRows;
    }
    getRowsForFetchKey(entityName, fetchKey) {
        const rows = this.rowsByFetchKey.get(fetchKey);
        if (!(0, _utils.isDefined)(rows)) {
            throw new _workspacecacheexception.WorkspaceCacheException(`Rows for entity "${entityName}" (fetch key "${fetchKey}") were not resolved in this recompute batch: declare it in the provider's rowsRequirement`, _workspacecacheexception.WorkspaceCacheExceptionCode.INVALID_PARAMETERS);
        }
        return rows;
    }
    runFetch({ entityName, where, columns }) {
        const findOptions = {
            where: {
                ...where,
                workspaceId: this.workspaceId
            },
            withDeleted: true
        };
        if (columns !== null) {
            findOptions.select = [
                ...columns
            ];
        }
        return this.coreDataSource.getRepository(_allworkspacecacheentitybynameconstant.ALL_WORKSPACE_CACHE_ENTITY_BY_NAME[entityName]).find(findOptions);
    }
    constructor(coreDataSource, workspaceId){
        this.coreDataSource = coreDataSource;
        this.workspaceId = workspaceId;
        this.rowsByFetchKey = new Map();
        this.groupedRowsByFetchKeyAndForeignKey = new Map();
        this.hasLoadedRows = false;
    }
};

//# sourceMappingURL=workspace-cache-rows-batch-loader.js.map