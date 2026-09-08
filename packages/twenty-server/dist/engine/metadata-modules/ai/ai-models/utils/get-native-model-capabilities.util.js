"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "getNativeModelCapabilities", {
    enumerable: true,
    get: function() {
        return getNativeModelCapabilities;
    }
});
const _getnativemodeltoolsforsdkpackageutil = require("./get-native-model-tools-for-sdk-package.util");
const getNativeModelCapabilities = (sdkPackage)=>{
    const tools = (0, _getnativemodeltoolsforsdkpackageutil.getNativeModelToolsForSdkPackage)(sdkPackage);
    const toolKeys = tools ? Object.keys(tools) : [];
    if (toolKeys.length === 0) {
        return undefined;
    }
    return Object.fromEntries(toolKeys.map((toolKey)=>[
            toolKey,
            true
        ]));
};

//# sourceMappingURL=get-native-model-capabilities.util.js.map