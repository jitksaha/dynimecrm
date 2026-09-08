"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "computeStandardOpportunityViews", {
    enumerable: true,
    get: function() {
        return computeStandardOpportunityViews;
    }
});
const _i18nlabelutil = require("../i18n-label.util");
const _types = require("twenty-shared/types");
const _indexviewnameconstant = require("../../../../metadata-modules/view/constants/index-view-name.constant");
const _createstandardviewflatmetadatautil = require("./create-standard-view-flat-metadata.util");
const computeStandardOpportunityViews = (args)=>{
    return {
        allOpportunities: (0, _createstandardviewflatmetadatautil.createStandardViewFlatMetadata)({
            ...args,
            objectName: 'opportunity',
            context: {
                viewName: 'allOpportunities',
                name: _indexviewnameconstant.INDEX_VIEW_NAME,
                type: _types.ViewType.TABLE,
                key: _types.ViewKey.INDEX,
                position: 0,
                icon: 'IconTable'
            }
        }),
        byStage: (0, _createstandardviewflatmetadatautil.createStandardViewFlatMetadata)({
            ...args,
            objectName: 'opportunity',
            context: {
                viewName: 'byStage',
                name: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                    id: "Q6cUtT",
                    message: "By Stage"
                }),
                type: _types.ViewType.KANBAN,
                key: null,
                position: 2,
                icon: 'IconLayoutKanban',
                mainGroupByFieldName: 'stage',
                kanbanAggregateOperation: _types.AggregateOperations.SUM,
                kanbanAggregateOperationFieldName: 'amount'
            }
        }),
        opportunityRecordPageFields: (0, _createstandardviewflatmetadatautil.createStandardViewFlatMetadata)({
            ...args,
            objectName: 'opportunity',
            context: {
                viewName: 'opportunityRecordPageFields',
                name: 'Opportunity Record Page Fields',
                type: _types.ViewType.FIELDS_WIDGET,
                key: null,
                position: 0,
                icon: 'IconListDetails'
            }
        })
    };
};

//# sourceMappingURL=compute-standard-opportunity-views.util.js.map