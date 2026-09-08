"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _hasworkflowoutputschemautil = require("../has-workflow-output-schema.util");
describe('hasWorkflowOutputSchema', ()=>{
    it('should return false for null or undefined settings', ()=>{
        expect((0, _hasworkflowoutputschemautil.hasWorkflowOutputSchema)(null)).toBe(false);
        expect((0, _hasworkflowoutputschemautil.hasWorkflowOutputSchema)(undefined)).toBe(false);
    });
    it('should return false when neither schema is present', ()=>{
        expect((0, _hasworkflowoutputschemautil.hasWorkflowOutputSchema)({})).toBe(false);
    });
    it('should return true for a non-empty expectedOutputSchema', ()=>{
        expect((0, _hasworkflowoutputschemautil.hasWorkflowOutputSchema)({
            expectedOutputSchema: {
                field: 'value'
            }
        })).toBe(true);
    });
    it('should return false for an empty expectedOutputSchema', ()=>{
        expect((0, _hasworkflowoutputschemautil.hasWorkflowOutputSchema)({
            expectedOutputSchema: {}
        })).toBe(false);
    });
    it('should return true for a non-empty outputSchema', ()=>{
        expect((0, _hasworkflowoutputschemautil.hasWorkflowOutputSchema)({
            outputSchema: {
                field: 'value'
            }
        })).toBe(true);
    });
    it('should return false for an empty outputSchema', ()=>{
        expect((0, _hasworkflowoutputschemautil.hasWorkflowOutputSchema)({
            outputSchema: {}
        })).toBe(false);
    });
    it('should reject a LINK output schema as not being a real schema', ()=>{
        expect((0, _hasworkflowoutputschemautil.hasWorkflowOutputSchema)({
            outputSchema: {
                _outputSchemaType: 'LINK',
                href: 'https://example.com'
            }
        })).toBe(false);
    });
    it('should prefer expectedOutputSchema over a LINK output schema', ()=>{
        expect((0, _hasworkflowoutputschemautil.hasWorkflowOutputSchema)({
            expectedOutputSchema: {
                field: 'value'
            },
            outputSchema: {
                _outputSchemaType: 'LINK'
            }
        })).toBe(true);
    });
    it('should return false for non-object schema values', ()=>{
        expect((0, _hasworkflowoutputschemautil.hasWorkflowOutputSchema)({
            outputSchema: 'not-an-object'
        })).toBe(false);
        expect((0, _hasworkflowoutputschemautil.hasWorkflowOutputSchema)({
            expectedOutputSchema: 42
        })).toBe(false);
    });
});

//# sourceMappingURL=has-workflow-output-schema.util.spec.js.map