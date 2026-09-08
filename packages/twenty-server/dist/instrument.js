"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _os = /*#__PURE__*/ _interop_require_default(require("os"));
const _process = /*#__PURE__*/ _interop_require_default(require("process"));
const _api = require("@opentelemetry/api");
const _exportermetricsotlphttp = require("@opentelemetry/exporter-metrics-otlp-http");
const _exporterprometheus = require("@opentelemetry/exporter-prometheus");
const _resources = require("@opentelemetry/resources");
const _sdkmetrics = require("@opentelemetry/sdk-metrics");
const _guards = require("@sniptt/guards");
const _node = /*#__PURE__*/ _interop_require_wildcard(require("@sentry/node"));
const _profilingnode = require("@sentry/profiling-node");
const _nodeenvironmentinterface = require("./engine/core-modules/twenty-config/interfaces/node-environment.interface");
const _interfaces = require("./engine/core-modules/exception-handler/interfaces");
const _meterdrivertype = require("./engine/core-modules/metrics/types/meter-driver.type");
const _parsearrayenvvar = require("./utils/parse-array-env-var");
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
function _getRequireWildcardCache(nodeInterop) {
    if (typeof WeakMap !== "function") return null;
    var cacheBabelInterop = new WeakMap();
    var cacheNodeInterop = new WeakMap();
    return (_getRequireWildcardCache = function(nodeInterop) {
        return nodeInterop ? cacheNodeInterop : cacheBabelInterop;
    })(nodeInterop);
}
function _interop_require_wildcard(obj, nodeInterop) {
    if (!nodeInterop && obj && obj.__esModule) {
        return obj;
    }
    if (obj === null || typeof obj !== "object" && typeof obj !== "function") {
        return {
            default: obj
        };
    }
    var cache = _getRequireWildcardCache(nodeInterop);
    if (cache && cache.has(obj)) {
        return cache.get(obj);
    }
    var newObj = {
        __proto__: null
    };
    var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;
    for(var key in obj){
        if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) {
            var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;
            if (desc && (desc.get || desc.set)) {
                Object.defineProperty(newObj, key, desc);
            } else {
                newObj[key] = obj[key];
            }
        }
    }
    newObj.default = obj;
    if (cache) {
        cache.set(obj, newObj);
    }
    return newObj;
}
const meterDrivers = (0, _parsearrayenvvar.parseArrayEnvVar)(_process.default.env.METER_DRIVER, Object.values(_meterdrivertype.MeterDriver), []);
const parseSampleRate = ({ value, fallback })=>{
    if (!(0, _guards.isNonEmptyString)(value?.trim())) {
        return fallback;
    }
    const parsed = Number(value);
    return Number.isFinite(parsed) && parsed >= 0 && parsed <= 1 ? parsed : fallback;
};
if (_process.default.env.EXCEPTION_HANDLER_DRIVER === _interfaces.ExceptionHandlerDriver.SENTRY) {
    const tracesSampleRate = parseSampleRate({
        value: _process.default.env.SENTRY_TRACES_SAMPLE_RATE,
        fallback: 0.1
    });
    _node.init({
        environment: _process.default.env.SENTRY_ENVIRONMENT,
        release: _process.default.env.APP_VERSION,
        dsn: _process.default.env.SENTRY_DSN,
        defaultIntegrations: _node.getDefaultIntegrations({
            tracesSampleRate
        }).filter((integration)=>integration.name !== 'Modules'),
        integrations: [
            _node.redisIntegration(),
            _node.httpIntegration(),
            _node.expressIntegration(),
            _node.graphqlIntegration(),
            _node.postgresIntegration(),
            _node.nodeRuntimeMetricsIntegration({
                collectionIntervalMs: 30_000,
                collect: {
                    cpuUtilization: false,
                    memHeapUsed: false,
                    memHeapTotal: false,
                    memRss: false,
                    eventLoopDelayP50: false,
                    eventLoopDelayP99: true,
                    eventLoopDelayMax: true,
                    eventLoopUtilization: true,
                    uptime: false
                }
            }),
            _node.vercelAIIntegration({
                recordInputs: true,
                recordOutputs: true
            }),
            (0, _profilingnode.nodeProfilingIntegration)()
        ],
        tracesSampleRate,
        tracesSampler: ({ name, inheritOrSampleWith })=>name.startsWith('ai.') ? 1 : inheritOrSampleWith(tracesSampleRate),
        profilesSampleRate: parseSampleRate({
            value: _process.default.env.SENTRY_PROFILES_SAMPLE_RATE,
            fallback: 0.01
        }),
        maxValueLength: 8192,
        sendDefaultPii: true,
        debug: _process.default.env.NODE_ENV === _nodeenvironmentinterface.NodeEnvironment.DEVELOPMENT,
        beforeSendSpan: (span)=>{
            const twentyContext = _node.getIsolationScope().getScopeData().contexts?.twenty;
            if (!twentyContext?.workspace_id) {
                return span;
            }
            span.data = {
                ...span.data,
                'twenty.workspace.id': twentyContext.workspace_id,
                ...twentyContext.user_workspace_id && {
                    'twenty.user_workspace.id': twentyContext.user_workspace_id
                }
            };
            return span;
        }
    });
}
const prometheusExporter = meterDrivers.includes(_meterdrivertype.MeterDriver.Prometheus) ? new _exporterprometheus.PrometheusExporter({
    port: 9464
}) : null;
const meterProvider = new _sdkmetrics.MeterProvider({
    resource: (0, _resources.resourceFromAttributes)({
        'service.name': _process.default.env.OTEL_SERVICE_NAME ?? 'twenty-server',
        'k8s.pod.name': _process.default.env.HOSTNAME ?? _os.default.hostname()
    }),
    readers: [
        ...meterDrivers.includes(_meterdrivertype.MeterDriver.Console) ? [
            new _sdkmetrics.PeriodicExportingMetricReader({
                exporter: new _sdkmetrics.ConsoleMetricExporter(),
                exportIntervalMillis: 10000
            })
        ] : [],
        ...meterDrivers.includes(_meterdrivertype.MeterDriver.OpenTelemetry) ? [
            new _sdkmetrics.PeriodicExportingMetricReader({
                exporter: new _exportermetricsotlphttp.OTLPMetricExporter({
                    url: _process.default.env.OTLP_COLLECTOR_METRICS_ENDPOINT_URL,
                    temporalityPreference: _sdkmetrics.AggregationTemporality.DELTA
                }),
                exportIntervalMillis: 10000
            })
        ] : [],
        ...prometheusExporter ? [
            prometheusExporter
        ] : []
    ]
});
_api.metrics.setGlobalMeterProvider(meterProvider);

//# sourceMappingURL=instrument.js.map