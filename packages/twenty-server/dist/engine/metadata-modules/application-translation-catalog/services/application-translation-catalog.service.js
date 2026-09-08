"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "ApplicationTranslationCatalogService", {
    enumerable: true,
    get: function() {
        return ApplicationTranslationCatalogService;
    }
});
const _common = require("@nestjs/common");
const _translations = require("twenty-shared/translations");
const _utils = require("twenty-shared/utils");
const _applicationtranslationcacheservice = require("../../../core-modules/application/application-translation/application-translation-cache.service");
const _i18nservice = require("../../../core-modules/i18n/i18n.service");
const _workspacemanyorallflatentitymapscacheservice = require("../../flat-entity/services/workspace-many-or-all-flat-entity-maps-cache.service");
const _resolveregistrationidbyapplicationidutil = require("../utils/resolve-registration-id-by-application-id.util");
const _resolvetranslatablepropertiesutil = require("../utils/resolve-translatable-properties.util");
const _gettwentystandardapplicationidorthrowutil = require("../../utils/get-twenty-standard-application-id-or-throw.util");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let ApplicationTranslationCatalogService = class ApplicationTranslationCatalogService {
    async getStandardApplicationId({ workspaceId }) {
        return (0, _gettwentystandardapplicationidorthrowutil.getTwentyStandardApplicationIdOrThrow)(await this.getFlatApplicationMaps({
            workspaceId
        }));
    }
    // Batched on purpose: one flat-maps read and one fetch per distinct
    // application, however many entities the caller is resolving.
    async getCatalogs({ applicationIds, locale, workspaceId }) {
        const flatApplicationMaps = await this.getFlatApplicationMaps({
            workspaceId
        });
        const standardApplicationId = (0, _gettwentystandardapplicationidorthrowutil.getTwentyStandardApplicationIdOrThrow)(flatApplicationMaps);
        const registrationIdByApplicationId = (0, _resolveregistrationidbyapplicationidutil.resolveRegistrationIdByApplicationId)({
            applicationIds,
            flatApplicationMaps,
            standardApplicationId
        });
        const catalogByRegistrationId = new Map(await Promise.all([
            ...new Set(registrationIdByApplicationId.values())
        ].map(async (applicationRegistrationId)=>[
                applicationRegistrationId,
                await this.applicationTranslationCacheService.getCatalog({
                    applicationRegistrationId,
                    locale
                })
            ])));
        const catalogByApplicationId = new Map();
        for (const [applicationId, applicationRegistrationId] of registrationIdByApplicationId){
            catalogByApplicationId.set(applicationId, catalogByRegistrationId.get(applicationRegistrationId));
        }
        return {
            standardApplicationId,
            catalogByApplicationId
        };
    }
    // The single-entity context. GraphQL resolves labels in per-entity
    // ResolveFields, so it passes its request dataloaders to coalesce the N
    // calls one page produces; REST resolves a whole page in one call and has
    // nothing to coalesce, so it passes none. Same resolution either way.
    async buildEffectiveEntityI18nContext({ applicationId, loaders, locale, workspaceId }) {
        const safeLocale = locale ?? _translations.SOURCE_LOCALE;
        if (!(0, _utils.isDefined)(loaders)) {
            const getI18nContext = await this.getI18nContextByApplicationId({
                applicationIds: [
                    applicationId
                ],
                locale,
                workspaceId
            });
            return getI18nContext(applicationId);
        }
        const getI18nContext = this.toI18nContextResolver({
            standardApplicationId: await loaders.standardApplicationIdLoader.load({
                workspaceId
            }),
            catalogByApplicationId: new Map((0, _utils.isDefined)(applicationId) ? [
                [
                    applicationId,
                    await loaders.applicationTranslationCatalogLoader.load({
                        applicationId,
                        workspaceId,
                        locale: safeLocale
                    })
                ]
            ] : []),
            locale
        });
        return getI18nContext(applicationId);
    }
    async getI18nContextByApplicationId({ applicationIds, locale, workspaceId }) {
        const { standardApplicationId, catalogByApplicationId } = await this.getCatalogs({
            applicationIds,
            locale: locale ?? _translations.SOURCE_LOCALE,
            workspaceId
        });
        return this.toI18nContextResolver({
            standardApplicationId,
            catalogByApplicationId,
            locale
        });
    }
    // The one place the context shape is built, so the loader-backed and
    // batched sources cannot drift apart.
    toI18nContextResolver({ standardApplicationId, catalogByApplicationId, locale }) {
        const i18nInstance = this.i18nService.getI18nInstance(locale ?? _translations.SOURCE_LOCALE);
        return (applicationId)=>({
                locale,
                i18nInstance,
                isStandardApp: applicationId === standardApplicationId,
                applicationCatalog: (0, _utils.isDefined)(applicationId) ? catalogByApplicationId.get(applicationId) : undefined
            });
    }
    // The common case: merge every resolved translatable property back onto the
    // entity it came from. Callers that present several metadata names in one
    // payload use getI18nContextByApplicationId directly instead.
    async resolveTranslatablePropertiesForEntities({ metadataName, entities, locale, workspaceId }) {
        const getI18nContext = await this.getI18nContextByApplicationId({
            applicationIds: entities.map((entity)=>entity.applicationId ?? undefined),
            locale,
            workspaceId
        });
        return entities.map((entity)=>({
                ...entity,
                ...(0, _resolvetranslatablepropertiesutil.resolveTranslatableProperties)({
                    metadataName,
                    entity,
                    i18nContext: getI18nContext(entity.applicationId ?? undefined)
                })
            }));
    }
    async getFlatApplicationMaps({ workspaceId }) {
        const { flatApplicationMaps } = await this.flatEntityMapsCacheService.getOrRecomputeManyOrAllFlatEntityMaps({
            workspaceId,
            flatMapsKeys: [
                'flatApplicationMaps'
            ]
        });
        return flatApplicationMaps;
    }
    constructor(flatEntityMapsCacheService, applicationTranslationCacheService, i18nService){
        this.flatEntityMapsCacheService = flatEntityMapsCacheService;
        this.applicationTranslationCacheService = applicationTranslationCacheService;
        this.i18nService = i18nService;
    }
};
ApplicationTranslationCatalogService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _workspacemanyorallflatentitymapscacheservice.WorkspaceManyOrAllFlatEntityMapsCacheService === "undefined" ? Object : _workspacemanyorallflatentitymapscacheservice.WorkspaceManyOrAllFlatEntityMapsCacheService,
        typeof _applicationtranslationcacheservice.ApplicationTranslationCacheService === "undefined" ? Object : _applicationtranslationcacheservice.ApplicationTranslationCacheService,
        typeof _i18nservice.I18nService === "undefined" ? Object : _i18nservice.I18nService
    ])
], ApplicationTranslationCatalogService);

//# sourceMappingURL=application-translation-catalog.service.js.map