"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
}
_export(exports, {
    get ConfigVariables () {
        return ConfigVariables;
    },
    get validate () {
        return validate;
    }
});
const _common = require("@nestjs/common");
const _classtransformer = require("class-transformer");
const _classvalidator = require("class-validator");
const _constants = require("twenty-shared/constants");
const _utils = require("twenty-shared/utils");
const _logicfunctiondriverinterface = require("../logic-function/logic-function-drivers/interfaces/logic-function-driver.interface");
const _nodeenvironmentinterface = require("./interfaces/node-environment.interface");
const _supportinterface = require("./interfaces/support.interface");
const _interfaces = require("../captcha/interfaces");
const _codeinterpreterinterface = require("../code-interpreter/code-interpreter.interface");
const _dparegionenum = require("../dpa/enums/dpa-region.enum");
const _emaildriverenum = require("../email/enums/email-driver.enum");
const _emailingdomaindrivertype = require("../emailing-domain/drivers/types/emailing-domain-driver.type");
const _interfaces1 = require("../exception-handler/interfaces");
const _interfaces2 = require("../file-storage/interfaces");
const _interfaces3 = require("../logger/interfaces");
const _casttologlevelarraydecorator = require("./decorators/cast-to-log-level-array.decorator");
const _casttometerdriverdecorator = require("./decorators/cast-to-meter-driver.decorator");
const _casttopositivenumberdecorator = require("./decorators/cast-to-positive-number.decorator");
const _casttotypeormloglevelarraydecorator = require("./decorators/cast-to-typeorm-log-level-array.decorator");
const _casttouppersnakecasedecorator = require("./decorators/cast-to-upper-snake-case.decorator");
const _configvariablesmetadatadecorator = require("./decorators/config-variables-metadata.decorator");
const _isawsregiondecorator = require("./decorators/is-aws-region.decorator");
const _defaultworkspaceautologinwindowconstant = require("../auth/constants/default-workspace-auto-login-window.constant");
const _isnonnegativedurationdecorator = require("./decorators/is-non-negative-duration.decorator");
const _ispositivedurationdecorator = require("./decorators/is-positive-duration.decorator");
const _isoptionaloremptystringdecorator = require("./decorators/is-optional-or-empty-string.decorator");
const _isstrictlylowerthandecorator = require("./decorators/is-strictly-lower-than.decorator");
const _istwentysemverdecorator = require("./decorators/is-twenty-semver.decorator");
const _configvariabletypeenum = require("./enums/config-variable-type.enum");
const _configvariablesgroupenum = require("./enums/config-variables-group.enum");
const _twentyconfigexception = require("./twenty-config.exception");
const _loaddefaultmodelpreferencesutil = require("../../metadata-modules/ai/ai-models/utils/load-default-model-preferences.util");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let ConfigVariables = class ConfigVariables {
    constructor(){
        this.AUTH_PASSWORD_ENABLED = true;
        this.SIGN_IN_PREFILLED = false;
        this.IS_EMAIL_VERIFICATION_REQUIRED = false;
        this.OUTBOUND_HTTP_SAFE_MODE_ENABLED = true;
        this.WORKSPACE_SCHEMA_DDL_LOCKED = false;
        this.EMAIL_VERIFICATION_TOKEN_EXPIRES_IN = '1h';
        this.PASSWORD_RESET_TOKEN_EXPIRES_IN = '5m';
        this.CALENDAR_PROVIDER_GOOGLE_ENABLED = false;
        this.AUTH_GOOGLE_ENABLED = false;
        this.MESSAGING_PROVIDER_GMAIL_ENABLED = false;
        this.IS_CONNECTED_ACCOUNT_WEBHOOK_SUBSCRIPTION_ENABLED = false;
        this.IS_IMAP_SMTP_CALDAV_ENABLED = true;
        this.IS_IMAP_SMTP_CALDAV_CONNECTION_TEST_ENABLED = true;
        this.ALLOW_REQUESTS_TO_TWENTY_ICONS = true;
        this.AUTH_MICROSOFT_ENABLED = false;
        /**
   * @deprecated Use is now GA - record page layouts are always seeded
   */ this.SHOULD_SEED_STANDARD_RECORD_PAGE_LAYOUTS = true;
        this.MESSAGING_PROVIDER_MICROSOFT_ENABLED = false;
        this.MESSAGING_MESSAGES_GET_BATCH_SIZE = 400;
        this.CALENDAR_PROVIDER_MICROSOFT_ENABLED = false;
        this.ACCESS_TOKEN_EXPIRES_IN = '30m';
        this.WORKSPACE_AGNOSTIC_TOKEN_EXPIRES_IN = '30m';
        this.REFRESH_TOKEN_EXPIRES_IN = '60d';
        this.REFRESH_TOKEN_REUSE_GRACE_PERIOD = '1m';
        this.SESSION_ABSOLUTE_LIFETIME = '180d';
        this.SESSION_IDLE_TIMEOUT = '30d';
        this.WORKSPACE_AUTO_LOGIN_WINDOW = _defaultworkspaceautologinwindowconstant.DEFAULT_WORKSPACE_AUTO_LOGIN_WINDOW;
        this.AUTH_COOKIE_SAME_SITE = 'lax';
        this.AUTH_COOKIE_ALLOWED_ORIGINS = '';
        this.LOGIN_TOKEN_EXPIRES_IN = '15m';
        this.FILE_TOKEN_EXPIRES_IN = '1d';
        this.INVITATION_TOKEN_EXPIRES_IN = '30d';
        this.SHORT_TERM_TOKEN_EXPIRES_IN = '5m';
        this.APPLICATION_ACCESS_TOKEN_EXPIRES_IN = '30m';
        this.APPLICATION_REFRESH_TOKEN_EXPIRES_IN = '60d';
        this.PLAYGROUND_TOKEN_EXPIRES_IN = '2h';
        this.EMAIL_FROM_ADDRESS = 'noreply@yourdomain.com';
        this.EMAIL_FROM_NAME = 'Felix from Twenty';
        this.EMAIL_DRIVER = _emaildriverenum.EmailDriver.LOGGER;
        this.EMAIL_SMTP_NO_TLS = false;
        this.EMAIL_SMTP_PORT = 587;
        this.IS_WORKSPACE_CREATION_LIMITED_TO_SERVER_ADMINS = true;
        this.IS_FEATURE_FLAG_MANAGEMENT_ENABLED = false;
        this.DPA_DEPLOYMENT_REGION = _dparegionenum.DpaRegion.EU;
        this.STORAGE_TYPE = _interfaces2.StorageDriverType.LOCAL;
        this.STORAGE_LOCAL_PATH = '.local-storage';
        this.// TODO: default to true once validated in production
        STORAGE_S3_PRESIGNED_URL_ENABLED = false;
        this.STORAGE_S3_PRESIGNED_URL_EXPIRES_IN = 900;
        this.MAX_TARBALL_UPLOAD_SIZE_BYTES = 100 * 1024 * 1024;
        this.LOGIC_FUNCTION_TYPE = process.env.NODE_ENV === _nodeenvironmentinterface.NodeEnvironment.DEVELOPMENT ? _logicfunctiondriverinterface.LogicFunctionDriverType.LOCAL : _logicfunctiondriverinterface.LogicFunctionDriverType.DISABLED;
        this.LOGIC_FUNCTION_EXEC_THROTTLE_LIMIT = 1000;
        // milliseconds
        this.LOGIC_FUNCTION_EXEC_THROTTLE_TTL = 60_000;
        this.CODE_INTERPRETER_TYPE = process.env.NODE_ENV === _nodeenvironmentinterface.NodeEnvironment.DEVELOPMENT ? _codeinterpreterinterface.CodeInterpreterDriverType.LOCAL : _codeinterpreterinterface.CodeInterpreterDriverType.DISABLED;
        this.CODE_INTERPRETER_TIMEOUT_MS = 300_000;
        this.CODE_INTERPRETER_IDLE_TIMEOUT_MS = 300_000;
        this.CODE_INTERPRETER_SESSION_MAX_AGE_MS = 86_400_000;
        this.ANALYTICS_ENABLED = false;
        this.USAGE_ROLLUP_FLUSH_INTERVAL_MS = 60_000;
        this.TELEMETRY_ENABLED = true;
        this.TYPEORM_LOGGING = [
            'error'
        ];
        this.IS_BILLING_ENABLED = false;
        this.BILLING_FREE_TRIAL_WITH_CREDIT_CARD_DURATION_IN_DAYS = 30;
        this.BILLING_FREE_TRIAL_WITHOUT_CREDIT_CARD_DURATION_IN_DAYS = 7;
        this.BILLING_FREE_WORKFLOW_CREDITS_FOR_TRIAL_PERIOD_WITHOUT_CREDIT_CARD = 500_000;
        this.BILLING_FREE_WORKFLOW_CREDITS_FOR_TRIAL_PERIOD_WITH_CREDIT_CARD = 1_000_000;
        this.BILLING_TRIAL_WITHOUT_CREDIT_CARD_REMINDER_DAYS_BEFORE = 1;
        this.BILLING_TRIAL_WITH_CREDIT_CARD_REMINDER_DAYS_BEFORE = 7;
        this.BILLING_SUBSCRIPTION_RENEWAL_REMINDER_DAYS_BEFORE = 7;
        this.BILLING_USAGE_CAP_CLICKHOUSE_ENABLED = false;
        this.BILLING_ROLLOVER_TOTAL_CAP_MULTIPLIER = 2;
        this.BILLING_MAX_ADMIN_CREDIT_GRANT_MICRO = 1_000_000_000;
        this.ONBOARDING_IMPORT_CONTACTS_CREDITS_REWARD = 1_000_000;
        this.ONBOARDING_INVITE_TEAM_MAX_INVITES = 10;
        this.ONBOARDING_INVITE_TEAM_CREDITS_REWARD_PER_USER = 500_000;
        this.ONBOARDING_INSTALL_APPS_CREDITS_REWARD_PER_APP = 500_000;
        this.ONBOARDING_ENRICHMENT_CREDIT_REWARD_TIERS = {};
        this.DEFAULT_SUBDOMAIN = 'app';
        this.LOGGER_IS_BUFFER_ENABLED = true;
        this.EXCEPTION_HANDLER_DRIVER = _interfaces1.ExceptionHandlerDriver.CONSOLE;
        this.LOG_LEVELS = [
            'log',
            'error',
            'warn',
            'performance'
        ];
        this.METER_DRIVER = [];
        this.LOGGER_DRIVER = _interfaces3.LoggerDriverType.CONSOLE;
        this.SENTRY_FRONT_TRACES_SAMPLE_RATE = 0.1;
        this.SENTRY_TRACES_SAMPLE_RATE = 0.1;
        this.SENTRY_PROFILES_SAMPLE_RATE = 0.01;
        this.EVENT_SINKS = [
            'clickhouse'
        ];
        this.SUPPORT_DRIVER = _supportinterface.SupportDriver.NONE;
        this.PG_SSL_ALLOW_SELF_SIGNED = false;
        this.PG_POOL_MAX_CONNECTIONS = 10;
        this.PG_POOL_IDLE_TIMEOUT_MS = 600000;
        this.PG_POOL_ALLOW_EXIT_ON_IDLE = true;
        this.IS_CONFIG_VARIABLES_IN_DB_ENABLED = true;
        this.CACHE_STORAGE_TTL = 3600 * 24 * 7;
        this.WORKER_ENABLED_QUEUES = [];
        this.WORKER_EXCLUDED_QUEUES = [];
        this.NODE_ENV = _nodeenvironmentinterface.NodeEnvironment.PRODUCTION;
        this.NODE_PORT = 3000;
        this.SERVER_KEEP_ALIVE_TIMEOUT_MS = 65000;
        this.AI_STREAM_SHUTDOWN_DRAIN_MS = 300_000;
        this.SERVER_URL = 'http://localhost:3000';
        this.TRUST_PROXY = 'loopback, linklocal, uniquelocal';
        this.ENTERPRISE_INSTANCE_TYPE = _constants.ENTERPRISE_INSTANCE_TYPE.PRODUCTION;
        this.MARKETPLACE_CATALOG_SYNC_CRON_ENABLED = true;
        this.MUTATION_MAXIMUM_AFFECTED_RECORDS = 100;
        this.API_RATE_LIMITING_SHORT_TTL_IN_MS = 1000;
        this.API_RATE_LIMITING_SHORT_LIMIT = 100;
        this.API_RATE_LIMITING_LONG_TTL_IN_MS = 60_000;
        this.API_RATE_LIMITING_LONG_LIMIT = 100;
        this.APPLICATION_API_RATE_LIMITING_TTL_IN_MS = 60_000;
        this.APPLICATION_API_RATE_LIMITING_LIMIT = 500;
        this.EMAIL_SEND_RATE_LIMITING_TTL_IN_MS = 10_000;
        this.EMAIL_SEND_RATE_LIMITING_LIMIT = 100;
        this.APPLICATION_JOB_ENQUEUE_RATE_LIMITING_TTL_IN_MS = 60_000;
        this.APPLICATION_JOB_ENQUEUE_RATE_LIMITING_LIMIT = 500;
        this.APPLICATION_REGISTRATION_JOB_ENQUEUE_RATE_LIMITING_LIMIT = 2000;
        this.GRAPHQL_MAX_FIELDS = 2000;
        this.GRAPHQL_MAX_ROOT_RESOLVERS = 20;
        this.COMMON_QUERY_COMPLEXITY_LIMIT = 2000;
        this.INVITATION_SENDING_BY_WORKSPACE_THROTTLE_TTL_IN_MS = 604_800_000; // 7 days
        this.INVITATION_SENDING_BY_WORKSPACE_THROTTLE_LIMIT = 500;
        this.INVITATION_SENDING_BY_EMAIL_THROTTLE_TTL_IN_MS = 604_800_000; // 7 days
        this.INVITATION_SENDING_BY_EMAIL_THROTTLE_LIMIT = 10;
        this.AI_PROVIDERS = {};
        this.AI_MODELS_DEFAULT_FAST = _loaddefaultmodelpreferencesutil.DEFAULT_FAST_MODELS;
        this.AI_MODELS_DEFAULT_SMART = _loaddefaultmodelpreferencesutil.DEFAULT_SMART_MODELS;
        this.AI_MODELS_DEFAULT_RECOMMENDED = _loaddefaultmodelpreferencesutil.DEFAULT_RECOMMENDED_MODELS;
        this.AI_MODELS_DEFAULT_DISABLED = _loaddefaultmodelpreferencesutil.DEFAULT_DISABLED_MODELS;
        this.IS_MULTIWORKSPACE_ENABLED = false;
        this.WORKSPACE_INACTIVE_DAYS_BEFORE_NOTIFICATION = 7;
        this.WORKSPACE_INACTIVE_DAYS_BEFORE_SOFT_DELETION = 14;
        this.WORKSPACE_INACTIVE_DAYS_BEFORE_DELETION = 21;
        this.MAX_NUMBER_OF_WORKSPACES_DELETED_PER_EXECUTION = 5;
        this.WORKFLOW_EXEC_SOFT_THROTTLE_LIMIT = 100;
        this.WORKFLOW_EXEC_SOFT_THROTTLE_TTL = 60_000;
        this.WORKFLOW_EXEC_HARD_THROTTLE_LIMIT = 5000;
        this.WORKFLOW_EXEC_HARD_THROTTLE_TTL = 3_600_000; // 1 hour;
        this.ENTERPRISE_API_URL = 'https://twenty.com/api/enterprise';
        this.HEALTH_METRICS_TIME_WINDOW_IN_MINUTES = 5;
        this.IS_ATTACHMENT_PREVIEW_ENABLED = true;
        this.IS_MAPS_AND_ADDRESS_AUTOCOMPLETE_ENABLED = false;
        this.IS_ONBOARDING_AI_CHAT_ENABLED = false;
        this.EMAILING_DOMAIN_DRIVER = _emailingdomaindrivertype.EmailingDomainDriver.LOG;
        this.PG_DATABASE_PRIMARY_TIMEOUT_MS = 10000;
        this.PG_DATABASE_REPLICA_TIMEOUT_MS = 10000;
        this.SEARCH_ILIKE_FALLBACK_TIMEOUT_MS = 2000;
        this.APP_REGISTRY_URL = 'https://registry.npmjs.org';
        this.APP_REGISTRY_CDN_URL = 'https://unpkg.com';
    }
};
_ts_decorate([
    (0, _configvariablesmetadatadecorator.ConfigVariablesMetadata)({
        group: _configvariablesgroupenum.ConfigVariablesGroup.ADVANCED_SETTINGS,
        description: 'Enable or disable password authentication for users',
        type: _configvariabletypeenum.ConfigVariableType.BOOLEAN
    }),
    (0, _classvalidator.IsOptional)()
], ConfigVariables.prototype, "AUTH_PASSWORD_ENABLED", void 0);
_ts_decorate([
    (0, _configvariablesmetadatadecorator.ConfigVariablesMetadata)({
        group: _configvariablesgroupenum.ConfigVariablesGroup.ADVANCED_SETTINGS,
        description: 'Prefills tim@apple.dev in the login form, used in local development for quicker sign-in',
        type: _configvariabletypeenum.ConfigVariableType.BOOLEAN
    }),
    (0, _classvalidator.IsOptional)(),
    (0, _classvalidator.ValidateIf)((env)=>env.AUTH_PASSWORD_ENABLED)
], ConfigVariables.prototype, "SIGN_IN_PREFILLED", void 0);
_ts_decorate([
    (0, _configvariablesmetadatadecorator.ConfigVariablesMetadata)({
        group: _configvariablesgroupenum.ConfigVariablesGroup.ADVANCED_SETTINGS,
        description: 'Require email verification for user accounts',
        type: _configvariabletypeenum.ConfigVariableType.BOOLEAN
    }),
    (0, _classvalidator.IsOptional)()
], ConfigVariables.prototype, "IS_EMAIL_VERIFICATION_REQUIRED", void 0);
_ts_decorate([
    (0, _configvariablesmetadatadecorator.ConfigVariablesMetadata)({
        group: _configvariablesgroupenum.ConfigVariablesGroup.ADVANCED_SETTINGS,
        description: 'Enable safe mode for outbound requests (prevents private IPs and other security risks). Applies to HTTP workflow actions, webhooks, and IMAP/SMTP/CalDAV connections.',
        type: _configvariabletypeenum.ConfigVariableType.BOOLEAN
    }),
    (0, _classvalidator.IsOptional)()
], ConfigVariables.prototype, "OUTBOUND_HTTP_SAFE_MODE_ENABLED", void 0);
_ts_decorate([
    (0, _configvariablesmetadatadecorator.ConfigVariablesMetadata)({
        group: _configvariablesgroupenum.ConfigVariablesGroup.ADVANCED_SETTINGS,
        description: 'Lock workspace schema DDL changes (for hot upgrades). Blocks sign-up, workspace deletion, and all metadata schema changes.',
        isEnvOnly: true,
        type: _configvariabletypeenum.ConfigVariableType.BOOLEAN
    }),
    (0, _classvalidator.IsOptional)()
], ConfigVariables.prototype, "WORKSPACE_SCHEMA_DDL_LOCKED", void 0);
_ts_decorate([
    (0, _configvariablesmetadatadecorator.ConfigVariablesMetadata)({
        group: _configvariablesgroupenum.ConfigVariablesGroup.TOKENS_DURATION,
        description: 'Duration for which the email verification token is valid',
        type: _configvariabletypeenum.ConfigVariableType.STRING
    }),
    (0, _ispositivedurationdecorator.IsPositiveDuration)(),
    (0, _classvalidator.IsOptional)()
], ConfigVariables.prototype, "EMAIL_VERIFICATION_TOKEN_EXPIRES_IN", void 0);
_ts_decorate([
    (0, _configvariablesmetadatadecorator.ConfigVariablesMetadata)({
        group: _configvariablesgroupenum.ConfigVariablesGroup.TOKENS_DURATION,
        description: 'Duration for which the password reset token is valid',
        type: _configvariabletypeenum.ConfigVariableType.STRING
    }),
    (0, _ispositivedurationdecorator.IsPositiveDuration)(),
    (0, _classvalidator.IsOptional)()
], ConfigVariables.prototype, "PASSWORD_RESET_TOKEN_EXPIRES_IN", void 0);
_ts_decorate([
    (0, _configvariablesmetadatadecorator.ConfigVariablesMetadata)({
        group: _configvariablesgroupenum.ConfigVariablesGroup.GOOGLE_AUTH,
        description: 'Enable or disable the Google Calendar integration',
        type: _configvariabletypeenum.ConfigVariableType.BOOLEAN
    })
], ConfigVariables.prototype, "CALENDAR_PROVIDER_GOOGLE_ENABLED", void 0);
_ts_decorate([
    (0, _configvariablesmetadatadecorator.ConfigVariablesMetadata)({
        group: _configvariablesgroupenum.ConfigVariablesGroup.GOOGLE_AUTH,
        description: 'Callback URL for Google Auth APIs',
        type: _configvariabletypeenum.ConfigVariableType.STRING,
        isSensitive: false
    }),
    _ts_metadata("design:type", String)
], ConfigVariables.prototype, "AUTH_GOOGLE_APIS_CALLBACK_URL", void 0);
_ts_decorate([
    (0, _configvariablesmetadatadecorator.ConfigVariablesMetadata)({
        group: _configvariablesgroupenum.ConfigVariablesGroup.GOOGLE_AUTH,
        description: 'Enable or disable Google Single Sign-On (SSO)',
        type: _configvariabletypeenum.ConfigVariableType.BOOLEAN
    }),
    (0, _classvalidator.IsOptional)()
], ConfigVariables.prototype, "AUTH_GOOGLE_ENABLED", void 0);
_ts_decorate([
    (0, _configvariablesmetadatadecorator.ConfigVariablesMetadata)({
        group: _configvariablesgroupenum.ConfigVariablesGroup.GOOGLE_AUTH,
        isSensitive: false,
        description: 'Client ID for Google authentication',
        type: _configvariabletypeenum.ConfigVariableType.STRING
    }),
    (0, _classvalidator.ValidateIf)((env)=>env.AUTH_GOOGLE_ENABLED),
    _ts_metadata("design:type", String)
], ConfigVariables.prototype, "AUTH_GOOGLE_CLIENT_ID", void 0);
_ts_decorate([
    (0, _configvariablesmetadatadecorator.ConfigVariablesMetadata)({
        group: _configvariablesgroupenum.ConfigVariablesGroup.GOOGLE_AUTH,
        isSensitive: true,
        description: 'Client secret for Google authentication',
        type: _configvariabletypeenum.ConfigVariableType.STRING
    }),
    (0, _classvalidator.ValidateIf)((env)=>env.AUTH_GOOGLE_ENABLED),
    _ts_metadata("design:type", String)
], ConfigVariables.prototype, "AUTH_GOOGLE_CLIENT_SECRET", void 0);
_ts_decorate([
    (0, _configvariablesmetadatadecorator.ConfigVariablesMetadata)({
        group: _configvariablesgroupenum.ConfigVariablesGroup.GOOGLE_AUTH,
        isSensitive: false,
        description: 'Callback URL for Google authentication',
        type: _configvariabletypeenum.ConfigVariableType.STRING
    }),
    (0, _classvalidator.IsUrl)({
        require_tld: false,
        require_protocol: true
    }),
    (0, _classvalidator.ValidateIf)((env)=>env.AUTH_GOOGLE_ENABLED),
    _ts_metadata("design:type", String)
], ConfigVariables.prototype, "AUTH_GOOGLE_CALLBACK_URL", void 0);
_ts_decorate([
    (0, _configvariablesmetadatadecorator.ConfigVariablesMetadata)({
        group: _configvariablesgroupenum.ConfigVariablesGroup.GOOGLE_AUTH,
        description: 'Enable or disable the Gmail messaging integration',
        type: _configvariabletypeenum.ConfigVariableType.BOOLEAN
    })
], ConfigVariables.prototype, "MESSAGING_PROVIDER_GMAIL_ENABLED", void 0);
_ts_decorate([
    (0, _configvariablesmetadatadecorator.ConfigVariablesMetadata)({
        group: _configvariablesgroupenum.ConfigVariablesGroup.GOOGLE_AUTH,
        isSensitive: false,
        description: 'Google Cloud Pub/Sub topic that Gmail push notifications publish to ' + '(format: projects/<project>/topics/<topic>). Required for webhook-based Gmail sync.',
        type: _configvariabletypeenum.ConfigVariableType.STRING
    }),
    (0, _classvalidator.IsOptional)(),
    _ts_metadata("design:type", String)
], ConfigVariables.prototype, "MESSAGING_GMAIL_PUBSUB_TOPIC", void 0);
_ts_decorate([
    (0, _configvariablesmetadatadecorator.ConfigVariablesMetadata)({
        group: _configvariablesgroupenum.ConfigVariablesGroup.GOOGLE_AUTH,
        isSensitive: false,
        description: 'Service account email authorized to deliver Gmail Pub/Sub push ' + 'notifications. The signed OIDC token on each push is verified against ' + 'this email. Required for webhook-based Gmail sync.',
        type: _configvariabletypeenum.ConfigVariableType.STRING
    }),
    (0, _classvalidator.IsOptional)(),
    _ts_metadata("design:type", String)
], ConfigVariables.prototype, "MESSAGING_GMAIL_PUBSUB_VERIFICATION_EMAIL", void 0);
_ts_decorate([
    (0, _configvariablesmetadatadecorator.ConfigVariablesMetadata)({
        group: _configvariablesgroupenum.ConfigVariablesGroup.ADVANCED_SETTINGS,
        description: 'Enable webhook-based sync for connected accounts (provider push ' + 'notifications on top of polling). Requires publicly reachable ' + 'webhook endpoints.',
        type: _configvariabletypeenum.ConfigVariableType.BOOLEAN
    })
], ConfigVariables.prototype, "IS_CONNECTED_ACCOUNT_WEBHOOK_SUBSCRIPTION_ENABLED", void 0);
_ts_decorate([
    (0, _configvariablesmetadatadecorator.ConfigVariablesMetadata)({
        group: _configvariablesgroupenum.ConfigVariablesGroup.ADVANCED_SETTINGS,
        description: 'Enable or disable the IMAP messaging integration',
        type: _configvariabletypeenum.ConfigVariableType.BOOLEAN
    })
], ConfigVariables.prototype, "IS_IMAP_SMTP_CALDAV_ENABLED", void 0);
_ts_decorate([
    (0, _configvariablesmetadatadecorator.ConfigVariablesMetadata)({
        group: _configvariablesgroupenum.ConfigVariablesGroup.ADVANCED_SETTINGS,
        description: 'Enable or disable the connection test when saving IMAP/SMTP/CALDAV accounts',
        type: _configvariabletypeenum.ConfigVariableType.BOOLEAN
    }),
    (0, _classvalidator.IsOptional)()
], ConfigVariables.prototype, "IS_IMAP_SMTP_CALDAV_CONNECTION_TEST_ENABLED", void 0);
_ts_decorate([
    (0, _configvariablesmetadatadecorator.ConfigVariablesMetadata)({
        group: _configvariablesgroupenum.ConfigVariablesGroup.ADVANCED_SETTINGS,
        description: "Enable or disable requests to twenty-icons to get companies' icons",
        type: _configvariabletypeenum.ConfigVariableType.BOOLEAN
    })
], ConfigVariables.prototype, "ALLOW_REQUESTS_TO_TWENTY_ICONS", void 0);
_ts_decorate([
    (0, _configvariablesmetadatadecorator.ConfigVariablesMetadata)({
        group: _configvariablesgroupenum.ConfigVariablesGroup.MICROSOFT_AUTH,
        description: 'Enable or disable Microsoft authentication',
        type: _configvariabletypeenum.ConfigVariableType.BOOLEAN
    }),
    (0, _classvalidator.IsOptional)()
], ConfigVariables.prototype, "AUTH_MICROSOFT_ENABLED", void 0);
_ts_decorate([
    (0, _configvariablesmetadatadecorator.ConfigVariablesMetadata)({
        group: _configvariablesgroupenum.ConfigVariablesGroup.MICROSOFT_AUTH,
        isSensitive: false,
        description: 'Client ID for Microsoft authentication',
        type: _configvariabletypeenum.ConfigVariableType.STRING
    }),
    (0, _classvalidator.ValidateIf)((env)=>env.AUTH_MICROSOFT_ENABLED),
    _ts_metadata("design:type", String)
], ConfigVariables.prototype, "AUTH_MICROSOFT_CLIENT_ID", void 0);
_ts_decorate([
    (0, _configvariablesmetadatadecorator.ConfigVariablesMetadata)({
        group: _configvariablesgroupenum.ConfigVariablesGroup.MICROSOFT_AUTH,
        isSensitive: true,
        description: 'Client secret for Microsoft authentication',
        type: _configvariabletypeenum.ConfigVariableType.STRING
    }),
    (0, _classvalidator.ValidateIf)((env)=>env.AUTH_MICROSOFT_ENABLED),
    _ts_metadata("design:type", String)
], ConfigVariables.prototype, "AUTH_MICROSOFT_CLIENT_SECRET", void 0);
_ts_decorate([
    (0, _configvariablesmetadatadecorator.ConfigVariablesMetadata)({
        group: _configvariablesgroupenum.ConfigVariablesGroup.MICROSOFT_AUTH,
        isSensitive: false,
        description: 'Callback URL for Microsoft authentication',
        type: _configvariabletypeenum.ConfigVariableType.STRING
    }),
    (0, _classvalidator.IsUrl)({
        require_tld: false,
        require_protocol: true
    }),
    (0, _classvalidator.ValidateIf)((env)=>env.AUTH_MICROSOFT_ENABLED),
    _ts_metadata("design:type", String)
], ConfigVariables.prototype, "AUTH_MICROSOFT_CALLBACK_URL", void 0);
_ts_decorate([
    (0, _configvariablesmetadatadecorator.ConfigVariablesMetadata)({
        group: _configvariablesgroupenum.ConfigVariablesGroup.MICROSOFT_AUTH,
        isSensitive: false,
        description: 'Callback URL for Microsoft APIs',
        type: _configvariabletypeenum.ConfigVariableType.STRING
    }),
    (0, _classvalidator.IsUrl)({
        require_tld: false,
        require_protocol: true
    }),
    (0, _classvalidator.ValidateIf)((env)=>env.AUTH_MICROSOFT_ENABLED),
    _ts_metadata("design:type", String)
], ConfigVariables.prototype, "AUTH_MICROSOFT_APIS_CALLBACK_URL", void 0);
_ts_decorate([
    (0, _configvariablesmetadatadecorator.ConfigVariablesMetadata)({
        group: _configvariablesgroupenum.ConfigVariablesGroup.ADVANCED_SETTINGS,
        description: 'Deprecated - record page layouts are now always seeded (GA)',
        type: _configvariabletypeenum.ConfigVariableType.BOOLEAN
    }),
    (0, _classvalidator.IsOptional)()
], ConfigVariables.prototype, "SHOULD_SEED_STANDARD_RECORD_PAGE_LAYOUTS", void 0);
_ts_decorate([
    (0, _configvariablesmetadatadecorator.ConfigVariablesMetadata)({
        group: _configvariablesgroupenum.ConfigVariablesGroup.MICROSOFT_AUTH,
        description: 'Enable or disable the Microsoft messaging integration',
        type: _configvariabletypeenum.ConfigVariableType.BOOLEAN
    })
], ConfigVariables.prototype, "MESSAGING_PROVIDER_MICROSOFT_ENABLED", void 0);
_ts_decorate([
    (0, _configvariablesmetadatadecorator.ConfigVariablesMetadata)({
        group: _configvariablesgroupenum.ConfigVariablesGroup.ADVANCED_SETTINGS,
        description: 'Number of messages fetched per batch during message import, adjust incase of rate limiting caused by Gmail, Outlook or IMAP',
        type: _configvariabletypeenum.ConfigVariableType.NUMBER
    }),
    (0, _casttopositivenumberdecorator.CastToPositiveNumber)(),
    (0, _classvalidator.IsOptional)()
], ConfigVariables.prototype, "MESSAGING_MESSAGES_GET_BATCH_SIZE", void 0);
_ts_decorate([
    (0, _configvariablesmetadatadecorator.ConfigVariablesMetadata)({
        group: _configvariablesgroupenum.ConfigVariablesGroup.MICROSOFT_AUTH,
        description: 'Enable or disable the Microsoft Calendar integration',
        type: _configvariabletypeenum.ConfigVariableType.BOOLEAN
    })
], ConfigVariables.prototype, "CALENDAR_PROVIDER_MICROSOFT_ENABLED", void 0);
_ts_decorate([
    (0, _configvariablesmetadatadecorator.ConfigVariablesMetadata)({
        group: _configvariablesgroupenum.ConfigVariablesGroup.TOKENS_DURATION,
        description: 'Duration for which the access token is valid',
        type: _configvariabletypeenum.ConfigVariableType.STRING
    }),
    (0, _ispositivedurationdecorator.IsPositiveDuration)(),
    (0, _classvalidator.IsOptional)()
], ConfigVariables.prototype, "ACCESS_TOKEN_EXPIRES_IN", void 0);
_ts_decorate([
    (0, _configvariablesmetadatadecorator.ConfigVariablesMetadata)({
        group: _configvariablesgroupenum.ConfigVariablesGroup.TOKENS_DURATION,
        description: 'Duration for which the workspace agnostic token is valid',
        type: _configvariabletypeenum.ConfigVariableType.STRING
    }),
    (0, _ispositivedurationdecorator.IsPositiveDuration)(),
    (0, _classvalidator.IsOptional)()
], ConfigVariables.prototype, "WORKSPACE_AGNOSTIC_TOKEN_EXPIRES_IN", void 0);
_ts_decorate([
    (0, _configvariablesmetadatadecorator.ConfigVariablesMetadata)({
        group: _configvariablesgroupenum.ConfigVariablesGroup.TOKENS_DURATION,
        description: 'Duration for which the refresh token is valid',
        type: _configvariabletypeenum.ConfigVariableType.STRING
    }),
    (0, _classvalidator.IsOptional)()
], ConfigVariables.prototype, "REFRESH_TOKEN_EXPIRES_IN", void 0);
_ts_decorate([
    (0, _configvariablesmetadatadecorator.ConfigVariablesMetadata)({
        group: _configvariablesgroupenum.ConfigVariablesGroup.TOKENS_DURATION,
        description: 'Grace period allowing concurrent refresh token use (e.g. two tabs refreshing simultaneously). Reuse after this window triggers suspicious activity detection.',
        type: _configvariabletypeenum.ConfigVariableType.STRING
    }),
    (0, _isnonnegativedurationdecorator.IsNonNegativeDuration)(),
    (0, _classvalidator.IsOptional)()
], ConfigVariables.prototype, "REFRESH_TOKEN_REUSE_GRACE_PERIOD", void 0);
_ts_decorate([
    (0, _configvariablesmetadatadecorator.ConfigVariablesMetadata)({
        group: _configvariablesgroupenum.ConfigVariablesGroup.TOKENS_DURATION,
        description: 'Absolute lifetime of a cookie-based user session, set at sign-in and never extended',
        type: _configvariabletypeenum.ConfigVariableType.STRING
    }),
    (0, _ispositivedurationdecorator.IsPositiveDuration)(),
    (0, _classvalidator.IsOptional)()
], ConfigVariables.prototype, "SESSION_ABSOLUTE_LIFETIME", void 0);
_ts_decorate([
    (0, _configvariablesmetadatadecorator.ConfigVariablesMetadata)({
        group: _configvariablesgroupenum.ConfigVariablesGroup.TOKENS_DURATION,
        description: 'Duration of inactivity after which a cookie-based user session expires',
        type: _configvariabletypeenum.ConfigVariableType.STRING
    }),
    (0, _ispositivedurationdecorator.IsPositiveDuration)(),
    (0, _classvalidator.IsOptional)()
], ConfigVariables.prototype, "SESSION_IDLE_TIMEOUT", void 0);
_ts_decorate([
    (0, _configvariablesmetadatadecorator.ConfigVariablesMetadata)({
        group: _configvariablesgroupenum.ConfigVariablesGroup.TOKENS_DURATION,
        description: 'Window after authenticating on the workspace-agnostic domain during which a user-level session can still auto-login into a workspace without re-authenticating',
        type: _configvariabletypeenum.ConfigVariableType.STRING
    }),
    (0, _isnonnegativedurationdecorator.IsNonNegativeDuration)(),
    (0, _classvalidator.IsOptional)(),
    _ts_metadata("design:type", String)
], ConfigVariables.prototype, "WORKSPACE_AUTO_LOGIN_WINDOW", void 0);
_ts_decorate([
    (0, _configvariablesmetadatadecorator.ConfigVariablesMetadata)({
        group: _configvariablesgroupenum.ConfigVariablesGroup.ADVANCED_SETTINGS,
        description: 'SameSite attribute of the user session cookie. Use none only for split-origin deployments, behind https',
        type: _configvariabletypeenum.ConfigVariableType.STRING
    }),
    (0, _classvalidator.IsIn)([
        'lax',
        'strict',
        'none'
    ]),
    (0, _classvalidator.IsOptional)(),
    _ts_metadata("design:type", String)
], ConfigVariables.prototype, "AUTH_COOKIE_SAME_SITE", void 0);
_ts_decorate([
    (0, _configvariablesmetadatadecorator.ConfigVariablesMetadata)({
        group: _configvariablesgroupenum.ConfigVariablesGroup.ADVANCED_SETTINGS,
        description: 'Comma-separated list of extra origins allowed to send credentialed cross-origin requests (split-origin deployments)',
        type: _configvariabletypeenum.ConfigVariableType.STRING
    }),
    (0, _classvalidator.IsOptional)()
], ConfigVariables.prototype, "AUTH_COOKIE_ALLOWED_ORIGINS", void 0);
_ts_decorate([
    (0, _configvariablesmetadatadecorator.ConfigVariablesMetadata)({
        group: _configvariablesgroupenum.ConfigVariablesGroup.TOKENS_DURATION,
        description: 'Duration for which the login token is valid',
        type: _configvariabletypeenum.ConfigVariableType.STRING
    }),
    (0, _ispositivedurationdecorator.IsPositiveDuration)(),
    (0, _classvalidator.IsOptional)()
], ConfigVariables.prototype, "LOGIN_TOKEN_EXPIRES_IN", void 0);
_ts_decorate([
    (0, _configvariablesmetadatadecorator.ConfigVariablesMetadata)({
        group: _configvariablesgroupenum.ConfigVariablesGroup.TOKENS_DURATION,
        description: 'Duration for which the file token is valid',
        type: _configvariabletypeenum.ConfigVariableType.STRING
    }),
    (0, _ispositivedurationdecorator.IsPositiveDuration)(),
    (0, _classvalidator.IsOptional)()
], ConfigVariables.prototype, "FILE_TOKEN_EXPIRES_IN", void 0);
_ts_decorate([
    (0, _configvariablesmetadatadecorator.ConfigVariablesMetadata)({
        group: _configvariablesgroupenum.ConfigVariablesGroup.TOKENS_DURATION,
        description: 'Duration for which the invitation token is valid',
        type: _configvariabletypeenum.ConfigVariableType.STRING
    }),
    (0, _ispositivedurationdecorator.IsPositiveDuration)(),
    (0, _classvalidator.IsOptional)()
], ConfigVariables.prototype, "INVITATION_TOKEN_EXPIRES_IN", void 0);
_ts_decorate([
    (0, _configvariablesmetadatadecorator.ConfigVariablesMetadata)({
        group: _configvariablesgroupenum.ConfigVariablesGroup.TOKENS_DURATION,
        description: 'Duration for which the short-term token is valid',
        type: _configvariabletypeenum.ConfigVariableType.STRING
    })
], ConfigVariables.prototype, "SHORT_TERM_TOKEN_EXPIRES_IN", void 0);
_ts_decorate([
    (0, _configvariablesmetadatadecorator.ConfigVariablesMetadata)({
        group: _configvariablesgroupenum.ConfigVariablesGroup.TOKENS_DURATION,
        description: 'Duration for which an application access token is valid',
        type: _configvariabletypeenum.ConfigVariableType.STRING
    }),
    (0, _ispositivedurationdecorator.IsPositiveDuration)(),
    (0, _classvalidator.IsOptional)()
], ConfigVariables.prototype, "APPLICATION_ACCESS_TOKEN_EXPIRES_IN", void 0);
_ts_decorate([
    (0, _configvariablesmetadatadecorator.ConfigVariablesMetadata)({
        group: _configvariablesgroupenum.ConfigVariablesGroup.TOKENS_DURATION,
        description: 'Duration for which an application refresh token is valid',
        type: _configvariabletypeenum.ConfigVariableType.STRING
    }),
    (0, _ispositivedurationdecorator.IsPositiveDuration)(),
    (0, _classvalidator.IsOptional)()
], ConfigVariables.prototype, "APPLICATION_REFRESH_TOKEN_EXPIRES_IN", void 0);
_ts_decorate([
    (0, _configvariablesmetadatadecorator.ConfigVariablesMetadata)({
        group: _configvariablesgroupenum.ConfigVariablesGroup.TOKENS_DURATION,
        description: 'Duration for which a playground token (in-app REST/GraphQL playground bearer) is valid',
        type: _configvariabletypeenum.ConfigVariableType.STRING
    }),
    (0, _ispositivedurationdecorator.IsPositiveDuration)(),
    (0, _classvalidator.IsOptional)()
], ConfigVariables.prototype, "PLAYGROUND_TOKEN_EXPIRES_IN", void 0);
_ts_decorate([
    (0, _configvariablesmetadatadecorator.ConfigVariablesMetadata)({
        group: _configvariablesgroupenum.ConfigVariablesGroup.EMAIL_SETTINGS,
        description: 'Email address used as the sender for outgoing emails',
        type: _configvariabletypeenum.ConfigVariableType.STRING
    })
], ConfigVariables.prototype, "EMAIL_FROM_ADDRESS", void 0);
_ts_decorate([
    (0, _configvariablesmetadatadecorator.ConfigVariablesMetadata)({
        group: _configvariablesgroupenum.ConfigVariablesGroup.EMAIL_SETTINGS,
        description: 'Name used in the From header for outgoing emails',
        type: _configvariabletypeenum.ConfigVariableType.STRING
    })
], ConfigVariables.prototype, "EMAIL_FROM_NAME", void 0);
_ts_decorate([
    (0, _configvariablesmetadatadecorator.ConfigVariablesMetadata)({
        group: _configvariablesgroupenum.ConfigVariablesGroup.EMAIL_SETTINGS,
        description: 'Email driver to use for sending emails',
        type: _configvariabletypeenum.ConfigVariableType.ENUM,
        options: Object.values(_emaildriverenum.EmailDriver)
    }),
    (0, _casttouppersnakecasedecorator.CastToUpperSnakeCase)(),
    _ts_metadata("design:type", typeof _emaildriverenum.EmailDriver === "undefined" ? Object : _emaildriverenum.EmailDriver)
], ConfigVariables.prototype, "EMAIL_DRIVER", void 0);
_ts_decorate([
    (0, _configvariablesmetadatadecorator.ConfigVariablesMetadata)({
        group: _configvariablesgroupenum.ConfigVariablesGroup.EMAIL_SETTINGS,
        description: 'SMTP host for sending emails',
        type: _configvariabletypeenum.ConfigVariableType.STRING
    }),
    _ts_metadata("design:type", String)
], ConfigVariables.prototype, "EMAIL_SMTP_HOST", void 0);
_ts_decorate([
    (0, _configvariablesmetadatadecorator.ConfigVariablesMetadata)({
        group: _configvariablesgroupenum.ConfigVariablesGroup.EMAIL_SETTINGS,
        description: 'Use unsecure connection for SMTP',
        type: _configvariabletypeenum.ConfigVariableType.BOOLEAN
    }),
    (0, _classvalidator.IsOptional)()
], ConfigVariables.prototype, "EMAIL_SMTP_NO_TLS", void 0);
_ts_decorate([
    (0, _configvariablesmetadatadecorator.ConfigVariablesMetadata)({
        group: _configvariablesgroupenum.ConfigVariablesGroup.EMAIL_SETTINGS,
        description: 'SMTP port for sending emails',
        type: _configvariabletypeenum.ConfigVariableType.NUMBER
    }),
    (0, _casttopositivenumberdecorator.CastToPositiveNumber)()
], ConfigVariables.prototype, "EMAIL_SMTP_PORT", void 0);
_ts_decorate([
    (0, _configvariablesmetadatadecorator.ConfigVariablesMetadata)({
        group: _configvariablesgroupenum.ConfigVariablesGroup.EMAIL_SETTINGS,
        description: 'SMTP user for authentication',
        type: _configvariabletypeenum.ConfigVariableType.STRING,
        isSensitive: true
    }),
    _ts_metadata("design:type", String)
], ConfigVariables.prototype, "EMAIL_SMTP_USER", void 0);
_ts_decorate([
    (0, _configvariablesmetadatadecorator.ConfigVariablesMetadata)({
        group: _configvariablesgroupenum.ConfigVariablesGroup.EMAIL_SETTINGS,
        isSensitive: true,
        description: 'SMTP password for authentication',
        type: _configvariabletypeenum.ConfigVariableType.STRING
    }),
    _ts_metadata("design:type", String)
], ConfigVariables.prototype, "EMAIL_SMTP_PASSWORD", void 0);
_ts_decorate([
    (0, _configvariablesmetadatadecorator.ConfigVariablesMetadata)({
        group: _configvariablesgroupenum.ConfigVariablesGroup.ADVANCED_SETTINGS,
        description: 'When enabled, only server admins can create new workspaces, and signing up without a pending invitation or an approved access domain is refused. Ignored during initial setup when no workspace exists.',
        type: _configvariabletypeenum.ConfigVariableType.BOOLEAN
    }),
    (0, _classvalidator.IsOptional)()
], ConfigVariables.prototype, "IS_WORKSPACE_CREATION_LIMITED_TO_SERVER_ADMINS", void 0);
_ts_decorate([
    (0, _configvariablesmetadatadecorator.ConfigVariablesMetadata)({
        group: _configvariablesgroupenum.ConfigVariablesGroup.ADVANCED_SETTINGS,
        description: 'When enabled, server admins can toggle any feature flag for any workspace from the admin panel. Always enabled in development mode and when billing is enabled.',
        type: _configvariabletypeenum.ConfigVariableType.BOOLEAN
    }),
    (0, _classvalidator.IsOptional)()
], ConfigVariables.prototype, "IS_FEATURE_FLAG_MANAGEMENT_ENABLED", void 0);
_ts_decorate([
    (0, _configvariablesmetadatadecorator.ConfigVariablesMetadata)({
        group: _configvariablesgroupenum.ConfigVariablesGroup.SERVER_CONFIG,
        description: 'Deployment region that determines the DPA hosting location shown to customers. The Processor entity (Twenty.com PBC) and governing law (Delaware, USA) are the same for all regions. EU (default) = Frankfurt, Germany; US = United States. Must match where Customer Personal Data actually lives.',
        isHiddenInAdminPanel: true,
        type: _configvariabletypeenum.ConfigVariableType.ENUM,
        options: Object.values(_dparegionenum.DpaRegion),
        // Deployment-fixed: must mirror where data actually lives. Allowing a
        // runtime DB/admin override could advertise a hosting location that does
        // not match where data resides, so this is only configurable via
        // environment variable.
        isEnvOnly: true
    }),
    (0, _classvalidator.IsOptional)(),
    (0, _classvalidator.IsEnum)(_dparegionenum.DpaRegion),
    _ts_metadata("design:type", typeof _dparegionenum.DpaRegion === "undefined" ? Object : _dparegionenum.DpaRegion)
], ConfigVariables.prototype, "DPA_DEPLOYMENT_REGION", void 0);
_ts_decorate([
    (0, _configvariablesmetadatadecorator.ConfigVariablesMetadata)({
        group: _configvariablesgroupenum.ConfigVariablesGroup.STORAGE_CONFIG,
        description: 'Type of storage to use (local or S3)',
        type: _configvariabletypeenum.ConfigVariableType.ENUM,
        options: Object.values(_interfaces2.StorageDriverType)
    }),
    (0, _classvalidator.IsOptional)(),
    (0, _casttouppersnakecasedecorator.CastToUpperSnakeCase)(),
    _ts_metadata("design:type", typeof _interfaces2.StorageDriverType === "undefined" ? Object : _interfaces2.StorageDriverType)
], ConfigVariables.prototype, "STORAGE_TYPE", void 0);
_ts_decorate([
    (0, _configvariablesmetadatadecorator.ConfigVariablesMetadata)({
        group: _configvariablesgroupenum.ConfigVariablesGroup.STORAGE_CONFIG,
        description: 'Local path for storage when using local storage type',
        type: _configvariabletypeenum.ConfigVariableType.STRING
    }),
    (0, _classvalidator.ValidateIf)((env)=>env.STORAGE_TYPE === _interfaces2.StorageDriverType.LOCAL)
], ConfigVariables.prototype, "STORAGE_LOCAL_PATH", void 0);
_ts_decorate([
    (0, _configvariablesmetadatadecorator.ConfigVariablesMetadata)({
        group: _configvariablesgroupenum.ConfigVariablesGroup.STORAGE_CONFIG,
        description: 'Region of the S3 bucket (e.g. "eu-west-3" for AWS, or a provider-specific slug like "fr-par" for Scaleway). Required.',
        type: _configvariabletypeenum.ConfigVariableType.STRING
    }),
    (0, _classvalidator.ValidateIf)((env)=>env.STORAGE_TYPE === _interfaces2.StorageDriverType.S_3),
    (0, _classvalidator.IsString)(),
    (0, _classvalidator.IsNotEmpty)(),
    _ts_metadata("design:type", typeof AwsRegion === "undefined" ? Object : AwsRegion)
], ConfigVariables.prototype, "STORAGE_S3_REGION", void 0);
_ts_decorate([
    (0, _configvariablesmetadatadecorator.ConfigVariablesMetadata)({
        group: _configvariablesgroupenum.ConfigVariablesGroup.STORAGE_CONFIG,
        description: 'Name of the S3 bucket used for file storage. Required.',
        type: _configvariabletypeenum.ConfigVariableType.STRING
    }),
    (0, _classvalidator.ValidateIf)((env)=>env.STORAGE_TYPE === _interfaces2.StorageDriverType.S_3),
    _ts_metadata("design:type", String)
], ConfigVariables.prototype, "STORAGE_S3_NAME", void 0);
_ts_decorate([
    (0, _configvariablesmetadatadecorator.ConfigVariablesMetadata)({
        group: _configvariablesgroupenum.ConfigVariablesGroup.STORAGE_CONFIG,
        description: 'Custom S3 endpoint URL. Optional — only needed for S3-compatible services like MinIO (e.g. http://minio:9000). Omit for native AWS S3, where the SDK resolves the endpoint from the region automatically.',
        type: _configvariabletypeenum.ConfigVariableType.STRING
    }),
    (0, _classvalidator.ValidateIf)((env)=>env.STORAGE_TYPE === _interfaces2.StorageDriverType.S_3),
    (0, _classvalidator.IsOptional)(),
    _ts_metadata("design:type", String)
], ConfigVariables.prototype, "STORAGE_S3_ENDPOINT", void 0);
_ts_decorate([
    (0, _configvariablesmetadatadecorator.ConfigVariablesMetadata)({
        group: _configvariablesgroupenum.ConfigVariablesGroup.STORAGE_CONFIG,
        isSensitive: true,
        description: 'S3 access key ID. Optional — omit to use the default AWS credential chain (IAM role, instance profile, etc.).',
        type: _configvariabletypeenum.ConfigVariableType.STRING
    }),
    (0, _classvalidator.ValidateIf)((env)=>env.STORAGE_TYPE === _interfaces2.StorageDriverType.S_3),
    (0, _classvalidator.IsOptional)(),
    _ts_metadata("design:type", String)
], ConfigVariables.prototype, "STORAGE_S3_ACCESS_KEY_ID", void 0);
_ts_decorate([
    (0, _configvariablesmetadatadecorator.ConfigVariablesMetadata)({
        group: _configvariablesgroupenum.ConfigVariablesGroup.STORAGE_CONFIG,
        isSensitive: true,
        description: 'S3 secret access key. Required when STORAGE_S3_ACCESS_KEY_ID is set, ignored otherwise.',
        type: _configvariabletypeenum.ConfigVariableType.STRING
    }),
    (0, _classvalidator.ValidateIf)((env)=>env.STORAGE_TYPE === _interfaces2.StorageDriverType.S_3),
    (0, _classvalidator.IsOptional)(),
    _ts_metadata("design:type", String)
], ConfigVariables.prototype, "STORAGE_S3_SECRET_ACCESS_KEY", void 0);
_ts_decorate([
    (0, _configvariablesmetadatadecorator.ConfigVariablesMetadata)({
        group: _configvariablesgroupenum.ConfigVariablesGroup.STORAGE_CONFIG,
        description: 'When enabled, file downloads are 302-redirected to S3 presigned URLs and direct uploads go straight to S3 via presigned PUT URLs instead of being proxied through the server. Reduces server load and bandwidth. Requires a bucket CORS policy allowing PUT from the frontend origin.',
        type: _configvariabletypeenum.ConfigVariableType.BOOLEAN
    }),
    (0, _classvalidator.ValidateIf)((env)=>env.STORAGE_TYPE === _interfaces2.StorageDriverType.S_3),
    (0, _classvalidator.IsOptional)()
], ConfigVariables.prototype, "STORAGE_S3_PRESIGNED_URL_ENABLED", void 0);
_ts_decorate([
    (0, _configvariablesmetadatadecorator.ConfigVariablesMetadata)({
        group: _configvariablesgroupenum.ConfigVariablesGroup.STORAGE_CONFIG,
        description: 'Public S3 endpoint used for generating presigned URLs. Optional — only needed when STORAGE_S3_ENDPOINT is an internal address not reachable by browsers (e.g. http://minio:9000 in Docker). Set this to the publicly accessible equivalent (e.g. https://storage.example.com).',
        type: _configvariabletypeenum.ConfigVariableType.STRING
    }),
    (0, _classvalidator.ValidateIf)((env)=>env.STORAGE_TYPE === _interfaces2.StorageDriverType.S_3),
    (0, _classvalidator.IsOptional)(),
    _ts_metadata("design:type", String)
], ConfigVariables.prototype, "STORAGE_S3_PRESIGNED_URL_BASE", void 0);
_ts_decorate([
    (0, _configvariablesmetadatadecorator.ConfigVariablesMetadata)({
        group: _configvariablesgroupenum.ConfigVariablesGroup.STORAGE_CONFIG,
        description: 'TTL in seconds for S3 presigned URLs.',
        type: _configvariabletypeenum.ConfigVariableType.NUMBER
    }),
    (0, _classvalidator.ValidateIf)((env)=>env.STORAGE_TYPE === _interfaces2.StorageDriverType.S_3),
    (0, _casttopositivenumberdecorator.CastToPositiveNumber)(),
    (0, _classvalidator.IsOptional)(),
    _ts_metadata("design:type", Number)
], ConfigVariables.prototype, "STORAGE_S3_PRESIGNED_URL_EXPIRES_IN", void 0);
_ts_decorate([
    (0, _configvariablesmetadatadecorator.ConfigVariablesMetadata)({
        group: _configvariablesgroupenum.ConfigVariablesGroup.STORAGE_CONFIG,
        description: 'Maximum tarball upload size in bytes for application registration',
        type: _configvariabletypeenum.ConfigVariableType.NUMBER
    }),
    (0, _casttopositivenumberdecorator.CastToPositiveNumber)(),
    (0, _classvalidator.IsOptional)(),
    _ts_metadata("design:type", Number)
], ConfigVariables.prototype, "MAX_TARBALL_UPLOAD_SIZE_BYTES", void 0);
_ts_decorate([
    (0, _configvariablesmetadatadecorator.ConfigVariablesMetadata)({
        group: _configvariablesgroupenum.ConfigVariablesGroup.LOGIC_FUNCTION_CONFIG,
        description: 'Type of function execution (local or Lambda)',
        type: _configvariabletypeenum.ConfigVariableType.ENUM,
        options: Object.values(_logicfunctiondriverinterface.LogicFunctionDriverType)
    }),
    (0, _classvalidator.IsOptional)(),
    (0, _casttouppersnakecasedecorator.CastToUpperSnakeCase)(),
    _ts_metadata("design:type", typeof _logicfunctiondriverinterface.LogicFunctionDriverType === "undefined" ? Object : _logicfunctiondriverinterface.LogicFunctionDriverType)
], ConfigVariables.prototype, "LOGIC_FUNCTION_TYPE", void 0);
_ts_decorate([
    (0, _configvariablesmetadatadecorator.ConfigVariablesMetadata)({
        group: _configvariablesgroupenum.ConfigVariablesGroup.LOGIC_FUNCTION_CONFIG,
        description: 'Throttle limit for logic function execution',
        type: _configvariabletypeenum.ConfigVariableType.NUMBER
    }),
    (0, _casttopositivenumberdecorator.CastToPositiveNumber)()
], ConfigVariables.prototype, "LOGIC_FUNCTION_EXEC_THROTTLE_LIMIT", void 0);
_ts_decorate([
    (0, _configvariablesmetadatadecorator.ConfigVariablesMetadata)({
        group: _configvariablesgroupenum.ConfigVariablesGroup.LOGIC_FUNCTION_CONFIG,
        description: 'Time-to-live for logic function execution throttle',
        type: _configvariabletypeenum.ConfigVariableType.NUMBER
    }),
    (0, _casttopositivenumberdecorator.CastToPositiveNumber)()
], ConfigVariables.prototype, "LOGIC_FUNCTION_EXEC_THROTTLE_TTL", void 0);
_ts_decorate([
    (0, _configvariablesmetadatadecorator.ConfigVariablesMetadata)({
        group: _configvariablesgroupenum.ConfigVariablesGroup.LOGIC_FUNCTION_CONFIG,
        description: 'Region for AWS Lambda functions',
        type: _configvariabletypeenum.ConfigVariableType.STRING
    }),
    (0, _classvalidator.ValidateIf)((env)=>env.LOGIC_FUNCTION_TYPE === _logicfunctiondriverinterface.LogicFunctionDriverType.LAMBDA),
    (0, _isawsregiondecorator.IsAWSRegion)(),
    _ts_metadata("design:type", typeof AwsRegion === "undefined" ? Object : AwsRegion)
], ConfigVariables.prototype, "LOGIC_FUNCTION_LAMBDA_REGION", void 0);
_ts_decorate([
    (0, _configvariablesmetadatadecorator.ConfigVariablesMetadata)({
        group: _configvariablesgroupenum.ConfigVariablesGroup.LOGIC_FUNCTION_CONFIG,
        description: 'IAM role for AWS Lambda functions',
        type: _configvariabletypeenum.ConfigVariableType.STRING
    }),
    (0, _classvalidator.ValidateIf)((env)=>env.LOGIC_FUNCTION_TYPE === _logicfunctiondriverinterface.LogicFunctionDriverType.LAMBDA),
    _ts_metadata("design:type", String)
], ConfigVariables.prototype, "LOGIC_FUNCTION_LAMBDA_ROLE", void 0);
_ts_decorate([
    (0, _configvariablesmetadatadecorator.ConfigVariablesMetadata)({
        group: _configvariablesgroupenum.ConfigVariablesGroup.LOGIC_FUNCTION_CONFIG,
        description: 'Role to assume when hosting lambdas in dedicated AWS account',
        type: _configvariabletypeenum.ConfigVariableType.STRING
    }),
    (0, _classvalidator.ValidateIf)((env)=>env.LOGIC_FUNCTION_TYPE === _logicfunctiondriverinterface.LogicFunctionDriverType.LAMBDA),
    (0, _classvalidator.IsOptional)(),
    _ts_metadata("design:type", String)
], ConfigVariables.prototype, "LOGIC_FUNCTION_LAMBDA_SUBHOSTING_ROLE", void 0);
_ts_decorate([
    (0, _configvariablesmetadatadecorator.ConfigVariablesMetadata)({
        group: _configvariablesgroupenum.ConfigVariablesGroup.LOGIC_FUNCTION_CONFIG,
        isSensitive: true,
        description: 'Access key ID for AWS Lambda functions',
        type: _configvariabletypeenum.ConfigVariableType.STRING
    }),
    (0, _classvalidator.ValidateIf)((env)=>env.LOGIC_FUNCTION_TYPE === _logicfunctiondriverinterface.LogicFunctionDriverType.LAMBDA),
    (0, _classvalidator.IsOptional)(),
    _ts_metadata("design:type", String)
], ConfigVariables.prototype, "LOGIC_FUNCTION_LAMBDA_ACCESS_KEY_ID", void 0);
_ts_decorate([
    (0, _configvariablesmetadatadecorator.ConfigVariablesMetadata)({
        group: _configvariablesgroupenum.ConfigVariablesGroup.LOGIC_FUNCTION_CONFIG,
        isSensitive: true,
        description: 'Secret access key for AWS Lambda functions',
        type: _configvariabletypeenum.ConfigVariableType.STRING
    }),
    (0, _classvalidator.ValidateIf)((env)=>env.LOGIC_FUNCTION_TYPE === _logicfunctiondriverinterface.LogicFunctionDriverType.LAMBDA),
    (0, _classvalidator.IsOptional)(),
    _ts_metadata("design:type", String)
], ConfigVariables.prototype, "LOGIC_FUNCTION_LAMBDA_SECRET_ACCESS_KEY", void 0);
_ts_decorate([
    (0, _configvariablesmetadatadecorator.ConfigVariablesMetadata)({
        group: _configvariablesgroupenum.ConfigVariablesGroup.LOGIC_FUNCTION_CONFIG,
        description: 'S3 bucket for uploading Lambda layer zip files',
        type: _configvariabletypeenum.ConfigVariableType.STRING
    }),
    (0, _classvalidator.ValidateIf)((env)=>env.LOGIC_FUNCTION_TYPE === _logicfunctiondriverinterface.LogicFunctionDriverType.LAMBDA),
    (0, _classvalidator.IsOptional)(),
    _ts_metadata("design:type", String)
], ConfigVariables.prototype, "LOGIC_FUNCTION_LAMBDA_LAYER_BUCKET", void 0);
_ts_decorate([
    (0, _configvariablesmetadatadecorator.ConfigVariablesMetadata)({
        group: _configvariablesgroupenum.ConfigVariablesGroup.LOGIC_FUNCTION_CONFIG,
        description: 'AWS region of the S3 bucket for Lambda layer uploads (defaults to LOGIC_FUNCTION_LAMBDA_REGION)',
        type: _configvariabletypeenum.ConfigVariableType.STRING
    }),
    (0, _classvalidator.ValidateIf)((env)=>env.LOGIC_FUNCTION_TYPE === _logicfunctiondriverinterface.LogicFunctionDriverType.LAMBDA),
    (0, _classvalidator.IsOptional)(),
    (0, _isawsregiondecorator.IsAWSRegion)(),
    _ts_metadata("design:type", typeof AwsRegion === "undefined" ? Object : AwsRegion)
], ConfigVariables.prototype, "LOGIC_FUNCTION_LAMBDA_LAYER_BUCKET_REGION", void 0);
_ts_decorate([
    (0, _configvariablesmetadatadecorator.ConfigVariablesMetadata)({
        group: _configvariablesgroupenum.ConfigVariablesGroup.CODE_INTERPRETER_CONFIG,
        description: 'Code interpreter driver type - LOCAL for development (unsafe), E2B for sandboxed execution',
        type: _configvariabletypeenum.ConfigVariableType.STRING,
        options: Object.values(_codeinterpreterinterface.CodeInterpreterDriverType)
    }),
    (0, _classvalidator.IsOptional)(),
    (0, _casttouppersnakecasedecorator.CastToUpperSnakeCase)(),
    _ts_metadata("design:type", typeof _codeinterpreterinterface.CodeInterpreterDriverType === "undefined" ? Object : _codeinterpreterinterface.CodeInterpreterDriverType)
], ConfigVariables.prototype, "CODE_INTERPRETER_TYPE", void 0);
_ts_decorate([
    (0, _configvariablesmetadatadecorator.ConfigVariablesMetadata)({
        group: _configvariablesgroupenum.ConfigVariablesGroup.CODE_INTERPRETER_CONFIG,
        description: 'E2B API key for sandboxed code execution',
        type: _configvariabletypeenum.ConfigVariableType.STRING,
        isSensitive: true
    }),
    (0, _classvalidator.ValidateIf)((env)=>env.CODE_INTERPRETER_TYPE === _codeinterpreterinterface.CodeInterpreterDriverType.E_2_B),
    _ts_metadata("design:type", String)
], ConfigVariables.prototype, "E2B_API_KEY", void 0);
_ts_decorate([
    (0, _configvariablesmetadatadecorator.ConfigVariablesMetadata)({
        group: _configvariablesgroupenum.ConfigVariablesGroup.CODE_INTERPRETER_CONFIG,
        description: 'Timeout in milliseconds for code execution (default: 300000)',
        type: _configvariabletypeenum.ConfigVariableType.NUMBER
    }),
    (0, _classvalidator.IsOptional)(),
    (0, _casttopositivenumberdecorator.CastToPositiveNumber)()
], ConfigVariables.prototype, "CODE_INTERPRETER_TIMEOUT_MS", void 0);
_ts_decorate([
    (0, _configvariablesmetadatadecorator.ConfigVariablesMetadata)({
        group: _configvariablesgroupenum.ConfigVariablesGroup.CODE_INTERPRETER_CONFIG,
        description: 'Idle lifetime in milliseconds for a reused code interpreter sandbox; refreshed on each execution and reclaimed after this period of inactivity (default: 300000)',
        type: _configvariabletypeenum.ConfigVariableType.NUMBER
    }),
    (0, _classvalidator.IsOptional)(),
    (0, _casttopositivenumberdecorator.CastToPositiveNumber)()
], ConfigVariables.prototype, "CODE_INTERPRETER_IDLE_TIMEOUT_MS", void 0);
_ts_decorate([
    (0, _configvariablesmetadatadecorator.ConfigVariablesMetadata)({
        group: _configvariablesgroupenum.ConfigVariablesGroup.CODE_INTERPRETER_CONFIG,
        description: 'Maximum age in milliseconds a reused code interpreter sandbox is kept before garbage collection reclaims it; abandoned conversations are reclaimed after this period (default: 86400000)',
        type: _configvariabletypeenum.ConfigVariableType.NUMBER
    }),
    (0, _classvalidator.IsOptional)(),
    (0, _casttopositivenumberdecorator.CastToPositiveNumber)()
], ConfigVariables.prototype, "CODE_INTERPRETER_SESSION_MAX_AGE_MS", void 0);
_ts_decorate([
    (0, _configvariablesmetadatadecorator.ConfigVariablesMetadata)({
        group: _configvariablesgroupenum.ConfigVariablesGroup.ANALYTICS_CONFIG,
        description: 'Enable or disable analytics for telemetry',
        type: _configvariabletypeenum.ConfigVariableType.BOOLEAN
    }),
    (0, _classvalidator.IsOptional)()
], ConfigVariables.prototype, "ANALYTICS_ENABLED", void 0);
_ts_decorate([
    (0, _configvariablesmetadatadecorator.ConfigVariablesMetadata)({
        group: _configvariablesgroupenum.ConfigVariablesGroup.ANALYTICS_CONFIG,
        description: 'Clickhouse host for analytics',
        type: _configvariabletypeenum.ConfigVariableType.STRING,
        isSensitive: true
    }),
    (0, _classvalidator.IsOptional)(),
    (0, _classvalidator.IsUrl)({
        require_tld: false,
        allow_underscores: true
    }),
    (0, _classvalidator.ValidateIf)((env)=>env.ANALYTICS_ENABLED === true),
    _ts_metadata("design:type", String)
], ConfigVariables.prototype, "CLICKHOUSE_URL", void 0);
_ts_decorate([
    (0, _configvariablesmetadatadecorator.ConfigVariablesMetadata)({
        group: _configvariablesgroupenum.ConfigVariablesGroup.ANALYTICS_CONFIG,
        description: 'Interval in milliseconds between two flushes of the buffered usage rollups',
        type: _configvariabletypeenum.ConfigVariableType.NUMBER
    }),
    (0, _classvalidator.IsOptional)(),
    (0, _casttopositivenumberdecorator.CastToPositiveNumber)()
], ConfigVariables.prototype, "USAGE_ROLLUP_FLUSH_INTERVAL_MS", void 0);
_ts_decorate([
    (0, _configvariablesmetadatadecorator.ConfigVariablesMetadata)({
        group: _configvariablesgroupenum.ConfigVariablesGroup.LOGGING,
        description: 'Enable or disable telemetry logging',
        type: _configvariabletypeenum.ConfigVariableType.BOOLEAN
    }),
    (0, _classvalidator.IsOptional)()
], ConfigVariables.prototype, "TELEMETRY_ENABLED", void 0);
_ts_decorate([
    (0, _configvariablesmetadatadecorator.ConfigVariablesMetadata)({
        group: _configvariablesgroupenum.ConfigVariablesGroup.LOGGING,
        description: 'TypeORM logging options for development mode. Accepts comma-separated values: query, schema, error, warn, info, log, migration',
        type: _configvariabletypeenum.ConfigVariableType.ARRAY,
        options: [
            'query',
            'schema',
            'error',
            'warn',
            'info',
            'log',
            'migration'
        ]
    }),
    (0, _casttotypeormloglevelarraydecorator.CastToTypeORMLogLevelArray)(),
    (0, _classvalidator.IsOptional)(),
    _ts_metadata("design:type", typeof LoggerOptions === "undefined" ? Object : LoggerOptions)
], ConfigVariables.prototype, "TYPEORM_LOGGING", void 0);
_ts_decorate([
    (0, _configvariablesmetadatadecorator.ConfigVariablesMetadata)({
        group: _configvariablesgroupenum.ConfigVariablesGroup.BILLING_CONFIG,
        description: 'Enable or disable billing features',
        type: _configvariabletypeenum.ConfigVariableType.BOOLEAN
    }),
    (0, _classvalidator.IsOptional)()
], ConfigVariables.prototype, "IS_BILLING_ENABLED", void 0);
_ts_decorate([
    (0, _configvariablesmetadatadecorator.ConfigVariablesMetadata)({
        group: _configvariablesgroupenum.ConfigVariablesGroup.BILLING_CONFIG,
        description: 'Link required for billing plan',
        type: _configvariabletypeenum.ConfigVariableType.STRING
    }),
    (0, _classvalidator.ValidateIf)((env)=>env.IS_BILLING_ENABLED === true),
    _ts_metadata("design:type", String)
], ConfigVariables.prototype, "BILLING_PLAN_REQUIRED_LINK", void 0);
_ts_decorate([
    (0, _configvariablesmetadatadecorator.ConfigVariablesMetadata)({
        group: _configvariablesgroupenum.ConfigVariablesGroup.BILLING_CONFIG,
        description: 'Duration of free trial with credit card in days',
        type: _configvariabletypeenum.ConfigVariableType.NUMBER
    }),
    (0, _casttopositivenumberdecorator.CastToPositiveNumber)(),
    (0, _classvalidator.IsOptional)(),
    (0, _classvalidator.ValidateIf)((env)=>env.IS_BILLING_ENABLED === true)
], ConfigVariables.prototype, "BILLING_FREE_TRIAL_WITH_CREDIT_CARD_DURATION_IN_DAYS", void 0);
_ts_decorate([
    (0, _configvariablesmetadatadecorator.ConfigVariablesMetadata)({
        group: _configvariablesgroupenum.ConfigVariablesGroup.BILLING_CONFIG,
        description: 'Duration of free trial without credit card in days',
        type: _configvariabletypeenum.ConfigVariableType.NUMBER
    }),
    (0, _casttopositivenumberdecorator.CastToPositiveNumber)(),
    (0, _classvalidator.IsOptional)(),
    (0, _classvalidator.ValidateIf)((env)=>env.IS_BILLING_ENABLED === true)
], ConfigVariables.prototype, "BILLING_FREE_TRIAL_WITHOUT_CREDIT_CARD_DURATION_IN_DAYS", void 0);
_ts_decorate([
    (0, _configvariablesmetadatadecorator.ConfigVariablesMetadata)({
        group: _configvariablesgroupenum.ConfigVariablesGroup.BILLING_CONFIG,
        description: 'Amount of credits for the free trial without credit card (in microCredits)',
        type: _configvariabletypeenum.ConfigVariableType.NUMBER
    }),
    (0, _casttopositivenumberdecorator.CastToPositiveNumber)(),
    (0, _classvalidator.ValidateIf)((env)=>env.IS_BILLING_ENABLED === true)
], ConfigVariables.prototype, "BILLING_FREE_WORKFLOW_CREDITS_FOR_TRIAL_PERIOD_WITHOUT_CREDIT_CARD", void 0);
_ts_decorate([
    (0, _configvariablesmetadatadecorator.ConfigVariablesMetadata)({
        group: _configvariablesgroupenum.ConfigVariablesGroup.BILLING_CONFIG,
        description: 'Amount of credits for the free trial with credit card (in microCredits)',
        type: _configvariabletypeenum.ConfigVariableType.NUMBER
    }),
    (0, _casttopositivenumberdecorator.CastToPositiveNumber)(),
    (0, _classvalidator.ValidateIf)((env)=>env.IS_BILLING_ENABLED === true)
], ConfigVariables.prototype, "BILLING_FREE_WORKFLOW_CREDITS_FOR_TRIAL_PERIOD_WITH_CREDIT_CARD", void 0);
_ts_decorate([
    (0, _configvariablesmetadatadecorator.ConfigVariablesMetadata)({
        group: _configvariablesgroupenum.ConfigVariablesGroup.BILLING_CONFIG,
        description: 'Number of days before a trial WITHOUT a credit card ends to send the reminder to add a payment method',
        type: _configvariabletypeenum.ConfigVariableType.NUMBER
    }),
    (0, _casttopositivenumberdecorator.CastToPositiveNumber)(),
    (0, _classvalidator.IsOptional)(),
    (0, _classvalidator.ValidateIf)((env)=>env.IS_BILLING_ENABLED === true)
], ConfigVariables.prototype, "BILLING_TRIAL_WITHOUT_CREDIT_CARD_REMINDER_DAYS_BEFORE", void 0);
_ts_decorate([
    (0, _configvariablesmetadatadecorator.ConfigVariablesMetadata)({
        group: _configvariablesgroupenum.ConfigVariablesGroup.BILLING_CONFIG,
        description: 'Number of days before a trial WITH a credit card ends to send the upcoming-charge reminder',
        type: _configvariabletypeenum.ConfigVariableType.NUMBER
    }),
    (0, _casttopositivenumberdecorator.CastToPositiveNumber)(),
    (0, _classvalidator.IsOptional)(),
    (0, _classvalidator.ValidateIf)((env)=>env.IS_BILLING_ENABLED === true)
], ConfigVariables.prototype, "BILLING_TRIAL_WITH_CREDIT_CARD_REMINDER_DAYS_BEFORE", void 0);
_ts_decorate([
    (0, _configvariablesmetadatadecorator.ConfigVariablesMetadata)({
        group: _configvariablesgroupenum.ConfigVariablesGroup.BILLING_CONFIG,
        description: 'Number of days before a yearly subscription renews to send the renewal reminder',
        type: _configvariabletypeenum.ConfigVariableType.NUMBER
    }),
    (0, _casttopositivenumberdecorator.CastToPositiveNumber)(),
    (0, _classvalidator.IsOptional)(),
    (0, _classvalidator.ValidateIf)((env)=>env.IS_BILLING_ENABLED === true)
], ConfigVariables.prototype, "BILLING_SUBSCRIPTION_RENEWAL_REMINDER_DAYS_BEFORE", void 0);
_ts_decorate([
    (0, _configvariablesmetadatadecorator.ConfigVariablesMetadata)({
        group: _configvariablesgroupenum.ConfigVariablesGroup.BILLING_CONFIG,
        isSensitive: true,
        description: 'Stripe API key for billing',
        type: _configvariabletypeenum.ConfigVariableType.STRING
    }),
    (0, _classvalidator.ValidateIf)((env)=>env.IS_BILLING_ENABLED === true),
    _ts_metadata("design:type", String)
], ConfigVariables.prototype, "BILLING_STRIPE_API_KEY", void 0);
_ts_decorate([
    (0, _configvariablesmetadatadecorator.ConfigVariablesMetadata)({
        group: _configvariablesgroupenum.ConfigVariablesGroup.BILLING_CONFIG,
        isSensitive: true,
        description: 'Stripe webhook secret for billing',
        type: _configvariabletypeenum.ConfigVariableType.STRING
    }),
    (0, _classvalidator.ValidateIf)((env)=>env.IS_BILLING_ENABLED === true),
    _ts_metadata("design:type", String)
], ConfigVariables.prototype, "BILLING_STRIPE_WEBHOOK_SECRET", void 0);
_ts_decorate([
    (0, _configvariablesmetadatadecorator.ConfigVariablesMetadata)({
        group: _configvariablesgroupenum.ConfigVariablesGroup.BILLING_CONFIG,
        description: 'Stripe publishable key for billing, exposed to the frontend to mount Stripe Elements',
        type: _configvariabletypeenum.ConfigVariableType.STRING
    }),
    (0, _classvalidator.ValidateIf)((env)=>env.IS_BILLING_ENABLED === true),
    _ts_metadata("design:type", String)
], ConfigVariables.prototype, "BILLING_STRIPE_PUBLISHABLE_KEY", void 0);
_ts_decorate([
    (0, _configvariablesmetadatadecorator.ConfigVariablesMetadata)({
        group: _configvariablesgroupenum.ConfigVariablesGroup.BILLING_CONFIG,
        description: 'Use the ClickHouse-backed poller (instead of Stripe billing alerts) as the source of truth for metered-credit cap enforcement',
        type: _configvariabletypeenum.ConfigVariableType.BOOLEAN
    }),
    (0, _classvalidator.IsOptional)()
], ConfigVariables.prototype, "BILLING_USAGE_CAP_CLICKHOUSE_ENABLED", void 0);
_ts_decorate([
    (0, _configvariablesmetadatadecorator.ConfigVariablesMetadata)({
        group: _configvariablesgroupenum.ConfigVariablesGroup.BILLING_CONFIG,
        description: 'Cap on the credits available in a period, as a multiple of the plan allowance. 2 means a workspace can hold at most its allowance plus one full allowance rolled over',
        type: _configvariabletypeenum.ConfigVariableType.NUMBER
    }),
    (0, _casttopositivenumberdecorator.CastToPositiveNumber)(),
    (0, _classvalidator.IsOptional)()
], ConfigVariables.prototype, "BILLING_ROLLOVER_TOTAL_CAP_MULTIPLIER", void 0);
_ts_decorate([
    (0, _configvariablesmetadatadecorator.ConfigVariablesMetadata)({
        group: _configvariablesgroupenum.ConfigVariablesGroup.BILLING_CONFIG,
        description: 'Largest credit amount a single admin panel grant can hand out (in microCredits)',
        type: _configvariabletypeenum.ConfigVariableType.NUMBER
    }),
    (0, _casttopositivenumberdecorator.CastToPositiveNumber)(),
    (0, _classvalidator.IsInt)(),
    (0, _classvalidator.IsOptional)()
], ConfigVariables.prototype, "BILLING_MAX_ADMIN_CREDIT_GRANT_MICRO", void 0);
_ts_decorate([
    (0, _configvariablesmetadatadecorator.ConfigVariablesMetadata)({
        group: _configvariablesgroupenum.ConfigVariablesGroup.BILLING_CONFIG,
        description: 'Free credits granted for completing the import-contacts onboarding step (in microCredits)',
        type: _configvariabletypeenum.ConfigVariableType.NUMBER
    }),
    (0, _casttopositivenumberdecorator.CastToPositiveNumber)(),
    (0, _classvalidator.IsInt)(),
    (0, _classvalidator.IsOptional)()
], ConfigVariables.prototype, "ONBOARDING_IMPORT_CONTACTS_CREDITS_REWARD", void 0);
_ts_decorate([
    (0, _configvariablesmetadatadecorator.ConfigVariablesMetadata)({
        group: _configvariablesgroupenum.ConfigVariablesGroup.BILLING_CONFIG,
        description: 'Maximum number of invitations that grant credits during the invite-team onboarding step',
        type: _configvariabletypeenum.ConfigVariableType.NUMBER
    }),
    (0, _casttopositivenumberdecorator.CastToPositiveNumber)(),
    (0, _classvalidator.IsInt)(),
    (0, _classvalidator.IsOptional)()
], ConfigVariables.prototype, "ONBOARDING_INVITE_TEAM_MAX_INVITES", void 0);
_ts_decorate([
    (0, _configvariablesmetadatadecorator.ConfigVariablesMetadata)({
        group: _configvariablesgroupenum.ConfigVariablesGroup.BILLING_CONFIG,
        description: 'Free credits granted per user invited during the invite-team onboarding step who signs up (in microCredits)',
        type: _configvariabletypeenum.ConfigVariableType.NUMBER
    }),
    (0, _casttopositivenumberdecorator.CastToPositiveNumber)(),
    (0, _classvalidator.IsInt)(),
    (0, _classvalidator.IsOptional)()
], ConfigVariables.prototype, "ONBOARDING_INVITE_TEAM_CREDITS_REWARD_PER_USER", void 0);
_ts_decorate([
    (0, _configvariablesmetadatadecorator.ConfigVariablesMetadata)({
        group: _configvariablesgroupenum.ConfigVariablesGroup.BILLING_CONFIG,
        description: 'Free credits granted per app installed during the install-apps onboarding step (in microCredits)',
        type: _configvariabletypeenum.ConfigVariableType.NUMBER
    }),
    (0, _casttopositivenumberdecorator.CastToPositiveNumber)(),
    (0, _classvalidator.IsInt)(),
    (0, _classvalidator.IsOptional)()
], ConfigVariables.prototype, "ONBOARDING_INSTALL_APPS_CREDITS_REWARD_PER_APP", void 0);
_ts_decorate([
    (0, _configvariablesmetadatadecorator.ConfigVariablesMetadata)({
        group: _configvariablesgroupenum.ConfigVariablesGroup.BILLING_CONFIG,
        description: 'Credit reward tiers for workspaces enrichment matched to a real company, keyed by tier name, as {"midMarket":{"minEmployeeCount":20,"amountMicro":5000000}} (amounts in microCredits). The most generous matching tier wins; no tiers disables the reward. Independent of ONBOARDING_BOOK_CALL_MIN_EMPLOYEE_COUNT, so credits and the book-a-call offer can target different companies.',
        isHiddenInAdminPanel: true,
        type: _configvariabletypeenum.ConfigVariableType.JSON
    }),
    (0, _classvalidator.IsOptional)(),
    _ts_metadata("design:type", typeof Record === "undefined" ? Object : Record)
], ConfigVariables.prototype, "ONBOARDING_ENRICHMENT_CREDIT_REWARD_TIERS", void 0);
_ts_decorate([
    (0, _configvariablesmetadatadecorator.ConfigVariablesMetadata)({
        group: _configvariablesgroupenum.ConfigVariablesGroup.SERVER_CONFIG,
        description: 'Url for the frontend application',
        type: _configvariabletypeenum.ConfigVariableType.STRING
    }),
    (0, _classvalidator.IsUrl)({
        require_tld: false,
        require_protocol: true
    }),
    (0, _classvalidator.IsOptional)(),
    _ts_metadata("design:type", String)
], ConfigVariables.prototype, "FRONTEND_URL", void 0);
_ts_decorate([
    (0, _configvariablesmetadatadecorator.ConfigVariablesMetadata)({
        group: _configvariablesgroupenum.ConfigVariablesGroup.SERVER_CONFIG,
        description: 'Default subdomain for the frontend when multi-workspace is enabled',
        type: _configvariabletypeenum.ConfigVariableType.STRING
    }),
    (0, _classvalidator.ValidateIf)((env)=>env.IS_MULTIWORKSPACE_ENABLED)
], ConfigVariables.prototype, "DEFAULT_SUBDOMAIN", void 0);
_ts_decorate([
    (0, _configvariablesmetadatadecorator.ConfigVariablesMetadata)({
        group: _configvariablesgroupenum.ConfigVariablesGroup.ADVANCED_SETTINGS,
        description: 'Page ID for Cal.com booking integration',
        isHiddenInAdminPanel: true,
        type: _configvariabletypeenum.ConfigVariableType.STRING
    }),
    (0, _classvalidator.IsOptional)(),
    _ts_metadata("design:type", String)
], ConfigVariables.prototype, "CALENDAR_BOOKING_PAGE_ID", void 0);
_ts_decorate([
    (0, _configvariablesmetadatadecorator.ConfigVariablesMetadata)({
        group: _configvariablesgroupenum.ConfigVariablesGroup.ADVANCED_SETTINGS,
        description: 'Minimum enriched company employee count required to show the book-a-call onboarding step. Leave unset or set to 0 to disable the step. The step also requires CALENDAR_BOOKING_PAGE_ID.',
        isHiddenInAdminPanel: true,
        type: _configvariabletypeenum.ConfigVariableType.NUMBER
    }),
    (0, _casttopositivenumberdecorator.CastToPositiveNumber)(),
    (0, _classvalidator.IsInt)(),
    (0, _classvalidator.IsOptional)(),
    _ts_metadata("design:type", Number)
], ConfigVariables.prototype, "ONBOARDING_BOOK_CALL_MIN_EMPLOYEE_COUNT", void 0);
_ts_decorate([
    (0, _configvariablesmetadatadecorator.ConfigVariablesMetadata)({
        group: _configvariablesgroupenum.ConfigVariablesGroup.LOGGING,
        description: 'Enable or disable buffering for logs before sending',
        type: _configvariabletypeenum.ConfigVariableType.BOOLEAN
    }),
    (0, _classvalidator.IsOptional)()
], ConfigVariables.prototype, "LOGGER_IS_BUFFER_ENABLED", void 0);
_ts_decorate([
    (0, _configvariablesmetadatadecorator.ConfigVariablesMetadata)({
        group: _configvariablesgroupenum.ConfigVariablesGroup.LOGGING,
        description: 'Driver used for handling exceptions (Console or Sentry)',
        type: _configvariabletypeenum.ConfigVariableType.ENUM,
        options: Object.values(_interfaces1.ExceptionHandlerDriver),
        isEnvOnly: true
    }),
    (0, _classvalidator.IsOptional)(),
    (0, _casttouppersnakecasedecorator.CastToUpperSnakeCase)(),
    _ts_metadata("design:type", typeof _interfaces1.ExceptionHandlerDriver === "undefined" ? Object : _interfaces1.ExceptionHandlerDriver)
], ConfigVariables.prototype, "EXCEPTION_HANDLER_DRIVER", void 0);
_ts_decorate([
    (0, _configvariablesmetadatadecorator.ConfigVariablesMetadata)({
        group: _configvariablesgroupenum.ConfigVariablesGroup.LOGGING,
        description: 'Levels of logging to be captured. The "performance" level emits LoggerService perf / perfTime / perfTimeEnd instrumentation.',
        type: _configvariabletypeenum.ConfigVariableType.ARRAY,
        options: [
            'log',
            'error',
            'warn',
            'debug',
            'verbose',
            'performance'
        ],
        isEnvOnly: true
    }),
    (0, _casttologlevelarraydecorator.CastToLogLevelArray)(),
    (0, _classvalidator.IsOptional)(),
    _ts_metadata("design:type", Array)
], ConfigVariables.prototype, "LOG_LEVELS", void 0);
_ts_decorate([
    (0, _configvariablesmetadatadecorator.ConfigVariablesMetadata)({
        group: _configvariablesgroupenum.ConfigVariablesGroup.LOGGING,
        description: 'Driver used for collect metrics (OpenTelemetry or Console)',
        type: _configvariabletypeenum.ConfigVariableType.ARRAY,
        options: [
            'OpenTelemetry',
            'Console'
        ],
        isEnvOnly: true
    }),
    (0, _casttometerdriverdecorator.CastToMeterDriverArray)(),
    (0, _classvalidator.IsOptional)(),
    _ts_metadata("design:type", Array)
], ConfigVariables.prototype, "METER_DRIVER", void 0);
_ts_decorate([
    (0, _configvariablesmetadatadecorator.ConfigVariablesMetadata)({
        group: _configvariablesgroupenum.ConfigVariablesGroup.LOGGING,
        description: 'Driver used for logging (only console for now)',
        type: _configvariabletypeenum.ConfigVariableType.ENUM,
        options: Object.values(_interfaces3.LoggerDriverType),
        isEnvOnly: true
    }),
    (0, _classvalidator.IsOptional)(),
    (0, _casttouppersnakecasedecorator.CastToUpperSnakeCase)(),
    _ts_metadata("design:type", typeof _interfaces3.LoggerDriverType === "undefined" ? Object : _interfaces3.LoggerDriverType)
], ConfigVariables.prototype, "LOGGER_DRIVER", void 0);
_ts_decorate([
    (0, _configvariablesmetadatadecorator.ConfigVariablesMetadata)({
        group: _configvariablesgroupenum.ConfigVariablesGroup.LOGGING,
        description: 'Data Source Name (DSN) for Sentry logging',
        type: _configvariabletypeenum.ConfigVariableType.STRING,
        isSensitive: true
    }),
    (0, _classvalidator.ValidateIf)((env)=>env.EXCEPTION_HANDLER_DRIVER === _interfaces1.ExceptionHandlerDriver.SENTRY),
    _ts_metadata("design:type", String)
], ConfigVariables.prototype, "SENTRY_DSN", void 0);
_ts_decorate([
    (0, _configvariablesmetadatadecorator.ConfigVariablesMetadata)({
        group: _configvariablesgroupenum.ConfigVariablesGroup.LOGGING,
        description: 'Front-end DSN for Sentry logging',
        type: _configvariabletypeenum.ConfigVariableType.STRING,
        isSensitive: true
    }),
    (0, _classvalidator.ValidateIf)((env)=>env.EXCEPTION_HANDLER_DRIVER === _interfaces1.ExceptionHandlerDriver.SENTRY),
    _ts_metadata("design:type", String)
], ConfigVariables.prototype, "SENTRY_FRONT_DSN", void 0);
_ts_decorate([
    (0, _configvariablesmetadatadecorator.ConfigVariablesMetadata)({
        group: _configvariablesgroupenum.ConfigVariablesGroup.LOGGING,
        description: 'Environment name for Sentry logging',
        type: _configvariabletypeenum.ConfigVariableType.STRING
    }),
    (0, _classvalidator.ValidateIf)((env)=>env.EXCEPTION_HANDLER_DRIVER === _interfaces1.ExceptionHandlerDriver.SENTRY),
    (0, _classvalidator.IsOptional)(),
    _ts_metadata("design:type", String)
], ConfigVariables.prototype, "SENTRY_ENVIRONMENT", void 0);
_ts_decorate([
    (0, _configvariablesmetadatadecorator.ConfigVariablesMetadata)({
        group: _configvariablesgroupenum.ConfigVariablesGroup.LOGGING,
        description: 'Share of front-end traces sent to Sentry, between 0 and 1. Front-end traces propagate their sampling decision to the server, so this also drives the rate for browser-originated server traces.',
        type: _configvariabletypeenum.ConfigVariableType.NUMBER
    }),
    (0, _casttopositivenumberdecorator.CastToPositiveNumber)(),
    (0, _classvalidator.Max)(1),
    (0, _classvalidator.IsOptional)()
], ConfigVariables.prototype, "SENTRY_FRONT_TRACES_SAMPLE_RATE", void 0);
_ts_decorate([
    (0, _configvariablesmetadatadecorator.ConfigVariablesMetadata)({
        group: _configvariablesgroupenum.ConfigVariablesGroup.LOGGING,
        description: 'Share of server traces sent to Sentry, between 0 and 1. Browser-originated traces inherit the front-end decision instead, and AI traces are always sampled at 1. Read before the config store is available, so it cannot be overridden from the database.',
        type: _configvariabletypeenum.ConfigVariableType.NUMBER,
        isEnvOnly: true
    }),
    (0, _casttopositivenumberdecorator.CastToPositiveNumber)(),
    (0, _classvalidator.IsOptional)()
], ConfigVariables.prototype, "SENTRY_TRACES_SAMPLE_RATE", void 0);
_ts_decorate([
    (0, _configvariablesmetadatadecorator.ConfigVariablesMetadata)({
        group: _configvariablesgroupenum.ConfigVariablesGroup.LOGGING,
        description: 'Share of sampled server traces that are also profiled, between 0 and 1. Read before the config store is available, so it cannot be overridden from the database.',
        type: _configvariabletypeenum.ConfigVariableType.NUMBER,
        isEnvOnly: true
    }),
    (0, _casttopositivenumberdecorator.CastToPositiveNumber)(),
    (0, _classvalidator.IsOptional)()
], ConfigVariables.prototype, "SENTRY_PROFILES_SAMPLE_RATE", void 0);
_ts_decorate([
    (0, _configvariablesmetadatadecorator.ConfigVariablesMetadata)({
        group: _configvariablesgroupenum.ConfigVariablesGroup.LOGGING,
        description: 'Ordered list of sinks the unified event pipeline writes to (e.g. clickhouse). The first is the read store.',
        type: _configvariabletypeenum.ConfigVariableType.ARRAY,
        isEnvOnly: true
    }),
    (0, _classvalidator.IsOptional)(),
    _ts_metadata("design:type", Array)
], ConfigVariables.prototype, "EVENT_SINKS", void 0);
_ts_decorate([
    (0, _configvariablesmetadatadecorator.ConfigVariablesMetadata)({
        group: _configvariablesgroupenum.ConfigVariablesGroup.SUPPORT_CHAT_CONFIG,
        description: 'Driver used for support chat integration',
        type: _configvariabletypeenum.ConfigVariableType.ENUM,
        options: Object.values(_supportinterface.SupportDriver)
    }),
    (0, _classvalidator.IsOptional)(),
    (0, _casttouppersnakecasedecorator.CastToUpperSnakeCase)(),
    _ts_metadata("design:type", typeof _supportinterface.SupportDriver === "undefined" ? Object : _supportinterface.SupportDriver)
], ConfigVariables.prototype, "SUPPORT_DRIVER", void 0);
_ts_decorate([
    (0, _configvariablesmetadatadecorator.ConfigVariablesMetadata)({
        group: _configvariablesgroupenum.ConfigVariablesGroup.SUPPORT_CHAT_CONFIG,
        isSensitive: true,
        description: 'Chat ID for the support front integration',
        type: _configvariabletypeenum.ConfigVariableType.STRING
    }),
    (0, _classvalidator.ValidateIf)((env)=>env.SUPPORT_DRIVER === _supportinterface.SupportDriver.FRONT),
    _ts_metadata("design:type", String)
], ConfigVariables.prototype, "SUPPORT_FRONT_CHAT_ID", void 0);
_ts_decorate([
    (0, _configvariablesmetadatadecorator.ConfigVariablesMetadata)({
        group: _configvariablesgroupenum.ConfigVariablesGroup.SUPPORT_CHAT_CONFIG,
        isSensitive: true,
        description: 'HMAC key for the support front integration',
        type: _configvariabletypeenum.ConfigVariableType.STRING
    }),
    (0, _classvalidator.ValidateIf)((env)=>env.SUPPORT_DRIVER === _supportinterface.SupportDriver.FRONT),
    _ts_metadata("design:type", String)
], ConfigVariables.prototype, "SUPPORT_FRONT_HMAC_KEY", void 0);
_ts_decorate([
    (0, _configvariablesmetadatadecorator.ConfigVariablesMetadata)({
        group: _configvariablesgroupenum.ConfigVariablesGroup.SERVER_CONFIG,
        isSensitive: true,
        description: 'Database connection URL',
        type: _configvariabletypeenum.ConfigVariableType.STRING,
        isEnvOnly: true
    }),
    (0, _classvalidator.IsDefined)(),
    (0, _classvalidator.IsUrl)({
        protocols: [
            'postgres',
            'postgresql'
        ],
        require_tld: false,
        allow_underscores: true,
        require_host: false
    }),
    _ts_metadata("design:type", String)
], ConfigVariables.prototype, "PG_DATABASE_URL", void 0);
_ts_decorate([
    (0, _configvariablesmetadatadecorator.ConfigVariablesMetadata)({
        group: _configvariablesgroupenum.ConfigVariablesGroup.ADVANCED_SETTINGS,
        isSensitive: true,
        description: 'Optional PostgreSQL replica connection URL for read queries',
        type: _configvariabletypeenum.ConfigVariableType.STRING,
        isEnvOnly: true
    }),
    (0, _classvalidator.IsOptional)(),
    (0, _classvalidator.IsUrl)({
        protocols: [
            'postgres',
            'postgresql'
        ],
        require_tld: false,
        allow_underscores: true,
        require_host: false
    }),
    _ts_metadata("design:type", String)
], ConfigVariables.prototype, "PG_DATABASE_REPLICA_URL", void 0);
_ts_decorate([
    (0, _configvariablesmetadatadecorator.ConfigVariablesMetadata)({
        group: _configvariablesgroupenum.ConfigVariablesGroup.SERVER_CONFIG,
        description: 'Allow connections to a database with self-signed certificates',
        isEnvOnly: true,
        type: _configvariabletypeenum.ConfigVariableType.BOOLEAN
    }),
    (0, _classvalidator.IsOptional)()
], ConfigVariables.prototype, "PG_SSL_ALLOW_SELF_SIGNED", void 0);
_ts_decorate([
    (0, _configvariablesmetadatadecorator.ConfigVariablesMetadata)({
        group: _configvariablesgroupenum.ConfigVariablesGroup.ADVANCED_SETTINGS,
        description: 'Maximum number of clients in pg connection pool',
        isEnvOnly: true,
        type: _configvariabletypeenum.ConfigVariableType.NUMBER
    }),
    (0, _casttopositivenumberdecorator.CastToPositiveNumber)(),
    (0, _classvalidator.IsOptional)()
], ConfigVariables.prototype, "PG_POOL_MAX_CONNECTIONS", void 0);
_ts_decorate([
    (0, _configvariablesmetadatadecorator.ConfigVariablesMetadata)({
        group: _configvariablesgroupenum.ConfigVariablesGroup.ADVANCED_SETTINGS,
        description: 'Idle timeout in milliseconds for pg connection pool clients',
        isEnvOnly: true,
        type: _configvariabletypeenum.ConfigVariableType.NUMBER
    }),
    (0, _casttopositivenumberdecorator.CastToPositiveNumber)(),
    (0, _classvalidator.IsOptional)()
], ConfigVariables.prototype, "PG_POOL_IDLE_TIMEOUT_MS", void 0);
_ts_decorate([
    (0, _configvariablesmetadatadecorator.ConfigVariablesMetadata)({
        group: _configvariablesgroupenum.ConfigVariablesGroup.ADVANCED_SETTINGS,
        description: 'Allow idle pg connection pool clients to exit',
        isEnvOnly: true,
        type: _configvariabletypeenum.ConfigVariableType.BOOLEAN
    }),
    (0, _classvalidator.IsOptional)()
], ConfigVariables.prototype, "PG_POOL_ALLOW_EXIT_ON_IDLE", void 0);
_ts_decorate([
    (0, _configvariablesmetadatadecorator.ConfigVariablesMetadata)({
        group: _configvariablesgroupenum.ConfigVariablesGroup.SERVER_CONFIG,
        description: 'Enable configuration variables to be stored in the database',
        isEnvOnly: true,
        type: _configvariabletypeenum.ConfigVariableType.BOOLEAN
    }),
    (0, _classvalidator.IsOptional)()
], ConfigVariables.prototype, "IS_CONFIG_VARIABLES_IN_DB_ENABLED", void 0);
_ts_decorate([
    (0, _configvariablesmetadatadecorator.ConfigVariablesMetadata)({
        group: _configvariablesgroupenum.ConfigVariablesGroup.TOKENS_DURATION,
        description: 'Time-to-live for cache storage in seconds',
        type: _configvariabletypeenum.ConfigVariableType.NUMBER
    }),
    (0, _casttopositivenumberdecorator.CastToPositiveNumber)(),
    _ts_metadata("design:type", Number)
], ConfigVariables.prototype, "CACHE_STORAGE_TTL", void 0);
_ts_decorate([
    (0, _configvariablesmetadatadecorator.ConfigVariablesMetadata)({
        group: _configvariablesgroupenum.ConfigVariablesGroup.SERVER_CONFIG,
        isSensitive: true,
        description: 'Redis connection URL used for cache and queues by default',
        isEnvOnly: true,
        type: _configvariabletypeenum.ConfigVariableType.STRING
    }),
    (0, _classvalidator.IsUrl)({
        protocols: [
            'redis',
            'rediss'
        ],
        require_tld: false,
        allow_underscores: true
    }),
    _ts_metadata("design:type", String)
], ConfigVariables.prototype, "REDIS_URL", void 0);
_ts_decorate([
    (0, _configvariablesmetadatadecorator.ConfigVariablesMetadata)({
        group: _configvariablesgroupenum.ConfigVariablesGroup.ADVANCED_SETTINGS,
        isSensitive: true,
        description: 'Optional separate Redis connection for queues with a different eviction policy (advanced production use case, most self-hosters do not need this)',
        isEnvOnly: true,
        type: _configvariabletypeenum.ConfigVariableType.STRING
    }),
    (0, _classvalidator.IsOptional)(),
    (0, _classvalidator.IsUrl)({
        protocols: [
            'redis',
            'rediss'
        ],
        require_tld: false,
        allow_underscores: true
    }),
    _ts_metadata("design:type", String)
], ConfigVariables.prototype, "REDIS_QUEUE_URL", void 0);
_ts_decorate([
    (0, _configvariablesmetadatadecorator.ConfigVariablesMetadata)({
        group: _configvariablesgroupenum.ConfigVariablesGroup.ADVANCED_SETTINGS,
        description: 'Comma-separated list of queues this worker processes (e.g. workspace-queue). Empty means all queues. Used to dedicate worker pods to specific queues.',
        isEnvOnly: true,
        type: _configvariabletypeenum.ConfigVariableType.ARRAY
    }),
    (0, _classvalidator.IsOptional)(),
    _ts_metadata("design:type", Array)
], ConfigVariables.prototype, "WORKER_ENABLED_QUEUES", void 0);
_ts_decorate([
    (0, _configvariablesmetadatadecorator.ConfigVariablesMetadata)({
        group: _configvariablesgroupenum.ConfigVariablesGroup.ADVANCED_SETTINGS,
        description: 'Comma-separated list of queues this worker does not process (e.g. workspace-queue). Applied after WORKER_ENABLED_QUEUES. Used to keep long-running queues off general-purpose worker pods.',
        isEnvOnly: true,
        type: _configvariabletypeenum.ConfigVariableType.ARRAY
    }),
    (0, _classvalidator.IsOptional)(),
    _ts_metadata("design:type", Array)
], ConfigVariables.prototype, "WORKER_EXCLUDED_QUEUES", void 0);
_ts_decorate([
    (0, _configvariablesmetadatadecorator.ConfigVariablesMetadata)({
        group: _configvariablesgroupenum.ConfigVariablesGroup.SERVER_CONFIG,
        description: 'Node environment (development, production, etc.)',
        type: _configvariabletypeenum.ConfigVariableType.ENUM,
        options: Object.values(_nodeenvironmentinterface.NodeEnvironment),
        isEnvOnly: true
    }),
    _ts_metadata("design:type", typeof _nodeenvironmentinterface.NodeEnvironment === "undefined" ? Object : _nodeenvironmentinterface.NodeEnvironment)
], ConfigVariables.prototype, "NODE_ENV", void 0);
_ts_decorate([
    (0, _configvariablesmetadatadecorator.ConfigVariablesMetadata)({
        group: _configvariablesgroupenum.ConfigVariablesGroup.SERVER_CONFIG,
        description: 'Port for the node server',
        type: _configvariabletypeenum.ConfigVariableType.NUMBER,
        isEnvOnly: true
    }),
    (0, _casttopositivenumberdecorator.CastToPositiveNumber)(),
    (0, _classvalidator.IsOptional)()
], ConfigVariables.prototype, "NODE_PORT", void 0);
_ts_decorate([
    (0, _configvariablesmetadatadecorator.ConfigVariablesMetadata)({
        group: _configvariablesgroupenum.ConfigVariablesGroup.SERVER_CONFIG,
        description: 'Idle keep-alive timeout (ms) for the HTTP server. Should be higher ' + 'than the idle timeout of any reverse proxy / load balancer in front ' + 'of it (nginx, ALB, ... default 60s), so the proxy is the side that ' + 'closes idle connections.',
        type: _configvariabletypeenum.ConfigVariableType.NUMBER,
        isEnvOnly: true
    }),
    (0, _casttopositivenumberdecorator.CastToPositiveNumber)(),
    (0, _classvalidator.IsOptional)()
], ConfigVariables.prototype, "SERVER_KEEP_ALIVE_TIMEOUT_MS", void 0);
_ts_decorate([
    (0, _configvariablesmetadatadecorator.ConfigVariablesMetadata)({
        group: _configvariablesgroupenum.ConfigVariablesGroup.SERVER_CONFIG,
        description: 'How long (ms) a worker shutdown waits for active AI chat stream jobs to finish before aborting them into a retryable interrupted state. Must be lower than the pod terminationGracePeriodSeconds so the abort and clean exit fit before SIGKILL (default: 300000)',
        type: _configvariabletypeenum.ConfigVariableType.NUMBER,
        isEnvOnly: true
    }),
    (0, _casttopositivenumberdecorator.CastToPositiveNumber)(),
    (0, _classvalidator.IsOptional)()
], ConfigVariables.prototype, "AI_STREAM_SHUTDOWN_DRAIN_MS", void 0);
_ts_decorate([
    (0, _configvariablesmetadatadecorator.ConfigVariablesMetadata)({
        group: _configvariablesgroupenum.ConfigVariablesGroup.SERVER_CONFIG,
        description: 'Base URL for the server',
        type: _configvariabletypeenum.ConfigVariableType.STRING,
        isEnvOnly: true
    }),
    (0, _classvalidator.IsUrl)({
        require_tld: false,
        require_protocol: true
    }),
    (0, _classvalidator.IsOptional)()
], ConfigVariables.prototype, "SERVER_URL", void 0);
_ts_decorate([
    (0, _configvariablesmetadatadecorator.ConfigVariablesMetadata)({
        group: _configvariablesgroupenum.ConfigVariablesGroup.SERVER_CONFIG,
        description: 'Express "trust proxy" setting. Controls whether X-Forwarded-* ' + 'headers are honored — required for request.protocol to return ' + '"https" when TLS is terminated upstream (reverse proxy, ingress, ' + 'Cloudflare, etc.). Default trusts loopback + RFC1918/ULA peers, ' + 'which is correct when NestJS runs behind a reverse proxy (our ' + 'recommended self-host setup). Set to "false" when NestJS is ' + 'exposed directly to the internet. Accepts any value Express ' + 'supports — see https://expressjs.com/en/guide/behind-proxies.html.',
        type: _configvariabletypeenum.ConfigVariableType.STRING,
        isEnvOnly: true
    }),
    (0, _classvalidator.IsOptional)(),
    _ts_metadata("design:type", String)
], ConfigVariables.prototype, "TRUST_PROXY", void 0);
_ts_decorate([
    (0, _configvariablesmetadatadecorator.ConfigVariablesMetadata)({
        group: _configvariablesgroupenum.ConfigVariablesGroup.SERVER_CONFIG,
        description: 'Unique identifier for this server instance, generated as UUID v4 during database seeding and persisted in the database. Can be overridden via the environment when IS_CONFIG_VARIABLES_IN_DB_ENABLED is false.',
        type: _configvariabletypeenum.ConfigVariableType.STRING
    }),
    (0, _classvalidator.IsOptional)(),
    _ts_metadata("design:type", String)
], ConfigVariables.prototype, "SERVER_ID", void 0);
_ts_decorate([
    (0, _configvariablesmetadatadecorator.ConfigVariablesMetadata)({
        group: _configvariablesgroupenum.ConfigVariablesGroup.SERVER_CONFIG,
        description: "Declares whether this instance is a 'production' (billable per seat) or 'development' (included at no additional cost) enterprise instance. A subscription can register a single free development instance in addition to its production one.",
        type: _configvariabletypeenum.ConfigVariableType.ENUM,
        options: Object.values(_constants.ENTERPRISE_INSTANCE_TYPE)
    }),
    (0, _classvalidator.IsOptional)(),
    (0, _classvalidator.IsIn)(Object.values(_constants.ENTERPRISE_INSTANCE_TYPE)),
    _ts_metadata("design:type", typeof EnterpriseInstanceType === "undefined" ? Object : EnterpriseInstanceType)
], ConfigVariables.prototype, "ENTERPRISE_INSTANCE_TYPE", void 0);
_ts_decorate([
    (0, _configvariablesmetadatadecorator.ConfigVariablesMetadata)({
        group: _configvariablesgroupenum.ConfigVariablesGroup.SERVER_CONFIG,
        description: 'Base URL for public domains',
        type: _configvariabletypeenum.ConfigVariableType.STRING
    }),
    (0, _classvalidator.IsUrl)({
        require_tld: false,
        require_protocol: true
    }),
    (0, _classvalidator.IsOptional)(),
    _ts_metadata("design:type", String)
], ConfigVariables.prototype, "PUBLIC_DOMAIN_URL", void 0);
_ts_decorate([
    (0, _configvariablesmetadatadecorator.ConfigVariablesMetadata)({
        group: _configvariablesgroupenum.ConfigVariablesGroup.SERVER_CONFIG,
        description: 'ISO date from which HTTP logic functions are no longer served on the legacy /s/ route. Functions created on or after this date are only reachable on the isolated public domain (*.withtwenty.com). Only enforced when PUBLIC_DOMAIN_URL is set; leave empty to keep serving every function on /s/ (default for self-hosting).',
        isHiddenInAdminPanel: true,
        type: _configvariabletypeenum.ConfigVariableType.STRING
    }),
    (0, _classvalidator.IsDateString)(),
    (0, _classvalidator.IsOptional)(),
    _ts_metadata("design:type", String)
], ConfigVariables.prototype, "LOGIC_FUNCTION_LEGACY_ROUTE_CUTOFF", void 0);
_ts_decorate([
    (0, _configvariablesmetadatadecorator.ConfigVariablesMetadata)({
        group: _configvariablesgroupenum.ConfigVariablesGroup.SERVER_CONFIG,
        isSensitive: true,
        description: 'Secret key for the application',
        isEnvOnly: true,
        type: _configvariabletypeenum.ConfigVariableType.STRING
    }),
    _ts_metadata("design:type", String)
], ConfigVariables.prototype, "APP_SECRET", void 0);
_ts_decorate([
    (0, _configvariablesmetadatadecorator.ConfigVariablesMetadata)({
        group: _configvariablesgroupenum.ConfigVariablesGroup.SERVER_CONFIG,
        isSensitive: true,
        description: 'Primary key for at-rest encryption of secrets. Falls back to APP_SECRET when unset.',
        isEnvOnly: true,
        type: _configvariabletypeenum.ConfigVariableType.STRING
    }),
    (0, _classvalidator.IsOptional)(),
    _ts_metadata("design:type", String)
], ConfigVariables.prototype, "ENCRYPTION_KEY", void 0);
_ts_decorate([
    (0, _configvariablesmetadatadecorator.ConfigVariablesMetadata)({
        group: _configvariablesgroupenum.ConfigVariablesGroup.SERVER_CONFIG,
        isSensitive: true,
        description: 'Verification-only fallback key. During rotation, set this to the previous ENCRYPTION_KEY so rows encrypted with the old key remain decryptable and session cookies signed under it still verify.',
        isEnvOnly: true,
        type: _configvariabletypeenum.ConfigVariableType.STRING
    }),
    (0, _classvalidator.IsOptional)(),
    _ts_metadata("design:type", String)
], ConfigVariables.prototype, "FALLBACK_ENCRYPTION_KEY", void 0);
_ts_decorate([
    (0, _configvariablesmetadatadecorator.ConfigVariablesMetadata)({
        group: _configvariablesgroupenum.ConfigVariablesGroup.ADVANCED_SETTINGS,
        description: 'Days the current JWT signing key stays valid before the rotation cron issues a new one. Leave unset to disable auto-rotation.',
        type: _configvariabletypeenum.ConfigVariableType.NUMBER
    }),
    (0, _casttopositivenumberdecorator.CastToPositiveNumber)(),
    (0, _classvalidator.IsOptional)(),
    _ts_metadata("design:type", Number)
], ConfigVariables.prototype, "SIGNING_KEY_ROTATION_DAYS", void 0);
_ts_decorate([
    (0, _configvariablesmetadatadecorator.ConfigVariablesMetadata)({
        group: _configvariablesgroupenum.ConfigVariablesGroup.ADVANCED_SETTINGS,
        description: 'Register the cron job that syncs the marketplace catalog from the npm registry. Disable to stop the automatic catalog import.',
        type: _configvariabletypeenum.ConfigVariableType.BOOLEAN
    }),
    (0, _classvalidator.IsOptional)()
], ConfigVariables.prototype, "MARKETPLACE_CATALOG_SYNC_CRON_ENABLED", void 0);
_ts_decorate([
    (0, _configvariablesmetadatadecorator.ConfigVariablesMetadata)({
        group: _configvariablesgroupenum.ConfigVariablesGroup.RATE_LIMITING,
        description: 'Maximum number of records affected by mutations',
        type: _configvariabletypeenum.ConfigVariableType.NUMBER
    }),
    (0, _casttopositivenumberdecorator.CastToPositiveNumber)(),
    (0, _classvalidator.IsOptional)()
], ConfigVariables.prototype, "MUTATION_MAXIMUM_AFFECTED_RECORDS", void 0);
_ts_decorate([
    (0, _configvariablesmetadatadecorator.ConfigVariablesMetadata)({
        group: _configvariablesgroupenum.ConfigVariablesGroup.RATE_LIMITING,
        description: 'Time-to-live for short API rate limiting in milliseconds',
        type: _configvariabletypeenum.ConfigVariableType.NUMBER
    }),
    (0, _casttopositivenumberdecorator.CastToPositiveNumber)()
], ConfigVariables.prototype, "API_RATE_LIMITING_SHORT_TTL_IN_MS", void 0);
_ts_decorate([
    (0, _configvariablesmetadatadecorator.ConfigVariablesMetadata)({
        group: _configvariablesgroupenum.ConfigVariablesGroup.RATE_LIMITING,
        description: 'Maximum number of requests allowed in the short rate limiting window',
        type: _configvariabletypeenum.ConfigVariableType.NUMBER
    }),
    (0, _casttopositivenumberdecorator.CastToPositiveNumber)()
], ConfigVariables.prototype, "API_RATE_LIMITING_SHORT_LIMIT", void 0);
_ts_decorate([
    (0, _configvariablesmetadatadecorator.ConfigVariablesMetadata)({
        group: _configvariablesgroupenum.ConfigVariablesGroup.RATE_LIMITING,
        description: 'Time-to-live for long API rate limiting in milliseconds',
        type: _configvariabletypeenum.ConfigVariableType.NUMBER
    }),
    (0, _casttopositivenumberdecorator.CastToPositiveNumber)()
], ConfigVariables.prototype, "API_RATE_LIMITING_LONG_TTL_IN_MS", void 0);
_ts_decorate([
    (0, _configvariablesmetadatadecorator.ConfigVariablesMetadata)({
        group: _configvariablesgroupenum.ConfigVariablesGroup.RATE_LIMITING,
        description: 'Maximum number of requests allowed in the long rate limiting window',
        type: _configvariabletypeenum.ConfigVariableType.NUMBER
    }),
    (0, _casttopositivenumberdecorator.CastToPositiveNumber)()
], ConfigVariables.prototype, "API_RATE_LIMITING_LONG_LIMIT", void 0);
_ts_decorate([
    (0, _configvariablesmetadatadecorator.ConfigVariablesMetadata)({
        group: _configvariablesgroupenum.ConfigVariablesGroup.RATE_LIMITING,
        description: 'Time-to-live for per-application API rate limiting in milliseconds',
        type: _configvariabletypeenum.ConfigVariableType.NUMBER
    }),
    (0, _casttopositivenumberdecorator.CastToPositiveNumber)()
], ConfigVariables.prototype, "APPLICATION_API_RATE_LIMITING_TTL_IN_MS", void 0);
_ts_decorate([
    (0, _configvariablesmetadatadecorator.ConfigVariablesMetadata)({
        group: _configvariablesgroupenum.ConfigVariablesGroup.RATE_LIMITING,
        description: 'Maximum number of API requests allowed per application across all workspaces in the rate limiting window',
        type: _configvariabletypeenum.ConfigVariableType.NUMBER
    }),
    (0, _casttopositivenumberdecorator.CastToPositiveNumber)()
], ConfigVariables.prototype, "APPLICATION_API_RATE_LIMITING_LIMIT", void 0);
_ts_decorate([
    (0, _configvariablesmetadatadecorator.ConfigVariablesMetadata)({
        group: _configvariablesgroupenum.ConfigVariablesGroup.RATE_LIMITING,
        description: 'Time-to-live for outbound email send rate limiting in milliseconds',
        type: _configvariabletypeenum.ConfigVariableType.NUMBER
    }),
    (0, _casttopositivenumberdecorator.CastToPositiveNumber)()
], ConfigVariables.prototype, "EMAIL_SEND_RATE_LIMITING_TTL_IN_MS", void 0);
_ts_decorate([
    (0, _configvariablesmetadatadecorator.ConfigVariablesMetadata)({
        group: _configvariablesgroupenum.ConfigVariablesGroup.RATE_LIMITING,
        description: 'Maximum number of emails sent across all workspaces in the rate limiting window. Set it below the send rate the email provider publishes for the account, so transactional mail sharing that account keeps headroom during a campaign',
        type: _configvariabletypeenum.ConfigVariableType.NUMBER
    }),
    (0, _casttopositivenumberdecorator.CastToPositiveNumber)()
], ConfigVariables.prototype, "EMAIL_SEND_RATE_LIMITING_LIMIT", void 0);
_ts_decorate([
    (0, _configvariablesmetadatadecorator.ConfigVariablesMetadata)({
        group: _configvariablesgroupenum.ConfigVariablesGroup.RATE_LIMITING,
        description: 'Time-to-live for application job enqueue rate limiting in milliseconds',
        type: _configvariabletypeenum.ConfigVariableType.NUMBER
    }),
    (0, _casttopositivenumberdecorator.CastToPositiveNumber)()
], ConfigVariables.prototype, "APPLICATION_JOB_ENQUEUE_RATE_LIMITING_TTL_IN_MS", void 0);
_ts_decorate([
    (0, _configvariablesmetadatadecorator.ConfigVariablesMetadata)({
        group: _configvariablesgroupenum.ConfigVariablesGroup.RATE_LIMITING,
        description: 'Maximum number of jobs a single application installation can enqueue in the rate limiting window',
        type: _configvariabletypeenum.ConfigVariableType.NUMBER
    }),
    (0, _casttopositivenumberdecorator.CastToPositiveNumber)()
], ConfigVariables.prototype, "APPLICATION_JOB_ENQUEUE_RATE_LIMITING_LIMIT", void 0);
_ts_decorate([
    (0, _configvariablesmetadatadecorator.ConfigVariablesMetadata)({
        group: _configvariablesgroupenum.ConfigVariablesGroup.RATE_LIMITING,
        description: 'Maximum number of jobs enqueued per application registration across all workspaces in the rate limiting window',
        type: _configvariabletypeenum.ConfigVariableType.NUMBER
    }),
    (0, _casttopositivenumberdecorator.CastToPositiveNumber)()
], ConfigVariables.prototype, "APPLICATION_REGISTRATION_JOB_ENQUEUE_RATE_LIMITING_LIMIT", void 0);
_ts_decorate([
    (0, _casttopositivenumberdecorator.CastToPositiveNumber)(),
    (0, _configvariablesmetadatadecorator.ConfigVariablesMetadata)({
        group: _configvariablesgroupenum.ConfigVariablesGroup.RATE_LIMITING,
        description: 'Maximum fields allowed for GQL queries',
        type: _configvariabletypeenum.ConfigVariableType.NUMBER
    })
], ConfigVariables.prototype, "GRAPHQL_MAX_FIELDS", void 0);
_ts_decorate([
    (0, _casttopositivenumberdecorator.CastToPositiveNumber)(),
    (0, _configvariablesmetadatadecorator.ConfigVariablesMetadata)({
        group: _configvariablesgroupenum.ConfigVariablesGroup.RATE_LIMITING,
        description: 'Maximum root resolvers allowed for GQL queries',
        type: _configvariabletypeenum.ConfigVariableType.NUMBER
    })
], ConfigVariables.prototype, "GRAPHQL_MAX_ROOT_RESOLVERS", void 0);
_ts_decorate([
    (0, _casttopositivenumberdecorator.CastToPositiveNumber)(),
    (0, _configvariablesmetadatadecorator.ConfigVariablesMetadata)({
        group: _configvariablesgroupenum.ConfigVariablesGroup.RATE_LIMITING,
        description: 'Maximum complexity allowed for Common API queries',
        type: _configvariabletypeenum.ConfigVariableType.NUMBER
    })
], ConfigVariables.prototype, "COMMON_QUERY_COMPLEXITY_LIMIT", void 0);
_ts_decorate([
    (0, _configvariablesmetadatadecorator.ConfigVariablesMetadata)({
        group: _configvariablesgroupenum.ConfigVariablesGroup.RATE_LIMITING,
        description: 'Time-to-live for workspace-level invitations resending rate limiting in milliseconds',
        type: _configvariabletypeenum.ConfigVariableType.NUMBER
    }),
    (0, _casttopositivenumberdecorator.CastToPositiveNumber)()
], ConfigVariables.prototype, "INVITATION_SENDING_BY_WORKSPACE_THROTTLE_TTL_IN_MS", void 0);
_ts_decorate([
    (0, _configvariablesmetadatadecorator.ConfigVariablesMetadata)({
        group: _configvariablesgroupenum.ConfigVariablesGroup.RATE_LIMITING,
        description: 'Maximum number of workspace-level invitations resending allowed in the rate limiting window',
        type: _configvariabletypeenum.ConfigVariableType.NUMBER
    }),
    (0, _casttopositivenumberdecorator.CastToPositiveNumber)()
], ConfigVariables.prototype, "INVITATION_SENDING_BY_WORKSPACE_THROTTLE_LIMIT", void 0);
_ts_decorate([
    (0, _configvariablesmetadatadecorator.ConfigVariablesMetadata)({
        group: _configvariablesgroupenum.ConfigVariablesGroup.RATE_LIMITING,
        description: 'Time-to-live for email-level invitations sending rate limiting in milliseconds',
        type: _configvariabletypeenum.ConfigVariableType.NUMBER
    }),
    (0, _casttopositivenumberdecorator.CastToPositiveNumber)()
], ConfigVariables.prototype, "INVITATION_SENDING_BY_EMAIL_THROTTLE_TTL_IN_MS", void 0);
_ts_decorate([
    (0, _configvariablesmetadatadecorator.ConfigVariablesMetadata)({
        group: _configvariablesgroupenum.ConfigVariablesGroup.RATE_LIMITING,
        description: 'Maximum number of email-level invitations sending allowed in the rate limiting window',
        type: _configvariabletypeenum.ConfigVariableType.NUMBER
    }),
    (0, _casttopositivenumberdecorator.CastToPositiveNumber)()
], ConfigVariables.prototype, "INVITATION_SENDING_BY_EMAIL_THROTTLE_LIMIT", void 0);
_ts_decorate([
    (0, _configvariablesmetadatadecorator.ConfigVariablesMetadata)({
        group: _configvariablesgroupenum.ConfigVariablesGroup.SSL,
        description: 'Path to the SSL key for enabling HTTPS in local development',
        type: _configvariabletypeenum.ConfigVariableType.STRING,
        isEnvOnly: true
    }),
    (0, _classvalidator.IsOptional)(),
    _ts_metadata("design:type", String)
], ConfigVariables.prototype, "SSL_KEY_PATH", void 0);
_ts_decorate([
    (0, _configvariablesmetadatadecorator.ConfigVariablesMetadata)({
        group: _configvariablesgroupenum.ConfigVariablesGroup.SSL,
        description: 'Path to the SSL certificate for enabling HTTPS in local development',
        type: _configvariabletypeenum.ConfigVariableType.STRING,
        isEnvOnly: true
    }),
    (0, _classvalidator.IsOptional)(),
    _ts_metadata("design:type", String)
], ConfigVariables.prototype, "SSL_CERT_PATH", void 0);
_ts_decorate([
    (0, _configvariablesmetadatadecorator.ConfigVariablesMetadata)({
        group: _configvariablesgroupenum.ConfigVariablesGroup.CLOUDFLARE_CONFIG,
        isSensitive: true,
        description: 'API key for Cloudflare integration',
        type: _configvariabletypeenum.ConfigVariableType.STRING
    }),
    (0, _classvalidator.ValidateIf)((env)=>env.CLOUDFLARE_ZONE_ID),
    _ts_metadata("design:type", String)
], ConfigVariables.prototype, "CLOUDFLARE_API_KEY", void 0);
_ts_decorate([
    (0, _configvariablesmetadatadecorator.ConfigVariablesMetadata)({
        group: _configvariablesgroupenum.ConfigVariablesGroup.CLOUDFLARE_CONFIG,
        description: 'Zone ID for Cloudflare integration',
        type: _configvariabletypeenum.ConfigVariableType.STRING
    }),
    (0, _classvalidator.ValidateIf)((env)=>env.CLOUDFLARE_API_KEY),
    _ts_metadata("design:type", String)
], ConfigVariables.prototype, "CLOUDFLARE_ZONE_ID", void 0);
_ts_decorate([
    (0, _configvariablesmetadatadecorator.ConfigVariablesMetadata)({
        group: _configvariablesgroupenum.ConfigVariablesGroup.CLOUDFLARE_CONFIG,
        description: 'Zone ID for public domain Cloudflare integration',
        type: _configvariabletypeenum.ConfigVariableType.STRING
    }),
    (0, _classvalidator.ValidateIf)((env)=>env.PUBLIC_DOMAIN_URL),
    _ts_metadata("design:type", String)
], ConfigVariables.prototype, "CLOUDFLARE_PUBLIC_DOMAIN_ZONE_ID", void 0);
_ts_decorate([
    (0, _configvariablesmetadatadecorator.ConfigVariablesMetadata)({
        group: _configvariablesgroupenum.ConfigVariablesGroup.CLOUDFLARE_CONFIG,
        description: 'Random string to validate queries from Cloudflare',
        type: _configvariabletypeenum.ConfigVariableType.STRING,
        isSensitive: true
    }),
    (0, _classvalidator.IsOptional)(),
    _ts_metadata("design:type", String)
], ConfigVariables.prototype, "CLOUDFLARE_WEBHOOK_SECRET", void 0);
_ts_decorate([
    (0, _configvariablesmetadatadecorator.ConfigVariablesMetadata)({
        group: _configvariablesgroupenum.ConfigVariablesGroup.CLOUDFLARE_CONFIG,
        description: 'Id to generate value for CNAME record to validate ownership and manage ssl for custom hostname with Cloudflare',
        type: _configvariabletypeenum.ConfigVariableType.STRING
    }),
    (0, _classvalidator.IsOptional)(),
    _ts_metadata("design:type", String)
], ConfigVariables.prototype, "CLOUDFLARE_DCV_DELEGATION_ID", void 0);
_ts_decorate([
    (0, _configvariablesmetadatadecorator.ConfigVariablesMetadata)({
        group: _configvariablesgroupenum.ConfigVariablesGroup.LLM,
        isSensitive: true,
        description: 'API key for OpenAI models (GPT, o-series)',
        type: _configvariabletypeenum.ConfigVariableType.STRING
    }),
    (0, _classvalidator.IsOptional)(),
    _ts_metadata("design:type", String)
], ConfigVariables.prototype, "OPENAI_API_KEY", void 0);
_ts_decorate([
    (0, _configvariablesmetadatadecorator.ConfigVariablesMetadata)({
        group: _configvariablesgroupenum.ConfigVariablesGroup.LLM,
        isSensitive: true,
        description: 'API key for Anthropic models (Claude)',
        type: _configvariabletypeenum.ConfigVariableType.STRING
    }),
    (0, _classvalidator.IsOptional)(),
    _ts_metadata("design:type", String)
], ConfigVariables.prototype, "ANTHROPIC_API_KEY", void 0);
_ts_decorate([
    (0, _configvariablesmetadatadecorator.ConfigVariablesMetadata)({
        group: _configvariablesgroupenum.ConfigVariablesGroup.LLM,
        isSensitive: true,
        description: 'API key for Google AI models (Gemini)',
        type: _configvariabletypeenum.ConfigVariableType.STRING
    }),
    (0, _classvalidator.IsOptional)(),
    _ts_metadata("design:type", String)
], ConfigVariables.prototype, "GOOGLE_API_KEY", void 0);
_ts_decorate([
    (0, _configvariablesmetadatadecorator.ConfigVariablesMetadata)({
        group: _configvariablesgroupenum.ConfigVariablesGroup.LLM,
        isSensitive: true,
        description: 'API key for xAI models (Grok)',
        type: _configvariabletypeenum.ConfigVariableType.STRING
    }),
    (0, _classvalidator.IsOptional)(),
    _ts_metadata("design:type", String)
], ConfigVariables.prototype, "XAI_API_KEY", void 0);
_ts_decorate([
    (0, _configvariablesmetadatadecorator.ConfigVariablesMetadata)({
        group: _configvariablesgroupenum.ConfigVariablesGroup.LLM,
        isSensitive: true,
        description: 'API key for Groq inference',
        type: _configvariabletypeenum.ConfigVariableType.STRING
    }),
    (0, _classvalidator.IsOptional)(),
    _ts_metadata("design:type", String)
], ConfigVariables.prototype, "GROQ_API_KEY", void 0);
_ts_decorate([
    (0, _configvariablesmetadatadecorator.ConfigVariablesMetadata)({
        group: _configvariablesgroupenum.ConfigVariablesGroup.LLM,
        isSensitive: true,
        description: 'API key for Mistral models',
        type: _configvariabletypeenum.ConfigVariableType.STRING
    }),
    (0, _classvalidator.IsOptional)(),
    _ts_metadata("design:type", String)
], ConfigVariables.prototype, "MISTRAL_API_KEY", void 0);
_ts_decorate([
    (0, _configvariablesmetadatadecorator.ConfigVariablesMetadata)({
        group: _configvariablesgroupenum.ConfigVariablesGroup.LLM,
        isSensitive: true,
        description: 'AI provider configurations. Custom providers are deep-merged on top of the built-in catalog (ai-providers.json). Use for custom endpoints, extra regions, or credentials set via admin panel.',
        type: _configvariabletypeenum.ConfigVariableType.JSON
    }),
    (0, _classvalidator.IsOptional)(),
    _ts_metadata("design:type", typeof AiProvidersConfig === "undefined" ? Object : AiProvidersConfig)
], ConfigVariables.prototype, "AI_PROVIDERS", void 0);
_ts_decorate([
    (0, _configvariablesmetadatadecorator.ConfigVariablesMetadata)({
        group: _configvariablesgroupenum.ConfigVariablesGroup.LLM,
        description: 'Storage path for the AI catalog override (e.g. config/ai-catalog.json). When set, the catalog is fetched from the configured storage backend at startup instead of using the built-in ai-providers.json.',
        type: _configvariabletypeenum.ConfigVariableType.STRING
    }),
    (0, _classvalidator.IsOptional)(),
    _ts_metadata("design:type", String)
], ConfigVariables.prototype, "AI_CATALOG_STORAGE_PATH", void 0);
_ts_decorate([
    (0, _configvariablesmetadatadecorator.ConfigVariablesMetadata)({
        group: _configvariablesgroupenum.ConfigVariablesGroup.LLM,
        description: 'Ordered list of fast model IDs to use as defaults. Managed via admin panel or env.',
        type: _configvariabletypeenum.ConfigVariableType.ARRAY
    }),
    (0, _classvalidator.IsOptional)(),
    _ts_metadata("design:type", Array)
], ConfigVariables.prototype, "AI_MODELS_DEFAULT_FAST", void 0);
_ts_decorate([
    (0, _configvariablesmetadatadecorator.ConfigVariablesMetadata)({
        group: _configvariablesgroupenum.ConfigVariablesGroup.LLM,
        description: 'Ordered list of smart model IDs to use as defaults. Managed via admin panel or env.',
        type: _configvariabletypeenum.ConfigVariableType.ARRAY
    }),
    (0, _classvalidator.IsOptional)(),
    _ts_metadata("design:type", Array)
], ConfigVariables.prototype, "AI_MODELS_DEFAULT_SMART", void 0);
_ts_decorate([
    (0, _configvariablesmetadatadecorator.ConfigVariablesMetadata)({
        group: _configvariablesgroupenum.ConfigVariablesGroup.LLM,
        description: 'List of recommended model IDs shown to workspaces using curated model selection. Managed via admin panel or env.',
        type: _configvariabletypeenum.ConfigVariableType.ARRAY
    }),
    (0, _classvalidator.IsOptional)(),
    _ts_metadata("design:type", Array)
], ConfigVariables.prototype, "AI_MODELS_DEFAULT_RECOMMENDED", void 0);
_ts_decorate([
    (0, _configvariablesmetadatadecorator.ConfigVariablesMetadata)({
        group: _configvariablesgroupenum.ConfigVariablesGroup.LLM,
        description: 'List of model IDs disabled by default. Disabled models cannot be used by any workspace. Managed via admin panel or env.',
        type: _configvariabletypeenum.ConfigVariableType.ARRAY
    }),
    (0, _classvalidator.IsOptional)(),
    _ts_metadata("design:type", Array)
], ConfigVariables.prototype, "AI_MODELS_DEFAULT_DISABLED", void 0);
_ts_decorate([
    (0, _configvariablesmetadatadecorator.ConfigVariablesMetadata)({
        group: _configvariablesgroupenum.ConfigVariablesGroup.SERVER_CONFIG,
        description: 'Enable or disable multi-workspace support',
        type: _configvariabletypeenum.ConfigVariableType.BOOLEAN
    }),
    (0, _classvalidator.IsOptional)()
], ConfigVariables.prototype, "IS_MULTIWORKSPACE_ENABLED", void 0);
_ts_decorate([
    (0, _configvariablesmetadatadecorator.ConfigVariablesMetadata)({
        group: _configvariablesgroupenum.ConfigVariablesGroup.ADVANCED_SETTINGS,
        description: 'Number of inactive days before sending a deletion warning for workspaces. Used in the workspace deletion cron job to determine when to send warning emails.',
        type: _configvariabletypeenum.ConfigVariableType.NUMBER
    }),
    (0, _casttopositivenumberdecorator.CastToPositiveNumber)(),
    (0, _isstrictlylowerthandecorator.IsStrictlyLowerThan)('WORKSPACE_INACTIVE_DAYS_BEFORE_SOFT_DELETION', {
        message: '"WORKSPACE_INACTIVE_DAYS_BEFORE_NOTIFICATION" should be strictly lower than "WORKSPACE_INACTIVE_DAYS_BEFORE_SOFT_DELETION"'
    })
], ConfigVariables.prototype, "WORKSPACE_INACTIVE_DAYS_BEFORE_NOTIFICATION", void 0);
_ts_decorate([
    (0, _configvariablesmetadatadecorator.ConfigVariablesMetadata)({
        group: _configvariablesgroupenum.ConfigVariablesGroup.ADVANCED_SETTINGS,
        description: 'Number of inactive days before soft deleting workspaces',
        type: _configvariabletypeenum.ConfigVariableType.NUMBER
    }),
    (0, _casttopositivenumberdecorator.CastToPositiveNumber)(),
    (0, _isstrictlylowerthandecorator.IsStrictlyLowerThan)('WORKSPACE_INACTIVE_DAYS_BEFORE_DELETION', {
        message: '"WORKSPACE_INACTIVE_DAYS_BEFORE_SOFT_DELETION" should be strictly lower than "WORKSPACE_INACTIVE_DAYS_BEFORE_DELETION"'
    })
], ConfigVariables.prototype, "WORKSPACE_INACTIVE_DAYS_BEFORE_SOFT_DELETION", void 0);
_ts_decorate([
    (0, _configvariablesmetadatadecorator.ConfigVariablesMetadata)({
        group: _configvariablesgroupenum.ConfigVariablesGroup.ADVANCED_SETTINGS,
        description: 'Number of inactive days before deleting workspaces',
        type: _configvariabletypeenum.ConfigVariableType.NUMBER
    }),
    (0, _casttopositivenumberdecorator.CastToPositiveNumber)()
], ConfigVariables.prototype, "WORKSPACE_INACTIVE_DAYS_BEFORE_DELETION", void 0);
_ts_decorate([
    (0, _configvariablesmetadatadecorator.ConfigVariablesMetadata)({
        group: _configvariablesgroupenum.ConfigVariablesGroup.ADVANCED_SETTINGS,
        description: 'Maximum number of workspaces that can be deleted in a single execution',
        type: _configvariabletypeenum.ConfigVariableType.NUMBER
    }),
    (0, _casttopositivenumberdecorator.CastToPositiveNumber)(),
    (0, _classvalidator.ValidateIf)((env)=>env.MAX_NUMBER_OF_WORKSPACES_DELETED_PER_EXECUTION > 0)
], ConfigVariables.prototype, "MAX_NUMBER_OF_WORKSPACES_DELETED_PER_EXECUTION", void 0);
_ts_decorate([
    (0, _configvariablesmetadatadecorator.ConfigVariablesMetadata)({
        group: _configvariablesgroupenum.ConfigVariablesGroup.RATE_LIMITING,
        description: 'Throttle limit for workflow execution. Remaining will not be enqueued immediately.',
        type: _configvariabletypeenum.ConfigVariableType.NUMBER
    }),
    (0, _casttopositivenumberdecorator.CastToPositiveNumber)()
], ConfigVariables.prototype, "WORKFLOW_EXEC_SOFT_THROTTLE_LIMIT", void 0);
_ts_decorate([
    (0, _configvariablesmetadatadecorator.ConfigVariablesMetadata)({
        group: _configvariablesgroupenum.ConfigVariablesGroup.RATE_LIMITING,
        description: 'Time-to-live for workflow execution throttle in milliseconds. Remaining will not be enqueued immediately.',
        type: _configvariabletypeenum.ConfigVariableType.NUMBER
    }),
    (0, _casttopositivenumberdecorator.CastToPositiveNumber)()
], ConfigVariables.prototype, "WORKFLOW_EXEC_SOFT_THROTTLE_TTL", void 0);
_ts_decorate([
    (0, _configvariablesmetadatadecorator.ConfigVariablesMetadata)({
        group: _configvariablesgroupenum.ConfigVariablesGroup.RATE_LIMITING,
        description: 'Throttle limit for workflow execution. Remaining will be marked as failed.',
        type: _configvariabletypeenum.ConfigVariableType.NUMBER
    }),
    (0, _casttopositivenumberdecorator.CastToPositiveNumber)()
], ConfigVariables.prototype, "WORKFLOW_EXEC_HARD_THROTTLE_LIMIT", void 0);
_ts_decorate([
    (0, _configvariablesmetadatadecorator.ConfigVariablesMetadata)({
        group: _configvariablesgroupenum.ConfigVariablesGroup.RATE_LIMITING,
        description: 'Time-to-live for workflow execution throttle in milliseconds. Remaining will be marked as failed.',
        type: _configvariabletypeenum.ConfigVariableType.NUMBER
    }),
    (0, _casttopositivenumberdecorator.CastToPositiveNumber)()
], ConfigVariables.prototype, "WORKFLOW_EXEC_HARD_THROTTLE_TTL", void 0);
_ts_decorate([
    (0, _configvariablesmetadatadecorator.ConfigVariablesMetadata)({
        group: _configvariablesgroupenum.ConfigVariablesGroup.CAPTCHA_CONFIG,
        description: 'Driver for captcha integration',
        type: _configvariabletypeenum.ConfigVariableType.ENUM,
        options: Object.values(_interfaces.CaptchaDriverType)
    }),
    (0, _classvalidator.IsOptional)(),
    (0, _casttouppersnakecasedecorator.CastToUpperSnakeCase)(),
    _ts_metadata("design:type", typeof _interfaces.CaptchaDriverType === "undefined" ? Object : _interfaces.CaptchaDriverType)
], ConfigVariables.prototype, "CAPTCHA_DRIVER", void 0);
_ts_decorate([
    (0, _configvariablesmetadatadecorator.ConfigVariablesMetadata)({
        group: _configvariablesgroupenum.ConfigVariablesGroup.CAPTCHA_CONFIG,
        isSensitive: true,
        description: 'Site key for captcha integration',
        type: _configvariabletypeenum.ConfigVariableType.STRING
    }),
    (0, _classvalidator.IsOptional)(),
    _ts_metadata("design:type", String)
], ConfigVariables.prototype, "CAPTCHA_SITE_KEY", void 0);
_ts_decorate([
    (0, _configvariablesmetadatadecorator.ConfigVariablesMetadata)({
        group: _configvariablesgroupenum.ConfigVariablesGroup.CAPTCHA_CONFIG,
        isSensitive: true,
        description: 'Secret key for captcha integration',
        type: _configvariabletypeenum.ConfigVariableType.STRING
    }),
    (0, _classvalidator.IsOptional)(),
    _ts_metadata("design:type", String)
], ConfigVariables.prototype, "CAPTCHA_SECRET_KEY", void 0);
_ts_decorate([
    (0, _configvariablesmetadatadecorator.ConfigVariablesMetadata)({
        group: _configvariablesgroupenum.ConfigVariablesGroup.SERVER_CONFIG,
        isSensitive: true,
        description: 'License key for the Enterprise version',
        type: _configvariabletypeenum.ConfigVariableType.STRING
    }),
    (0, _classvalidator.IsOptional)(),
    _ts_metadata("design:type", String)
], ConfigVariables.prototype, "ENTERPRISE_KEY", void 0);
_ts_decorate([
    (0, _configvariablesmetadatadecorator.ConfigVariablesMetadata)({
        group: _configvariablesgroupenum.ConfigVariablesGroup.ADVANCED_SETTINGS,
        isSensitive: true,
        description: 'Signed enterprise validity token (JWT). Used as fallback when no token is stored in the database.',
        type: _configvariabletypeenum.ConfigVariableType.STRING
    }),
    (0, _classvalidator.IsOptional)(),
    _ts_metadata("design:type", String)
], ConfigVariables.prototype, "ENTERPRISE_VALIDITY_TOKEN", void 0);
_ts_decorate([
    (0, _configvariablesmetadatadecorator.ConfigVariablesMetadata)({
        group: _configvariablesgroupenum.ConfigVariablesGroup.SERVER_CONFIG,
        description: 'Base URL for the Enterprise API on twenty.com',
        isHiddenInAdminPanel: true,
        type: _configvariabletypeenum.ConfigVariableType.STRING
    }),
    (0, _classvalidator.IsOptional)(),
    _ts_metadata("design:type", String)
], ConfigVariables.prototype, "ENTERPRISE_API_URL", void 0);
_ts_decorate([
    (0, _configvariablesmetadatadecorator.ConfigVariablesMetadata)({
        group: _configvariablesgroupenum.ConfigVariablesGroup.ADVANCED_SETTINGS,
        description: 'Health monitoring time window in minutes',
        type: _configvariabletypeenum.ConfigVariableType.NUMBER
    }),
    (0, _casttopositivenumberdecorator.CastToPositiveNumber)(),
    (0, _classvalidator.IsOptional)()
], ConfigVariables.prototype, "HEALTH_METRICS_TIME_WINDOW_IN_MINUTES", void 0);
_ts_decorate([
    (0, _configvariablesmetadatadecorator.ConfigVariablesMetadata)({
        group: _configvariablesgroupenum.ConfigVariablesGroup.ADVANCED_SETTINGS,
        description: 'Enable or disable the attachment preview feature',
        type: _configvariabletypeenum.ConfigVariableType.BOOLEAN
    }),
    (0, _classvalidator.IsOptional)()
], ConfigVariables.prototype, "IS_ATTACHMENT_PREVIEW_ENABLED", void 0);
_ts_decorate([
    (0, _configvariablesmetadatadecorator.ConfigVariablesMetadata)({
        group: _configvariablesgroupenum.ConfigVariablesGroup.SERVER_CONFIG,
        description: 'Twenty server version',
        type: _configvariabletypeenum.ConfigVariableType.STRING,
        isEnvOnly: true,
        isHiddenInAdminPanel: true
    }),
    (0, _isoptionaloremptystringdecorator.IsOptionalOrEmptyString)(),
    (0, _istwentysemverdecorator.IsTwentySemVer)(),
    _ts_metadata("design:type", String)
], ConfigVariables.prototype, "APP_VERSION", void 0);
_ts_decorate([
    (0, _configvariablesmetadatadecorator.ConfigVariablesMetadata)({
        group: _configvariablesgroupenum.ConfigVariablesGroup.ADVANCED_SETTINGS,
        description: 'Enable or disable google map api usage',
        type: _configvariabletypeenum.ConfigVariableType.BOOLEAN
    }),
    (0, _classvalidator.IsOptional)()
], ConfigVariables.prototype, "IS_MAPS_AND_ADDRESS_AUTOCOMPLETE_ENABLED", void 0);
_ts_decorate([
    (0, _configvariablesmetadatadecorator.ConfigVariablesMetadata)({
        group: _configvariablesgroupenum.ConfigVariablesGroup.ADVANCED_SETTINGS,
        isSensitive: true,
        description: 'Google map api key for places and map',
        type: _configvariabletypeenum.ConfigVariableType.STRING
    }),
    (0, _classvalidator.ValidateIf)((env)=>env.IS_MAPS_AND_ADDRESS_AUTOCOMPLETE_ENABLED),
    _ts_metadata("design:type", String)
], ConfigVariables.prototype, "GOOGLE_MAP_API_KEY", void 0);
_ts_decorate([
    (0, _configvariablesmetadatadecorator.ConfigVariablesMetadata)({
        group: _configvariablesgroupenum.ConfigVariablesGroup.ADVANCED_SETTINGS,
        isSensitive: true,
        description: 'API key for People Data Labs company enrichment. When unset, workspace company enrichment is skipped.',
        type: _configvariabletypeenum.ConfigVariableType.STRING
    }),
    (0, _classvalidator.IsOptional)(),
    _ts_metadata("design:type", String)
], ConfigVariables.prototype, "PEOPLE_DATA_LABS_API_KEY", void 0);
_ts_decorate([
    (0, _configvariablesmetadatadecorator.ConfigVariablesMetadata)({
        group: _configvariablesgroupenum.ConfigVariablesGroup.ADVANCED_SETTINGS,
        description: 'Enable or disable the AI chat that helps set up the workspace at the end of onboarding',
        type: _configvariabletypeenum.ConfigVariableType.BOOLEAN
    }),
    (0, _classvalidator.IsOptional)()
], ConfigVariables.prototype, "IS_ONBOARDING_AI_CHAT_ENABLED", void 0);
_ts_decorate([
    (0, _configvariablesmetadatadecorator.ConfigVariablesMetadata)({
        group: _configvariablesgroupenum.ConfigVariablesGroup.ADVANCED_SETTINGS,
        isSensitive: true,
        description: 'Mintlify API key for documentation search',
        isEnvOnly: true,
        isHiddenInAdminPanel: true,
        type: _configvariabletypeenum.ConfigVariableType.STRING
    }),
    (0, _classvalidator.IsOptional)(),
    _ts_metadata("design:type", String)
], ConfigVariables.prototype, "MINTLIFY_API_KEY", void 0);
_ts_decorate([
    (0, _configvariablesmetadatadecorator.ConfigVariablesMetadata)({
        group: _configvariablesgroupenum.ConfigVariablesGroup.ADVANCED_SETTINGS,
        isSensitive: true,
        description: 'Mintlify subdomain for documentation search',
        isEnvOnly: true,
        isHiddenInAdminPanel: true,
        type: _configvariabletypeenum.ConfigVariableType.STRING
    }),
    (0, _classvalidator.IsOptional)(),
    _ts_metadata("design:type", String)
], ConfigVariables.prototype, "MINTLIFY_SUBDOMAIN", void 0);
_ts_decorate([
    (0, _configvariablesmetadatadecorator.ConfigVariablesMetadata)({
        group: _configvariablesgroupenum.ConfigVariablesGroup.AWS_SES_SETTINGS,
        description: 'Driver used for the emailing domain feature — AWS_SES (requires AWS credentials), RESEND (requires a Resend API key), LOG fakes registration/verification/sends locally',
        type: _configvariabletypeenum.ConfigVariableType.ENUM,
        options: Object.values(_emailingdomaindrivertype.EmailingDomainDriver),
        isEnvOnly: true
    }),
    (0, _casttouppersnakecasedecorator.CastToUpperSnakeCase)(),
    _ts_metadata("design:type", typeof _emailingdomaindrivertype.EmailingDomainDriver === "undefined" ? Object : _emailingdomaindrivertype.EmailingDomainDriver)
], ConfigVariables.prototype, "EMAILING_DOMAIN_DRIVER", void 0);
_ts_decorate([
    (0, _configvariablesmetadatadecorator.ConfigVariablesMetadata)({
        group: _configvariablesgroupenum.ConfigVariablesGroup.AWS_SES_SETTINGS,
        description: 'AWS region',
        type: _configvariabletypeenum.ConfigVariableType.STRING
    }),
    (0, _classvalidator.ValidateIf)((env)=>env.EMAILING_DOMAIN_DRIVER === _emailingdomaindrivertype.EmailingDomainDriver.AWS_SES),
    (0, _isawsregiondecorator.IsAWSRegion)(),
    (0, _classvalidator.IsNotEmpty)(),
    _ts_metadata("design:type", typeof AwsRegion === "undefined" ? Object : AwsRegion)
], ConfigVariables.prototype, "AWS_SES_REGION", void 0);
_ts_decorate([
    (0, _configvariablesmetadatadecorator.ConfigVariablesMetadata)({
        group: _configvariablesgroupenum.ConfigVariablesGroup.AWS_SES_SETTINGS,
        isSensitive: true,
        description: 'AWS access key ID',
        type: _configvariabletypeenum.ConfigVariableType.STRING
    }),
    (0, _classvalidator.IsOptional)(),
    _ts_metadata("design:type", String)
], ConfigVariables.prototype, "AWS_SES_ACCESS_KEY_ID", void 0);
_ts_decorate([
    (0, _configvariablesmetadatadecorator.ConfigVariablesMetadata)({
        group: _configvariablesgroupenum.ConfigVariablesGroup.AWS_SES_SETTINGS,
        isSensitive: true,
        description: 'AWS session token',
        type: _configvariabletypeenum.ConfigVariableType.STRING
    }),
    (0, _classvalidator.IsOptional)(),
    _ts_metadata("design:type", String)
], ConfigVariables.prototype, "AWS_SES_SESSION_TOKEN", void 0);
_ts_decorate([
    (0, _configvariablesmetadatadecorator.ConfigVariablesMetadata)({
        group: _configvariablesgroupenum.ConfigVariablesGroup.AWS_SES_SETTINGS,
        isSensitive: true,
        description: 'AWS secret access key',
        type: _configvariabletypeenum.ConfigVariableType.STRING
    }),
    (0, _classvalidator.IsOptional)(),
    _ts_metadata("design:type", String)
], ConfigVariables.prototype, "AWS_SES_SECRET_ACCESS_KEY", void 0);
_ts_decorate([
    (0, _configvariablesmetadatadecorator.ConfigVariablesMetadata)({
        group: _configvariablesgroupenum.ConfigVariablesGroup.AWS_SES_SETTINGS,
        description: 'AWS Account ID for SES ARN construction',
        type: _configvariabletypeenum.ConfigVariableType.STRING
    }),
    (0, _classvalidator.ValidateIf)((env)=>env.EMAILING_DOMAIN_DRIVER === _emailingdomaindrivertype.EmailingDomainDriver.AWS_SES),
    (0, _classvalidator.IsString)(),
    (0, _classvalidator.IsNotEmpty)(),
    _ts_metadata("design:type", String)
], ConfigVariables.prototype, "AWS_SES_ACCOUNT_ID", void 0);
_ts_decorate([
    (0, _configvariablesmetadatadecorator.ConfigVariablesMetadata)({
        group: _configvariablesgroupenum.ConfigVariablesGroup.AWS_SES_SETTINGS,
        description: 'Domain used for email group inbound mail (the right-hand side of ch_xxx@<domain>). Required to enable email group channels.',
        type: _configvariabletypeenum.ConfigVariableType.STRING
    }),
    (0, _classvalidator.IsOptional)(),
    _ts_metadata("design:type", String)
], ConfigVariables.prototype, "INBOUND_EMAIL_DOMAIN", void 0);
_ts_decorate([
    (0, _configvariablesmetadatadecorator.ConfigVariablesMetadata)({
        group: _configvariablesgroupenum.ConfigVariablesGroup.AWS_SES_SETTINGS,
        description: 'Comma-separated list of SNS topic ARNs accepted by the inbound-email and outbound-event webhooks (e.g. arn:aws:sns:us-east-1:123:my-inbound). Every SNS payload whose topic is absent from this list is rejected.',
        type: _configvariabletypeenum.ConfigVariableType.STRING
    }),
    (0, _classvalidator.IsOptional)(),
    (0, _classvalidator.IsString)(),
    _ts_metadata("design:type", String)
], ConfigVariables.prototype, "SES_SNS_TOPIC_ARN_ALLOWLIST", void 0);
_ts_decorate([
    (0, _configvariablesmetadatadecorator.ConfigVariablesMetadata)({
        group: _configvariablesgroupenum.ConfigVariablesGroup.AWS_SES_SETTINGS,
        description: 'SNS topic ARN that receives SES DELIVERY, BOUNCE, COMPLAINT, REJECT and RENDERING_FAILURE events. An SNS event destination pointing at it is added to each workspace SES configuration set, and the topic must be subscribed to /webhooks/messaging/ses/outbound. Bounces and complaints also arrive through the pre-existing EventBridge destination, so those two are delivered twice and deduplicated downstream.',
        type: _configvariabletypeenum.ConfigVariableType.STRING
    }),
    (0, _classvalidator.IsOptional)(),
    (0, _classvalidator.IsString)(),
    _ts_metadata("design:type", String)
], ConfigVariables.prototype, "SES_OUTBOUND_SNS_TOPIC_ARN", void 0);
_ts_decorate([
    (0, _configvariablesmetadatadecorator.ConfigVariablesMetadata)({
        group: _configvariablesgroupenum.ConfigVariablesGroup.AWS_SES_SETTINGS,
        description: 'Tatami Monitor ingest webhook URL (SNS HTTPS subscription target for deliverability observability).',
        type: _configvariabletypeenum.ConfigVariableType.STRING,
        isSensitive: true
    }),
    (0, _classvalidator.IsOptional)(),
    _ts_metadata("design:type", String)
], ConfigVariables.prototype, "TATAMI_SES_WEBHOOK_URL", void 0);
_ts_decorate([
    (0, _configvariablesmetadatadecorator.ConfigVariablesMetadata)({
        group: _configvariablesgroupenum.ConfigVariablesGroup.AWS_SES_SETTINGS,
        description: 'SNS topic ARN that fans out SES events to Tatami Monitor. When set, an SNS event destination is added to each workspace SES configuration set.',
        type: _configvariabletypeenum.ConfigVariableType.STRING
    }),
    (0, _classvalidator.IsOptional)(),
    _ts_metadata("design:type", String)
], ConfigVariables.prototype, "TATAMI_SNS_TOPIC_ARN", void 0);
_ts_decorate([
    (0, _configvariablesmetadatadecorator.ConfigVariablesMetadata)({
        group: _configvariablesgroupenum.ConfigVariablesGroup.RESEND_SETTINGS,
        isSensitive: true,
        description: 'Resend API key used when EMAILING_DOMAIN_DRIVER is RESEND',
        type: _configvariabletypeenum.ConfigVariableType.STRING
    }),
    (0, _classvalidator.IsOptional)(),
    _ts_metadata("design:type", String)
], ConfigVariables.prototype, "RESEND_API_KEY", void 0);
_ts_decorate([
    (0, _configvariablesmetadatadecorator.ConfigVariablesMetadata)({
        group: _configvariablesgroupenum.ConfigVariablesGroup.RESEND_SETTINGS,
        isSensitive: true,
        description: 'Signing secret of the Resend webhook endpoint that targets /webhooks/messaging/resend (whsec_...)',
        type: _configvariabletypeenum.ConfigVariableType.STRING
    }),
    (0, _classvalidator.IsOptional)(),
    _ts_metadata("design:type", String)
], ConfigVariables.prototype, "RESEND_WEBHOOK_SIGNING_SECRET", void 0);
_ts_decorate([
    (0, _configvariablesmetadatadecorator.ConfigVariablesMetadata)({
        group: _configvariablesgroupenum.ConfigVariablesGroup.RESEND_SETTINGS,
        description: 'Region Resend provisions new emailing domains in (us-east-1, eu-west-1, sa-east-1 or ap-northeast-1). Leave empty for the Resend default.',
        type: _configvariabletypeenum.ConfigVariableType.STRING
    }),
    (0, _classvalidator.IsOptional)(),
    _ts_metadata("design:type", String)
], ConfigVariables.prototype, "RESEND_DOMAIN_REGION", void 0);
_ts_decorate([
    (0, _configvariablesmetadatadecorator.ConfigVariablesMetadata)({
        group: _configvariablesgroupenum.ConfigVariablesGroup.ADVANCED_SETTINGS,
        description: 'Timeout in milliseconds for primary database queries',
        type: _configvariabletypeenum.ConfigVariableType.NUMBER,
        isEnvOnly: true
    }),
    (0, _casttopositivenumberdecorator.CastToPositiveNumber)(),
    (0, _classvalidator.IsOptional)(),
    _ts_metadata("design:type", Number)
], ConfigVariables.prototype, "PG_DATABASE_PRIMARY_TIMEOUT_MS", void 0);
_ts_decorate([
    (0, _configvariablesmetadatadecorator.ConfigVariablesMetadata)({
        group: _configvariablesgroupenum.ConfigVariablesGroup.ADVANCED_SETTINGS,
        description: 'Timeout in milliseconds for replica database queries',
        type: _configvariabletypeenum.ConfigVariableType.NUMBER,
        isEnvOnly: true
    }),
    (0, _casttopositivenumberdecorator.CastToPositiveNumber)(),
    (0, _classvalidator.IsOptional)(),
    _ts_metadata("design:type", Number)
], ConfigVariables.prototype, "PG_DATABASE_REPLICA_TIMEOUT_MS", void 0);
_ts_decorate([
    (0, _configvariablesmetadatadecorator.ConfigVariablesMetadata)({
        group: _configvariablesgroupenum.ConfigVariablesGroup.ADVANCED_SETTINGS,
        description: 'Timeout in milliseconds for the search ILIKE fallback query per searchable object. Triggered only when the tsvector query returns 0 results on the first page (e.g. CJK input). When the timeout fires the fallback is skipped for that object.',
        type: _configvariabletypeenum.ConfigVariableType.NUMBER,
        isEnvOnly: true
    }),
    (0, _casttopositivenumberdecorator.CastToPositiveNumber)(),
    (0, _classvalidator.IsOptional)(),
    _ts_metadata("design:type", Number)
], ConfigVariables.prototype, "SEARCH_ILIKE_FALLBACK_TIMEOUT_MS", void 0);
_ts_decorate([
    (0, _configvariablesmetadatadecorator.ConfigVariablesMetadata)({
        group: _configvariablesgroupenum.ConfigVariablesGroup.ADVANCED_SETTINGS,
        description: 'Default npm registry URL for resolving app packages (e.g. https://registry.npmjs.org)',
        type: _configvariabletypeenum.ConfigVariableType.STRING
    }),
    (0, _classvalidator.IsUrl)({
        require_tld: false
    }),
    (0, _classvalidator.IsOptional)(),
    _ts_metadata("design:type", String)
], ConfigVariables.prototype, "APP_REGISTRY_URL", void 0);
_ts_decorate([
    (0, _configvariablesmetadatadecorator.ConfigVariablesMetadata)({
        group: _configvariablesgroupenum.ConfigVariablesGroup.ADVANCED_SETTINGS,
        description: 'CDN base URL for serving files from registry (e.g. https://unpkg.com)',
        type: _configvariabletypeenum.ConfigVariableType.STRING
    }),
    (0, _classvalidator.IsUrl)({
        require_tld: false
    }),
    (0, _classvalidator.IsOptional)(),
    _ts_metadata("design:type", String)
], ConfigVariables.prototype, "APP_REGISTRY_CDN_URL", void 0);
_ts_decorate([
    (0, _configvariablesmetadatadecorator.ConfigVariablesMetadata)({
        group: _configvariablesgroupenum.ConfigVariablesGroup.ADVANCED_SETTINGS,
        description: 'Client ID of the GitHub OAuth app used to verify app ownership when claiming a marketplace application',
        isHiddenInAdminPanel: true,
        type: _configvariabletypeenum.ConfigVariableType.STRING
    }),
    (0, _classvalidator.IsString)(),
    (0, _classvalidator.IsOptional)(),
    _ts_metadata("design:type", String)
], ConfigVariables.prototype, "APP_CLAIM_GITHUB_CLIENT_ID", void 0);
_ts_decorate([
    (0, _configvariablesmetadatadecorator.ConfigVariablesMetadata)({
        group: _configvariablesgroupenum.ConfigVariablesGroup.ADVANCED_SETTINGS,
        isSensitive: true,
        description: 'Client secret of the GitHub OAuth app used to verify app ownership when claiming a marketplace application',
        isHiddenInAdminPanel: true,
        type: _configvariabletypeenum.ConfigVariableType.STRING
    }),
    (0, _classvalidator.IsString)(),
    (0, _classvalidator.IsOptional)(),
    _ts_metadata("design:type", String)
], ConfigVariables.prototype, "APP_CLAIM_GITHUB_CLIENT_SECRET", void 0);
_ts_decorate([
    (0, _configvariablesmetadatadecorator.ConfigVariablesMetadata)({
        group: _configvariablesgroupenum.ConfigVariablesGroup.ADVANCED_SETTINGS,
        isSensitive: true,
        description: 'Auth token for the default npm registry (for private packages)',
        type: _configvariabletypeenum.ConfigVariableType.STRING
    }),
    (0, _classvalidator.IsOptional)(),
    _ts_metadata("design:type", String)
], ConfigVariables.prototype, "APP_REGISTRY_TOKEN", void 0);
const validate = (config)=>{
    const validatedConfig = (0, _classtransformer.plainToClass)(ConfigVariables, config);
    const validationErrors = (0, _classvalidator.validateSync)(validatedConfig, {
        strictGroups: true
    });
    const validationWarnings = (0, _classvalidator.validateSync)(validatedConfig, {
        groups: [
            'warning'
        ]
    });
    const logValidatonErrors = (errorCollection, type)=>errorCollection.forEach((error)=>{
            if (!(0, _utils.isDefined)(error.constraints) || !(0, _utils.isDefined)(error.property)) {
                return;
            }
            _common.Logger[type](Object.values(error.constraints).join('\n'));
        });
    if (validationWarnings.length > 0) {
        logValidatonErrors(validationWarnings, 'warn');
    }
    if (validationErrors.length > 0) {
        logValidatonErrors(validationErrors, 'error');
        throw new _twentyconfigexception.ConfigVariableException('Config variables validation failed', _twentyconfigexception.ConfigVariableExceptionCode.VALIDATION_FAILED);
    }
    return validatedConfig;
};

//# sourceMappingURL=config-variables.js.map