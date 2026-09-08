"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "aggregateOrchestratorActionsReportDeprioritizeTsVectorCreateFieldActions", {
    enumerable: true,
    get: function() {
        return aggregateOrchestratorActionsReportDeprioritizeTsVectorCreateFieldActions;
    }
});
const _types = require("twenty-shared/types");
const aggregateOrchestratorActionsReportDeprioritizeTsVectorCreateFieldActions = ({ orchestratorActionsReport })=>{
    const createFieldActions = orchestratorActionsReport.fieldMetadata.create;
    const tsVectorCreateFieldActions = createFieldActions.filter((createFieldAction)=>createFieldAction.flatEntity.type === _types.FieldMetadataType.TS_VECTOR);
    if (tsVectorCreateFieldActions.length === 0) {
        return orchestratorActionsReport;
    }
    const otherCreateFieldActions = createFieldActions.filter((createFieldAction)=>createFieldAction.flatEntity.type !== _types.FieldMetadataType.TS_VECTOR);
    return {
        ...orchestratorActionsReport,
        fieldMetadata: {
            ...orchestratorActionsReport.fieldMetadata,
            create: [
                ...otherCreateFieldActions,
                ...tsVectorCreateFieldActions
            ]
        }
    };
};

//# sourceMappingURL=aggregate-orchestrator-actions-report-deprioritize-ts-vector-create-field-actions.util.js.map