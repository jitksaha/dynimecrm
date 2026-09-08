"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _zod = require("zod");
const _ai = require("twenty-shared/ai");
const _toolsettodescriptorsutil = require("../tool-set-to-descriptors.util");
const createMockToolSet = (tools)=>{
    const toolSet = {};
    for (const [name, def] of Object.entries(tools)){
        toolSet[name] = {
            description: def.description,
            inputSchema: def.inputSchema ?? _zod.z.object({}),
            execute: async ()=>({})
        };
    }
    return toolSet;
};
describe('toolSetToDescriptors', ()=>{
    it('generates a humanized label when no labels map is provided', ()=>{
        const toolSet = createMockToolSet({
            create_complete_workflow: {
                description: 'Create a workflow'
            },
            get_object_metadata: {
                description: 'Get object metadata'
            }
        });
        const descriptors = (0, _toolsettodescriptorsutil.toolSetToDescriptors)(toolSet, _ai.ToolCategory.WORKFLOW, {
            includeSchemas: false
        });
        const labelByName = new Map(descriptors.map((d)=>[
                d.name,
                d.label
            ]));
        expect(labelByName.get('create_complete_workflow')).toBe('Create Complete Workflow');
        expect(labelByName.get('get_object_metadata')).toBe('Get Object Metadata');
    });
    it('includes label on every descriptor', ()=>{
        const toolSet = createMockToolSet({
            tool_a: {
                description: 'A'
            },
            tool_b: {
                description: 'B'
            },
            tool_c: {
                description: 'C'
            }
        });
        const descriptors = (0, _toolsettodescriptorsutil.toolSetToDescriptors)(toolSet, _ai.ToolCategory.ACTION, {
            includeSchemas: false
        });
        for (const descriptor of descriptors){
            expect(descriptor.label).toBeDefined();
            expect(descriptor.label.length).toBeGreaterThan(0);
        }
    });
});

//# sourceMappingURL=tool-set-to-descriptors.util.spec.js.map