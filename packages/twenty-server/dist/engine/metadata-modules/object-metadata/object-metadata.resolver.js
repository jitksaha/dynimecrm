"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "ObjectMetadataResolver", {
    enumerable: true,
    get: function() {
        return ObjectMetadataResolver;
    }
});
const _common = require("@nestjs/common");
const _graphql = require("@nestjs/graphql");
const _typeorm = require("@nestjs/typeorm");
const _constants = require("twenty-shared/constants");
const _utils = require("twenty-shared/utils");
const _typeorm1 = require("typeorm");
const _metadataresolverdecorator = require("../../api/graphql/graphql-config/decorators/metadata-resolver.decorator");
const _scalars = require("../../api/graphql/workspace-schema-builder/graphql-types/scalars");
const _graphqlerrorsutil = require("../../core-modules/graphql/utils/graphql-errors.util");
const _preventnesttoautologgraphqlerrorsfilter = require("../../core-modules/graphql/filters/prevent-nest-to-auto-log-graphql-errors.filter");
const _resolvervalidationpipe = require("../../core-modules/graphql/pipes/resolver-validation.pipe");
const _workspaceentity = require("../../core-modules/workspace/workspace.entity");
const _authworkspacedecorator = require("../../decorators/auth/auth-workspace.decorator");
const _nopermissionguard = require("../../guards/no-permission.guard");
const _settingspermissionguard = require("../../guards/settings-permission.guard");
const _workspaceauthguard = require("../../guards/workspace-auth.guard");
const _fieldmetadatadto = require("../field-metadata/dtos/field-metadata.dto");
const _fieldfilterinput = require("../field-metadata/dtos/field-filter.input");
const _fromflatobjectmetadatatoobjectmetadatadtoutil = require("../flat-object-metadata/utils/from-flat-object-metadata-to-object-metadata-dto.util");
const _indexmetadatadto = require("../index-metadata/dtos/index-metadata.dto");
const _indexfilterinput = require("../index-metadata/dtos/index-filter.input");
const _createobjectinput = require("./dtos/create-object.input");
const _deleteobjectinput = require("./dtos/delete-object.input");
const _objectmetadatadto = require("./dtos/object-metadata.dto");
const _objectmetadataconnectiondto = require("./dtos/object-metadata-connection.dto");
const _objectfilterinput = require("./dtos/object-filter.input");
const _objectmetadataentity = require("./object-metadata.entity");
const _objectrecordcountdto = require("./dtos/object-record-count.dto");
const _updateobjectinput = require("./dtos/update-object.input");
const _cursorpaginginput = require("../pagination/dtos/cursor-paging.input");
const _applymetadatafiltertoquerybuilderutil = require("../pagination/utils/apply-metadata-filter-to-query-builder.util");
const _findmanywithcursorpaginationutil = require("../pagination/utils/find-many-with-cursor-pagination.util");
const _geteffectiveimageidentifierfieldmetadataidutil = require("./utils/get-effective-image-identifier-field-metadata-id.util");
const _mostlyemptyfieldsservice = require("./mostly-empty-fields.service");
const _objectmetadataservice = require("./object-metadata.service");
const _objectrecordcountservice = require("./object-record-count.service");
const _objectmetadatagraphqlapiexceptionhandlerutil = require("./utils/object-metadata-graphql-api-exception-handler.util");
const _permissionsgraphqlapiexceptionfilter = require("../permissions/utils/permissions-graphql-api-exception.filter");
const _searchfieldmetadatadto = require("../search-field-metadata/dtos/search-field-metadata.dto");
const _resolveeffectiveentitypropertyutil = require("../utils/resolve-effective-entity-property.util");
const _applicationtranslationcatalogservice = require("../application-translation-catalog/services/application-translation-catalog.service");
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
let ObjectMetadataResolver = class ObjectMetadataResolver {
    async objects({ id: workspaceId }, paging, filter) {
        const queryBuilder = this.objectMetadataRepository.createQueryBuilder('objectMetadata').where('"objectMetadata"."workspaceId" = :workspaceId', {
            workspaceId
        });
        (0, _applymetadatafiltertoquerybuilderutil.applyMetadataFilterToQueryBuilder)({
            whereBuilder: queryBuilder,
            alias: 'objectMetadata',
            filter,
            columnByFilterField: _objectfilterinput.OBJECT_FILTER_COLUMN_BY_FILTER_FIELD
        });
        return (0, _findmanywithcursorpaginationutil.findManyWithCursorPagination)({
            queryBuilder,
            alias: 'objectMetadata',
            paging
        });
    }
    async object(id, { id: workspaceId }) {
        const objectMetadata = await this.objectMetadataRepository.findOne({
            where: {
                id,
                workspaceId
            }
        });
        if (!(0, _utils.isDefined)(objectMetadata)) {
            throw new _graphqlerrorsutil.NotFoundError(`Unable to find ObjectMetadataEntity with id: ${id}`);
        }
        return objectMetadata;
    }
    async fields(workspace, objectMetadata, context, paging, filter) {
        return context.loaders.fieldMetadataConnectionLoader.load({
            objectMetadata,
            workspaceId: workspace.id,
            locale: context.req.locale,
            filter,
            paging
        });
    }
    async indexMetadatas(workspace, objectMetadata, context, paging, filter) {
        return context.loaders.indexMetadataConnectionLoader.load({
            objectMetadata,
            workspaceId: workspace.id,
            filter,
            paging
        });
    }
    async isUIReadOnly(objectMetadata) {
        return !objectMetadata.isUIEditable;
    }
    async objectRecordCounts({ id: workspaceId }) {
        return this.objectRecordCountService.getRecordCounts(workspaceId);
    }
    async mostlyEmptyFieldMetadataIds(objectMetadataId, { id: workspaceId }) {
        try {
            return await this.mostlyEmptyFieldsService.getMostlyEmptyFieldMetadataIds({
                workspaceId,
                objectMetadataId
            });
        } catch (error) {
            (0, _objectmetadatagraphqlapiexceptionhandlerutil.objectMetadataGraphqlApiExceptionHandler)(error);
            return [];
        }
    }
    async resolveStandardOverride(objectMetadata, labelKey, context, workspaceId) {
        return (0, _resolveeffectiveentitypropertyutil.resolveEffectiveEntityProperty)({
            metadataName: 'objectMetadata',
            baseValue: objectMetadata[labelKey],
            overrides: objectMetadata.overrides,
            property: labelKey,
            i18nContext: await this.applicationTranslationCatalogService.buildEffectiveEntityI18nContext({
                applicationId: objectMetadata.applicationId ?? undefined,
                loaders: context.loaders,
                locale: context.req.locale,
                workspaceId
            })
        });
    }
    async labelPlural(objectMetadata, context, { id: workspaceId }) {
        return this.resolveStandardOverride(objectMetadata, 'labelPlural', context, workspaceId);
    }
    async labelSingular(objectMetadata, context, { id: workspaceId }) {
        return this.resolveStandardOverride(objectMetadata, 'labelSingular', context, workspaceId);
    }
    async description(objectMetadata, context, { id: workspaceId }) {
        return this.resolveStandardOverride(objectMetadata, 'description', context, workspaceId);
    }
    async icon(objectMetadata, context, { id: workspaceId }) {
        return this.resolveStandardOverride(objectMetadata, 'icon', context, workspaceId);
    }
    async color(objectMetadata, context, { id: workspaceId }) {
        return this.resolveStandardOverride(objectMetadata, 'color', context, workspaceId);
    }
    imageIdentifierFieldMetadataId(objectMetadata) {
        return (0, _geteffectiveimageidentifierfieldmetadataidutil.getEffectiveImageIdentifierFieldMetadataId)(objectMetadata);
    }
    async createOneObject(input, { id: workspaceId }) {
        try {
            const flatobjectMetadata = await this.objectMetadataService.createOneObject({
                createObjectInput: input.object,
                workspaceId
            });
            return (0, _fromflatobjectmetadatatoobjectmetadatadtoutil.fromFlatObjectMetadataToObjectMetadataDto)(flatobjectMetadata);
        } catch (error) {
            (0, _objectmetadatagraphqlapiexceptionhandlerutil.objectMetadataGraphqlApiExceptionHandler)(error);
        }
    }
    async deleteOneObject(deleteObjectInput, { id: workspaceId }) {
        try {
            const flatobjectMetadata = await this.objectMetadataService.deleteOneObject({
                deleteObjectInput,
                workspaceId
            });
            return (0, _fromflatobjectmetadatatoobjectmetadatadtoutil.fromFlatObjectMetadataToObjectMetadataDto)(flatobjectMetadata);
        } catch (error) {
            (0, _objectmetadatagraphqlapiexceptionhandlerutil.objectMetadataGraphqlApiExceptionHandler)(error);
        }
    }
    async updateOneObject(updateObjectInput, { id: workspaceId }) {
        try {
            const flatobjectMetadata = await this.objectMetadataService.updateOneObject({
                updateObjectInput,
                workspaceId
            });
            return (0, _fromflatobjectmetadatatoobjectmetadatadtoutil.fromFlatObjectMetadataToObjectMetadataDto)(flatobjectMetadata);
        } catch (error) {
            (0, _objectmetadatagraphqlapiexceptionhandlerutil.objectMetadataGraphqlApiExceptionHandler)(error);
        }
    }
    async fieldsList(workspace, objectMetadata, context) {
        try {
            const fieldMetadataItems = await context.loaders.fieldMetadataLoader.load({
                objectMetadata,
                workspaceId: workspace.id,
                locale: context.req.locale
            });
            return fieldMetadataItems;
        } catch (error) {
            (0, _objectmetadatagraphqlapiexceptionhandlerutil.objectMetadataGraphqlApiExceptionHandler)(error);
            return [];
        }
    }
    async indexMetadataList(workspace, objectMetadata, context) {
        try {
            const indexMetadataItems = await context.loaders.indexMetadataLoader.load({
                objectMetadata,
                workspaceId: workspace.id
            });
            return indexMetadataItems;
        } catch (error) {
            (0, _objectmetadatagraphqlapiexceptionhandlerutil.objectMetadataGraphqlApiExceptionHandler)(error);
            return [];
        }
    }
    async searchFieldMetadataList(workspace, objectMetadata, context) {
        try {
            const searchFieldMetadataItems = await context.loaders.searchFieldMetadataLoader.load({
                objectMetadata,
                workspaceId: workspace.id
            });
            return searchFieldMetadataItems;
        } catch (error) {
            (0, _objectmetadatagraphqlapiexceptionhandlerutil.objectMetadataGraphqlApiExceptionHandler)(error);
            return [];
        }
    }
    constructor(objectMetadataService, objectRecordCountService, mostlyEmptyFieldsService, applicationTranslationCatalogService, objectMetadataRepository){
        this.objectMetadataService = objectMetadataService;
        this.objectRecordCountService = objectRecordCountService;
        this.mostlyEmptyFieldsService = mostlyEmptyFieldsService;
        this.applicationTranslationCatalogService = applicationTranslationCatalogService;
        this.objectMetadataRepository = objectMetadataRepository;
    }
};
_ts_decorate([
    (0, _common.UseGuards)(_nopermissionguard.NoPermissionGuard),
    (0, _graphql.Query)(()=>_objectmetadataconnectiondto.ObjectConnectionDTO),
    _ts_param(0, (0, _authworkspacedecorator.AuthWorkspace)()),
    _ts_param(1, (0, _graphql.Args)('paging', {
        type: ()=>_cursorpaginginput.CursorPagingInput,
        defaultValue: {
            first: 10
        },
        description: 'Limit or page results.'
    })),
    _ts_param(2, (0, _graphql.Args)('filter', {
        type: ()=>_objectfilterinput.ObjectFilterInput,
        defaultValue: {},
        description: 'Specify to filter the records returned.'
    })),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _workspaceentity.WorkspaceEntity === "undefined" ? Object : _workspaceentity.WorkspaceEntity,
        typeof _cursorpaginginput.CursorPagingInput === "undefined" ? Object : _cursorpaginginput.CursorPagingInput,
        typeof _objectfilterinput.ObjectFilterInput === "undefined" ? Object : _objectfilterinput.ObjectFilterInput
    ]),
    _ts_metadata("design:returntype", Promise)
], ObjectMetadataResolver.prototype, "objects", null);
_ts_decorate([
    (0, _common.UseGuards)(_nopermissionguard.NoPermissionGuard),
    (0, _graphql.Query)(()=>_objectmetadatadto.ObjectMetadataDTO),
    _ts_param(0, (0, _graphql.Args)('id', {
        type: ()=>_scalars.UUIDScalarType,
        description: 'The id of the record to find.'
    })),
    _ts_param(1, (0, _authworkspacedecorator.AuthWorkspace)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        typeof _workspaceentity.WorkspaceEntity === "undefined" ? Object : _workspaceentity.WorkspaceEntity
    ]),
    _ts_metadata("design:returntype", Promise)
], ObjectMetadataResolver.prototype, "object", null);
_ts_decorate([
    (0, _graphql.ResolveField)(()=>_objectmetadataconnectiondto.ObjectFieldsConnectionDTO),
    _ts_param(0, (0, _authworkspacedecorator.AuthWorkspace)()),
    _ts_param(1, (0, _graphql.Parent)()),
    _ts_param(2, (0, _graphql.Context)()),
    _ts_param(3, (0, _graphql.Args)('paging', {
        type: ()=>_cursorpaginginput.CursorPagingInput,
        defaultValue: {
            first: 10
        },
        description: 'Limit or page results.'
    })),
    _ts_param(4, (0, _graphql.Args)('filter', {
        type: ()=>_fieldfilterinput.FieldFilterInput,
        defaultValue: {},
        description: 'Specify to filter the records returned.'
    })),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _workspaceentity.WorkspaceEntity === "undefined" ? Object : _workspaceentity.WorkspaceEntity,
        typeof Pick === "undefined" ? Object : Pick,
        Object,
        typeof _cursorpaginginput.CursorPagingInput === "undefined" ? Object : _cursorpaginginput.CursorPagingInput,
        typeof _fieldfilterinput.FieldFilterInput === "undefined" ? Object : _fieldfilterinput.FieldFilterInput
    ]),
    _ts_metadata("design:returntype", Promise)
], ObjectMetadataResolver.prototype, "fields", null);
_ts_decorate([
    (0, _graphql.ResolveField)(()=>_objectmetadataconnectiondto.ObjectIndexMetadatasConnectionDTO),
    _ts_param(0, (0, _authworkspacedecorator.AuthWorkspace)()),
    _ts_param(1, (0, _graphql.Parent)()),
    _ts_param(2, (0, _graphql.Context)()),
    _ts_param(3, (0, _graphql.Args)('paging', {
        type: ()=>_cursorpaginginput.CursorPagingInput,
        defaultValue: {
            first: 10
        },
        description: 'Limit or page results.'
    })),
    _ts_param(4, (0, _graphql.Args)('filter', {
        type: ()=>_indexfilterinput.IndexFilterInput,
        defaultValue: {},
        description: 'Specify to filter the records returned.'
    })),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _workspaceentity.WorkspaceEntity === "undefined" ? Object : _workspaceentity.WorkspaceEntity,
        typeof Pick === "undefined" ? Object : Pick,
        Object,
        typeof _cursorpaginginput.CursorPagingInput === "undefined" ? Object : _cursorpaginginput.CursorPagingInput,
        typeof _indexfilterinput.IndexFilterInput === "undefined" ? Object : _indexfilterinput.IndexFilterInput
    ]),
    _ts_metadata("design:returntype", Promise)
], ObjectMetadataResolver.prototype, "indexMetadatas", null);
_ts_decorate([
    (0, _graphql.ResolveField)(()=>Boolean, {
        deprecationReason: 'Use isUIEditable'
    }),
    _ts_param(0, (0, _graphql.Parent)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _objectmetadatadto.ObjectMetadataDTO === "undefined" ? Object : _objectmetadatadto.ObjectMetadataDTO
    ]),
    _ts_metadata("design:returntype", Promise)
], ObjectMetadataResolver.prototype, "isUIReadOnly", null);
_ts_decorate([
    (0, _common.UseGuards)((0, _settingspermissionguard.SettingsPermissionGuard)(_constants.PermissionFlagType.DATA_MODEL)),
    (0, _graphql.Query)(()=>[
            _objectrecordcountdto.ObjectRecordCountDTO
        ]),
    _ts_param(0, (0, _authworkspacedecorator.AuthWorkspace)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _workspaceentity.WorkspaceEntity === "undefined" ? Object : _workspaceentity.WorkspaceEntity
    ]),
    _ts_metadata("design:returntype", Promise)
], ObjectMetadataResolver.prototype, "objectRecordCounts", null);
_ts_decorate([
    (0, _common.UseGuards)((0, _settingspermissionguard.SettingsPermissionGuard)(_constants.PermissionFlagType.DATA_MODEL)),
    (0, _graphql.Query)(()=>[
            _scalars.UUIDScalarType
        ]),
    _ts_param(0, (0, _graphql.Args)('objectMetadataId', {
        type: ()=>_scalars.UUIDScalarType
    })),
    _ts_param(1, (0, _authworkspacedecorator.AuthWorkspace)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        typeof _workspaceentity.WorkspaceEntity === "undefined" ? Object : _workspaceentity.WorkspaceEntity
    ]),
    _ts_metadata("design:returntype", Promise)
], ObjectMetadataResolver.prototype, "mostlyEmptyFieldMetadataIds", null);
_ts_decorate([
    (0, _graphql.ResolveField)(()=>String, {
        nullable: true
    }),
    _ts_param(0, (0, _graphql.Parent)()),
    _ts_param(1, (0, _graphql.Context)()),
    _ts_param(2, (0, _authworkspacedecorator.AuthWorkspace)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _objectmetadatadto.ObjectMetadataDTO === "undefined" ? Object : _objectmetadatadto.ObjectMetadataDTO,
        Object,
        typeof _workspaceentity.WorkspaceEntity === "undefined" ? Object : _workspaceentity.WorkspaceEntity
    ]),
    _ts_metadata("design:returntype", Promise)
], ObjectMetadataResolver.prototype, "labelPlural", null);
_ts_decorate([
    (0, _graphql.ResolveField)(()=>String, {
        nullable: true
    }),
    _ts_param(0, (0, _graphql.Parent)()),
    _ts_param(1, (0, _graphql.Context)()),
    _ts_param(2, (0, _authworkspacedecorator.AuthWorkspace)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _objectmetadatadto.ObjectMetadataDTO === "undefined" ? Object : _objectmetadatadto.ObjectMetadataDTO,
        Object,
        typeof _workspaceentity.WorkspaceEntity === "undefined" ? Object : _workspaceentity.WorkspaceEntity
    ]),
    _ts_metadata("design:returntype", Promise)
], ObjectMetadataResolver.prototype, "labelSingular", null);
_ts_decorate([
    (0, _graphql.ResolveField)(()=>String, {
        nullable: true
    }),
    _ts_param(0, (0, _graphql.Parent)()),
    _ts_param(1, (0, _graphql.Context)()),
    _ts_param(2, (0, _authworkspacedecorator.AuthWorkspace)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _objectmetadatadto.ObjectMetadataDTO === "undefined" ? Object : _objectmetadatadto.ObjectMetadataDTO,
        Object,
        typeof _workspaceentity.WorkspaceEntity === "undefined" ? Object : _workspaceentity.WorkspaceEntity
    ]),
    _ts_metadata("design:returntype", Promise)
], ObjectMetadataResolver.prototype, "description", null);
_ts_decorate([
    (0, _common.UseGuards)((0, _settingspermissionguard.SettingsPermissionGuard)(_constants.PermissionFlagType.DATA_MODEL)),
    (0, _graphql.ResolveField)(()=>String, {
        nullable: true
    }),
    _ts_param(0, (0, _graphql.Parent)()),
    _ts_param(1, (0, _graphql.Context)()),
    _ts_param(2, (0, _authworkspacedecorator.AuthWorkspace)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _objectmetadatadto.ObjectMetadataDTO === "undefined" ? Object : _objectmetadatadto.ObjectMetadataDTO,
        Object,
        typeof _workspaceentity.WorkspaceEntity === "undefined" ? Object : _workspaceentity.WorkspaceEntity
    ]),
    _ts_metadata("design:returntype", Promise)
], ObjectMetadataResolver.prototype, "icon", null);
_ts_decorate([
    (0, _graphql.ResolveField)(()=>String, {
        nullable: true
    }),
    _ts_param(0, (0, _graphql.Parent)()),
    _ts_param(1, (0, _graphql.Context)()),
    _ts_param(2, (0, _authworkspacedecorator.AuthWorkspace)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _objectmetadatadto.ObjectMetadataDTO === "undefined" ? Object : _objectmetadatadto.ObjectMetadataDTO,
        Object,
        typeof _workspaceentity.WorkspaceEntity === "undefined" ? Object : _workspaceentity.WorkspaceEntity
    ]),
    _ts_metadata("design:returntype", Promise)
], ObjectMetadataResolver.prototype, "color", null);
_ts_decorate([
    (0, _graphql.ResolveField)(()=>_scalars.UUIDScalarType, {
        nullable: true
    }),
    _ts_param(0, (0, _graphql.Parent)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _objectmetadatadto.ObjectMetadataDTO === "undefined" ? Object : _objectmetadatadto.ObjectMetadataDTO
    ]),
    _ts_metadata("design:returntype", Object)
], ObjectMetadataResolver.prototype, "imageIdentifierFieldMetadataId", null);
_ts_decorate([
    (0, _common.UseGuards)((0, _settingspermissionguard.SettingsPermissionGuard)(_constants.PermissionFlagType.DATA_MODEL)),
    (0, _graphql.Mutation)(()=>_objectmetadatadto.ObjectMetadataDTO),
    _ts_param(0, (0, _graphql.Args)('input')),
    _ts_param(1, (0, _authworkspacedecorator.AuthWorkspace)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _createobjectinput.CreateOneObjectInput === "undefined" ? Object : _createobjectinput.CreateOneObjectInput,
        typeof _workspaceentity.WorkspaceEntity === "undefined" ? Object : _workspaceentity.WorkspaceEntity
    ]),
    _ts_metadata("design:returntype", Promise)
], ObjectMetadataResolver.prototype, "createOneObject", null);
_ts_decorate([
    (0, _common.UseGuards)((0, _settingspermissionguard.SettingsPermissionGuard)(_constants.PermissionFlagType.DATA_MODEL)),
    (0, _graphql.Mutation)(()=>_objectmetadatadto.ObjectMetadataDTO),
    _ts_param(0, (0, _graphql.Args)('input')),
    _ts_param(1, (0, _authworkspacedecorator.AuthWorkspace)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _deleteobjectinput.DeleteOneObjectInput === "undefined" ? Object : _deleteobjectinput.DeleteOneObjectInput,
        typeof _workspaceentity.WorkspaceEntity === "undefined" ? Object : _workspaceentity.WorkspaceEntity
    ]),
    _ts_metadata("design:returntype", Promise)
], ObjectMetadataResolver.prototype, "deleteOneObject", null);
_ts_decorate([
    (0, _common.UseGuards)((0, _settingspermissionguard.SettingsPermissionGuard)(_constants.PermissionFlagType.DATA_MODEL)),
    (0, _graphql.Mutation)(()=>_objectmetadatadto.ObjectMetadataDTO),
    _ts_param(0, (0, _graphql.Args)('input')),
    _ts_param(1, (0, _authworkspacedecorator.AuthWorkspace)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _updateobjectinput.UpdateOneObjectInput === "undefined" ? Object : _updateobjectinput.UpdateOneObjectInput,
        typeof _workspaceentity.WorkspaceEntity === "undefined" ? Object : _workspaceentity.WorkspaceEntity
    ]),
    _ts_metadata("design:returntype", Promise)
], ObjectMetadataResolver.prototype, "updateOneObject", null);
_ts_decorate([
    (0, _graphql.ResolveField)(()=>[
            _fieldmetadatadto.FieldMetadataDTO
        ], {
        nullable: false
    }),
    _ts_param(0, (0, _authworkspacedecorator.AuthWorkspace)()),
    _ts_param(1, (0, _graphql.Parent)()),
    _ts_param(2, (0, _graphql.Context)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _workspaceentity.WorkspaceEntity === "undefined" ? Object : _workspaceentity.WorkspaceEntity,
        typeof _objectmetadatadto.ObjectMetadataDTO === "undefined" ? Object : _objectmetadatadto.ObjectMetadataDTO,
        Object
    ]),
    _ts_metadata("design:returntype", Promise)
], ObjectMetadataResolver.prototype, "fieldsList", null);
_ts_decorate([
    (0, _graphql.ResolveField)(()=>[
            _indexmetadatadto.IndexMetadataDTO
        ], {
        nullable: false
    }),
    _ts_param(0, (0, _authworkspacedecorator.AuthWorkspace)()),
    _ts_param(1, (0, _graphql.Parent)()),
    _ts_param(2, (0, _graphql.Context)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _workspaceentity.WorkspaceEntity === "undefined" ? Object : _workspaceentity.WorkspaceEntity,
        typeof _objectmetadatadto.ObjectMetadataDTO === "undefined" ? Object : _objectmetadatadto.ObjectMetadataDTO,
        Object
    ]),
    _ts_metadata("design:returntype", Promise)
], ObjectMetadataResolver.prototype, "indexMetadataList", null);
_ts_decorate([
    (0, _graphql.ResolveField)(()=>[
            _searchfieldmetadatadto.SearchFieldMetadataDTO
        ], {
        nullable: false
    }),
    _ts_param(0, (0, _authworkspacedecorator.AuthWorkspace)()),
    _ts_param(1, (0, _graphql.Parent)()),
    _ts_param(2, (0, _graphql.Context)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _workspaceentity.WorkspaceEntity === "undefined" ? Object : _workspaceentity.WorkspaceEntity,
        typeof _objectmetadatadto.ObjectMetadataDTO === "undefined" ? Object : _objectmetadatadto.ObjectMetadataDTO,
        Object
    ]),
    _ts_metadata("design:returntype", Promise)
], ObjectMetadataResolver.prototype, "searchFieldMetadataList", null);
ObjectMetadataResolver = _ts_decorate([
    (0, _common.UseGuards)(_workspaceauthguard.WorkspaceAuthGuard),
    (0, _metadataresolverdecorator.MetadataResolver)(()=>_objectmetadatadto.ObjectMetadataDTO),
    (0, _common.UsePipes)(_resolvervalidationpipe.ResolverValidationPipe),
    (0, _common.UseFilters)(_preventnesttoautologgraphqlerrorsfilter.PreventNestToAutoLogGraphqlErrorsFilter, _permissionsgraphqlapiexceptionfilter.PermissionsGraphqlApiExceptionFilter),
    _ts_param(4, (0, _typeorm.InjectRepository)(_objectmetadataentity.ObjectMetadataEntity)),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _objectmetadataservice.ObjectMetadataService === "undefined" ? Object : _objectmetadataservice.ObjectMetadataService,
        typeof _objectrecordcountservice.ObjectRecordCountService === "undefined" ? Object : _objectrecordcountservice.ObjectRecordCountService,
        typeof _mostlyemptyfieldsservice.MostlyEmptyFieldsService === "undefined" ? Object : _mostlyemptyfieldsservice.MostlyEmptyFieldsService,
        typeof _applicationtranslationcatalogservice.ApplicationTranslationCatalogService === "undefined" ? Object : _applicationtranslationcatalogservice.ApplicationTranslationCatalogService,
        typeof _typeorm1.Repository === "undefined" ? Object : _typeorm1.Repository
    ])
], ObjectMetadataResolver);

//# sourceMappingURL=object-metadata.resolver.js.map