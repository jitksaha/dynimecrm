"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _findpendingquestionpartutil = require("../find-pending-question-part.util");
const askQuestionsPart = (status)=>({
        type: 'tool-ask_questions',
        toolCallId: 'call-1',
        state: 'output-available',
        input: {
            questions: []
        },
        output: {
            success: true,
            message: 'x',
            result: {
                questions: [
                    {
                        header: 'h',
                        question: 'q',
                        options: []
                    }
                ],
                status
            }
        }
    });
const textPart = (text)=>({
        type: 'text',
        text
    });
describe('findPendingQuestionPart', ()=>{
    it('returns the ask_questions part when status is pending', ()=>{
        const part = (0, _findpendingquestionpartutil.findPendingQuestionPart)([
            textPart('hello'),
            askQuestionsPart('pending')
        ]);
        expect(part).toBeDefined();
        expect(part?.toolCallId).toBe('call-1');
    });
    it('returns undefined when the question has been answered', ()=>{
        expect((0, _findpendingquestionpartutil.findPendingQuestionPart)([
            askQuestionsPart('answered')
        ])).toBeUndefined();
    });
    it('returns undefined when there is no ask_questions part', ()=>{
        expect((0, _findpendingquestionpartutil.findPendingQuestionPart)([
            textPart('hello')
        ])).toBeUndefined();
    });
    it('ignores other tool parts', ()=>{
        const otherTool = {
            type: 'tool-search_help_center',
            toolCallId: 'call-2',
            state: 'output-available',
            input: {},
            output: {
                success: true
            }
        };
        expect((0, _findpendingquestionpartutil.findPendingQuestionPart)([
            otherTool
        ])).toBeUndefined();
    });
});

//# sourceMappingURL=find-pending-question-part.util.spec.js.map