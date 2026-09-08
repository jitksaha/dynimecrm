"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "fromViewManifestToUniversalFlatView", {
    enumerable: true,
    get: function() {
        return fromViewManifestToUniversalFlatView;
    }
});
const _types = require("twenty-shared/types");
const fromViewManifestToUniversalFlatView = ({ viewManifest, applicationUniversalIdentifier, now })=>{
    return {
        universalIdentifier: viewManifest.universalIdentifier,
        applicationUniversalIdentifier,
        name: viewManifest.name,
        objectMetadataUniversalIdentifier: viewManifest.objectUniversalIdentifier,
        type: viewManifest.type ?? _types.ViewType.TABLE,
        icon: viewManifest.icon ?? 'IconList',
        position: viewManifest.position ?? 0,
        isCompact: viewManifest.isCompact ?? false,
        isCustom: true,
        visibility: viewManifest.visibility ?? _types.ViewVisibility.WORKSPACE,
        openRecordIn: viewManifest.openRecordIn ?? _types.ViewOpenRecordIn.SIDE_PANEL,
        key: null,
        kanbanAggregateOperation: viewManifest.kanbanAggregateOperation ?? null,
        kanbanAggregateOperationFieldMetadataUniversalIdentifier: viewManifest.kanbanAggregateOperationFieldMetadataUniversalIdentifier ?? null,
        calendarLayout: viewManifest.calendarLayout ?? null,
        calendarFieldMetadataUniversalIdentifier: viewManifest.calendarFieldMetadataUniversalIdentifier ?? null,
        calendarEndFieldMetadataUniversalIdentifier: viewManifest.calendarEndFieldMetadataUniversalIdentifier ?? null,
        mainGroupByFieldMetadataUniversalIdentifier: viewManifest.mainGroupByFieldMetadataUniversalIdentifier ?? null,
        shouldHideEmptyGroups: viewManifest.shouldHideEmptyGroups ?? false,
        kanbanColumnWidth: viewManifest.kanbanColumnWidth ?? null,
        anyFieldFilterValue: viewManifest.anyFieldFilterValue ?? null,
        createdByUserWorkspaceId: null,
        isActive: true,
        isSystemSideEffect: false,
        universalOverrides: null,
        viewFieldUniversalIdentifiers: [],
        viewFilterUniversalIdentifiers: [],
        viewFilterGroupUniversalIdentifiers: [],
        viewGroupUniversalIdentifiers: [],
        viewFieldGroupUniversalIdentifiers: [],
        viewSortUniversalIdentifiers: [],
        createdAt: now,
        updatedAt: now,
        deletedAt: null
    };
};

//# sourceMappingURL=from-view-manifest-to-universal-flat-view.util.js.map