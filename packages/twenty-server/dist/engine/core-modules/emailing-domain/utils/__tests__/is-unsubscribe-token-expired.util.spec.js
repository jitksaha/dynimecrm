"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _unsubscribetokenmaxagemsconstant = require("../../constants/unsubscribe-token-max-age-ms.constant");
const _isunsubscribetokenexpiredutil = require("../is-unsubscribe-token-expired.util");
describe('isUnsubscribeTokenExpired', ()=>{
    const now = Date.UTC(2026, 0, 1);
    it('should not expire a token issued now', ()=>{
        expect((0, _isunsubscribetokenexpiredutil.isUnsubscribeTokenExpired)({
            issuedAt: now,
            now
        })).toBe(false);
    });
    it('should not expire a token issued exactly at the maximum age', ()=>{
        expect((0, _isunsubscribetokenexpiredutil.isUnsubscribeTokenExpired)({
            issuedAt: now - _unsubscribetokenmaxagemsconstant.UNSUBSCRIBE_TOKEN_MAX_AGE_MS,
            now
        })).toBe(false);
    });
    it('should expire a token issued one millisecond past the maximum age', ()=>{
        expect((0, _isunsubscribetokenexpiredutil.isUnsubscribeTokenExpired)({
            issuedAt: now - _unsubscribetokenmaxagemsconstant.UNSUBSCRIBE_TOKEN_MAX_AGE_MS - 1,
            now
        })).toBe(true);
    });
    it('should keep an unsubscribe link alive a year after it was sent', ()=>{
        const oneYearInMilliseconds = 365 * 24 * 60 * 60 * 1000;
        expect((0, _isunsubscribetokenexpiredutil.isUnsubscribeTokenExpired)({
            issuedAt: now - oneYearInMilliseconds,
            now
        })).toBe(false);
    });
    it('should treat a token stamped in the future as fresh', ()=>{
        expect((0, _isunsubscribetokenexpiredutil.isUnsubscribeTokenExpired)({
            issuedAt: now + 60_000,
            now
        })).toBe(false);
    });
});

//# sourceMappingURL=is-unsubscribe-token-expired.util.spec.js.map