"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "computeHashedLambdaResourceName", {
    enumerable: true,
    get: function() {
        return computeHashedLambdaResourceName;
    }
});
const _crypto = require("crypto");
const _buildlambdaresourcenameutil = require("./build-lambda-resource-name.util");
const RESOURCE_NAME_CHECKSUM_LENGTH = 12;
const computeHashedLambdaResourceName = ({ resourceNamePrefix, namespace, contents })=>{
    const hash = (0, _crypto.createHash)('sha256');
    for (const content of contents){
        hash.update(content);
    }
    const checksum = hash.digest('hex').slice(0, RESOURCE_NAME_CHECKSUM_LENGTH);
    return (0, _buildlambdaresourcenameutil.buildLambdaResourceName)({
        resourceNamePrefix,
        namespace,
        checksum
    });
};

//# sourceMappingURL=compute-hashed-lambda-resource-name.util.js.map