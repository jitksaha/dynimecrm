"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _testing = require("@nestjs/testing");
const _types = require("twenty-shared/types");
const _applicationservice = require("../../../../core-modules/application/application.service");
const _createemptyallflatentitymapsconstant = require("../../../flat-entity/constant/create-empty-all-flat-entity-maps.constant");
const _workspacemanyorallflatentitymapscacheservice = require("../../../flat-entity/services/workspace-many-or-all-flat-entity-maps-cache.service");
const _addflatentitytoflatentitymapsorthrowutil = require("../../../flat-entity/utils/add-flat-entity-to-flat-entity-maps-or-throw.util");
const _pagelayoutresetservice = require("../page-layout-reset.service");
const _viewservice = require("../../../view/services/view.service");
const _twentystandardapplications = require("../../../../workspace-manager/twenty-standard-application/constants/twenty-standard-applications");
const _workspacemigrationvalidatebuildandrunservice = require("../../../../workspace-manager/workspace-migration/services/workspace-migration-validate-build-and-run-service");
const _dashboardsyncservice = require("../../../../../modules/dashboard-sync/services/dashboard-sync.service");
const WORKSPACE_CUSTOM_APPLICATION_UNIVERSAL_IDENTIFIER = 'workspace-custom-application';
describe('PageLayoutResetService', ()=>{
    it.each([
        {
            source: 'standard layout',
            applicationUniversalIdentifier: _twentystandardapplications.TWENTY_STANDARD_APPLICATION.universalIdentifier,
            isSystemSideEffect: false
        },
        {
            source: 'app-provided layout',
            applicationUniversalIdentifier: 'installed-application',
            isSystemSideEffect: false
        },
        {
            source: 'generated layout for a custom object',
            applicationUniversalIdentifier: WORKSPACE_CUSTOM_APPLICATION_UNIVERSAL_IDENTIFIER,
            isSystemSideEffect: true
        }
    ])('restores the default pin state when resetting the $source', async ({ applicationUniversalIdentifier, isSystemSideEffect })=>{
        const layout = {
            id: 'page-layout-id',
            universalIdentifier: 'page-layout-universal-identifier',
            applicationId: 'application-id',
            applicationUniversalIdentifier,
            workspaceId: 'workspace-id',
            name: 'Record page',
            type: _types.PageLayoutType.RECORD_PAGE,
            objectMetadataId: null,
            objectMetadataUniversalIdentifier: null,
            defaultTabToFocusOnMobileAndSidePanelId: null,
            defaultTabToFocusOnMobileAndSidePanelUniversalIdentifier: null,
            tabIds: [],
            tabUniversalIdentifiers: [],
            isSystemSideEffect,
            isFirstTabPinned: false,
            createdAt: '2026-08-27T00:00:00.000Z',
            updatedAt: '2026-08-27T00:00:00.000Z',
            deletedAt: null
        };
        const allFlatEntityMaps = (0, _createemptyallflatentitymapsconstant.createEmptyAllFlatEntityMaps)();
        allFlatEntityMaps.flatPageLayoutMaps = (0, _addflatentitytoflatentitymapsorthrowutil.addFlatEntityToFlatEntityMapsOrThrow)({
            flatEntity: layout,
            flatEntityMaps: allFlatEntityMaps.flatPageLayoutMaps
        });
        const validateBuildAndRunWorkspaceMigration = jest.fn().mockResolvedValue({
            status: 'success'
        });
        const module = await _testing.Test.createTestingModule({
            providers: [
                _pagelayoutresetservice.PageLayoutResetService,
                {
                    provide: _workspacemigrationvalidatebuildandrunservice.WorkspaceMigrationValidateBuildAndRunService,
                    useValue: {
                        validateBuildAndRunWorkspaceMigration
                    }
                },
                {
                    provide: _workspacemanyorallflatentitymapscacheservice.WorkspaceManyOrAllFlatEntityMapsCacheService,
                    useValue: {
                        getOrRecomputeManyOrAllFlatEntityMaps: jest.fn().mockResolvedValue(allFlatEntityMaps)
                    }
                },
                {
                    provide: _applicationservice.ApplicationService,
                    useValue: {
                        findWorkspaceTwentyStandardAndCustomApplicationOrThrow: jest.fn().mockResolvedValue({
                            workspaceCustomFlatApplication: {
                                universalIdentifier: WORKSPACE_CUSTOM_APPLICATION_UNIVERSAL_IDENTIFIER
                            }
                        })
                    }
                },
                {
                    provide: _dashboardsyncservice.DashboardSyncService,
                    useValue: {
                        updateLinkedDashboardsUpdatedAtByPageLayoutId: jest.fn()
                    }
                },
                {
                    provide: _viewservice.ViewService,
                    useValue: {}
                }
            ]
        }).compile();
        const service = module.get(_pagelayoutresetservice.PageLayoutResetService);
        await service.resetPageLayoutToDefault({
            id: layout.id,
            workspaceId: layout.workspaceId
        });
        expect(validateBuildAndRunWorkspaceMigration).toHaveBeenCalledWith(expect.objectContaining({
            allFlatEntityOperationByMetadataName: expect.objectContaining({
                pageLayout: {
                    flatEntityToCreate: [],
                    flatEntityToUpdate: [
                        {
                            ...layout,
                            isFirstTabPinned: true,
                            updatedAt: expect.any(String)
                        }
                    ],
                    flatEntityToDelete: []
                }
            })
        }));
        await module.close();
    });
});

//# sourceMappingURL=page-layout-reset.service.spec.js.map