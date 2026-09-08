"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "getDomainFromEmailOrThrow", {
    enumerable: true,
    get: function() {
        return getDomainFromEmailOrThrow;
    }
});
const _guards = require("@sniptt/guards");
const _graphqlerrorsutil = require("../engine/core-modules/graphql/utils/graphql-errors.util");
const _getdomainfromemail = require("./get-domain-from-email");
const getDomainFromEmailOrThrow = (email)=>{
    if (!(0, _guards.isNonEmptyString)(email)) {
        throw new _graphqlerrorsutil.UserInputError('Email is required. Please provide a valid email address.', {
            userFriendlyMessage: /*i18n*/ {
                id: "3wAyvl",
                message: "Email is required. Please provide a valid email address."
            }
        });
    }
    if (!email.includes('@')) {
        throw new _graphqlerrorsutil.UserInputError('The provided email address is not valid. Please use a standard email format (e.g., user@example.com).', {
            userFriendlyMessage: /*i18n*/ {
                id: "h8R4RO",
                message: "The provided email address is not valid. Please use a standard email format (e.g., user@example.com)."
            }
        });
    }
    const domain = (0, _getdomainfromemail.getDomainFromEmail)(email);
    if (!(0, _guards.isNonEmptyString)(domain)) {
        throw new _graphqlerrorsutil.UserInputError('The provided email address is missing a domain. Please use a standard email format (e.g., user@example.com).', {
            userFriendlyMessage: /*i18n*/ {
                id: "tl8xOZ",
                message: "The provided email address is missing a domain. Please use a standard email format (e.g., user@example.com)."
            }
        });
    }
    return domain;
};

//# sourceMappingURL=get-domain-from-email-or-throw.js.map