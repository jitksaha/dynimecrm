"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _types = require("twenty-shared/types");
const _getmissingcreateeventscopesutil = require("../get-missing-create-event-scopes.util");
const GOOGLE_SCOPE = 'https://www.googleapis.com/auth/calendar.events';
const MICROSOFT_SCOPE = 'Calendars.ReadWrite';
describe('getMissingCreateEventScopes', ()=>{
    it('returns no missing scope when Google has calendar.events', ()=>{
        expect((0, _getmissingcreateeventscopesutil.getMissingCreateEventScopes)({
            provider: _types.ConnectedAccountProvider.GOOGLE,
            scopes: [
                'email',
                GOOGLE_SCOPE
            ]
        })).toEqual([]);
    });
    it('reports the Google calendar.events scope when missing', ()=>{
        expect((0, _getmissingcreateeventscopesutil.getMissingCreateEventScopes)({
            provider: _types.ConnectedAccountProvider.GOOGLE,
            scopes: [
                'email'
            ]
        })).toEqual([
            GOOGLE_SCOPE
        ]);
    });
    it('returns no missing scope when Microsoft has Calendars.ReadWrite', ()=>{
        expect((0, _getmissingcreateeventscopesutil.getMissingCreateEventScopes)({
            provider: _types.ConnectedAccountProvider.MICROSOFT,
            scopes: [
                MICROSOFT_SCOPE
            ]
        })).toEqual([]);
    });
    it('reports the Microsoft Calendars.ReadWrite scope when missing', ()=>{
        expect((0, _getmissingcreateeventscopesutil.getMissingCreateEventScopes)({
            provider: _types.ConnectedAccountProvider.MICROSOFT,
            scopes: [
                'Calendars.Read'
            ]
        })).toEqual([
            MICROSOFT_SCOPE
        ]);
    });
    it('treats null scopes as missing', ()=>{
        expect((0, _getmissingcreateeventscopesutil.getMissingCreateEventScopes)({
            provider: _types.ConnectedAccountProvider.GOOGLE,
            scopes: null
        })).toEqual([
            GOOGLE_SCOPE
        ]);
    });
    it('does not require OAuth scopes for non-OAuth providers', ()=>{
        expect((0, _getmissingcreateeventscopesutil.getMissingCreateEventScopes)({
            provider: _types.ConnectedAccountProvider.IMAP_SMTP_CALDAV,
            scopes: null
        })).toEqual([]);
    });
});

//# sourceMappingURL=get-missing-create-event-scopes.util.spec.js.map