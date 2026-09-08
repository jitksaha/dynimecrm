"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "fromPageLayoutManifestToUniversalFlatPageLayout", {
    enumerable: true,
    get: function() {
        return fromPageLayoutManifestToUniversalFlatPageLayout;
    }
});
const fromPageLayoutManifestToUniversalFlatPageLayout = ({ pageLayoutManifest, applicationUniversalIdentifier, now })=>{
    return {
        universalIdentifier: pageLayoutManifest.universalIdentifier,
        applicationUniversalIdentifier,
        name: pageLayoutManifest.name,
        type: pageLayoutManifest.type,
        objectMetadataUniversalIdentifier: pageLayoutManifest.objectUniversalIdentifier ?? null,
        defaultTabToFocusOnMobileAndSidePanelUniversalIdentifier: pageLayoutManifest.defaultTabToFocusOnMobileAndSidePanelUniversalIdentifier ?? null,
        tabUniversalIdentifiers: [],
        isSystemSideEffect: false,
        isFirstTabPinned: true,
        createdAt: now,
        updatedAt: now,
        deletedAt: null
    };
};

//# sourceMappingURL=from-page-layout-manifest-to-universal-flat-page-layout.util.js.map