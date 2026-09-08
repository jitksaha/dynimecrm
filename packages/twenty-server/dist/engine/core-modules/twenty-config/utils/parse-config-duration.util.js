"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "parseConfigDuration", {
    enumerable: true,
    get: function() {
        return parseConfigDuration;
    }
});
const _ms = /*#__PURE__*/ _interop_require_default(require("ms"));
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
const parseConfigDuration = (duration)=>{
    if (typeof duration !== 'string') {
        return undefined;
    }
    try {
        const parsedDuration = (0, _ms.default)(duration);
        return typeof parsedDuration === 'number' && Number.isFinite(parsedDuration) ? parsedDuration : undefined;
    } catch  {
        return undefined;
    }
};

//# sourceMappingURL=parse-config-duration.util.js.map