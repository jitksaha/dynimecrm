"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "isLogicFunctionReadyForPrebuiltInstall", {
    enumerable: true,
    get: function() {
        return isLogicFunctionReadyForPrebuiltInstall;
    }
});
const _guards = require("@sniptt/guards");
const _logicfunctionentity = require("../logic-function.entity");
const isLogicFunctionReadyForPrebuiltInstall = (flatLogicFunction)=>flatLogicFunction.executionMode === _logicfunctionentity.LogicFunctionExecutionMode.PREBUILT && flatLogicFunction.isBuildUpToDate === true && (0, _guards.isNonEmptyString)(flatLogicFunction.checksum);

//# sourceMappingURL=is-logic-function-ready-for-prebuilt-install.util.js.map