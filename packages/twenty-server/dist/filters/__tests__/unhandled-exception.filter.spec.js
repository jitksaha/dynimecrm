// oxlint-disable twenty/graphql-resolvers-should-be-guarded
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _common = require("@nestjs/common");
const _core = require("@nestjs/core");
const _graphql = require("@nestjs/graphql");
const _testing = require("@nestjs/testing");
const _nestjs = require("@graphql-yoga/nestjs");
const _graphql1 = require("graphql");
const _graphqlerrorsutil = require("../../engine/core-modules/graphql/utils/graphql-errors.util");
const _permissionsexception = require("../../engine/metadata-modules/permissions/permissions.exception");
const _permissionsgraphqlapiexceptionfilter = require("../../engine/metadata-modules/permissions/utils/permissions-graphql-api-exception.filter");
const _unhandledexceptionfilter = require("../unhandled-exception.filter");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let DenyPermissionGuard = class DenyPermissionGuard {
    canActivate() {
        throw new _permissionsexception.PermissionsException(_permissionsexception.PermissionsExceptionMessage.PERMISSION_DENIED, _permissionsexception.PermissionsExceptionCode.PERMISSION_DENIED, {
            userFriendlyMessage: /*i18n*/ {
                id: "G768/0",
                message: "denied"
            }
        });
    }
};
DenyPermissionGuard = _ts_decorate([
    (0, _common.Injectable)()
], DenyPermissionGuard);
let TestResolver = class TestResolver {
    ping() {
        return 'pong';
    }
    guardedMutation() {
        return 'ok';
    }
};
_ts_decorate([
    (0, _graphql.Query)(()=>String),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", []),
    _ts_metadata("design:returntype", String)
], TestResolver.prototype, "ping", null);
_ts_decorate([
    (0, _graphql.Mutation)(()=>String),
    (0, _common.UseGuards)(DenyPermissionGuard),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", []),
    _ts_metadata("design:returntype", String)
], TestResolver.prototype, "guardedMutation", null);
TestResolver = _ts_decorate([
    (0, _graphql.Resolver)()
], TestResolver);
// mirrors CoreEngineModule / MetadataEngineModule: a feature module that
// registers a typed GraphQL exception filter
let FeatureModule = class FeatureModule {
};
FeatureModule = _ts_decorate([
    (0, _common.Module)({
        providers: [
            TestResolver,
            {
                provide: _core.APP_FILTER,
                useClass: _permissionsgraphqlapiexceptionfilter.PermissionsGraphqlApiExceptionFilter
            }
        ]
    })
], FeatureModule);
let RootModuleWithAppFilter = class RootModuleWithAppFilter {
};
RootModuleWithAppFilter = _ts_decorate([
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
], RootModuleWithAppFilter);
let RootModuleWithoutAppFilter = class RootModuleWithoutAppFilter {
};
RootModuleWithoutAppFilter = _ts_decorate([
    (0, _common.Module)({
        imports: [
            _graphql.GraphQLModule.forRoot({
                driver: _nestjs.YogaDriver,
                autoSchemaFile: true
            }),
            FeatureModule
        ]
    })
], RootModuleWithoutAppFilter);
const buildSchema = async (rootModule, registerFilterAtBootstrap)=>{
    const moduleRef = await _testing.Test.createTestingModule({
        // oxlint-disable-next-line typescript/no-explicit-any
        imports: [
            rootModule
        ]
    }).compile();
    const app = moduleRef.createNestApplication();
    if (registerFilterAtBootstrap) {
        app.useGlobalFilters(new _unhandledexceptionfilter.UnhandledExceptionFilter());
    }
    await app.init();
    const schema = app.get(_graphql.GraphQLSchemaHost).schema;
    return {
        app,
        schema
    };
};
const runGuardedMutation = (schema)=>(0, _graphql1.graphql)({
        schema,
        source: 'mutation { guardedMutation }'
    });
describe('UnhandledExceptionFilter global registration', ()=>{
    it('lets typed GraphQL filters convert the exception when registered through APP_FILTER on the root module', async ()=>{
        const { app, schema } = await buildSchema(RootModuleWithAppFilter, false);
        const result = await runGuardedMutation(schema);
        expect(result.errors?.[0]?.extensions?.code).toBe(_graphqlerrorsutil.ErrorCode.FORBIDDEN);
        expect(result.errors?.[0]?.message).toBe(_permissionsexception.PermissionsExceptionMessage.PERMISSION_DENIED);
        await app.close();
    });
    // guards against reintroducing app.useGlobalFilters(new UnhandledExceptionFilter()):
    // Nest checks global filters in reverse registration order and selects a single
    // one, so a catch-all registered after bootstrap shadows every typed filter
    it('shadows typed GraphQL filters when registered through app.useGlobalFilters', async ()=>{
        const { app, schema } = await buildSchema(RootModuleWithoutAppFilter, true);
        const result = await runGuardedMutation(schema);
        expect(result.errors?.[0]?.extensions?.code).toBeUndefined();
        expect(result.errors?.[0]?.originalError).toBeInstanceOf(_permissionsexception.PermissionsException);
        await app.close();
    });
});

//# sourceMappingURL=unhandled-exception.filter.spec.js.map