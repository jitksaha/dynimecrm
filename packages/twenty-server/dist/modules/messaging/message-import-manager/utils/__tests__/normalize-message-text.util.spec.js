"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _normalizemessagetextutil = require("../normalize-message-text.util");
describe('normalizeMessageText', ()=>{
    it('should convert CRLF and bare CR to LF', ()=>{
        expect((0, _normalizemessagetextutil.normalizeMessageText)('line one\r\nline two\rline three')).toBe('line one\nline two\nline three');
    });
    it('should replace non-breaking spaces with regular spaces', ()=>{
        expect((0, _normalizemessagetextutil.normalizeMessageText)('Hello\u00A0world')).toBe('Hello world');
    });
    it('should strip trailing whitespace on each line', ()=>{
        expect((0, _normalizemessagetextutil.normalizeMessageText)('hello   \nworld\t')).toBe('hello\nworld');
    });
    it('should collapse runs of three or more blank lines to one blank line', ()=>{
        expect((0, _normalizemessagetextutil.normalizeMessageText)('top\n\n\n\n\nbottom')).toBe('top\n\nbottom');
    });
    it('should trim leading and trailing whitespace overall', ()=>{
        expect((0, _normalizemessagetextutil.normalizeMessageText)('\r\n\r\n\r\nHello\r\n\r\n')).toBe('Hello');
    });
    it('should leave already-clean text unchanged', ()=>{
        expect((0, _normalizemessagetextutil.normalizeMessageText)('Hello\n\nworld')).toBe('Hello\n\nworld');
    });
});

//# sourceMappingURL=normalize-message-text.util.spec.js.map