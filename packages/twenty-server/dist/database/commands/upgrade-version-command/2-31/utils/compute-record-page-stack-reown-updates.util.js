"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "computeRecordPageStackReownUpdates", {
    enumerable: true,
    get: function() {
        return computeRecordPageStackReownUpdates;
    }
});
const _application = require("twenty-shared/application");
const _utils = require("twenty-shared/utils");
const _remaprecordpageuniversalidentifierstopre231util = require("../../2-10/utils/remap-record-page-universal-identifiers-to-pre-2-31.util");
const _collectrecordpagestacktreeutil = require("./collect-record-page-stack-tree.util");
const _createemptyrecordpagereownupdatesutil = require("./create-empty-record-page-reown-updates.util");
const computeRecordPageStackReownUpdates = ({ workspaceId, logger, flatObjectMetadata, flatPageLayout, derivedPageLayoutUniversalIdentifier, engineOwnedApplicationUniversalIdentifiers, twentyStandardApplicationUniversalIdentifier, flatViewMaps, flatViewFieldMaps, flatViewFieldGroupMaps, flatFieldMetadataMaps, flatPageLayoutMaps, flatPageLayoutTabMaps, flatPageLayoutWidgetMaps })=>{
    const reownUpdates = (0, _createemptyrecordpagereownupdatesutil.createEmptyRecordPageReownUpdates)();
    const stackTree = (0, _collectrecordpagestacktreeutil.collectRecordPageStackTree)({
        flatPageLayout,
        flatViewMaps,
        flatViewFieldMaps,
        flatViewFieldGroupMaps,
        flatPageLayoutTabMaps,
        flatPageLayoutWidgetMaps
    });
    const systemFieldsViewSelection = selectSystemFieldsView({
        workspaceId,
        logger,
        stackTree,
        flatObjectMetadata,
        engineOwnedApplicationUniversalIdentifiers,
        twentyStandardApplicationUniversalIdentifier
    });
    if (systemFieldsViewSelection.status !== 'selected') {
        return reownUpdates;
    }
    const systemFieldsViewId = systemFieldsViewSelection.viewId;
    pushReownUpdate({
        workspaceId,
        logger,
        updates: reownUpdates.pageLayoutUpdates,
        flatEntity: flatPageLayout,
        derivedUniversalIdentifier: derivedPageLayoutUniversalIdentifier,
        flatEntitiesByUniversalIdentifier: flatPageLayoutMaps.byUniversalIdentifier
    });
    const seenDerivedTabUniversalIdentifiers = new Set();
    const processedViewIds = new Set();
    for (const { flatPageLayoutTab, widgets } of stackTree.tabs){
        if (// App-authored tabs attached to the engine layout stay app-owned.
        !engineOwnedApplicationUniversalIdentifiers.has(flatPageLayoutTab.applicationUniversalIdentifier)) {
            continue;
        }
        const derivedTabUniversalIdentifier = (0, _application.getSystemPageLayoutTabUniversalIdentifier)({
            objectMetadataApplicationUniversalIdentifier: flatObjectMetadata.applicationUniversalIdentifier,
            pageLayoutUniversalIdentifier: derivedPageLayoutUniversalIdentifier,
            title: flatPageLayoutTab.title
        });
        if (seenDerivedTabUniversalIdentifiers.has(derivedTabUniversalIdentifier)) {
            logger.warn(`Duplicate tab title "${flatPageLayoutTab.title}" on record-page layout ${flatPageLayout.id} in workspace ${workspaceId}, skipping tab ${flatPageLayoutTab.id}`);
            continue;
        }
        seenDerivedTabUniversalIdentifiers.add(derivedTabUniversalIdentifier);
        pushReownUpdate({
            workspaceId,
            logger,
            updates: reownUpdates.pageLayoutTabUpdates,
            flatEntity: flatPageLayoutTab,
            derivedUniversalIdentifier: derivedTabUniversalIdentifier,
            flatEntitiesByUniversalIdentifier: flatPageLayoutTabMaps.byUniversalIdentifier
        });
        const seenDerivedWidgetUniversalIdentifiers = new Set();
        for (const { flatPageLayoutWidget, fieldsWidgetViewId, fieldsView } of widgets){
            if (!engineOwnedApplicationUniversalIdentifiers.has(flatPageLayoutWidget.applicationUniversalIdentifier)) {
                continue;
            }
            const derivedWidgetUniversalIdentifier = (0, _application.getSystemPageLayoutWidgetUniversalIdentifier)({
                objectMetadataApplicationUniversalIdentifier: flatObjectMetadata.applicationUniversalIdentifier,
                pageLayoutTabUniversalIdentifier: derivedTabUniversalIdentifier,
                title: flatPageLayoutWidget.title
            });
            if (seenDerivedWidgetUniversalIdentifiers.has(derivedWidgetUniversalIdentifier)) {
                logger.warn(`Duplicate widget title "${flatPageLayoutWidget.title}" on tab ${flatPageLayoutTab.id} in workspace ${workspaceId}, skipping widget ${flatPageLayoutWidget.id}`);
                continue;
            }
            seenDerivedWidgetUniversalIdentifiers.add(derivedWidgetUniversalIdentifier);
            pushReownUpdate({
                workspaceId,
                logger,
                updates: reownUpdates.pageLayoutWidgetUpdates,
                flatEntity: flatPageLayoutWidget,
                derivedUniversalIdentifier: derivedWidgetUniversalIdentifier,
                flatEntitiesByUniversalIdentifier: flatPageLayoutWidgetMaps.byUniversalIdentifier
            });
            if ((0, _utils.isDefined)(fieldsWidgetViewId) && !(0, _utils.isDefined)(fieldsView)) {
                logger.warn(`Dangling FIELDS widget view ${fieldsWidgetViewId} for object ${flatObjectMetadata.universalIdentifier} in workspace ${workspaceId}, skipping`);
                continue;
            }
            if (!(0, _utils.isDefined)(fieldsView) || // Only the selected system view is re-owned: any other FIELDS widget
            // view (e.g. user-added through layout customization) would derive
            // the same object-based identifier and self-collide at apply time,
            // and is user-space anyway.
            fieldsView.flatView.id !== systemFieldsViewId || processedViewIds.has(fieldsView.flatView.id)) {
                continue;
            }
            processedViewIds.add(fieldsView.flatView.id);
            computeRecordPageViewReownUpdates({
                workspaceId,
                logger,
                reownUpdates,
                flatObjectMetadata,
                fieldsView,
                twentyStandardApplicationUniversalIdentifier,
                flatViewMaps,
                flatViewFieldMaps,
                flatViewFieldGroupMaps,
                flatFieldMetadataMaps
            });
        }
    }
    return reownUpdates;
};
const selectSystemFieldsView = ({ workspaceId, logger, stackTree, flatObjectMetadata, engineOwnedApplicationUniversalIdentifiers, twentyStandardApplicationUniversalIdentifier })=>{
    const derivedViewUniversalIdentifier = (0, _application.getSystemViewUniversalIdentifier)({
        objectMetadataApplicationUniversalIdentifier: flatObjectMetadata.applicationUniversalIdentifier,
        objectUniversalIdentifier: flatObjectMetadata.universalIdentifier,
        viewKey: _application.SYSTEM_VIEW_KEYS.FIELDS_WIDGET
    });
    const pre231ViewUniversalIdentifier = _remaprecordpageuniversalidentifierstopre231util.PRE_2_31_RECORD_PAGE_UNIVERSAL_IDENTIFIER_BY_DERIVED[derivedViewUniversalIdentifier];
    const candidates = [];
    const seenCandidateViewIds = new Set();
    for (const { flatPageLayoutTab, widgets } of stackTree.tabs){
        if (!engineOwnedApplicationUniversalIdentifiers.has(flatPageLayoutTab.applicationUniversalIdentifier)) {
            continue;
        }
        for (const { flatPageLayoutWidget, fieldsView } of widgets){
            if (!engineOwnedApplicationUniversalIdentifiers.has(flatPageLayoutWidget.applicationUniversalIdentifier) || !(0, _utils.isDefined)(fieldsView) || seenCandidateViewIds.has(fieldsView.flatView.id)) {
                continue;
            }
            seenCandidateViewIds.add(fieldsView.flatView.id);
            candidates.push({
                fieldsView,
                widgetApplicationUniversalIdentifier: flatPageLayoutWidget.applicationUniversalIdentifier
            });
        }
    }
    const selectedCandidate = candidates.find(({ fieldsView })=>(0, _utils.isDefined)(pre231ViewUniversalIdentifier) && fieldsView.flatView.universalIdentifier === pre231ViewUniversalIdentifier) ?? candidates.find(({ fieldsView })=>fieldsView.flatView.universalIdentifier === derivedViewUniversalIdentifier) ?? candidates.find(({ widgetApplicationUniversalIdentifier })=>widgetApplicationUniversalIdentifier === twentyStandardApplicationUniversalIdentifier) ?? candidates.find(({ fieldsView })=>fieldsView.flatView.isSystemSideEffect);
    if ((0, _utils.isDefined)(selectedCandidate)) {
        return {
            status: 'selected',
            viewId: selectedCandidate.fieldsView.flatView.id
        };
    }
    if (candidates.length > 1) {
        logger.warn(`Ambiguous FIELDS widget views for object ${flatObjectMetadata.universalIdentifier} in workspace ${workspaceId}, skipping the whole stack re-own (candidates: ${candidates.map(({ fieldsView })=>fieldsView.flatView.id).join(', ')})`);
        return {
            status: 'ambiguous'
        };
    }
    if (candidates.length === 1) {
        return {
            status: 'selected',
            viewId: candidates[0].fieldsView.flatView.id
        };
    }
    logger.warn(`No resolvable system FIELDS widget view for object ${flatObjectMetadata.universalIdentifier} in workspace ${workspaceId}, skipping the whole stack re-own`);
    return {
        status: 'none'
    };
};
const computeRecordPageViewReownUpdates = ({ workspaceId, logger, reownUpdates, flatObjectMetadata, fieldsView, twentyStandardApplicationUniversalIdentifier, flatViewMaps, flatViewFieldMaps, flatViewFieldGroupMaps, flatFieldMetadataMaps })=>{
    const { flatView, flatViewFields, flatViewFieldGroups } = fieldsView;
    const derivedViewUniversalIdentifier = (0, _application.getSystemViewUniversalIdentifier)({
        objectMetadataApplicationUniversalIdentifier: flatObjectMetadata.applicationUniversalIdentifier,
        objectUniversalIdentifier: flatObjectMetadata.universalIdentifier,
        viewKey: _application.SYSTEM_VIEW_KEYS.FIELDS_WIDGET
    });
    // Only the selected system view reaches this point, so a holder here is a
    // row outside the walk (e.g. a soft-deleted view still occupying the
    // identifier in the non-partial unique index).
    const derivedViewIdentifierHolder = flatViewMaps.byUniversalIdentifier[derivedViewUniversalIdentifier];
    if ((0, _utils.isDefined)(derivedViewIdentifierHolder) && derivedViewIdentifierHolder.id !== flatView.id) {
        logger.warn(`Duplicate FIELDS widget view for object ${flatObjectMetadata.universalIdentifier} in workspace ${workspaceId}, skipping view ${flatView.id}`);
        return;
    }
    const viewUpdate = {};
    if (flatView.universalIdentifier !== derivedViewUniversalIdentifier) {
        viewUpdate.universalIdentifier = derivedViewUniversalIdentifier;
    }
    if (!flatView.isSystemSideEffect) {
        viewUpdate.isSystemSideEffect = true;
    }
    if (Object.keys(viewUpdate).length > 0) {
        reownUpdates.viewUpdates.push({
            id: flatView.id,
            update: viewUpdate
        });
    }
    const seenDerivedViewFieldUniversalIdentifiers = new Set();
    for (const flatViewField of flatViewFields){
        const flatFieldMetadata = flatFieldMetadataMaps.byUniversalIdentifier[flatViewField.fieldMetadataUniversalIdentifier];
        if (!(0, _utils.isDefined)(flatFieldMetadata)) {
            logger.warn(`Missing field for record-page view field ${flatViewField.id} in workspace ${workspaceId}, skipping`);
            continue;
        }
        const derivedViewFieldUniversalIdentifier = (0, _application.getSystemViewFieldUniversalIdentifier)({
            fieldMetadataApplicationUniversalIdentifier: flatFieldMetadata.applicationUniversalIdentifier,
            viewUniversalIdentifier: derivedViewUniversalIdentifier,
            fieldMetadataUniversalIdentifier: flatViewField.fieldMetadataUniversalIdentifier
        });
        if (seenDerivedViewFieldUniversalIdentifiers.has(derivedViewFieldUniversalIdentifier)) {
            logger.warn(`Duplicate view field for field ${flatViewField.fieldMetadataUniversalIdentifier} on record-page view ${flatView.id} in workspace ${workspaceId}, skipping view field ${flatViewField.id}`);
            continue;
        }
        seenDerivedViewFieldUniversalIdentifiers.add(derivedViewFieldUniversalIdentifier);
        pushReownUpdate({
            workspaceId,
            logger,
            updates: reownUpdates.viewFieldUpdates,
            flatEntity: flatViewField,
            derivedUniversalIdentifier: derivedViewFieldUniversalIdentifier,
            flatEntitiesByUniversalIdentifier: flatViewFieldMaps.byUniversalIdentifier
        });
    }
    const seenDerivedViewFieldGroupUniversalIdentifiers = new Set();
    for (const flatViewFieldGroup of flatViewFieldGroups){
        if (// User-created groups (CRUD API) keep isSystemSideEffect false and
        // their own identifier; only standard-authored groups are re-owned.
        flatViewFieldGroup.applicationUniversalIdentifier !== twentyStandardApplicationUniversalIdentifier) {
            continue;
        }
        const derivedViewFieldGroupUniversalIdentifier = (0, _application.getSystemViewFieldGroupUniversalIdentifier)({
            objectMetadataApplicationUniversalIdentifier: flatObjectMetadata.applicationUniversalIdentifier,
            viewUniversalIdentifier: derivedViewUniversalIdentifier,
            name: flatViewFieldGroup.name
        });
        if (seenDerivedViewFieldGroupUniversalIdentifiers.has(derivedViewFieldGroupUniversalIdentifier)) {
            logger.warn(`Duplicate view field group name "${flatViewFieldGroup.name}" on record-page view ${flatView.id} in workspace ${workspaceId}, skipping group ${flatViewFieldGroup.id}`);
            continue;
        }
        seenDerivedViewFieldGroupUniversalIdentifiers.add(derivedViewFieldGroupUniversalIdentifier);
        pushReownUpdate({
            workspaceId,
            logger,
            updates: reownUpdates.viewFieldGroupUpdates,
            flatEntity: flatViewFieldGroup,
            derivedUniversalIdentifier: derivedViewFieldGroupUniversalIdentifier,
            flatEntitiesByUniversalIdentifier: flatViewFieldGroupMaps.byUniversalIdentifier
        });
    }
};
const pushReownUpdate = ({ workspaceId, logger, updates, flatEntity, derivedUniversalIdentifier, flatEntitiesByUniversalIdentifier })=>{
    const update = {};
    if (flatEntity.universalIdentifier !== derivedUniversalIdentifier) {
        const derivedIdentifierHolder = flatEntitiesByUniversalIdentifier[derivedUniversalIdentifier];
        if ((0, _utils.isDefined)(derivedIdentifierHolder) && derivedIdentifierHolder.id !== flatEntity.id) {
            logger.warn(`Derived universal identifier ${derivedUniversalIdentifier} is already held by another row in workspace ${workspaceId}, skipping ${flatEntity.id}`);
            return;
        }
        update.universalIdentifier = derivedUniversalIdentifier;
    }
    if (!flatEntity.isSystemSideEffect) {
        update.isSystemSideEffect = true;
    }
    if (Object.keys(update).length === 0) {
        return;
    }
    updates.push({
        id: flatEntity.id,
        update
    });
};

//# sourceMappingURL=compute-record-page-stack-reown-updates.util.js.map