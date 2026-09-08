"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "getLambdaDepsLayerName", {
    enumerable: true,
    get: function() {
        return getLambdaDepsLayerName;
    }
});
const _buildlambdaresourcenameutil = require("./build-lambda-resource-name.util");
const DEPS_LAYER_NAME_PREFIX = 'deps';
const getLambdaDepsLayerName = ({ flatApplication, namespace })=>(0, _buildlambdaresourcenameutil.buildLambdaResourceName)({
        resourceNamePrefix: DEPS_LAYER_NAME_PREFIX,
        namespace,
        checksum: flatApplication.yarnLockChecksum ?? 'default'
    });

//# sourceMappingURL=get-lambda-deps-layer-name.util.js.map