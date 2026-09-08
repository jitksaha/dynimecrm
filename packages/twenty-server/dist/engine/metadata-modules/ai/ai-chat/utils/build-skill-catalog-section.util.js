"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "buildSkillCatalogSection", {
    enumerable: true,
    get: function() {
        return buildSkillCatalogSection;
    }
});
const _tools = require("../../../../core-modules/tool-provider/tools");
const buildSkillCatalogSection = (skillCatalog)=>{
    if (skillCatalog.length === 0) {
        return '';
    }
    const skillsList = skillCatalog.map((skill)=>`- \`${skill.name}\`: ${skill.description ?? skill.label}`).join('\n');
    return `
## Available Skills

Skills provide detailed expertise for specialized tasks. Load a skill before attempting complex operations.
To load a skill, call \`${_tools.LOAD_SKILL_TOOL_NAME}\` with the skill name(s).

${skillsList}`;
};

//# sourceMappingURL=build-skill-catalog-section.util.js.map