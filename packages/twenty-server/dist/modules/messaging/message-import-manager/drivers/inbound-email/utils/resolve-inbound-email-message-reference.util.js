"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "resolveInboundEmailMessageReference", {
    enumerable: true,
    get: function() {
        return resolveInboundEmailMessageReference;
    }
});
const _inboundemailmessagesourceconstant = require("../constants/inbound-email-message-source.constant");
const resolveInboundEmailMessageReference = (data)=>{
    if ('s3Key' in data) {
        return {
            source: _inboundemailmessagesourceconstant.INBOUND_EMAIL_MESSAGE_SOURCE.SES_S3,
            reference: data.s3Key
        };
    }
    return {
        source: data.source,
        reference: data.reference
    };
};

//# sourceMappingURL=resolve-inbound-email-message-reference.util.js.map