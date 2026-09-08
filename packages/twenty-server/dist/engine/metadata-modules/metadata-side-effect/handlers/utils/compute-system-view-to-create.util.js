"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "computeSystemViewToCreate", {
    enumerable: true,
    get: function() {
        return computeSystemViewToCreate;
    }
});
const _application = require("twenty-shared/application");
const _constants = require("twenty-shared/constants");
const _types = require("twenty-shared/types");
const _uuid = require("uuid");
const _indexviewnameconstant = require("../../../view/constants/index-view-name.constant");
// The INDEX view name is a template resolved at display time; the record-page
// view name is materialized at creation.
const SYSTEM_VIEW_PROPERTIES_BY_VIEW_KEY = {
    [_application.SYSTEM_VIEW_KEYS.INDEX]: {
        type: _types.ViewType.TABLE,
        icon: _constants.VIEW_TYPE_DEFAULT_ICONS[_types.ViewType.TABLE],
        computeName: ()=>_indexviewnameconstant.INDEX_VIEW_NAME
    },
    [_application.SYSTEM_VIEW_KEYS.FIELDS_WIDGET]: {
        type: _types.ViewType.FIELDS_WIDGET,
        icon: 'IconList',
        computeName: (objectMetadata)=>`${objectMetadata.labelSingular} Record Page Fields`
    }
};
const computeSystemViewToCreate = ({ objectMetadata, applicationUniversalIdentifier, viewKey })=>{
    const { type, icon, computeName } = SYSTEM_VIEW_PROPERTIES_BY_VIEW_KEY[viewKey];
    const createdAt = new Date().toISOString();
    return {
        id: (0, _uuid.v4)(),
        objectMetadataUniversalIdentifier: objectMetadata.universalIdentifier,
        name: computeName(objectMetadata),
        // Only INDEX is a persisted key; FIELDS_WIDGET exists solely in the
        // universal identifier derivation.
        key: viewKey === _application.SYSTEM_VIEW_KEYS.INDEX ? _types.ViewKey.INDEX : null,
        icon,
        type,
        createdAt,
        updatedAt: createdAt,
        deletedAt: null,
        isCustom: true,
        anyFieldFilterValue: null,
        calendarFieldMetadataUniversalIdentifier: null,
        calendarEndFieldMetadataUniversalIdentifier: null,
        calendarLayout: null,
        isCompact: false,
        shouldHideEmptyGroups: false,
        kanbanColumnWidth: null,
        kanbanAggregateOperation: null,
        kanbanAggregateOperationFieldMetadataUniversalIdentifier: null,
        mainGroupByFieldMetadataUniversalIdentifier: null,
        openRecordIn: _types.ViewOpenRecordIn.SIDE_PANEL,
        position: 0,
        universalIdentifier: (0, _application.getSystemViewUniversalIdentifier)({
            objectMetadataApplicationUniversalIdentifier: applicationUniversalIdentifier,
            objectUniversalIdentifier: objectMetadata.universalIdentifier,
            viewKey
        }),
        visibility: _types.ViewVisibility.WORKSPACE,
        createdByUserWorkspaceId: null,
        isActive: true,
        isSystemSideEffect: true,
        universalOverrides: null,
        viewFieldUniversalIdentifiers: [],
        viewFieldGroupUniversalIdentifiers: [],
        viewFilterUniversalIdentifiers: [],
        viewGroupUniversalIdentifiers: [],
        viewFilterGroupUniversalIdentifiers: [],
        viewSortUniversalIdentifiers: [],
        applicationUniversalIdentifier
    };
};

//# sourceMappingURL=compute-system-view-to-create.util.js.map