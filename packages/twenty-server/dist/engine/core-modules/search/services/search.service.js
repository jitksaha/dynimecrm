"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "SearchService", {
    enumerable: true,
    get: function() {
        return SearchService;
    }
});
const _common = require("@nestjs/common");
const _guards = require("@sniptt/guards");
const _lodashchunk = /*#__PURE__*/ _interop_require_default(require("lodash.chunk"));
const _constants = require("twenty-shared/constants");
const _types = require("twenty-shared/types");
const _utils = require("twenty-shared/utils");
const _typeorm = require("typeorm");
const _graphqlqueryparser = require("../../../api/graphql/graphql-query-runner/graphql-query-parsers/graphql-query.parser");
const _cursorsutil = require("../../../api/graphql/graphql-query-runner/utils/cursors.util");
const _isquerycancelederrorutil = require("../../../api/graphql/workspace-query-runner/utils/is-query-canceled-error.util");
const _fileurlservice = require("../../file/file-url/file-url.service");
const _extractfileidfromurlutil = require("../../file/files-field/utils/extract-file-id-from-url.util");
const _standardobjectsbypriorityrank = require("../constants/standard-objects-by-priority-rank");
const _searchexception = require("../exceptions/search.exception");
const _formatsearchterms = require("../utils/format-search-terms");
const _twentyconfigservice = require("../../twenty-config/twenty-config.service");
const _computecolumnnameutil = require("../../../metadata-modules/field-metadata/utils/compute-column-name.util");
const _iscompositefieldmetadatatypeutil = require("../../../metadata-modules/field-metadata/utils/is-composite-field-metadata-type.util");
const _findflatentitybyidinflatentitymapsutil = require("../../../metadata-modules/flat-entity/utils/find-flat-entity-by-id-in-flat-entity-maps.util");
const _geteffectiveimageidentifierfieldmetadataidutil = require("../../../metadata-modules/object-metadata/utils/get-effective-image-identifier-field-metadata-id.util");
const _searchvectorfieldconstants = require("../../../metadata-modules/search-field-metadata/constants/search-vector-field.constants");
const _resolveeffectiveentitypropertyutil = require("../../../metadata-modules/utils/resolve-effective-entity-property.util");
const _workspaceormmanager = require("../../../twenty-orm/workspace-orm.manager");
const _ormworkspacecontextstorage = require("../../../twenty-orm/storage/orm-workspace-context.storage");
const _resolverolepermissionconfigutil = require("../../../twenty-orm/utils/resolve-role-permission-config.util");
const _applicationtranslationcatalogservice = require("../../../metadata-modules/application-translation-catalog/services/application-translation-catalog.service");
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
const OBJECT_METADATA_ITEMS_CHUNK_SIZE = 5;
let SearchService = class SearchService {
    async getAllRecordsWithObjectMetadataItems({ flatObjectMetadatas, flatFieldMetadataMaps, includedObjectNameSingulars, excludedObjectNameSingulars, searchInput, limit, filter, after }) {
        const filteredObjectMetadataItems = this.filterObjectMetadataItems({
            flatObjectMetadatas,
            includedObjectNameSingulars: includedObjectNameSingulars ?? [],
            excludedObjectNameSingulars: excludedObjectNameSingulars ?? []
        });
        const allRecordsWithObjectMetadataItems = [];
        const filteredObjectMetadataItemsChunks = (0, _lodashchunk.default)(filteredObjectMetadataItems, OBJECT_METADATA_ITEMS_CHUNK_SIZE);
        for (const objectMetadataItemChunk of filteredObjectMetadataItemsChunks){
            const recordsWithObjectMetadataItems = await Promise.all(objectMetadataItemChunk.map(async (flatObjectMetadata)=>{
                return this.workspaceOrmManager.executeInWorkspaceContext(async ()=>{
                    const context = (0, _ormworkspacecontextstorage.getWorkspaceContext)();
                    const rolePermissionConfig = (0, _resolverolepermissionconfigutil.resolveRolePermissionConfig)({
                        authContext: context.authContext,
                        userWorkspaceRoleMap: context.userWorkspaceRoleMap,
                        apiKeyRoleMap: context.apiKeyRoleMap
                    }) ?? undefined;
                    const repository = this.workspaceOrmManager.getRepository(flatObjectMetadata.nameSingular, rolePermissionConfig);
                    return {
                        objectMetadataItem: flatObjectMetadata,
                        records: await this.buildSearchQueryAndGetRecordsWithFallback({
                            entityManager: repository,
                            rolePermissionConfig,
                            flatObjectMetadata,
                            flatFieldMetadataMaps,
                            searchInput,
                            searchTerms: (0, _formatsearchterms.formatSearchTerms)(searchInput, 'and'),
                            searchTermsOr: (0, _formatsearchterms.formatSearchTerms)(searchInput, 'or'),
                            limit: limit,
                            filter: filter ?? {},
                            after
                        })
                    };
                });
            }));
            allRecordsWithObjectMetadataItems.push(...recordsWithObjectMetadataItems);
        }
        return allRecordsWithObjectMetadataItems;
    }
    filterObjectMetadataItems({ flatObjectMetadatas, includedObjectNameSingulars, excludedObjectNameSingulars }) {
        const hasExplicitInclusion = includedObjectNameSingulars.length > 0;
        return flatObjectMetadatas.filter(({ nameSingular, isSearchable, isActive })=>{
            if (!isActive) {
                return false;
            }
            if (hasExplicitInclusion) {
                if (_constants.OBJECTS_WITH_CHANNEL_VISIBILITY_CONSTRAINTS.includes(nameSingular)) {
                    return false;
                }
                return includedObjectNameSingulars.includes(nameSingular) && !excludedObjectNameSingulars.includes(nameSingular);
            }
            if (!isSearchable) {
                return false;
            }
            if (excludedObjectNameSingulars.includes(nameSingular)) {
                return false;
            }
            return true;
        });
    }
    // Runs a fast tsvector query first (uses GIN index). If tsvector returns zero
    // results for an object type on the first page, falls back to ILIKE on the
    // searchVector text to catch cases where tokenization fails (e.g. CJK text).
    // Skipped when tsvector finds any results (partial results mean the data just
    // has fewer matches, not a tokenization issue) and on paginated requests.
    async buildSearchQueryAndGetRecordsWithFallback({ entityManager, rolePermissionConfig, flatObjectMetadata, flatFieldMetadataMaps, searchInput, searchTerms, searchTermsOr, limit, filter, after }) {
        const tsvectorResults = await this.buildSearchQueryAndGetRecords({
            entityManager,
            flatObjectMetadata,
            flatFieldMetadataMaps,
            searchTerms,
            searchTermsOr,
            limit,
            filter,
            after
        });
        if (tsvectorResults.length > 0 || !(0, _guards.isNonEmptyString)(searchInput.trim()) || (0, _utils.isDefined)(after)) {
            return tsvectorResults;
        }
        const fallbackResults = await this.buildIlikeFallbackQuery({
            entityManager,
            rolePermissionConfig,
            flatObjectMetadata,
            flatFieldMetadataMaps,
            searchInput,
            limit: limit + 1,
            filter
        });
        return [
            ...tsvectorResults,
            ...fallbackResults
        ];
    }
    async buildSearchQueryAndGetRecords({ entityManager, flatObjectMetadata, flatFieldMetadataMaps, searchTerms, searchTermsOr, limit, filter, after }) {
        const queryBuilder = entityManager.createQueryBuilder(flatObjectMetadata.nameSingular);
        const { flatObjectMetadataMaps } = entityManager.internalContext;
        const queryParser = new _graphqlqueryparser.GraphqlQueryParser(flatObjectMetadata, flatObjectMetadataMaps, flatFieldMetadataMaps);
        queryParser.applyFilterToBuilder(queryBuilder, flatObjectMetadata.nameSingular, filter);
        queryParser.applyDeletedAtToBuilder(queryBuilder, filter);
        const imageIdentifierColumns = this.getImageIdentifierColumns(flatObjectMetadata, flatFieldMetadataMaps);
        const fieldsToSelect = [
            'id',
            ...this.getLabelIdentifierColumns(flatObjectMetadata, flatFieldMetadataMaps),
            ...imageIdentifierColumns
        ];
        const tsRankCDExpr = `ts_rank_cd("${_searchvectorfieldconstants.SEARCH_VECTOR_FIELD.name}", to_tsquery('simple', public.unaccent_immutable(:searchTerms)))`;
        const tsRankExpr = `ts_rank("${_searchvectorfieldconstants.SEARCH_VECTOR_FIELD.name}", to_tsquery('simple', public.unaccent_immutable(:searchTermsOr)))`;
        const cursorWhereCondition = this.computeCursorWhereCondition({
            after,
            objectMetadataNameSingular: flatObjectMetadata.nameSingular,
            tsRankExpr,
            tsRankCDExpr
        });
        const [firstField, ...remainingFields] = fieldsToSelect;
        queryBuilder.select(`"${flatObjectMetadata.nameSingular}"."${firstField}"`, firstField);
        for (const field of remainingFields){
            queryBuilder.addSelect(`"${flatObjectMetadata.nameSingular}"."${field}"`, field);
        }
        queryBuilder.addSelect(tsRankCDExpr, 'tsRankCD').addSelect(tsRankExpr, 'tsRank');
        if ((0, _guards.isNonEmptyString)(searchTerms)) {
            queryBuilder.andWhere(new _typeorm.Brackets((qb)=>{
                qb.where(`"${_searchvectorfieldconstants.SEARCH_VECTOR_FIELD.name}" @@ to_tsquery('simple', public.unaccent_immutable(:searchTerms))`, {
                    searchTerms
                }).orWhere(`"${_searchvectorfieldconstants.SEARCH_VECTOR_FIELD.name}" @@ to_tsquery('simple', public.unaccent_immutable(:searchTermsOr))`, {
                    searchTermsOr
                });
            }));
        } else {
            queryBuilder.andWhere(new _typeorm.Brackets((qb)=>{
                qb.where(`"${_searchvectorfieldconstants.SEARCH_VECTOR_FIELD.name}" IS NOT NULL`);
            }));
        }
        if (cursorWhereCondition) {
            queryBuilder.andWhere(cursorWhereCondition);
        }
        return await queryBuilder.orderBy(tsRankCDExpr, 'DESC').addOrderBy(tsRankExpr, 'DESC').addOrderBy('id', 'ASC', 'NULLS FIRST').setParameter('searchTerms', searchTerms).setParameter('searchTermsOr', searchTermsOr).take(limit + 1) // We take one more to check if hasNextPage is true
        .getRawMany();
    }
    async buildIlikeFallbackQuery({ entityManager, rolePermissionConfig, flatObjectMetadata, flatFieldMetadataMaps, searchInput, limit, filter }) {
        const timeoutMs = this.twentyConfigService.get('SEARCH_ILIKE_FALLBACK_TIMEOUT_MS');
        try {
            return await this.workspaceOrmManager.runInWorkspaceTransaction(async (transactionScope)=>{
                await transactionScope.executeRawQuery(`SELECT set_config('statement_timeout', $1, true)`, [
                    String(timeoutMs)
                ]);
                const repository = transactionScope.getRepository(flatObjectMetadata.nameSingular, rolePermissionConfig);
                const queryBuilder = repository.createQueryBuilder(flatObjectMetadata.nameSingular);
                const { flatObjectMetadataMaps } = repository.internalContext;
                const queryParser = new _graphqlqueryparser.GraphqlQueryParser(flatObjectMetadata, flatObjectMetadataMaps, flatFieldMetadataMaps);
                queryParser.applyFilterToBuilder(queryBuilder, flatObjectMetadata.nameSingular, filter);
                queryParser.applyDeletedAtToBuilder(queryBuilder, filter);
                const imageIdentifierColumns = this.getImageIdentifierColumns(flatObjectMetadata, flatFieldMetadataMaps);
                const fieldsToSelect = [
                    'id',
                    ...this.getLabelIdentifierColumns(flatObjectMetadata, flatFieldMetadataMaps),
                    ...imageIdentifierColumns
                ];
                const [firstField, ...remainingFields] = fieldsToSelect;
                queryBuilder.select(`"${flatObjectMetadata.nameSingular}"."${firstField}"`, firstField);
                for (const field of remainingFields){
                    queryBuilder.addSelect(`"${flatObjectMetadata.nameSingular}"."${field}"`, field);
                }
                const searchWords = searchInput.trim().split(/\s+/).filter(_guards.isNonEmptyString);
                searchWords.forEach((word, index)=>{
                    const paramName = `ilikeFallback${index}`;
                    queryBuilder.andWhere(`public.unaccent_immutable("${_searchvectorfieldconstants.SEARCH_VECTOR_FIELD.name}"::text) ILIKE public.unaccent_immutable(:${paramName})`, {
                        [paramName]: `%${(0, _utils.escapeForIlike)(word)}%`
                    });
                });
                const rawResults = await queryBuilder.orderBy(`"${flatObjectMetadata.nameSingular}"."id"`, 'ASC').take(limit).getRawMany();
                return rawResults.map((record)=>({
                        ...record,
                        tsRankCD: 0,
                        tsRank: 0
                    }));
            });
        } catch (error) {
            if ((0, _isquerycancelederrorutil.isQueryCanceledError)(error)) {
                this.logger.warn(`Search ILIKE fallback exceeded ${timeoutMs}ms timeout`, {
                    workspaceId: entityManager.internalContext.workspaceId,
                    objectNameSingular: flatObjectMetadata.nameSingular,
                    searchInputLength: searchInput.length
                });
                return [];
            }
            throw error;
        }
    }
    computeCursorWhereCondition({ after, objectMetadataNameSingular, tsRankExpr, tsRankCDExpr }) {
        if (after) {
            const { lastRanks, lastRecordIdsPerObject } = (0, _cursorsutil.decodeCursor)(after);
            const lastRecordId = lastRecordIdsPerObject[objectMetadataNameSingular];
            return new _typeorm.Brackets((qb)=>{
                qb.where(`${tsRankCDExpr} < :tsRankCDLt`, {
                    tsRankCDLt: lastRanks.tsRankCD
                }).orWhere(new _typeorm.Brackets((inner)=>{
                    inner.andWhere(`${tsRankCDExpr} = :tsRankCDEq`, {
                        tsRankCDEq: lastRanks.tsRankCD
                    });
                    inner.andWhere(`${tsRankExpr} < :tsRankLt`, {
                        tsRankLt: lastRanks.tsRank
                    });
                })).orWhere(new _typeorm.Brackets((inner)=>{
                    inner.andWhere(`${tsRankCDExpr} = :tsRankCDEq`, {
                        tsRankCDEq: lastRanks.tsRankCD
                    });
                    inner.andWhere(`${tsRankExpr} = :tsRankEq`, {
                        tsRankEq: lastRanks.tsRank
                    });
                    if (lastRecordId !== undefined) {
                        inner.andWhere('id > :lastRecordId', {
                            lastRecordId
                        });
                    }
                }));
            });
        }
    }
    getLabelIdentifierColumns(flatObjectMetadata, flatFieldMetadataMaps) {
        if (!flatObjectMetadata.labelIdentifierFieldMetadataId) {
            throw new _searchexception.SearchException('Label identifier field not found', _searchexception.SearchExceptionCode.LABEL_IDENTIFIER_FIELD_NOT_FOUND);
        }
        const labelIdentifierField = (0, _findflatentitybyidinflatentitymapsutil.findFlatEntityByIdInFlatEntityMaps)({
            flatEntityId: flatObjectMetadata.labelIdentifierFieldMetadataId,
            flatEntityMaps: flatFieldMetadataMaps
        });
        if (!(0, _utils.isDefined)(labelIdentifierField)) {
            throw new _searchexception.SearchException('Label identifier field not found', _searchexception.SearchExceptionCode.LABEL_IDENTIFIER_FIELD_NOT_FOUND);
        }
        if (labelIdentifierField.type === _types.FieldMetadataType.FULL_NAME) {
            return [
                `${labelIdentifierField.name}FirstName`,
                `${labelIdentifierField.name}LastName`
            ];
        }
        return [
            labelIdentifierField.name
        ];
    }
    getLabelIdentifierValue(record, flatObjectMetadata, flatFieldMetadataMaps) {
        const labelIdentifierFields = this.getLabelIdentifierColumns(flatObjectMetadata, flatFieldMetadataMaps);
        return labelIdentifierFields.map((field)=>record[field]).join(' ');
    }
    getEffectiveImageIdentifierFieldMetadata(flatObjectMetadata, flatFieldMetadataMaps) {
        const imageIdentifierFieldMetadataId = (0, _geteffectiveimageidentifierfieldmetadataidutil.getEffectiveImageIdentifierFieldMetadataId)(flatObjectMetadata);
        if (!(0, _utils.isDefined)(imageIdentifierFieldMetadataId)) {
            return undefined;
        }
        return (0, _findflatentitybyidinflatentitymapsutil.findFlatEntityByIdInFlatEntityMaps)({
            flatEntityId: imageIdentifierFieldMetadataId,
            flatEntityMaps: flatFieldMetadataMaps
        });
    }
    getImageIdentifierColumns(flatObjectMetadata, flatFieldMetadataMaps) {
        if (flatObjectMetadata.nameSingular === 'workspaceMember') {
            return [
                'avatarUrl'
            ];
        }
        const imageIdentifierField = this.getEffectiveImageIdentifierFieldMetadata(flatObjectMetadata, flatFieldMetadataMaps);
        if (!(0, _utils.isDefined)(imageIdentifierField)) {
            return [];
        }
        const imageIdentifierCompositeType = (0, _iscompositefieldmetadatatypeutil.isCompositeFieldMetadataType)(imageIdentifierField.type) ? _types.compositeTypeDefinitions.get(imageIdentifierField.type) : undefined;
        if ((0, _utils.isDefined)(imageIdentifierCompositeType)) {
            return imageIdentifierCompositeType.properties.filter((compositeProperty)=>compositeProperty.name === 'primaryLinkUrl').map((compositeProperty)=>(0, _computecolumnnameutil.computeCompositeColumnName)(imageIdentifierField.name, compositeProperty));
        }
        return [
            imageIdentifierField.name
        ];
    }
    async getImageUrlWithToken(avatarFileId, fileFolder, workspaceId) {
        return this.fileUrlService.signFileByIdUrl({
            fileId: avatarFileId,
            workspaceId,
            fileFolder
        });
    }
    async getImageIdentifierValue(record, flatObjectMetadata, flatFieldMetadataMaps, workspaceId) {
        if (flatObjectMetadata.nameSingular === 'workspaceMember') {
            const avatarFileId = (0, _extractfileidfromurlutil.extractFileIdFromUrl)(record.avatarUrl, _types.FileFolder.CorePicture);
            if (!(0, _utils.isDefined)(avatarFileId)) {
                return '';
            }
            return this.getImageUrlWithToken(avatarFileId, _types.FileFolder.CorePicture, workspaceId);
        }
        const imageIdentifierField = this.getEffectiveImageIdentifierFieldMetadata(flatObjectMetadata, flatFieldMetadataMaps);
        if (!(0, _utils.isDefined)(imageIdentifierField)) {
            return '';
        }
        switch(imageIdentifierField.type){
            case _types.FieldMetadataType.FILES:
                {
                    const avatarFileId = record[imageIdentifierField.name]?.[0]?.fileId;
                    if (!(0, _guards.isNonEmptyString)(avatarFileId)) {
                        return '';
                    }
                    return this.getImageUrlWithToken(avatarFileId, _types.FileFolder.FilesField, workspaceId);
                }
            case _types.FieldMetadataType.LINKS:
                {
                    if (!this.twentyConfigService.get('ALLOW_REQUESTS_TO_TWENTY_ICONS')) {
                        return '';
                    }
                    const primaryLinkUrlProperty = _types.compositeTypeDefinitions.get(_types.FieldMetadataType.LINKS)?.properties.find((property)=>property.name === 'primaryLinkUrl');
                    if (!(0, _utils.isDefined)(primaryLinkUrlProperty)) {
                        return '';
                    }
                    const primaryLinkUrl = record[(0, _computecolumnnameutil.computeCompositeColumnName)(imageIdentifierField.name, primaryLinkUrlProperty)];
                    return (0, _guards.isNonEmptyString)(primaryLinkUrl) ? (0, _utils.getLinkFaviconUrl)(primaryLinkUrl) || '' : '';
                }
            default:
                {
                    return '';
                }
        }
    }
    computeEdges({ sortedRecords, after }) {
        const recordEdges = [];
        const lastRecordIdsPerObject = after ? {
            ...(0, _cursorsutil.decodeCursor)(after).lastRecordIdsPerObject
        } : {};
        for (const record of sortedRecords){
            const { objectNameSingular, tsRankCD, tsRank, recordId } = record;
            lastRecordIdsPerObject[objectNameSingular] = recordId;
            const lastRecordIdsPerObjectSnapshot = {
                ...lastRecordIdsPerObject
            };
            recordEdges.push({
                node: record,
                cursor: (0, _cursorsutil.encodeCursorData)({
                    lastRanks: {
                        tsRankCD,
                        tsRank
                    },
                    lastRecordIdsPerObject: lastRecordIdsPerObjectSnapshot
                })
            });
        }
        return recordEdges;
    }
    async computeSearchObjectResults({ recordsWithObjectMetadataItems, flatFieldMetadataMaps, workspaceId, limit, after, loaders, locale }) {
        const objectLabelSingularByObjectMetadataId = new Map(await Promise.all(recordsWithObjectMetadataItems.map(async ({ objectMetadataItem })=>[
                objectMetadataItem.id,
                (0, _resolveeffectiveentitypropertyutil.resolveEffectiveEntityProperty)({
                    metadataName: 'objectMetadata',
                    baseValue: objectMetadataItem.labelSingular,
                    overrides: objectMetadataItem.overrides,
                    property: 'labelSingular',
                    i18nContext: await this.applicationTranslationCatalogService.buildEffectiveEntityI18nContext({
                        applicationId: objectMetadataItem.applicationId ?? undefined,
                        loaders,
                        locale,
                        workspaceId
                    })
                })
            ])));
        const recordPromises = recordsWithObjectMetadataItems.flatMap(({ objectMetadataItem, records })=>{
            return records.map(async (record)=>{
                return {
                    recordId: record.id,
                    objectNameSingular: objectMetadataItem.nameSingular,
                    objectLabelSingular: objectLabelSingularByObjectMetadataId.get(objectMetadataItem.id) ?? objectMetadataItem.labelSingular,
                    label: this.getLabelIdentifierValue(record, objectMetadataItem, flatFieldMetadataMaps),
                    imageUrl: await this.getImageIdentifierValue(record, objectMetadataItem, flatFieldMetadataMaps, workspaceId),
                    tsRankCD: record.tsRankCD,
                    tsRank: record.tsRank
                };
            });
        });
        const searchRecords = await Promise.all(recordPromises);
        const sortedRecords = this.sortSearchObjectResults(searchRecords).slice(0, limit);
        const hasNextPage = searchRecords.length > limit;
        const recordEdges = this.computeEdges({
            sortedRecords,
            after
        });
        if (recordEdges.length === 0) {
            return {
                edges: [],
                pageInfo: {
                    endCursor: null,
                    hasNextPage
                }
            };
        }
        const lastRecordEdge = recordEdges[recordEdges.length - 1];
        return {
            edges: recordEdges,
            pageInfo: {
                endCursor: lastRecordEdge.cursor,
                hasNextPage
            }
        };
    }
    sortSearchObjectResults(searchObjectResultsWithRank) {
        return searchObjectResultsWithRank.sort((a, b)=>{
            if (a.tsRankCD !== b.tsRankCD) {
                return b.tsRankCD - a.tsRankCD;
            }
            if (a.tsRank !== b.tsRank) {
                return b.tsRank - a.tsRank;
            }
            return(// @ts-expect-error legacy noImplicitAny
            (_standardobjectsbypriorityrank.STANDARD_OBJECTS_BY_PRIORITY_RANK[b.objectNameSingular] || 0) - // @ts-expect-error legacy noImplicitAny
            (_standardobjectsbypriorityrank.STANDARD_OBJECTS_BY_PRIORITY_RANK[a.objectNameSingular] || 0));
        });
    }
    constructor(workspaceOrmManager, fileUrlService, twentyConfigService, applicationTranslationCatalogService){
        this.workspaceOrmManager = workspaceOrmManager;
        this.fileUrlService = fileUrlService;
        this.twentyConfigService = twentyConfigService;
        this.applicationTranslationCatalogService = applicationTranslationCatalogService;
        this.logger = new _common.Logger(SearchService.name);
    }
};
SearchService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _workspaceormmanager.WorkspaceOrmManager === "undefined" ? Object : _workspaceormmanager.WorkspaceOrmManager,
        typeof _fileurlservice.FileUrlService === "undefined" ? Object : _fileurlservice.FileUrlService,
        typeof _twentyconfigservice.TwentyConfigService === "undefined" ? Object : _twentyconfigservice.TwentyConfigService,
        typeof _applicationtranslationcatalogservice.ApplicationTranslationCatalogService === "undefined" ? Object : _applicationtranslationcatalogservice.ApplicationTranslationCatalogService
    ])
], SearchService);

//# sourceMappingURL=search.service.js.map