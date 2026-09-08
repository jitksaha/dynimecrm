"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "aggregateOrchestratorActionsReportDeprioritizeSearchVectorUpdateFieldActions", {
    enumerable: true,
    get: function() {
        return aggregateOrchestratorActionsReportDeprioritizeSearchVectorUpdateFieldActions;
    }
});
const _utils = require("twenty-shared/utils");
const _findflatentitybyuniversalidentifierorthrowutil = require("../../../metadata-modules/flat-entity/utils/find-flat-entity-by-universal-identifier-or-throw.util");
const _searchvectorfieldconstants = require("../../../metadata-modules/search-field-metadata/constants/search-vector-field.constants");
const _workspacemigrationactiontypeconstant = require("../workspace-migration-builder/constants/workspace-migration-action-type.constant");
const aggregateOrchestratorActionsReportDeprioritizeSearchVectorUpdateFieldActions = ({ orchestratorActionsReport, flatFieldMetadataMaps, searchVectorUniversalIdentifiersToRebuild })=>{
    (0, _utils.assertIsDefinedOrThrow)(flatFieldMetadataMaps);
    const rebuildTargetUniversalIdentifiers = searchVectorUniversalIdentifiersToRebuild ?? new Set();
    const coveredVectorUniversalIdentifiers = new Set();
    const updateFieldActions = orchestratorActionsReport.fieldMetadata.update;
    const { searchVectorUpdateFieldActions, otherUpdateFieldActions } = updateFieldActions.reduce((acc, updateFieldAction)=>{
        const flatFieldMetadata = (0, _findflatentitybyuniversalidentifierorthrowutil.findFlatEntityByUniversalIdentifierOrThrow)({
            flatEntityMaps: flatFieldMetadataMaps,
            universalIdentifier: updateFieldAction.universalIdentifier
        });
        const isSearchVectorUpdateFieldAction = flatFieldMetadata.name === _searchvectorfieldconstants.SEARCH_VECTOR_FIELD.name;
        if (isSearchVectorUpdateFieldAction) {
            coveredVectorUniversalIdentifiers.add(updateFieldAction.universalIdentifier);
            const searchVectorUpdateFieldAction = rebuildTargetUniversalIdentifiers.has(updateFieldAction.universalIdentifier) ? {
                ...updateFieldAction,
                rebuildSearchVector: true
            } : updateFieldAction;
            return {
                ...acc,
                searchVectorUpdateFieldActions: [
                    ...acc.searchVectorUpdateFieldActions,
                    searchVectorUpdateFieldAction
                ]
            };
        }
        return {
            ...acc,
            otherUpdateFieldActions: [
                ...acc.otherUpdateFieldActions,
                updateFieldAction
            ]
        };
    }, {
        searchVectorUpdateFieldActions: [],
        otherUpdateFieldActions: []
    });
    const synthesizedSearchVectorUpdateFieldActions = [
        ...rebuildTargetUniversalIdentifiers
    ].flatMap((vectorUniversalIdentifier)=>coveredVectorUniversalIdentifiers.has(vectorUniversalIdentifier) ? [] : [
            {
                type: _workspacemigrationactiontypeconstant.WORKSPACE_MIGRATION_ACTION_TYPE.update,
                metadataName: 'fieldMetadata',
                universalIdentifier: vectorUniversalIdentifier,
                update: {},
                rebuildSearchVector: true
            }
        ]);
    return {
        ...orchestratorActionsReport,
        fieldMetadata: {
            ...orchestratorActionsReport.fieldMetadata,
            update: [
                ...otherUpdateFieldActions,
                ...searchVectorUpdateFieldActions,
                ...synthesizedSearchVectorUpdateFieldActions
            ]
        }
    };
};

//# sourceMappingURL=aggregate-orchestrator-actions-report-deprioritize-search-vector-update-field-actions.util.js.map