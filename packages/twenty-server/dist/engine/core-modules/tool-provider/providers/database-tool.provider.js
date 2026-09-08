"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "DatabaseToolProvider", {
    enumerable: true,
    get: function() {
        return DatabaseToolProvider;
    }
});
const _common = require("@nestjs/common");
const _translations = require("twenty-shared/translations");
const _utils = require("twenty-shared/utils");
const _workflow = require("twenty-shared/workflow");
const _i18nservice = require("../../i18n/i18n.service");
const _getcrudtoollabelutil = require("../utils/get-crud-tool-label.util");
const _resolveeffectivefielddescriptionutil = require("../utils/resolve-effective-field-description.util");
const _getflatfieldsforflatobjectmetadatautil = require("../../../api/graphql/workspace-schema-builder/utils/get-flat-fields-for-flat-object-metadata.util");
const _generatecreatemanyrecordinputschemautil = require("../../record-crud/utils/generate-create-many-record-input-schema.util");
const _generatecreaterecordinputschemautil = require("../../record-crud/utils/generate-create-record-input-schema.util");
const _generateupdatemanyrecordinputschemautil = require("../../record-crud/utils/generate-update-many-record-input-schema.util");
const _generateupdaterecordinputschemautil = require("../../record-crud/utils/generate-update-record-input-schema.util");
const _totooljsonschemautil = require("../../record-crud/utils/to-tool-json-schema.util");
const _bulkdeletetoolzodschema = require("../../record-crud/zod-schemas/bulk-delete-tool.zod-schema");
const _deletetoolzodschema = require("../../record-crud/zod-schemas/delete-tool.zod-schema");
const _findonetoolzodschema = require("../../record-crud/zod-schemas/find-one-tool.zod-schema");
const _findtoolzodschema = require("../../record-crud/zod-schemas/find-tool.zod-schema");
const _groupbytoolzodschema = require("../../record-crud/zod-schemas/group-by-tool.zod-schema");
const _getdatabasecrudtoolflatobjectsutil = require("../../../metadata-modules/ai/ai-agent/utils/get-database-crud-tool-flat-objects.util");
const _workspacemanyorallflatentitymapscacheservice = require("../../../metadata-modules/flat-entity/services/workspace-many-or-all-flat-entity-maps-cache.service");
const _getobjectspermissionsfromrolepermissionconfigutil = require("../../../twenty-orm/utils/get-objects-permissions-from-role-permission-config.util");
const _getroleidsfromrolepermissionconfigutil = require("../../../twenty-orm/utils/get-role-ids-from-role-permission-config.util");
const _workspacecacheservice = require("../../../workspace-cache/services/workspace-cache.service");
const _ai = require("twenty-shared/ai");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let DatabaseToolProvider = class DatabaseToolProvider {
    async isAvailable(_context) {
        return true;
    }
    // Database CRUD tools emit `executionRef.kind === 'database_crud'` descriptors
    // and are dispatched inline by ToolExecutorService. The static-tool path is
    // unreachable for this provider; this method exists only to satisfy the
    // interface.
    async executeStaticTool(toolName, _args, _context) {
        throw new Error(`DatabaseToolProvider does not emit static-kind descriptors (tool: ${toolName})`);
    }
    async generateDescriptors(context, options) {
        const includeSchemas = options?.includeSchemas ?? true;
        const toolNames = options?.toolNames;
        const descriptors = [];
        const { rolesPermissions, flatObjectPermissionMaps } = await this.workspaceCacheService.getOrRecompute(context.workspaceId, [
            'rolesPermissions',
            'flatObjectPermissionMaps'
        ]);
        const objectPermissions = (0, _getobjectspermissionsfromrolepermissionconfigutil.getObjectsPermissionsFromRolePermissionConfig)({
            rolesPermissions,
            rolePermissionConfig: context.rolePermissionConfig
        });
        if (Object.keys(objectPermissions).length === 0) {
            return descriptors;
        }
        const requireExplicitObjectGrants = context.requireExplicitObjectGrants === true;
        const roleId = (0, _getroleidsfromrolepermissionconfigutil.getRoleIdsFromRolePermissionConfig)(context.rolePermissionConfig)[0];
        const explicitPermissionByObjectId = new Map();
        if (requireExplicitObjectGrants) {
            for (const flatObjectPermission of Object.values(flatObjectPermissionMaps.byUniversalIdentifier)){
                if ((0, _utils.isDefined)(flatObjectPermission) && flatObjectPermission.roleId === roleId) {
                    explicitPermissionByObjectId.set(flatObjectPermission.objectMetadataId, flatObjectPermission);
                }
            }
        }
        const { flatObjectMetadataMaps, flatFieldMetadataMaps } = await this.flatEntityMapsCacheService.getOrRecomputeManyOrAllFlatEntityMaps({
            workspaceId: context.workspaceId,
            flatMapsKeys: [
                'flatObjectMetadataMaps',
                'flatFieldMetadataMaps'
            ]
        });
        const allFlatObjects = (0, _getdatabasecrudtoolflatobjectsutil.getDatabaseCrudToolFlatObjects)(flatObjectMetadataMaps.byUniversalIdentifier);
        const i18nInstance = this.i18nService.getI18nInstance(context.locale ?? _translations.SOURCE_LOCALE);
        for (const flatObject of allFlatObjects){
            const permission = objectPermissions[flatObject.id];
            const explicitPermission = explicitPermissionByObjectId.get(flatObject.id);
            if (!permission || requireExplicitObjectGrants && !(0, _utils.isDefined)(explicitPermission)) {
                continue;
            }
            const canReadRecords = requireExplicitObjectGrants ? explicitPermission?.canReadObjectRecords === true : permission.canReadObjectRecords;
            const canUpdateRecords = requireExplicitObjectGrants ? explicitPermission?.canUpdateObjectRecords === true : permission.canUpdateObjectRecords;
            const canSoftDeleteRecords = requireExplicitObjectGrants ? explicitPermission?.canSoftDeleteObjectRecords === true : permission.canSoftDeleteObjectRecords;
            const snakePlural = (0, _utils.camelToSnakeCase)(flatObject.namePlural);
            const snakeSingular = (0, _utils.camelToSnakeCase)(flatObject.nameSingular);
            if ((0, _utils.isDefined)(toolNames) && !this.hasMatchingTool(toolNames, snakeSingular, snakePlural)) {
                continue;
            }
            const fields = includeSchemas ? (0, _getflatfieldsforflatobjectmetadatautil.getFlatFieldsFromFlatObjectMetadata)(flatObject, flatFieldMetadataMaps).map((flatFieldMetadata)=>({
                    ...flatFieldMetadata,
                    description: (0, _resolveeffectivefielddescriptionutil.resolveEffectiveFieldDescription)({
                        flatFieldMetadata,
                        locale: context.locale,
                        i18nInstance
                    })
                })) : [];
            const objectMetadata = {
                ...flatObject,
                fields
            };
            const restrictedFields = permission.restrictedFields;
            const canBeManagedByAutomation = (0, _workflow.canObjectBeManagedByAutomation)({
                nameSingular: objectMetadata.nameSingular
            });
            const shouldIncludeSchema = (name)=>includeSchemas && (!toolNames || toolNames.has(name));
            if (canReadRecords) {
                descriptors.push({
                    name: `find_many_${snakePlural}`,
                    ...(0, _getcrudtoollabelutil.getCrudToolLabels)('find_many', flatObject.labelPlural, this.i18nService, context.locale),
                    description: `Search for ${objectMetadata.labelPlural} records using flexible filtering criteria. Supports exact matches, pattern matching, ranges, and null checks. Use limit/offset for pagination and orderBy for sorting. Filter fields are top-level arguments — pass each field as its own key (e.g. { id: { eq: "record-id" } }, or { name: { firstName: { ilike: "%ada%" } } }); do NOT wrap them in a "filter" object and do NOT place a bare operator like "ilike"/"eq" at the top level. Combine conditions with and/or/not. Returns an array of matching records with their full data, plus a "count" of total matches and a "hasNextPage" flag. When "hasNextPage" is true, more records match than were returned: continue with a higher offset (or increase the limit) before concluding a record is absent or answering count/enumeration questions.`,
                    category: _ai.ToolCategory.DATABASE_CRUD,
                    ...shouldIncludeSchema(`find_many_${snakePlural}`) && {
                        inputSchema: (0, _totooljsonschemautil.toToolJsonSchema)((0, _findtoolzodschema.generateFindToolInputSchema)(objectMetadata, restrictedFields))
                    },
                    executionRef: {
                        kind: 'database_crud',
                        objectNameSingular: objectMetadata.nameSingular,
                        operation: 'find_many'
                    },
                    objectName: objectMetadata.nameSingular,
                    icon: flatObject.icon ?? undefined,
                    operation: 'find_many'
                });
                descriptors.push({
                    name: `find_one_${snakeSingular}`,
                    ...(0, _getcrudtoollabelutil.getCrudToolLabels)('find_one', flatObject.labelSingular, this.i18nService, context.locale),
                    description: `Retrieve a single ${objectMetadata.labelSingular} by ID.`,
                    category: _ai.ToolCategory.DATABASE_CRUD,
                    ...shouldIncludeSchema(`find_one_${snakeSingular}`) && {
                        inputSchema: (0, _totooljsonschemautil.toToolJsonSchema)(_findonetoolzodschema.FindOneToolInputSchema)
                    },
                    executionRef: {
                        kind: 'database_crud',
                        objectNameSingular: objectMetadata.nameSingular,
                        operation: 'find_one'
                    },
                    objectName: objectMetadata.nameSingular,
                    icon: flatObject.icon ?? undefined,
                    operation: 'find_one'
                });
                const groupByName = `group_by_${snakePlural}`;
                const shouldGenerateGroupBy = shouldIncludeSchema(groupByName);
                const groupBySchema = shouldGenerateGroupBy ? (0, _groupbytoolzodschema.generateGroupByToolInputSchema)(objectMetadata, restrictedFields) : null;
                const hasGroupBySchema = !includeSchemas || groupBySchema !== null || (0, _groupbytoolzodschema.hasGroupByToolInputSchema)(objectMetadata, restrictedFields);
                if (hasGroupBySchema) {
                    descriptors.push({
                        name: groupByName,
                        ...(0, _getcrudtoollabelutil.getCrudToolLabels)('group_by', flatObject.labelPlural, this.i18nService, context.locale),
                        description: `Group ${objectMetadata.labelPlural} records by one or two fields and compute an aggregate (COUNT, SUM, AVG, MIN, MAX, etc.). Use for questions like "how many deals per stage?" or "total revenue by company". Returns groups with dimension values and aggregate results, ordered by the aggregate value.`,
                        category: _ai.ToolCategory.DATABASE_CRUD,
                        ...shouldGenerateGroupBy && groupBySchema && {
                            inputSchema: (0, _totooljsonschemautil.toToolJsonSchema)(groupBySchema)
                        },
                        executionRef: {
                            kind: 'database_crud',
                            objectNameSingular: objectMetadata.nameSingular,
                            operation: 'group_by'
                        },
                        objectName: objectMetadata.nameSingular,
                        icon: flatObject.icon ?? undefined,
                        operation: 'group_by'
                    });
                }
            }
            if (canUpdateRecords && canBeManagedByAutomation) {
                descriptors.push({
                    name: `create_one_${snakeSingular}`,
                    ...(0, _getcrudtoollabelutil.getCrudToolLabels)('create_one', flatObject.labelSingular, this.i18nService, context.locale),
                    description: `Create a new ${objectMetadata.labelSingular} record. Provide all required fields and any optional fields you want to set. The system will automatically handle timestamps and IDs. Returns the created record with all its data.`,
                    category: _ai.ToolCategory.DATABASE_CRUD,
                    ...shouldIncludeSchema(`create_one_${snakeSingular}`) && {
                        inputSchema: (0, _totooljsonschemautil.toToolJsonSchema)((0, _generatecreaterecordinputschemautil.generateCreateRecordInputSchema)(objectMetadata, restrictedFields))
                    },
                    executionRef: {
                        kind: 'database_crud',
                        objectNameSingular: objectMetadata.nameSingular,
                        operation: 'create_one'
                    },
                    objectName: objectMetadata.nameSingular,
                    icon: flatObject.icon ?? undefined,
                    operation: 'create_one'
                });
                descriptors.push({
                    name: `create_many_${snakePlural}`,
                    ...(0, _getcrudtoollabelutil.getCrudToolLabels)('create_many', flatObject.labelPlural, this.i18nService, context.locale),
                    description: `Create multiple ${objectMetadata.labelPlural} records in a single call. Provide an array of records, each containing the required fields. Maximum 20 records per call. Returns the created records.`,
                    category: _ai.ToolCategory.DATABASE_CRUD,
                    ...shouldIncludeSchema(`create_many_${snakePlural}`) && {
                        inputSchema: (0, _totooljsonschemautil.toToolJsonSchema)((0, _generatecreatemanyrecordinputschemautil.generateCreateManyRecordInputSchema)(objectMetadata, restrictedFields))
                    },
                    executionRef: {
                        kind: 'database_crud',
                        objectNameSingular: objectMetadata.nameSingular,
                        operation: 'create_many'
                    },
                    objectName: objectMetadata.nameSingular,
                    icon: flatObject.icon ?? undefined,
                    operation: 'create_many'
                });
                descriptors.push({
                    name: `update_one_${snakeSingular}`,
                    ...(0, _getcrudtoollabelutil.getCrudToolLabels)('update_one', flatObject.labelSingular, this.i18nService, context.locale),
                    description: `Update an existing ${objectMetadata.labelSingular} record. Provide the record ID and only the fields you want to change. Unspecified fields will remain unchanged. Returns the updated record with all current data.`,
                    category: _ai.ToolCategory.DATABASE_CRUD,
                    ...shouldIncludeSchema(`update_one_${snakeSingular}`) && {
                        inputSchema: (0, _totooljsonschemautil.toToolJsonSchema)((0, _generateupdaterecordinputschemautil.generateUpdateRecordInputSchema)(objectMetadata, restrictedFields))
                    },
                    executionRef: {
                        kind: 'database_crud',
                        objectNameSingular: objectMetadata.nameSingular,
                        operation: 'update_one'
                    },
                    objectName: objectMetadata.nameSingular,
                    icon: flatObject.icon ?? undefined,
                    operation: 'update_one'
                });
                descriptors.push({
                    name: `update_many_${snakePlural}`,
                    ...(0, _getcrudtoollabelutil.getCrudToolLabels)('update_many', flatObject.labelPlural, this.i18nService, context.locale),
                    description: `Apply the SAME field values to all ${objectMetadata.labelPlural} records matching a filter. Use when every matched record gets identical changes (e.g. bulk status change). For records that each have different data to update, use upsert_many_${snakePlural} instead. WARNING: Use specific filters to avoid unintended mass updates. Always verify the filter scope with a find query first.`,
                    category: _ai.ToolCategory.DATABASE_CRUD,
                    ...shouldIncludeSchema(`update_many_${snakePlural}`) && {
                        inputSchema: (0, _totooljsonschemautil.toToolJsonSchema)((0, _generateupdatemanyrecordinputschemautil.generateUpdateManyRecordInputSchema)(objectMetadata, restrictedFields))
                    },
                    executionRef: {
                        kind: 'database_crud',
                        objectNameSingular: objectMetadata.nameSingular,
                        operation: 'update_many'
                    },
                    objectName: objectMetadata.nameSingular,
                    icon: flatObject.icon ?? undefined,
                    operation: 'update_many'
                });
                descriptors.push({
                    name: `upsert_many_${snakePlural}`,
                    ...(0, _getcrudtoollabelutil.getCrudToolLabels)('upsert_many', flatObject.labelPlural, this.i18nService, context.locale),
                    description: `Insert or update multiple ${objectMetadata.labelPlural} records in a single call, where each record has its own individual data. Use this instead of update_many_${snakePlural} when records need different field values. Existing records are matched by unique fields and updated; records with no match are created. Maximum 20 records per call. Returns the upserted records.`,
                    category: _ai.ToolCategory.DATABASE_CRUD,
                    ...shouldIncludeSchema(`upsert_many_${snakePlural}`) && {
                        inputSchema: (0, _totooljsonschemautil.toToolJsonSchema)((0, _generatecreatemanyrecordinputschemautil.generateCreateManyRecordInputSchema)(objectMetadata, restrictedFields))
                    },
                    executionRef: {
                        kind: 'database_crud',
                        objectNameSingular: objectMetadata.nameSingular,
                        operation: 'upsert_many'
                    },
                    objectName: objectMetadata.nameSingular,
                    icon: flatObject.icon ?? undefined,
                    operation: 'upsert_many'
                });
            }
            if (canSoftDeleteRecords) {
                descriptors.push({
                    name: `delete_one_${snakeSingular}`,
                    ...(0, _getcrudtoollabelutil.getCrudToolLabels)('delete_one', flatObject.labelSingular, this.i18nService, context.locale),
                    description: `Delete a ${objectMetadata.labelSingular} record by marking it as deleted. The record is hidden from normal queries. This is reversible. Use this to remove records.`,
                    category: _ai.ToolCategory.DATABASE_CRUD,
                    ...includeSchemas && {
                        inputSchema: (0, _totooljsonschemautil.toToolJsonSchema)(_deletetoolzodschema.DeleteToolInputSchema)
                    },
                    executionRef: {
                        kind: 'database_crud',
                        objectNameSingular: objectMetadata.nameSingular,
                        operation: 'delete_one'
                    },
                    objectName: objectMetadata.nameSingular,
                    icon: flatObject.icon ?? undefined,
                    operation: 'delete_one'
                });
                descriptors.push({
                    name: `delete_many_${snakePlural}`,
                    ...(0, _getcrudtoollabelutil.getCrudToolLabels)('delete_many', flatObject.labelPlural, this.i18nService, context.locale),
                    description: `Soft-delete multiple ${objectMetadata.labelPlural} records matching a filter in a single operation. Deleted records are hidden from normal queries and the operation is reversible. WARNING: Use specific filters to avoid unintended mass deletions.`,
                    category: _ai.ToolCategory.DATABASE_CRUD,
                    ...includeSchemas && {
                        inputSchema: (0, _totooljsonschemautil.toToolJsonSchema)((0, _bulkdeletetoolzodschema.generateBulkDeleteToolInputSchema)(objectMetadata, restrictedFields))
                    },
                    executionRef: {
                        kind: 'database_crud',
                        objectNameSingular: objectMetadata.nameSingular,
                        operation: 'delete_many'
                    },
                    objectName: objectMetadata.nameSingular,
                    icon: flatObject.icon ?? undefined,
                    operation: 'delete_many'
                });
            }
        }
        return descriptors;
    }
    hasMatchingTool(toolNames, snakeSingular, snakePlural) {
        return toolNames.has(`find_many_${snakePlural}`) || toolNames.has(`find_one_${snakeSingular}`) || toolNames.has(`group_by_${snakePlural}`) || toolNames.has(`create_one_${snakeSingular}`) || toolNames.has(`create_many_${snakePlural}`) || toolNames.has(`update_one_${snakeSingular}`) || toolNames.has(`update_many_${snakePlural}`) || toolNames.has(`delete_one_${snakeSingular}`) || toolNames.has(`delete_many_${snakePlural}`) || toolNames.has(`upsert_many_${snakePlural}`);
    }
    constructor(workspaceCacheService, flatEntityMapsCacheService, i18nService){
        this.workspaceCacheService = workspaceCacheService;
        this.flatEntityMapsCacheService = flatEntityMapsCacheService;
        this.i18nService = i18nService;
        this.category = _ai.ToolCategory.DATABASE_CRUD;
    }
};
DatabaseToolProvider = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _workspacecacheservice.WorkspaceCacheService === "undefined" ? Object : _workspacecacheservice.WorkspaceCacheService,
        typeof _workspacemanyorallflatentitymapscacheservice.WorkspaceManyOrAllFlatEntityMapsCacheService === "undefined" ? Object : _workspacemanyorallflatentitymapscacheservice.WorkspaceManyOrAllFlatEntityMapsCacheService,
        typeof _i18nservice.I18nService === "undefined" ? Object : _i18nservice.I18nService
    ])
], DatabaseToolProvider);

//# sourceMappingURL=database-tool.provider.js.map