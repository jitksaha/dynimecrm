"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "getNativeModelToolsForSdkPackage", {
    enumerable: true,
    get: function() {
        return getNativeModelToolsForSdkPackage;
    }
});
const _nativemodeltoolsbysdkpackageconst = require("../constants/native-model-tools-by-sdk-package.const");
const getNativeModelToolsForSdkPackage = (sdkPackage)=>sdkPackage ? _nativemodeltoolsbysdkpackageconst.NATIVE_MODEL_TOOLS_BY_SDK_PACKAGE[sdkPackage] : undefined;

//# sourceMappingURL=get-native-model-tools-for-sdk-package.util.js.map