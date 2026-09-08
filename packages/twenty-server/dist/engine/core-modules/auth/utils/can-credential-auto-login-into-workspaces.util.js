"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "canCredentialAutoLoginIntoWorkspaces", {
    enumerable: true,
    get: function() {
        return canCredentialAutoLoginIntoWorkspaces;
    }
});
const _datefns = require("date-fns");
const _ms = /*#__PURE__*/ _interop_require_default(require("ms"));
const _utils = require("twenty-shared/utils");
const _defaultworkspaceautologinwindowconstant = require("../constants/default-workspace-auto-login-window.constant");
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
// A workspace-agnostic session outlives a sign-out performed on a workspace
// subdomain, since the workspace cannot clear a cookie it does not own, so
// converting it into workspace access would hand the workspace back.
const DEFAULT_WORKSPACE_AUTO_LOGIN_WINDOW_MS = (0, _ms.default)(_defaultworkspaceautologinwindowconstant.DEFAULT_WORKSPACE_AUTO_LOGIN_WINDOW);
const canCredentialAutoLoginIntoWorkspaces = ({ isWorkspaceScopedCredential, authenticatedAt, autoLoginWindow, now })=>{
    if (isWorkspaceScopedCredential) {
        return true;
    }
    // Legacy JWT pairs carry no authentication time, so they keep the
    // pre-session behavior until the cutover retires them.
    if (!(0, _utils.isDefined)(authenticatedAt)) {
        return true;
    }
    const parsedWindowMs = (0, _ms.default)(autoLoginWindow);
    // An unparseable or negative window would silently drop the boundary or lock
    // everyone out. Zero is kept, since it deliberately turns the bridge off.
    const isUsableWindow = Number.isFinite(parsedWindowMs) && parsedWindowMs >= 0;
    const autoLoginWindowMs = isUsableWindow ? parsedWindowMs : DEFAULT_WORKSPACE_AUTO_LOGIN_WINDOW_MS;
    return (0, _datefns.addMilliseconds)(authenticatedAt, autoLoginWindowMs) > now;
};

//# sourceMappingURL=can-credential-auto-login-into-workspaces.util.js.map