"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _injectmessagetimestampsutil = require("../inject-message-timestamps.util");
describe('injectMessageTimestamps', ()=>{
    it('prefixes a user message with a timestamp part built from metadata.createdAt', ()=>{
        const messages = [
            {
                id: '1',
                role: 'user',
                parts: [
                    {
                        type: 'text',
                        text: 'What happened yesterday?'
                    }
                ],
                metadata: {
                    createdAt: '2026-07-07T09:57:00.000Z'
                }
            }
        ];
        const [message] = (0, _injectmessagetimestampsutil.injectMessageTimestamps)(messages, 'UTC');
        expect(message.parts).toHaveLength(2);
        expect(message.parts[0]).toEqual({
            type: 'text',
            text: expect.stringContaining('<message_timestamp>Sent: ')
        });
        expect(message.parts[0].text).toContain('UTC');
        expect(message.parts[1]).toEqual({
            type: 'text',
            text: 'What happened yesterday?'
        });
    });
    it('leaves assistant messages untouched', ()=>{
        const messages = [
            {
                id: '1',
                role: 'assistant',
                parts: [
                    {
                        type: 'text',
                        text: 'response'
                    }
                ],
                metadata: {
                    createdAt: '2026-07-07T09:57:00.000Z'
                }
            }
        ];
        const [message] = (0, _injectmessagetimestampsutil.injectMessageTimestamps)(messages, 'UTC');
        expect(message.parts).toHaveLength(1);
        expect(message.parts[0]).toEqual({
            type: 'text',
            text: 'response'
        });
    });
    it('does not throw and still injects a timestamp when the timezone is the "system" sentinel', ()=>{
        const messages = [
            {
                id: '1',
                role: 'user',
                parts: [
                    {
                        type: 'text',
                        text: 'What happened yesterday?'
                    }
                ],
                metadata: {
                    createdAt: '2026-07-07T09:57:00.000Z'
                }
            }
        ];
        const [message] = (0, _injectmessagetimestampsutil.injectMessageTimestamps)(messages, 'system');
        expect(message.parts).toHaveLength(2);
        expect(message.parts[0]).toEqual({
            type: 'text',
            text: expect.stringContaining('<message_timestamp>Sent: ')
        });
    });
    it('leaves user messages without a valid createdAt untouched', ()=>{
        const messages = [
            {
                id: '1',
                role: 'user',
                parts: [
                    {
                        type: 'text',
                        text: 'hello'
                    }
                ]
            },
            {
                id: '2',
                role: 'user',
                parts: [
                    {
                        type: 'text',
                        text: 'world'
                    }
                ],
                metadata: {
                    createdAt: 'not-a-date'
                }
            }
        ];
        const result = (0, _injectmessagetimestampsutil.injectMessageTimestamps)(messages, 'UTC');
        expect(result[0].parts).toHaveLength(1);
        expect(result[1].parts).toHaveLength(1);
    });
});

//# sourceMappingURL=inject-message-timestamps.util.spec.js.map