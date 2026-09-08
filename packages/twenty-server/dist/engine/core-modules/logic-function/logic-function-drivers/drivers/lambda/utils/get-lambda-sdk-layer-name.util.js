"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "getLambdaSdkLayerName", {
    enumerable: true,
    get: function() {
        return getLambdaSdkLayerName;
    }
});
const getLambdaSdkLayerName = ({ workspaceId, applicationUniversalIdentifier })=>`sdk-${workspaceId}-${applicationUniversalIdentifier}`;

//# sourceMappingURL=get-lambda-sdk-layer-name.util.js.map