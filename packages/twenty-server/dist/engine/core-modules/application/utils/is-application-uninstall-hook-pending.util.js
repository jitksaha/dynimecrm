"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "isApplicationUninstallHookPending", {
    enumerable: true,
    get: function() {
        return isApplicationUninstallHookPending;
    }
});
const _utils = require("twenty-shared/utils");
const isApplicationUninstallHookPending = (application, uninstallRequestedAt)=>(0, _utils.isDefined)(application.uninstallLogicFunctionId) && (!(0, _utils.isDefined)(application.uninstallHookCompletedForRequestedAt) || application.uninstallHookCompletedForRequestedAt.getTime() < uninstallRequestedAt.getTime());

//# sourceMappingURL=is-application-uninstall-hook-pending.util.js.map