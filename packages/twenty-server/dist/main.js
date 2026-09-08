"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _core = require("@nestjs/core");
const _fs = /*#__PURE__*/ _interop_require_default(require("fs"));
const _util = require("util");
const _bytes = /*#__PURE__*/ _interop_require_default(require("bytes"));
const _classvalidator = require("class-validator");
const _expresssession = /*#__PURE__*/ _interop_require_default(require("express-session"));
const _graphqlUploadExpress = /*#__PURE__*/ _interop_require_default(require("graphql-upload/graphqlUploadExpress.mjs"));
const _types = require("twenty-shared/types");
const _nodeenvironmentinterface = require("./engine/core-modules/twenty-config/interfaces/node-environment.interface");
const _setpgdatetypeparser = require("./database/pg/set-pg-date-type-parser");
const _exceptionhandlerservice = require("./engine/core-modules/exception-handler/exception-handler.service");
const _loggerservice = require("./engine/core-modules/logger/logger.service");
const _sessionstoragemodulefactory = require("./engine/core-modules/session-storage/session-storage.module-factory");
const _twentyconfigservice = require("./engine/core-modules/twenty-config/twenty-config.service");
const _configtransformersutil = require("./engine/core-modules/twenty-config/utils/config-transformers.util");
const _usagerecorderservice = require("./engine/core-modules/usage/services/usage-recorder.service");
const _applycredentialedcorsutil = require("./engine/core-modules/user-session/utils/apply-credentialed-cors.util");
const _globalexceptionhandlerutil = require("./engine/utils/global-exception-handler.util");
const _appmodule = require("./app.module");
require("./instrument");
const _settings = require("./engine/constants/settings");
const _enablevalidationmetadatacacheutil = require("./utils/enable-validation-metadata-cache.util");
const _generatefrontconfig = require("./utils/generate-front-config");
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
const bootstrap = async ()=>{
    (0, _enablevalidationmetadatacacheutil.enableValidationMetadataCache)();
    (0, _setpgdatetypeparser.setPgDateTypeParser)();
    const app = await _core.NestFactory.create(_appmodule.AppModule, {
        bufferLogs: process.env.LOGGER_IS_BUFFER_ENABLED === 'true',
        rawBody: true,
        snapshot: process.env.NODE_ENV === _nodeenvironmentinterface.NodeEnvironment.DEVELOPMENT,
        ...process.env.SSL_KEY_PATH && process.env.SSL_CERT_PATH ? {
            httpsOptions: {
                key: _fs.default.readFileSync(process.env.SSL_KEY_PATH),
                cert: _fs.default.readFileSync(process.env.SSL_CERT_PATH)
            }
        } : {}
    });
    const logger = app.get(_loggerservice.LoggerService);
    const twentyConfigService = app.get(_twentyconfigservice.TwentyConfigService);
    const exceptionHandlerService = app.get(_exceptionhandlerservice.ExceptionHandlerService);
    process.on('unhandledRejection', (reason)=>{
        const error = reason instanceof Error ? reason : new Error(typeof reason === 'string' ? reason : (0, _util.inspect)(reason));
        if ((0, _globalexceptionhandlerutil.shouldCaptureException)(error)) {
            exceptionHandlerService.captureExceptions([
                error
            ]);
        }
    });
    const trustProxyRaw = twentyConfigService.get('TRUST_PROXY');
    const trustProxy = /^\d+$/.test(trustProxyRaw) ? Number(trustProxyRaw) : _configtransformersutil.configTransformers.boolean(trustProxyRaw) ?? trustProxyRaw;
    app.set('trust proxy', trustProxy);
    (0, _applycredentialedcorsutil.applyCredentialedCors)(app, twentyConfigService);
    app.use((0, _expresssession.default)((0, _sessionstoragemodulefactory.getSessionStorageOptions)(twentyConfigService)));
    // Apply class-validator container so that we can use injection in validators
    (0, _classvalidator.useContainer)(app.select(_appmodule.AppModule), {
        fallbackOnErrors: true
    });
    app.useLogger(logger);
    app.useBodyParser('json', {
        limit: _settings.settings.storage.maxFileSize
    });
    app.useBodyParser('urlencoded', {
        limit: _settings.settings.storage.maxFileSize,
        extended: true
    });
    app.useBodyParser('text', {
        type: 'text/plain',
        limit: '1024kb'
    });
    app.use(`/${_types.ApiPath.GraphQL}`, (0, _graphqlUploadExpress.default)({
        maxFieldSize: (0, _bytes.default)(_settings.settings.storage.maxFileSize),
        maxFiles: 10
    }));
    app.use(`/${_types.ApiPath.Metadata}`, (0, _graphqlUploadExpress.default)({
        maxFieldSize: (0, _bytes.default)(_settings.settings.storage.maxFileSize),
        maxFiles: 10
    }));
    (0, _generatefrontconfig.generateFrontConfig)();
    const keepAliveTimeout = twentyConfigService.get('SERVER_KEEP_ALIVE_TIMEOUT_MS');
    const httpServer = app.getHttpServer();
    httpServer.keepAliveTimeout = keepAliveTimeout;
    httpServer.headersTimeout = keepAliveTimeout + 1000;
    const usageRecorder = app.get(_usagerecorderservice.UsageRecorderService);
    for (const signal of [
        'SIGTERM',
        'SIGINT'
    ]){
        process.once(signal, ()=>{
            void usageRecorder.flushAndStop().finally(()=>process.exit(0));
        });
    }
    await app.listen(twentyConfigService.get('NODE_PORT'));
};
void bootstrap();

//# sourceMappingURL=main.js.map