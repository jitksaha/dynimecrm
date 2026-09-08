"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "isFreshlyCreatedRecord", {
    enumerable: true,
    get: function() {
        return isFreshlyCreatedRecord;
    }
});
const isFreshlyCreatedRecord = (record)=>{
    const createdAt = record.createdAt;
    const updatedAt = record.updatedAt;
    return new Date(createdAt).getTime() === new Date(updatedAt).getTime();
};

//# sourceMappingURL=is-freshly-created-record.util.js.map