"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "resolveCompletedVersionFromCursor", {
    enumerable: true,
    get: function() {
        return resolveCompletedVersionFromCursor;
    }
});
const _extractversionfromcommandnameorthrowutil = require("./extract-version-from-command-name-or-throw.util");
const resolveCompletedVersionFromCursor = ({ stepNames, cursor })=>{
    const cursorIndex = stepNames.indexOf(cursor.name);
    if (cursorIndex === -1) {
        return null;
    }
    const cursorVersion = (0, _extractversionfromcommandnameorthrowutil.extractVersionFromCommandNameOrThrow)(cursor.name);
    const nextStepName = cursorIndex < stepNames.length - 1 ? stepNames[cursorIndex + 1] : null;
    const isCursorOnLastStepOfItsVersion = nextStepName === null || (0, _extractversionfromcommandnameorthrowutil.extractVersionFromCommandNameOrThrow)(nextStepName) !== cursorVersion;
    if (cursor.status === 'completed' && isCursorOnLastStepOfItsVersion) {
        return cursorVersion;
    }
    for(let stepIndex = cursorIndex - 1; stepIndex >= 0; stepIndex--){
        const stepVersion = (0, _extractversionfromcommandnameorthrowutil.extractVersionFromCommandNameOrThrow)(stepNames[stepIndex]);
        if (stepVersion !== cursorVersion) {
            return stepVersion;
        }
    }
    return null;
};

//# sourceMappingURL=resolve-completed-version-from-cursor.util.js.map