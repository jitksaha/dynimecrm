"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "buildImapTlsOptions", {
    enumerable: true,
    get: function() {
        return buildImapTlsOptions;
    }
});
const _emailconnectionsecurityenum = require("../enums/email-connection-security.enum");
const buildImapTlsOptions = (connectionSecurity)=>{
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
                doSTARTTLS: false
            };
    }
};

//# sourceMappingURL=build-imap-tls-options.util.js.map