"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _types = require("twenty-shared/types");
const _getmissingdraftemailscopesutil = require("../get-missing-draft-email-scopes.util");
const GMAIL_COMPOSE_SCOPE = 'https://www.googleapis.com/auth/gmail.compose';
const MICROSOFT_SEND_SCOPE = 'Mail.Send';
describe('getMissingDraftEmailScopes', ()=>{
    describe('Google provider', ()=>{
        it('returns the compose scope when missing', ()=>{
            expect((0, _getmissingdraftemailscopesutil.getMissingDraftEmailScopes)({
                provider: _types.ConnectedAccountProvider.GOOGLE,
                scopes: [
                    'email',
                    'profile'
                ]
            })).toEqual([
                GMAIL_COMPOSE_SCOPE
            ]);
        });
        it('returns the compose scope when scopes are null', ()=>{
            expect((0, _getmissingdraftemailscopesutil.getMissingDraftEmailScopes)({
                provider: _types.ConnectedAccountProvider.GOOGLE,
                scopes: null
            })).toEqual([
                GMAIL_COMPOSE_SCOPE
            ]);
        });
        it('returns nothing when the compose scope is present', ()=>{
            expect((0, _getmissingdraftemailscopesutil.getMissingDraftEmailScopes)({
                provider: _types.ConnectedAccountProvider.GOOGLE,
                scopes: [
                    'email',
                    GMAIL_COMPOSE_SCOPE
                ]
            })).toEqual([]);
        });
    });
    describe('Microsoft provider', ()=>{
        it('returns the send scope when missing', ()=>{
            expect((0, _getmissingdraftemailscopesutil.getMissingDraftEmailScopes)({
                provider: _types.ConnectedAccountProvider.MICROSOFT,
                scopes: [
                    'Mail.ReadWrite'
                ]
            })).toEqual([
                MICROSOFT_SEND_SCOPE
            ]);
        });
        it('returns nothing when the send scope is present', ()=>{
            expect((0, _getmissingdraftemailscopesutil.getMissingDraftEmailScopes)({
                provider: _types.ConnectedAccountProvider.MICROSOFT,
                scopes: [
                    MICROSOFT_SEND_SCOPE
                ]
            })).toEqual([]);
        });
    });
    describe('non-OAuth providers', ()=>{
        it.each([
            _types.ConnectedAccountProvider.IMAP_SMTP_CALDAV,
            _types.ConnectedAccountProvider.EMAIL_GROUP,
            _types.ConnectedAccountProvider.APP,
            _types.ConnectedAccountProvider.OIDC,
            _types.ConnectedAccountProvider.SAML
        ])('never requires scopes for %s accounts', (provider)=>{
            expect((0, _getmissingdraftemailscopesutil.getMissingDraftEmailScopes)({
                provider,
                scopes: null
            })).toEqual([]);
        });
    });
});

//# sourceMappingURL=get-missing-draft-email-scopes.util.spec.js.map