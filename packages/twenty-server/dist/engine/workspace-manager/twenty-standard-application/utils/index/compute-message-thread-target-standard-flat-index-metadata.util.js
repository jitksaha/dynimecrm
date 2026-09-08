"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "buildMessageThreadTargetStandardFlatIndexMetadatas", {
    enumerable: true,
    get: function() {
        return buildMessageThreadTargetStandardFlatIndexMetadatas;
    }
});
const _buildstandardtargetflatindexmetadatasutil = require("./build-standard-target-flat-index-metadatas.util");
const buildMessageThreadTargetStandardFlatIndexMetadatas = (args)=>{
    const indexes = (0, _buildstandardtargetflatindexmetadatasutil.buildStandardTargetFlatIndexMetadatas)({
        args,
        fieldNames: {
            parent: 'messageThread',
            person: 'targetPerson',
            company: 'targetCompany',
            opportunity: 'targetOpportunity'
        },
        indexNames: {
            parentIdIndex: 'messageThreadIdIndex',
            personIdIndex: 'personIdIndex',
            companyIdIndex: 'companyIdIndex',
            opportunityIdIndex: 'opportunityIdIndex',
            personUniqueIndex: 'messageThreadPersonUniqueIndex',
            companyUniqueIndex: 'messageThreadCompanyUniqueIndex',
            opportunityUniqueIndex: 'messageThreadOpportunityUniqueIndex'
        }
    });
    return {
        messageThreadIdIndex: indexes.parentIdIndex,
        personIdIndex: indexes.personIdIndex,
        companyIdIndex: indexes.companyIdIndex,
        opportunityIdIndex: indexes.opportunityIdIndex,
        messageThreadPersonUniqueIndex: indexes.personUniqueIndex,
        messageThreadCompanyUniqueIndex: indexes.companyUniqueIndex,
        messageThreadOpportunityUniqueIndex: indexes.opportunityUniqueIndex
    };
};

//# sourceMappingURL=compute-message-thread-target-standard-flat-index-metadata.util.js.map