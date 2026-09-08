"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "buildFullSystemPrompt", {
    enumerable: true,
    get: function() {
        return buildFullSystemPrompt;
    }
});
const _guards = require("@sniptt/guards");
const _utils = require("twenty-shared/utils");
const _buildtoolcatalogsectionutil = require("../../../../core-modules/tool-provider/utils/build-tool-catalog-section.util");
const _chatsystempromptsconst = require("../constants/chat-system-prompts.const");
const _workspacesetupsystempromptconstant = require("../constants/workspace-setup-system-prompt.constant");
const _buildskillcatalogsectionutil = require("./build-skill-catalog-section.util");
const _builduploadedfilessectionutil = require("./build-uploaded-files-section.util");
const _buildusercontextsectionutil = require("./build-user-context-section.util");
const _buildworkspaceinstructionssectionutil = require("./build-workspace-instructions-section.util");
const buildFullSystemPrompt = ({ toolCatalog, skillCatalog, preloadedTools, uploadedFilesContext, workspaceInstructions, userContext, isWorkspaceSetupThread })=>{
    const parts = isWorkspaceSetupThread ? [
        _workspacesetupsystempromptconstant.WORKSPACE_SETUP_SYSTEM_PROMPT,
        _chatsystempromptsconst.CHAT_SYSTEM_PROMPTS.RESPONSE_FORMAT
    ] : [
        _chatsystempromptsconst.CHAT_SYSTEM_PROMPTS.BASE,
        _chatsystempromptsconst.CHAT_SYSTEM_PROMPTS.BROWSING_CONTEXT_INSTRUCTION,
        _chatsystempromptsconst.CHAT_SYSTEM_PROMPTS.RESPONSE_FORMAT
    ];
    if (!isWorkspaceSetupThread) {
        const workspaceInstructionsSection = (0, _buildworkspaceinstructionssectionutil.buildWorkspaceInstructionsSection)(workspaceInstructions ?? '');
        if ((0, _guards.isNonEmptyString)(workspaceInstructionsSection)) {
            parts.push(workspaceInstructionsSection);
        }
    }
    if (userContext) {
        parts.push((0, _buildusercontextsectionutil.buildUserContextSection)(userContext));
    }
    parts.push((0, _buildtoolcatalogsectionutil.buildToolCatalogSection)(toolCatalog, preloadedTools));
    const skillSection = (0, _buildskillcatalogsectionutil.buildSkillCatalogSection)(skillCatalog);
    if (skillSection) {
        parts.push(skillSection);
    }
    if ((0, _utils.isDefined)(uploadedFilesContext) && (0, _utils.isNonEmptyArray)(uploadedFilesContext.uploadedFiles)) {
        parts.push((0, _builduploadedfilessectionutil.buildUploadedFilesSection)(uploadedFilesContext));
    }
    return parts.join('\n');
};

//# sourceMappingURL=build-full-system-prompt.util.js.map