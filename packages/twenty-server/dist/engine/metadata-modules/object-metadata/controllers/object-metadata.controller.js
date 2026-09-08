"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "ObjectMetadataController", {
    enumerable: true,
    get: function() {
        return ObjectMetadataController;
    }
});
const _common = require("@nestjs/common");
const _typeorm = require("@nestjs/typeorm");
const _constants = require("twenty-shared/constants");
const _types = require("twenty-shared/types");
const _typeorm1 = require("typeorm");
const _paginatebyidcursorutil = require("../../../api/rest/metadata/utils/paginate-by-id-cursor.util");
const _applicationrestapiexceptionfilter = require("../../../core-modules/application/application-rest-api-exception.filter");
const _featureflagservice = require("../../../core-modules/feature-flag/services/feature-flag.service");
const _workspaceentity = require("../../../core-modules/workspace/workspace.entity");
const _authworkspacedecorator = require("../../../decorators/auth/auth-workspace.decorator");
const _jwtauthguard = require("../../../guards/jwt-auth.guard");
const _settingspermissionguard = require("../../../guards/settings-permission.guard");
const _workspaceauthguard = require("../../../guards/workspace-auth.guard");
const _fieldmetadataentity = require("../../field-metadata/field-metadata.entity");
const _fromfieldmetadataentitytofieldmetadatadtoutil = require("../../field-metadata/utils/from-field-metadata-entity-to-field-metadata-dto.util");
const _flatentitymapsrestapiexceptionfilter = require("../../flat-entity/filters/flat-entity-maps-rest-api-exception.filter");
const _fromflatobjectmetadatatoobjectmetadatadtoutil = require("../../flat-object-metadata/utils/from-flat-object-metadata-to-object-metadata-dto.util");
const _uniquefieldmetadataidsservice = require("../../index-metadata/services/unique-field-metadata-ids.service");
const _createobjectinput = require("../dtos/create-object.input");
const _updateobjectinput = require("../dtos/update-object.input");
const _objectmetadatarestapiexceptionfilter = require("../filters/object-metadata-rest-api-exception.filter");
const _objectmetadataentity = require("../object-metadata.entity");
const _objectmetadataexception = require("../object-metadata.exception");
const _objectmetadataservice = require("../object-metadata.service");
const _fromobjectmetadataentitytoobjectmetadatadtoutil = require("../utils/from-object-metadata-entity-to-object-metadata-dto.util");
const _applicationtranslationcatalogservice = require("../../application-translation-catalog/services/application-translation-catalog.service");
const _requestlocaledecorator = require("../../../decorators/locale/request-locale.decorator");
const _tolegacyobjectmetadataresponseutil = require("../utils/to-legacy-object-metadata-response.util");
const _permissionsrestapiexceptionfilter = require("../../permissions/utils/permissions-rest-api-exception.filter");
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
let ObjectMetadataController = class ObjectMetadataController {
    async findMany(request, { id: workspaceId }, locale) {
        const { items, pageInfo, totalCount } = await (0, _paginatebyidcursorutil.paginateByIdCursor)({
            repository: this.objectMetadataRepository,
            workspaceId,
            request
        });
        const [fields, uniqueFieldMetadataIds] = await Promise.all([
            this.findFieldsForObjectIds(workspaceId, items.map((object)=>object.id)),
            this.uniqueFieldMetadataIdsService.getForWorkspace(workspaceId)
        ]);
        const data = await this.toObjectWithFieldsDtos({
            objects: items,
            fieldsByObjectId: fields,
            uniqueFieldMetadataIds,
            locale,
            workspaceId
        });
        const result = {
            data,
            pageInfo,
            totalCount
        };
        return await this.isNewMetadataFormat(workspaceId) ? result : (0, _tolegacyobjectmetadataresponseutil.toLegacyObjectMetadataListResponse)(result);
    }
    async findOne(id, { id: workspaceId }, locale) {
        const object = await this.objectMetadataRepository.findOne({
            where: {
                id,
                workspaceId
            }
        });
        if (!object) {
            throw new _objectmetadataexception.ObjectMetadataException('Object metadata not found', _objectmetadataexception.ObjectMetadataExceptionCode.OBJECT_METADATA_NOT_FOUND);
        }
        const [fields, uniqueFieldMetadataIds] = await Promise.all([
            this.fieldMetadataRepository.find({
                where: {
                    objectMetadataId: object.id,
                    workspaceId
                }
            }),
            this.uniqueFieldMetadataIdsService.getForWorkspace(workspaceId)
        ]);
        const [result] = await this.toObjectWithFieldsDtos({
            objects: [
                object
            ],
            fieldsByObjectId: new Map([
                [
                    object.id,
                    fields
                ]
            ]),
            uniqueFieldMetadataIds,
            locale,
            workspaceId
        });
        return await this.isNewMetadataFormat(workspaceId) ? result : (0, _tolegacyobjectmetadataresponseutil.toLegacyObjectMetadataFindOneResponse)(result);
    }
    async createOne(input, { id: workspaceId }) {
        const flatObject = await this.objectMetadataService.createOneObject({
            createObjectInput: input,
            workspaceId
        });
        const [fields, uniqueFieldMetadataIds] = await Promise.all([
            this.fieldMetadataRepository.find({
                where: {
                    objectMetadataId: flatObject.id,
                    workspaceId
                }
            }),
            this.uniqueFieldMetadataIdsService.getForWorkspace(workspaceId)
        ]);
        const result = {
            ...(0, _fromflatobjectmetadatatoobjectmetadatadtoutil.fromFlatObjectMetadataToObjectMetadataDto)(flatObject),
            fields: fields.map((field)=>(0, _fromfieldmetadataentitytofieldmetadatadtoutil.fromFieldMetadataEntityToFieldMetadataDto)(field, uniqueFieldMetadataIds))
        };
        return await this.isNewMetadataFormat(workspaceId) ? result : (0, _tolegacyobjectmetadataresponseutil.toLegacyObjectMetadataCreateResponse)(result);
    }
    async updateOnePatch(id, update, { id: workspaceId }) {
        return this.handleUpdate({
            id,
            update,
            workspaceId
        });
    }
    async updateOnePut(id, update, { id: workspaceId }) {
        return this.handleUpdate({
            id,
            update,
            workspaceId
        });
    }
    async deleteOne(id, { id: workspaceId }) {
        const flatObject = await this.objectMetadataService.deleteOneObject({
            deleteObjectInput: {
                id
            },
            workspaceId
        });
        const result = (0, _fromflatobjectmetadatatoobjectmetadatadtoutil.fromFlatObjectMetadataToObjectMetadataDto)(flatObject);
        return await this.isNewMetadataFormat(workspaceId) ? result : (0, _tolegacyobjectmetadataresponseutil.toLegacyObjectMetadataDeleteResponse)(result);
    }
    async handleUpdate({ id, update, workspaceId }) {
        const flatObject = await this.objectMetadataService.updateOneObject({
            updateObjectInput: {
                id,
                update
            },
            workspaceId
        });
        const [fields, uniqueFieldMetadataIds] = await Promise.all([
            this.fieldMetadataRepository.find({
                where: {
                    objectMetadataId: flatObject.id,
                    workspaceId
                }
            }),
            this.uniqueFieldMetadataIdsService.getForWorkspace(workspaceId)
        ]);
        const result = {
            ...(0, _fromflatobjectmetadatatoobjectmetadatadtoutil.fromFlatObjectMetadataToObjectMetadataDto)(flatObject),
            fields: fields.map((field)=>(0, _fromfieldmetadataentitytofieldmetadatadtoutil.fromFieldMetadataEntityToFieldMetadataDto)(field, uniqueFieldMetadataIds))
        };
        return await this.isNewMetadataFormat(workspaceId) ? result : (0, _tolegacyobjectmetadataresponseutil.toLegacyObjectMetadataUpdateResponse)(result);
    }
    async isNewMetadataFormat(workspaceId) {
        return this.featureFlagService.isFeatureEnabled(_types.FeatureFlagKey.IS_REST_METADATA_API_NEW_FORMAT_DIRECT, workspaceId);
    }
    async findFieldsForObjectIds(workspaceId, objectIds) {
        const grouped = new Map();
        if (objectIds.length === 0) {
            return grouped;
        }
        const fields = await this.fieldMetadataRepository.find({
            where: {
                workspaceId,
                objectMetadataId: (0, _typeorm1.In)(objectIds)
            }
        });
        for (const field of fields){
            const list = grouped.get(field.objectMetadataId);
            if (list) {
                list.push(field);
            } else {
                grouped.set(field.objectMetadataId, [
                    field
                ]);
            }
        }
        return grouped;
    }
    // REST returns the same labels the app renders: resolved for the caller's
    // locale, through the one resolver the GraphQL read path uses. Objects and
    // every field across them resolve in one call each, so a page costs a fixed
    // number of catalog reads rather than one per row.
    async toObjectWithFieldsDtos({ objects, fieldsByObjectId, uniqueFieldMetadataIds, locale, workspaceId }) {
        const [resolvedObjects, resolvedFields] = await Promise.all([
            this.applicationTranslationCatalogService.resolveTranslatablePropertiesForEntities({
                metadataName: 'objectMetadata',
                entities: objects,
                locale,
                workspaceId
            }),
            this.applicationTranslationCatalogService.resolveTranslatablePropertiesForEntities({
                metadataName: 'fieldMetadata',
                entities: objects.flatMap((object)=>fieldsByObjectId.get(object.id) ?? []),
                locale,
                workspaceId
            })
        ]);
        const resolvedFieldsByObjectId = new Map();
        for (const field of resolvedFields){
            const fieldsForObject = resolvedFieldsByObjectId.get(field.objectMetadataId) ?? [];
            fieldsForObject.push(field);
            resolvedFieldsByObjectId.set(field.objectMetadataId, fieldsForObject);
        }
        return resolvedObjects.map((object)=>({
                ...(0, _fromobjectmetadataentitytoobjectmetadatadtoutil.fromObjectMetadataEntityToObjectMetadataDto)(object),
                fields: (resolvedFieldsByObjectId.get(object.id) ?? []).map((field)=>(0, _fromfieldmetadataentitytofieldmetadatadtoutil.fromFieldMetadataEntityToFieldMetadataDto)(field, uniqueFieldMetadataIds))
            }));
    }
    constructor(objectMetadataRepository, fieldMetadataRepository, objectMetadataService, featureFlagService, uniqueFieldMetadataIdsService, applicationTranslationCatalogService){
        this.objectMetadataRepository = objectMetadataRepository;
        this.fieldMetadataRepository = fieldMetadataRepository;
        this.objectMetadataService = objectMetadataService;
        this.featureFlagService = featureFlagService;
        this.uniqueFieldMetadataIdsService = uniqueFieldMetadataIdsService;
        this.applicationTranslationCatalogService = applicationTranslationCatalogService;
    }
};
_ts_decorate([
    (0, _common.Get)(),
    _ts_param(0, (0, _common.Req)()),
    _ts_param(1, (0, _authworkspacedecorator.AuthWorkspace)()),
    _ts_param(2, (0, _requestlocaledecorator.RequestLocale)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof AuthenticatedRequest === "undefined" ? Object : AuthenticatedRequest,
        typeof _workspaceentity.WorkspaceEntity === "undefined" ? Object : _workspaceentity.WorkspaceEntity,
        Object
    ]),
    _ts_metadata("design:returntype", Promise)
], ObjectMetadataController.prototype, "findMany", null);
_ts_decorate([
    (0, _common.Get)(':id'),
    _ts_param(0, (0, _common.Param)('id', new _common.ParseUUIDPipe())),
    _ts_param(1, (0, _authworkspacedecorator.AuthWorkspace)()),
    _ts_param(2, (0, _requestlocaledecorator.RequestLocale)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        typeof _workspaceentity.WorkspaceEntity === "undefined" ? Object : _workspaceentity.WorkspaceEntity,
        Object
    ]),
    _ts_metadata("design:returntype", Promise)
], ObjectMetadataController.prototype, "findOne", null);
_ts_decorate([
    (0, _common.Post)(),
    _ts_param(0, (0, _common.Body)()),
    _ts_param(1, (0, _authworkspacedecorator.AuthWorkspace)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _createobjectinput.CreateObjectInput === "undefined" ? Object : _createobjectinput.CreateObjectInput,
        typeof _workspaceentity.WorkspaceEntity === "undefined" ? Object : _workspaceentity.WorkspaceEntity
    ]),
    _ts_metadata("design:returntype", Promise)
], ObjectMetadataController.prototype, "createOne", null);
_ts_decorate([
    (0, _common.Patch)(':id'),
    _ts_param(0, (0, _common.Param)('id', new _common.ParseUUIDPipe())),
    _ts_param(1, (0, _common.Body)()),
    _ts_param(2, (0, _authworkspacedecorator.AuthWorkspace)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        typeof _updateobjectinput.UpdateObjectPayload === "undefined" ? Object : _updateobjectinput.UpdateObjectPayload,
        typeof _workspaceentity.WorkspaceEntity === "undefined" ? Object : _workspaceentity.WorkspaceEntity
    ]),
    _ts_metadata("design:returntype", Promise)
], ObjectMetadataController.prototype, "updateOnePatch", null);
_ts_decorate([
    (0, _common.Put)(':id'),
    _ts_param(0, (0, _common.Param)('id', new _common.ParseUUIDPipe())),
    _ts_param(1, (0, _common.Body)()),
    _ts_param(2, (0, _authworkspacedecorator.AuthWorkspace)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        typeof _updateobjectinput.UpdateObjectPayload === "undefined" ? Object : _updateobjectinput.UpdateObjectPayload,
        typeof _workspaceentity.WorkspaceEntity === "undefined" ? Object : _workspaceentity.WorkspaceEntity
    ]),
    _ts_metadata("design:returntype", Promise)
], ObjectMetadataController.prototype, "updateOnePut", null);
_ts_decorate([
    (0, _common.Delete)(':id'),
    _ts_param(0, (0, _common.Param)('id', new _common.ParseUUIDPipe())),
    _ts_param(1, (0, _authworkspacedecorator.AuthWorkspace)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        typeof _workspaceentity.WorkspaceEntity === "undefined" ? Object : _workspaceentity.WorkspaceEntity
    ]),
    _ts_metadata("design:returntype", Promise)
], ObjectMetadataController.prototype, "deleteOne", null);
ObjectMetadataController = _ts_decorate([
    (0, _common.Controller)(`${_types.ApiPath.Rest}/metadata/objects`),
    (0, _common.UseGuards)(_jwtauthguard.JwtAuthGuard, _workspaceauthguard.WorkspaceAuthGuard, (0, _settingspermissionguard.SettingsPermissionGuard)(_constants.PermissionFlagType.DATA_MODEL)),
    (0, _common.UseFilters)(_permissionsrestapiexceptionfilter.PermissionsRestApiExceptionFilter, _objectmetadatarestapiexceptionfilter.ObjectMetadataRestApiExceptionFilter, _applicationrestapiexceptionfilter.ApplicationRestApiExceptionFilter, _flatentitymapsrestapiexceptionfilter.FlatEntityMapsRestApiExceptionFilter),
    (0, _common.UsePipes)(new _common.ValidationPipe()),
    _ts_param(0, (0, _typeorm.InjectRepository)(_objectmetadataentity.ObjectMetadataEntity)),
    _ts_param(1, (0, _typeorm.InjectRepository)(_fieldmetadataentity.FieldMetadataEntity)),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _typeorm1.Repository === "undefined" ? Object : _typeorm1.Repository,
        typeof _typeorm1.Repository === "undefined" ? Object : _typeorm1.Repository,
        typeof _objectmetadataservice.ObjectMetadataService === "undefined" ? Object : _objectmetadataservice.ObjectMetadataService,
        typeof _featureflagservice.FeatureFlagService === "undefined" ? Object : _featureflagservice.FeatureFlagService,
        typeof _uniquefieldmetadataidsservice.UniqueFieldMetadataIdsService === "undefined" ? Object : _uniquefieldmetadataidsservice.UniqueFieldMetadataIdsService,
        typeof _applicationtranslationcatalogservice.ApplicationTranslationCatalogService === "undefined" ? Object : _applicationtranslationcatalogservice.ApplicationTranslationCatalogService
    ])
], ObjectMetadataController);

//# sourceMappingURL=object-metadata.controller.js.map