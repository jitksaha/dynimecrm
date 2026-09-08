"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "ViewFilterService", {
    enumerable: true,
    get: function() {
        return ViewFilterService;
    }
});
const _common = require("@nestjs/common");
const _utils = require("twenty-shared/utils");
const _typeorm = require("typeorm");
const _applicationservice = require("../../../core-modules/application/application.service");
const _workspacemanyorallflatentitymapscacheservice = require("../../flat-entity/services/workspace-many-or-all-flat-entity-maps-cache.service");
const _findflatentitybyidinflatentitymapsorthrowutil = require("../../flat-entity/utils/find-flat-entity-by-id-in-flat-entity-maps-or-throw.util");
const _findflatentitybyuniversalidentifierorthrowutil = require("../../flat-entity/utils/find-flat-entity-by-universal-identifier-or-throw.util");
const _fromcreateviewfilterinputtoflatviewfiltertocreateutil = require("../../flat-view-filter/utils/from-create-view-filter-input-to-flat-view-filter-to-create.util");
const _fromdeleteviewfilterinputtoflatviewfilterorthrowutil = require("../../flat-view-filter/utils/from-delete-view-filter-input-to-flat-view-filter-or-throw.util");
const _fromdestroyviewfilterinputtoflatviewfilterorthrowutil = require("../../flat-view-filter/utils/from-destroy-view-filter-input-to-flat-view-filter-or-throw.util");
const _fromupdateviewfilterinputtoflatviewfiltertoupdateorthrowutil = require("../../flat-view-filter/utils/from-update-view-filter-input-to-flat-view-filter-to-update-or-throw.util");
const _paginatemetadataordereditemsutil = require("../../pagination/utils/paginate-metadata-ordered-items.util");
const _viewfilterentity = require("../entities/view-filter.entity");
const _fromflatviewfiltertoviewfilterdtoutil = require("../utils/from-flat-view-filter-to-view-filter-dto.util");
const _injectworkspacescopedrepositorydecorator = require("../../../twenty-orm/workspace-scoped-repository/inject-workspace-scoped-repository.decorator");
const _workspacescopedrepository = require("../../../twenty-orm/workspace-scoped-repository/workspace-scoped-repository");
const _workspacemigrationbuilderexception = require("../../../workspace-manager/workspace-migration/exceptions/workspace-migration-builder-exception");
const _workspacemigrationvalidatebuildandrunservice = require("../../../workspace-manager/workspace-migration/services/workspace-migration-validate-build-and-run-service");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
function _ts_param(paramIndex, decorator) {
    return function(target, key) {
        decorator(target, key, paramIndex);
    };
}
let ViewFilterService = class ViewFilterService {
    async createOne({ createViewFilterInput, workspaceId }) {
        const { workspaceCustomFlatApplication } = await this.applicationService.findWorkspaceTwentyStandardAndCustomApplicationOrThrow({
            workspaceId
        });
        const { flatFieldMetadataMaps, flatViewMaps, flatViewFilterGroupMaps } = await this.flatEntityMapsCacheService.getOrRecomputeManyOrAllFlatEntityMaps({
            workspaceId,
            flatMapsKeys: [
                'flatFieldMetadataMaps',
                'flatViewMaps',
                'flatViewFilterGroupMaps'
            ]
        });
        const flatViewFilterToCreate = (0, _fromcreateviewfilterinputtoflatviewfiltertocreateutil.fromCreateViewFilterInputToFlatViewFilterToCreate)({
            createViewFilterInput,
            flatApplication: workspaceCustomFlatApplication,
            flatFieldMetadataMaps,
            flatViewMaps,
            flatViewFilterGroupMaps
        });
        const buildAndRunResult = await this.workspaceMigrationValidateBuildAndRunService.validateBuildAndRunWorkspaceMigration({
            allFlatEntityOperationByMetadataName: {
                viewFilter: {
                    flatEntityToCreate: [
                        flatViewFilterToCreate
                    ],
                    flatEntityToDelete: [],
                    flatEntityToUpdate: []
                }
            },
            workspaceId,
            isSystemBuild: false,
            applicationUniversalIdentifier: workspaceCustomFlatApplication.universalIdentifier
        });
        if (buildAndRunResult.status === 'fail') {
            throw new _workspacemigrationbuilderexception.WorkspaceMigrationBuilderException(buildAndRunResult, 'Multiple validation errors occurred while creating view filter');
        }
        const { flatViewFilterMaps: recomputedExistingFlatViewFilterMaps } = await this.flatEntityMapsCacheService.getOrRecomputeManyOrAllFlatEntityMaps({
            workspaceId,
            flatMapsKeys: [
                'flatViewFilterMaps'
            ]
        });
        return (0, _fromflatviewfiltertoviewfilterdtoutil.fromFlatViewFilterToViewFilterDto)((0, _findflatentitybyidinflatentitymapsorthrowutil.findFlatEntityByIdInFlatEntityMapsOrThrow)({
            flatEntityId: flatViewFilterToCreate.id,
            flatEntityMaps: recomputedExistingFlatViewFilterMaps
        }));
    }
    async updateOne({ updateViewFilterInput, workspaceId }) {
        const { workspaceCustomFlatApplication } = await this.applicationService.findWorkspaceTwentyStandardAndCustomApplicationOrThrow({
            workspaceId
        });
        const { flatViewFilterMaps: existingFlatViewFilterMaps, flatFieldMetadataMaps: existingFlatFieldMetadataMaps, flatViewFilterGroupMaps: existingFlatViewFilterGroupMaps } = await this.flatEntityMapsCacheService.getOrRecomputeManyOrAllFlatEntityMaps({
            workspaceId,
            flatMapsKeys: [
                'flatViewFilterMaps',
                'flatFieldMetadataMaps',
                'flatViewFilterGroupMaps'
            ]
        });
        const optimisticallyUpdatedFlatViewFilter = (0, _fromupdateviewfilterinputtoflatviewfiltertoupdateorthrowutil.fromUpdateViewFilterInputToFlatViewFilterToUpdateOrThrow)({
            flatViewFilterMaps: existingFlatViewFilterMaps,
            updateViewFilterInput,
            flatFieldMetadataMaps: existingFlatFieldMetadataMaps,
            flatViewFilterGroupMaps: existingFlatViewFilterGroupMaps
        });
        const validateAndBuildResult = await this.workspaceMigrationValidateBuildAndRunService.validateBuildAndRunWorkspaceMigration({
            allFlatEntityOperationByMetadataName: {
                viewFilter: {
                    flatEntityToCreate: [],
                    flatEntityToDelete: [],
                    flatEntityToUpdate: [
                        optimisticallyUpdatedFlatViewFilter
                    ]
                }
            },
            workspaceId,
            isSystemBuild: false,
            applicationUniversalIdentifier: workspaceCustomFlatApplication.universalIdentifier
        });
        if (validateAndBuildResult.status === 'fail') {
            throw new _workspacemigrationbuilderexception.WorkspaceMigrationBuilderException(validateAndBuildResult, 'Multiple validation errors occurred while updating view filter');
        }
        const { flatViewFilterMaps: recomputedExistingFlatViewFilterMaps } = await this.flatEntityMapsCacheService.getOrRecomputeManyOrAllFlatEntityMaps({
            workspaceId,
            flatMapsKeys: [
                'flatViewFilterMaps'
            ]
        });
        return (0, _fromflatviewfiltertoviewfilterdtoutil.fromFlatViewFilterToViewFilterDto)((0, _findflatentitybyuniversalidentifierorthrowutil.findFlatEntityByUniversalIdentifierOrThrow)({
            universalIdentifier: optimisticallyUpdatedFlatViewFilter.universalIdentifier,
            flatEntityMaps: recomputedExistingFlatViewFilterMaps
        }));
    }
    async deleteOne({ deleteViewFilterInput, workspaceId }) {
        const { workspaceCustomFlatApplication } = await this.applicationService.findWorkspaceTwentyStandardAndCustomApplicationOrThrow({
            workspaceId
        });
        const { flatViewFilterMaps: existingFlatViewFilterMaps } = await this.flatEntityMapsCacheService.getOrRecomputeManyOrAllFlatEntityMaps({
            workspaceId,
            flatMapsKeys: [
                'flatViewFilterMaps'
            ]
        });
        const optimisticallyUpdatedFlatViewFilterWithDeletedAt = (0, _fromdeleteviewfilterinputtoflatviewfilterorthrowutil.fromDeleteViewFilterInputToFlatViewFilterOrThrow)({
            flatViewFilterMaps: existingFlatViewFilterMaps,
            deleteViewFilterInput
        });
        const validateAndBuildResult = await this.workspaceMigrationValidateBuildAndRunService.validateBuildAndRunWorkspaceMigration({
            allFlatEntityOperationByMetadataName: {
                viewFilter: {
                    flatEntityToCreate: [],
                    flatEntityToDelete: [],
                    flatEntityToUpdate: [
                        optimisticallyUpdatedFlatViewFilterWithDeletedAt
                    ]
                }
            },
            workspaceId,
            isSystemBuild: false,
            applicationUniversalIdentifier: workspaceCustomFlatApplication.universalIdentifier
        });
        if (validateAndBuildResult.status === 'fail') {
            throw new _workspacemigrationbuilderexception.WorkspaceMigrationBuilderException(validateAndBuildResult, 'Multiple validation errors occurred while deleting view filter');
        }
        const { flatViewFilterMaps: recomputedExistingFlatViewFilterMaps } = await this.flatEntityMapsCacheService.getOrRecomputeManyOrAllFlatEntityMaps({
            workspaceId,
            flatMapsKeys: [
                'flatViewFilterMaps'
            ]
        });
        return (0, _fromflatviewfiltertoviewfilterdtoutil.fromFlatViewFilterToViewFilterDto)((0, _findflatentitybyuniversalidentifierorthrowutil.findFlatEntityByUniversalIdentifierOrThrow)({
            universalIdentifier: optimisticallyUpdatedFlatViewFilterWithDeletedAt.universalIdentifier,
            flatEntityMaps: recomputedExistingFlatViewFilterMaps
        }));
    }
    async destroyOne({ destroyViewFilterInput, workspaceId }) {
        const { workspaceCustomFlatApplication } = await this.applicationService.findWorkspaceTwentyStandardAndCustomApplicationOrThrow({
            workspaceId
        });
        const { flatViewFilterMaps: existingFlatViewFilterMaps } = await this.flatEntityMapsCacheService.getOrRecomputeManyOrAllFlatEntityMaps({
            workspaceId,
            flatMapsKeys: [
                'flatViewFilterMaps'
            ]
        });
        const existingViewFilterToDelete = (0, _fromdestroyviewfilterinputtoflatviewfilterorthrowutil.fromDestroyViewFilterInputToFlatViewFilterOrThrow)({
            destroyViewFilterInput,
            flatViewFilterMaps: existingFlatViewFilterMaps
        });
        const existingFlatViewFilter = (0, _findflatentitybyuniversalidentifierorthrowutil.findFlatEntityByUniversalIdentifierOrThrow)({
            universalIdentifier: existingViewFilterToDelete.universalIdentifier,
            flatEntityMaps: existingFlatViewFilterMaps
        });
        const validateAndBuildResult = await this.workspaceMigrationValidateBuildAndRunService.validateBuildAndRunWorkspaceMigration({
            allFlatEntityOperationByMetadataName: {
                viewFilter: {
                    flatEntityToCreate: [],
                    flatEntityToDelete: [
                        existingViewFilterToDelete
                    ],
                    flatEntityToUpdate: []
                }
            },
            workspaceId,
            isSystemBuild: false,
            applicationUniversalIdentifier: workspaceCustomFlatApplication.universalIdentifier
        });
        if (validateAndBuildResult.status === 'fail') {
            throw new _workspacemigrationbuilderexception.WorkspaceMigrationBuilderException(validateAndBuildResult, 'Multiple validation errors occurred while destroying view filter');
        }
        return (0, _fromflatviewfiltertoviewfilterdtoutil.fromFlatViewFilterToViewFilterDto)({
            ...existingFlatViewFilter,
            deletedAt: new Date().toISOString()
        });
    }
    async findByWorkspaceId(workspaceId) {
        return this.viewFilterRepository.find(workspaceId, {
            where: {
                deletedAt: (0, _typeorm.IsNull)()
            },
            order: {
                positionInViewFilterGroup: 'ASC',
                id: 'ASC'
            },
            relations: [
                'workspace',
                'view',
                'viewFilterGroup'
            ]
        });
    }
    async findManyPaginated({ workspaceId, viewId, pagination }) {
        const { flatViewFilterMaps } = await this.flatEntityMapsCacheService.getOrRecomputeManyOrAllFlatEntityMaps({
            workspaceId,
            flatMapsKeys: [
                'flatViewFilterMaps'
            ]
        });
        const flatViewFilters = Object.values(flatViewFilterMaps.byUniversalIdentifier).filter(_utils.isDefined).filter((flatViewFilter)=>flatViewFilter.workspaceId === workspaceId && flatViewFilter.deletedAt === null && (!(0, _utils.isDefined)(viewId) || flatViewFilter.viewId === viewId)).sort((first, second)=>(first.positionInViewFilterGroup ?? Number.POSITIVE_INFINITY) - (second.positionInViewFilterGroup ?? Number.POSITIVE_INFINITY) || first.id.localeCompare(second.id));
        const page = (0, _paginatemetadataordereditemsutil.paginateMetadataOrderedItems)({
            items: flatViewFilters,
            pagination
        });
        return {
            ...page,
            items: page.items.map(_fromflatviewfiltertoviewfilterdtoutil.fromFlatViewFilterToViewFilterDto),
            totalCount: flatViewFilters.length
        };
    }
    async findByViewId(workspaceId, viewId) {
        return this.viewFilterRepository.find(workspaceId, {
            where: {
                viewId,
                deletedAt: (0, _typeorm.IsNull)()
            },
            order: {
                positionInViewFilterGroup: 'ASC',
                id: 'ASC'
            },
            relations: [
                'workspace',
                'view',
                'viewFilterGroup'
            ]
        });
    }
    async findById(id, workspaceId) {
        const viewFilter = await this.viewFilterRepository.findOne(workspaceId, {
            where: {
                id,
                deletedAt: (0, _typeorm.IsNull)()
            },
            relations: [
                'workspace',
                'view',
                'viewFilterGroup'
            ]
        });
        return viewFilter || null;
    }
    constructor(viewFilterRepository, workspaceMigrationValidateBuildAndRunService, flatEntityMapsCacheService, applicationService){
        this.viewFilterRepository = viewFilterRepository;
        this.workspaceMigrationValidateBuildAndRunService = workspaceMigrationValidateBuildAndRunService;
        this.flatEntityMapsCacheService = flatEntityMapsCacheService;
        this.applicationService = applicationService;
    }
};
ViewFilterService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_param(0, (0, _injectworkspacescopedrepositorydecorator.InjectWorkspaceScopedRepository)(_viewfilterentity.ViewFilterEntity)),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _workspacescopedrepository.WorkspaceScopedRepository === "undefined" ? Object : _workspacescopedrepository.WorkspaceScopedRepository,
        typeof _workspacemigrationvalidatebuildandrunservice.WorkspaceMigrationValidateBuildAndRunService === "undefined" ? Object : _workspacemigrationvalidatebuildandrunservice.WorkspaceMigrationValidateBuildAndRunService,
        typeof _workspacemanyorallflatentitymapscacheservice.WorkspaceManyOrAllFlatEntityMapsCacheService === "undefined" ? Object : _workspacemanyorallflatentitymapscacheservice.WorkspaceManyOrAllFlatEntityMapsCacheService,
        typeof _applicationservice.ApplicationService === "undefined" ? Object : _applicationservice.ApplicationService
    ])
], ViewFilterService);

//# sourceMappingURL=view-filter.service.js.map