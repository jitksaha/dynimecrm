"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "buildUniqueRelationLabels", {
    enumerable: true,
    get: function() {
        return buildUniqueRelationLabels;
    }
});
const _core = require("@lingui/core");
const _guards = require("@sniptt/guards");
const _utils = require("twenty-shared/utils");
const _claimuniquesuffixedlabelutil = require("./claim-unique-suffixed-label.util");
const buildUniqueRelationLabels = ({ rawLabelByRecordId, allRecordIds })=>{
    const sortedRecordIds = [
        ...new Set(allRecordIds)
    ].sort();
    const takenLabels = new Set([
        _core.i18n._(/*i18n*/ {
            id: "NpVtef",
            message: "Not Set"
        }),
        _core.i18n._(/*i18n*/ {
            id: "Ef7StM",
            message: "Unknown"
        })
    ]);
    const labelByRecordId = new Map();
    const unresolvedRecordIds = new Set();
    const recordIdsByRawLabel = new Map();
    for (const recordId of sortedRecordIds){
        const rawLabel = rawLabelByRecordId.get(recordId);
        if (!(0, _utils.isDefined)(rawLabel) || !(0, _guards.isNonEmptyString)(rawLabel.trim())) {
            unresolvedRecordIds.add(recordId);
            continue;
        }
        const recordIdsWithSameLabel = recordIdsByRawLabel.get(rawLabel) ?? [];
        recordIdsWithSameLabel.push(recordId);
        recordIdsByRawLabel.set(rawLabel, recordIdsWithSameLabel);
    }
    for (const [rawLabel, recordIds] of recordIdsByRawLabel){
        const isCollidingLabel = recordIds.length > 1 || takenLabels.has(rawLabel);
        if (!isCollidingLabel) {
            takenLabels.add(rawLabel);
            labelByRecordId.set(recordIds[0], rawLabel);
            continue;
        }
        let ordinal = 1;
        for (const recordId of recordIds){
            const { label, nextOrdinal } = (0, _claimuniquesuffixedlabelutil.claimUniqueSuffixedLabel)({
                baseLabel: rawLabel,
                startOrdinal: ordinal,
                takenLabels,
                formatOrdinal: String
            });
            labelByRecordId.set(recordId, label);
            ordinal = nextOrdinal;
        }
    }
    return {
        labelByRecordId,
        unresolvedRecordIds
    };
};

//# sourceMappingURL=build-unique-relation-labels.util.js.map