"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _twentyormexception = require("../../exceptions/twenty-orm.exception");
const _workspaceselectquerybuildertestshapesutil = require("./workspace-select-query-builder-test-shapes.util");
describe('WorkspaceSelectQueryBuilder joins', ()=>{
    it('should join a to-one relation on its foreign key', ()=>{
        const { queryBuilder } = (0, _workspaceselectquerybuildertestshapesutil.buildQueryBuilder)();
        queryBuilder.setFindOptions({
            select: {
                id: true
            }
        });
        queryBuilder.leftJoin('person.company', 'company');
        expect(queryBuilder.getQuery()).toContain(`LEFT JOIN "${_workspaceselectquerybuildertestshapesutil.SCHEMA_NAME}"."company" AS "company" ` + 'ON ("person"."companyId" = "company"."id")');
    });
    it('should render an inner join for a to-one relation', ()=>{
        const { queryBuilder } = (0, _workspaceselectquerybuildertestshapesutil.buildQueryBuilder)();
        queryBuilder.setFindOptions({
            select: {
                id: true
            }
        });
        queryBuilder.innerJoin('person.company', 'company');
        expect(queryBuilder.getQuery()).toContain(`INNER JOIN "${_workspaceselectquerybuildertestshapesutil.SCHEMA_NAME}"."company" AS "company" ` + 'ON ("person"."companyId" = "company"."id")');
    });
    it('should resolve a join path rooted on a joined alias', ()=>{
        const { queryBuilder } = (0, _workspaceselectquerybuildertestshapesutil.buildQueryBuilder)();
        queryBuilder.setFindOptions({
            select: {
                id: true
            }
        });
        queryBuilder.leftJoin('person.company', 'company');
        queryBuilder.leftJoin('company.person', 'companyPerson');
        expect(queryBuilder.getQuery()).toContain(`LEFT JOIN "${_workspaceselectquerybuildertestshapesutil.SCHEMA_NAME}"."company" AS "companyPerson" ` + 'ON ("company"."personId" = "companyPerson"."id")');
    });
    it('should reject a join path rooted on an unknown alias', ()=>{
        const { queryBuilder } = (0, _workspaceselectquerybuildertestshapesutil.buildQueryBuilder)();
        expect(()=>queryBuilder.leftJoin('unknown.company', 'company')).toThrow(_twentyormexception.TwentyOrmException);
    });
    it('should reject a join alias that collides with the main alias', ()=>{
        const { queryBuilder } = (0, _workspaceselectquerybuildertestshapesutil.buildQueryBuilder)();
        expect(()=>queryBuilder.leftJoin('person.company', 'person')).toThrow(_twentyormexception.TwentyOrmException);
    });
    it('should report a to-many join to the shared guard rather than rendering it', ()=>{
        const { queryBuilder } = (0, _workspaceselectquerybuildertestshapesutil.buildQueryBuilder)();
        queryBuilder.setFindOptions({
            select: {
                id: true
            }
        });
        queryBuilder.leftJoin('person.people', 'people');
        expect(queryBuilder.getJoinAliases()).toEqual([
            {
                name: 'people',
                isToMany: true
            }
        ]);
        expect(()=>queryBuilder.getQuery()).toThrow(_twentyormexception.TwentyOrmException);
    });
    it('should render a deduped to-many join on the inverse foreign key when the caller opts in', ()=>{
        const { queryBuilder } = (0, _workspaceselectquerybuildertestshapesutil.buildQueryBuilder)();
        queryBuilder.setFindOptions({
            select: {
                id: true
            }
        });
        queryBuilder.leftJoin('person.people', 'people', undefined, {
            allowToManyJoin: true
        });
        expect(queryBuilder.getQuery()).toContain(`LEFT JOIN (SELECT DISTINCT ON ("personId") * ` + `FROM "${_workspaceselectquerybuildertestshapesutil.SCHEMA_NAME}"."company" ` + `WHERE "deletedAt" IS NULL ` + `ORDER BY "personId", "id") AS "people" ` + 'ON ("people"."personId" = "person"."id")');
    });
    it('should render a plain to-many join for a raw read', async ()=>{
        const { queryBuilder, executedStatements } = (0, _workspaceselectquerybuildertestshapesutil.buildQueryBuilder)();
        queryBuilder.select([]);
        queryBuilder.addSelect('person.id', 'id');
        queryBuilder.innerJoin('person.people', 'people');
        await queryBuilder.getRawMany();
        expect(executedStatements[0].text).toContain(`INNER JOIN "${_workspaceselectquerybuildertestshapesutil.SCHEMA_NAME}"."company" AS "people" ` + 'ON ("people"."personId" = "person"."id") AND ("people"."deletedAt" IS NULL)');
    });
    it('should render a plain to-many left join for a raw read', async ()=>{
        const { queryBuilder, executedStatements } = (0, _workspaceselectquerybuildertestshapesutil.buildQueryBuilder)();
        queryBuilder.select([]);
        queryBuilder.addSelect('person.id', 'id');
        queryBuilder.leftJoin('person.people', 'people');
        await queryBuilder.getRawMany();
        expect(executedStatements[0].text).toContain(`LEFT JOIN "${_workspaceselectquerybuildertestshapesutil.SCHEMA_NAME}"."company" AS "people" ` + 'ON ("people"."personId" = "person"."id")');
    });
    it('should still reject a plain to-many join for an entity-hydrating read', async ()=>{
        const { queryBuilder } = (0, _workspaceselectquerybuildertestshapesutil.buildQueryBuilder)();
        queryBuilder.setFindOptions({
            select: {
                id: true
            }
        });
        queryBuilder.leftJoin('person.people', 'people');
        await expect(queryBuilder.getMany()).rejects.toThrow(_twentyormexception.TwentyOrmException);
        await expect(queryBuilder.getOne()).rejects.toThrow(_twentyormexception.TwentyOrmException);
    });
    it('should reject a to-many join with an explicit condition for an entity-hydrating read', async ()=>{
        const { queryBuilder, executedStatements } = (0, _workspaceselectquerybuildertestshapesutil.buildQueryBuilder)();
        queryBuilder.setFindOptions({
            select: {
                id: true
            }
        });
        queryBuilder.leftJoin('person.people', 'people', '"people"."personId" = "person"."id"');
        await expect(queryBuilder.getMany()).rejects.toThrow(_twentyormexception.TwentyOrmException);
        queryBuilder.select([]);
        queryBuilder.addSelect('person.id', 'id');
        await queryBuilder.getRawMany();
        expect(executedStatements[0].text).toContain('ON ("people"."personId" = "person"."id")');
    });
    it('should count distinct main records when a to-many join multiplies rows', async ()=>{
        const { queryBuilder, executedStatements } = (0, _workspaceselectquerybuildertestshapesutil.buildQueryBuilder)({
            rows: [
                {
                    count: '3'
                }
            ]
        });
        queryBuilder.innerJoin('person.people', 'people');
        queryBuilder.where('people.name = :name', {
            name: 'Acme'
        });
        queryBuilder.groupBy('person.id');
        const count = await queryBuilder.getCount();
        expect(count).toBe(3);
        expect(executedStatements[0].text).toContain('SELECT COUNT(DISTINCT "person"."id") AS "count"');
        expect(executedStatements[0].text).toContain(`INNER JOIN "${_workspaceselectquerybuildertestshapesutil.SCHEMA_NAME}"."company" AS "people"`);
        expect(executedStatements[0].text).not.toContain('GROUP BY');
    });
    it('should build a COUNT statement that ignores projection, order and pagination', async ()=>{
        const { queryBuilder, executedStatements } = (0, _workspaceselectquerybuildertestshapesutil.buildQueryBuilder)({
            rows: [
                {
                    count: '7'
                }
            ]
        });
        queryBuilder.setFindOptions({
            select: {
                id: true
            }
        }).orderBy('"person"."id"', 'ASC').take(10);
        const count = await queryBuilder.getCount();
        expect(count).toBe(7);
        expect(executedStatements[0].text).toBe('SELECT COUNT(1) AS "count" ' + `FROM "${_workspaceselectquerybuildertestshapesutil.SCHEMA_NAME}"."person" AS "person" ` + 'WHERE "person"."deletedAt" IS NULL');
    });
    it('should render an added join condition on a plain to-many join', async ()=>{
        const { queryBuilder, executedStatements } = (0, _workspaceselectquerybuildertestshapesutil.buildQueryBuilder)();
        queryBuilder.select([]);
        queryBuilder.addSelect('person.id', 'id');
        queryBuilder.innerJoin('person.people', 'people');
        queryBuilder.addJoinCondition('people', '"people"."name" = :ownerName');
        queryBuilder.setParameters({
            ownerName: 'Acme'
        });
        await queryBuilder.getRawMany();
        expect(executedStatements[0].text).toContain('("people"."personId" = "person"."id") AND ("people"."name" = $1)');
    });
    it('should filter soft-deleted joined rows in the ON clause', ()=>{
        const { queryBuilder } = (0, _workspaceselectquerybuildertestshapesutil.buildQueryBuilder)();
        queryBuilder.setFindOptions({
            select: {
                id: true
            }
        });
        queryBuilder.leftJoin('person.company', 'company');
        const sql = queryBuilder.getQuery();
        expect(sql).toContain('("company"."deletedAt" IS NULL)');
        expect(sql.indexOf('"company"."deletedAt"')).toBeLessThan(sql.indexOf('WHERE'));
    });
    it('should add a joined predicate to ON rather than WHERE', ()=>{
        const { queryBuilder } = (0, _workspaceselectquerybuildertestshapesutil.buildQueryBuilder)();
        queryBuilder.setFindOptions({
            select: {
                id: true
            }
        });
        queryBuilder.leftJoin('person.company', 'company');
        queryBuilder.addJoinCondition('company', '"company"."name" = :owner');
        queryBuilder.setParameters({
            owner: 'Acme'
        });
        const sql = queryBuilder.getQuery();
        expect(sql).toContain('("company"."name" = :owner)');
        expect(sql.indexOf('"company"."name"')).toBeLessThan(sql.indexOf('WHERE'));
    });
    it('should not widen the projection when a relation is joined', ()=>{
        const { queryBuilder } = (0, _workspaceselectquerybuildertestshapesutil.buildQueryBuilder)();
        queryBuilder.setFindOptions({
            select: {
                id: true
            }
        });
        queryBuilder.leftJoin('person.company', 'company');
        expect(queryBuilder.getQuery()).toContain('SELECT "person"."id" AS "person_id" FROM');
    });
    it('should carry applied row-level markers onto a clone', ()=>{
        const { queryBuilder } = (0, _workspaceselectquerybuildertestshapesutil.buildQueryBuilder)();
        expect(queryBuilder.markRowLevelPermissionApplied('person')).toBe(true);
        expect(queryBuilder.clone().markRowLevelPermissionApplied('person')).toBe(false);
    });
    it('should clear applied row-level markers when where() replaces the WHERE', ()=>{
        const { queryBuilder } = (0, _workspaceselectquerybuildertestshapesutil.buildQueryBuilder)();
        queryBuilder.markRowLevelPermissionApplied('person');
        queryBuilder.where('"person"."id" = :id', {
            id: 1
        });
        expect(queryBuilder.markRowLevelPermissionApplied('person')).toBe(true);
    });
    it('should keep joined row-level markers when where() replaces the WHERE', ()=>{
        const { queryBuilder } = (0, _workspaceselectquerybuildertestshapesutil.buildQueryBuilder)();
        queryBuilder.leftJoin('person.company', 'company');
        queryBuilder.markRowLevelPermissionApplied('person');
        queryBuilder.markRowLevelPermissionApplied('company');
        queryBuilder.where('"person"."id" = :id', {
            id: 1
        });
        expect(queryBuilder.markRowLevelPermissionApplied('person')).toBe(true);
        expect(queryBuilder.markRowLevelPermissionApplied('company')).toBe(false);
    });
});

//# sourceMappingURL=workspace-select-query-builder-joins.spec.js.map