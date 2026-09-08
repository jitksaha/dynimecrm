"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "getDefaultApplicationPackageFields", {
    enumerable: true,
    get: function() {
        return getDefaultApplicationPackageFields;
    }
});
const _promises = require("node:fs/promises");
const _path = /*#__PURE__*/ _interop_require_default(require("path"));
const _parseavailablepackagesfrompackagejsonandyarnlockutil = require("./parse-available-packages-from-package-json-and-yarn-lock.util");
const _seeddependenciesdirname = require("../constants/seed-dependencies-dirname");
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
// To regenerate: use logicFunctionCreateHash from logic-function-create-hash.utils.
// package.json: hash(JSON.stringify(JSON.parse(content))). yarn.lock: hash(content).
// Both use first 32 chars of SHA512 hex digest.
const DEFAULT_PACKAGE_JSON_CHECKSUM = '32fb3d7b6c95e0175bc2a27d86596a44';
const DEFAULT_YARN_LOCK_CHECKSUM = 'e53782ad5f6779478b2aec8451ea388e';
const getDefaultApplicationPackageFields = async ()=>{
    const [packageJsonContent, yarnLockContent] = await Promise.all([
        (0, _promises.readFile)(_path.default.join(_seeddependenciesdirname.SEED_DEPENDENCIES_DIRNAME, 'package.json'), 'utf8'),
        (0, _promises.readFile)(_path.default.join(_seeddependenciesdirname.SEED_DEPENDENCIES_DIRNAME, 'yarn.lock'), 'utf8')
    ]);
    const availablePackages = (0, _parseavailablepackagesfrompackagejsonandyarnlockutil.parseAvailablePackagesFromPackageJsonAndYarnLock)(packageJsonContent, yarnLockContent);
    return {
        packageJsonChecksum: DEFAULT_PACKAGE_JSON_CHECKSUM,
        yarnLockChecksum: DEFAULT_YARN_LOCK_CHECKSUM,
        availablePackages,
        packageJsonContent,
        yarnLockContent
    };
};

//# sourceMappingURL=get-default-application-package-fields.util.js.map