// oxlint-disable twenty/graphql-resolvers-should-be-guarded
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "runGuardedQuery", {
    enumerable: true,
    get: function() {
        return runGuardedQuery;
    }
});
const _common = require("@nestjs/common");
const _core = require("@nestjs/core");
const _graphql = require("@nestjs/graphql");
const _testing = require("@nestjs/testing");
const _nestjs = require("@graphql-yoga/nestjs");
const _graphql1 = require("graphql");
const _unhandledexceptionfilter = require("../../../filters/unhandled-exception.filter");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
const runGuardedQuery = async ({ guard, request })=>{
    let TestResolver = class TestResolver {
        guardedQuery() {
            return 'ok';
        }
    };
    _ts_decorate([
        (0, _graphql.Query)(()=>String),
        (0, _common.UseGuards)(guard),
        _ts_metadata("design:type", Function),
        _ts_metadata("design:paramtypes", []),
        _ts_metadata("design:returntype", String)
    ], TestResolver.prototype, "guardedQuery", null);
    TestResolver = _ts_decorate([
        (0, _graphql.Resolver)()
    ], TestResolver);
    let FeatureModule = class FeatureModule {
    };
    FeatureModule = _ts_decorate([
        (0, _common.Module)({
            providers: [
                TestResolver
            ]
        })
    ], FeatureModule);
    let RootModule = class RootModule {
    };
    RootModule = _ts_decorate([
        (0, _common.Module)({
            imports: [
                _graphql.GraphQLModule.forRoot({
                    driver: _nestjs.YogaDriver,
                    autoSchemaFile: true
                }),
                FeatureModule
            ],
            providers: [
                {
                    provide: _core.APP_FILTER,
                    useClass: _unhandledexceptionfilter.UnhandledExceptionFilter
                }
            ]
        })
    ], RootModule);
    const moduleRef = await _testing.Test.createTestingModule({
        imports: [
            RootModule
        ]
    }).compile();
    const app = moduleRef.createNestApplication();
    await app.init();
    const schema = app.get(_graphql.GraphQLSchemaHost).schema;
    const result = await (0, _graphql1.graphql)({
        schema,
        source: '{ guardedQuery }',
        contextValue: {
            req: request
        }
    });
    await app.close();
    return result;
};

//# sourceMappingURL=run-guarded-query.test-util.js.map