"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _types = require("twenty-shared/types");
const _frompagelayoutmanifesttouniversalflatpagelayoututil = require("../from-page-layout-manifest-to-universal-flat-page-layout.util");
describe('fromPageLayoutManifestToUniversalFlatPageLayout', ()=>{
    const now = '2026-01-01T00:00:00.000Z';
    const applicationUniversalIdentifier = 'app-uuid-1';
    it('should convert a standalone page layout manifest', ()=>{
        const result = (0, _frompagelayoutmanifesttouniversalflatpagelayoututil.fromPageLayoutManifestToUniversalFlatPageLayout)({
            pageLayoutManifest: {
                universalIdentifier: 'pl-uuid-1',
                name: 'My Page Layout',
                type: _types.PageLayoutType.STANDALONE_PAGE
            },
            applicationUniversalIdentifier,
            now
        });
        expect(result.universalIdentifier).toBe('pl-uuid-1');
        expect(result.applicationUniversalIdentifier).toBe(applicationUniversalIdentifier);
        expect(result.name).toBe('My Page Layout');
        expect(result.type).toBe(_types.PageLayoutType.STANDALONE_PAGE);
        expect(result.objectMetadataUniversalIdentifier).toBeNull();
        expect(result.defaultTabToFocusOnMobileAndSidePanelUniversalIdentifier).toBeNull();
        expect(result.tabUniversalIdentifiers).toEqual([]);
    });
    it('should convert a record page layout manifest', ()=>{
        const result = (0, _frompagelayoutmanifesttouniversalflatpagelayoututil.fromPageLayoutManifestToUniversalFlatPageLayout)({
            pageLayoutManifest: {
                universalIdentifier: 'pl-uuid-2',
                name: 'Record Layout',
                type: _types.PageLayoutType.RECORD_PAGE,
                objectUniversalIdentifier: 'obj-uuid-1'
            },
            applicationUniversalIdentifier,
            now
        });
        expect(result.name).toBe('Record Layout');
        expect(result.type).toBe(_types.PageLayoutType.RECORD_PAGE);
        expect(result.objectMetadataUniversalIdentifier).toBe('obj-uuid-1');
    });
    it('should convert a fully specified page layout manifest', ()=>{
        const result = (0, _frompagelayoutmanifesttouniversalflatpagelayoututil.fromPageLayoutManifestToUniversalFlatPageLayout)({
            pageLayoutManifest: {
                universalIdentifier: 'pl-uuid-3',
                name: 'Dashboard Layout',
                type: _types.PageLayoutType.DASHBOARD,
                objectUniversalIdentifier: 'obj-uuid-1',
                defaultTabToFocusOnMobileAndSidePanelUniversalIdentifier: 'tab-uuid-1'
            },
            applicationUniversalIdentifier,
            now
        });
        expect(result.name).toBe('Dashboard Layout');
        expect(result.type).toBe(_types.PageLayoutType.DASHBOARD);
        expect(result.objectMetadataUniversalIdentifier).toBe('obj-uuid-1');
        expect(result.defaultTabToFocusOnMobileAndSidePanelUniversalIdentifier).toBe('tab-uuid-1');
    });
});

//# sourceMappingURL=from-page-layout-manifest-to-universal-flat-page-layout.util.spec.js.map