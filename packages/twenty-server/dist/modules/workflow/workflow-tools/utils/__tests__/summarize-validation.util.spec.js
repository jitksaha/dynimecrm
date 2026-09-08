"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _summarizevalidationutil = require("../summarize-validation.util");
describe('summarizeValidation', ()=>{
    it('should return a minimal summary for a valid workflow', ()=>{
        const result = {
            valid: true,
            errors: [],
            warnings: []
        };
        expect((0, _summarizevalidationutil.summarizeValidation)(result)).toEqual({
            valid: true,
            errorCount: 0,
            warningCount: 0,
            errors: []
        });
    });
    it('should keep error essentials and drop availablePaths and hint', ()=>{
        const result = {
            valid: false,
            errors: [
                {
                    severity: 'error',
                    code: 'DANGLING_REFERENCE',
                    message: 'Unknown variable {{step-1.foo}}',
                    stepId: 'step-2',
                    path: 'settings.input.body',
                    hint: 'some long hint',
                    suggestions: [
                        '{{step-1.bar}}'
                    ],
                    availablePaths: [
                        '{{step-1.bar}}',
                        '{{step-1.baz}}',
                        '{{trigger.x}}'
                    ]
                }
            ],
            warnings: []
        };
        const summary = (0, _summarizevalidationutil.summarizeValidation)(result);
        expect(summary.valid).toBe(false);
        expect(summary.errorCount).toBe(1);
        expect(summary.errors[0]).toEqual({
            code: 'DANGLING_REFERENCE',
            message: 'Unknown variable {{step-1.foo}}',
            stepId: 'step-2',
            path: 'settings.input.body',
            suggestions: [
                '{{step-1.bar}}'
            ]
        });
        expect(summary.errors[0]).not.toHaveProperty('availablePaths');
        expect(summary.errors[0]).not.toHaveProperty('hint');
    });
    it('should collapse warnings to a count', ()=>{
        const result = {
            valid: true,
            errors: [],
            warnings: [
                {
                    severity: 'warning',
                    code: 'UNREACHABLE_STEP',
                    message: 'Step is unreachable'
                },
                {
                    severity: 'warning',
                    code: 'TRIGGER_HAS_NO_NEXT_STEP',
                    message: 'Trigger has no next step'
                }
            ]
        };
        const summary = (0, _summarizevalidationutil.summarizeValidation)(result);
        expect(summary.warningCount).toBe(2);
        expect(summary).not.toHaveProperty('warnings');
        expect(summary.hint).toContain('validate_workflow');
    });
    it('should omit empty suggestions', ()=>{
        const result = {
            valid: false,
            errors: [
                {
                    severity: 'error',
                    code: 'NO_STEPS',
                    message: 'The workflow has no steps.',
                    suggestions: []
                }
            ],
            warnings: []
        };
        expect((0, _summarizevalidationutil.summarizeValidation)(result).errors[0]).not.toHaveProperty('suggestions');
    });
});

//# sourceMappingURL=summarize-validation.util.spec.js.map