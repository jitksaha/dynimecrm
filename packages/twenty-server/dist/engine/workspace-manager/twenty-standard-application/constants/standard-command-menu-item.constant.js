"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "STANDARD_COMMAND_MENU_ITEMS", {
    enumerable: true,
    get: function() {
        return STANDARD_COMMAND_MENU_ITEMS;
    }
});
const _metadata = require("twenty-shared/metadata");
const _enginecomponentkeyenum = require("../../../metadata-modules/command-menu-item/enums/engine-component-key.enum");
const _i18nlabelutil = require("../utils/i18n-label.util");
const _types = require("twenty-shared/types");
const STANDARD_COMMAND_MENU_ITEMS = {
    navigateToNextRecord: {
        universalIdentifier: '3db2457d-8e96-4b8e-94c9-ed95d3f95738',
        label: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
            id: "GxRBGY",
            message: "Navigate to next {objectLabelSingular}"
        }),
        icon: 'IconChevronDown',
        isPinned: true,
        position: 1,
        shortLabel: null,
        availabilityType: _types.CommandMenuItemAvailabilityType.RECORD_SELECTION,
        conditionalAvailabilityExpression: 'pageType == "RECORD_PAGE" and not isInSidePanel and objectMetadataItem.nameSingular != "messageCampaign"',
        availabilityObjectMetadataUniversalIdentifier: null,
        frontComponentUniversalIdentifier: null,
        engineComponentKey: _enginecomponentkeyenum.EngineComponentKey.NAVIGATE_TO_NEXT_RECORD,
        hotKeys: null
    },
    navigateToPreviousRecord: {
        universalIdentifier: 'ec10f871-415b-420b-8150-7e09f6f04833',
        label: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
            id: "GjtAeJ",
            message: "Navigate to previous {objectLabelSingular}"
        }),
        icon: 'IconChevronUp',
        isPinned: true,
        position: 2,
        shortLabel: null,
        availabilityType: _types.CommandMenuItemAvailabilityType.RECORD_SELECTION,
        conditionalAvailabilityExpression: 'pageType == "RECORD_PAGE" and not isInSidePanel and objectMetadataItem.nameSingular != "messageCampaign"',
        availabilityObjectMetadataUniversalIdentifier: null,
        frontComponentUniversalIdentifier: null,
        engineComponentKey: _enginecomponentkeyenum.EngineComponentKey.NAVIGATE_TO_PREVIOUS_RECORD,
        hotKeys: null
    },
    createNewRecord: {
        universalIdentifier: '08d255bf-58cd-47a5-bd82-78c5c58592f1',
        label: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
            id: "fOgbeX",
            message: "Create new {objectLabelSingular}"
        }),
        icon: 'IconPlus',
        isPinned: true,
        position: 3,
        shortLabel: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
            id: "P1Lloh",
            message: "New {objectLabelSingular}"
        }),
        availabilityType: _types.CommandMenuItemAvailabilityType.GLOBAL_OBJECT_CONTEXT,
        conditionalAvailabilityExpression: 'pageType == "INDEX_PAGE" and objectPermissions.canUpdateObjectRecords and not hasAnySoftDeleteFilterOnView and objectMetadataItem.isUICreatable and objectMetadataItem.isUIEditable and not objectMetadataItem.isRemote',
        availabilityObjectMetadataUniversalIdentifier: null,
        frontComponentUniversalIdentifier: null,
        engineComponentKey: _enginecomponentkeyenum.EngineComponentKey.CREATE_NEW_RECORD,
        hotKeys: null
    },
    deleteRecords: {
        universalIdentifier: 'd5a55d57-ed1d-4791-89b8-53b7e121d69d',
        label: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
            id: "7xc88z",
            message: "Delete {objectLabel}"
        }),
        icon: 'IconTrash',
        isPinned: false,
        position: 4,
        shortLabel: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
            id: "R+Pipg",
            message: "Delete"
        }),
        availabilityType: _types.CommandMenuItemAvailabilityType.RECORD_SELECTION,
        conditionalAvailabilityExpression: 'numberOfSelectedRecords >= 1 and not hasAnySoftDeleteFilterOnView and objectPermissions.canSoftDeleteObjectRecords and (isSelectAll or noneDefined(selectedRecords, "deletedAt"))',
        availabilityObjectMetadataUniversalIdentifier: null,
        frontComponentUniversalIdentifier: null,
        engineComponentKey: _enginecomponentkeyenum.EngineComponentKey.DELETE_RECORDS,
        hotKeys: null
    },
    restoreRecords: {
        universalIdentifier: '2d733846-8cc5-4314-ab79-916ae0801baa',
        label: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
            id: "u8G1rR",
            message: "Restore {objectLabel}"
        }),
        icon: 'IconRefresh',
        isPinned: true,
        position: 5,
        shortLabel: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
            id: "Zdd8u/",
            message: "Restore"
        }),
        availabilityType: _types.CommandMenuItemAvailabilityType.RECORD_SELECTION,
        conditionalAvailabilityExpression: 'numberOfSelectedRecords >= 1 and (isSelectAll or everyDefined(selectedRecords, "deletedAt")) and objectPermissions.canSoftDeleteObjectRecords and (pageType == "RECORD_PAGE" or hasAnySoftDeleteFilterOnView)',
        availabilityObjectMetadataUniversalIdentifier: null,
        frontComponentUniversalIdentifier: null,
        engineComponentKey: _enginecomponentkeyenum.EngineComponentKey.RESTORE_RECORDS,
        hotKeys: null
    },
    destroyRecords: {
        universalIdentifier: '0ea2ebc4-02ca-4d15-b424-5352b9e487df',
        label: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
            id: "2TPvIG",
            message: "Permanently destroy {objectLabel}"
        }),
        icon: 'IconTrashX',
        isPinned: false,
        position: 6,
        shortLabel: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
            id: "BlbMIB",
            message: "Destroy"
        }),
        availabilityType: _types.CommandMenuItemAvailabilityType.RECORD_SELECTION,
        conditionalAvailabilityExpression: 'numberOfSelectedRecords >= 1 and objectPermissions.canDestroyObjectRecords and (isSelectAll or everyDefined(selectedRecords, "deletedAt")) and (pageType == "RECORD_PAGE" or hasAnySoftDeleteFilterOnView)',
        availabilityObjectMetadataUniversalIdentifier: null,
        frontComponentUniversalIdentifier: null,
        engineComponentKey: _enginecomponentkeyenum.EngineComponentKey.DESTROY_RECORDS,
        hotKeys: null
    },
    addToFavorites: {
        universalIdentifier: '38bf80c3-bd55-4753-80ba-38aa66429a03',
        label: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
            id: "mwzvkz",
            message: "Add to Favorites"
        }),
        icon: 'IconHeart',
        isPinned: true,
        position: 7,
        shortLabel: null,
        availabilityType: _types.CommandMenuItemAvailabilityType.RECORD_SELECTION,
        conditionalAvailabilityExpression: 'arrayLength(favoriteRecordIds) < numberOfSelectedRecords and noneDefined(selectedRecords, "deletedAt") and not hasAnySoftDeleteFilterOnView and objectMetadataItem.nameSingular != "messageCampaign"',
        availabilityObjectMetadataUniversalIdentifier: null,
        frontComponentUniversalIdentifier: null,
        engineComponentKey: _enginecomponentkeyenum.EngineComponentKey.ADD_TO_FAVORITES,
        hotKeys: null
    },
    removeFromFavorites: {
        universalIdentifier: '3ea42507-44fa-4895-a36d-cbfef7355a50',
        label: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
            id: "mFYgps",
            message: "Remove from Favorites"
        }),
        icon: 'IconHeartOff',
        isPinned: true,
        position: 8,
        shortLabel: null,
        availabilityType: _types.CommandMenuItemAvailabilityType.RECORD_SELECTION,
        conditionalAvailabilityExpression: 'arrayLength(favoriteRecordIds) == numberOfSelectedRecords and noneDefined(selectedRecords, "deletedAt") and not hasAnySoftDeleteFilterOnView and objectMetadataItem.nameSingular != "messageCampaign"',
        availabilityObjectMetadataUniversalIdentifier: null,
        frontComponentUniversalIdentifier: null,
        engineComponentKey: _enginecomponentkeyenum.EngineComponentKey.REMOVE_FROM_FAVORITES,
        hotKeys: null
    },
    exportNoteToPdf: {
        universalIdentifier: '86c8f3aa-9276-4c16-8cff-e295e34fbaf0',
        label: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
            id: "xvfw7w",
            message: "Export to PDF"
        }),
        icon: 'IconFileExport',
        isPinned: false,
        position: 9,
        shortLabel: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
            id: "PCGpYB",
            message: "Export"
        }),
        availabilityType: _types.CommandMenuItemAvailabilityType.RECORD_SELECTION,
        conditionalAvailabilityExpression: 'pageType == "RECORD_PAGE" and (objectMetadataItem.nameSingular == "note" or objectMetadataItem.nameSingular == "task") and someNonEmptyString(selectedRecords, "bodyV2.blocknote")',
        availabilityObjectMetadataUniversalIdentifier: null,
        frontComponentUniversalIdentifier: null,
        engineComponentKey: _enginecomponentkeyenum.EngineComponentKey.EXPORT_NOTE_TO_PDF,
        hotKeys: null
    },
    exportRecords: {
        universalIdentifier: 'c6f5c54d-d52b-4e75-8188-2190d77126f2',
        label: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
            id: "7fdI39",
            message: "Export {objectLabel}"
        }),
        icon: 'IconFileExport',
        isPinned: false,
        position: 10,
        shortLabel: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
            id: "PCGpYB",
            message: "Export"
        }),
        availabilityType: _types.CommandMenuItemAvailabilityType.RECORD_SELECTION,
        conditionalAvailabilityExpression: 'permissionFlags.EXPORT_CSV',
        availabilityObjectMetadataUniversalIdentifier: null,
        frontComponentUniversalIdentifier: null,
        engineComponentKey: _enginecomponentkeyenum.EngineComponentKey.EXPORT_RECORDS,
        hotKeys: null
    },
    updateMultipleRecords: {
        universalIdentifier: '2e080651-f098-4a78-bea9-7a70002dc57c',
        label: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
            id: "0nxZr5",
            message: "Update {objectLabelPlural}"
        }),
        icon: 'IconEdit',
        isPinned: true,
        position: 11,
        shortLabel: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
            id: "g+pbWz",
            message: "Update"
        }),
        availabilityType: _types.CommandMenuItemAvailabilityType.RECORD_SELECTION,
        conditionalAvailabilityExpression: 'numberOfSelectedRecords >= 2 and objectPermissions.canUpdateObjectRecords',
        availabilityObjectMetadataUniversalIdentifier: null,
        frontComponentUniversalIdentifier: null,
        engineComponentKey: _enginecomponentkeyenum.EngineComponentKey.UPDATE_MULTIPLE_RECORDS,
        hotKeys: null
    },
    mergeMultipleRecords: {
        universalIdentifier: '6c14eb04-8e7e-4d47-93c0-8ec4834e2e60',
        label: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
            id: "PvCGwJ",
            message: "Merge {objectLabelPlural}"
        }),
        icon: 'IconArrowMerge',
        isPinned: false,
        position: 12,
        shortLabel: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
            id: "uHk5U2",
            message: "Merge"
        }),
        availabilityType: _types.CommandMenuItemAvailabilityType.RECORD_SELECTION,
        conditionalAvailabilityExpression: 'not isSelectAll and numberOfSelectedRecords >= 2 and isDefined(objectMetadataItem.duplicateCriteria) and objectPermissions.canUpdateObjectRecords and objectPermissions.canDestroyObjectRecords and numberOfSelectedRecords <= 9',
        availabilityObjectMetadataUniversalIdentifier: null,
        frontComponentUniversalIdentifier: null,
        engineComponentKey: _enginecomponentkeyenum.EngineComponentKey.MERGE_MULTIPLE_RECORDS,
        hotKeys: null
    },
    importRecords: {
        universalIdentifier: 'a2dc9de7-4798-422e-bb55-bfad7b9bdbe8',
        label: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
            id: "k5fVFW",
            message: "Import {objectLabelPlural}"
        }),
        icon: 'IconFileImport',
        isPinned: false,
        position: 13,
        shortLabel: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
            id: "jTDnNG",
            message: "Import"
        }),
        availabilityType: _types.CommandMenuItemAvailabilityType.GLOBAL_OBJECT_CONTEXT,
        conditionalAvailabilityExpression: 'pageType == "INDEX_PAGE" and not hasAnySoftDeleteFilterOnView and permissionFlags.IMPORT_CSV',
        availabilityObjectMetadataUniversalIdentifier: null,
        frontComponentUniversalIdentifier: null,
        engineComponentKey: _enginecomponentkeyenum.EngineComponentKey.IMPORT_RECORDS,
        hotKeys: null
    },
    exportView: {
        universalIdentifier: '80680f2a-c426-48b3-a839-c63a6183dc4b',
        label: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
            id: "c5P53s",
            message: "Export View"
        }),
        icon: 'IconFileExport',
        isPinned: false,
        position: 14,
        shortLabel: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
            id: "PCGpYB",
            message: "Export"
        }),
        availabilityType: _types.CommandMenuItemAvailabilityType.GLOBAL_OBJECT_CONTEXT,
        conditionalAvailabilityExpression: 'pageType == "INDEX_PAGE" and permissionFlags.EXPORT_CSV',
        availabilityObjectMetadataUniversalIdentifier: null,
        frontComponentUniversalIdentifier: null,
        engineComponentKey: _enginecomponentkeyenum.EngineComponentKey.EXPORT_VIEW,
        hotKeys: null
    },
    seeDeletedRecords: {
        universalIdentifier: 'd63c21c3-9785-4750-be87-5f36269b8e0d',
        label: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
            id: "BCRQC8",
            message: "See deleted {objectLabelPlural}"
        }),
        icon: 'IconRotate2',
        isPinned: false,
        position: 15,
        shortLabel: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
            id: "pYUji4",
            message: "Deleted {objectLabelPlural}"
        }),
        availabilityType: _types.CommandMenuItemAvailabilityType.GLOBAL_OBJECT_CONTEXT,
        conditionalAvailabilityExpression: 'pageType == "INDEX_PAGE" and not hasAnySoftDeleteFilterOnView',
        availabilityObjectMetadataUniversalIdentifier: null,
        frontComponentUniversalIdentifier: null,
        engineComponentKey: _enginecomponentkeyenum.EngineComponentKey.SEE_DELETED_RECORDS,
        hotKeys: null
    },
    createNewView: {
        universalIdentifier: '6ec7c339-e167-431d-bec6-d1c737df677c',
        label: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
            id: "oh0oix",
            message: "Create View"
        }),
        icon: 'IconLayout',
        isPinned: false,
        position: 16,
        shortLabel: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
            id: "0ij6VP",
            message: "Create View"
        }),
        availabilityType: _types.CommandMenuItemAvailabilityType.GLOBAL_OBJECT_CONTEXT,
        conditionalAvailabilityExpression: 'pageType == "INDEX_PAGE" and not hasAnySoftDeleteFilterOnView',
        availabilityObjectMetadataUniversalIdentifier: null,
        frontComponentUniversalIdentifier: null,
        engineComponentKey: _enginecomponentkeyenum.EngineComponentKey.CREATE_NEW_VIEW,
        hotKeys: null
    },
    hideDeletedRecords: {
        universalIdentifier: '1420db7f-0fba-49e2-b23e-4b7caa0fafa0',
        label: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
            id: "rLnr2R",
            message: "Hide deleted {objectLabelPlural}"
        }),
        icon: 'IconEyeOff',
        isPinned: false,
        position: 17,
        shortLabel: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
            id: "YXvdC2",
            message: "Hide deleted"
        }),
        availabilityType: _types.CommandMenuItemAvailabilityType.GLOBAL_OBJECT_CONTEXT,
        conditionalAvailabilityExpression: 'pageType == "INDEX_PAGE" and hasAnySoftDeleteFilterOnView',
        availabilityObjectMetadataUniversalIdentifier: null,
        frontComponentUniversalIdentifier: null,
        engineComponentKey: _enginecomponentkeyenum.EngineComponentKey.HIDE_DELETED_RECORDS,
        hotKeys: null
    },
    editRecordPageLayout: {
        universalIdentifier: 'd9794c67-1799-424f-8871-5ea771dd4a6d',
        label: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
            id: "0YMUrV",
            message: "Edit Layout"
        }),
        icon: 'IconPencil',
        isPinned: false,
        position: 18,
        shortLabel: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
            id: "O+Be8v",
            message: "Edit Layout"
        }),
        availabilityType: _types.CommandMenuItemAvailabilityType.GLOBAL,
        conditionalAvailabilityExpression: 'pageType != "SETTINGS_PAGE" and not isLayoutCustomizationModeEnabled and permissionFlags.LAYOUTS',
        availabilityObjectMetadataUniversalIdentifier: null,
        frontComponentUniversalIdentifier: null,
        engineComponentKey: _enginecomponentkeyenum.EngineComponentKey.EDIT_RECORD_PAGE_LAYOUT,
        hotKeys: null
    },
    editDashboardLayout: {
        universalIdentifier: 'b9b53bbc-3129-4eb9-8344-c3f9628ffa7d',
        label: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
            id: "AEhPtE",
            message: "Edit Dashboard"
        }),
        icon: 'IconPencil',
        isPinned: true,
        position: 19,
        shortLabel: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
            id: "zhhpvr",
            message: "Edit"
        }),
        availabilityType: _types.CommandMenuItemAvailabilityType.RECORD_SELECTION,
        conditionalAvailabilityExpression: 'pageType == "RECORD_PAGE" and not isDashboardPageLayoutInEditMode and not isLayoutCustomizationModeEnabled and noneDefined(selectedRecords, "deletedAt") and everyDefined(selectedRecords, "pageLayoutId") and objectPermissions.canUpdateObjectRecords',
        availabilityObjectMetadataUniversalIdentifier: _metadata.STANDARD_OBJECTS.dashboard.universalIdentifier,
        frontComponentUniversalIdentifier: null,
        engineComponentKey: _enginecomponentkeyenum.EngineComponentKey.EDIT_DASHBOARD_LAYOUT,
        hotKeys: null
    },
    saveDashboardLayout: {
        universalIdentifier: '18b23908-f816-42ab-bc0a-eb5fae29c695',
        label: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
            id: "Zi3Ych",
            message: "Save Dashboard"
        }),
        icon: 'IconDeviceFloppy',
        isPinned: true,
        position: 20,
        shortLabel: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
            id: "8gi8vY",
            message: "Save"
        }),
        availabilityType: _types.CommandMenuItemAvailabilityType.RECORD_SELECTION,
        conditionalAvailabilityExpression: 'pageType == "RECORD_PAGE" and isDashboardPageLayoutInEditMode and noneDefined(selectedRecords, "deletedAt") and everyDefined(selectedRecords, "pageLayoutId") and objectPermissions.canUpdateObjectRecords',
        availabilityObjectMetadataUniversalIdentifier: _metadata.STANDARD_OBJECTS.dashboard.universalIdentifier,
        frontComponentUniversalIdentifier: null,
        engineComponentKey: _enginecomponentkeyenum.EngineComponentKey.SAVE_DASHBOARD_LAYOUT,
        hotKeys: null
    },
    cancelDashboardLayout: {
        universalIdentifier: '030ecd01-0aaf-4e6d-8400-105996548887',
        label: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
            id: "7g3N+g",
            message: "Cancel Edition"
        }),
        icon: 'IconCancel',
        isPinned: true,
        position: 21,
        shortLabel: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
            id: "PpmWQv",
            message: "Cancel"
        }),
        availabilityType: _types.CommandMenuItemAvailabilityType.RECORD_SELECTION,
        conditionalAvailabilityExpression: 'pageType == "RECORD_PAGE" and isDashboardPageLayoutInEditMode and noneDefined(selectedRecords, "deletedAt") and everyDefined(selectedRecords, "pageLayoutId") and objectPermissions.canUpdateObjectRecords',
        availabilityObjectMetadataUniversalIdentifier: _metadata.STANDARD_OBJECTS.dashboard.universalIdentifier,
        frontComponentUniversalIdentifier: null,
        engineComponentKey: _enginecomponentkeyenum.EngineComponentKey.CANCEL_DASHBOARD_LAYOUT,
        hotKeys: null
    },
    duplicateDashboard: {
        universalIdentifier: '2ee07307-60ce-41ef-bfee-7c718f67557e',
        label: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
            id: "zC/oFa",
            message: "Duplicate Dashboard"
        }),
        icon: 'IconCopyPlus',
        isPinned: false,
        position: 22,
        shortLabel: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
            id: "pcd2n0",
            message: "Duplicate"
        }),
        availabilityType: _types.CommandMenuItemAvailabilityType.RECORD_SELECTION,
        conditionalAvailabilityExpression: 'noneDefined(selectedRecords, "deletedAt") and objectPermissions.canUpdateObjectRecords',
        availabilityObjectMetadataUniversalIdentifier: _metadata.STANDARD_OBJECTS.dashboard.universalIdentifier,
        frontComponentUniversalIdentifier: null,
        engineComponentKey: _enginecomponentkeyenum.EngineComponentKey.DUPLICATE_DASHBOARD,
        hotKeys: null
    },
    activateWorkflow: {
        universalIdentifier: '44f19c85-0fd0-482f-a14e-da513c60b1b3',
        label: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
            id: "GJ1sW1",
            message: "Activate Workflow"
        }),
        icon: 'IconPower',
        isPinned: true,
        position: 23,
        shortLabel: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
            id: "X2aLVJ",
            message: "Activate"
        }),
        availabilityType: _types.CommandMenuItemAvailabilityType.RECORD_SELECTION,
        conditionalAvailabilityExpression: 'everyDefined(selectedRecords, "currentVersion.trigger") and everyDefined(selectedRecords, "currentVersion.steps") and every(selectedRecords, "currentVersion.steps.length") and (everyEquals(selectedRecords, "currentVersion.status", "DRAFT") or includesNone(selectedRecords, "statuses", "ACTIVE")) and noneDefined(selectedRecords, "deletedAt")',
        availabilityObjectMetadataUniversalIdentifier: _metadata.STANDARD_OBJECTS.workflow.universalIdentifier,
        frontComponentUniversalIdentifier: null,
        engineComponentKey: _enginecomponentkeyenum.EngineComponentKey.ACTIVATE_WORKFLOW,
        hotKeys: null
    },
    deactivateWorkflow: {
        universalIdentifier: '57f21a06-a17a-47b1-a123-90d90dbdf0b7',
        label: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
            id: "lPFYWf",
            message: "Deactivate Workflow"
        }),
        icon: 'IconPlayerPause',
        isPinned: true,
        position: 24,
        shortLabel: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
            id: "bpGbAD",
            message: "Deactivate"
        }),
        availabilityType: _types.CommandMenuItemAvailabilityType.RECORD_SELECTION,
        conditionalAvailabilityExpression: 'everyEquals(selectedRecords, "currentVersion.status", "ACTIVE") and noneDefined(selectedRecords, "deletedAt")',
        availabilityObjectMetadataUniversalIdentifier: _metadata.STANDARD_OBJECTS.workflow.universalIdentifier,
        frontComponentUniversalIdentifier: null,
        engineComponentKey: _enginecomponentkeyenum.EngineComponentKey.DEACTIVATE_WORKFLOW,
        hotKeys: null
    },
    discardDraftWorkflow: {
        universalIdentifier: '4c227f2e-03bb-4a66-9b13-49f263264f4a',
        label: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
            id: "T/2cxH",
            message: "Discard Draft"
        }),
        icon: 'IconNoteOff',
        isPinned: true,
        position: 25,
        shortLabel: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
            id: "HCcqwM",
            message: "Discard Draft"
        }),
        availabilityType: _types.CommandMenuItemAvailabilityType.RECORD_SELECTION,
        conditionalAvailabilityExpression: 'every(selectedRecords, "lastPublishedVersionId") and everyEquals(selectedRecords, "currentVersion.status", "DRAFT") and noneDefined(selectedRecords, "deletedAt")',
        availabilityObjectMetadataUniversalIdentifier: _metadata.STANDARD_OBJECTS.workflow.universalIdentifier,
        frontComponentUniversalIdentifier: null,
        engineComponentKey: _enginecomponentkeyenum.EngineComponentKey.DISCARD_DRAFT_WORKFLOW,
        hotKeys: null
    },
    testWorkflow: {
        universalIdentifier: 'f85d552a-87a3-4667-99f7-71b47917539c',
        label: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
            id: "71MK9Q",
            message: "Test Workflow"
        }),
        icon: 'IconPlayerPlay',
        isPinned: true,
        position: 26,
        shortLabel: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
            id: "qIIg23",
            message: "Test"
        }),
        availabilityType: _types.CommandMenuItemAvailabilityType.RECORD_SELECTION,
        conditionalAvailabilityExpression: 'everyDefined(selectedRecords, "currentVersion.trigger") and everyDefined(selectedRecords, "currentVersion.steps") and every(selectedRecords, "currentVersion.steps.length") and ((everyEquals(selectedRecords, "currentVersion.trigger.type", "MANUAL") and noneDefined(selectedRecords, "currentVersion.trigger.settings.objectType")) or everyEquals(selectedRecords, "currentVersion.trigger.type", "WEBHOOK") or everyEquals(selectedRecords, "currentVersion.trigger.type", "CRON")) and noneDefined(selectedRecords, "deletedAt")',
        availabilityObjectMetadataUniversalIdentifier: _metadata.STANDARD_OBJECTS.workflow.universalIdentifier,
        frontComponentUniversalIdentifier: null,
        engineComponentKey: _enginecomponentkeyenum.EngineComponentKey.TEST_WORKFLOW,
        hotKeys: null
    },
    seeActiveVersionWorkflow: {
        universalIdentifier: '31790508-75ff-4e4c-a768-83bd1b0718e0',
        label: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
            id: "BqBYOO",
            message: "See Active Version"
        }),
        icon: 'IconVersions',
        isPinned: false,
        position: 27,
        shortLabel: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
            id: "BWZaOR",
            message: "See Active Version"
        }),
        availabilityType: _types.CommandMenuItemAvailabilityType.RECORD_SELECTION,
        conditionalAvailabilityExpression: 'includesEvery(selectedRecords, "statuses", "ACTIVE") and includesEvery(selectedRecords, "statuses", "DRAFT") and noneDefined(selectedRecords, "deletedAt")',
        availabilityObjectMetadataUniversalIdentifier: _metadata.STANDARD_OBJECTS.workflow.universalIdentifier,
        frontComponentUniversalIdentifier: null,
        engineComponentKey: _enginecomponentkeyenum.EngineComponentKey.SEE_ACTIVE_VERSION_WORKFLOW,
        hotKeys: null
    },
    seeRunsWorkflow: {
        universalIdentifier: 'e57efc2d-00a2-493a-b76c-f2dabd23a5eb',
        label: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
            id: "VGVS7x",
            message: "See Runs"
        }),
        icon: 'IconHistoryToggle',
        isPinned: true,
        position: 28,
        shortLabel: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
            id: "iWhqvt",
            message: "See Runs"
        }),
        availabilityType: _types.CommandMenuItemAvailabilityType.RECORD_SELECTION,
        conditionalAvailabilityExpression: 'noneDefined(selectedRecords, "deletedAt")',
        availabilityObjectMetadataUniversalIdentifier: _metadata.STANDARD_OBJECTS.workflow.universalIdentifier,
        frontComponentUniversalIdentifier: null,
        engineComponentKey: _enginecomponentkeyenum.EngineComponentKey.SEE_RUNS_WORKFLOW,
        hotKeys: null
    },
    seeVersionsWorkflow: {
        universalIdentifier: '92781d24-b875-4282-8cdb-d127f04a5c7d',
        label: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
            id: "VsCNJG",
            message: "See Versions History"
        }),
        icon: 'IconVersions',
        isPinned: false,
        position: 29,
        shortLabel: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
            id: "cyovqN",
            message: "See Versions"
        }),
        availabilityType: _types.CommandMenuItemAvailabilityType.RECORD_SELECTION,
        conditionalAvailabilityExpression: 'noneDefined(selectedRecords, "deletedAt")',
        availabilityObjectMetadataUniversalIdentifier: _metadata.STANDARD_OBJECTS.workflow.universalIdentifier,
        frontComponentUniversalIdentifier: null,
        engineComponentKey: _enginecomponentkeyenum.EngineComponentKey.SEE_VERSIONS_WORKFLOW,
        hotKeys: null
    },
    addNodeWorkflow: {
        universalIdentifier: '818117fa-6cad-4ebc-83c1-40f4afc28d94',
        label: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
            id: "czQdYE",
            message: "Add a Node"
        }),
        icon: 'IconPlus',
        isPinned: true,
        position: 30,
        shortLabel: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
            id: "Opy73Z",
            message: "Add a Node"
        }),
        availabilityType: _types.CommandMenuItemAvailabilityType.RECORD_SELECTION,
        conditionalAvailabilityExpression: 'pageType == "RECORD_PAGE" and everyDefined(selectedRecords, "currentVersion.trigger") and everyDefined(selectedRecords, "currentVersion.steps") and every(selectedRecords, "currentVersion.steps.length") and noneDefined(selectedRecords, "deletedAt")',
        availabilityObjectMetadataUniversalIdentifier: _metadata.STANDARD_OBJECTS.workflow.universalIdentifier,
        frontComponentUniversalIdentifier: null,
        engineComponentKey: _enginecomponentkeyenum.EngineComponentKey.ADD_NODE_WORKFLOW,
        hotKeys: null
    },
    tidyUpWorkflow: {
        universalIdentifier: '1f3a3cab-161a-4775-af47-11be4d0bf411',
        label: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
            id: "l+VvdV",
            message: "Tidy up Workflow"
        }),
        icon: 'IconReorder',
        isPinned: false,
        position: 31,
        shortLabel: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
            id: "g9BupG",
            message: "Tidy up"
        }),
        availabilityType: _types.CommandMenuItemAvailabilityType.RECORD_SELECTION,
        conditionalAvailabilityExpression: 'pageType == "RECORD_PAGE" and everyDefined(selectedRecords, "currentVersion.trigger") and everyDefined(selectedRecords, "currentVersion.steps") and every(selectedRecords, "currentVersion.steps.length") and noneDefined(selectedRecords, "deletedAt")',
        availabilityObjectMetadataUniversalIdentifier: _metadata.STANDARD_OBJECTS.workflow.universalIdentifier,
        frontComponentUniversalIdentifier: null,
        engineComponentKey: _enginecomponentkeyenum.EngineComponentKey.TIDY_UP_WORKFLOW,
        hotKeys: null
    },
    duplicateWorkflow: {
        universalIdentifier: '91094438-b4c2-46ad-a23b-8af4b23ba514',
        label: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
            id: "pGyA0g",
            message: "Duplicate Workflow"
        }),
        icon: 'IconCopy',
        isPinned: false,
        position: 32,
        shortLabel: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
            id: "pcd2n0",
            message: "Duplicate"
        }),
        availabilityType: _types.CommandMenuItemAvailabilityType.RECORD_SELECTION,
        conditionalAvailabilityExpression: 'everyDefined(selectedRecords, "currentVersion") and noneDefined(selectedRecords, "deletedAt")',
        availabilityObjectMetadataUniversalIdentifier: _metadata.STANDARD_OBJECTS.workflow.universalIdentifier,
        frontComponentUniversalIdentifier: null,
        engineComponentKey: _enginecomponentkeyenum.EngineComponentKey.DUPLICATE_WORKFLOW,
        hotKeys: null
    },
    seeVersionWorkflowRun: {
        universalIdentifier: 'cc3a065c-c89e-40ac-9449-4272c55b1bb8',
        label: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
            id: "pRQO5R",
            message: "See Version"
        }),
        icon: 'IconVersions',
        isPinned: true,
        position: 33,
        shortLabel: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
            id: "onFkTP",
            message: "See Version"
        }),
        availabilityType: _types.CommandMenuItemAvailabilityType.RECORD_SELECTION,
        conditionalAvailabilityExpression: null,
        availabilityObjectMetadataUniversalIdentifier: _metadata.STANDARD_OBJECTS.workflowRun.universalIdentifier,
        frontComponentUniversalIdentifier: null,
        engineComponentKey: _enginecomponentkeyenum.EngineComponentKey.SEE_VERSION_WORKFLOW_RUN,
        hotKeys: null
    },
    seeWorkflowWorkflowRun: {
        universalIdentifier: '9d9cc62d-3543-45c3-93f3-23d2d8979f2b',
        label: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
            id: "gIacCF",
            message: "See Workflow"
        }),
        icon: 'IconSettingsAutomation',
        isPinned: true,
        position: 34,
        shortLabel: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
            id: "kRmDjY",
            message: "See Workflow"
        }),
        availabilityType: _types.CommandMenuItemAvailabilityType.RECORD_SELECTION,
        conditionalAvailabilityExpression: null,
        availabilityObjectMetadataUniversalIdentifier: _metadata.STANDARD_OBJECTS.workflowRun.universalIdentifier,
        frontComponentUniversalIdentifier: null,
        engineComponentKey: _enginecomponentkeyenum.EngineComponentKey.SEE_WORKFLOW_WORKFLOW_RUN,
        hotKeys: null
    },
    stopWorkflowRun: {
        universalIdentifier: '4c186606-9515-4561-a1eb-9a072b4f5e58',
        label: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
            id: "jBXpZT",
            message: "Stop"
        }),
        icon: 'IconPlayerStop',
        isPinned: true,
        position: 35,
        shortLabel: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
            id: "9nbPBZ",
            message: "Stop"
        }),
        availabilityType: _types.CommandMenuItemAvailabilityType.RECORD_SELECTION,
        conditionalAvailabilityExpression: 'isSelectAll or someEquals(selectedRecords, "status", "NOT_STARTED") or someEquals(selectedRecords, "status", "ENQUEUED") or someEquals(selectedRecords, "status", "RUNNING")',
        availabilityObjectMetadataUniversalIdentifier: _metadata.STANDARD_OBJECTS.workflowRun.universalIdentifier,
        frontComponentUniversalIdentifier: null,
        engineComponentKey: _enginecomponentkeyenum.EngineComponentKey.STOP_WORKFLOW_RUN,
        hotKeys: null
    },
    retryWorkflowRun: {
        universalIdentifier: '99b97c50-b31b-411a-a532-ec05402123c0',
        label: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
            id: "xKCu0t",
            message: "Retry"
        }),
        icon: 'IconRefresh',
        isPinned: true,
        position: 36,
        shortLabel: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
            id: "Q5lxQn",
            message: "Retry"
        }),
        availabilityType: _types.CommandMenuItemAvailabilityType.RECORD_SELECTION,
        conditionalAvailabilityExpression: 'someEquals(selectedRecords, "status", "FAILED")',
        availabilityObjectMetadataUniversalIdentifier: _metadata.STANDARD_OBJECTS.workflowRun.universalIdentifier,
        frontComponentUniversalIdentifier: null,
        engineComponentKey: _enginecomponentkeyenum.EngineComponentKey.RETRY_WORKFLOW_RUN,
        hotKeys: null
    },
    seeRunsWorkflowVersion: {
        universalIdentifier: '44e305c7-4f0a-45ec-803f-6471b56455cb',
        label: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
            id: "VGVS7x",
            message: "See Runs"
        }),
        icon: 'IconHistoryToggle',
        isPinned: true,
        position: 37,
        shortLabel: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
            id: "iWhqvt",
            message: "See Runs"
        }),
        availabilityType: _types.CommandMenuItemAvailabilityType.RECORD_SELECTION,
        conditionalAvailabilityExpression: 'everyDefined(selectedRecords, "workflow")',
        availabilityObjectMetadataUniversalIdentifier: _metadata.STANDARD_OBJECTS.workflowVersion.universalIdentifier,
        frontComponentUniversalIdentifier: null,
        engineComponentKey: _enginecomponentkeyenum.EngineComponentKey.SEE_RUNS_WORKFLOW_VERSION,
        hotKeys: null
    },
    seeWorkflowWorkflowVersion: {
        universalIdentifier: 'b43052db-023e-4083-9b63-2c2dfbfd1320',
        label: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
            id: "gIacCF",
            message: "See Workflow"
        }),
        icon: 'IconSettingsAutomation',
        isPinned: true,
        position: 38,
        shortLabel: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
            id: "kRmDjY",
            message: "See Workflow"
        }),
        availabilityType: _types.CommandMenuItemAvailabilityType.RECORD_SELECTION,
        conditionalAvailabilityExpression: 'everyDefined(selectedRecords, "workflow.id")',
        availabilityObjectMetadataUniversalIdentifier: _metadata.STANDARD_OBJECTS.workflowVersion.universalIdentifier,
        frontComponentUniversalIdentifier: null,
        engineComponentKey: _enginecomponentkeyenum.EngineComponentKey.SEE_WORKFLOW_WORKFLOW_VERSION,
        hotKeys: null
    },
    useAsDraftWorkflowVersion: {
        universalIdentifier: '483c0c1d-ea4d-4a4d-8a59-2dcf9f8e38f6',
        label: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
            id: "xwq0b4",
            message: "Use as Draft"
        }),
        icon: 'IconPencil',
        isPinned: true,
        position: 39,
        shortLabel: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
            id: "4Pp2U8",
            message: "Use as Draft"
        }),
        availabilityType: _types.CommandMenuItemAvailabilityType.RECORD_SELECTION,
        conditionalAvailabilityExpression: 'noneEquals(selectedRecords, "status", "DRAFT")',
        availabilityObjectMetadataUniversalIdentifier: _metadata.STANDARD_OBJECTS.workflowVersion.universalIdentifier,
        frontComponentUniversalIdentifier: null,
        engineComponentKey: _enginecomponentkeyenum.EngineComponentKey.USE_AS_DRAFT_WORKFLOW_VERSION,
        hotKeys: null
    },
    seeVersionsWorkflowVersion: {
        universalIdentifier: '1d4abeb7-2750-4af7-9a92-fbadd2a9e4ba',
        label: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
            id: "VsCNJG",
            message: "See Versions History"
        }),
        icon: 'IconVersions',
        isPinned: false,
        position: 40,
        shortLabel: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
            id: "cyovqN",
            message: "See Versions"
        }),
        availabilityType: _types.CommandMenuItemAvailabilityType.RECORD_SELECTION,
        conditionalAvailabilityExpression: 'everyDefined(selectedRecords, "workflow")',
        availabilityObjectMetadataUniversalIdentifier: _metadata.STANDARD_OBJECTS.workflowVersion.universalIdentifier,
        frontComponentUniversalIdentifier: null,
        engineComponentKey: _enginecomponentkeyenum.EngineComponentKey.SEE_VERSIONS_WORKFLOW_VERSION,
        hotKeys: null
    },
    searchRecords: {
        universalIdentifier: 'fa24e25e-68f8-4548-82ff-c7b5168b7c7d',
        label: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
            id: "DZ9raS",
            message: "Search"
        }),
        icon: 'IconSearch',
        isPinned: false,
        position: 41,
        shortLabel: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
            id: "LVKOhh",
            message: "Search"
        }),
        availabilityType: _types.CommandMenuItemAvailabilityType.GLOBAL,
        conditionalAvailabilityExpression: null,
        availabilityObjectMetadataUniversalIdentifier: null,
        frontComponentUniversalIdentifier: null,
        engineComponentKey: _enginecomponentkeyenum.EngineComponentKey.SEARCH_RECORDS,
        hotKeys: [
            '/'
        ]
    },
    searchRecordsFallback: {
        universalIdentifier: 'c659890c-7266-46c9-bfe1-75cefff8b6d0',
        label: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
            id: "DZ9raS",
            message: "Search"
        }),
        icon: 'IconSearch',
        isPinned: false,
        position: 42,
        shortLabel: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
            id: "LVKOhh",
            message: "Search"
        }),
        availabilityType: _types.CommandMenuItemAvailabilityType.FALLBACK,
        conditionalAvailabilityExpression: null,
        availabilityObjectMetadataUniversalIdentifier: null,
        frontComponentUniversalIdentifier: null,
        engineComponentKey: _enginecomponentkeyenum.EngineComponentKey.SEARCH_RECORDS_FALLBACK,
        hotKeys: [
            '/'
        ]
    },
    askAi: {
        universalIdentifier: 'ce5fb54d-2b19-4dd1-b7b4-9532a1761a41',
        label: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
            id: "ITCVsf",
            message: "Ask AI"
        }),
        icon: 'IconMessageCirclePlus',
        isPinned: true,
        position: 43,
        shortLabel: null,
        availabilityType: _types.CommandMenuItemAvailabilityType.GLOBAL,
        conditionalAvailabilityExpression: 'permissionFlags.AI and not isInSidePanel',
        availabilityObjectMetadataUniversalIdentifier: null,
        frontComponentUniversalIdentifier: null,
        engineComponentKey: _enginecomponentkeyenum.EngineComponentKey.ASK_AI,
        hotKeys: [
            '@'
        ]
    },
    viewPreviousAiChats: {
        universalIdentifier: '3084c3c9-cc23-4dad-9e00-92025f5cba7a',
        label: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
            id: "pAoCL6",
            message: "View Previous AI Chats"
        }),
        icon: 'IconHistory',
        isPinned: false,
        position: 44,
        shortLabel: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
            id: "ysRzX6",
            message: "Previous AI Chats"
        }),
        availabilityType: _types.CommandMenuItemAvailabilityType.GLOBAL,
        conditionalAvailabilityExpression: 'permissionFlags.AI',
        availabilityObjectMetadataUniversalIdentifier: null,
        frontComponentUniversalIdentifier: null,
        engineComponentKey: _enginecomponentkeyenum.EngineComponentKey.VIEW_PREVIOUS_AI_CHATS,
        hotKeys: null
    },
    replyToEmailThread: {
        universalIdentifier: '8f015cbd-c764-434e-a6c6-bb7581b4be44',
        label: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
            id: "U4APCE",
            message: "Reply"
        }),
        icon: 'IconArrowBackUp',
        isPinned: true,
        position: 45,
        shortLabel: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
            id: "2LlOmm",
            message: "Reply"
        }),
        availabilityType: _types.CommandMenuItemAvailabilityType.RECORD_SELECTION,
        conditionalAvailabilityExpression: 'numberOfSelectedRecords == 1',
        availabilityObjectMetadataUniversalIdentifier: _metadata.STANDARD_OBJECTS.messageThread.universalIdentifier,
        frontComponentUniversalIdentifier: null,
        engineComponentKey: _enginecomponentkeyenum.EngineComponentKey.REPLY_TO_EMAIL_THREAD,
        hotKeys: null
    },
    composeEmail: {
        universalIdentifier: '96457c5a-b028-4d48-94e3-27f4c41296b8',
        label: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
            id: "6Kufr1",
            message: "Compose Email"
        }),
        icon: 'IconMail',
        isPinned: false,
        position: 46,
        shortLabel: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
            id: "a9mYsP",
            message: "Compose"
        }),
        availabilityType: _types.CommandMenuItemAvailabilityType.GLOBAL,
        conditionalAvailabilityExpression: 'permissionFlags.SEND_EMAIL_TOOL',
        availabilityObjectMetadataUniversalIdentifier: null,
        frontComponentUniversalIdentifier: null,
        engineComponentKey: _enginecomponentkeyenum.EngineComponentKey.COMPOSE_EMAIL,
        hotKeys: null
    },
    composeCampaign: {
        universalIdentifier: '30473656-e7cb-42e0-b198-6c4e8b906106',
        label: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
            id: "+TR7Gb",
            message: "Compose Campaign"
        }),
        icon: 'IconSend',
        isPinned: false,
        position: 66,
        shortLabel: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
            id: "swt/ln",
            message: "Campaign"
        }),
        availabilityType: _types.CommandMenuItemAvailabilityType.GLOBAL,
        conditionalAvailabilityExpression: 'featureFlags.IS_EMAIL_GROUP_ENABLED',
        availabilityObjectMetadataUniversalIdentifier: null,
        frontComponentUniversalIdentifier: null,
        engineComponentKey: _enginecomponentkeyenum.EngineComponentKey.COMPOSE_CAMPAIGN,
        hotKeys: null
    },
    composeCampaignPinned: {
        universalIdentifier: '7ad6f0c7-ac02-4062-b5cf-1f36e1664bc8',
        label: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
            id: "fyryIW",
            message: "Create new Campaign"
        }),
        icon: 'IconPlus',
        isPinned: true,
        position: 67,
        shortLabel: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
            id: "YT3d3p",
            message: "New Campaign"
        }),
        availabilityType: _types.CommandMenuItemAvailabilityType.GLOBAL_OBJECT_CONTEXT,
        conditionalAvailabilityExpression: 'pageType == "INDEX_PAGE" and featureFlags.IS_EMAIL_GROUP_ENABLED',
        availabilityObjectMetadataUniversalIdentifier: _metadata.STANDARD_OBJECTS.messageCampaign.universalIdentifier,
        frontComponentUniversalIdentifier: null,
        engineComponentKey: _enginecomponentkeyenum.EngineComponentKey.COMPOSE_CAMPAIGN,
        hotKeys: null
    },
    sendMessageCampaign: {
        universalIdentifier: 'b08f4ccd-070b-460f-a4b6-6d0c14f1c44d',
        label: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
            id: "w7dUdB",
            message: "Send Campaign"
        }),
        icon: 'IconSend',
        isPinned: true,
        position: 68,
        shortLabel: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
            id: "dj45uB",
            message: "Send"
        }),
        availabilityType: _types.CommandMenuItemAvailabilityType.RECORD_SELECTION,
        conditionalAvailabilityExpression: 'numberOfSelectedRecords >= 1 and everyEquals(selectedRecords, "status", "DRAFT") and noneDefined(selectedRecords, "deletedAt")',
        availabilityObjectMetadataUniversalIdentifier: _metadata.STANDARD_OBJECTS.messageCampaign.universalIdentifier,
        frontComponentUniversalIdentifier: null,
        engineComponentKey: _enginecomponentkeyenum.EngineComponentKey.SEND_MESSAGE_CAMPAIGN,
        hotKeys: null
    },
    sendMessageCampaignTest: {
        universalIdentifier: 'a6e6fd08-2c75-4d43-8795-1baafbac165e',
        label: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
            id: "+dLR8z",
            message: "Send Test Email"
        }),
        icon: 'IconMail',
        isPinned: true,
        position: 69,
        shortLabel: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
            id: "qIIg23",
            message: "Test"
        }),
        availabilityType: _types.CommandMenuItemAvailabilityType.RECORD_SELECTION,
        conditionalAvailabilityExpression: 'numberOfSelectedRecords >= 1 and everyEquals(selectedRecords, "status", "DRAFT") and noneDefined(selectedRecords, "deletedAt")',
        availabilityObjectMetadataUniversalIdentifier: _metadata.STANDARD_OBJECTS.messageCampaign.universalIdentifier,
        frontComponentUniversalIdentifier: null,
        engineComponentKey: _enginecomponentkeyenum.EngineComponentKey.SEND_MESSAGE_CAMPAIGN_TEST,
        hotKeys: null
    },
    emailBlockSettings: {
        universalIdentifier: '5c8a2f41-97be-4f3d-9a46-2f18d17f30a2',
        label: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
            id: "/q4AFh",
            message: "Block Settings"
        }),
        icon: 'IconAdjustments',
        isPinned: true,
        position: 70,
        shortLabel: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
            id: "ufaNs2",
            message: "Design"
        }),
        availabilityType: _types.CommandMenuItemAvailabilityType.RECORD_SELECTION,
        conditionalAvailabilityExpression: 'pageType == "RECORD_PAGE" and numberOfSelectedRecords == 1 and everyEquals(selectedRecords, "status", "DRAFT") and noneDefined(selectedRecords, "deletedAt")',
        availabilityObjectMetadataUniversalIdentifier: _metadata.STANDARD_OBJECTS.messageCampaign.universalIdentifier,
        frontComponentUniversalIdentifier: null,
        engineComponentKey: _enginecomponentkeyenum.EngineComponentKey.EMAIL_BLOCK_SETTINGS,
        hotKeys: null
    },
    goToSettings: {
        universalIdentifier: 'ef9aba44-0068-453e-930a-f8c182af18ee',
        label: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
            id: "Rrvufq",
            message: "Go to Settings"
        }),
        icon: 'IconSettings',
        isPinned: false,
        position: 47,
        shortLabel: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
            id: "vGWuPM",
            message: "Settings"
        }),
        availabilityType: _types.CommandMenuItemAvailabilityType.GLOBAL,
        conditionalAvailabilityExpression: null,
        availabilityObjectMetadataUniversalIdentifier: null,
        frontComponentUniversalIdentifier: null,
        engineComponentKey: _enginecomponentkeyenum.EngineComponentKey.NAVIGATION,
        hotKeys: [
            'G',
            'S'
        ],
        payload: {
            path: '/settings/profile'
        }
    },
    goToSettingsExperience: {
        universalIdentifier: 'bceb0328-c018-48ba-80d8-a1a97dc0a8ba',
        label: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
            id: "46ZD9h",
            message: "Go to Experience Settings"
        }),
        icon: 'IconColorSwatch',
        isPinned: false,
        position: 48,
        shortLabel: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
            id: "Xu8Qin",
            message: "Experience"
        }),
        availabilityType: _types.CommandMenuItemAvailabilityType.GLOBAL,
        conditionalAvailabilityExpression: null,
        availabilityObjectMetadataUniversalIdentifier: null,
        frontComponentUniversalIdentifier: null,
        engineComponentKey: _enginecomponentkeyenum.EngineComponentKey.NAVIGATION,
        hotKeys: null,
        payload: {
            path: '/settings/experience'
        }
    },
    goToSettingsAccounts: {
        universalIdentifier: '447a65cc-8535-408e-9c48-db24affb7530',
        label: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
            id: "LZngY5",
            message: "Go to Accounts Settings"
        }),
        icon: 'IconAt',
        isPinned: false,
        position: 49,
        shortLabel: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
            id: "YXbAfa",
            message: "Accounts"
        }),
        availabilityType: _types.CommandMenuItemAvailabilityType.GLOBAL,
        conditionalAvailabilityExpression: 'permissionFlags.CONNECTED_ACCOUNTS',
        availabilityObjectMetadataUniversalIdentifier: null,
        frontComponentUniversalIdentifier: null,
        engineComponentKey: _enginecomponentkeyenum.EngineComponentKey.NAVIGATION,
        hotKeys: null,
        payload: {
            path: '/settings/accounts'
        }
    },
    goToSettingsAccountsEmails: {
        universalIdentifier: '4feab22c-165f-4d13-81ca-c9eb6082ca50',
        label: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
            id: "gawQTB",
            message: "Go to Emails Settings"
        }),
        icon: 'IconMail',
        isPinned: false,
        position: 50,
        shortLabel: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
            id: "zhPcjs",
            message: "Emails"
        }),
        availabilityType: _types.CommandMenuItemAvailabilityType.GLOBAL,
        conditionalAvailabilityExpression: 'permissionFlags.CONNECTED_ACCOUNTS',
        availabilityObjectMetadataUniversalIdentifier: null,
        frontComponentUniversalIdentifier: null,
        engineComponentKey: _enginecomponentkeyenum.EngineComponentKey.NAVIGATION,
        hotKeys: null,
        payload: {
            path: '/settings/accounts/emails'
        }
    },
    goToSettingsAccountsCalendars: {
        universalIdentifier: '3267ec0e-9dee-4d9b-8f1b-6005bfd90202',
        label: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
            id: "BKhayt",
            message: "Go to Calendars Settings"
        }),
        icon: 'IconCalendarEvent',
        isPinned: false,
        position: 51,
        shortLabel: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
            id: "0U7DBn",
            message: "Calendars"
        }),
        availabilityType: _types.CommandMenuItemAvailabilityType.GLOBAL,
        conditionalAvailabilityExpression: 'permissionFlags.CONNECTED_ACCOUNTS',
        availabilityObjectMetadataUniversalIdentifier: null,
        frontComponentUniversalIdentifier: null,
        engineComponentKey: _enginecomponentkeyenum.EngineComponentKey.NAVIGATION,
        hotKeys: null,
        payload: {
            path: '/settings/accounts/calendars'
        }
    },
    goToSettingsGeneral: {
        universalIdentifier: 'ad68e516-96ea-455a-a838-c59788e88c23',
        label: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
            id: "gfZlPy",
            message: "Go to General Settings"
        }),
        icon: 'IconSettings',
        isPinned: false,
        position: 52,
        shortLabel: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
            id: "xCHHEH",
            message: "General"
        }),
        availabilityType: _types.CommandMenuItemAvailabilityType.GLOBAL,
        conditionalAvailabilityExpression: 'permissionFlags.WORKSPACE',
        availabilityObjectMetadataUniversalIdentifier: null,
        frontComponentUniversalIdentifier: null,
        engineComponentKey: _enginecomponentkeyenum.EngineComponentKey.NAVIGATION,
        hotKeys: null,
        payload: {
            path: '/settings/general'
        }
    },
    goToSettingsObjects: {
        universalIdentifier: '9302bfeb-f6cd-4858-ab5b-5f70f4d358c4',
        label: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
            id: "dZPXqH",
            message: "Go to Data Model Settings"
        }),
        icon: 'IconHierarchy',
        isPinned: false,
        position: 53,
        shortLabel: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
            id: "zU5mL2",
            message: "Data Model"
        }),
        availabilityType: _types.CommandMenuItemAvailabilityType.GLOBAL,
        conditionalAvailabilityExpression: 'permissionFlags.DATA_MODEL',
        availabilityObjectMetadataUniversalIdentifier: null,
        frontComponentUniversalIdentifier: null,
        engineComponentKey: _enginecomponentkeyenum.EngineComponentKey.NAVIGATION,
        hotKeys: null,
        payload: {
            path: '/settings/objects'
        }
    },
    goToSettingsMembers: {
        universalIdentifier: 'fb4d9f1b-5b13-49d9-8353-80041719d411',
        label: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
            id: "vPl+B/",
            message: "Go to Members Settings"
        }),
        icon: 'IconUsers',
        isPinned: false,
        position: 54,
        shortLabel: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
            id: "sMsvyG",
            message: "Members"
        }),
        availabilityType: _types.CommandMenuItemAvailabilityType.GLOBAL,
        conditionalAvailabilityExpression: 'permissionFlags.WORKSPACE_MEMBERS',
        availabilityObjectMetadataUniversalIdentifier: null,
        frontComponentUniversalIdentifier: null,
        engineComponentKey: _enginecomponentkeyenum.EngineComponentKey.NAVIGATION,
        hotKeys: null,
        payload: {
            path: '/settings/members'
        }
    },
    goToSettingsRoles: {
        universalIdentifier: '4050f307-c592-4c9f-ad91-89cde330fbf7',
        label: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
            id: "qN3wNQ",
            message: "Go to Roles Settings"
        }),
        icon: 'IconLock',
        isPinned: false,
        position: 55,
        shortLabel: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
            id: "EeAlta",
            message: "Roles"
        }),
        availabilityType: _types.CommandMenuItemAvailabilityType.GLOBAL,
        conditionalAvailabilityExpression: 'permissionFlags.WORKSPACE_MEMBERS',
        availabilityObjectMetadataUniversalIdentifier: null,
        frontComponentUniversalIdentifier: null,
        engineComponentKey: _enginecomponentkeyenum.EngineComponentKey.NAVIGATION,
        hotKeys: null,
        payload: {
            path: '/settings/members#roles'
        }
    },
    goToSettingsDomains: {
        universalIdentifier: '2d071684-fb5e-4222-b560-4c7ab2597fb4',
        label: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
            id: "OLopIl",
            message: "Go to Domains Settings"
        }),
        icon: 'IconWorld',
        isPinned: false,
        position: 56,
        shortLabel: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
            id: "Vhbzaf",
            message: "Domains"
        }),
        availabilityType: _types.CommandMenuItemAvailabilityType.GLOBAL,
        conditionalAvailabilityExpression: 'permissionFlags.WORKSPACE',
        availabilityObjectMetadataUniversalIdentifier: null,
        frontComponentUniversalIdentifier: null,
        engineComponentKey: _enginecomponentkeyenum.EngineComponentKey.NAVIGATION,
        hotKeys: null,
        payload: {
            path: '/settings/domains'
        }
    },
    goToSettingsBilling: {
        universalIdentifier: 'f46a0fb9-14e9-4d48-801d-c33bdd543f74',
        label: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
            id: "tlIbgN",
            message: "Go to Billing Settings"
        }),
        icon: 'IconCreditCard',
        isPinned: false,
        position: 57,
        shortLabel: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
            id: "8mCUlb",
            message: "Billing"
        }),
        availabilityType: _types.CommandMenuItemAvailabilityType.GLOBAL,
        conditionalAvailabilityExpression: 'permissionFlags.WORKSPACE',
        availabilityObjectMetadataUniversalIdentifier: null,
        frontComponentUniversalIdentifier: null,
        engineComponentKey: _enginecomponentkeyenum.EngineComponentKey.NAVIGATION,
        hotKeys: null,
        payload: {
            path: '/settings/billing'
        }
    },
    goToSettingsApiWebhooks: {
        universalIdentifier: 'ed2c2fde-1e7a-4a42-ba63-221eaa7c9759',
        label: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
            id: "1EPmDp",
            message: "Go to MCP & APIs Settings"
        }),
        icon: 'IconPlug',
        isPinned: false,
        position: 58,
        shortLabel: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
            id: "E+ckGV",
            message: "MCP & APIs"
        }),
        availabilityType: _types.CommandMenuItemAvailabilityType.GLOBAL,
        conditionalAvailabilityExpression: 'permissionFlags.API_KEYS_AND_WEBHOOKS',
        availabilityObjectMetadataUniversalIdentifier: null,
        frontComponentUniversalIdentifier: null,
        engineComponentKey: _enginecomponentkeyenum.EngineComponentKey.NAVIGATION,
        hotKeys: null,
        payload: {
            path: '/settings/api-webhooks'
        }
    },
    goToSettingsApplications: {
        universalIdentifier: '44db6d7a-79ac-485e-b3da-da8776bd7777',
        label: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
            id: "60o/+J",
            message: "Go to Apps Settings"
        }),
        icon: 'IconApps',
        isPinned: false,
        position: 59,
        shortLabel: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
            id: "zMMTZj",
            message: "Apps"
        }),
        availabilityType: _types.CommandMenuItemAvailabilityType.GLOBAL,
        conditionalAvailabilityExpression: 'permissionFlags.APPLICATIONS',
        availabilityObjectMetadataUniversalIdentifier: null,
        frontComponentUniversalIdentifier: null,
        engineComponentKey: _enginecomponentkeyenum.EngineComponentKey.NAVIGATION,
        hotKeys: null,
        payload: {
            path: '/settings/applications'
        }
    },
    goToSettingsAI: {
        universalIdentifier: '3eaec228-809d-452d-b5ef-7b777398c538',
        label: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
            id: "iLqs3S",
            message: "Go to AI Settings"
        }),
        icon: 'IconSparkles',
        isPinned: false,
        position: 60,
        shortLabel: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
            id: "9cFndZ",
            message: "AI"
        }),
        availabilityType: _types.CommandMenuItemAvailabilityType.GLOBAL,
        conditionalAvailabilityExpression: 'permissionFlags.WORKSPACE',
        availabilityObjectMetadataUniversalIdentifier: null,
        frontComponentUniversalIdentifier: null,
        engineComponentKey: _enginecomponentkeyenum.EngineComponentKey.NAVIGATION,
        hotKeys: null,
        payload: {
            path: '/settings/ai'
        }
    },
    goToSettingsSecurity: {
        universalIdentifier: '358e69b2-0789-44e2-add7-bdef68413be8',
        label: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
            id: "xAAHTC",
            message: "Go to Security Settings"
        }),
        icon: 'IconKey',
        isPinned: false,
        position: 61,
        shortLabel: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
            id: "0Hcw3b",
            message: "Security"
        }),
        availabilityType: _types.CommandMenuItemAvailabilityType.GLOBAL,
        conditionalAvailabilityExpression: 'permissionFlags.SECURITY',
        availabilityObjectMetadataUniversalIdentifier: null,
        frontComponentUniversalIdentifier: null,
        engineComponentKey: _enginecomponentkeyenum.EngineComponentKey.NAVIGATION,
        hotKeys: null,
        payload: {
            path: '/settings/security'
        }
    },
    goToSettingsAdminPanel: {
        universalIdentifier: 'dd22798b-fca6-42af-ba3b-0d48f263afbd',
        label: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
            id: "tKVJbL",
            message: "Go to Admin Panel Settings"
        }),
        icon: 'IconServer',
        isPinned: false,
        position: 62,
        shortLabel: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
            id: "/fcRNd",
            message: "Admin Panel"
        }),
        availabilityType: _types.CommandMenuItemAvailabilityType.GLOBAL,
        conditionalAvailabilityExpression: 'canImpersonate or canAccessFullAdminPanel',
        availabilityObjectMetadataUniversalIdentifier: null,
        frontComponentUniversalIdentifier: null,
        engineComponentKey: _enginecomponentkeyenum.EngineComponentKey.NAVIGATION,
        hotKeys: null,
        payload: {
            path: '/settings/admin-panel'
        }
    },
    goToSettingsUpdates: {
        universalIdentifier: '5d1ba354-0090-4a42-9a43-601461b26068',
        label: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
            id: "u5u/QJ",
            message: "Go to Community Settings"
        }),
        icon: 'IconUsers',
        isPinned: false,
        position: 63,
        shortLabel: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
            id: "snetsR",
            message: "Community"
        }),
        availabilityType: _types.CommandMenuItemAvailabilityType.GLOBAL,
        conditionalAvailabilityExpression: null,
        availabilityObjectMetadataUniversalIdentifier: null,
        frontComponentUniversalIdentifier: null,
        engineComponentKey: _enginecomponentkeyenum.EngineComponentKey.NAVIGATION,
        hotKeys: null,
        payload: {
            path: '/settings/community'
        }
    },
    composeEmailToPerson: {
        universalIdentifier: 'f01d4b8b-2b4e-4ae0-9c6f-0b9a9a3e5b21',
        label: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
            id: "38I6bM",
            message: "Send Email"
        }),
        icon: 'IconMail',
        isPinned: true,
        position: 64,
        shortLabel: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
            id: "obQsic",
            message: "Send Email"
        }),
        availabilityType: _types.CommandMenuItemAvailabilityType.RECORD_SELECTION,
        conditionalAvailabilityExpression: 'numberOfSelectedRecords >= 1 and permissionFlags.SEND_EMAIL_TOOL',
        availabilityObjectMetadataUniversalIdentifier: _metadata.STANDARD_OBJECTS.person.universalIdentifier,
        frontComponentUniversalIdentifier: null,
        engineComponentKey: _enginecomponentkeyenum.EngineComponentKey.COMPOSE_EMAIL,
        hotKeys: null
    },
    composeEmailToCompany: {
        universalIdentifier: 'a76d3ab8-4c3a-4e5d-8a4a-1f5d6e7f8a90',
        label: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
            id: "38I6bM",
            message: "Send Email"
        }),
        icon: 'IconMail',
        isPinned: true,
        position: 65,
        shortLabel: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
            id: "obQsic",
            message: "Send Email"
        }),
        availabilityType: _types.CommandMenuItemAvailabilityType.RECORD_SELECTION,
        conditionalAvailabilityExpression: 'numberOfSelectedRecords == 1 and permissionFlags.SEND_EMAIL_TOOL',
        availabilityObjectMetadataUniversalIdentifier: _metadata.STANDARD_OBJECTS.company.universalIdentifier,
        frontComponentUniversalIdentifier: null,
        engineComponentKey: _enginecomponentkeyenum.EngineComponentKey.COMPOSE_EMAIL,
        hotKeys: null
    },
    composeEmailToOpportunity: {
        universalIdentifier: 'b3e7c9f2-5d6e-4f7a-8b9c-0d1e2f3a4b5c',
        label: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
            id: "38I6bM",
            message: "Send Email"
        }),
        icon: 'IconMail',
        isPinned: true,
        position: 66,
        shortLabel: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
            id: "obQsic",
            message: "Send Email"
        }),
        availabilityType: _types.CommandMenuItemAvailabilityType.RECORD_SELECTION,
        conditionalAvailabilityExpression: 'numberOfSelectedRecords == 1 and permissionFlags.SEND_EMAIL_TOOL',
        availabilityObjectMetadataUniversalIdentifier: _metadata.STANDARD_OBJECTS.opportunity.universalIdentifier,
        frontComponentUniversalIdentifier: null,
        engineComponentKey: _enginecomponentkeyenum.EngineComponentKey.COMPOSE_EMAIL,
        hotKeys: null
    }
};

//# sourceMappingURL=standard-command-menu-item.constant.js.map