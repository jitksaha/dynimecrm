"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
}
_export(exports, {
    get LIST_OBJECT_METADATA_NAMES_TOOL_NAME () {
        return LIST_OBJECT_METADATA_NAMES_TOOL_NAME;
    },
    get createListObjectMetadataNamesTool () {
        return createListObjectMetadataNamesTool;
    },
    get listObjectMetadataNamesInputSchema () {
        return listObjectMetadataNamesInputSchema;
    }
});
const _zod = require("zod");
const _utils = require("twenty-shared/utils");
const _getdatabasecrudtoolflatobjectsutil = require("../../../metadata-modules/ai/ai-agent/utils/get-database-crud-tool-flat-objects.util");
const LIST_OBJECT_METADATA_NAMES_TOOL_NAME = 'list_object_metadata_names';
const listObjectMetadataNamesInputSchema = _zod.z.object({});
const createListObjectMetadataNamesTool = (flatEntityMapsCacheService, workspaceId)=>({
        description: 'List all available object metadata names in the workspace. Use this to get a fresh list of objects when the initial instructions may be outdated.',
        inputSchema: listObjectMetadataNamesInputSchema,
        execute: async ()=>{
            const { flatObjectMetadataMaps } = await flatEntityMapsCacheService.getOrRecomputeManyOrAllFlatEntityMaps({
                workspaceId,
                flatMapsKeys: [
                    'flatObjectMetadataMaps'
                ]
            });
            const objectNames = (0, _getdatabasecrudtoolflatobjectsutil.getDatabaseCrudToolFlatObjects)(flatObjectMetadataMaps.byUniversalIdentifier).map((obj)=>(0, _utils.camelToSnakeCase)(obj.namePlural)).sort();
            return {
                objectNames,
                message: `Found ${objectNames.length} object(s): ${objectNames.join(', ')}.`
            };
        }
    });

//# sourceMappingURL=list-object-metadata-names.tool.js.map