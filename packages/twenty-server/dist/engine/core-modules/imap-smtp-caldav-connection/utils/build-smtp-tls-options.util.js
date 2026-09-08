"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "buildSmtpTlsOptions", {
    enumerable: true,
    get: function() {
        return buildSmtpTlsOptions;
    }
});
const _emailconnectionsecurityenum = require("../enums/email-connection-security.enum");
const buildSmtpTlsOptions = (connectionSecurity)=>{
    switch(connectionSecurity){
        case _emailconnectionsecurityenum.EmailConnectionSecurity.SSL_TLS:
            return {
                secure: true
            };
        case _emailconnectionsecurityenum.EmailConnectionSecurity.STARTTLS:
            return {
                secure: false
            };
        case _emailconnectionsecurityenum.EmailConnectionSecurity.NONE:
            return {
                secure: false,
                ignoreTLS: true
            };
    }
};

//# sourceMappingURL=build-smtp-tls-options.util.js.map