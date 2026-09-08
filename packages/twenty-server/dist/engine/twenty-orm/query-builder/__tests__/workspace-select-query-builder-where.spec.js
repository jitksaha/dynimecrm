"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _typeorm = require("typeorm");
const _twentyormexception = require("../../exceptions/twenty-orm.exception");
const _workspaceselectquerybuildertestshapesutil = require("./workspace-select-query-builder-test-shapes.util");
describe('WorkspaceSelectQueryBuilder where', ()=>{
    it('should nest a bracketed condition built by the shared parsers', ()=>{
        const { queryBuilder } = (0, _workspaceselectquerybuildertestshapesutil.buildQueryBuilder)();
        queryBuilder.setFindOptions({
            select: {
                id: true
            }
        });
        queryBuilder.andWhere({
            whereFactory: (nested)=>{
                nested.where('"person"."id" = :a', {
                    a: 1
                });
                nested.orWhere('"person"."id" = :b', {
                    b: 2
                });
            }
        });
        const [text, values] = queryBuilder.getQueryAndParameters();
        expect(text).toContain('(("person"."id" = $1) OR ("person"."id" = $2))');
        expect(values).toEqual([
            1,
            2
        ]);
    });
    it('should negate a NotBrackets group instead of rendering it as a plain group', ()=>{
        const { queryBuilder } = (0, _workspaceselectquerybuildertestshapesutil.buildQueryBuilder)();
        const notBrackets = {
            '@instanceof': Symbol.for('NotBrackets'),
            whereFactory: (nested)=>{
                nested.where('"person"."nameFirstName" = \'Ada\'');
            }
        };
        queryBuilder.setFindOptions({
            select: {
                id: true
            }
        });
        queryBuilder.andWhere(notBrackets);
        expect(queryBuilder.getQuery()).toContain('NOT (("person"."nameFirstName" = \'Ada\'))');
    });
    it('should render a plain Brackets group without negation', ()=>{
        const { queryBuilder } = (0, _workspaceselectquerybuildertestshapesutil.buildQueryBuilder)();
        const brackets = {
            '@instanceof': Symbol.for('Brackets'),
            whereFactory: (nested)=>{
                nested.where('"person"."nameFirstName" = \'Ada\'');
            }
        };
        queryBuilder.setFindOptions({
            select: {
                id: true
            }
        });
        queryBuilder.andWhere(brackets);
        expect(queryBuilder.getQuery()).not.toContain('NOT (');
    });
    it('should keep the soft-delete predicate outside an OR chain', ()=>{
        const { queryBuilder } = (0, _workspaceselectquerybuildertestshapesutil.buildQueryBuilder)();
        queryBuilder.setFindOptions({
            select: {
                id: true
            }
        });
        queryBuilder.where('"person"."id" = :a', {
            a: 1
        });
        queryBuilder.orWhere('"person"."id" = :b', {
            b: 2
        });
        expect(queryBuilder.getQuery()).toContain('WHERE (("person"."id" = :a) OR ("person"."id" = :b)) AND "person"."deletedAt" IS NULL');
    });
    it('should quote bare alias.column references in raw where SQL', ()=>{
        const { queryBuilder } = (0, _workspaceselectquerybuildertestshapesutil.buildQueryBuilder)();
        queryBuilder.setFindOptions({
            select: {
                id: true
            }
        });
        queryBuilder.leftJoin('person.company', 'company');
        queryBuilder.where('company.name = :name', {
            name: 'Acme'
        });
        queryBuilder.andWhere('person.id IN (:...ids)', {
            ids: [
                'a'
            ]
        });
        const sql = queryBuilder.getQuery();
        expect(sql).toContain('("company"."name" = :name)');
        expect(sql).toContain('("person"."id" IN (:...ids))');
    });
    it('should not quote alias.column text inside string literals', ()=>{
        const { queryBuilder } = (0, _workspaceselectquerybuildertestshapesutil.buildQueryBuilder)();
        queryBuilder.setFindOptions({
            select: {
                id: true
            }
        });
        queryBuilder.leftJoin('person.company', 'company');
        queryBuilder.where('"person"."nameFirstName" = \'company.name\'');
        expect(queryBuilder.getQuery()).toContain('"person"."nameFirstName" = \'company.name\'');
    });
    it('should refuse a caller parameter that collides with a reserved name', ()=>{
        const { queryBuilder } = (0, _workspaceselectquerybuildertestshapesutil.buildQueryBuilder)();
        expect(()=>queryBuilder.andWhere('"person"."id" = :ormLimit', {
                ormLimit: 1
            })).toThrow(_twentyormexception.TwentyOrmException);
    });
    it('should render an object-literal where with In as a bound IN clause', ()=>{
        const { queryBuilder } = (0, _workspaceselectquerybuildertestshapesutil.buildQueryBuilder)();
        queryBuilder.setFindOptions({
            select: {
                id: true
            }
        }).where({
            id: (0, _typeorm.In)([
                'a',
                'b'
            ])
        });
        const [text, values] = queryBuilder.getQueryAndParameters();
        expect(text).toContain('"person"."id" IN ($1, $2)');
        expect(values).toEqual([
            'a',
            'b'
        ]);
    });
    it('should allocate unique parameter names across object-literal where clauses', ()=>{
        const { queryBuilder } = (0, _workspaceselectquerybuildertestshapesutil.buildQueryBuilder)();
        queryBuilder.setFindOptions({
            select: {
                id: true
            }
        }).where({
            id: (0, _typeorm.In)([
                'a'
            ])
        }).andWhere({
            companyId: (0, _typeorm.In)([
                'b'
            ])
        });
        const [, values] = queryBuilder.getQueryAndParameters();
        expect(values).toEqual([
            'a',
            'b'
        ]);
    });
    it('should reject an object-literal where on an unknown column', ()=>{
        const { queryBuilder } = (0, _workspaceselectquerybuildertestshapesutil.buildQueryBuilder)();
        expect(()=>queryBuilder.where({
                missing: (0, _typeorm.In)([
                    'x'
                ])
            })).toThrow(_twentyormexception.TwentyOrmException);
    });
    it('should render comparison operators in an object-literal where', ()=>{
        const { queryBuilder } = (0, _workspaceselectquerybuildertestshapesutil.buildQueryBuilder)();
        queryBuilder.setFindOptions({
            select: {
                id: true
            }
        });
        queryBuilder.where({
            nameFirstName: (0, _typeorm.LessThan)('x')
        });
        const [text, values] = queryBuilder.getQueryAndParameters();
        expect(text).toContain('"person"."nameFirstName" < $1');
        expect(values).toContain('x');
    });
    it('should combine operators with And', ()=>{
        const { queryBuilder } = (0, _workspaceselectquerybuildertestshapesutil.buildQueryBuilder)();
        queryBuilder.setFindOptions({
            select: {
                id: true
            }
        });
        queryBuilder.where({
            nameFirstName: (0, _typeorm.And)((0, _typeorm.LessThan)('z'), (0, _typeorm.Not)((0, _typeorm.Equal)('a')))
        });
        const [text] = queryBuilder.getQueryAndParameters();
        expect(text).toContain('("person"."nameFirstName" < $1 AND NOT ("person"."nameFirstName" = $2))');
    });
    it('should negate a nested operator with Not', ()=>{
        const { queryBuilder } = (0, _workspaceselectquerybuildertestshapesutil.buildQueryBuilder)();
        queryBuilder.setFindOptions({
            select: {
                id: true
            }
        });
        queryBuilder.where({
            id: (0, _typeorm.Not)((0, _typeorm.In)([
                'a',
                'b'
            ]))
        });
        const [text] = queryBuilder.getQueryAndParameters();
        expect(text).toContain('NOT ("person"."id" IN ($1, $2))');
    });
    it('should treat a plain value in an object-literal where as equality', ()=>{
        const { queryBuilder } = (0, _workspaceselectquerybuildertestshapesutil.buildQueryBuilder)();
        queryBuilder.setFindOptions({
            select: {
                id: true
            }
        }).where({
            companyId: 'company-1'
        });
        const [text, values] = queryBuilder.getQueryAndParameters();
        expect(text).toContain('("person"."companyId" = $1)');
        expect(values).toEqual([
            'company-1'
        ]);
    });
    it('should treat the Equal operator in an object-literal where as equality', ()=>{
        const { queryBuilder } = (0, _workspaceselectquerybuildertestshapesutil.buildQueryBuilder)();
        queryBuilder.setFindOptions({
            select: {
                id: true
            }
        }).where({
            companyId: (0, _typeorm.Equal)('company-1')
        });
        const [text, values] = queryBuilder.getQueryAndParameters();
        expect(text).toContain('("person"."companyId" = $1)');
        expect(values).toEqual([
            'company-1'
        ]);
    });
    it('should treat a null value in an object-literal where as IS NULL', ()=>{
        const { queryBuilder } = (0, _workspaceselectquerybuildertestshapesutil.buildQueryBuilder)();
        queryBuilder.setFindOptions({
            select: {
                id: true
            }
        }).where({
            companyId: null
        });
        expect(queryBuilder.getQuery()).toContain('("person"."companyId" IS NULL)');
    });
});

//# sourceMappingURL=workspace-select-query-builder-where.spec.js.map