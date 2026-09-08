"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "buildLabeledContextLines", {
    enumerable: true,
    get: function() {
        return buildLabeledContextLines;
    }
});
const _utils = require("twenty-shared/utils");
const buildLabeledContextLines = ({ requiredFirstLine, optionalLines })=>{
    const lines = [
        requiredFirstLine
    ];
    for (const [label, value] of optionalLines){
        if ((0, _utils.isDefined)(value)) {
            lines.push(`${label}: ${value}`);
        }
    }
    return lines.join('\n');
};

//# sourceMappingURL=build-labeled-context-lines.util.js.map