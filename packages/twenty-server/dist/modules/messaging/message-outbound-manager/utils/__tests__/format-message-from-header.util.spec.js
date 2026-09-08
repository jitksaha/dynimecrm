"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _formatmessagefromheaderutil = require("../format-message-from-header.util");
describe('formatMessageFromHeader', ()=>{
    it('should format name and email when name is provided', ()=>{
        expect((0, _formatmessagefromheaderutil.formatMessageFromHeader)({
            fromEmail: 'user@example.com',
            fromName: 'Test User'
        })).toBe('=?UTF-8?B?VGVzdCBVc2Vy?= <user@example.com>');
    });
    it('should fall back to the bare email when name is missing', ()=>{
        expect((0, _formatmessagefromheaderutil.formatMessageFromHeader)({
            fromEmail: 'user@example.com',
            fromName: null
        })).toBe('user@example.com');
    });
    it('should fall back to the bare email when name is blank', ()=>{
        expect((0, _formatmessagefromheaderutil.formatMessageFromHeader)({
            fromEmail: 'user@example.com',
            fromName: ''
        })).toBe('user@example.com');
    });
});

//# sourceMappingURL=format-message-from-header.util.spec.js.map