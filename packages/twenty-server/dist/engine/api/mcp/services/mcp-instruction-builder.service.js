"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "McpInstructionBuilderService", {
    enumerable: true,
    get: function() {
        return McpInstructionBuilderService;
    }
});
const _common = require("@nestjs/common");
const _utils = require("twenty-shared/utils");
const _buildmcpserverinstructionsutil = require("../utils/build-mcp-server-instructions.util");
const _getdatabasecrudtoolflatobjectsutil = require("../../../metadata-modules/ai/ai-agent/utils/get-database-crud-tool-flat-objects.util");
const _workspacemanyorallflatentitymapscacheservice = require("../../../metadata-modules/flat-entity/services/workspace-many-or-all-flat-entity-maps-cache.service");
const _skillservice = require("../../../metadata-modules/skill/skill.service");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let McpInstructionBuilderService = class McpInstructionBuilderService {
    async buildInstructions(workspaceId) {
        const [{ flatObjectMetadataMaps }, allSkills] = await Promise.all([
            this.flatEntityMapsCacheService.getOrRecomputeManyOrAllFlatEntityMaps({
                workspaceId,
                flatMapsKeys: [
                    'flatObjectMetadataMaps'
                ]
            }),
            this.skillService.findAllFlatSkills(workspaceId)
        ]);
        const objectNames = (0, _getdatabasecrudtoolflatobjectsutil.getDatabaseCrudToolFlatObjects)(flatObjectMetadataMaps.byUniversalIdentifier).map((obj)=>(0, _utils.camelToSnakeCase)(obj.namePlural)).sort().join(', ');
        const skillNames = allSkills.length > 0 ? allSkills.map((skill)=>skill.name).join(', ') : undefined;
        return (0, _buildmcpserverinstructionsutil.buildMcpServerInstructions)(objectNames, skillNames);
    }
    constructor(flatEntityMapsCacheService, skillService){
        this.flatEntityMapsCacheService = flatEntityMapsCacheService;
        this.skillService = skillService;
    }
};
McpInstructionBuilderService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _workspacemanyorallflatentitymapscacheservice.WorkspaceManyOrAllFlatEntityMapsCacheService === "undefined" ? Object : _workspacemanyorallflatentitymapscacheservice.WorkspaceManyOrAllFlatEntityMapsCacheService,
        typeof _skillservice.SkillService === "undefined" ? Object : _skillservice.SkillService
    ])
], McpInstructionBuilderService);

//# sourceMappingURL=mcp-instruction-builder.service.js.map