"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _resolveworkflowemailtemplatestringutil = require("../resolve-workflow-email-template-string.util");
const CONTEXT = {
    trigger: {
        id: 'person-1',
        name: '<b>Ada</b>',
        tags: [
            'engineer',
            'writer'
        ]
    }
};
describe('resolveWorkflowEmailTemplateString', ()=>{
    it('should resolve scalar and object workflow values', ()=>{
        expect((0, _resolveworkflowemailtemplatestringutil.resolveWorkflowEmailTemplateString)('{{trigger.id}} {{trigger.tags}}', CONTEXT, {
            escapeValues: false
        })).toBe('person-1 ["engineer","writer"]');
    });
    it('should escape values inserted into raw HTML', ()=>{
        expect((0, _resolveworkflowemailtemplatestringutil.resolveWorkflowEmailTemplateString)('{{trigger.name}}', CONTEXT, {
            escapeValues: true
        })).toBe('&lt;b&gt;Ada&lt;/b&gt;');
    });
});

//# sourceMappingURL=resolve-workflow-email-template-string.util.spec.js.map