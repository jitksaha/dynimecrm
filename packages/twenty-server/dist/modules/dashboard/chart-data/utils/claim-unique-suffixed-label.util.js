"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "claimUniqueSuffixedLabel", {
    enumerable: true,
    get: function() {
        return claimUniqueSuffixedLabel;
    }
});
const claimUniqueSuffixedLabel = ({ baseLabel, startOrdinal, takenLabels, formatOrdinal })=>{
    let ordinal = startOrdinal;
    let candidateLabel = `${baseLabel} (${formatOrdinal(ordinal)})`;
    while(takenLabels.has(candidateLabel)){
        ordinal += 1;
        candidateLabel = `${baseLabel} (${formatOrdinal(ordinal)})`;
    }
    takenLabels.add(candidateLabel);
    return {
        label: candidateLabel,
        nextOrdinal: ordinal + 1
    };
};

//# sourceMappingURL=claim-unique-suffixed-label.util.js.map