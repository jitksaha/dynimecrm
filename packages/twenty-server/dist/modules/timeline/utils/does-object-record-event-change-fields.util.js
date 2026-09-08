"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "doesObjectRecordEventChangeFields", {
    enumerable: true,
    get: function() {
        return doesObjectRecordEventChangeFields;
    }
});
const _utils = require("twenty-shared/utils");
const doesObjectRecordEventChangeFields = ({ event, fieldNames })=>{
    const { updatedFields, diff } = event.properties;
    if ((0, _utils.isDefined)(updatedFields)) {
        return fieldNames.some((fieldName)=>updatedFields.includes(fieldName));
    }
    return (0, _utils.isDefined)(diff) && fieldNames.some((fieldName)=>Object.prototype.hasOwnProperty.call(diff, fieldName));
};

//# sourceMappingURL=does-object-record-event-change-fields.util.js.map