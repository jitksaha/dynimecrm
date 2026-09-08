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
    get LIST_SKILLS_TOOL_NAME () {
        return LIST_SKILLS_TOOL_NAME;
    },
    get createListSkillsTool () {
        return createListSkillsTool;
    },
    get listSkillsInputSchema () {
        return listSkillsInputSchema;
    }
});
const _zod = require("zod");
const LIST_SKILLS_TOOL_NAME = 'list_skills';
const listSkillsInputSchema = _zod.z.object({});
const createListSkillsTool = (skillService, workspaceId)=>({
        description: 'List all available skill names in the workspace. Use this to get a fresh list of skills when the initial instructions may be outdated.',
        inputSchema: listSkillsInputSchema,
        execute: async ()=>{
            const allSkills = await skillService.findAllFlatSkills(workspaceId);
            const skillNames = allSkills.map((skill)=>skill.name);
            return {
                skillNames,
                message: skillNames.length > 0 ? `Found ${skillNames.length} skill(s): ${skillNames.join(', ')}.` : 'No skills are currently available in this workspace.'
            };
        }
    });

//# sourceMappingURL=list-skills.tool.js.map