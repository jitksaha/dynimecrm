"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _appendhtmlfooterutil = require("../append-html-footer.util");
const FOOTER = '<p>Unsubscribe</p>';
describe('appendHtmlFooter', ()=>{
    it('should insert the footer inside the body of a full document', ()=>{
        const html = (0, _appendhtmlfooterutil.appendHtmlFooter)('<html><head></head><body><p>Hello</p></body></html>', FOOTER);
        expect(html).toBe('<html><head></head><body><p>Hello</p><p>Unsubscribe</p></body></html>');
    });
    it('should insert before the closing html tag when there is no body', ()=>{
        const html = (0, _appendhtmlfooterutil.appendHtmlFooter)('<html><p>Hello</p></html>', FOOTER);
        expect(html).toBe('<html><p>Hello</p><p>Unsubscribe</p></html>');
    });
    it('should append to a bare fragment', ()=>{
        expect((0, _appendhtmlfooterutil.appendHtmlFooter)('<p>Hello</p>', FOOTER)).toBe('<p>Hello</p><p>Unsubscribe</p>');
    });
    it('should match the closing tag case-insensitively', ()=>{
        expect((0, _appendhtmlfooterutil.appendHtmlFooter)('<HTML><BODY>Hi</BODY></HTML>', FOOTER)).toBe('<HTML><BODY>Hi<p>Unsubscribe</p></BODY></HTML>');
    });
    it('should use the last closing body tag when one appears in content', ()=>{
        const html = (0, _appendhtmlfooterutil.appendHtmlFooter)('<html><body><p>talk about &lt;/body&gt;</p></body></html>', FOOTER);
        expect(html).toContain('<p>Unsubscribe</p></body></html>');
    });
});

//# sourceMappingURL=append-html-footer.util.spec.js.map