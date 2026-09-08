"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "FieldMetadataToolsFactory", {
    enumerable: true,
    get: function() {
        return FieldMetadataToolsFactory;
    }
});
const _common = require("@nestjs/common");
const _constants = require("twenty-shared/constants");
const _types = require("twenty-shared/types");
const _zod = require("zod");
const _metadatatoolexcludedfieldnamesconstant = require("../../../core-modules/tool-provider/constants/metadata-tool-excluded-field-names.constant");
const _compactmetadataoutpututil = require("../../../core-modules/tool-provider/utils/compact-metadata-output.util");
const _formatvalidationerrorsutil = require("../../../core-modules/tool-provider/utils/format-validation-errors.util");
const _normalizeiconnameutil = require("../../../core-modules/tool-provider/utils/normalize-icon-name.util");
const _fieldmetadataservice = require("../services/field-metadata.service");
const _workspacemanyorallflatentitymapscacheservice = require("../../flat-entity/services/workspace-many-or-all-flat-entity-maps-cache.service");
const _getobjectmetadataidbynameutil = require("../../flat-object-metadata/utils/get-object-metadata-id-by-name.util");
const _workspacemigrationbuilderexception = require("../../../workspace-manager/workspace-migration/exceptions/workspace-migration-builder-exception");
const _utils = require("twenty-shared/utils");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
const FIELD_STRIP_WHEN_NULLISH = [
    'options',
    'settings',
    'defaultValue',
    'description',
    'icon',
    'deletedAt'
];
const FIELD_STRIP_WHEN_FALSE = [
    'isLabelSyncedWithName'
];
// isUIEditable defaults to true, so only the non-default false value is informative
const FIELD_STRIP_WHEN_TRUE = [
    'isUIEditable'
];
const RELATION_TYPE_DESCRIPTION = 'Relation direction from the perspective of the object the field is created on. ' + "MANY_TO_ONE: the field points to a single target record; this object owns the foreign key and gets a writable '<fieldName>Id' on its create/update inputs. Use it for 'belongs to one' fields. " + "ONE_TO_MANY: the field is a read-only collection of target records; records are linked by writing the inverse '<fieldName>Id' on the target object.";
const RelationCreationPayloadSchema = _zod.z.object({
    type: _zod.z.nativeEnum(_types.RelationType).describe(RELATION_TYPE_DESCRIPTION),
    targetObjectMetadataId: _zod.z.string().uuid().describe('Target object ID'),
    targetFieldLabel: _zod.z.string().describe('Display label of the inverse relation field created on the target object'),
    targetFieldIcon: _zod.z.string().optional().describe('Tabler icon name for the inverse field (e.g. IconBuildingSkyscraper). Falls back to the relation default.')
});
const GetFieldMetadataInputSchema = _zod.z.object({
    id: _zod.z.uuid().optional().describe('Field ID. Returns one field if set.'),
    objectMetadataId: _zod.z.uuid().optional().describe('Filter by object ID.'),
    objectName: _zod.z.string().optional().describe('Filter by object name, singular or plural (e.g. "opportunity" or "opportunities"). Convenient alternative to objectMetadataId so you do not need to resolve the object id first.'),
    includeFullSystemFields: _zod.z.boolean().default(false).describe("Keep false (default) for listing or inspecting fields — system fields then return as compact {id, name, type}, which is enough to know which fields exist and their types. Only set true when you specifically need a system field's full configuration (settings, defaultValue, relation targets)."),
    limit: _zod.z.number().int().min(1).max(100).default(100).describe('Max fields to return.')
});
const CreateFieldMetadataInputSchema = _zod.z.object({
    objectMetadataId: _zod.z.string().uuid().describe('Target object ID'),
    type: _zod.z.nativeEnum(_types.FieldMetadataType).describe('Field type'),
    name: _zod.z.string().describe('Field name (camelCase)'),
    label: _zod.z.string().describe('Display label'),
    description: _zod.z.string().optional().describe('Description'),
    icon: _zod.z.string().optional().describe('Tabler icon name, PascalCase with "Icon" prefix (e.g. IconCurrencyDollar, IconCalendarTime, IconPaw). Set one matching the field meaning; falls back to a type-based default.'),
    isNullable: _zod.z.boolean().optional().describe('Nullable'),
    isUnique: _zod.z.boolean().optional().describe('Unique constraint'),
    defaultValue: _zod.z.unknown().optional().describe('Default value'),
    options: _zod.z.unknown().optional().describe('SELECT/MULTI_SELECT options'),
    settings: _zod.z.unknown().optional().describe('Field settings'),
    isLabelSyncedWithName: _zod.z.boolean().optional().describe('Sync label with name'),
    isRemoteCreation: _zod.z.boolean().optional().describe('Remote field creation'),
    relationCreationPayload: RelationCreationPayloadSchema.optional().describe('Required when type is RELATION. Defines the relation direction and the inverse field created on the target object.')
});
const UpdateFieldMetadataInputSchema = _zod.z.object({
    id: _zod.z.string().uuid().describe('Field ID'),
    name: _zod.z.string().optional().describe('Field name'),
    label: _zod.z.string().optional().describe('Display label'),
    description: _zod.z.string().optional().describe('Description'),
    icon: _zod.z.string().optional().describe('Tabler icon name (e.g. IconCurrencyDollar)'),
    isActive: _zod.z.boolean().optional().describe('Active state'),
    isNullable: _zod.z.boolean().optional().describe('Nullable'),
    isUnique: _zod.z.boolean().optional().describe('Unique constraint'),
    defaultValue: _zod.z.unknown().optional().describe('Default value'),
    options: _zod.z.unknown().optional().describe('SELECT/MULTI_SELECT options'),
    settings: _zod.z.unknown().optional().describe('Field settings'),
    isLabelSyncedWithName: _zod.z.boolean().optional().describe('Sync label with name')
});
const DeleteFieldMetadataInputSchema = _zod.z.object({
    id: _zod.z.string().uuid().describe('Field ID')
});
const CreateManyFieldMetadataInputSchema = _zod.z.object({
    fields: _zod.z.array(CreateFieldMetadataInputSchema).min(1).max(20).describe('Fields to create (max 20).')
});
const UpdateManyFieldMetadataInputSchema = _zod.z.object({
    fields: _zod.z.array(UpdateFieldMetadataInputSchema).min(1).max(20).describe('Fields to update (max 20).')
});
const CreateManyRelationFieldsInputSchema = _zod.z.object({
    relations: _zod.z.array(_zod.z.object({
        objectMetadataId: _zod.z.string().uuid().describe('Source object ID'),
        name: _zod.z.string().describe('Field name (camelCase)'),
        label: _zod.z.string().describe('Display label'),
        description: _zod.z.string().optional().describe('Description'),
        icon: _zod.z.string().optional().describe('Tabler icon name for the relation field (e.g. IconUsers)'),
        type: _zod.z.nativeEnum(_types.RelationType).describe(RELATION_TYPE_DESCRIPTION),
        targetObjectMetadataId: _zod.z.string().uuid().describe('Target object ID'),
        targetFieldLabel: _zod.z.string().describe('Inverse field label'),
        targetFieldIcon: _zod.z.string().describe('Inverse field Tabler icon name (e.g. IconBuildingSkyscraper)')
    })).min(1).max(20).describe('Relations to create (max 20).')
});
const normalizeRelationCreationPayloadIcon = (relationCreationPayload)=>{
    if (!(0, _utils.isDefined)(relationCreationPayload) || typeof relationCreationPayload !== 'object' || Array.isArray(relationCreationPayload)) {
        return relationCreationPayload;
    }
    const { targetFieldIcon } = relationCreationPayload;
    return {
        ...relationCreationPayload,
        targetFieldIcon: (0, _normalizeiconnameutil.normalizeIconName)(targetFieldIcon) ?? _constants.FIELD_TYPE_DEFAULT_ICONS[_types.FieldMetadataType.RELATION]
    };
};
let FieldMetadataToolsFactory = class FieldMetadataToolsFactory {
    async getObjectMetadataIdOrThrow(workspaceId, objectName) {
        const { flatObjectMetadataMaps } = await this.flatEntityMapsCacheService.getOrRecomputeManyOrAllFlatEntityMaps({
            workspaceId,
            flatMapsKeys: [
                'flatObjectMetadataMaps'
            ]
        });
        const objectMetadataId = (0, _getobjectmetadataidbynameutil.getObjectMetadataIdByName)({
            flatObjectMetadataMaps,
            objectName
        });
        if (!(0, _utils.isDefined)(objectMetadataId)) {
            throw new Error(`Object "${objectName}" not found. Use get_object_metadata to list available objects.`);
        }
        return objectMetadataId;
    }
    generateTools(workspaceId) {
        return {
            get_field_metadata: {
                description: "Returns an array of fields. System fields are returned as compact {id, name, type} — enough to know which fields exist and their types. Keep includeFullSystemFields at its default (false); only set it true when you specifically need a system field's full configuration (settings, defaultValue, relation targets). Internal fields (searchVector, position, updatedBy) are excluded.",
                inputSchema: GetFieldMetadataInputSchema,
                execute: async (parameters)=>{
                    const objectMetadataId = parameters.objectMetadataId ?? (parameters.objectName ? await this.getObjectMetadataIdOrThrow(workspaceId, parameters.objectName) : undefined);
                    const rawResults = await this.fieldMetadataService.findManyWithinWorkspace({
                        workspaceId,
                        fieldMetadataId: parameters.id,
                        objectMetadataId,
                        limit: parameters.limit ?? 100
                    });
                    const compactedFields = rawResults.filter((field)=>!_metadatatoolexcludedfieldnamesconstant.METADATA_TOOL_EXCLUDED_FIELD_NAMES.has(field.name)).map((field)=>{
                        if (field.isSystem && !parameters.includeFullSystemFields) {
                            return {
                                id: field.id,
                                name: field.name,
                                type: field.type
                            };
                        }
                        return (0, _compactmetadataoutpututil.compactMetadataOutput)({
                            ...field
                        }, {
                            stripWhenNullish: FIELD_STRIP_WHEN_NULLISH,
                            stripWhenFalse: FIELD_STRIP_WHEN_FALSE,
                            stripWhenTrue: FIELD_STRIP_WHEN_TRUE
                        });
                    });
                    return compactedFields;
                }
            },
            create_field_metadata: {
                description: 'Create a new field on an object.',
                inputSchema: CreateFieldMetadataInputSchema,
                execute: async (parameters)=>{
                    try {
                        const { icon, relationCreationPayload, ...createFieldInput } = parameters;
                        const flatFieldMetadata = await this.fieldMetadataService.createOneField({
                            createFieldInput: {
                                ...createFieldInput,
                                icon: (0, _normalizeiconnameutil.normalizeIconName)(icon) ?? _constants.FIELD_TYPE_DEFAULT_ICONS[parameters.type],
                                relationCreationPayload: normalizeRelationCreationPayloadIcon(relationCreationPayload)
                            },
                            workspaceId
                        });
                        return {
                            id: flatFieldMetadata.id,
                            name: flatFieldMetadata.name,
                            label: flatFieldMetadata.label,
                            type: flatFieldMetadata.type,
                            objectMetadataId: flatFieldMetadata.objectMetadataId
                        };
                    } catch (error) {
                        if (error instanceof _workspacemigrationbuilderexception.WorkspaceMigrationBuilderException) {
                            throw new Error((0, _formatvalidationerrorsutil.formatValidationErrors)(error));
                        }
                        throw error;
                    }
                }
            },
            update_field_metadata: {
                description: 'Update a field. Provide field ID and properties to change.',
                inputSchema: UpdateFieldMetadataInputSchema,
                execute: async (parameters)=>{
                    try {
                        const { id, icon, ...update } = parameters;
                        const normalizedIcon = (0, _normalizeiconnameutil.normalizeIconName)(icon);
                        const flatFieldMetadata = await this.fieldMetadataService.updateOneField({
                            updateFieldInput: {
                                id,
                                ...update,
                                ...(0, _utils.isDefined)(normalizedIcon) ? {
                                    icon: normalizedIcon
                                } : {}
                            },
                            workspaceId
                        });
                        return {
                            id: flatFieldMetadata.id,
                            name: flatFieldMetadata.name,
                            label: flatFieldMetadata.label,
                            type: flatFieldMetadata.type
                        };
                    } catch (error) {
                        if (error instanceof _workspacemigrationbuilderexception.WorkspaceMigrationBuilderException) {
                            throw new Error((0, _formatvalidationerrorsutil.formatValidationErrors)(error));
                        }
                        throw error;
                    }
                }
            },
            delete_field_metadata: {
                description: 'Delete a field by ID.',
                inputSchema: DeleteFieldMetadataInputSchema,
                execute: async (parameters)=>{
                    try {
                        const flatFieldMetadata = await this.fieldMetadataService.deleteOneField({
                            deleteOneFieldInput: {
                                id: parameters.id
                            },
                            workspaceId
                        });
                        return {
                            id: flatFieldMetadata.id,
                            success: true
                        };
                    } catch (error) {
                        if (error instanceof _workspacemigrationbuilderexception.WorkspaceMigrationBuilderException) {
                            throw new Error((0, _formatvalidationerrorsutil.formatValidationErrors)(error));
                        }
                        throw error;
                    }
                }
            },
            create_many_field_metadata: {
                description: 'Create multiple field metadata at once on one or more objects. More efficient than calling create_field_metadata multiple times. Each item follows the same schema as create_field_metadata.',
                inputSchema: CreateManyFieldMetadataInputSchema,
                execute: async (parameters)=>{
                    try {
                        await this.fieldMetadataService.createManyFields({
                            createFieldInputs: parameters.fields.map(({ icon, relationCreationPayload, ...createFieldInput })=>({
                                    ...createFieldInput,
                                    icon: (0, _normalizeiconnameutil.normalizeIconName)(icon) ?? _constants.FIELD_TYPE_DEFAULT_ICONS[createFieldInput.type],
                                    relationCreationPayload: normalizeRelationCreationPayloadIcon(relationCreationPayload)
                                })),
                            workspaceId
                        });
                        return true;
                    } catch (error) {
                        if (error instanceof _workspacemigrationbuilderexception.WorkspaceMigrationBuilderException) {
                            throw new Error((0, _formatvalidationerrorsutil.formatValidationErrors)(error));
                        }
                        throw error;
                    }
                }
            },
            update_many_field_metadata: {
                description: 'Update multiple field metadata at once. More efficient than calling update_field_metadata multiple times. Each item must include the field ID and the properties to update.',
                inputSchema: UpdateManyFieldMetadataInputSchema,
                execute: async (parameters)=>{
                    try {
                        await Promise.all(parameters.fields.map(async ({ id, icon, ...update })=>{
                            const normalizedIcon = (0, _normalizeiconnameutil.normalizeIconName)(icon);
                            await this.fieldMetadataService.updateOneField({
                                updateFieldInput: {
                                    id,
                                    ...update,
                                    ...(0, _utils.isDefined)(normalizedIcon) ? {
                                        icon: normalizedIcon
                                    } : {}
                                },
                                workspaceId
                            });
                        }));
                        return true;
                    } catch (error) {
                        if (error instanceof _workspacemigrationbuilderexception.WorkspaceMigrationBuilderException) {
                            throw new Error((0, _formatvalidationerrorsutil.formatValidationErrors)(error));
                        }
                        throw error;
                    }
                }
            },
            create_many_relation_fields: {
                description: 'Create multiple relation fields between objects at once.',
                inputSchema: CreateManyRelationFieldsInputSchema,
                execute: async (parameters)=>{
                    try {
                        await this.fieldMetadataService.createManyFields({
                            createFieldInputs: parameters.relations.map((relation)=>({
                                    objectMetadataId: relation.objectMetadataId,
                                    type: _types.FieldMetadataType.RELATION,
                                    name: relation.name,
                                    label: relation.label,
                                    description: relation.description,
                                    icon: (0, _normalizeiconnameutil.normalizeIconName)(relation.icon) ?? _constants.FIELD_TYPE_DEFAULT_ICONS[_types.FieldMetadataType.RELATION],
                                    relationCreationPayload: {
                                        type: relation.type,
                                        targetObjectMetadataId: relation.targetObjectMetadataId,
                                        targetFieldLabel: relation.targetFieldLabel,
                                        targetFieldIcon: (0, _normalizeiconnameutil.normalizeIconName)(relation.targetFieldIcon) ?? _constants.FIELD_TYPE_DEFAULT_ICONS[_types.FieldMetadataType.RELATION]
                                    }
                                })),
                            workspaceId
                        });
                        return true;
                    } catch (error) {
                        if (error instanceof _workspacemigrationbuilderexception.WorkspaceMigrationBuilderException) {
                            throw new Error((0, _formatvalidationerrorsutil.formatValidationErrors)(error));
                        }
                        throw error;
                    }
                }
            }
        };
    }
    constructor(fieldMetadataService, flatEntityMapsCacheService){
        this.fieldMetadataService = fieldMetadataService;
        this.flatEntityMapsCacheService = flatEntityMapsCacheService;
    }
};
FieldMetadataToolsFactory = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _fieldmetadataservice.FieldMetadataService === "undefined" ? Object : _fieldmetadataservice.FieldMetadataService,
        typeof _workspacemanyorallflatentitymapscacheservice.WorkspaceManyOrAllFlatEntityMapsCacheService === "undefined" ? Object : _workspacemanyorallflatentitymapscacheservice.WorkspaceManyOrAllFlatEntityMapsCacheService
    ])
], FieldMetadataToolsFactory);

//# sourceMappingURL=field-metadata-tools.factory.js.map