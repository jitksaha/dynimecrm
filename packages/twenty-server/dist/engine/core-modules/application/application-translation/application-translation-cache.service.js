"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "ApplicationTranslationCacheService", {
    enumerable: true,
    get: function() {
        return ApplicationTranslationCacheService;
    }
});
const _common = require("@nestjs/common");
const _typeorm = require("@nestjs/typeorm");
const _typeorm1 = require("typeorm");
const _applicationtranslationentity = require("./application-translation.entity");
const _promisememoizerstorage = require("../../../twenty-orm/storage/promise-memoizer.storage");
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
const CACHE_TTL_MS = 30_000;
const EMPTY_CATALOG = {};
let ApplicationTranslationCacheService = class ApplicationTranslationCacheService {
    async getCatalog({ applicationRegistrationId, locale }) {
        const catalogsByLocale = await this.catalogsMemoizer.memoizePromiseAndExecute(this.getCacheKey(applicationRegistrationId), ()=>this.loadCatalogsByLocale(applicationRegistrationId));
        return catalogsByLocale?.[locale] ?? EMPTY_CATALOG;
    }
    async invalidate(applicationRegistrationId) {
        await this.catalogsMemoizer.clearKeys(this.getCacheKey(applicationRegistrationId));
    }
    getCacheKey(applicationRegistrationId) {
        return `applicationTranslation-${applicationRegistrationId}`;
    }
    async loadCatalogsByLocale(applicationRegistrationId) {
        const rows = await this.applicationTranslationRepository.find({
            where: {
                applicationRegistrationId
            }
        });
        const catalogsByLocale = {};
        for (const row of rows){
            catalogsByLocale[row.locale] = row.messages;
        }
        return catalogsByLocale;
    }
    constructor(// applicationTranslation is a core cross-workspace table keyed by applicationRegistrationId, not workspaceId.
    // eslint-disable-next-line twenty/prefer-workspace-scoped-repository
    applicationTranslationRepository){
        this.applicationTranslationRepository = applicationTranslationRepository;
        this.catalogsMemoizer = new _promisememoizerstorage.PromiseMemoizer(CACHE_TTL_MS);
    }
};
ApplicationTranslationCacheService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_param(0, (0, _typeorm.InjectRepository)(_applicationtranslationentity.ApplicationTranslationEntity)),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _typeorm1.Repository === "undefined" ? Object : _typeorm1.Repository
    ])
], ApplicationTranslationCacheService);

//# sourceMappingURL=application-translation-cache.service.js.map