"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _workspaceselectquerybuilder = require("../workspace-select-query-builder");
const _workspaceselectquerybuildertestshapesutil = require("./workspace-select-query-builder-test-shapes.util");
const _buildcolumnresultaliasutil = require("../../sql/utils/build-column-result-alias.util");
const _twentyormexception = require("../../exceptions/twenty-orm.exception");
describe('WorkspaceSelectQueryBuilder selection', ()=>{
    it('should select the requested columns with alias-prefixed output names', ()=>{
        const { queryBuilder } = (0, _workspaceselectquerybuildertestshapesutil.buildQueryBuilder)();
        queryBuilder.setFindOptions({
            select: {
                id: true,
                nameFirstName: true
            }
        });
        expect(queryBuilder.getQuery()).toBe('SELECT "person"."id" AS "person_id", "person"."nameFirstName" AS "person_nameFirstName" ' + `FROM "${_workspaceselectquerybuildertestshapesutil.SCHEMA_NAME}"."person" AS "person" ` + 'WHERE "person"."deletedAt" IS NULL');
    });
    it('should compile named parameters coming from the shared filter parser', ()=>{
        const { queryBuilder } = (0, _workspaceselectquerybuildertestshapesutil.buildQueryBuilder)();
        queryBuilder.setFindOptions({
            select: {
                id: true
            }
        }).andWhere('"person"."nameFirstName" ILIKE :name7f3a', {
            name7f3a: '%ac%'
        });
        const [text, values] = queryBuilder.getQueryAndParameters();
        expect(text).toContain('"person"."nameFirstName" ILIKE $1');
        expect(values).toEqual([
            '%ac%'
        ]);
    });
    it('should add the soft-delete predicate unless withDeleted was called', ()=>{
        const { queryBuilder } = (0, _workspaceselectquerybuildertestshapesutil.buildQueryBuilder)();
        queryBuilder.setFindOptions({
            select: {
                id: true
            }
        });
        expect(queryBuilder.getQuery()).toContain('"person"."deletedAt" IS NULL');
        queryBuilder.withDeleted();
        expect(queryBuilder.getQuery()).not.toContain('"person"."deletedAt" IS NULL');
    });
    it('should reject a column that does not exist on the object', ()=>{
        const { queryBuilder } = (0, _workspaceselectquerybuildertestshapesutil.buildQueryBuilder)();
        queryBuilder.setFindOptions({
            select: {
                nonExistent: true
            }
        });
        expect(()=>queryBuilder.getQuery()).toThrow(_twentyormexception.TwentyOrmException);
    });
    it('should select only aggregate expressions after select([])', ()=>{
        const { queryBuilder } = (0, _workspaceselectquerybuildertestshapesutil.buildQueryBuilder)();
        queryBuilder.setFindOptions({
            select: {
                id: true,
                nameFirstName: true
            }
        });
        queryBuilder.select([]);
        queryBuilder.addSelect('COUNT("person"."id")', 'totalCount');
        const sql = queryBuilder.getQuery();
        expect(sql).toContain('SELECT COUNT("person"."id") AS "totalCount" FROM');
        expect(sql).not.toContain('"person"."nameFirstName"');
    });
    it('should count columns referenced only inside aggregates as selected', ()=>{
        const { queryBuilder } = (0, _workspaceselectquerybuildertestshapesutil.buildQueryBuilder)();
        queryBuilder.select([]);
        queryBuilder.addSelect('MAX("person"."nameFirstName")', 'maxFirstName');
        expect(queryBuilder.getSelectedColumnNames()).toContain('nameFirstName');
    });
    it('should keep an explicit empty selection on a clone', ()=>{
        const { queryBuilder } = (0, _workspaceselectquerybuildertestshapesutil.buildQueryBuilder)();
        queryBuilder.setFindOptions({
            select: {
                id: true
            }
        });
        queryBuilder.select([]);
        queryBuilder.addSelect('COUNT("person"."id")', 'totalCount');
        expect(queryBuilder.clone().getQuery()).not.toContain('"person"."id" AS');
    });
    it('should treat selecting the main alias as selecting every main column', ()=>{
        const { queryBuilder } = (0, _workspaceselectquerybuildertestshapesutil.buildQueryBuilder)();
        queryBuilder.select('person');
        const sql = queryBuilder.getQuery();
        expect(sql).toContain('"person"."id" AS "person_id"');
        expect(sql).toContain('"person"."nameFirstName" AS "person_nameFirstName"');
    });
    it('should strip the alias prefix when mapping rows back to records', async ()=>{
        const { queryBuilder } = (0, _workspaceselectquerybuildertestshapesutil.buildQueryBuilder)({
            rows: [
                {
                    person_id: 'person-1',
                    person_nameFirstName: 'Ada',
                    company_name: 'Acme'
                }
            ]
        });
        queryBuilder.setFindOptions({
            select: {
                id: true,
                nameFirstName: true
            }
        });
        const records = await queryBuilder.getMany();
        expect(records).toEqual([
            {
                id: 'person-1',
                nameFirstName: 'Ada'
            }
        ]);
    });
    it('should keep result aliases within the postgres identifier limit', async ()=>{
        const longColumnName = `veryLongSubfield${'X'.repeat(60)}`;
        const otherLongColumnName = `veryLongSubfield${'Y'.repeat(60)}`;
        const resultAlias = (0, _buildcolumnresultaliasutil.buildColumnResultAlias)('person', longColumnName);
        const otherResultAlias = (0, _buildcolumnresultaliasutil.buildColumnResultAlias)('person', otherLongColumnName);
        const { queryBuilder } = (0, _workspaceselectquerybuildertestshapesutil.buildQueryBuilder)({
            tableShape: {
                ..._workspaceselectquerybuildertestshapesutil.personTableShape,
                columnShapeByColumnName: {
                    ..._workspaceselectquerybuildertestshapesutil.personTableShape.columnShapeByColumnName,
                    [longColumnName]: (0, _workspaceselectquerybuildertestshapesutil.buildColumn)(longColumnName),
                    [otherLongColumnName]: (0, _workspaceselectquerybuildertestshapesutil.buildColumn)(otherLongColumnName)
                }
            },
            rows: [
                {
                    [resultAlias]: 'left',
                    [otherResultAlias]: 'right'
                }
            ]
        });
        queryBuilder.setFindOptions({
            select: {
                [longColumnName]: true,
                [otherLongColumnName]: true
            }
        });
        expect(resultAlias.length).toBeLessThanOrEqual(63);
        expect(resultAlias).not.toBe(otherResultAlias);
        expect(queryBuilder.getQuery()).toContain(`"person"."${longColumnName}" AS "${resultAlias}"`);
        await expect(queryBuilder.getMany()).resolves.toEqual([
            {
                [longColumnName]: 'left',
                [otherLongColumnName]: 'right'
            }
        ]);
    });
    it('should report the columns it selected so permissions do not have to parse SQL', ()=>{
        const { queryBuilder } = (0, _workspaceselectquerybuildertestshapesutil.buildQueryBuilder)();
        queryBuilder.setFindOptions({
            select: {
                id: true,
                companyId: true
            }
        });
        expect(queryBuilder.getSelectedColumnNames()).toEqual([
            'id',
            'companyId'
        ]);
    });
    it('should keep a clone independent of the builder it came from', ()=>{
        const { queryBuilder } = (0, _workspaceselectquerybuildertestshapesutil.buildQueryBuilder)();
        queryBuilder.setFindOptions({
            select: {
                id: true
            }
        });
        const clone = queryBuilder.clone();
        clone.andWhere('"person"."id" = :id', {
            id: 1
        });
        expect(queryBuilder.getQuery()).not.toContain('"person"."id" = :id');
        expect(clone.getQuery()).toContain('"person"."id" = :id');
    });
    it('should send one parameterised statement to the executor', async ()=>{
        const { queryBuilder, executedStatements } = (0, _workspaceselectquerybuildertestshapesutil.buildQueryBuilder)();
        queryBuilder.setFindOptions({
            select: {
                id: true
            }
        }).andWhere('"person"."nameFirstName" = :name', {
            name: 'Ada'
        });
        await queryBuilder.getMany();
        expect(executedStatements).toHaveLength(1);
        expect(executedStatements[0].text).toContain('$1');
        expect(executedStatements[0].values).toEqual([
            'Ada'
        ]);
    });
    it('should map take and skip to LIMIT and OFFSET parameters', ()=>{
        const { queryBuilder } = (0, _workspaceselectquerybuildertestshapesutil.buildQueryBuilder)();
        queryBuilder.setFindOptions({
            select: {
                id: true
            }
        }).take(31).skip(60);
        const [text, values] = queryBuilder.getQueryAndParameters();
        expect(text).toContain('LIMIT $1');
        expect(text).toContain('OFFSET $2');
        expect(values).toEqual([
            31,
            60
        ]);
    });
    it('should reuse one statement shape across page sizes and offsets', ()=>{
        const buildPaginatedQuery = (limit, offset)=>{
            const { queryBuilder } = (0, _workspaceselectquerybuildertestshapesutil.buildQueryBuilder)();
            queryBuilder.setFindOptions({
                select: {
                    id: true
                }
            });
            queryBuilder.limit(limit);
            queryBuilder.offset(offset);
            return queryBuilder.getQueryAndParameters();
        };
        const [firstText, firstValues] = buildPaginatedQuery(30, 0);
        const [secondText, secondValues] = buildPaginatedQuery(60, 120);
        expect(firstText).toBe(secondText);
        expect(firstValues).toEqual([
            30,
            0
        ]);
        expect(secondValues).toEqual([
            60,
            120
        ]);
    });
    it('should emit a plain parameterised LIMIT, with no distinct sub-select', ()=>{
        const { queryBuilder } = (0, _workspaceselectquerybuildertestshapesutil.buildQueryBuilder)();
        queryBuilder.setFindOptions({
            select: {
                id: true
            }
        });
        queryBuilder.leftJoin('person.company', 'company');
        queryBuilder.limit(31);
        const [text, values] = queryBuilder.getQueryAndParameters();
        expect(text).toContain('LIMIT $');
        expect(text).not.toContain('DISTINCT');
        expect(values).toContain(31);
    });
    it('should restore the previous limit when getOne fails', async ()=>{
        const failingBuilder = new _workspaceselectquerybuilder.WorkspaceSelectQueryBuilder('person', {
            tableShape: _workspaceselectquerybuildertestshapesutil.personTableShape,
            executor: {
                execute: async ()=>{
                    throw new Error('connection lost');
                }
            },
            objectRecordsPermissions: {},
            tableShapeByObjectMetadataId: ()=>_workspaceselectquerybuildertestshapesutil.companyTableShape,
            onBeforeExecute: ()=>undefined,
            formatResult: (records)=>records
        });
        failingBuilder.setFindOptions({
            select: {
                id: true
            }
        });
        failingBuilder.limit(25);
        await expect(failingBuilder.getOne()).rejects.toThrow('connection lost');
        expect(failingBuilder.getQueryAndParameters()[1]).toEqual([
            25
        ]);
    });
    it('should return every raw row from getRawMany', async ()=>{
        const { queryBuilder, executedStatements } = (0, _workspaceselectquerybuildertestshapesutil.buildQueryBuilder)({
            rows: [
                {
                    companyId: 'c1',
                    totalCount: '3'
                },
                {
                    companyId: 'c2',
                    totalCount: '1'
                }
            ]
        });
        queryBuilder.select([]).addSelect('COUNT(*)', 'totalCount').addSelect('"person"."companyId"', 'companyId').groupBy('"person"."companyId"');
        const rows = await queryBuilder.getRawMany();
        expect(rows).toEqual([
            {
                companyId: 'c1',
                totalCount: '3'
            },
            {
                companyId: 'c2',
                totalCount: '1'
            }
        ]);
        expect(executedStatements[0].text).toContain('GROUP BY "person"."companyId"');
    });
});

//# sourceMappingURL=workspace-select-query-builder-selection.spec.js.map