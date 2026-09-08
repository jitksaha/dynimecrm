"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _types = require("twenty-shared/types");
const _buildallflatentityoperationrecordbymetadatanamefromfromtoutil = require("../build-all-flat-entity-operation-record-by-metadata-name-from-from-to.util");
const _createemptyallflatentitymapsconstant = require("../../../../../metadata-modules/flat-entity/constant/create-empty-all-flat-entity-maps.constant");
const _addflatentitytoflatentitymapsorthrowutil = require("../../../../../metadata-modules/flat-entity/utils/add-flat-entity-to-flat-entity-maps-or-throw.util");
const PAGE_LAYOUT = {
    id: 'page-layout-id',
    universalIdentifier: 'page-layout-universal-identifier',
    applicationId: 'application-id',
    applicationUniversalIdentifier: 'application-universal-identifier',
    workspaceId: 'workspace-id',
    name: 'App page',
    type: _types.PageLayoutType.RECORD_PAGE,
    objectMetadataId: null,
    objectMetadataUniversalIdentifier: null,
    defaultTabToFocusOnMobileAndSidePanelId: null,
    defaultTabToFocusOnMobileAndSidePanelUniversalIdentifier: null,
    tabIds: [],
    tabUniversalIdentifiers: [],
    isSystemSideEffect: false,
    isFirstTabPinned: true,
    createdAt: '2026-08-27T00:00:00.000Z',
    updatedAt: '2026-08-27T00:00:00.000Z',
    deletedAt: null
};
const BUILD_OPTIONS = {
    isSystemBuild: false,
    inferDeletionFromMissingEntities: true,
    applicationUniversalIdentifier: PAGE_LAYOUT.applicationUniversalIdentifier
};
const buildAllFlatEntityMapsWithPageLayout = (pageLayout)=>{
    const allFlatEntityMaps = (0, _createemptyallflatentitymapsconstant.createEmptyAllFlatEntityMaps)();
    allFlatEntityMaps.flatPageLayoutMaps = (0, _addflatentitytoflatentitymapsorthrowutil.addFlatEntityToFlatEntityMapsOrThrow)({
        flatEntity: pageLayout,
        flatEntityMaps: allFlatEntityMaps.flatPageLayoutMaps
    });
    return allFlatEntityMaps;
};
describe('buildAllFlatEntityOperationRecordByMetadataNameFromFromTo', ()=>{
    it('does not update an unpinned layout when its manifest is unchanged', ()=>{
        const result = (0, _buildallflatentityoperationrecordbymetadatanamefromfromtoutil.buildAllFlatEntityOperationRecordByMetadataNameFromFromTo)({
            fromAllFlatEntityMaps: buildAllFlatEntityMapsWithPageLayout({
                ...PAGE_LAYOUT,
                isFirstTabPinned: false
            }),
            toAllUniversalFlatEntityMaps: buildAllFlatEntityMapsWithPageLayout(PAGE_LAYOUT),
            buildOptions: BUILD_OPTIONS
        });
        expect(result).toEqual({});
    });
    it('accepts app updates without replacing the workspace pin choice', ()=>{
        const result = (0, _buildallflatentityoperationrecordbymetadatanamefromfromtoutil.buildAllFlatEntityOperationRecordByMetadataNameFromFromTo)({
            fromAllFlatEntityMaps: buildAllFlatEntityMapsWithPageLayout({
                ...PAGE_LAYOUT,
                isFirstTabPinned: false
            }),
            toAllUniversalFlatEntityMaps: buildAllFlatEntityMapsWithPageLayout({
                ...PAGE_LAYOUT,
                name: 'Updated app page'
            }),
            buildOptions: BUILD_OPTIONS
        });
        expect(result.pageLayout?.flatEntityToUpdate).toEqual({
            [PAGE_LAYOUT.universalIdentifier]: {
                ...PAGE_LAYOUT,
                name: 'Updated app page',
                isFirstTabPinned: false
            }
        });
    });
    it('uses the app default when creating a layout', ()=>{
        const result = (0, _buildallflatentityoperationrecordbymetadatanamefromfromtoutil.buildAllFlatEntityOperationRecordByMetadataNameFromFromTo)({
            fromAllFlatEntityMaps: (0, _createemptyallflatentitymapsconstant.createEmptyAllFlatEntityMaps)(),
            toAllUniversalFlatEntityMaps: buildAllFlatEntityMapsWithPageLayout(PAGE_LAYOUT),
            buildOptions: BUILD_OPTIONS
        });
        expect(result.pageLayout?.flatEntityToCreate).toEqual({
            [PAGE_LAYOUT.universalIdentifier]: PAGE_LAYOUT
        });
    });
});

//# sourceMappingURL=build-all-flat-entity-operation-record-by-metadata-name-from-from-to.util.spec.js.map