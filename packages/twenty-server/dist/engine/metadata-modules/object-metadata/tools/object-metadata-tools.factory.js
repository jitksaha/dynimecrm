"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "ObjectMetadataToolsFactory", {
    enumerable: true,
    get: function() {
        return ObjectMetadataToolsFactory;
    }
});
const _common = require("@nestjs/common");
const _utils = require("twenty-shared/utils");
const _zod = require("zod");
const _metadatatoolexcludedfieldnamesconstant = require("../../../core-modules/tool-provider/constants/metadata-tool-excluded-field-names.constant");
const _compactmetadataoutpututil = require("../../../core-modules/tool-provider/utils/compact-metadata-output.util");
const _formatvalidationerrorsutil = require("../../../core-modules/tool-provider/utils/format-validation-errors.util");
const _normalizeiconnameutil = require("../../../core-modules/tool-provider/utils/normalize-icon-name.util");
const _workspacemanyorallflatentitymapscacheservice = require("../../flat-entity/services/workspace-many-or-all-flat-entity-maps-cache.service");
const _fromflatobjectmetadatatoobjectmetadatadtoutil = require("../../flat-object-metadata/utils/from-flat-object-metadata-to-object-metadata-dto.util");
const _objectmetadataservice = require("../object-metadata.service");
const _workspacemigrationbuilderexception = require("../../../workspace-manager/workspace-migration/exceptions/workspace-migration-builder-exception");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
const OBJECT_STRIP_WHEN_NULLISH = [
    'overrides',
    'color',
    'duplicateCriteria',
    'shortcut',
    'imageIdentifierFieldMetadataId',
    'description',
    'icon'
];
const GetObjectMetadataInputSchema = _zod.z.object({
    id: _zod.z.uuid().optional().describe('Object ID. Returns one object if set.'),
    objectName: _zod.z.string().optional().describe('Filter by object name, singular or plural (e.g. "opportunity" or "opportunities"). Lets you locate an object by name in one call without scanning the full list.'),
    includeFields: _zod.z.boolean().default(false).describe('When true, each returned object includes its fields as a compact array of {id, name, type, label}. Use this to fetch an object and all the field ids you need in a single call (e.g. before building a dashboard) instead of a separate get_field_metadata call.'),
    includeFullSystemObjects: _zod.z.boolean().default(false).describe("Keep false (default) for listing or locating objects — system objects then return as compact {id, nameSingular, namePlural}, which is enough to find an object and read its id. Only set true when you specifically need a system object's full configuration (e.g. building a relation to workspaceMember)."),
    limit: _zod.z.number().int().min(1).max(100).default(100).describe('Max objects to return.')
});
const CreateObjectMetadataInputSchema = _zod.z.object({
    nameSingular: _zod.z.string().describe('Singular name (e.g. "company")'),
    namePlural: _zod.z.string().describe('Plural name (e.g. "companies")'),
    labelSingular: _zod.z.string().describe('Singular label (e.g. "Company")'),
    labelPlural: _zod.z.string().describe('Plural label (e.g. "Companies")'),
    description: _zod.z.string().optional().describe('Description'),
    icon: _zod.z.string().optional().describe('Tabler icon name, PascalCase with "Icon" prefix (e.g. IconBuildingSkyscraper, IconPaw, IconTargetArrow). Always set one matching what the object represents.'),
    shortcut: _zod.z.string().optional().describe('Keyboard shortcut'),
    isRemote: _zod.z.boolean().optional().describe('Remote object'),
    isLabelSyncedWithName: _zod.z.boolean().optional().describe('Sync label with name')
});
const UpdateObjectMetadataInputSchema = _zod.z.object({
    id: _zod.z.uuid().describe('Object ID'),
    labelSingular: _zod.z.string().optional().describe('Singular label'),
    labelPlural: _zod.z.string().optional().describe('Plural label'),
    nameSingular: _zod.z.string().optional().describe('Singular name'),
    namePlural: _zod.z.string().optional().describe('Plural name'),
    description: _zod.z.string().optional().describe('Description'),
    icon: _zod.z.string().optional().describe('Tabler icon name (e.g. IconBuildingSkyscraper)'),
    shortcut: _zod.z.string().optional().describe('Keyboard shortcut'),
    isActive: _zod.z.boolean().optional().describe('Active state'),
    labelIdentifierFieldMetadataId: _zod.z.string().uuid().optional().describe('Label identifier field ID'),
    imageIdentifierFieldMetadataId: _zod.z.string().uuid().optional().describe('Image identifier field ID'),
    isLabelSyncedWithName: _zod.z.boolean().optional().describe('Sync label with name')
});
const DeleteObjectMetadataInputSchema = _zod.z.object({
    id: _zod.z.string().uuid().describe('Object ID')
});
const CreateManyObjectMetadataInputSchema = _zod.z.object({
    objects: _zod.z.array(CreateObjectMetadataInputSchema).min(1).max(20).describe('Objects to create (max 20).')
});
const UpdateManyObjectMetadataInputSchema = _zod.z.object({
    objects: _zod.z.array(UpdateObjectMetadataInputSchema).min(1).max(20).describe('Objects to update (max 20).')
});
let ObjectMetadataToolsFactory = class ObjectMetadataToolsFactory {
    async buildFieldsByObjectId(workspaceId) {
        const { flatFieldMetadataMaps } = await this.flatEntityMapsCacheService.getOrRecomputeManyOrAllFlatEntityMaps({
            workspaceId,
            flatMapsKeys: [
                'flatFieldMetadataMaps'
            ]
        });
        const fieldsByObjectId = new Map();
        for (const fieldMetadata of Object.values(flatFieldMetadataMaps.byUniversalIdentifier)){
            if (!(0, _utils.isDefined)(fieldMetadata) || _metadatatoolexcludedfieldnamesconstant.METADATA_TOOL_EXCLUDED_FIELD_NAMES.has(fieldMetadata.name)) {
                continue;
            }
            const existing = fieldsByObjectId.get(fieldMetadata.objectMetadataId) ?? [];
            existing.push({
                id: fieldMetadata.id,
                name: fieldMetadata.name,
                type: fieldMetadata.type,
                label: fieldMetadata.label ?? fieldMetadata.name
            });
            fieldsByObjectId.set(fieldMetadata.objectMetadataId, existing);
        }
        return fieldsByObjectId;
    }
    generateTools(workspaceId) {
        return {
            get_object_metadata: {
                description: "List object metadata as an array. Filter to a single object by id or objectName (singular or plural). Set includeFields to also return each object's fields ({id, name, type, label}) — enough to build a dashboard or view without a separate get_field_metadata call. System objects are otherwise returned as compact {id, nameSingular, namePlural}. Keep includeFullSystemObjects at its default (false); only set it true when you specifically need a system object's full configuration.",
                inputSchema: GetObjectMetadataInputSchema,
                execute: async (parameters)=>{
                    const flatObjectMetadatas = await this.objectMetadataService.findManyWithinWorkspace(workspaceId, {
                        ...parameters.id ? {
                            where: {
                                id: parameters.id
                            }
                        } : parameters.objectName ? {
                            where: [
                                {
                                    nameSingular: parameters.objectName
                                },
                                {
                                    namePlural: parameters.objectName
                                }
                            ]
                        } : {},
                        take: parameters.limit ?? 100
                    });
                    const fieldsByObjectId = parameters.includeFields ? await this.buildFieldsByObjectId(workspaceId) : undefined;
                    return flatObjectMetadatas.map((flatObjectMetadata)=>{
                        const dto = (0, _fromflatobjectmetadatatoobjectmetadatadtoutil.fromFlatObjectMetadataToObjectMetadataDto)(flatObjectMetadata);
                        const fields = fieldsByObjectId?.get(dto.id) ?? [];
                        if (dto.isSystem && !parameters.includeFullSystemObjects) {
                            return {
                                id: dto.id,
                                nameSingular: dto.nameSingular,
                                namePlural: dto.namePlural,
                                ...parameters.includeFields ? {
                                    fields
                                } : {}
                            };
                        }
                        return (0, _compactmetadataoutpututil.compactMetadataOutput)({
                            ...dto,
                            ...parameters.includeFields ? {
                                fields
                            } : {}
                        }, {
                            stripWhenNullish: OBJECT_STRIP_WHEN_NULLISH
                        });
                    });
                }
            },
            create_object_metadata: {
                description: 'Create a new object in the workspace data model.',
                inputSchema: CreateObjectMetadataInputSchema,
                execute: async (parameters)=>{
                    try {
                        const { icon, ...createObjectInput } = parameters;
                        const flatObjectMetadata = await this.objectMetadataService.createOneObject({
                            createObjectInput: {
                                ...createObjectInput,
                                icon: (0, _normalizeiconnameutil.normalizeIconName)(icon)
                            },
                            workspaceId
                        });
                        return {
                            id: flatObjectMetadata.id,
                            nameSingular: flatObjectMetadata.nameSingular,
                            labelSingular: flatObjectMetadata.labelSingular
                        };
                    } catch (error) {
                        if (error instanceof _workspacemigrationbuilderexception.WorkspaceMigrationBuilderException) {
                            throw new Error((0, _formatvalidationerrorsutil.formatValidationErrors)(error));
                        }
                        throw error;
                    }
                }
            },
            update_object_metadata: {
                description: 'Update an object. Provide object ID and properties to change.',
                inputSchema: UpdateObjectMetadataInputSchema,
                execute: async (parameters)=>{
                    try {
                        const { id, icon, ...update } = parameters;
                        const normalizedIcon = (0, _normalizeiconnameutil.normalizeIconName)(icon);
                        const flatObjectMetadata = await this.objectMetadataService.updateOneObject({
                            updateObjectInput: {
                                id,
                                update: {
                                    ...update,
                                    ...(0, _utils.isDefined)(normalizedIcon) ? {
                                        icon: normalizedIcon
                                    } : {}
                                }
                            },
                            workspaceId
                        });
                        return {
                            id: flatObjectMetadata.id,
                            nameSingular: flatObjectMetadata.nameSingular,
                            labelSingular: flatObjectMetadata.labelSingular
                        };
                    } catch (error) {
                        if (error instanceof _workspacemigrationbuilderexception.WorkspaceMigrationBuilderException) {
                            throw new Error((0, _formatvalidationerrorsutil.formatValidationErrors)(error));
                        }
                        throw error;
                    }
                }
            },
            delete_object_metadata: {
                description: 'Delete an object by ID. Also deletes associated fields.',
                inputSchema: DeleteObjectMetadataInputSchema,
                execute: async (parameters)=>{
                    try {
                        const flatObjectMetadata = await this.objectMetadataService.deleteOneObject({
                            deleteObjectInput: {
                                id: parameters.id
                            },
                            workspaceId
                        });
                        return {
                            id: flatObjectMetadata.id,
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
            create_many_object_metadata: {
                description: 'Create multiple objects at once. Batch version of create_object_metadata.',
                inputSchema: CreateManyObjectMetadataInputSchema,
                execute: async (parameters)=>{
                    try {
                        await Promise.all(parameters.objects.map(async ({ icon, ...createObjectInput })=>{
                            await this.objectMetadataService.createOneObject({
                                createObjectInput: {
                                    ...createObjectInput,
                                    icon: (0, _normalizeiconnameutil.normalizeIconName)(icon)
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
            update_many_object_metadata: {
                description: 'Update multiple objects at once. Batch version of update_object_metadata.',
                inputSchema: UpdateManyObjectMetadataInputSchema,
                execute: async (parameters)=>{
                    try {
                        await Promise.all(parameters.objects.map(async ({ id, icon, ...update })=>{
                            const normalizedIcon = (0, _normalizeiconnameutil.normalizeIconName)(icon);
                            await this.objectMetadataService.updateOneObject({
                                updateObjectInput: {
                                    id,
                                    update: {
                                        ...update,
                                        ...(0, _utils.isDefined)(normalizedIcon) ? {
                                            icon: normalizedIcon
                                        } : {}
                                    }
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
            }
        };
    }
    constructor(objectMetadataService, flatEntityMapsCacheService){
        this.objectMetadataService = objectMetadataService;
        this.flatEntityMapsCacheService = flatEntityMapsCacheService;
    }
};
ObjectMetadataToolsFactory = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _objectmetadataservice.ObjectMetadataService === "undefined" ? Object : _objectmetadataservice.ObjectMetadataService,
        typeof _workspacemanyorallflatentitymapscacheservice.WorkspaceManyOrAllFlatEntityMapsCacheService === "undefined" ? Object : _workspacemanyorallflatentitymapscacheservice.WorkspaceManyOrAllFlatEntityMapsCacheService
    ])
], ObjectMetadataToolsFactory);

//# sourceMappingURL=object-metadata-tools.factory.js.map