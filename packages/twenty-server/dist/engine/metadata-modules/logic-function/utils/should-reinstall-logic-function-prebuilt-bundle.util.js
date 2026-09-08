"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "shouldReinstallLogicFunctionPrebuiltBundle", {
    enumerable: true,
    get: function() {
        return shouldReinstallLogicFunctionPrebuiltBundle;
    }
});
const _logicfunctionentity = require("../logic-function.entity");
const _islogicfunctionreadyforprebuiltinstallutil = require("./is-logic-function-ready-for-prebuilt-install.util");
const shouldReinstallLogicFunctionPrebuiltBundle = ({ existingLogicFunction, newLogicFunction })=>{
    if (!(0, _islogicfunctionreadyforprebuiltinstallutil.isLogicFunctionReadyForPrebuiltInstall)(newLogicFunction)) {
        return false;
    }
    if (existingLogicFunction.executionMode === _logicfunctionentity.LogicFunctionExecutionMode.PREBUILT && existingLogicFunction.checksum === newLogicFunction.checksum) {
        return false;
    }
    return true;
};

//# sourceMappingURL=should-reinstall-logic-function-prebuilt-bundle.util.js.map