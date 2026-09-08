"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _emailconnectionsecurityenum = require("../../enums/email-connection-security.enum");
const _buildsmtptlsoptionsutil = require("../build-smtp-tls-options.util");
describe('buildSmtpTlsOptions', ()=>{
    it('negotiates TLS at connection time for SSL_TLS', ()=>{
        expect((0, _buildsmtptlsoptionsutil.buildSmtpTlsOptions)(_emailconnectionsecurityenum.EmailConnectionSecurity.SSL_TLS)).toEqual({
            secure: true
        });
    });
    it('upgrades opportunistically via STARTTLS when the server offers it', ()=>{
        expect((0, _buildsmtptlsoptionsutil.buildSmtpTlsOptions)(_emailconnectionsecurityenum.EmailConnectionSecurity.STARTTLS)).toEqual({
            secure: false
        });
    });
    it('forces plaintext for NONE by skipping the STARTTLS upgrade entirely', ()=>{
        expect((0, _buildsmtptlsoptionsutil.buildSmtpTlsOptions)(_emailconnectionsecurityenum.EmailConnectionSecurity.NONE)).toEqual({
            secure: false,
            ignoreTLS: true
        });
    });
});

//# sourceMappingURL=build-smtp-tls-options.util.spec.js.map