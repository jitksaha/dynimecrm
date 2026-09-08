"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "CompleteViewUpsertService", {
    enumerable: true,
    get: function() {
        return CompleteViewUpsertService;
    }
});
const _common = require("@nestjs/common");
const _core = require("@lingui/core");
const _types = require("twenty-shared/types");
const _utils = require("twenty-shared/utils");
const _applicationservice = require("../../../../core-modules/application/application.service");
const _workspacemanyorallflatentitymapscacheservice = require("../../../flat-entity/services/workspace-many-or-all-flat-entity-maps-cache.service");
const _buildcompleteviewchildrenflatoperationsutil = require("../../../flat-view/utils/build-complete-view-children-flat-operations.util");
const _fromcreateviewinputtoflatviewtocreateutil = require("../../../flat-view/utils/from-create-view-input-to-flat-view-to-create.util");
const _fromupdateviewinputtoflatviewtoupdateorthrowutil = require("../../../flat-view/utils/from-update-view-input-to-flat-view-to-update-or-throw.util");
const _viewexception = require("../../exceptions/view.exception");
const _viewservice = require("../../services/view.service");
const _workspacemigrationbuilderexception = require("../../../../workspace-manager/workspace-migration/exceptions/workspace-migration-builder-exception");
const _workspacemigrationvalidatebuildandrunservice = require("../../../../workspace-manager/workspace-migration/services/workspace-migration-validate-build-and-run-service");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let CompleteViewUpsertService = class CompleteViewUpsertService {
    async upsertCompleteView({ workspaceId, userWorkspaceId, existingViewId, objectMetadataId, name, icon, type, visibility, mainGroupByFieldMetadataId, kanbanAggregateOperation, kanbanAggregateOperationFieldMetadataId, calendarLayout, calendarFieldMetadataId, calendarEndFieldMetadataId, fields, filters, sorts }) {
        const { workspaceCustomFlatApplication } = await this.applicationService.findWorkspaceTwentyStandardAndCustomApplicationOrThrow({
            workspaceId
        });
        const applicationUniversalIdentifier = workspaceCustomFlatApplication.universalIdentifier;
        const { flatFieldMetadataMaps, flatObjectMetadataMaps, flatViewMaps, flatViewGroupMaps, flatViewFieldMaps, flatViewFilterMaps, flatViewSortMaps, flatViewFieldGroupMaps, flatViewFilterGroupMaps } = await this.flatEntityMapsCacheService.getOrRecomputeManyOrAllFlatEntityMaps({
            workspaceId,
            flatMapsKeys: [
                'flatFieldMetadataMaps',
                'flatObjectMetadataMaps',
                'flatViewMaps',
                'flatViewGroupMaps',
                'flatViewFieldMaps',
                'flatViewFilterMaps',
                'flatViewSortMaps',
                'flatViewFieldGroupMaps',
                'flatViewFilterGroupMaps'
            ]
        });
        const isCreatingView = !(0, _utils.isDefined)(existingViewId);
        const rootOperations = (0, _utils.isDefined)(existingViewId) ? this.buildUpdateViewRootOperationsOrThrow({
            existingViewId,
            name,
            icon,
            calendarEndFieldMetadataId,
            userWorkspaceId,
            applicationUniversalIdentifier,
            flatViewMaps,
            flatViewGroupMaps,
            flatFieldMetadataMaps
        }) : this.buildCreateViewRootOperationsOrThrow({
            objectMetadataId,
            name,
            icon,
            type,
            visibility,
            mainGroupByFieldMetadataId,
            kanbanAggregateOperation,
            kanbanAggregateOperationFieldMetadataId,
            calendarLayout,
            calendarFieldMetadataId,
            calendarEndFieldMetadataId,
            userWorkspaceId,
            flatApplication: workspaceCustomFlatApplication,
            flatFieldMetadataMaps,
            flatObjectMetadataMaps
        });
        const { viewId, viewUniversalIdentifier } = rootOperations;
        const flatViewMapsForChildren = isCreatingView && (0, _utils.isDefined)(viewUniversalIdentifier) ? {
            ...flatViewMaps,
            universalIdentifierById: {
                ...flatViewMaps.universalIdentifierById,
                [viewId]: viewUniversalIdentifier
            }
        } : flatViewMaps;
        const childrenOperations = (0, _buildcompleteviewchildrenflatoperationsutil.buildCompleteViewChildrenFlatOperations)({
            viewId,
            flatApplication: workspaceCustomFlatApplication,
            flatFieldMetadataMaps,
            flatViewMaps: flatViewMapsForChildren,
            flatViewFieldMaps,
            flatViewFilterMaps,
            flatViewSortMaps,
            flatViewFieldGroupMaps,
            flatViewFilterGroupMaps,
            fields,
            filters,
            sorts
        });
        const allFlatEntityOperationByMetadataName = {
            ...(0, _utils.isDefined)(rootOperations.view) ? {
                view: rootOperations.view
            } : {},
            ...(0, _utils.isDefined)(rootOperations.viewGroup) ? {
                viewGroup: rootOperations.viewGroup
            } : {},
            ...(0, _utils.isDefined)(childrenOperations.viewField) ? {
                viewField: childrenOperations.viewField
            } : {},
            ...(0, _utils.isDefined)(childrenOperations.viewFilter) ? {
                viewFilter: childrenOperations.viewFilter
            } : {},
            ...(0, _utils.isDefined)(childrenOperations.viewSort) ? {
                viewSort: childrenOperations.viewSort
            } : {}
        };
        const validateAndBuildResult = await this.workspaceMigrationValidateBuildAndRunService.validateBuildAndRunWorkspaceMigration({
            allFlatEntityOperationByMetadataName,
            workspaceId,
            isSystemBuild: false,
            applicationUniversalIdentifier
        });
        if (validateAndBuildResult.status === 'fail') {
            throw new _workspacemigrationbuilderexception.WorkspaceMigrationBuilderException(validateAndBuildResult, 'Multiple validation errors occurred while upserting complete view');
        }
        const view = await this.viewService.findByIdWithRelations(viewId, workspaceId);
        if (!(0, _utils.isDefined)(view)) {
            throw new _viewexception.ViewException(_core.i18n._(/*i18n*/ {
                id: "BHDATQ",
                message: "View not found after upsert"
            }), _viewexception.ViewExceptionCode.VIEW_NOT_FOUND);
        }
        return view;
    }
    buildCreateViewRootOperationsOrThrow({ objectMetadataId, name, icon, type, visibility, mainGroupByFieldMetadataId, kanbanAggregateOperation, kanbanAggregateOperationFieldMetadataId, calendarLayout, calendarFieldMetadataId, calendarEndFieldMetadataId, userWorkspaceId, flatApplication, flatFieldMetadataMaps, flatObjectMetadataMaps }) {
        if (!(0, _utils.isDefined)(objectMetadataId)) {
            throw new _viewexception.ViewException(_core.i18n._(/*i18n*/ {
                id: "UOTni0",
                message: "ObjectMetadataId is required when creating a view"
            }), _viewexception.ViewExceptionCode.INVALID_VIEW_DATA);
        }
        const { flatViewToCreate, flatViewGroupsToCreate } = (0, _fromcreateviewinputtoflatviewtocreateutil.fromCreateViewInputToFlatViewToCreate)({
            createViewInput: {
                name: name ?? 'Untitled view',
                objectMetadataId,
                icon: icon ?? 'IconList',
                type: type ?? _types.ViewType.TABLE,
                visibility: visibility ?? _types.ViewVisibility.WORKSPACE,
                mainGroupByFieldMetadataId,
                kanbanAggregateOperation,
                kanbanAggregateOperationFieldMetadataId,
                calendarLayout,
                calendarFieldMetadataId,
                calendarEndFieldMetadataId
            },
            createdByUserWorkspaceId: userWorkspaceId,
            flatApplication,
            flatFieldMetadataMaps,
            flatObjectMetadataMaps
        });
        return {
            viewId: flatViewToCreate.id,
            viewUniversalIdentifier: flatViewToCreate.universalIdentifier,
            view: {
                flatEntityToCreate: [
                    flatViewToCreate
                ],
                flatEntityToDelete: [],
                flatEntityToUpdate: []
            },
            ...flatViewGroupsToCreate.length > 0 ? {
                viewGroup: {
                    flatEntityToCreate: flatViewGroupsToCreate,
                    flatEntityToDelete: [],
                    flatEntityToUpdate: []
                }
            } : {}
        };
    }
    buildUpdateViewRootOperationsOrThrow({ existingViewId, name, icon, calendarEndFieldMetadataId, userWorkspaceId, applicationUniversalIdentifier, flatViewMaps, flatViewGroupMaps, flatFieldMetadataMaps }) {
        if (!(0, _utils.isDefined)(name) && !(0, _utils.isDefined)(icon) && !(0, _utils.isDefined)(calendarEndFieldMetadataId)) {
            return {
                viewId: existingViewId
            };
        }
        const { flatViewToUpdate, flatViewGroupsToDelete, flatViewGroupsToCreate } = (0, _fromupdateviewinputtoflatviewtoupdateorthrowutil.fromUpdateViewInputToFlatViewToUpdateOrThrow)({
            updateViewInput: {
                id: existingViewId,
                name,
                icon,
                calendarEndFieldMetadataId
            },
            flatViewMaps,
            flatViewGroupMaps,
            flatFieldMetadataMaps,
            userWorkspaceId,
            callerApplicationUniversalIdentifier: applicationUniversalIdentifier,
            workspaceCustomApplicationUniversalIdentifier: applicationUniversalIdentifier
        });
        return {
            viewId: existingViewId,
            view: {
                flatEntityToCreate: [],
                flatEntityToDelete: [],
                flatEntityToUpdate: [
                    flatViewToUpdate
                ]
            },
            ...flatViewGroupsToCreate.length > 0 || flatViewGroupsToDelete.length > 0 ? {
                viewGroup: {
                    flatEntityToCreate: flatViewGroupsToCreate,
                    flatEntityToDelete: flatViewGroupsToDelete,
                    flatEntityToUpdate: []
                }
            } : {}
        };
    }
    constructor(viewService, workspaceMigrationValidateBuildAndRunService, flatEntityMapsCacheService, applicationService){
        this.viewService = viewService;
        this.workspaceMigrationValidateBuildAndRunService = workspaceMigrationValidateBuildAndRunService;
        this.flatEntityMapsCacheService = flatEntityMapsCacheService;
        this.applicationService = applicationService;
    }
};
CompleteViewUpsertService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _viewservice.ViewService === "undefined" ? Object : _viewservice.ViewService,
        typeof _workspacemigrationvalidatebuildandrunservice.WorkspaceMigrationValidateBuildAndRunService === "undefined" ? Object : _workspacemigrationvalidatebuildandrunservice.WorkspaceMigrationValidateBuildAndRunService,
        typeof _workspacemanyorallflatentitymapscacheservice.WorkspaceManyOrAllFlatEntityMapsCacheService === "undefined" ? Object : _workspacemanyorallflatentitymapscacheservice.WorkspaceManyOrAllFlatEntityMapsCacheService,
        typeof _applicationservice.ApplicationService === "undefined" ? Object : _applicationservice.ApplicationService
    ])
], CompleteViewUpsertService);

//# sourceMappingURL=complete-view-upsert.service.js.map