"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _loadskilltool = require("../load-skill.tool");
describe('createLoadSkillTool', ()=>{
    it('projects canonical skill documents to Markdown', async ()=>{
        const tool = (0, _loadskilltool.createLoadSkillTool)(async ()=>[
                {
                    name: 'sales-playbook',
                    label: 'Sales playbook',
                    content: JSON.stringify({
                        type: 'doc',
                        attrs: {
                            schemaVersion: 1
                        },
                        content: [
                            {
                                type: 'paragraph',
                                content: [
                                    {
                                        type: 'text',
                                        text: 'Qualify the account.'
                                    }
                                ]
                            }
                        ]
                    })
                }
            ], async ()=>[]);
        await expect(tool.execute({
            skillNames: [
                'sales-playbook'
            ]
        })).resolves.toMatchObject({
            skills: [
                {
                    name: 'sales-playbook',
                    label: 'Sales playbook',
                    content: 'Qualify the account.'
                }
            ]
        });
    });
});

//# sourceMappingURL=load-skill.tool.spec.js.map