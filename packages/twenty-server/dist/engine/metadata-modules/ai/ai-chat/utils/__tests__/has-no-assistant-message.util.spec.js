"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _hasnoassistantmessageutil = require("../has-no-assistant-message.util");
const message = (role)=>({
        role
    });
describe('hasNoAssistantMessage', ()=>{
    it('should return true when only user messages exist', ()=>{
        expect((0, _hasnoassistantmessageutil.hasNoAssistantMessage)([
            message('user')
        ])).toBe(true);
    });
    it('should return true for an empty conversation', ()=>{
        expect((0, _hasnoassistantmessageutil.hasNoAssistantMessage)([])).toBe(true);
    });
    it('should return false once an assistant message exists', ()=>{
        expect((0, _hasnoassistantmessageutil.hasNoAssistantMessage)([
            message('user'),
            message('assistant')
        ])).toBe(false);
    });
});

//# sourceMappingURL=has-no-assistant-message.util.spec.js.map