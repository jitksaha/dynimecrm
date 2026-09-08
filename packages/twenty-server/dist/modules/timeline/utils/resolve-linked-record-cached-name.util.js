"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "resolveLinkedRecordCachedName", {
    enumerable: true,
    get: function() {
        return resolveLinkedRecordCachedName;
    }
});
const _utils = require("twenty-shared/utils");
const _getrecorddisplaynameutil = require("../../../engine/core-modules/record-crud/utils/get-record-display-name.util");
const resolveLinkedRecordCachedName = ({ rule, record, flatFieldMetadataMaps })=>(0, _utils.isDefined)(record) ? (0, _getrecorddisplaynameutil.getRecordDisplayName)(record, rule.sourceFlatObjectMetadata, flatFieldMetadataMaps) : undefined;

//# sourceMappingURL=resolve-linked-record-cached-name.util.js.map