"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "crossEntityTransversalValidation", {
    enumerable: true,
    get: function() {
        return crossEntityTransversalValidation;
    }
});
const _validatenavigationmenuitempagelayoutreferencecrossentityutil = require("../../../metadata-modules/flat-navigation-menu-item/validators/utils/validate-navigation-menu-item-page-layout-reference-cross-entity.util");
const _validateobjectmetadatacrossentityutil = require("../../../metadata-modules/flat-object-metadata/validators/utils/validate-object-metadata-cross-entity.util");
const _validatepermissionflagnotinusecrossentityutil = require("../../../metadata-modules/flat-permission-flag/validators/utils/validate-permission-flag-not-in-use-cross-entity.util");
const _validateviewfieldlabelidentifiercrossentityutil = require("../../../metadata-modules/flat-view-field/validators/utils/validate-view-field-label-identifier-cross-entity.util");
const _emptyorchestratorfailurereportconstant = require("../constant/empty-orchestrator-failure-report.constant");
const _validateuniversalidentifiercrossentityuniquenessthroughreportmutationutil = require("./validate-universal-identifier-cross-entity-uniqueness-through-report-mutation.util");
const crossEntityTransversalValidation = ({ optimisticUniversalFlatMaps, orchestratorActionsReport, preDeletionFlatViewFieldMaps })=>{
    const crossEntityFailureReport = (0, _emptyorchestratorfailurereportconstant.EMPTY_ORCHESTRATOR_FAILURE_REPORT)();
    const { objectMetadata } = (0, _validateobjectmetadatacrossentityutil.validateObjectMetadataCrossEntity)({
        optimisticUniversalFlatMaps,
        orchestratorActionsReport
    });
    const { viewField } = (0, _validateviewfieldlabelidentifiercrossentityutil.validateViewFieldLabelIdentifierCrossEntity)({
        optimisticUniversalFlatMaps,
        deletedViewFieldActions: orchestratorActionsReport.viewField.delete,
        preDeletionFlatViewFieldMaps
    });
    const { permissionFlag } = (0, _validatepermissionflagnotinusecrossentityutil.validatePermissionFlagNotInUseCrossEntity)({
        optimisticUniversalFlatMaps,
        deletedPermissionFlagActions: orchestratorActionsReport.permissionFlag.delete
    });
    const { navigationMenuItem } = (0, _validatenavigationmenuitempagelayoutreferencecrossentityutil.validateNavigationMenuItemPageLayoutReferenceCrossEntity)({
        optimisticUniversalFlatMaps,
        orchestratorActionsReport
    });
    crossEntityFailureReport.objectMetadata.push(...objectMetadata);
    crossEntityFailureReport.viewField.push(...viewField);
    crossEntityFailureReport.permissionFlag.push(...permissionFlag);
    crossEntityFailureReport.navigationMenuItem.push(...navigationMenuItem);
    (0, _validateuniversalidentifiercrossentityuniquenessthroughreportmutationutil.validateUniversalIdentifierCrossEntityUniquenessThroughReportMutation)({
        optimisticUniversalFlatMaps,
        orchestratorActionsReport,
        orchestratorFailureReport: crossEntityFailureReport
    });
    return crossEntityFailureReport;
};

//# sourceMappingURL=cross-entity-transversal-validation.util.js.map