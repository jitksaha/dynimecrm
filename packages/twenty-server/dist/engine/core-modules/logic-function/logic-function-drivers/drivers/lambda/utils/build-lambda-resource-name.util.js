"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "buildLambdaResourceName", {
    enumerable: true,
    get: function() {
        return buildLambdaResourceName;
    }
});
const _guards = require("@sniptt/guards");
const buildLambdaResourceName = ({ resourceNamePrefix, namespace, checksum })=>(0, _guards.isNonEmptyString)(namespace) ? `${resourceNamePrefix}-${namespace}-${checksum}` : `${resourceNamePrefix}-${checksum}`;

//# sourceMappingURL=build-lambda-resource-name.util.js.map