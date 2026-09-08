"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _messagesuppressionreasontype = require("../../types/message-suppression-reason.type");
const _issuppressionblockingsendutil = require("../is-suppression-blocking-send.util");
const NEWSLETTER_TOPIC_ID = '11111111-1111-4111-8111-111111111111';
const PRODUCT_TOPIC_ID = '22222222-2222-4222-8222-222222222222';
describe('isSuppressionBlockingSend', ()=>{
    describe.each([
        _messagesuppressionreasontype.MessageSuppressionReason.BOUNCE,
        _messagesuppressionreasontype.MessageSuppressionReason.COMPLAINT
    ])('hard suppression (%s)', (reason)=>{
        it('should block a marketing send', ()=>{
            expect((0, _issuppressionblockingsendutil.isSuppressionBlockingSend)({
                sendKind: 'MARKETING',
                suppression: {
                    reason,
                    unsubscribeTopicId: null
                },
                unsubscribeTopicId: NEWSLETTER_TOPIC_ID
            })).toBe(true);
        });
        it('should block a transactional send, because a dead or hostile address is dead for all mail', ()=>{
            expect((0, _issuppressionblockingsendutil.isSuppressionBlockingSend)({
                sendKind: 'TRANSACTIONAL',
                suppression: {
                    reason,
                    unsubscribeTopicId: null
                }
            })).toBe(true);
        });
    });
    describe('unsubscribe from all', ()=>{
        const suppression = {
            reason: _messagesuppressionreasontype.MessageSuppressionReason.UNSUBSCRIBE,
            unsubscribeTopicId: null
        };
        it('should block a marketing send carrying no topic', ()=>{
            expect((0, _issuppressionblockingsendutil.isSuppressionBlockingSend)({
                sendKind: 'MARKETING',
                suppression
            })).toBe(true);
        });
        it('should block a marketing send carrying any topic', ()=>{
            expect((0, _issuppressionblockingsendutil.isSuppressionBlockingSend)({
                sendKind: 'MARKETING',
                suppression,
                unsubscribeTopicId: NEWSLETTER_TOPIC_ID
            })).toBe(true);
        });
        it('should let a transactional reply through', ()=>{
            expect((0, _issuppressionblockingsendutil.isSuppressionBlockingSend)({
                sendKind: 'TRANSACTIONAL',
                suppression
            })).toBe(false);
        });
    });
    describe('topic opt-out', ()=>{
        const suppression = {
            reason: _messagesuppressionreasontype.MessageSuppressionReason.UNSUBSCRIBE,
            unsubscribeTopicId: NEWSLETTER_TOPIC_ID
        };
        it('should block a marketing send on the same topic', ()=>{
            expect((0, _issuppressionblockingsendutil.isSuppressionBlockingSend)({
                sendKind: 'MARKETING',
                suppression,
                unsubscribeTopicId: NEWSLETTER_TOPIC_ID
            })).toBe(true);
        });
        it('should let a marketing send on another topic through', ()=>{
            expect((0, _issuppressionblockingsendutil.isSuppressionBlockingSend)({
                sendKind: 'MARKETING',
                suppression,
                unsubscribeTopicId: PRODUCT_TOPIC_ID
            })).toBe(false);
        });
        it('should let a marketing send carrying no topic through', ()=>{
            expect((0, _issuppressionblockingsendutil.isSuppressionBlockingSend)({
                sendKind: 'MARKETING',
                suppression
            })).toBe(false);
        });
        it('should let a transactional reply through', ()=>{
            expect((0, _issuppressionblockingsendutil.isSuppressionBlockingSend)({
                sendKind: 'TRANSACTIONAL',
                suppression
            })).toBe(false);
        });
    });
});

//# sourceMappingURL=is-suppression-blocking-send.util.spec.js.map