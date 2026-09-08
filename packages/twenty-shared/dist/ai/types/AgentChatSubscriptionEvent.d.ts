export type AgentChatSubscriptionEvent = {
    type: 'stream-chunk';
    chunk: Record<string, unknown>;
    seq?: number;
} | {
    type: 'message-persisted';
    messageId: string;
} | {
    type: 'queue-updated';
} | {
    type: 'question-answered';
} | {
    type: 'stream-error';
    code: string;
    message: string;
} | {
    type: 'credits-exhausted';
} | {
    type: 'keepalive';
};
//# sourceMappingURL=AgentChatSubscriptionEvent.d.ts.map