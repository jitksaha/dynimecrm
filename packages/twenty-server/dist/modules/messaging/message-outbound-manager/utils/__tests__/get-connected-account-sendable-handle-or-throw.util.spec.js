"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _getconnectedaccountsendablehandleorthrowutil = require("../get-connected-account-sendable-handle-or-throw.util");
const connectedAccount = {
    handle: 'primary@holdco.com',
    handleAliases: [
        'Sales@company.com',
        'support@company.com'
    ]
};
describe('getConnectedAccountSendableHandleOrThrow', ()=>{
    it('should accept the connected account handle itself', ()=>{
        expect((0, _getconnectedaccountsendablehandleorthrowutil.getConnectedAccountSendableHandleOrThrow)({
            connectedAccount,
            requestedFromHandle: 'primary@holdco.com'
        })).toBe('primary@holdco.com');
    });
    it('should accept a verified alias and return it as the provider spells it', ()=>{
        expect((0, _getconnectedaccountsendablehandleorthrowutil.getConnectedAccountSendableHandleOrThrow)({
            connectedAccount,
            requestedFromHandle: '  sales@COMPANY.com '
        })).toBe('Sales@company.com');
    });
    it('should reject an address the account has not verified', ()=>{
        expect(()=>(0, _getconnectedaccountsendablehandleorthrowutil.getConnectedAccountSendableHandleOrThrow)({
                connectedAccount,
                requestedFromHandle: 'ceo@competitor.com'
            })).toThrow('is not the connected account handle nor one of its verified');
    });
    it('should reject any alias when the account has none', ()=>{
        expect(()=>(0, _getconnectedaccountsendablehandleorthrowutil.getConnectedAccountSendableHandleOrThrow)({
                connectedAccount: {
                    handle: 'primary@holdco.com',
                    handleAliases: null
                },
                requestedFromHandle: 'sales@company.com'
            })).toThrow();
    });
});

//# sourceMappingURL=get-connected-account-sendable-handle-or-throw.util.spec.js.map