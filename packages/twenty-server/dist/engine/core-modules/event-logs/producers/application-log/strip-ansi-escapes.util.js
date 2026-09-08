"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "stripAnsiEscapes", {
    enumerable: true,
    get: function() {
        return stripAnsiEscapes;
    }
});
const ANSI_CSI_REGEX = /\u001B\[[0-?]*[ -/]*[@-~]/g;
const ANSI_OSC_REGEX = /\u001B\][^\u0007\u001B]*(?:\u0007|\u001B\\)/g;
const stripAnsiEscapes = (value)=>value.replace(ANSI_CSI_REGEX, '').replace(ANSI_OSC_REGEX, '');

//# sourceMappingURL=strip-ansi-escapes.util.js.map