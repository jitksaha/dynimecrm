"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "MetadataTranslationService", {
    enumerable: true,
    get: function() {
        return MetadataTranslationService;
    }
});
const _common = require("@nestjs/common");
const _guards = require("@sniptt/guards");
const _translations = require("twenty-shared/translations");
const _utils = require("twenty-shared/utils");
const _graphqlerrorsutil = require("../../../core-modules/graphql/utils/graphql-errors.util");
const _i18nservice = require("../../../core-modules/i18n/i18n.service");
const _applicationtranslationcatalogservice = require("../../application-translation-catalog/services/application-translation-catalog.service");
const _alltranslatablepropertiesbymetadatanameconstant = require("../../flat-entity/constant/all-translatable-properties-by-metadata-name.constant");
const _workspacemanyorallflatentitymapscacheservice = require("../../flat-entity/services/workspace-many-or-all-flat-entity-maps-cache.service");
const _findflatentitybyidinflatentitymapsutil = require("../../flat-entity/utils/find-flat-entity-by-id-in-flat-entity-maps.util");
const _metadatatranslationdto = require("../dtos/metadata-translation.dto");
const _resolveeffectiveentitypropertyutil = require("../../utils/resolve-effective-entity-property.util");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
// The registry decides which property to read, so this is where a dynamic
// name meets the concrete entity type.
const readStringProperty = (entity, property)=>{
    const value = entity[property];
    return typeof value === 'string' ? value : '';
};
const resolveProvenance = ({ workspaceTranslation, value, canonicalValue })=>{
    if ((0, _utils.isDefined)(workspaceTranslation)) {
        return _metadatatranslationdto.MetadataTranslationProvenance.WORKSPACE;
    }
    if (value !== canonicalValue) {
        return _metadatatranslationdto.MetadataTranslationProvenance.SHIPPED;
    }
    return _metadatatranslationdto.MetadataTranslationProvenance.INHERITED;
};
let MetadataTranslationService = class MetadataTranslationService {
    async findMetadataTranslations({ input, workspaceId }) {
        const translatableEntity = await this.findTranslatableEntity({
            input,
            workspaceId
        });
        if (!(0, _utils.isDefined)(translatableEntity)) {
            return [];
        }
        const { metadataName, recordId, objectMetadataId, applicationId, entity } = translatableEntity;
        const overrides = entity.overrides;
        const locales = (0, _utils.isDefined)(input.locale) ? [
            input.locale
        ] : Object.keys(_translations.APP_LOCALES);
        const translations = [];
        for (const locale of locales){
            const { standardApplicationId, catalogByApplicationId } = await this.applicationTranslationCatalogService.getCatalogs({
                applicationIds: [
                    applicationId
                ],
                locale,
                workspaceId
            });
            const i18nInstance = this.i18nService.getI18nInstance(locale);
            for (const property of _alltranslatablepropertiesbymetadatanameconstant.ALL_TRANSLATABLE_PROPERTIES_BY_METADATA_NAME[metadataName] ?? []){
                const sourceValue = readStringProperty(entity, property);
                const overrideValue = overrides?.[property];
                const canonicalValue = (0, _guards.isNonEmptyString)(overrideValue) ? overrideValue : sourceValue;
                if (canonicalValue === '') {
                    continue;
                }
                const value = (0, _resolveeffectiveentitypropertyutil.resolveEffectiveEntityPropertyByName)({
                    metadataName,
                    baseValue: sourceValue,
                    overrides,
                    property,
                    i18nContext: {
                        locale,
                        i18nInstance,
                        isStandardApp: applicationId === standardApplicationId,
                        applicationCatalog: (0, _utils.isDefined)(applicationId) ? catalogByApplicationId.get(applicationId) : undefined
                    }
                });
                translations.push({
                    metadataName,
                    recordId,
                    objectMetadataId,
                    property,
                    locale,
                    sourceValue,
                    canonicalValue,
                    value,
                    provenance: resolveProvenance({
                        workspaceTranslation: (0, _resolveeffectiveentitypropertyutil.readOverrideTranslation)({
                            overrides,
                            locale,
                            property
                        }),
                        value,
                        canonicalValue
                    })
                });
            }
        }
        return translations;
    }
    async findTranslatableEntity({ input, workspaceId }) {
        const { flatObjectMetadataMaps, flatFieldMetadataMaps } = await this.flatEntityMapsCacheService.getOrRecomputeManyOrAllFlatEntityMaps({
            workspaceId,
            flatMapsKeys: [
                'flatObjectMetadataMaps',
                'flatFieldMetadataMaps'
            ]
        });
        if ((0, _utils.isDefined)(input.objectMetadataId)) {
            const flatObjectMetadata = (0, _findflatentitybyidinflatentitymapsutil.findFlatEntityByIdInFlatEntityMaps)({
                flatEntityMaps: flatObjectMetadataMaps,
                flatEntityId: input.objectMetadataId
            });
            return (0, _utils.isDefined)(flatObjectMetadata) ? {
                metadataName: 'objectMetadata',
                recordId: flatObjectMetadata.id,
                objectMetadataId: null,
                applicationId: flatObjectMetadata.applicationId ?? undefined,
                entity: flatObjectMetadata
            } : null;
        }
        if ((0, _utils.isDefined)(input.fieldMetadataId)) {
            const flatFieldMetadata = (0, _findflatentitybyidinflatentitymapsutil.findFlatEntityByIdInFlatEntityMaps)({
                flatEntityMaps: flatFieldMetadataMaps,
                flatEntityId: input.fieldMetadataId
            });
            return (0, _utils.isDefined)(flatFieldMetadata) ? {
                metadataName: 'fieldMetadata',
                recordId: flatFieldMetadata.id,
                objectMetadataId: flatFieldMetadata.objectMetadataId,
                applicationId: flatFieldMetadata.applicationId ?? undefined,
                entity: flatFieldMetadata
            } : null;
        }
        throw new _graphqlerrorsutil.UserInputError('metadataTranslations requires an objectMetadataId or a fieldMetadataId');
    }
    constructor(flatEntityMapsCacheService, applicationTranslationCatalogService, i18nService){
        this.flatEntityMapsCacheService = flatEntityMapsCacheService;
        this.applicationTranslationCatalogService = applicationTranslationCatalogService;
        this.i18nService = i18nService;
    }
};
MetadataTranslationService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _workspacemanyorallflatentitymapscacheservice.WorkspaceManyOrAllFlatEntityMapsCacheService === "undefined" ? Object : _workspacemanyorallflatentitymapscacheservice.WorkspaceManyOrAllFlatEntityMapsCacheService,
        typeof _applicationtranslationcatalogservice.ApplicationTranslationCatalogService === "undefined" ? Object : _applicationtranslationcatalogservice.ApplicationTranslationCatalogService,
        typeof _i18nservice.I18nService === "undefined" ? Object : _i18nservice.I18nService
    ])
], MetadataTranslationService);

//# sourceMappingURL=metadata-translation.service.js.map