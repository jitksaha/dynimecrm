"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "FieldMetadataResolver", {
    enumerable: true,
    get: function() {
        return FieldMetadataResolver;
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
const _preventnesttoautologgraphqlerrorsfilter = require("../../core-modules/graphql/filters/prevent-nest-to-auto-log-graphql-errors.filter");
const _resolvervalidationpipe = require("../../core-modules/graphql/pipes/resolver-validation.pipe");
const _graphqlerrorsutil = require("../../core-modules/graphql/utils/graphql-errors.util");
const _workspaceentity = require("../../core-modules/workspace/workspace.entity");
const _authworkspacedecorator = require("../../decorators/auth/auth-workspace.decorator");
const _nopermissionguard = require("../../guards/no-permission.guard");
const _settingspermissionguard = require("../../guards/settings-permission.guard");
const _workspaceauthguard = require("../../guards/workspace-auth.guard");
const _createfieldinput = require("./dtos/create-field.input");
const _deletefieldinput = require("./dtos/delete-field.input");
const _fieldfilterinput = require("./dtos/field-filter.input");
const _fieldmetadatadto = require("./dtos/field-metadata.dto");
const _fieldmetadataconnectiondto = require("./dtos/field-metadata-connection.dto");
const _relationdto = require("./dtos/relation.dto");
const _updatefieldinput = require("./dtos/update-field.input");
const _fieldmetadataentity = require("./field-metadata.entity");
const _fieldmetadataservice = require("./services/field-metadata.service");
const _fromfieldmetadataentitytofieldmetadatadtoutil = require("./utils/from-field-metadata-entity-to-field-metadata-dto.util");
const _objectmetadatadto = require("../object-metadata/dtos/object-metadata.dto");
const _cursorpaginginput = require("../pagination/dtos/cursor-paging.input");
const _applymetadatafiltertoquerybuilderutil = require("../pagination/utils/apply-metadata-filter-to-query-builder.util");
const _findmanywithcursorpaginationutil = require("../pagination/utils/find-many-with-cursor-pagination.util");
const _fieldmetadatagraphqlapiexceptionhandlerutil = require("./utils/field-metadata-graphql-api-exception-handler.util");
const _fromflatfieldmetadatatofieldmetadatadtoutil = require("../flat-field-metadata/utils/from-flat-field-metadata-to-field-metadata-dto.util");
const _uniquefieldmetadataidsservice = require("../index-metadata/services/unique-field-metadata-ids.service");
const _resolveeffectiveentitypropertyutil = require("../utils/resolve-effective-entity-property.util");
const _permissionsgraphqlapiexceptionfilter = require("../permissions/utils/permissions-graphql-api-exception.filter");
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
let FieldMetadataResolver = class FieldMetadataResolver {
    async fields({ id: workspaceId }, paging, filter) {
        const queryBuilder = this.fieldMetadataRepository.createQueryBuilder('fieldMetadata').where('"fieldMetadata"."workspaceId" = :workspaceId', {
            workspaceId
        });
        (0, _applymetadatafiltertoquerybuilderutil.applyMetadataFilterToQueryBuilder)({
            whereBuilder: queryBuilder,
            alias: 'fieldMetadata',
            filter,
            columnByFilterField: _fieldfilterinput.FIELD_FILTER_COLUMN_BY_FILTER_FIELD
        });
        const connection = await (0, _findmanywithcursorpaginationutil.findManyWithCursorPagination)({
            queryBuilder,
            alias: 'fieldMetadata',
            paging
        });
        const uniqueFieldMetadataIds = await this.uniqueFieldMetadataIdsService.getForWorkspace(workspaceId);
        return {
            ...connection,
            edges: connection.edges.map((edge)=>({
                    ...edge,
                    node: (0, _fromfieldmetadataentitytofieldmetadatadtoutil.fromFieldMetadataEntityToFieldMetadataDto)(edge.node, uniqueFieldMetadataIds)
                }))
        };
    }
    async field(id, { id: workspaceId }) {
        const fieldMetadata = await this.fieldMetadataRepository.findOne({
            where: {
                id,
                workspaceId
            }
        });
        if (!(0, _utils.isDefined)(fieldMetadata)) {
            throw new _graphqlerrorsutil.NotFoundError(`Unable to find FieldMetadataEntity with id: ${id}`);
        }
        const uniqueFieldMetadataIds = await this.uniqueFieldMetadataIdsService.getForWorkspace(workspaceId);
        return (0, _fromfieldmetadataentitytofieldmetadatadtoutil.fromFieldMetadataEntityToFieldMetadataDto)(fieldMetadata, uniqueFieldMetadataIds);
    }
    async object(workspace, { objectMetadataId }, context) {
        return context.loaders.objectMetadataLoader.load({
            workspaceId: workspace.id,
            objectMetadataId
        });
    }
    async isUIReadOnly(fieldMetadata) {
        return !(fieldMetadata.isUIEditable ?? true);
    }
    async resolveStandardOverride(fieldMetadata, labelKey, context, workspaceId) {
        return (0, _resolveeffectiveentitypropertyutil.resolveEffectiveEntityProperty)({
            metadataName: 'fieldMetadata',
            baseValue: fieldMetadata[labelKey],
            overrides: fieldMetadata.overrides,
            property: labelKey,
            i18nContext: await this.applicationTranslationCatalogService.buildEffectiveEntityI18nContext({
                applicationId: fieldMetadata.applicationId ?? undefined,
                loaders: context.loaders,
                locale: context.req.locale,
                workspaceId
            })
        });
    }
    async label(fieldMetadata, context, { id: workspaceId }) {
        return this.resolveStandardOverride(fieldMetadata, 'label', context, workspaceId);
    }
    async description(fieldMetadata, context, { id: workspaceId }) {
        return this.resolveStandardOverride(fieldMetadata, 'description', context, workspaceId);
    }
    async icon(fieldMetadata, context, { id: workspaceId }) {
        return this.resolveStandardOverride(fieldMetadata, 'icon', context, workspaceId);
    }
    async createOneField(input, { id: workspaceId }) {
        try {
            const flatFieldMetadata = await this.fieldMetadataService.createOneField({
                createFieldInput: input.field,
                workspaceId
            });
            return (0, _fromflatfieldmetadatatofieldmetadatadtoutil.fromFlatFieldMetadataToFieldMetadataDto)(flatFieldMetadata);
        } catch (error) {
            return (0, _fieldmetadatagraphqlapiexceptionhandlerutil.fieldMetadataGraphqlApiExceptionHandler)(error);
        }
    }
    async updateOneField(input, { id: workspaceId }) {
        try {
            const flatFieldMetadata = await this.fieldMetadataService.updateOneField({
                updateFieldInput: {
                    ...input.update,
                    id: input.id
                },
                workspaceId
            });
            return (0, _fromflatfieldmetadatatofieldmetadatadtoutil.fromFlatFieldMetadataToFieldMetadataDto)(flatFieldMetadata);
        } catch (error) {
            (0, _fieldmetadatagraphqlapiexceptionhandlerutil.fieldMetadataGraphqlApiExceptionHandler)(error);
        }
    }
    async deleteOneField(deleteOneFieldInput, { id: workspaceId }) {
        if (!(0, _utils.isDefined)(workspaceId)) {
            throw new _graphqlerrorsutil.ForbiddenError('Could not retrieve workspace ID');
        }
        try {
            const flatFieldMetadata = await this.fieldMetadataService.deleteOneField({
                deleteOneFieldInput,
                workspaceId
            });
            return (0, _fromflatfieldmetadatatofieldmetadatadtoutil.fromFlatFieldMetadataToFieldMetadataDto)(flatFieldMetadata);
        } catch (error) {
            (0, _fieldmetadatagraphqlapiexceptionhandlerutil.fieldMetadataGraphqlApiExceptionHandler)(error);
        }
    }
    async relation(workspace, { id: fieldMetadataId, objectMetadataId }, context) {
        try {
            return await context.loaders.relationLoader.load({
                fieldMetadataId,
                objectMetadataId,
                workspaceId: workspace.id
            });
        } catch (error) {
            return (0, _fieldmetadatagraphqlapiexceptionhandlerutil.fieldMetadataGraphqlApiExceptionHandler)(error);
        }
    }
    async morphRelations(workspace, { id: fieldMetadataId, objectMetadataId }, context) {
        try {
            return await context.loaders.morphRelationLoader.load({
                fieldMetadataId,
                objectMetadataId,
                workspaceId: workspace.id
            });
        } catch (error) {
            return (0, _fieldmetadatagraphqlapiexceptionhandlerutil.fieldMetadataGraphqlApiExceptionHandler)(error);
        }
    }
    constructor(fieldMetadataService, applicationTranslationCatalogService, fieldMetadataRepository, uniqueFieldMetadataIdsService){
        this.fieldMetadataService = fieldMetadataService;
        this.applicationTranslationCatalogService = applicationTranslationCatalogService;
        this.fieldMetadataRepository = fieldMetadataRepository;
        this.uniqueFieldMetadataIdsService = uniqueFieldMetadataIdsService;
    }
};
_ts_decorate([
    (0, _common.UseGuards)(_nopermissionguard.NoPermissionGuard),
    (0, _graphql.Query)(()=>_fieldmetadataconnectiondto.FieldConnectionDTO),
    _ts_param(0, (0, _authworkspacedecorator.AuthWorkspace)()),
    _ts_param(1, (0, _graphql.Args)('paging', {
        type: ()=>_cursorpaginginput.CursorPagingInput,
        defaultValue: {
            first: 10
        },
        description: 'Limit or page results.'
    })),
    _ts_param(2, (0, _graphql.Args)('filter', {
        type: ()=>_fieldfilterinput.FieldFilterInput,
        defaultValue: {},
        description: 'Specify to filter the records returned.'
    })),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _workspaceentity.WorkspaceEntity === "undefined" ? Object : _workspaceentity.WorkspaceEntity,
        typeof _cursorpaginginput.CursorPagingInput === "undefined" ? Object : _cursorpaginginput.CursorPagingInput,
        typeof _fieldfilterinput.FieldFilterInput === "undefined" ? Object : _fieldfilterinput.FieldFilterInput
    ]),
    _ts_metadata("design:returntype", Promise)
], FieldMetadataResolver.prototype, "fields", null);
_ts_decorate([
    (0, _common.UseGuards)(_nopermissionguard.NoPermissionGuard),
    (0, _graphql.Query)(()=>_fieldmetadatadto.FieldMetadataDTO),
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
], FieldMetadataResolver.prototype, "field", null);
_ts_decorate([
    (0, _graphql.ResolveField)(()=>_objectmetadatadto.ObjectMetadataDTO, {
        nullable: true
    }),
    _ts_param(0, (0, _authworkspacedecorator.AuthWorkspace)()),
    _ts_param(1, (0, _graphql.Parent)()),
    _ts_param(2, (0, _graphql.Context)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _workspaceentity.WorkspaceEntity === "undefined" ? Object : _workspaceentity.WorkspaceEntity,
        typeof Pick === "undefined" ? Object : Pick,
        Object
    ]),
    _ts_metadata("design:returntype", Promise)
], FieldMetadataResolver.prototype, "object", null);
_ts_decorate([
    (0, _graphql.ResolveField)(()=>Boolean, {
        nullable: true,
        deprecationReason: 'Use isUIEditable'
    }),
    _ts_param(0, (0, _graphql.Parent)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof Pick === "undefined" ? Object : Pick
    ]),
    _ts_metadata("design:returntype", Promise)
], FieldMetadataResolver.prototype, "isUIReadOnly", null);
_ts_decorate([
    (0, _graphql.ResolveField)(()=>String, {
        nullable: true
    }),
    _ts_param(0, (0, _graphql.Parent)()),
    _ts_param(1, (0, _graphql.Context)()),
    _ts_param(2, (0, _authworkspacedecorator.AuthWorkspace)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof FieldMetadataStandardOverrideParent === "undefined" ? Object : FieldMetadataStandardOverrideParent,
        Object,
        typeof _workspaceentity.WorkspaceEntity === "undefined" ? Object : _workspaceentity.WorkspaceEntity
    ]),
    _ts_metadata("design:returntype", Promise)
], FieldMetadataResolver.prototype, "label", null);
_ts_decorate([
    (0, _graphql.ResolveField)(()=>String, {
        nullable: true
    }),
    _ts_param(0, (0, _graphql.Parent)()),
    _ts_param(1, (0, _graphql.Context)()),
    _ts_param(2, (0, _authworkspacedecorator.AuthWorkspace)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof FieldMetadataStandardOverrideParent === "undefined" ? Object : FieldMetadataStandardOverrideParent,
        Object,
        typeof _workspaceentity.WorkspaceEntity === "undefined" ? Object : _workspaceentity.WorkspaceEntity
    ]),
    _ts_metadata("design:returntype", Promise)
], FieldMetadataResolver.prototype, "description", null);
_ts_decorate([
    (0, _graphql.ResolveField)(()=>String, {
        nullable: true
    }),
    _ts_param(0, (0, _graphql.Parent)()),
    _ts_param(1, (0, _graphql.Context)()),
    _ts_param(2, (0, _authworkspacedecorator.AuthWorkspace)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof FieldMetadataStandardOverrideParent === "undefined" ? Object : FieldMetadataStandardOverrideParent,
        Object,
        typeof _workspaceentity.WorkspaceEntity === "undefined" ? Object : _workspaceentity.WorkspaceEntity
    ]),
    _ts_metadata("design:returntype", Promise)
], FieldMetadataResolver.prototype, "icon", null);
_ts_decorate([
    (0, _common.UseGuards)((0, _settingspermissionguard.SettingsPermissionGuard)(_constants.PermissionFlagType.DATA_MODEL)),
    (0, _graphql.Mutation)(()=>_fieldmetadatadto.FieldMetadataDTO),
    _ts_param(0, (0, _graphql.Args)('input')),
    _ts_param(1, (0, _authworkspacedecorator.AuthWorkspace)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _createfieldinput.CreateOneFieldMetadataInput === "undefined" ? Object : _createfieldinput.CreateOneFieldMetadataInput,
        typeof _workspaceentity.WorkspaceEntity === "undefined" ? Object : _workspaceentity.WorkspaceEntity
    ]),
    _ts_metadata("design:returntype", Promise)
], FieldMetadataResolver.prototype, "createOneField", null);
_ts_decorate([
    (0, _common.UseGuards)((0, _settingspermissionguard.SettingsPermissionGuard)(_constants.PermissionFlagType.DATA_MODEL)),
    (0, _graphql.Mutation)(()=>_fieldmetadatadto.FieldMetadataDTO),
    _ts_param(0, (0, _graphql.Args)('input')),
    _ts_param(1, (0, _authworkspacedecorator.AuthWorkspace)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _updatefieldinput.UpdateOneFieldMetadataInput === "undefined" ? Object : _updatefieldinput.UpdateOneFieldMetadataInput,
        typeof _workspaceentity.WorkspaceEntity === "undefined" ? Object : _workspaceentity.WorkspaceEntity
    ]),
    _ts_metadata("design:returntype", Promise)
], FieldMetadataResolver.prototype, "updateOneField", null);
_ts_decorate([
    (0, _common.UseGuards)((0, _settingspermissionguard.SettingsPermissionGuard)(_constants.PermissionFlagType.DATA_MODEL)),
    (0, _graphql.Mutation)(()=>_fieldmetadatadto.FieldMetadataDTO),
    _ts_param(0, (0, _graphql.Args)('input')),
    _ts_param(1, (0, _authworkspacedecorator.AuthWorkspace)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _deletefieldinput.DeleteOneFieldInput === "undefined" ? Object : _deletefieldinput.DeleteOneFieldInput,
        typeof _workspaceentity.WorkspaceEntity === "undefined" ? Object : _workspaceentity.WorkspaceEntity
    ]),
    _ts_metadata("design:returntype", Promise)
], FieldMetadataResolver.prototype, "deleteOneField", null);
_ts_decorate([
    (0, _graphql.ResolveField)(()=>_relationdto.RelationDTO, {
        nullable: true
    }),
    _ts_param(0, (0, _authworkspacedecorator.AuthWorkspace)()),
    _ts_param(1, (0, _graphql.Parent)()),
    _ts_param(2, (0, _graphql.Context)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _workspaceentity.WorkspaceEntity === "undefined" ? Object : _workspaceentity.WorkspaceEntity,
        typeof Pick === "undefined" ? Object : Pick,
        Object
    ]),
    _ts_metadata("design:returntype", Promise)
], FieldMetadataResolver.prototype, "relation", null);
_ts_decorate([
    (0, _graphql.ResolveField)(()=>[
            _relationdto.RelationDTO
        ], {
        nullable: true
    }),
    _ts_param(0, (0, _authworkspacedecorator.AuthWorkspace)()),
    _ts_param(1, (0, _graphql.Parent)()),
    _ts_param(2, (0, _graphql.Context)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _workspaceentity.WorkspaceEntity === "undefined" ? Object : _workspaceentity.WorkspaceEntity,
        typeof Pick === "undefined" ? Object : Pick,
        Object
    ]),
    _ts_metadata("design:returntype", Promise)
], FieldMetadataResolver.prototype, "morphRelations", null);
FieldMetadataResolver = _ts_decorate([
    (0, _common.UseGuards)(_workspaceauthguard.WorkspaceAuthGuard),
    (0, _common.UsePipes)(_resolvervalidationpipe.ResolverValidationPipe),
    (0, _metadataresolverdecorator.MetadataResolver)(()=>_fieldmetadatadto.FieldMetadataDTO),
    (0, _common.UseFilters)(_permissionsgraphqlapiexceptionfilter.PermissionsGraphqlApiExceptionFilter, _preventnesttoautologgraphqlerrorsfilter.PreventNestToAutoLogGraphqlErrorsFilter),
    _ts_param(2, (0, _typeorm.InjectRepository)(_fieldmetadataentity.FieldMetadataEntity)),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _fieldmetadataservice.FieldMetadataService === "undefined" ? Object : _fieldmetadataservice.FieldMetadataService,
        typeof _applicationtranslationcatalogservice.ApplicationTranslationCatalogService === "undefined" ? Object : _applicationtranslationcatalogservice.ApplicationTranslationCatalogService,
        typeof _typeorm1.Repository === "undefined" ? Object : _typeorm1.Repository,
        typeof _uniquefieldmetadataidsservice.UniqueFieldMetadataIdsService === "undefined" ? Object : _uniquefieldmetadataidsservice.UniqueFieldMetadataIdsService
    ])
], FieldMetadataResolver);

//# sourceMappingURL=field-metadata.resolver.js.map