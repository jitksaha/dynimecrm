"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "getPageInfo", {
    enumerable: true,
    get: function() {
        return getPageInfo;
    }
});
const _cursorsutil = require("../../graphql/graphql-query-runner/utils/cursors.util");
const getPageInfo = ({ records, orderBy, pageInfo, flatObjectMetadata, flatObjectMetadataMaps, flatFieldMetadataMaps, orderByValuesByRecordId })=>{
    const encodeRecordCursor = (record)=>(0, _cursorsutil.encodeCursor)({
            objectRecord: record,
            order: orderBy,
            flatObjectMetadata,
            flatObjectMetadataMaps,
            flatFieldMetadataMaps,
            orderByValuesFromScan: orderByValuesByRecordId?.[record.id]
        });
    return {
        startCursor: records.length > 0 ? encodeRecordCursor(records[0]) : null,
        endCursor: records.length > 0 ? encodeRecordCursor(records[records.length - 1]) : null,
        ...pageInfo
    };
};

//# sourceMappingURL=get-page-info.util.js.map