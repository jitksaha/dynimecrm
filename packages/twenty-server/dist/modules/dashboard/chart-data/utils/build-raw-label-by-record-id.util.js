"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "buildRawLabelByRecordId", {
    enumerable: true,
    get: function() {
        return buildRawLabelByRecordId;
    }
});
const _guards = require("@sniptt/guards");
const _types = require("twenty-shared/types");
const _utils = require("twenty-shared/utils");
const _getrecorddisplaynameutil = require("../../../../engine/core-modules/record-crud/utils/get-record-display-name.util");
const _getchartlabelidentifierfieldutil = require("./get-chart-label-identifier-field.util");
const hasNonEmptyLabelIdentifierValue = (record, labelIdentifierField)=>{
    const fieldValue = record[labelIdentifierField.name];
    if (labelIdentifierField.type === _types.FieldMetadataType.FULL_NAME) {
        const nameValue = fieldValue;
        return (0, _guards.isNonEmptyString)(`${nameValue?.firstName ?? ''} ${nameValue?.lastName ?? ''}`.trim());
    }
    return (0, _utils.isDefined)(fieldValue) && (0, _guards.isNonEmptyString)(String(fieldValue).trim());
};
const buildRawLabelByRecordId = ({ records, targetFlatObjectMetadata, flatFieldMetadataMaps })=>{
    const rawLabelByRecordId = new Map();
    const labelIdentifierField = (0, _getchartlabelidentifierfieldutil.getChartLabelIdentifierField)({
        flatObjectMetadata: targetFlatObjectMetadata,
        flatFieldMetadataMaps
    });
    if (!(0, _utils.isDefined)(labelIdentifierField)) {
        return rawLabelByRecordId;
    }
    for (const record of records){
        if (!hasNonEmptyLabelIdentifierValue(record, labelIdentifierField)) {
            continue;
        }
        rawLabelByRecordId.set(String(record.id), (0, _getrecorddisplaynameutil.getRecordDisplayName)(record, targetFlatObjectMetadata, flatFieldMetadataMaps));
    }
    return rawLabelByRecordId;
};

//# sourceMappingURL=build-raw-label-by-record-id.util.js.map