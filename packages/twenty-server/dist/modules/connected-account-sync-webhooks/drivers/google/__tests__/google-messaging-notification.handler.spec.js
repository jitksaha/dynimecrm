"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _googleauthlibrary = require("google-auth-library");
const _googlemessagingnotificationhandler = require("../google-messaging-notification.handler");
const mockVerifyIdToken = jest.fn();
jest.mock('google-auth-library', ()=>({
        ...jest.requireActual('google-auth-library'),
        OAuth2Client: jest.fn().mockImplementation(()=>({
                verifyIdToken: (...args)=>mockVerifyIdToken(...args)
            }))
    }));
describe('GoogleMessagingNotificationHandler', ()=>{
    it('should reuse the OAuth client while verifying every notification', async ()=>{
        mockVerifyIdToken.mockResolvedValue({
            getPayload: ()=>({
                    email: 'pubsub@example.com',
                    email_verified: true
                })
        });
        const handler = new _googlemessagingnotificationhandler.GoogleMessagingNotificationHandler({
            get: jest.fn((key)=>{
                if (key === 'MESSAGING_GMAIL_PUBSUB_VERIFICATION_EMAIL') {
                    return 'pubsub@example.com';
                }
                if (key === 'SERVER_URL') {
                    return 'https://example.com';
                }
            })
        }, {
            incrementCounterBy: jest.fn()
        }, {}, {}, {});
        await handler.handle({
            authorizationHeader: 'Bearer first-token',
            body: {}
        });
        await handler.handle({
            authorizationHeader: 'Bearer second-token',
            body: {}
        });
        expect(_googleauthlibrary.OAuth2Client).toHaveBeenCalledTimes(1);
        expect(mockVerifyIdToken).toHaveBeenNthCalledWith(1, {
            idToken: 'first-token',
            audience: 'https://example.com/webhooks/google/messaging'
        });
        expect(mockVerifyIdToken).toHaveBeenNthCalledWith(2, {
            idToken: 'second-token',
            audience: 'https://example.com/webhooks/google/messaging'
        });
    });
});

//# sourceMappingURL=google-messaging-notification.handler.spec.js.map