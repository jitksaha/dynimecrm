"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "buildStandardTargetFlatIndexMetadatas", {
    enumerable: true,
    get: function() {
        return buildStandardTargetFlatIndexMetadatas;
    }
});
const _createstandardindexflatmetadatautil = require("./create-standard-index-flat-metadata.util");
const buildStandardTargetFlatIndexMetadatas = ({ args, fieldNames, indexNames })=>({
        parentIdIndex: (0, _createstandardindexflatmetadatautil.createStandardIndexFlatMetadata)({
            ...args,
            context: {
                indexName: indexNames.parentIdIndex,
                relatedFieldNames: [
                    fieldNames.parent
                ]
            }
        }),
        personIdIndex: (0, _createstandardindexflatmetadatautil.createStandardIndexFlatMetadata)({
            ...args,
            context: {
                indexName: indexNames.personIdIndex,
                relatedFieldNames: [
                    fieldNames.person
                ]
            }
        }),
        companyIdIndex: (0, _createstandardindexflatmetadatautil.createStandardIndexFlatMetadata)({
            ...args,
            context: {
                indexName: indexNames.companyIdIndex,
                relatedFieldNames: [
                    fieldNames.company
                ]
            }
        }),
        opportunityIdIndex: (0, _createstandardindexflatmetadatautil.createStandardIndexFlatMetadata)({
            ...args,
            context: {
                indexName: indexNames.opportunityIdIndex,
                relatedFieldNames: [
                    fieldNames.opportunity
                ]
            }
        }),
        personUniqueIndex: (0, _createstandardindexflatmetadatautil.createStandardIndexFlatMetadata)({
            ...args,
            context: {
                indexName: indexNames.personUniqueIndex,
                relatedFieldNames: [
                    fieldNames.parent,
                    fieldNames.person
                ],
                isUnique: true,
                indexWhereClause: '"deletedAt" IS NULL'
            }
        }),
        companyUniqueIndex: (0, _createstandardindexflatmetadatautil.createStandardIndexFlatMetadata)({
            ...args,
            context: {
                indexName: indexNames.companyUniqueIndex,
                relatedFieldNames: [
                    fieldNames.parent,
                    fieldNames.company
                ],
                isUnique: true,
                indexWhereClause: '"deletedAt" IS NULL'
            }
        }),
        opportunityUniqueIndex: (0, _createstandardindexflatmetadatautil.createStandardIndexFlatMetadata)({
            ...args,
            context: {
                indexName: indexNames.opportunityUniqueIndex,
                relatedFieldNames: [
                    fieldNames.parent,
                    fieldNames.opportunity
                ],
                isUnique: true,
                indexWhereClause: '"deletedAt" IS NULL'
            }
        })
    });

//# sourceMappingURL=build-standard-target-flat-index-metadatas.util.js.map