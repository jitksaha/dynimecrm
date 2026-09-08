"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "AppModule", {
    enumerable: true,
    get: function() {
        return AppModule;
    }
});
const _common = require("@nestjs/common");
const _core = require("@nestjs/core");
const _graphql = require("@nestjs/graphql");
const _servestatic = require("@nestjs/serve-static");
const _fs = require("fs");
const _path = require("path");
const _nestjs = require("@graphql-yoga/nestjs");
const _setup = require("@sentry/nestjs/setup");
const _types = require("twenty-shared/types");
const _adminpanelgraphqlapimodule = require("./engine/api/graphql/admin-panel-graphql-api.module");
const _coregraphqlapimodule = require("./engine/api/graphql/core-graphql-api.module");
const _graphqlconfigmodule = require("./engine/api/graphql/graphql-config/graphql-config.module");
const _graphqlconfigservice = require("./engine/api/graphql/graphql-config/graphql-config.service");
const _metadatagraphqlapimodule = require("./engine/api/graphql/metadata-graphql-api.module");
const _mcpmethodguardmiddleware = require("./engine/api/mcp/middlewares/mcp-method-guard.middleware");
const _mcpmodule = require("./engine/api/mcp/mcp.module");
const _restapimodule = require("./engine/api/rest/rest-api.module");
const _workspaceauthcontextmiddleware = require("./engine/core-modules/auth/middlewares/workspace-auth-context.middleware");
const _metricsmodule = require("./engine/core-modules/metrics/metrics.module");
const _dataloadermodule = require("./engine/dataloaders/dataloader.module");
const _workspacemetadataversionmodule = require("./engine/metadata-modules/workspace-metadata-version/workspace-metadata-version.module");
const _apirequestcontextmiddleware = require("./engine/core-modules/usage/middlewares/api-request-context.middleware");
const _cookiesessioncsrfmiddleware = require("./engine/middlewares/cookie-session-csrf.middleware");
const _graphqlhydraterequestfromtokenmiddleware = require("./engine/middlewares/graphql-hydrate-request-from-token.middleware");
const _middlewaremodule = require("./engine/middlewares/middleware.module");
const _jwtmodule = require("./engine/core-modules/jwt/jwt.module");
const _usersessionmodule = require("./engine/core-modules/user-session/user-session.module");
const _restcoremiddleware = require("./engine/middlewares/rest-core.middleware");
const _twentyormmodule = require("./engine/twenty-orm/twenty-orm.module");
const _workspacecachestoragemodule = require("./engine/workspace-cache-storage/workspace-cache-storage.module");
const _unhandledexceptionfilter = require("./filters/unhandled-exception.filter");
const _modulesmodule = require("./modules/modules.module");
const _clickhousemodule = require("./database/clickhouse/clickhouse.module");
const _coreenginemodule = require("./engine/core-modules/core-engine.module");
const _i18nmodule = require("./engine/core-modules/i18n/i18n.module");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
// TODO: Remove this middleware when all the rest endpoints are migrated to TwentyORM
const MIGRATED_REST_METHODS = [
    _common.RequestMethod.DELETE,
    _common.RequestMethod.POST,
    _common.RequestMethod.PATCH,
    _common.RequestMethod.PUT,
    _common.RequestMethod.GET
];
let AppModule = class AppModule {
    static getConditionalModules() {
        const modules = [];
        const frontPath = (0, _path.join)(__dirname, 'front');
        if ((0, _fs.existsSync)(frontPath)) {
            modules.push(_servestatic.ServeStaticModule.forRoot({
                rootPath: frontPath
            }));
        }
        // Messaque Queue explorer only for sync driver
        // Maybe we don't need to conditionaly register the explorer, because we're creating a jobs module
        // that will expose classes that are only used in the queue worker
        return modules;
    }
    configure(consumer) {
        // Before any middleware that authenticates from the session cookie.
        consumer.apply(_cookiesessioncsrfmiddleware.CookieSessionCsrfMiddleware)// A cross-origin form post from the identity provider, authenticated on the
        // assertion rather than the cookie.
        .exclude({
            path: `${_types.ApiPath.Auth}/saml/callback/:identityProviderId`,
            method: _common.RequestMethod.POST
        }).forRoutes({
            path: '*path',
            method: _common.RequestMethod.ALL
        });
        consumer.apply(_apirequestcontextmiddleware.ApiRequestContextMiddleware, _graphqlhydraterequestfromtokenmiddleware.GraphQLHydrateRequestFromTokenMiddleware, _workspaceauthcontextmiddleware.WorkspaceAuthContextMiddleware).forRoutes({
            path: _types.ApiPath.GraphQL,
            method: _common.RequestMethod.ALL
        });
        consumer.apply(_graphqlhydraterequestfromtokenmiddleware.GraphQLHydrateRequestFromTokenMiddleware, _workspaceauthcontextmiddleware.WorkspaceAuthContextMiddleware).forRoutes({
            path: _types.ApiPath.Metadata,
            method: _common.RequestMethod.ALL
        });
        consumer.apply(_graphqlhydraterequestfromtokenmiddleware.GraphQLHydrateRequestFromTokenMiddleware, _workspaceauthcontextmiddleware.WorkspaceAuthContextMiddleware).forRoutes({
            path: _types.ApiPath.AdminPanel,
            method: _common.RequestMethod.ALL
        });
        consumer.apply(_apirequestcontextmiddleware.ApiRequestContextMiddleware, _mcpmethodguardmiddleware.McpMethodGuardMiddleware).forRoutes({
            path: _types.ApiPath.Mcp,
            method: _common.RequestMethod.ALL
        });
        for (const method of MIGRATED_REST_METHODS){
            consumer.apply(_apirequestcontextmiddleware.ApiRequestContextMiddleware, _restcoremiddleware.RestCoreMiddleware, _workspaceauthcontextmiddleware.WorkspaceAuthContextMiddleware).forRoutes({
                path: `${_types.ApiPath.Rest}/*path`,
                method
            });
        }
    }
};
AppModule = _ts_decorate([
    (0, _common.Module)({
        imports: [
            _setup.SentryModule.forRoot(),
            _graphql.GraphQLModule.forRootAsync({
                driver: _nestjs.YogaDriver,
                imports: [
                    _graphqlconfigmodule.GraphQLConfigModule,
                    _metricsmodule.MetricsModule,
                    _dataloadermodule.DataloaderModule
                ],
                useClass: _graphqlconfigservice.GraphQLConfigService
            }),
            _twentyormmodule.TwentyOrmModule,
            _clickhousemodule.ClickHouseModule,
            _coreenginemodule.CoreEngineModule,
            _modulesmodule.ModulesModule,
            // Needed for the user workspace middleware
            _workspacecachestoragemodule.WorkspaceCacheStorageModule,
            _coregraphqlapimodule.CoreGraphQLApiModule,
            _metadatagraphqlapimodule.MetadataGraphQLApiModule,
            _adminpanelgraphqlapimodule.AdminPanelGraphQLApiModule,
            _restapimodule.RestApiModule,
            _mcpmodule.McpModule,
            _middlewaremodule.MiddlewareModule,
            _jwtmodule.JwtModule,
            _usersessionmodule.UserSessionModule,
            _workspacemetadataversionmodule.WorkspaceMetadataVersionModule,
            _i18nmodule.I18nModule,
            ...AppModule.getConditionalModules()
        ],
        providers: [
            {
                provide: _core.APP_FILTER,
                useClass: _unhandledexceptionfilter.UnhandledExceptionFilter
            }
        ]
    })
], AppModule);

//# sourceMappingURL=app.module.js.map