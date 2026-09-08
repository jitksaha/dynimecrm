"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _emailconnectionsecurityenum = require("../../enums/email-connection-security.enum");
const _buildimaptlsoptionsutil = require("../build-imap-tls-options.util");
describe('buildImapTlsOptions', ()=>{
    it('negotiates TLS at connection time for SSL_TLS', ()=>{
        expect((0, _buildimaptlsoptionsutil.buildImapTlsOptions)(_emailconnectionsecurityenum.EmailConnectionSecurity.SSL_TLS)).toEqual({
            secure: true
        });
    });
    it('upgrades opportunistically via STARTTLS when the server offers it', ()=>{
        expect((0, _buildimaptlsoptionsutil.buildImapTlsOptions)(_emailconnectionsecurityenum.EmailConnectionSecurity.STARTTLS)).toEqual({
            secure: false
        });
    });
    it('forces plaintext for NONE by disabling the STARTTLS upgrade', ()=>{
        expect((0, _buildimaptlsoptionsutil.buildImapTlsOptions)(_emailconnectionsecurityenum.EmailConnectionSecurity.NONE)).toEqual({
            secure: false,
            doSTARTTLS: false
        });
    });
});

//# sourceMappingURL=build-imap-tls-options.util.spec.js.map