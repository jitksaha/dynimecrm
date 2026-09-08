"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "buildWorkspaceInstructionsSection", {
    enumerable: true,
    get: function() {
        return buildWorkspaceInstructionsSection;
    }
});
const _guards = require("@sniptt/guards");
const _utils = require("twenty-shared/utils");
const buildWorkspaceInstructionsSection = (instructions)=>{
    const projectedInstructions = (0, _utils.tipTapDocumentToMarkdown)(instructions).trim();
    if (!(0, _guards.isNonEmptyString)(projectedInstructions)) {
        return '';
    }
    return `
## Workspace Instructions

The following are custom instructions provided by the workspace administrator:

${projectedInstructions}`;
};

//# sourceMappingURL=build-workspace-instructions-section.util.js.map