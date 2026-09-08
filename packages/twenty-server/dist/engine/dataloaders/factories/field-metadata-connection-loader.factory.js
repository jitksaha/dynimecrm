"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "FieldMetadataConnectionLoaderFactory", {
    enumerable: true,
    get: function() {
        return FieldMetadataConnectionLoaderFactory;
    }
});
const _common = require("@nestjs/common");
const _dataloader = /*#__PURE__*/ _interop_require_default(require("dataloader"));
const _translations = require("twenty-shared/translations");
const _types = require("twenty-shared/types");
const _applicationtranslationcatalogservice = require("../../metadata-modules/application-translation-catalog/services/application-translation-catalog.service");
const _i18nservice = require("../../core-modules/i18n/i18n.service");
const _fieldfilterinput = require("../../metadata-modules/field-metadata/dtos/field-filter.input");
const _workspacemanyorallflatentitymapscacheservice = require("../../metadata-modules/flat-entity/services/workspace-many-or-all-flat-entity-maps-cache.service");
const _findflatentitybyidinflatentitymapsorthrowutil = require("../../metadata-modules/flat-entity/utils/find-flat-entity-by-id-in-flat-entity-maps-or-throw.util");
const _findmanyflatentitybyidinflatentitymapsorthrowutil = require("../../metadata-modules/flat-entity/utils/find-many-flat-entity-by-id-in-flat-entity-maps-or-throw.util");
const _alloverridablepropertiesbymetadatanameconstant = require("../../metadata-modules/flat-entity/constant/all-overridable-properties-by-metadata-name.constant");
const _fromflatfieldmetadatatofieldmetadatadtoutil = require("../../metadata-modules/flat-field-metadata/utils/from-flat-field-metadata-to-field-metadata-dto.util");
const _isflatfieldmetadataoftypeutil = require("../../metadata-modules/flat-field-metadata/utils/is-flat-field-metadata-of-type.util");
const _belongstotwentystandardapputil = require("../../metadata-modules/utils/belongs-to-twenty-standard-app.util");
const _resolveeffectiveentitypropertyutil = require("../../metadata-modules/utils/resolve-effective-entity-property.util");
const _getmorphnamefrommorphfieldmetadatanameutil = require("../../metadata-modules/flat-object-metadata/utils/get-morph-name-from-morph-field-metadata-name.util");
const _applymetadatafiltertoitemsutil = require("../../metadata-modules/pagination/utils/apply-metadata-filter-to-items.util");
const _findmanyitemswithcursorpaginationutil = require("../../metadata-modules/pagination/utils/find-many-items-with-cursor-pagination.util");
const _filtermorphrelationduplicatefieldsutil = require("../utils/filter-morph-relation-duplicate-fields.util");
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let FieldMetadataConnectionLoaderFactory = class FieldMetadataConnectionLoaderFactory {
    create() {
        return new _dataloader.default(async (dataLoaderParams)=>{
            const locale = dataLoaderParams[0].locale;
            const safeLocale = locale ?? _translations.SOURCE_LOCALE;
            const i18nInstance = this.i18nService.getI18nInstance(safeLocale);
            const workspaceId = dataLoaderParams[0].workspaceId;
            const { flatFieldMetadataMaps, flatObjectMetadataMaps } = await this.flatEntityMapsCacheService.getOrRecomputeManyOrAllFlatEntityMaps({
                workspaceId,
                flatMapsKeys: [
                    'flatFieldMetadataMaps',
                    'flatObjectMetadataMaps'
                ]
            });
            const connections = dataLoaderParams.map(({ objectMetadata, paging, filter })=>{
                const flatObjectMetadata = (0, _findflatentitybyidinflatentitymapsorthrowutil.findFlatEntityByIdInFlatEntityMapsOrThrow)({
                    flatEntityId: objectMetadata.id,
                    flatEntityMaps: flatObjectMetadataMaps
                });
                const flatFieldMetadatas = (0, _findmanyflatentitybyidinflatentitymapsorthrowutil.findManyFlatEntityByIdInFlatEntityMapsOrThrow)({
                    flatEntityIds: flatObjectMetadata.fieldIds,
                    flatEntityMaps: flatFieldMetadataMaps
                });
                const filteredFlatFieldMetadatas = (0, _applymetadatafiltertoitemsutil.applyMetadataFilterToItems)({
                    items: (0, _filtermorphrelationduplicatefieldsutil.filterMorphRelationDuplicateFields)(flatFieldMetadatas),
                    filter,
                    columnByFilterField: _fieldfilterinput.FIELD_FILTER_COLUMN_BY_FILTER_FIELD
                });
                return (0, _findmanyitemswithcursorpaginationutil.findManyItemsWithCursorPagination)({
                    items: filteredFlatFieldMetadatas,
                    paging
                });
            });
            const selectedFlatFieldMetadatas = connections.flatMap((connection)=>connection.edges.map(({ node })=>node));
            const { catalogByApplicationId: applicationCatalogByApplicationId } = await this.applicationTranslationCatalogService.getCatalogs({
                applicationIds: selectedFlatFieldMetadatas.map((flatFieldMetadata)=>flatFieldMetadata.applicationId),
                locale: safeLocale,
                workspaceId
            });
            return connections.map((connection)=>({
                    ...connection,
                    edges: connection.edges.map((edge)=>{
                        const flatFieldMetadata = edge.node;
                        const applicationCatalog = applicationCatalogByApplicationId.get(flatFieldMetadata.applicationId);
                        const overrides = flatFieldMetadata.overrides ?? undefined;
                        const i18nContext = {
                            locale,
                            i18nInstance,
                            isStandardApp: (0, _belongstotwentystandardapputil.belongsToTwentyStandardApp)(flatFieldMetadata),
                            applicationCatalog
                        };
                        const overriddenFlatFieldMetadata = _alloverridablepropertiesbymetadatanameconstant.ALL_OVERRIDABLE_PROPERTIES_BY_METADATA_NAME.fieldMetadata.reduce((acc, property)=>({
                                ...acc,
                                [property]: (0, _resolveeffectiveentitypropertyutil.resolveEffectiveEntityProperty)({
                                    metadataName: 'fieldMetadata',
                                    baseValue: flatFieldMetadata[property],
                                    overrides,
                                    property,
                                    i18nContext
                                })
                            }), flatFieldMetadata);
                        let renamedFlatFieldMetadata = overriddenFlatFieldMetadata;
                        if ((0, _isflatfieldmetadataoftypeutil.isFlatFieldMetadataOfType)(overriddenFlatFieldMetadata, _types.FieldMetadataType.MORPH_RELATION)) {
                            const relationTargetObjectMetadata = (0, _findflatentitybyidinflatentitymapsorthrowutil.findFlatEntityByIdInFlatEntityMapsOrThrow)({
                                flatEntityId: overriddenFlatFieldMetadata.relationTargetObjectMetadataId,
                                flatEntityMaps: flatObjectMetadataMaps
                            });
                            renamedFlatFieldMetadata = {
                                ...overriddenFlatFieldMetadata,
                                name: (0, _getmorphnamefrommorphfieldmetadatanameutil.getMorphNameFromMorphFieldMetadataName)({
                                    morphRelationFlatFieldMetadata: overriddenFlatFieldMetadata,
                                    nameSingular: relationTargetObjectMetadata.nameSingular,
                                    namePlural: relationTargetObjectMetadata.namePlural
                                })
                            };
                        }
                        return {
                            ...edge,
                            node: (0, _fromflatfieldmetadatatofieldmetadatadtoutil.fromFlatFieldMetadataToFieldMetadataDto)(renamedFlatFieldMetadata)
                        };
                    })
                }));
        });
    }
    constructor(i18nService, flatEntityMapsCacheService, applicationTranslationCatalogService){
        this.i18nService = i18nService;
        this.flatEntityMapsCacheService = flatEntityMapsCacheService;
        this.applicationTranslationCatalogService = applicationTranslationCatalogService;
    }
};
FieldMetadataConnectionLoaderFactory = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _i18nservice.I18nService === "undefined" ? Object : _i18nservice.I18nService,
        typeof _workspacemanyorallflatentitymapscacheservice.WorkspaceManyOrAllFlatEntityMapsCacheService === "undefined" ? Object : _workspacemanyorallflatentitymapscacheservice.WorkspaceManyOrAllFlatEntityMapsCacheService,
        typeof _applicationtranslationcatalogservice.ApplicationTranslationCatalogService === "undefined" ? Object : _applicationtranslationcatalogservice.ApplicationTranslationCatalogService
    ])
], FieldMetadataConnectionLoaderFactory);

//# sourceMappingURL=field-metadata-connection-loader.factory.js.map