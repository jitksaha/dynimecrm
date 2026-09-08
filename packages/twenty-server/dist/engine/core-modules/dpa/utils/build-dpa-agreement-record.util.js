"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "buildDpaAgreementRecord", {
    enumerable: true,
    get: function() {
        return buildDpaAgreementRecord;
    }
});
const _dparegionconfigconstant = require("../config/dpa-region-config.constant");
const _dpatemplateversionconstant = require("../constants/dpa-template-version.constant");
const buildDpaAgreementRecord = (args)=>{
    const config = (0, _dparegionconfigconstant.getDpaRegionConfig)(args.region);
    return {
        workspaceId: args.workspaceId,
        type: args.type,
        templateVersion: _dpatemplateversionconstant.DPA_TEMPLATE_VERSION,
        region: args.region,
        processorEntity: config.values.PROCESSOR_ENTITY,
        acceptedAt: args.acceptedAt,
        acceptedByUserId: args.acceptedByUserId,
        acceptedByEmail: args.acceptedByEmail,
        customerLegalEntityName: args.customerLegalEntityName,
        signatoryName: args.signatoryName,
        signatoryTitle: args.signatoryTitle,
        signedFileId: args.signedFileId
    };
};

//# sourceMappingURL=build-dpa-agreement-record.util.js.map