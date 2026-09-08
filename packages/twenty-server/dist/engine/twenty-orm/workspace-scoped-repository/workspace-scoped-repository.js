"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "WorkspaceScopedRepository", {
    enumerable: true,
    get: function() {
        return WorkspaceScopedRepository;
    }
});
const _typeorm = require("typeorm");
const _utils = require("twenty-shared/utils");
let WorkspaceScopedRepository = class WorkspaceScopedRepository {
    findOne(workspaceId, options) {
        this.assertWorkspaceId(workspaceId);
        return this.repository.findOne({
            ...options,
            where: this.mergeWorkspaceIdIntoWhere(workspaceId, options.where)
        });
    }
    findOneOrFail(workspaceId, options) {
        this.assertWorkspaceId(workspaceId);
        return this.repository.findOneOrFail({
            ...options,
            where: this.mergeWorkspaceIdIntoWhere(workspaceId, options.where)
        });
    }
    findOneBy(workspaceId, where) {
        this.assertWorkspaceId(workspaceId);
        return this.repository.findOneBy(this.mergeWorkspaceIdIntoCriteria(workspaceId, where));
    }
    find(workspaceId, options) {
        this.assertWorkspaceId(workspaceId);
        return this.repository.find({
            ...options,
            where: this.mergeWorkspaceIdIntoWhere(workspaceId, options?.where)
        });
    }
    count(workspaceId, options) {
        this.assertWorkspaceId(workspaceId);
        return this.repository.count({
            ...options,
            where: this.mergeWorkspaceIdIntoWhere(workspaceId, options?.where)
        });
    }
    findAndCount(workspaceId, options) {
        this.assertWorkspaceId(workspaceId);
        return this.repository.findAndCount({
            ...options,
            where: this.mergeWorkspaceIdIntoWhere(workspaceId, options?.where)
        });
    }
    exists(workspaceId, options) {
        this.assertWorkspaceId(workspaceId);
        return this.repository.exists({
            ...options,
            where: this.mergeWorkspaceIdIntoWhere(workspaceId, options?.where)
        });
    }
    existsBy(workspaceId, where) {
        this.assertWorkspaceId(workspaceId);
        return this.repository.existsBy(this.mergeWorkspaceIdIntoCriteria(workspaceId, where));
    }
    maximum(workspaceId, columnName, where) {
        this.assertWorkspaceId(workspaceId);
        return this.repository.maximum(// eslint-disable-next-line @typescript-eslint/no-explicit-any
        columnName, where ? this.mergeWorkspaceIdIntoCriteria(workspaceId, where) : {
            workspaceId
        });
    }
    update(workspaceId, criteria, partialEntity) {
        this.assertWorkspaceId(workspaceId);
        return this.repository.update(this.mergeWorkspaceIdIntoCriteria(workspaceId, criteria), partialEntity);
    }
    increment(workspaceId, criteria, propertyPath, value) {
        this.assertWorkspaceId(workspaceId);
        return this.repository.increment(this.mergeWorkspaceIdIntoCriteria(workspaceId, criteria), propertyPath, value);
    }
    decrement(workspaceId, criteria, propertyPath, value) {
        this.assertWorkspaceId(workspaceId);
        return this.repository.decrement(this.mergeWorkspaceIdIntoCriteria(workspaceId, criteria), propertyPath, value);
    }
    delete(workspaceId, criteria) {
        this.assertWorkspaceId(workspaceId);
        return this.repository.delete(this.mergeWorkspaceIdIntoCriteria(workspaceId, criteria));
    }
    softDelete(workspaceId, criteria) {
        this.assertWorkspaceId(workspaceId);
        return this.repository.softDelete(this.mergeWorkspaceIdIntoCriteria(workspaceId, criteria));
    }
    // save / saveMany / softRemove / recover / remove are intentionally absent.
    // TypeORM's entity-based methods use only the primary key in the WHERE
    // clause, so stamping workspaceId on the entity object does not add an
    // AND workspace_id = ? guard to the SQL. A leaked entity id could act on a
    // row from a different workspace and silently reassign its workspaceId.
    // The criteria-based methods either cannot target an existing row or
    // always carry workspaceId in the WHERE clause.
    insert(workspaceId, entity) {
        this.assertWorkspaceId(workspaceId);
        return this.repository.insert(this.stampWorkspaceIdOnEntities(workspaceId, entity));
    }
    async insertAndReturnOne(workspaceId, entity) {
        this.assertWorkspaceId(workspaceId);
        const { raw } = await this.repository.createQueryBuilder().insert().values(this.stampWorkspaceIdOnEntities(workspaceId, entity)).returning('*').execute();
        const [persistedRow] = raw;
        if (!(0, _utils.isDefined)(persistedRow)) {
            throw new Error('WorkspaceScopedRepository.insertAndReturnOne: insert returned no row.');
        }
        return this.repository.create(persistedRow);
    }
    async upsert(workspaceId, entity, conflictPathsOrOptions) {
        this.assertWorkspaceId(workspaceId);
        await this.assertConflictTargetsBelongToWorkspace(workspaceId, entity, conflictPathsOrOptions);
        return this.repository.upsert(this.stampWorkspaceIdOnEntities(workspaceId, entity), conflictPathsOrOptions);
    }
    async upsertAndReturnOne(workspaceId, entity, conflictPaths) {
        this.assertWorkspaceId(workspaceId);
        await this.assertConflictTargetsBelongToWorkspace(workspaceId, entity, conflictPaths);
        const { generatedMaps } = await this.repository.upsert(this.stampWorkspaceIdOnEntities(workspaceId, entity), {
            conflictPaths,
            returning: '*'
        });
        const [persistedRow] = generatedMaps;
        if (!(0, _utils.isDefined)(persistedRow)) {
            throw new Error('WorkspaceScopedRepository.upsertAndReturnOne: upsert returned no row.');
        }
        return this.repository.create(persistedRow);
    }
    // Escape hatch. Caller MUST add the workspaceId predicate themselves.
    createQueryBuilder(alias) {
        return this.repository.createQueryBuilder(alias);
    }
    withManager(manager) {
        return new WorkspaceScopedRepository(manager.getRepository(this.repository.target));
    }
    // TypeORM drops `undefined` values from WHERE, which would emit an
    // unscoped query.
    assertWorkspaceId(workspaceId) {
        if (workspaceId === undefined || workspaceId === null || workspaceId === '') {
            throw new Error('WorkspaceScopedRepository: workspaceId must be a non-empty string.');
        }
    }
    mergeWorkspaceIdIntoWhere(workspaceId, where) {
        if (where === undefined) {
            return {
                workspaceId
            };
        }
        if (Array.isArray(where)) {
            return where.map((clause)=>this.prependWorkspaceId(workspaceId, clause));
        }
        return this.prependWorkspaceId(workspaceId, where);
    }
    mergeWorkspaceIdIntoCriteria(workspaceId, criteria) {
        return this.prependWorkspaceId(workspaceId, criteria);
    }
    prependWorkspaceId(workspaceId, clause) {
        if ('workspaceId' in clause) {
            throw new Error('WorkspaceScopedRepository: do not include `workspaceId` in the WHERE clause — it is provided as the first argument and merged automatically.');
        }
        return {
            workspaceId,
            ...clause
        };
    }
    // ON CONFLICT matches on the conflict target alone. When that target does
    // not contain workspaceId, a row from another workspace can satisfy it and
    // the DO UPDATE would overwrite that row and reassign its workspaceId.
    async assertConflictTargetsBelongToWorkspace(workspaceId, entity, conflictPathsOrOptions) {
        const conflictPaths = Array.isArray(conflictPathsOrOptions) ? conflictPathsOrOptions : conflictPathsOrOptions.conflictPaths ?? [];
        const conflictPathNames = Array.isArray(conflictPaths) ? conflictPaths : Object.keys(conflictPaths);
        if (conflictPathNames.length === 0 || conflictPathNames.includes('workspaceId')) {
            return;
        }
        const entities = Array.isArray(entity) ? entity : [
            entity
        ];
        const conflictTargets = entities.map((item)=>conflictPathNames.reduce((target, path)=>({
                    ...target,
                    [path]: item[path]
                }), {})).filter((target)=>Object.values(target).every((value)=>(0, _utils.isDefined)(value)));
        if (conflictTargets.length === 0) {
            return;
        }
        const foreignRow = await this.repository.findOne({
            where: conflictTargets.map((target)=>({
                    ...target,
                    workspaceId: (0, _typeorm.Not)(workspaceId)
                })),
            withDeleted: true
        });
        if ((0, _utils.isDefined)(foreignRow)) {
            throw new Error(`WorkspaceScopedRepository: upsert conflict target (${conflictPathNames.join(', ')}) matches a row owned by another workspace.`);
        }
    }
    stampWorkspaceIdOnEntities(workspaceId, entity) {
        if (Array.isArray(entity)) {
            return entity.map((item)=>({
                    ...item,
                    workspaceId
                }));
        }
        return {
            ...entity,
            workspaceId
        };
    }
    constructor(repository){
        this.repository = repository;
    }
};

//# sourceMappingURL=workspace-scoped-repository.js.map