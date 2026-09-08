/* @license Enterprise */ "use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "validateRLSPredicatesForRecords", {
    enumerable: true,
    get: function() {
        return validateRLSPredicatesForRecords;
    }
});
const _utils = require("twenty-shared/utils");
const _twentyormexception = require("../exceptions/twenty-orm.exception");
const _isrecordmatchingrlsrowlevelpermissionpredicateutil = require("./is-record-matching-rls-row-level-permission-predicate.util");
const _resolverowlevelpermissionrecordfilterutil = require("./resolve-row-level-permission-record-filter.util");
const validateRLSPredicatesForRecords = ({ records, objectMetadata, internalContext, authContext, shouldBypassPermissionChecks, errorMessage = 'Record does not satisfy row-level security constraints of your current role' })=>{
    if (shouldBypassPermissionChecks) {
        return;
    }
    const recordFilter = (0, _resolverowlevelpermissionrecordfilterutil.resolveRowLevelPermissionRecordFilter)({
        internalContext,
        authContext,
        objectMetadata
    });
    if (!(0, _utils.isDefined)(recordFilter)) {
        return;
    }
    for (const record of records){
        const matchesRLS = (0, _isrecordmatchingrlsrowlevelpermissionpredicateutil.isRecordMatchingRLSRowLevelPermissionPredicate)({
            record: record,
            filter: recordFilter,
            flatObjectMetadata: objectMetadata,
            flatFieldMetadataMaps: internalContext.flatFieldMetadataMaps
        });
        if (!matchesRLS) {
            throw new _twentyormexception.TwentyOrmException(errorMessage, _twentyormexception.TwentyOrmExceptionCode.RLS_VALIDATION_FAILED);
        }
    }
};

//# sourceMappingURL=validate-rls-predicates-for-records.util.js.map