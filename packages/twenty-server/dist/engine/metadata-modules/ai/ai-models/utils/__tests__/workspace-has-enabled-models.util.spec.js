"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _workspacehasenabledmodelsutil = require("../workspace-has-enabled-models.util");
describe('workspaceHasEnabledModels', ()=>{
    describe('when the workspace uses recommended models', ()=>{
        it('returns true when at least one model is recommended', ()=>{
            expect((0, _workspacehasenabledmodelsutil.workspaceHasEnabledModels)({
                useRecommendedModels: true,
                enabledAiModelIds: []
            }, new Set([
                'openai/gpt-5.2'
            ]))).toBe(true);
        });
        it('returns false when no model is recommended', ()=>{
            expect((0, _workspacehasenabledmodelsutil.workspaceHasEnabledModels)({
                useRecommendedModels: true,
                enabledAiModelIds: []
            }, new Set())).toBe(false);
        });
        it('returns false when no recommended ids are provided', ()=>{
            expect((0, _workspacehasenabledmodelsutil.workspaceHasEnabledModels)({
                useRecommendedModels: true,
                enabledAiModelIds: []
            })).toBe(false);
        });
    });
    describe('when the workspace selects models manually', ()=>{
        it('returns true when at least one model is enabled', ()=>{
            expect((0, _workspacehasenabledmodelsutil.workspaceHasEnabledModels)({
                useRecommendedModels: false,
                enabledAiModelIds: [
                    'openai/gpt-5.2'
                ]
            })).toBe(true);
        });
        it('returns false when every model is disabled', ()=>{
            expect((0, _workspacehasenabledmodelsutil.workspaceHasEnabledModels)({
                useRecommendedModels: false,
                enabledAiModelIds: []
            })).toBe(false);
        });
    });
});

//# sourceMappingURL=workspace-has-enabled-models.util.spec.js.map