"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "shouldRefreshApplicationRegistrationOnInstall", {
    enumerable: true,
    get: function() {
        return shouldRefreshApplicationRegistrationOnInstall;
    }
});
const _semver = /*#__PURE__*/ _interop_require_default(require("semver"));
const _utils = require("twenty-shared/utils");
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
const shouldRefreshApplicationRegistrationOnInstall = ({ installedVersion, latestAvailableVersion })=>{
    if (!(0, _utils.isDefined)(latestAvailableVersion) || !(0, _utils.isDefined)(_semver.default.valid(latestAvailableVersion))) {
        return true;
    }
    if (!(0, _utils.isDefined)(_semver.default.valid(installedVersion))) {
        return false;
    }
    return _semver.default.gte(installedVersion, latestAvailableVersion);
};

//# sourceMappingURL=should-refresh-application-registration-on-install.util.js.map