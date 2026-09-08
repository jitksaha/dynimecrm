"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "SystemPromptBuilderService", {
    enumerable: true,
    get: function() {
        return SystemPromptBuilderService;
    }
});
const _common = require("@nestjs/common");
const _guards = require("@sniptt/guards");
const _commonpreloadtoolsconst = require("../../../../core-modules/tool-provider/constants/common-preload-tools.const");
const _toolregistryservice = require("../../../../core-modules/tool-provider/services/tool-registry.service");
const _buildtoolcatalogsectionutil = require("../../../../core-modules/tool-provider/utils/build-tool-catalog-section.util");
const _agentactorcontextservice = require("../../ai-agent-execution/services/agent-actor-context.service");
const _chatsystempromptsconst = require("../constants/chat-system-prompts.const");
const _buildskillcatalogsectionutil = require("../utils/build-skill-catalog-section.util");
const _buildusercontextsectionutil = require("../utils/build-user-context-section.util");
const _buildworkspaceinstructionssectionutil = require("../utils/build-workspace-instructions-section.util");
const _skillservice = require("../../../skill/skill.service");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
// ~4 characters per token for mixed English/code content
const estimateTokenCount = (text)=>Math.ceil(text.length / 4);
let SystemPromptBuilderService = class SystemPromptBuilderService {
    async buildPreview(workspaceId, userWorkspaceId, workspaceInstructions) {
        const { roleId, userId, userContext } = await this.agentActorContextService.buildUserAndAgentActorContext(userWorkspaceId, workspaceId);
        const toolCatalog = await this.toolRegistry.buildToolIndex(workspaceId, roleId, {
            userId,
            userWorkspaceId
        });
        const skillCatalog = await this.skillService.findAllFlatSkills(workspaceId);
        const sections = [];
        const baseContent = _chatsystempromptsconst.CHAT_SYSTEM_PROMPTS.BASE;
        sections.push({
            title: 'Base Instructions',
            content: baseContent,
            estimatedTokenCount: estimateTokenCount(baseContent)
        });
        const responseFormatContent = _chatsystempromptsconst.CHAT_SYSTEM_PROMPTS.RESPONSE_FORMAT;
        sections.push({
            title: 'Response Format',
            content: responseFormatContent,
            estimatedTokenCount: estimateTokenCount(responseFormatContent)
        });
        const workspaceSection = (0, _buildworkspaceinstructionssectionutil.buildWorkspaceInstructionsSection)(workspaceInstructions ?? '');
        if ((0, _guards.isNonEmptyString)(workspaceSection)) {
            sections.push({
                title: 'Workspace Instructions',
                content: workspaceSection,
                estimatedTokenCount: estimateTokenCount(workspaceSection)
            });
        }
        if (userContext) {
            const userSection = (0, _buildusercontextsectionutil.buildUserContextSection)(userContext);
            sections.push({
                title: 'User Context',
                content: userSection,
                estimatedTokenCount: estimateTokenCount(userSection)
            });
        }
        const toolSection = (0, _buildtoolcatalogsectionutil.buildToolCatalogSection)(toolCatalog, _commonpreloadtoolsconst.COMMON_PRELOAD_TOOLS);
        sections.push({
            title: 'Tool Catalog',
            content: toolSection,
            estimatedTokenCount: estimateTokenCount(toolSection)
        });
        const skillSection = (0, _buildskillcatalogsectionutil.buildSkillCatalogSection)(skillCatalog);
        if (skillSection) {
            sections.push({
                title: 'Skill Catalog',
                content: skillSection,
                estimatedTokenCount: estimateTokenCount(skillSection)
            });
        }
        const totalTokens = sections.reduce((sum, section)=>sum + section.estimatedTokenCount, 0);
        return {
            sections,
            estimatedTokenCount: totalTokens
        };
    }
    constructor(toolRegistry, skillService, agentActorContextService){
        this.toolRegistry = toolRegistry;
        this.skillService = skillService;
        this.agentActorContextService = agentActorContextService;
    }
};
SystemPromptBuilderService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _toolregistryservice.ToolRegistryService === "undefined" ? Object : _toolregistryservice.ToolRegistryService,
        typeof _skillservice.SkillService === "undefined" ? Object : _skillservice.SkillService,
        typeof _agentactorcontextservice.AgentActorContextService === "undefined" ? Object : _agentactorcontextservice.AgentActorContextService
    ])
], SystemPromptBuilderService);

//# sourceMappingURL=system-prompt-builder.service.js.map