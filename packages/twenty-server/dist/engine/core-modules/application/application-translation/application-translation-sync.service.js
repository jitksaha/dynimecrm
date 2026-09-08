"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "ApplicationTranslationSyncService", {
    enumerable: true,
    get: function() {
        return ApplicationTranslationSyncService;
    }
});
const _common = require("@nestjs/common");
const _typeorm = require("@nestjs/typeorm");
const _utils = require("twenty-shared/utils");
const _typeorm1 = require("typeorm");
const _applicationtranslationcacheservice = require("./application-translation-cache.service");
const _applicationtranslationentity = require("./application-translation.entity");
const _computeapplicationtranslationsyncplanutil = require("./utils/compute-application-translation-sync-plan.util");
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
let ApplicationTranslationSyncService = class ApplicationTranslationSyncService {
    async syncFromManifest({ applicationRegistrationId, translations }) {
        // Absence says nothing about translations, so it must not prune: this
        // table is cross-workspace, and a sync from a toolchain that does not
        // compile them would drop the locales an app published, everywhere.
        if (!(0, _utils.isDefined)(translations)) {
            return;
        }
        const existingRows = await this.applicationTranslationRepository.find({
            where: {
                applicationRegistrationId
            },
            withDeleted: true
        });
        const { rowsToUpdate, rowsToInsert, rowIdsToSoftDelete } = (0, _computeapplicationtranslationsyncplanutil.computeApplicationTranslationSyncPlan)({
            existingRows,
            translations
        });
        await Promise.all([
            ...rowsToUpdate.map(({ id, messages })=>this.applicationTranslationRepository.update(id, {
                    messages,
                    deletedAt: null
                })),
            ...rowsToInsert.map(({ locale, messages })=>this.applicationTranslationRepository.insert({
                    applicationRegistrationId,
                    locale,
                    messages
                }))
        ]);
        if (rowIdsToSoftDelete.length > 0) {
            await this.applicationTranslationRepository.softDelete(rowIdsToSoftDelete);
        }
        await this.applicationTranslationCacheService.invalidate(applicationRegistrationId);
    }
    constructor(// applicationTranslation is a core cross-workspace table keyed by applicationRegistrationId, not workspaceId.
    // eslint-disable-next-line twenty/prefer-workspace-scoped-repository
    applicationTranslationRepository, applicationTranslationCacheService){
        this.applicationTranslationRepository = applicationTranslationRepository;
        this.applicationTranslationCacheService = applicationTranslationCacheService;
    }
};
ApplicationTranslationSyncService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_param(0, (0, _typeorm.InjectRepository)(_applicationtranslationentity.ApplicationTranslationEntity)),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _typeorm1.Repository === "undefined" ? Object : _typeorm1.Repository,
        typeof _applicationtranslationcacheservice.ApplicationTranslationCacheService === "undefined" ? Object : _applicationtranslationcacheservice.ApplicationTranslationCacheService
    ])
], ApplicationTranslationSyncService);

//# sourceMappingURL=application-translation-sync.service.js.map