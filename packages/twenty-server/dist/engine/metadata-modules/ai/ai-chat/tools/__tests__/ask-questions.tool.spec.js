"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _askquestionstool = require("../ask-questions.tool");
describe('ask_questions tool', ()=>{
    it('is named ask_questions (plural)', ()=>{
        expect(_askquestionstool.ASK_QUESTIONS_TOOL_NAME).toBe('ask_questions');
    });
    it('drops the obvious-default guidance on workspace setup threads', ()=>{
        const standardTool = (0, _askquestionstool.createAskQuestionsTool)({
            isWorkspaceSetupThread: false
        });
        const setupTool = (0, _askquestionstool.createAskQuestionsTool)({
            isWorkspaceSetupThread: true
        });
        expect(standardTool.description).toContain('trivial choices with an obvious default');
        expect(setupTool.description).not.toContain('obvious default');
        expect(setupTool.description).toContain('information you could look up with another tool');
    });
    it('execute echoes the questions with a pending status', async ()=>{
        const tool = (0, _askquestionstool.createAskQuestionsTool)({
            isWorkspaceSetupThread: false
        });
        const questions = [
            {
                header: 'Email type',
                question: 'What type of email?',
                options: [
                    {
                        label: 'Welcome'
                    },
                    {
                        label: 'Offer'
                    }
                ]
            }
        ];
        const output = await tool.execute({
            questions
        });
        expect(output).toEqual({
            success: true,
            message: expect.any(String),
            result: {
                questions,
                status: 'pending'
            }
        });
    });
    it('rejects fewer than two options', ()=>{
        const result = _askquestionstool.askQuestionsInputSchema.safeParse({
            questions: [
                {
                    header: 'h',
                    question: 'q',
                    options: [
                        {
                            label: 'only one'
                        }
                    ]
                }
            ]
        });
        expect(result.success).toBe(false);
    });
    it('rejects zero questions', ()=>{
        const result = _askquestionstool.askQuestionsInputSchema.safeParse({
            questions: []
        });
        expect(result.success).toBe(false);
    });
    it('rejects more than four questions', ()=>{
        const question = {
            header: 'h',
            question: 'q',
            options: [
                {
                    label: 'a'
                },
                {
                    label: 'b'
                }
            ]
        };
        const result = _askquestionstool.askQuestionsInputSchema.safeParse({
            questions: [
                question,
                question,
                question,
                question,
                question
            ]
        });
        expect(result.success).toBe(false);
    });
    it('rejects more than four options', ()=>{
        const result = _askquestionstool.askQuestionsInputSchema.safeParse({
            questions: [
                {
                    header: 'h',
                    question: 'q',
                    options: [
                        {
                            label: 'a'
                        },
                        {
                            label: 'b'
                        },
                        {
                            label: 'c'
                        },
                        {
                            label: 'd'
                        },
                        {
                            label: 'e'
                        }
                    ]
                }
            ]
        });
        expect(result.success).toBe(false);
    });
    it('rejects more than one recommended option', ()=>{
        const result = _askquestionstool.askQuestionsInputSchema.safeParse({
            questions: [
                {
                    header: 'h',
                    question: 'q',
                    options: [
                        {
                            label: 'a',
                            isRecommended: true
                        },
                        {
                            label: 'b',
                            isRecommended: true
                        }
                    ]
                }
            ]
        });
        expect(result.success).toBe(false);
    });
    it('accepts a valid multi-question payload', ()=>{
        const result = _askquestionstool.askQuestionsInputSchema.safeParse({
            questions: [
                {
                    header: 'h1',
                    question: 'q1',
                    options: [
                        {
                            label: 'a'
                        },
                        {
                            label: 'b'
                        }
                    ]
                },
                {
                    header: 'h2',
                    question: 'q2',
                    options: [
                        {
                            label: 'c',
                            description: 'desc',
                            isRecommended: true
                        },
                        {
                            label: 'd'
                        }
                    ],
                    allowMultiSelect: true
                }
            ]
        });
        expect(result.success).toBe(true);
    });
});

//# sourceMappingURL=ask-questions.tool.spec.js.map