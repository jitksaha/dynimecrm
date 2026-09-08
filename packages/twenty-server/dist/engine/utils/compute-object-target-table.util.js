"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "computeObjectTargetTable", {
    enumerable: true,
    get: function() {
        return computeObjectTargetTable;
    }
});
const _twentystandardapplications = require("../workspace-manager/twenty-standard-application/constants/twenty-standard-applications");
const _computetablenameutil = require("./compute-table-name.util");
const computeObjectTargetTable = (objectMetadata)=>{
    return (0, _computetablenameutil.computeTableName)(objectMetadata.nameSingular, objectMetadata.applicationUniversalIdentifier !== _twentystandardapplications.TWENTY_STANDARD_APPLICATION.universalIdentifier);
};

//# sourceMappingURL=compute-object-target-table.util.js.map