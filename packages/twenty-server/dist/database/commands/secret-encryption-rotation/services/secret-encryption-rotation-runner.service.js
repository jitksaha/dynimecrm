"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "SecretEncryptionRotationRunnerService", {
    enumerable: true,
    get: function() {
        return SecretEncryptionRotationRunnerService;
    }
});
const _common = require("@nestjs/common");
const _core = require("@nestjs/core");
const _typeorm = require("@nestjs/typeorm");
const _perf_hooks = require("perf_hooks");
const _typeorm1 = require("typeorm");
const _secretencryptionrotationsiteentriesconstant = require("../constants/secret-encryption-rotation-site-entries.constant");
const _columnrotationsitehandler = require("../handlers/column-rotation-site.handler");
const _secretencryptionservice = require("../../../../engine/core-modules/secret-encryption/secret-encryption.service");
const _computeencryptionkeyidutil = require("../../../../engine/core-modules/secret-encryption/utils/compute-encryption-key-id.util");
const _resolveencryptionkeysorthrowutil = require("../../../../engine/core-modules/secret-encryption/utils/resolve-encryption-keys-or-throw.util");
const _environmentconfigdriver = require("../../../../engine/core-modules/twenty-config/drivers/environment-config.driver");
const _utils = require("twenty-shared/utils");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
function _ts_param(paramIndex, decorator) {
    return function(target, key) {
        decorator(target, key, paramIndex);
    };
}
let SecretEncryptionRotationRunnerService = class SecretEncryptionRotationRunnerService {
    onModuleInit() {
        for (const entry of Object.values(_secretencryptionrotationsiteentriesconstant.SECRET_ENCRYPTION_ROTATION_SITE_ENTRIES)){
            const repository = this.coreDataSource.getRepository(entry.entity);
            for (const [encryptedColumn, meta] of (0, _utils.typedObjectEntries)(entry.columnSiteNames)){
                const handler = (0, _utils.isDefined)(meta.customHandler) ? this.moduleRef.get(meta.customHandler) : new _columnrotationsitehandler.ColumnRotationSiteHandler({
                    repository,
                    encryptedColumn,
                    isWorkspaceScoped: meta.isWorkspaceScoped,
                    extraWhere: meta.extraWhere
                }, this.secretEncryptionService);
                this.handlersBySiteName.set(meta.siteName, handler);
            }
        }
        for (const entry of Object.values(_secretencryptionrotationsiteentriesconstant.SECRET_ENCRYPTION_ROTATION_UNTYPED_SITE_ENTRIES)){
            this.handlersBySiteName.set(entry.siteName, this.moduleRef.get(entry.handler));
        }
    }
    listSiteNames() {
        return Array.from(this.handlersBySiteName.keys());
    }
    async run(options) {
        const { primary: currentEncryptionKey, fallback: fallbackEncryptionKey } = (0, _resolveencryptionkeysorthrowutil.resolveEncryptionKeysOrThrow)({
            environmentConfigDriver: this.environmentConfigDriver
        });
        const currentEncryptionKeyId = (0, _computeencryptionkeyidutil.computeEncryptionKeyId)({
            rawKey: currentEncryptionKey
        });
        const fallbackEncryptionKeyId = (0, _utils.isDefined)(fallbackEncryptionKey) ? (0, _computeencryptionkeyidutil.computeEncryptionKeyId)({
            rawKey: fallbackEncryptionKey
        }) : null;
        this.logger.log(`[secret-encryption:rotate] current encryption key id: ${currentEncryptionKeyId}${options.dryRun ? ' (dry-run)' : ''}`);
        if ((0, _utils.isDefined)(fallbackEncryptionKeyId)) {
            this.logger.log(`[secret-encryption:rotate] fallback encryption key id: ${fallbackEncryptionKeyId}`);
        } else {
            this.logger.warn('[secret-encryption:rotate] FALLBACK_ENCRYPTION_KEY is not set — rows encrypted under a previous ENCRYPTION_KEY cannot be decrypted by this command. Set FALLBACK_ENCRYPTION_KEY to the previous ENCRYPTION_KEY before running rotation.');
        }
        const handlersToRun = this.resolveHandlersToRun(options.site);
        const startedAt = _perf_hooks.performance.now();
        const results = [];
        for (const [siteName, handler] of handlersToRun){
            const siteStartedAt = _perf_hooks.performance.now();
            const remainingBefore = await handler.countRemaining({
                siteName,
                currentEncryptionKeyId
            });
            this.logger.log(`[${siteName}] start: ${remainingBefore} row(s) need rotation`);
            const { rotated, skipped, errors } = await handler.rotate({
                siteName,
                currentEncryptionKeyId,
                batchSize: options.batchSize,
                dryRun: options.dryRun
            });
            const durationMs = Math.round(_perf_hooks.performance.now() - siteStartedAt);
            const result = {
                siteName,
                remainingBefore,
                rotated,
                skipped,
                errors,
                durationMs
            };
            results.push(result);
            this.logger.log(`[${siteName}] DONE in ${durationMs}ms — rotated=${rotated} skipped=${skipped} errors=${errors}`);
        }
        const totalDurationMs = Math.round(_perf_hooks.performance.now() - startedAt);
        this.logSummary({
            currentEncryptionKeyId,
            fallbackEncryptionKeyId,
            results,
            totalDurationMs
        });
        return {
            currentEncryptionKeyId,
            fallbackEncryptionKeyId,
            results,
            totalDurationMs
        };
    }
    resolveHandlersToRun(site) {
        if (!(0, _utils.isDefined)(site)) {
            return Array.from(this.handlersBySiteName.entries());
        }
        const siteName = site;
        const handler = this.handlersBySiteName.get(siteName);
        if (!(0, _utils.isDefined)(handler)) {
            throw new Error(`Unknown rotation site: '${site}'. Known sites: ${this.listSiteNames().join(', ')}.`);
        }
        return [
            [
                siteName,
                handler
            ]
        ];
    }
    logSummary(summary) {
        const totalRotated = summary.results.reduce((sum, result)=>sum + result.rotated, 0);
        const totalSkipped = summary.results.reduce((sum, result)=>sum + result.skipped, 0);
        const totalErrors = summary.results.reduce((sum, result)=>sum + result.errors, 0);
        this.logger.log('[secret-encryption:rotate] summary');
        for (const result of summary.results){
            this.logger.log(`  ${result.siteName.padEnd(36)} rotated=${result.rotated} skipped=${result.skipped} errors=${result.errors} (${result.durationMs}ms)`);
        }
        this.logger.log(`[secret-encryption:rotate] all sites complete in ${summary.totalDurationMs}ms — rotated=${totalRotated} skipped=${totalSkipped} errors=${totalErrors}`);
    }
    constructor(environmentConfigDriver, secretEncryptionService, coreDataSource, moduleRef){
        this.environmentConfigDriver = environmentConfigDriver;
        this.secretEncryptionService = secretEncryptionService;
        this.coreDataSource = coreDataSource;
        this.moduleRef = moduleRef;
        this.logger = new _common.Logger(SecretEncryptionRotationRunnerService.name);
        this.handlersBySiteName = new Map();
    }
};
SecretEncryptionRotationRunnerService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_param(2, (0, _typeorm.InjectDataSource)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _environmentconfigdriver.EnvironmentConfigDriver === "undefined" ? Object : _environmentconfigdriver.EnvironmentConfigDriver,
        typeof _secretencryptionservice.SecretEncryptionService === "undefined" ? Object : _secretencryptionservice.SecretEncryptionService,
        typeof _typeorm1.DataSource === "undefined" ? Object : _typeorm1.DataSource,
        typeof _core.ModuleRef === "undefined" ? Object : _core.ModuleRef
    ])
], SecretEncryptionRotationRunnerService);

//# sourceMappingURL=secret-encryption-rotation-runner.service.js.map