"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "MetadataEventResolutionService", {
    enumerable: true,
    get: function() {
        return MetadataEventResolutionService;
    }
});
const _common = require("@nestjs/common");
const _translations = require("twenty-shared/translations");
const _utils = require("twenty-shared/utils");
const _i18nservice = require("../../../core-modules/i18n/i18n.service");
const _applicationtranslationcatalogservice = require("../../../metadata-modules/application-translation-catalog/services/application-translation-catalog.service");
const _workspacemanyorallflatentitymapscacheservice = require("../../../metadata-modules/flat-entity/services/workspace-many-or-all-flat-entity-maps-cache.service");
const _interpolatenavigationcommandmenuitemeventutil = require("../utils/interpolate-navigation-command-menu-item-event.util");
const _istranslatablemetadatanameutil = require("../utils/is-translatable-metadata-name.util");
const _resolvemetadataeventrecordutil = require("../utils/resolve-metadata-event-record.util");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
const RECORD_KEYS = [
    'before',
    'after'
];
const readRecordApplicationId = (record)=>typeof record?.applicationId === 'string' ? record.applicationId : undefined;
const recordCarriesOverrides = (record)=>(0, _utils.isDefined)(record) && (0, _utils.isDefined)(record.overrides);
const EMPTY_CATALOGS = {
    standardApplicationId: undefined,
    catalogByApplicationId: new Map()
};
let MetadataEventResolutionService = class MetadataEventResolutionService {
    async resolveMetadataEvents({ metadataEvents, locale, workspaceId }) {
        const translatableEvents = metadataEvents.filter((metadataEvent)=>(0, _istranslatablemetadatanameutil.isTranslatableMetadataName)(metadataEvent.metadataName));
        const carriesOverrides = metadataEvents.some((metadataEvent)=>RECORD_KEYS.some((key)=>recordCarriesOverrides(metadataEvent.properties[key])));
        if (translatableEvents.length === 0 && !carriesOverrides) {
            return metadataEvents;
        }
        const safeLocale = locale ?? _translations.SOURCE_LOCALE;
        const { standardApplicationId, catalogByApplicationId } = translatableEvents.length > 0 ? await this.applicationTranslationCatalogService.getCatalogs({
            applicationIds: translatableEvents.flatMap((metadataEvent)=>RECORD_KEYS.map((key)=>readRecordApplicationId(metadataEvent.properties[key]))),
            locale: safeLocale,
            workspaceId
        }) : EMPTY_CATALOGS;
        const i18nInstance = this.i18nService.getI18nInstance(safeLocale);
        const buildI18nContext = (applicationId)=>({
                locale,
                i18nInstance,
                isStandardApp: applicationId === standardApplicationId,
                applicationCatalog: (0, _utils.isDefined)(applicationId) ? catalogByApplicationId.get(applicationId) : undefined
            });
        const flatObjectMetadataMaps = metadataEvents.some((metadataEvent)=>metadataEvent.metadataName === 'commandMenuItem') ? (await this.flatEntityMapsCacheService.getOrRecomputeManyOrAllFlatEntityMaps({
            workspaceId,
            flatMapsKeys: [
                'flatObjectMetadataMaps'
            ]
        })).flatObjectMetadataMaps : undefined;
        return metadataEvents.map((metadataEvent)=>{
            const { metadataName } = metadataEvent;
            const properties = {
                ...metadataEvent.properties
            };
            for (const key of RECORD_KEYS){
                const record = properties[key];
                if (!(0, _utils.isDefined)(record)) {
                    continue;
                }
                const resolvedRecord = (0, _resolvemetadataeventrecordutil.resolveMetadataEventRecord)({
                    metadataName,
                    record,
                    i18nContext: buildI18nContext(readRecordApplicationId(record))
                });
                properties[key] = metadataName === 'commandMenuItem' && (0, _utils.isDefined)(flatObjectMetadataMaps) ? (0, _interpolatenavigationcommandmenuitemeventutil.interpolateNavigationCommandMenuItemEvent)({
                    record: resolvedRecord,
                    flatObjectMetadataMaps,
                    buildI18nContext
                }) : resolvedRecord;
            }
            return {
                ...metadataEvent,
                properties
            };
        });
    }
    constructor(i18nService, applicationTranslationCatalogService, flatEntityMapsCacheService){
        this.i18nService = i18nService;
        this.applicationTranslationCatalogService = applicationTranslationCatalogService;
        this.flatEntityMapsCacheService = flatEntityMapsCacheService;
    }
};
MetadataEventResolutionService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _i18nservice.I18nService === "undefined" ? Object : _i18nservice.I18nService,
        typeof _applicationtranslationcatalogservice.ApplicationTranslationCatalogService === "undefined" ? Object : _applicationtranslationcatalogservice.ApplicationTranslationCatalogService,
        typeof _workspacemanyorallflatentitymapscacheservice.WorkspaceManyOrAllFlatEntityMapsCacheService === "undefined" ? Object : _workspacemanyorallflatentitymapscacheservice.WorkspaceManyOrAllFlatEntityMapsCacheService
    ])
], MetadataEventResolutionService);

//# sourceMappingURL=metadata-event-resolution.service.js.map