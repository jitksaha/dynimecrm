"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "getLambdaResourceNamespace", {
    enumerable: true,
    get: function() {
        return getLambdaResourceNamespace;
    }
});
const _crypto = require("crypto");
const _guards = require("@sniptt/guards");
const RESOURCE_NAMESPACE_LENGTH = 10;
const NO_ROLE_SENTINEL = 'no-role';
const getLambdaResourceNamespace = ({ lambdaRoleArn })=>(0, _crypto.createHash)('sha256').update((0, _guards.isNonEmptyString)(lambdaRoleArn) ? lambdaRoleArn : NO_ROLE_SENTINEL).digest('hex').slice(0, RESOURCE_NAMESPACE_LENGTH);

//# sourceMappingURL=get-lambda-resource-namespace.util.js.map