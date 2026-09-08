"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _hassucceededworkspacesetupcompletionutil = require("../has-succeeded-workspace-setup-completion.util");
const buildMessage = (parts)=>({
        parts
    });
describe('hasSucceededWorkspaceSetupCompletion', ()=>{
    it('should detect a succeeded completion in an earlier message', ()=>{
        const messages = [
            buildMessage([
                {
                    type: 'text',
                    text: 'All set.'
                }
            ]),
            buildMessage([
                {
                    type: 'tool-complete_workspace_setup',
                    toolCallId: 'call-1',
                    input: {},
                    state: 'output-available',
                    output: {
                        success: true,
                        message: 'Setup marked as finished.'
                    }
                }
            ])
        ];
        expect((0, _hassucceededworkspacesetupcompletionutil.hasSucceededWorkspaceSetupCompletion)(messages)).toBe(true);
    });
    it('should ignore a completion that has not produced its output yet', ()=>{
        const messages = [
            buildMessage([
                {
                    type: 'tool-complete_workspace_setup',
                    toolCallId: 'call-1',
                    input: {},
                    state: 'input-streaming'
                }
            ])
        ];
        expect((0, _hassucceededworkspacesetupcompletionutil.hasSucceededWorkspaceSetupCompletion)(messages)).toBe(false);
    });
    it('should ignore a completion that failed', ()=>{
        const messages = [
            buildMessage([
                {
                    type: 'tool-complete_workspace_setup',
                    toolCallId: 'call-1',
                    input: {},
                    state: 'output-available',
                    output: {
                        success: false,
                        message: 'Something went wrong.'
                    }
                }
            ])
        ];
        expect((0, _hassucceededworkspacesetupcompletionutil.hasSucceededWorkspaceSetupCompletion)(messages)).toBe(false);
    });
    it('should ignore other tools that succeeded', ()=>{
        const messages = [
            buildMessage([
                {
                    type: 'tool-ask_questions',
                    toolCallId: 'call-1',
                    input: {},
                    state: 'output-available',
                    output: {
                        success: true
                    }
                }
            ])
        ];
        expect((0, _hassucceededworkspacesetupcompletionutil.hasSucceededWorkspaceSetupCompletion)(messages)).toBe(false);
    });
    it('should return false for a conversation without any tool call', ()=>{
        expect((0, _hassucceededworkspacesetupcompletionutil.hasSucceededWorkspaceSetupCompletion)([
            buildMessage([
                {
                    type: 'text',
                    text: 'Hello.'
                }
            ])
        ])).toBe(false);
    });
});

//# sourceMappingURL=has-succeeded-workspace-setup-completion.util.spec.js.map