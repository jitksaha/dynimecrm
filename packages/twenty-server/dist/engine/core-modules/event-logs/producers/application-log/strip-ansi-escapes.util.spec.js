"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _stripansiescapesutil = require("./strip-ansi-escapes.util");
describe('stripAnsiEscapes', ()=>{
    it('returns plain ASCII strings unchanged', ()=>{
        expect((0, _stripansiescapesutil.stripAnsiEscapes)('hello world')).toBe('hello world');
    });
    it('strips SGR color codes from a yellow value', ()=>{
        expect((0, _stripansiescapesutil.stripAnsiEscapes)('\u001B[33m4 \u001B[39m')).toBe('4 ');
    });
    it('strips compound SGR codes (bold + red, then reset)', ()=>{
        expect((0, _stripansiescapesutil.stripAnsiEscapes)('\u001B[1;31merror\u001B[0m')).toBe('error');
    });
    it('strips 256-color and truecolor SGR sequences', ()=>{
        expect((0, _stripansiescapesutil.stripAnsiEscapes)('\u001B[38;5;208mwarn\u001B[39m')).toBe('warn');
        expect((0, _stripansiescapesutil.stripAnsiEscapes)('\u001B[38;2;0;128;255mblue\u001B[0m')).toBe('blue');
    });
    it('strips cursor-movement CSI sequences', ()=>{
        expect((0, _stripansiescapesutil.stripAnsiEscapes)('a\u001B[2Jb\u001B[Hc')).toBe('abc');
    });
    it('strips OSC sequences (e.g. terminal hyperlinks)', ()=>{
        const link = '\u001B]8;;https://twenty.com\u0007Twenty\u001B]8;;\u0007 rocks';
        expect((0, _stripansiescapesutil.stripAnsiEscapes)(link)).toBe('Twenty rocks');
    });
    it('handles mixed colored output across multiple chunks', ()=>{
        const raw = '\u001B[32mOK\u001B[39m \u001B[2mready\u001B[22m: \u001B[1mdone\u001B[0m';
        expect((0, _stripansiescapesutil.stripAnsiEscapes)(raw)).toBe('OK ready: done');
    });
    it('leaves untouched the bracket text that survived a missing ESC', ()=>{
        expect((0, _stripansiescapesutil.stripAnsiEscapes)('[33m4 [39m')).toBe('[33m4 [39m');
    });
});

//# sourceMappingURL=strip-ansi-escapes.util.spec.js.map