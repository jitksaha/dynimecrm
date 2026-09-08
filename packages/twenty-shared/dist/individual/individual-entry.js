import { AI_SDK_PACKAGE_LABELS as o } from "./ai/constants/ai-sdk-package-labels.const.js";
import { AI_SDK_PACKAGES as e } from "./ai/constants/ai-sdk-packages.const.js";
import { ASK_QUESTIONS_TOOL_NAME as i } from "./ai/constants/ask-questions-tool-name.const.js";
import { COMPLETE_WORKSPACE_SETUP_TOOL_NAME as p } from "./ai/constants/complete-workspace-setup-tool-name.const.js";
import { DATA_RESIDENCY_KEYS as n } from "./ai/constants/data-residency.const.js";
import { DATABASE_CRUD_OPERATIONS as E } from "./ai/constants/database-crud-operation.const.js";
import { NATIVE_AI_SDK_PROVIDER_IDS as s } from "./ai/constants/native-ai-sdk-provider-ids.const.js";
import { ToolCategory as T } from "./ai/constants/tool-category.const.js";
import { isDefined as _ } from "./utils/validation/isDefined.js";
import { isExtendedFileUIPart as d } from "./ai/types/DataMessagePart.js";
import { formatRecordReference as R } from "./ai/utils/format-record-reference.util.js";
import { inferAiSdkPackage as D } from "./ai/utils/infer-ai-sdk-package.util.js";
import { isAiSdkPackage as g } from "./ai/utils/is-ai-sdk-package.util.js";
import { isCompleteWorkspaceSetupToolPart as C } from "./ai/utils/is-complete-workspace-setup-tool-part.util.js";
import { isDataResidency as h } from "./ai/utils/is-data-residency.util.js";
import { isSucceededCompleteWorkspaceSetupToolPart as P } from "./ai/utils/is-succeeded-complete-workspace-setup-tool-part.util.js";
import { isValidAgentResponseSchemaPropertyKey as y } from "./ai/utils/is-valid-agent-response-schema-property-key.util.js";
import { APPLICATION_CATEGORIES as V, isKnownApplicationCategory as v } from "./application/applicationCategoryType.js";
import { FieldMetadataType as k } from "./types/FieldMetadataType.js";
import { APPLICATION_VARIABLE_FIELD_METADATA_TYPES as B } from "./application/applicationVariablesType.js";
import { APPLICATION_FILE_UPLOAD_BATCH_SIZE as K } from "./application/constants/ApplicationFileUploadBatchSize.js";
import { ASSETS_DIR as H } from "./application/constants/AssetDirectory.js";
import { DEFAULT_API_KEY_NAME as x } from "./application/constants/DefaultApiKeyName.js";
import { DEFAULT_API_URL_NAME as J } from "./application/constants/DefaultApiUrlName.js";
import { DEFAULT_APP_ACCESS_TOKEN_NAME as z } from "./application/constants/DefaultAppAccessTokenName.js";
import { DEFAULT_APP_APPLICATION_ACCESS_TOKEN_NAME as Z } from "./application/constants/DefaultAppApplicationAccessTokenName.js";
import { DEFAULT_FUNCTIONS_URL_NAME as rr } from "./application/constants/DefaultFunctionsUrlName.js";
import { FRONT_COMPONENT_SHARED_DEPENDENCIES_BUILT_PATH as tr } from "./application/constants/FrontComponentSharedDependenciesBuiltPath.js";
import { FRONT_COMPONENT_SHARED_DEPENDENCIES_IMPORT_SPECIFIER as mr } from "./application/constants/FrontComponentSharedDependenciesImportSpecifier.js";
import { GENERATED_DIR as ar } from "./application/constants/GeneratedDirectory.js";
import { NODE_ESM_CJS_BANNER as fr } from "./application/constants/NodeEsmCjsBanner.js";
import { OUTPUT_DIR as lr } from "./application/constants/OutputDirectory.js";
import { TWENTY_STANDARD_APPLICATION_NAME as Sr } from "./application/constants/TwentyStandardApplicationName.js";
import { TWENTY_STANDARD_APPLICATION_UNIVERSAL_IDENTIFIER as cr } from "./application/constants/TwentyStandardApplicationUniversalIdentifier.js";
import { computeDeterministicUuid as Ar } from "./application/deterministic-identifier/compute-deterministic-uuid.util.js";
import { getAgentUniversalIdentifier as Ir } from "./application/deterministic-identifier/get-agent-universal-identifier.util.js";
import { getApplicationVariableUniversalIdentifier as Or } from "./application/deterministic-identifier/get-application-variable-universal-identifier.util.js";
import { getConnectionProviderUniversalIdentifier as Fr } from "./application/deterministic-identifier/get-connection-provider-universal-identifier.util.js";
import { getFieldPermissionUniversalIdentifier as ur } from "./application/deterministic-identifier/get-field-permission-universal-identifier.util.js";
import { getFieldUniversalIdentifier as Lr } from "./application/deterministic-identifier/get-field-universal-identifier.util.js";
import { getFrontComponentUniversalIdentifier as Nr } from "./application/deterministic-identifier/get-front-component-universal-identifier.util.js";
import { getIndexUniversalIdentifier as Mr } from "./application/deterministic-identifier/get-index-universal-identifier.util.js";
import { getLogicFunctionUniversalIdentifier as Ur } from "./application/deterministic-identifier/get-logic-function-universal-identifier.util.js";
import { getFolderNavigationMenuItemUniversalIdentifier as wr, getLinkNavigationMenuItemUniversalIdentifier as Vr, getObjectNavigationMenuItemUniversalIdentifier as vr, getViewNavigationMenuItemUniversalIdentifier as br } from "./application/deterministic-identifier/get-navigation-menu-item-universal-identifier.util.js";
import { getObjectPermissionUniversalIdentifier as Gr } from "./application/deterministic-identifier/get-object-permission-universal-identifier.util.js";
import { getObjectUniversalIdentifier as Wr } from "./application/deterministic-identifier/get-object-universal-identifier.util.js";
import { getPageLayoutUniversalIdentifier as Yr } from "./application/deterministic-identifier/get-page-layout-universal-identifier.util.js";
import { getPermissionFlagUniversalIdentifier as jr } from "./application/deterministic-identifier/get-permission-flag-universal-identifier.util.js";
import { getRolePermissionFlagUniversalIdentifier as qr } from "./application/deterministic-identifier/get-role-permission-flag-universal-identifier.util.js";
import { getRoleTargetUniversalIdentifier as Xr } from "./application/deterministic-identifier/get-role-target-universal-identifier.util.js";
import { getRoleUniversalIdentifier as Qr } from "./application/deterministic-identifier/get-role-universal-identifier.util.js";
import { getSearchFieldUniversalIdentifier as $r } from "./application/deterministic-identifier/get-search-field-universal-identifier.util.js";
import { getSelectOptionUniversalIdentifier as oo } from "./application/deterministic-identifier/get-select-option-universal-identifier.util.js";
import { getSkillUniversalIdentifier as eo } from "./application/deterministic-identifier/get-skill-universal-identifier.util.js";
import { getSystemNavigationCommandMenuItemUniversalIdentifier as io } from "./application/deterministic-identifier/get-system-navigation-command-menu-item-universal-identifier.util.js";
import { getSystemPageLayoutTabUniversalIdentifier as po } from "./application/deterministic-identifier/get-system-page-layout-tab-universal-identifier.util.js";
import { getSystemPageLayoutWidgetUniversalIdentifier as no } from "./application/deterministic-identifier/get-system-page-layout-widget-universal-identifier.util.js";
import { ALLOWED_ADDRESS_SUBFIELDS as Eo } from "./types/AddressFieldsType.js";
import { AggregateOperations as so } from "./types/AggregateOperations.js";
import { ApiPath as To } from "./types/ApiPath.js";
import { AppBasePath as _o } from "./types/AppBasePath.js";
import { AppPath as Oo } from "./types/AppPath.js";
import { BlocklistScope as Fo } from "./types/BlocklistScope.js";
import { CalendarChannelContactAutoCreationPolicy as uo } from "./types/CalendarChannelContactAutoCreationPolicy.js";
import { CalendarChannelSyncStage as Lo } from "./types/CalendarChannelSyncStage.js";
import { CalendarChannelSyncStatus as No } from "./types/CalendarChannelSyncStatus.js";
import { CalendarChannelVisibility as Mo } from "./types/CalendarChannelVisibility.js";
import { CommandMenuItemAvailabilityType as Uo } from "./types/CommandMenuItemAvailabilityType.js";
import { CommandMenuItemViewType as wo } from "./types/CommandMenuItemViewType.js";
import { FieldActorSource as vo, actorCompositeType as bo } from "./types/composite-types/actor.composite-type.js";
import { addressCompositeType as Go } from "./types/composite-types/address.composite-type.js";
import { currencyCompositeType as Wo } from "./types/composite-types/currency.composite-type.js";
import { emailsCompositeType as Yo } from "./types/composite-types/emails.composite-type.js";
import { fullNameCompositeType as jo } from "./types/composite-types/full-name.composite-type.js";
import { linksCompositeType as qo } from "./types/composite-types/links.composite-type.js";
import { phonesCompositeType as Xo } from "./types/composite-types/phones.composite-type.js";
import { richTextCompositeType as Qo, richTextValueSchema as Zo } from "./types/composite-types/rich-text.composite-type.js";
import { compositeTypeDefinitions as rt } from "./types/composite-types/composite-type-definitions.js";
import { ConnectedAccountProvider as tt } from "./types/ConnectedAccountProvider.js";
import { ContextStorePageType as mt } from "./types/ContextStorePageType.js";
import { CoreObjectNameSingular as at } from "./types/CoreObjectNameSingular.js";
import { CrudOperationType as ft } from "./types/CrudOperationType.js";
import { EventLogTable as lt } from "./types/EventLogTable.js";
import { FeatureFlagKey as St } from "./types/FeatureFlagKey.js";
import { FIELD_METADATA_TYPES_WITHOUT_DEFAULT_VALUE as ct, fieldMetadataDefaultValueFunctionName as Tt, isFieldMetadataTypeWithDefaultValue as At } from "./types/FieldMetadataDefaultValue.js";
import { FieldMetadataSettingsOnClickAction as It } from "./types/FieldMetadataMultiItemSettings.js";
import { FieldMetadataComplexOption as Ot, FieldMetadataDefaultOption as Rt } from "./types/FieldMetadataOptions.js";
import { DateDisplayFormat as Dt, FIELD_LINKS_VARIANTS as ut, NumberDataType as gt } from "./types/FieldMetadataSettings.js";
import { FILE_CATEGORIES as Ct } from "./types/FileCategory.js";
import { FileFolder as ht } from "./types/FileFolder.js";
import { FILTERABLE_FIELD_TYPES as Pt } from "./types/FilterableFieldType.js";
import { FirstDayOfTheWeek as yt } from "./types/FirstDayOfTheWeek.js";
import { HTTPMethod as Vt } from "./types/HttpMethod.js";
import { IndexType as bt } from "./types/IndexType.js";
import { LOGIC_FUNCTION_HTTP_RESPONSE_MARKER as Gt, isLogicFunctionHttpResponse as Bt } from "./types/LogicFunctionResponse.js";
import { MessageCampaignStatus as Kt } from "./types/MessageCampaignStatus.js";
import { MessageChannelContactAutoCreationPolicy as Ht } from "./types/MessageChannelContactAutoCreationPolicy.js";
import { MessageChannelPendingGroupEmailsAction as xt } from "./types/MessageChannelPendingGroupEmailsAction.js";
import { MessageChannelSyncStage as Jt } from "./types/MessageChannelSyncStage.js";
import { MessageChannelSyncStatus as zt } from "./types/MessageChannelSyncStatus.js";
import { MessageChannelType as Zt } from "./types/MessageChannelType.js";
import { MessageChannelVisibility as re } from "./types/MessageChannelVisibility.js";
import { MessageFolderImportPolicy as te } from "./types/MessageFolderImportPolicy.js";
import { MessageFolderPendingSyncAction as me } from "./types/MessageFolderPendingSyncAction.js";
import { MessageParticipantRole as ae } from "./types/MessageParticipantRole.js";
import { MetadataWritability as fe } from "./types/MetadataWritability.js";
import { NavigationMenuItemType as le } from "./types/NavigationMenuItemType.js";
import { ObjectOpenRecordIn as Se } from "./types/ObjectOpenRecordIn.js";
import { OrderByDirection as ce } from "./types/ObjectRecordGroupBy.js";
import { ObjectRecordGroupByDateGranularity as Ae } from "./types/ObjectRecordGroupByDateGranularity.js";
import { OpenRecordIn as Ie } from "./types/OpenRecordIn.js";
import { GRAPH_WIDGET_CONFIGURATION_TYPES as Oe } from "./types/page-layout/graph-widget-configuration-type.js";
import { PageLayoutTabLayoutMode as Fe } from "./types/page-layout/PageLayoutTabLayoutMode.js";
import { PageLayoutType as ue } from "./types/page-layout/PageLayoutType.js";
import { WidgetType as Le } from "./types/page-layout/WidgetType.js";
import { RecordFilterGroupLogicalOperator as Ne } from "./types/RecordFilterGroupLogicalOperator.js";
import { RelationOnDeleteAction as Me } from "./types/RelationOnDeleteAction.type.js";
import { RelationType as Ue } from "./types/RelationType.js";
import { RowLevelPermissionPredicateGroupLogicalOperator as we } from "./types/RowLevelPermissionPredicateGroupLogicalOperator.js";
import { RowLevelPermissionPredicateOperand as ve } from "./types/RowLevelPermissionPredicateOperand.js";
import { SERIALIZED_RELATION_BRAND as ke } from "./types/SerializedRelation.type.js";
import { ServerFileFolder as Be } from "./types/ServerFileFolder.js";
import { SettingsPath as Ke } from "./types/SettingsPath.js";
import { SidePanelPages as He } from "./types/SidePanelPages.js";
import { StepLogicalOperator as xe } from "./types/StepFilters.js";
import { TwoFactorAuthenticationStrategy as Je } from "./types/TwoFactorAuthenticationStrategy.js";
import { UpgradeHealthEnum as ze } from "./types/UpgradeHealthEnum.js";
import { IsValidGraphQLEnumName as Ze } from "./types/validators/is-valid-graphql-enum-name.validator.js";
import { ViewCalendarLayout as rm } from "./types/ViewCalendarLayout.js";
import { ViewFilterGroupLogicalOperator as tm } from "./types/ViewFilterGroupLogicalOperator.js";
import { ViewFilterOperand as mm } from "./types/ViewFilterOperand.js";
import { ViewFilterOperandDeprecated as am } from "./types/ViewFilterOperandDeprecated.js";
import { ViewKey as fm } from "./types/ViewKey.js";
import { ViewOpenRecordIn as lm } from "./types/ViewOpenRecordIn.js";
import { ViewSortDirection as Sm } from "./types/ViewSortDirection.js";
import { ViewType as cm } from "./types/ViewType.js";
import { ViewVisibility as Am } from "./types/ViewVisibility.js";
import { WebhookSubscriptionChannelType as Im } from "./types/WebhookSubscriptionChannelType.js";
import { WebhookSubscriptionStatus as Om } from "./types/WebhookSubscriptionStatus.js";
import { getSystemRecordPageLayoutUniversalIdentifier as Fm } from "./application/deterministic-identifier/get-system-record-page-layout-universal-identifier.util.js";
import { getSystemRelationFieldUniversalIdentifier as um } from "./application/deterministic-identifier/get-system-relation-field-universal-identifier.util.js";
import { getSystemViewFieldGroupUniversalIdentifier as Lm } from "./application/deterministic-identifier/get-system-view-field-group-universal-identifier.util.js";
import { getSystemViewFieldUniversalIdentifier as Nm } from "./application/deterministic-identifier/get-system-view-field-universal-identifier.util.js";
import { SYSTEM_VIEW_KEYS as Mm, getSystemViewUniversalIdentifier as Pm } from "./application/deterministic-identifier/get-system-view-universal-identifier.util.js";
import { getViewFieldUniversalIdentifier as ym } from "./application/deterministic-identifier/get-view-field-universal-identifier.util.js";
import { getViewFilterUniversalIdentifier as Vm } from "./application/deterministic-identifier/get-view-filter-universal-identifier.util.js";
import { getViewGroupUniversalIdentifier as bm } from "./application/deterministic-identifier/get-view-group-universal-identifier.util.js";
import { getViewSortUniversalIdentifier as Gm } from "./application/deterministic-identifier/get-view-sort-universal-identifier.util.js";
import { getViewUniversalIdentifier as Wm } from "./application/deterministic-identifier/get-view-universal-identifier.util.js";
import { SyncableEntity as Ym } from "./application/enums/syncable-entities.enum.js";
import { deserializeApplicationVariableValue as jm, serializeApplicationVariableValue as xm } from "./application/utils/applicationVariableValueSerialization.js";
import { ACCOUNT_TYPES as Jm } from "./constants/AccountTypes.js";
import { ALLOWED_FULL_NAME_SORT_SUBFIELDS as zm } from "./constants/AllowedFullNameSortSubfields.js";
import { AUTO_SELECT_FAST_MODEL_ID as Zm } from "./constants/AutoSelectFastModelId.js";
import { AUTO_SELECT_SMART_MODEL_ID as ri } from "./constants/AutoSelectSmartModelId.js";
import { BACKEND_BATCH_REQUEST_MAX_COUNT as ti } from "./constants/BackendBatchRequestMaxCount.js";
import { CalendarStartDay as mi } from "./constants/CalendarStartDay.js";
import { COMMAND_MENU_CONFIRMATION_MODAL_RESULT_BROWSER_EVENT_NAME as ai } from "./constants/CommandMenuConfirmationModalResultBrowserEventName.js";
import { COMPOSITE_FIELD_TYPE_SUB_FIELDS_NAMES as fi } from "./constants/CompositeFieldTypeSubFieldsNames.js";
import { CurrencyCode as li } from "./constants/CurrencyCode.js";
import { CURRENCY_CODE_LABELS as Si } from "./constants/CurrencyCodeLabels.js";
import { DATE_TYPE_FORMAT as ci } from "./constants/DateTypeFormat.js";
import { DEFAULT_NUMBER_OF_GROUPS_LIMIT as Ai } from "./constants/DefaultNumberOfGroupsLimit.js";
import { DEFAULT_RELATIVE_DATE_FILTER_VALUE as Ii } from "./constants/DefaultRelativeDateFilterValue.js";
import { DEFAULT_VISIBLE_ADDRESS_SUBFIELDS as Oi } from "./constants/DefaultVisibleAddressSubfields.js";
import { DEFAULT_WIDGET_SIZE as Fi } from "./constants/DefaultWidgetSize.js";
import { DOCUMENTATION_BASE_URL as ui } from "./constants/DocumentationBaseUrl.js";
import { DOCUMENTATION_DEFAULT_LANGUAGE as Li } from "./constants/DocumentationDefaultLanguage.js";
import { DOCUMENTATION_PATHS as Ni } from "./constants/DocumentationPaths.js";
import { DOCUMENTATION_DEFAULT_PATH as Mi } from "./constants/DocumentationDefaultPath.js";
import { DOCUMENTATION_SUPPORTED_LANGUAGES as Ui } from "./constants/DocumentationSupportedLanguages.js";
import { EMAIL_IMAGE_MIME_TYPES as wi } from "./constants/EmailImageMimeTypes.js";
import { ENTERPRISE_INSTANCE_TYPE as vi } from "./constants/EnterpriseInstanceType.js";
import { EXCLUDED_FIELD_NAMES_FROM_AGENT_TOOL_SCHEMA as ki } from "./constants/ExcludedFieldNamesFromAgentToolSchema.js";
import { FIELD_FOR_TOTAL_COUNT_AGGREGATE_OPERATION as Bi } from "./constants/FieldForTotalCountAggregateOperation.js";
import { MAX_OPTIONS_TO_DISPLAY as Ki } from "./constants/FieldMetadataMaxOptionsToDisplay.js";
import { FIELD_METADATA_TYPES_NOT_SUPPORTED_IN_GROUP_BY as Hi } from "./constants/FieldMetadataTypesNotSupportedInGroupBy.js";
import { FIELD_RESTRICTED_ADDITIONAL_PERMISSIONS_REQUIRED as xi } from "./constants/FieldRestrictedAdditionalPermissionsRequired.js";
import { FIELD_TYPE_DEFAULT_ICONS as Ji } from "./constants/FieldTypeDefaultIcons.js";
import { FILES_FIELD_MAX_NUMBER_OF_VALUES as zi } from "./constants/FilesFieldMaxNumberOfValues.js";
import { GIN_COMPATIBLE_FIELD_TYPES as Zi } from "./constants/GinCompatibleFieldTypes.js";
import { GROUP_BY_DATE_GRANULARITY_THAT_REQUIRE_TIME_ZONE as ra } from "./constants/GroupByDateGranularityThatRequireTimeZone.js";
import { IANA_TIME_ZONES as ta } from "./constants/IanaTimeZones.js";
import { IMAGE_IDENTIFIER_FIELD_METADATA_TYPES as ma } from "./constants/ImageIdentifierFieldMetadataTypes.js";
import { LABEL_IDENTIFIER_FIELD_METADATA_TYPES as aa } from "./constants/LabelIdentifierFieldMetadataTypes.js";
import { MAX_CORE_WORKFLOW_FILTER_RULES as fa } from "./constants/MaxCoreWorkflowFilterRules.js";
import { MAX_CUSTOM_INDEXES_PER_OBJECT as la } from "./constants/MaxCustomIndexesPerObject.js";
import { MAX_EMAIL_RECIPIENTS as Sa } from "./constants/MaxEmailRecipients.js";
import { MULTI_ITEM_FIELD_DEFAULT_MAX_VALUES as ca } from "./constants/MultiItemFieldDefaultMaxValues.js";
import { MULTI_ITEM_FIELD_MIN_MAX_VALUES as Aa } from "./constants/MultiItemFieldMinMaxValues.js";
import { MUTATION_MAX_MERGE_RECORDS as Ia } from "./constants/MutationMaxMergeRecords.js";
import { OBJECTS_WITH_CHANNEL_VISIBILITY_CONSTRAINTS as Oa } from "./constants/ObjectsWithChannelVisibilityConstraints.js";
import { PermissionFlagType as Fa } from "./constants/PermissionFlagType.js";
import { PermissionsOnAllObjectRecords as ua } from "./constants/PermissionsOnAllObjectRecords.js";
import { QUERY_DEFAULT_LIMIT_RECORDS as La } from "./constants/QueryDefaultLimitRecords.js";
import { QUERY_MAX_RECORDS as Na } from "./constants/QueryMaxRecords.js";
import { QUERY_MAX_RECORDS_FROM_RELATION as Ma } from "./constants/QueryMaxRecordsFromRelation.js";
import { QUOTED_STRING_REGEX as Ua } from "./constants/QuotedStringRegex.js";
import { RATING_VALUES as wa } from "./constants/RatingValues.js";
import { RELATION_NESTED_QUERY_KEYWORDS as va } from "./constants/RelationNestedQueriesKeyword.js";
import { RESERVED_SUBDOMAINS as ka } from "./constants/ReservedSubdomains.js";
import { STANDARD_OBJECT_RECORDS_UNDER_OBJECT_RECORDS_PERMISSIONS as Ba } from "./constants/StandardObjectRecordsUnderObjectRecordsPermissions.js";
import { SUBDOMAIN_PATTERN as Ka } from "./constants/SubdomainPattern.js";
import { SystemPermissionFlag as Ha } from "./constants/SystemPermissionFlag.js";
import { TWENTY_COMPANIES_BASE_URL as xa } from "./constants/TwentyCompaniesBaseUrl.js";
import { TWENTY_ICONS_BASE_URL as Ja } from "./constants/TwentyIconsBaseUrl.js";
import { UI_SCALE_VALUES as za } from "./constants/UiScaleValues.js";
import { VIEW_GROUP_VISIBLE_OPTIONS_MAX as Za } from "./constants/ViewGroupVisibleOptionsMax.js";
import { VIEW_TYPE_DEFAULT_ICONS as rp } from "./constants/ViewTypeDefaultIcons.js";
import { ObjectRecordBaseEvent as tp } from "./database-events/object-record.base.event.js";
import { ObjectRecordCreateEvent as mp } from "./database-events/object-record-create.event.js";
import { ObjectRecordDeleteEvent as ap } from "./database-events/object-record-delete.event.js";
import { ObjectRecordDestroyEvent as fp } from "./database-events/object-record-destroy.event.js";
import { ObjectRecordRestoreEvent as lp } from "./database-events/object-record-restore.event.js";
import { ObjectRecordUpdateEvent as Sp } from "./database-events/object-record-update.event.js";
import { ObjectRecordUpsertEvent as cp } from "./database-events/object-record-upsert.event.js";
import { checkIfFieldIsImageIdentifier as Ap } from "./metadata/check-if-field-is-image-identifier.util.js";
import { assertIsDefinedOrThrow as Ip } from "./utils/validation/assertIsDefinedOrThrow.js";
import { SOURCE_LOCALE as Op } from "./translations/constants/SourceLocale.js";
import { APP_LOCALES as Fp } from "./translations/constants/AppLocales.js";
import { isValidLocale as up } from "./utils/validation/isValidLocale.js";
import { isValidTwentySubdomain as Lp } from "./utils/validation/isValidTwentySubdomain.js";
import { isSearchableFieldType as Np } from "./utils/validation/isSearchableFieldType.js";
import { isValidUuid as Mp } from "./utils/validation/isValidUuid.js";
import { normalizeLocale as Up } from "./utils/validation/normalizeLocale.js";
import { applyDiff as wp } from "./utils/applyDiff.js";
import { compareArraysOfObjectsByProperty as vp } from "./utils/array/compareArraysOfObjectsByProperty.js";
import { filterDuplicatesById as kp } from "./utils/array/filterDuplicatesById.js";
import { filterOutByProperty as Bp } from "./utils/array/filterOutByProperty.js";
import { findById as Kp } from "./utils/array/findById.js";
import { findByProperty as Hp } from "./utils/array/findByProperty.js";
import { findOrThrow as xp } from "./utils/array/findOrThrow.js";
import { getContiguousIncrementalValues as Jp } from "./utils/array/getContiguousIncrementalValues.js";
import { isNonEmptyArray as zp } from "./utils/array/isNonEmptyArray.js";
import { mapById as Zp } from "./utils/array/mapById.js";
import { mapByProperty as rf } from "./utils/array/mapByProperty.js";
import { sumByProperty as tf } from "./utils/array/sumByProperty.js";
import { upsertIntoArrayOfObjectsComparingId as mf } from "./utils/array/upsertIntoArrayOfObjectsComparingId.js";
import { upsertPropertiesOfItemIntoArrayOfObjectsComparingId as pf } from "./utils/array/upsertPropertiesOfItemIntoArrayOfObjectsComparingId.js";
import { assertUnreachable as nf } from "./utils/assertUnreachable.js";
import { base64UrlEncode as Ef } from "./utils/base64UrlEncode.js";
import { isCallRecordingTranscriptStatusMarker as sf } from "./utils/callRecording/isCallRecordingTranscriptStatusMarker.js";
import { parseCallRecordingTranscriptEntries as Tf } from "./utils/callRecording/parseCallRecordingTranscriptEntries.js";
import { safeGetNestedProperty as _f } from "./utils/command-menu-items/safeGetNestedProperty.js";
import { conditionalAvailabilityParser as df } from "./utils/command-menu-items/conditionalAvailabilityParser.js";
import { evaluateConditionalAvailabilityExpression as Rf } from "./utils/command-menu-items/evaluateConditionalAvailabilityExpression.js";
import { resolveObjectMetadataLabel as Df } from "./utils/command-menu-items/resolveObjectMetadataLabel.js";
import { fastDeepEqual as gf } from "./utils/json/fast-deep-equal.js";
import { computeDiffBetweenObjects as Cf } from "./utils/compute-diff-between-objects.js";
import { ACCEPTED_DATE_FORMATS as hf, ACCEPTED_DATE_TIME_FORMATS as Mf, NON_ISO_DATE_FORMATS as Pf } from "./utils/date/dateInputFormats.js";
import { getValidTimeZoneOrUndefined as yf } from "./utils/date/getValidTimeZoneOrUndefined.js";
import { isDateWithoutTime as Vf } from "./utils/date/isDateWithoutTime.js";
import { isPlainDateAfter as bf } from "./utils/date/isPlainDateAfter.js";
import { isPlainDateBefore as Gf } from "./utils/date/isPlainDateBefore.js";
import { isPlainDateBeforeOrEqual as Wf } from "./utils/date/isPlainDateBeforeOrEqual.js";
import { isPlainDateInSameMonth as Yf } from "./utils/date/isPlainDateInSameMonth.js";
import { isPlainDateInWeekend as jf } from "./utils/date/isPlainDateInWeekend.js";
import { isSamePlainDate as qf } from "./utils/date/isSamePlainDate.js";
import { turnJSDateToPlainDate as Xf } from "./utils/date/turnJSDateToPlainDate.js";
import { parseToInstantOrThrow as Qf } from "./utils/date/parseToInstantOrThrow.js";
import { parseToPlainDateOrThrow as $f } from "./utils/date/parseToPlainDateOrThrow.js";
import { sortPlainDate as on } from "./utils/date/sortPlainDate.js";
import { turnPlainDateIntoUserTimeZoneInstantString as en } from "./utils/date/turnPlainDateIntoUserTimeZoneInstantString.js";
import { turnPlainDateToShiftedDateInSystemTimeZone as an } from "./utils/date/turnPlainDateToShiftedDateInSystemTimeZone.js";
import { deepMerge as fn } from "./utils/deepMerge.js";
import { formatEmailAddress as ln } from "./utils/email/formatEmailAddress.js";
import { getSendableEmailHandles as Sn } from "./utils/email/getSendableEmailHandles.js";
import { parseEmailAddressList as cn } from "./utils/email/parseEmailAddressList.js";
import { CustomError as An } from "./utils/errors/CustomError.js";
import { evalFromContext as In } from "./utils/evalFromContext.js";
import { trimAndRemoveDuplicatedWhitespacesFromString as On } from "./utils/trim-and-remove-duplicated-whitespaces-from-string.js";
import { extractAndSanitizeObjectStringFields as Fn } from "./utils/extractAndSanitizeObjectStringFields.js";
import { appendCopySuffix as un } from "./utils/strings/appendCopySuffix.js";
import { capitalize as Ln } from "./utils/strings/capitalize.js";
import { kebabToCamelCase as Nn } from "./utils/strings/kebabToCamelCase.js";
import { pascalCase as Mn } from "./utils/strings/pascalCase.js";
import { pascalToKebab as Un } from "./utils/strings/pascalToKebab.js";
import { computeMorphRelationGqlFieldName as wn } from "./utils/fieldMetadata/compute-morph-relation-gql-field-name.js";
import { computeMorphRelationGqlFieldJoinColumnName as vn, computeRelationGqlFieldJoinColumnName as bn } from "./utils/fieldMetadata/compute-relation-gql-field-join-column-name.js";
import { isFieldMetadataArrayKind as Gn } from "./utils/fieldMetadata/isFieldMetadataArrayKind.js";
import { isFieldMetadataDateKind as Wn } from "./utils/fieldMetadata/isFieldMetadataDateKind.js";
import { isFieldMetadataEligibleForFieldsWidget as Yn } from "./utils/fieldMetadata/isFieldMetadataEligibleForFieldsWidget.js";
import { isFieldMetadataEnumKind as jn } from "./utils/fieldMetadata/isFieldMetadataEnumKind.js";
import { isFieldMetadataNumericKind as qn } from "./utils/fieldMetadata/isFieldMetadataNumericKind.js";
import { isFieldMetadataSelectKind as Xn } from "./utils/fieldMetadata/isFieldMetadataSelectKind.js";
import { shouldExcludeFieldFromAgentToolSchema as Qn } from "./utils/fieldMetadata/shouldExcludeFieldFromAgentToolSchema.js";
import { isFieldMetadataSupportedInGroupBy as $n } from "./utils/fieldMetadata/isFieldMetadataSupportedInGroupBy.js";
import { isFieldMetadataTextKind as ol } from "./utils/fieldMetadata/isFieldMetadataTextKind.js";
import { pickMorphGroupSurvivorOrThrow as el } from "./utils/fieldMetadata/pick-morph-group-survivor-or-throw.js";
import { extractFolderPathFilenameAndTypeOrThrow as il } from "./utils/files/extractFolderPathFilenameAndTypeOrThrow.util.js";
import { isEmptinessOperand as pl } from "./utils/filter/isEmptinessOperand.js";
import { getFilterTypeFromFieldType as nl } from "./utils/filter/utils/getFilterTypeFromFieldType.js";
import { checkIfShouldComputeEmptinessFilter as El } from "./utils/filter/checkIfShouldComputeEmptinessFilter.js";
import { computeGqlOperationFilterForEmails as sl } from "./utils/filter/compute-record-gql-operation-filter/for-composite-field/computeGqlOperationFilterForEmails.js";
import { computeGqlOperationFilterForLinks as Tl } from "./utils/filter/compute-record-gql-operation-filter/for-composite-field/computeGqlOperationFilterForLinks.js";
import { computeEmptyGqlOperationFilterForEmails as _l } from "./utils/filter/computeEmptyGqlOperationFilterForEmails.js";
import { computeEmptyGqlOperationFilterForLinks as dl } from "./utils/filter/computeEmptyGqlOperationFilterForLinks.js";
import { isRecordFilterOperandExpectingValue as Rl } from "./utils/filter/isRecordFilterOperandExpectingValue.js";
import { isRecordFilterValueValid as Dl } from "./utils/filter/isRecordFilterValueValid.js";
import { filterOutInvalidRecordFilters as gl } from "./utils/filter/filterOutInvalidRecordFilters.js";
import { createAnyFieldRecordFilterBaseProperties as Cl } from "./utils/filter/utils/createAnyFieldRecordFilterBaseProperties.js";
import { turnAnyFieldFilterIntoRecordGqlFilter as hl } from "./utils/filter/turnAnyFieldFilterIntoRecordGqlFilter.js";
import { combineFilters as Pl } from "./utils/filter/utils/combineFilters.js";
import { convertGreaterThanOrEqualRatingToArrayOfRatingValues as yl, convertLessThanOrEqualRatingToArrayOfRatingValues as wl, convertRatingToRatingValue as Vl } from "./utils/filter/utils/fieldRatingConvertors.js";
import { generateILikeFiltersForCompositeFields as bl } from "./utils/filter/utils/generateILikeFiltersForCompositeFields.js";
import { getEmptyRecordGqlOperationFilter as Gl } from "./utils/filter/utils/getEmptyRecordGqlOperationFilter.js";
import { COMPOSITE_FIELD_FILTER_OPERANDS_MAP as Wl } from "./utils/filter/utils/compositeFieldFilterOperandsMap.js";
import { FILTER_OPERANDS_MAP as Yl } from "./utils/filter/utils/filterOperandsMap.js";
import { getFilterOperandsForFilterableFieldType as jl } from "./utils/filter/utils/getFilterOperandsForFilterableFieldType.js";
import { isExpectedSubFieldName as ql } from "./utils/filter/utils/isExpectedSubFieldName.js";
import { isMatchingArrayFilter as Xl } from "./utils/filter/utils/isMatchingArrayFilter.js";
import { isMatchingBooleanFilter as Ql } from "./utils/filter/utils/isMatchingBooleanFilter.js";
import { isMatchingCurrencyFilter as $l } from "./utils/filter/utils/isMatchingCurrencyFilter.js";
import { isMatchingDateFilter as oE } from "./utils/filter/utils/isMatchingDateFilter.js";
import { isMatchingFilesFilter as eE } from "./utils/filter/utils/isMatchingFilesFilter.js";
import { isMatchingFloatFilter as iE } from "./utils/filter/utils/isMatchingFloatFilter.js";
import { isMatchingMultiSelectFilter as pE } from "./utils/filter/utils/isMatchingMultiSelectFilter.js";
import { compareSelectOptionValues as nE } from "./utils/filter/utils/compareSelectOptionValues.js";
import { isMatchingRatingFilter as EE } from "./utils/filter/utils/isMatchingRatingFilter.js";
import { isMatchingRawJsonFilter as sE } from "./utils/filter/utils/isMatchingRawJsonFilter.js";
import { isMatchingRichTextFilter as TE } from "./utils/filter/utils/isMatchingRichTextFilter.js";
import { isMatchingSelectFilter as _E } from "./utils/filter/utils/isMatchingSelectFilter.js";
import { isMatchingStringFilter as dE } from "./utils/filter/utils/isMatchingStringFilter.js";
import { isMatchingTSVectorFilter as RE } from "./utils/filter/utils/isMatchingTSVectorFilter.js";
import { isMatchingUUIDFilter as DE } from "./utils/filter/utils/isMatchingUUIDFilter.js";
import { isValidVariable as gE } from "./utils/validation/isValidVariable.js";
import { arrayOfStringsOrVariablesSchema as CE } from "./utils/filter/utils/validation-schemas/arrayOfStringsOrVariablesSchema.js";
import { arrayOfUuidOrVariableSchema as hE, strictArrayOfUuidOrVariableSchema as ME } from "./utils/filter/utils/validation-schemas/arrayOfUuidsOrVariablesSchema.js";
import { jsonRelationFilterValueSchema as UE, relationFilterValueSchemaObject as yE } from "./utils/filter/utils/validation-schemas/jsonRelationFilterValueSchema.js";
import { actorSourceFilterValueSchema as VE, booleanFilterValueSchema as vE, instantFilterValueSchema as bE, nonEmptyStringFilterValueSchema as kE, numericFilterValueSchema as GE, plainDateFilterValueSchema as BE, plainDateOrInstantFilterValueSchema as WE } from "./utils/filter/utils/validation-schemas/filterValueScalarSchemas.js";
import { firstDayOfWeekSchema as YE } from "./utils/filter/dates/utils/firstDayOfWeekSchema.js";
import { relativeDateFilterAmountSchema as jE } from "./utils/filter/dates/utils/relativeDateFilterAmountSchema.js";
import { relativeDateFilterDirectionSchema as qE } from "./utils/filter/dates/utils/relativeDateFilterDirectionSchema.js";
import { relativeDateFilterUnitSchema as XE } from "./utils/filter/dates/utils/relativeDateFilterUnitSchema.js";
import { relativeDateFilterSchema as QE } from "./utils/filter/dates/utils/relativeDateFilterSchema.js";
import { relativeDateFilterStringifiedSchema as $E } from "./utils/filter/dates/utils/relativeDateFilterStringifiedSchema.js";
import { COMPOSITE_SUB_FIELD_VALUE_SCHEMAS as oS, FILTER_VALUE_FORMAT_HINTS as tS, FILTER_VALUE_SCHEMAS_MAP as eS } from "./utils/filter/utils/validation-schemas/filterValueSchemasMap.js";
import { getFilterValueSchema as iS } from "./utils/filter/utils/validation-schemas/getFilterValueSchema.js";
import { convertViewFilterValueToString as pS } from "./utils/filter/utils/convertViewFilterValueToString.js";
import { getFilterValueValidationIssue as nS } from "./utils/filter/utils/validation-schemas/getFilterValueValidationIssue.js";
import { turnRecordFilterIntoRecordGqlOperationFilter as ES } from "./utils/filter/turnRecordFilterIntoGqlOperationFilter.js";
import { turnRecordFilterGroupsIntoGqlOperationFilter as sS } from "./utils/filter/turnRecordFilterGroupIntoGqlOperationFilter.js";
import { computeRecordGqlOperationFilter as TS } from "./utils/filter/computeRecordGqlOperationFilter.js";
import { addUnitToDateTime as _S } from "./utils/filter/dates/utils/addUnitToDateTime.js";
import { addUnitToZonedDateTime as dS } from "./utils/filter/dates/utils/addUnitToZonedDateTime.js";
import { convertCalendarStartDayNonIsoNumberToFirstDayOfTheWeek as RS } from "./utils/filter/dates/utils/convertCalendarStartDayNonIsoNumberToFirstDayOfTheWeek.js";
import { convertFirstDayOfTheWeekToCalendarStartDayNumber as DS } from "./utils/filter/dates/utils/convertFirstDayOfTheWeekToCalendarStartDayNumber.js";
import { getFirstDayOfTheWeekAsANumberForDateFNS as gS } from "./utils/filter/dates/utils/getFirstDayOfTheWeekAsANumberForDateFNS.js";
import { getFirstDayOfTheWeekAsISONumber as CS } from "./utils/filter/dates/utils/getFirstDayOfTheWeekAsISONumber.js";
import { getPeriodStart as hS } from "./utils/filter/dates/utils/getPeriodStart.js";
import { FIRST_DAY_OF_WEEK_ISO_8601_MONDAY as PS, getNextPeriodStart as US } from "./utils/filter/dates/utils/getNextPeriodStart.js";
import { isSubDayRelativeDateFilterUnit as wS } from "./utils/filter/dates/utils/isSubDayRelativeDateFilterUnit.js";
import { subUnitFromZonedDateTime as vS } from "./utils/filter/dates/utils/subUnitFromZonedDateTime.js";
import { resolveRelativeDateFilter as kS } from "./utils/filter/dates/utils/resolveRelativeDateFilter.js";
import { resolveRelativeDateFilterStringified as BS } from "./utils/filter/dates/utils/resolveRelativeDateFilterStringified.js";
import { resolveDateFilter as KS } from "./utils/filter/dates/utils/resolveDateFilter.js";
import { resolveRelativeDateTimeFilter as HS } from "./utils/filter/dates/utils/resolveRelativeDateTimeFilter.js";
import { resolveRelativeDateTimeFilterStringified as xS } from "./utils/filter/dates/utils/resolveRelativeDateTimeFilterStringified.js";
import { resolveDateTimeFilter as JS } from "./utils/filter/dates/utils/resolveDateTimeFilter.js";
import { subUnitFromDateTime as zS } from "./utils/filter/dates/utils/subUnitFromDateTime.js";
import { convertViewFilterOperandToCoreOperand as ZS } from "./utils/filter/utils/convert-view-filter-operand-to-core-operand.util.js";
import { filterSelectOptionsOfFieldMetadataItem as rs } from "./utils/filter/utils/filterSelectOptionsOfFieldMetadataItem.js";
import { formatToShortNumber as ts } from "./utils/format/formatToShortNumber.js";
import { fromArrayToUniqueKeyRecord as ms } from "./utils/from-array-to-unique-key-record.util.js";
import { fromArrayToValuesByKeyRecord as as } from "./utils/fromArrayToValuesByKeyRecord.util.js";
import { getURLSafely as fs } from "./utils/getURLSafely.js";
import { getConnectionTypename as ls, getEdgeTypename as Es, getGroupByConnectionTypename as Ss, getNodeTypename as ss } from "./utils/graphql/graphql-get-typename.util.js";
import { getImageAbsoluteURI as Ts } from "./utils/image/getImageAbsoluteURI.js";
import { getLogoUrlFromDomainName as _s, sanitizeURL as Is } from "./utils/image/getLogoUrlFromDomainName.js";
import { getLinkFaviconUrl as Os } from "./utils/image/getLinkFaviconUrl.js";
import { getUniqueConstraintsFields as Fs } from "./utils/indexMetadata/getUniqueConstraintsFields.js";
import { isAutoSelectModelId as us } from "./utils/isAutoSelectModelId.js";
import { isFieldValueRestricted as Ls } from "./utils/isFieldValueRestricted.js";
import { getAppPath as Ns } from "./utils/navigation/getAppPath.js";
import { getSettingsPath as Ms } from "./utils/navigation/getSettingsPath.js";
import { parseJson as Us } from "./utils/parseJson.js";
import { removePropertiesFromRecord as ws } from "./utils/removePropertiesFromRecord.js";
import { removeUndefinedFields as vs } from "./utils/removeUndefinedFields.js";
import { resolveRichTextVariables as ks } from "./utils/rich-text-variable-resolver.js";
import { safeParseRelativeDateFilterJsonStringified as Bs } from "./utils/safeParseRelativeDateFilterJsonStringified.js";
import { getGenericOperationName as Ks } from "./utils/sentry/getGenericOperationName.js";
import { getHumanReadableNameFromCode as Hs } from "./utils/sentry/getHumanReadableNameFromCode.js";
import { camelToKebab as xs } from "./utils/strings/camelToKebab.js";
import { camelToSnakeCase as Js } from "./utils/strings/camelToSnakeCase.js";
import { stringifySafely as zs } from "./utils/strings/stringifySafely.js";
import { uncapitalize as Zs } from "./utils/strings/uncapitalize.js";
import { getSubdomainSlugFromDisplayName as rc } from "./utils/subdomain/getSubdomainSlugFromDisplayName.js";
import { CANVAS_THEME_DEFAULTS as tc } from "./utils/tiptap/canvas-theme.js";
import { TIPTAP_MARK_TYPES as mc } from "./utils/tiptap/tiptap-mark-types.js";
import { EMAIL_DOCUMENT_MARK_CATALOG as ac, isEmailDocumentMarkType as pc } from "./utils/tiptap/email-document-mark-catalog.js";
import { TIPTAP_NODE_TYPES as nc } from "./utils/tiptap/tiptap-node-types.js";
import { EMAIL_DOCUMENT_NODE_CATALOG as Ec, isEmailDocumentNodeType as Sc, isRenderedEmailDocumentNodeType as sc } from "./utils/tiptap/email-document-node-catalog.js";
import { TIPTAP_DOCUMENT_SCHEMA_VERSION as Tc } from "./utils/tiptap/tiptap-document-schema-version.js";
import { EMAIL_DOCUMENT_SCHEMA_VERSION as _c } from "./utils/tiptap/email-document-schema-version.js";
import { emailDocumentSchema as dc } from "./utils/tiptap/email-document-schema.js";
import { isCanvasTheme as Rc } from "./utils/tiptap/is-canvas-theme.js";
import { isEmailDocumentShape as Dc } from "./utils/tiptap/is-email-document-shape.js";
import { listCampaignVariablesForFields as gc } from "./utils/tiptap/list-campaign-variables-for-fields.js";
import { parseCanonicalEmailDocument as Cc, parseEmailDocument as Nc } from "./utils/tiptap/parse-email-document.js";
import { isTipTapNode as Mc, parseCanonicalTipTapJsonDocument as Pc, parseTipTapJsonDocument as Uc } from "./utils/tiptap/parse-tiptap-json-document.js";
import { resolveCanvasTheme as wc } from "./utils/tiptap/resolve-canvas-theme.js";
import { TIPTAP_MARKS_RENDER_ORDER as vc } from "./utils/tiptap/tiptap-marks-render-order.js";
import { tipTapDocumentToMarkdown as kc } from "./utils/tiptap/tiptap-document-to-markdown.js";
import { transformEmailDocumentStrings as Bc } from "./utils/tiptap/transform-email-document-strings.js";
import { trimAndRemoveDuplicatedWhitespacesFromObjectStringProperties as Kc } from "./utils/trim-and-remove-duplicated-whitespaces-from-object-string-properties.js";
import { typedObjectEntries as Hc } from "./utils/typed-object-entries.js";
import { isMetadataGqlOperationSignature as xc } from "./utils/typeguard/isMetadataGqlOperationSignature.js";
import { isPlainObject as Jc } from "./utils/typeguard/isPlainObject.js";
import { isRecordGqlOperationSignature as zc } from "./utils/typeguard/isRecordGqlOperationSignature.js";
import { throwIfNotDefined as Zc } from "./utils/typeguard/throwIfNotDefined.js";
import { formatUpgradeCommandName as rT } from "./utils/upgrade/formatUpgradeCommandName.js";
import { ensureAbsoluteUrl as tT } from "./utils/url/ensureAbsoluteUrl.js";
import { isValidHostname as mT } from "./utils/url/isValidHostname.js";
import { absoluteUrlSchema as aT } from "./utils/url/absoluteUrlSchema.js";
import { buildSignedPath as fT } from "./utils/url/buildSignedPath.js";
import { getAbsoluteUrlOrThrow as lT } from "./utils/url/getAbsoluteUrlOrThrow.js";
import { normalizeDomain as ST } from "./utils/url/normalizeDomain.js";
import { normalizeUrlOrigin as cT } from "./utils/url/normalizeUrlOrigin.js";
import { getLinkUrlNormalizer as AT } from "./utils/url/getLinkUrlNormalizer.js";
import { isSafeUrl as IT } from "./utils/url/isSafeUrl.js";
import { getSafeUrl as OT } from "./utils/url/getSafeUrl.js";
import { getUrlHostnameOrThrow as FT } from "./utils/url/getUrlHostnameOrThrow.js";
import { isAbsoluteUrl as uT } from "./utils/url/isAbsoluteUrl.js";
import { isValidDomain as LT } from "./utils/url/isValidDomain.js";
import { isValidUrl as NT } from "./utils/url/isValidUrl.js";
import { normalizeUrl as MT } from "./utils/url/normalizeUrl.js";
import { safeDecodeURIComponent as UT } from "./utils/url/safeDecodeURIComponent.js";
import { uuidToBase36 as wT } from "./utils/uuidToBase36.js";
import { emailSchema as vT } from "./utils/validation/emailSchema.js";
import { escapeForIlike as kT } from "./utils/validation/escapeForIlike.js";
import { isEmptyObject as BT } from "./utils/validation/isEmptyObject.js";
import { isImageIdentifierFieldMetadataType as KT } from "./utils/validation/isImageIdentifierFieldMetadataType.js";
import { isLabelIdentifierFieldMetadataTypes as HT } from "./utils/validation/isLabelIdentifierFieldMetadataTypes.js";
import { getCountryCodesForCallingCode as xT } from "./utils/validation/phones-value/getCountryCodesForCallingCode.js";
import { isValidCountryCode as JT } from "./utils/validation/phones-value/isValidCountryCode.js";
import { isVariableReference as zT, resolveInput as QT } from "./utils/variable-resolver.js";
import { getViewLayoutFromViewType as $T } from "./utils/views/getViewLayoutFromViewType.js";
import { isWidgetViewType as oA } from "./utils/views/isWidgetViewType.js";
import { DEFAULT_LABEL_IDENTIFIER_FIELD_NAME as eA, checkIfFieldIsLabelIdentifier as mA } from "./metadata/check-if-field-is-label-identifier.util.js";
import { ALL_METADATA_NAME as aA } from "./metadata/constants/all-metadata-name.constant.js";
import { DEFAULT_RELATIONS_OBJECTS_STANDARD_IDS as fA } from "./metadata/constants/default-relations-object-standard-ids.constant.js";
import { IDENTIFIER_MAX_CHAR_LENGTH as lA } from "./metadata/constants/identifier-max-char-length.constant.js";
import { RESERVED_METADATA_NAME_KEYWORDS as SA } from "./metadata/constants/reserved-metadata-name-keywords.constant.js";
import { STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS as cA } from "./metadata/constants/standard-object-universal-identifiers.constant.js";
import { STANDARD_OBJECT_FIELDS as AA } from "./metadata/constants/standard-object-fields.constant.js";
import { STANDARD_OBJECTS as IA } from "./metadata/constants/standard-object.constant.js";
import { STANDARD_PAGE_LAYOUT_UNIVERSAL_IDENTIFIERS as OA } from "./metadata/constants/standard-page-layout-universal-identifiers.constant.js";
import { WorkspaceMigrationV2ExceptionCode as FA } from "./metadata/types/MetadataValidationError.js";
import { addCustomSuffixIfIsReserved as uA } from "./metadata/utils/add-custom-suffix-if-reserved.util.js";
import { computeMetadataNameFromLabel as LA } from "./metadata/utils/compute-metadata-name-from-label.util.js";
import { computeMetadataNamesFromLabelsOrThrow as NA } from "./metadata/utils/compute-metadata-names-from-labels-or-throw.util.js";
import { eachTestingContextFilter as MA } from "./testing/EachTestingContextFilter.js";
import { CAPTURE_ALL_VARIABLE_TAG_INNER_REGEX as UA } from "./workflow/constants/CaptureAllVariableTagInnerRegex.js";
import { CONTENT_TYPE_VALUES_HTTP_REQUEST as wA } from "./workflow/constants/ContentTypeValuesHttpRequest.js";
import { IF_ELSE_BRANCH_POSITION_OFFSETS as vA } from "./workflow/constants/IfElseBranchPositionOffsets.js";
import { OBJECTS_BLOCKED_FROM_AUTOMATION as kA } from "./workflow/constants/ObjectsBlockedFromAutomation.js";
import { TRIGGER_STEP_ID as BA } from "./workflow/constants/TriggerStepId.js";
import { WORKFLOW_TRIGGER_METADATA_KEY as KA } from "./workflow/constants/WorkflowTriggerMetadataKey.js";
import { WORKFLOW_TRIGGER_METADATA_LABEL as HA } from "./workflow/constants/WorkflowTriggerMetadataLabel.js";
import { WORKFLOW_TRIGGER_METADATA_WORKSPACE_MEMBER_ID_KEY as xA } from "./workflow/constants/WorkflowTriggerMetadataWorkspaceMemberIdKey.js";
import { WORKFLOW_TRIGGER_METADATA_WORKSPACE_MEMBER_ID_LABEL as JA } from "./workflow/constants/WorkflowTriggerMetadataWorkspaceMemberIdLabel.js";
import { WORKFLOW_TRIGGER_PAYLOAD_KEY as zA } from "./workflow/constants/WorkflowTriggerPayloadKey.js";
import { WORKFLOW_TRIGGER_RECORD_LABEL as ZA } from "./workflow/constants/WorkflowTriggerRecordLabel.js";
import { WORKFLOW_TRIGGER_RECORDS_LABEL as r_ } from "./workflow/constants/WorkflowTriggerRecordsLabel.js";
import { WORKFLOW_DIAGRAM_DEFAULT_NODE_DIMENSIONS as t_ } from "./workflow/layout/constants/WorkflowDiagramDefaultNodeDimensions.js";
import { WORKFLOW_LAYOUT_DEFAULT_OPTIONS as m_ } from "./workflow/layout/constants/WorkflowLayoutDefaultOptions.js";
import { computeWorkflowLayout as a_ } from "./workflow/layout/utils/compute-workflow-layout.util.js";
import { baseWorkflowActionSettingsSchema as f_ } from "./workflow/schemas/base-workflow-action-settings-schema.js";
import { workflowAiAgentActionSettingsSchema as l_ } from "./workflow/schemas/ai-agent-action-settings-schema.js";
import { baseWorkflowActionSchema as S_ } from "./workflow/schemas/base-workflow-action-schema.js";
import { workflowAiAgentActionSchema as c_ } from "./workflow/schemas/ai-agent-action-schema.js";
import { baseTriggerSchema as A_ } from "./workflow/schemas/base-trigger-schema.js";
import { expectedOutputSchemaShape as I_ } from "./workflow/schemas/expected-output-schema-shape.js";
import { workflowCodeActionSettingsSchema as O_ } from "./workflow/schemas/code-action-settings-schema.js";
import { workflowCodeActionSchema as F_ } from "./workflow/schemas/code-action-schema.js";
import { workflowCreateCalendarEventActionSettingsSchema as u_ } from "./workflow/schemas/create-calendar-event-action-settings-schema.js";
import { workflowCreateCalendarEventActionSchema as L_ } from "./workflow/schemas/create-calendar-event-action-schema.js";
import { objectRecordSchema as N_ } from "./workflow/schemas/object-record-schema.js";
import { workflowCreateRecordActionSettingsSchema as M_ } from "./workflow/schemas/create-record-action-settings-schema.js";
import { workflowCreateRecordActionSchema as U_ } from "./workflow/schemas/create-record-action-schema.js";
import { workflowCronTriggerSchema as w_ } from "./workflow/schemas/cron-trigger-schema.js";
import { stepFilterGroupSchema as v_ } from "./workflow/schemas/step-filter-group-schema.js";
import { stepFilterSchema as k_ } from "./workflow/schemas/step-filter-schema.js";
import { workflowDatabaseEventTriggerSchema as B_ } from "./workflow/schemas/database-event-trigger-schema.js";
import { workflowDeleteRecordActionSettingsSchema as K_ } from "./workflow/schemas/delete-record-action-settings-schema.js";
import { workflowDeleteRecordActionSchema as H_ } from "./workflow/schemas/delete-record-action-schema.js";
import { workflowFileSchema as x_ } from "./workflow/schemas/workflow-file-action-schema.js";
import { workflowVariableReferenceSchema as J_ } from "./workflow/schemas/workflow-variable-reference-schema.js";
import { workflowEmailFilesSchema as z_, workflowSendEmailActionSettingsSchema as Q_ } from "./workflow/schemas/send-email-action-settings-schema.js";
import { workflowDraftEmailActionSchema as $_ } from "./workflow/schemas/draft-email-action-schema.js";
import { workflowEmptyActionSettingsSchema as oI } from "./workflow/schemas/empty-action-settings-schema.js";
import { workflowEmptyActionSchema as eI } from "./workflow/schemas/empty-action-schema.js";
import { workflowFilterActionSettingsSchema as iI } from "./workflow/schemas/filter-action-settings-schema.js";
import { workflowFilterActionSchema as pI } from "./workflow/schemas/filter-action-schema.js";
import { workflowFindRecordsActionSettingsSchema as nI } from "./workflow/schemas/find-records-action-settings-schema.js";
import { workflowFindRecordsActionSchema as EI } from "./workflow/schemas/find-records-action-schema.js";
import { workflowFormActionSettingsSchema as sI } from "./workflow/schemas/form-action-settings-schema.js";
import { workflowFormActionSchema as TI } from "./workflow/schemas/form-action-schema.js";
import { workflowHttpRequestActionSettingsSchema as _I } from "./workflow/schemas/http-request-action-settings-schema.js";
import { workflowHttpRequestActionSchema as dI } from "./workflow/schemas/http-request-action-schema.js";
import { stepIfElseBranchSchema as RI, workflowIfElseActionSettingsSchema as FI } from "./workflow/schemas/if-else-action-settings-schema.js";
import { workflowIfElseActionSchema as uI } from "./workflow/schemas/if-else-action-schema.js";
import { workflowIteratorActionSettingsSchema as LI } from "./workflow/schemas/iterator-action-settings-schema.js";
import { workflowIteratorActionSchema as NI } from "./workflow/schemas/iterator-action-schema.js";
import { workflowLogicFunctionActionSettingsSchema as MI } from "./workflow/schemas/logic-function-action-settings-schema.js";
import { workflowLogicFunctionActionSchema as UI } from "./workflow/schemas/logic-function-action-schema.js";
import { workflowManualTriggerSchema as wI } from "./workflow/schemas/manual-trigger-schema.js";
import { workflowPickRecordActionSettingsSchema as vI, workflowPickRecordStrategySchema as bI } from "./workflow/schemas/pick-record-action-settings-schema.js";
import { workflowPickRecordActionSchema as GI } from "./workflow/schemas/pick-record-action-schema.js";
import { workflowSendEmailActionSchema as WI } from "./workflow/schemas/send-email-action-schema.js";
import { workflowUpdateRecordActionSettingsSchema as YI } from "./workflow/schemas/update-record-action-settings-schema.js";
import { workflowUpdateRecordActionSchema as jI } from "./workflow/schemas/update-record-action-schema.js";
import { workflowUpsertRecordActionSettingsSchema as qI } from "./workflow/schemas/upsert-record-action-settings-schema.js";
import { workflowUpsertRecordActionSchema as XI } from "./workflow/schemas/upsert-record-action-schema.js";
import { workflowWebhookTriggerSchema as QI } from "./workflow/schemas/webhook-trigger-schema.js";
import { workflowDelayActionSettingsSchema as $I } from "./workflow/schemas/workflow-delay-action-settings-schema.js";
import { workflowDelayActionSchema as od } from "./workflow/schemas/workflow-delay-action-schema.js";
import { workflowActionSchema as ed } from "./workflow/schemas/workflow-action-schema.js";
import { StepStatus as id } from "./workflow/types/WorkflowRunStateStepInfos.js";
import { workflowRunStepStatusSchema as pd } from "./workflow/schemas/workflow-run-step-status-schema.js";
import { workflowRunStateStepInfoSchema as nd } from "./workflow/schemas/workflow-run-state-step-info-schema.js";
import { workflowRunStateStepInfosSchema as Ed } from "./workflow/schemas/workflow-run-state-step-infos-schema.js";
import { workflowTriggerSchema as sd } from "./workflow/schemas/workflow-trigger-schema.js";
import { workflowRunStateSchema as Td } from "./workflow/schemas/workflow-run-state-schema.js";
import { workflowRunStatusSchema as _d } from "./workflow/schemas/workflow-run-status-schema.js";
import { workflowRunStepLogSchema as dd, workflowRunStepLogsSchema as Od } from "./workflow/schemas/workflow-run-step-log-schema.js";
import { workflowRunSchema as Fd } from "./workflow/schemas/workflow-run-schema.js";
import { WorkflowActionType as ud } from "./workflow/types/WorkflowActionType.js";
import { canObjectBeManagedByAutomation as Ld } from "./workflow/utils/canObjectBeManagedByAutomation.js";
import { extractRawVariableNamePart as Nd } from "./workflow/utils/extractRawVariableNameParts.js";
import { getFunctionInputFromInputSchema as Md } from "./workflow/utils/getFunctionInputFromInputSchema.js";
import { getWorkflowRunContext as Ud } from "./workflow/utils/getWorkflowRunContext.js";
import { isStandaloneVariableString as wd } from "./workflow/utils/isStandaloneVariableString.js";
import { parseBooleanFromStringValue as vd } from "./workflow/utils/parseBooleanFromStringValue.js";
import { parseDataFromContentType as kd } from "./workflow/utils/parseDataFromContentType.js";
import { escapePathSegment as Bd, joinVariablePath as Wd, needsEscaping as Kd, parseVariablePath as Yd } from "./workflow/utils/variable-path.util.js";
import { isIfElseStepInput as jd } from "./workflow/validation/guards/isIfElseStepInput.js";
import { isIteratorStepInput as qd } from "./workflow/validation/guards/isIteratorStepInput.js";
import { getStepInput as Xd, getStepOutgoingStepIds as zd } from "./workflow/validation/utils/get-step-outgoing-step-ids.util.js";
import { buildWorkflowGraph as Zd } from "./workflow/validation/utils/build-workflow-graph.util.js";
import { extractVariablesFromInput as rO } from "./workflow/validation/utils/extract-variables-from-input.util.js";
import { getEditDistance as tO } from "./workflow/validation/utils/get-edit-distance.util.js";
import { isBaseOutputSchemaV2 as mO } from "./workflow/workflow-schema/guards/isBaseOutputSchemaV2.js";
import { collectOutputSchemaPaths as aO } from "./workflow/workflow-schema/utils/collect-output-schema-paths.js";
import { findOutputSchemaPathFailure as fO } from "./workflow/workflow-schema/utils/find-output-schema-path-failure.js";
import { collectOutputSchemaVariablePaths as lO, resolveInSchema as EO, resolveVariablePathInOutputSchema as SO } from "./workflow/workflow-schema/utils/resolve-variable-path-in-output-schema.js";
import { getVariablePathSuggestions as cO } from "./workflow/validation/utils/get-variable-path-suggestions.util.js";
import { validateWorkflowGraph as AO } from "./workflow/validation/utils/validate-workflow-graph.util.js";
import { validateWorkflowStepParams as IO } from "./workflow/validation/utils/validate-workflow-step-params.util.js";
import { validateWorkflowVariableReferences as OO } from "./workflow/validation/utils/validate-workflow-variable-references.util.js";
import { validateWorkflowStructure as FO } from "./workflow/validation/validate-workflow-structure.util.js";
import { buildManualTriggerMetadataNode as uO } from "./workflow/workflow-schema/utils/build-manual-trigger-metadata-node.js";
import { getCurrentItemSchemaFromFlattenedArrayOutputSchema as LO, isFlattenedArrayOutputSchema as CO } from "./workflow/workflow-schema/utils/flattened-array-output-schema.js";
import { navigateOutputSchemaProperty as hO } from "./workflow/workflow-schema/utils/navigate-output-schema-property.js";
import { searchRecordOutputSchema as PO, searchVariableInOutputSchema as UO } from "./workflow/workflow-schema/utils/search-variable-in-output-schema.js";
import { WorkspaceActivationStatus as wO } from "./workspace/types/WorkspaceActivationStatus.js";
import { PROVISIONED_WORKSPACE_ACTIVATION_STATUSES as vO } from "./workspace/constants/ProvisionedWorkspaceActivationStatuses.js";
import { isWorkspaceProvisioned as kO } from "./workspace/utils/isWorkspaceProvisioned.js";
export {
  hf as ACCEPTED_DATE_FORMATS,
  Mf as ACCEPTED_DATE_TIME_FORMATS,
  Jm as ACCOUNT_TYPES,
  e as AI_SDK_PACKAGES,
  o as AI_SDK_PACKAGE_LABELS,
  Eo as ALLOWED_ADDRESS_SUBFIELDS,
  zm as ALLOWED_FULL_NAME_SORT_SUBFIELDS,
  aA as ALL_METADATA_NAME,
  V as APPLICATION_CATEGORIES,
  K as APPLICATION_FILE_UPLOAD_BATCH_SIZE,
  B as APPLICATION_VARIABLE_FIELD_METADATA_TYPES,
  Fp as APP_LOCALES,
  i as ASK_QUESTIONS_TOOL_NAME,
  H as ASSETS_DIR,
  Zm as AUTO_SELECT_FAST_MODEL_ID,
  ri as AUTO_SELECT_SMART_MODEL_ID,
  so as AggregateOperations,
  To as ApiPath,
  _o as AppBasePath,
  Oo as AppPath,
  ti as BACKEND_BATCH_REQUEST_MAX_COUNT,
  Fo as BlocklistScope,
  tc as CANVAS_THEME_DEFAULTS,
  UA as CAPTURE_ALL_VARIABLE_TAG_INNER_REGEX,
  ai as COMMAND_MENU_CONFIRMATION_MODAL_RESULT_BROWSER_EVENT_NAME,
  p as COMPLETE_WORKSPACE_SETUP_TOOL_NAME,
  Wl as COMPOSITE_FIELD_FILTER_OPERANDS_MAP,
  fi as COMPOSITE_FIELD_TYPE_SUB_FIELDS_NAMES,
  oS as COMPOSITE_SUB_FIELD_VALUE_SCHEMAS,
  wA as CONTENT_TYPE_VALUES_HTTP_REQUEST,
  Si as CURRENCY_CODE_LABELS,
  uo as CalendarChannelContactAutoCreationPolicy,
  Lo as CalendarChannelSyncStage,
  No as CalendarChannelSyncStatus,
  Mo as CalendarChannelVisibility,
  mi as CalendarStartDay,
  Uo as CommandMenuItemAvailabilityType,
  wo as CommandMenuItemViewType,
  tt as ConnectedAccountProvider,
  mt as ContextStorePageType,
  at as CoreObjectNameSingular,
  ft as CrudOperationType,
  li as CurrencyCode,
  An as CustomError,
  E as DATABASE_CRUD_OPERATIONS,
  n as DATA_RESIDENCY_KEYS,
  ci as DATE_TYPE_FORMAT,
  x as DEFAULT_API_KEY_NAME,
  J as DEFAULT_API_URL_NAME,
  z as DEFAULT_APP_ACCESS_TOKEN_NAME,
  Z as DEFAULT_APP_APPLICATION_ACCESS_TOKEN_NAME,
  rr as DEFAULT_FUNCTIONS_URL_NAME,
  eA as DEFAULT_LABEL_IDENTIFIER_FIELD_NAME,
  Ai as DEFAULT_NUMBER_OF_GROUPS_LIMIT,
  fA as DEFAULT_RELATIONS_OBJECTS_STANDARD_IDS,
  Ii as DEFAULT_RELATIVE_DATE_FILTER_VALUE,
  Oi as DEFAULT_VISIBLE_ADDRESS_SUBFIELDS,
  Fi as DEFAULT_WIDGET_SIZE,
  ui as DOCUMENTATION_BASE_URL,
  Li as DOCUMENTATION_DEFAULT_LANGUAGE,
  Mi as DOCUMENTATION_DEFAULT_PATH,
  Ni as DOCUMENTATION_PATHS,
  Ui as DOCUMENTATION_SUPPORTED_LANGUAGES,
  Dt as DateDisplayFormat,
  ac as EMAIL_DOCUMENT_MARK_CATALOG,
  Ec as EMAIL_DOCUMENT_NODE_CATALOG,
  _c as EMAIL_DOCUMENT_SCHEMA_VERSION,
  wi as EMAIL_IMAGE_MIME_TYPES,
  vi as ENTERPRISE_INSTANCE_TYPE,
  ki as EXCLUDED_FIELD_NAMES_FROM_AGENT_TOOL_SCHEMA,
  lt as EventLogTable,
  Bi as FIELD_FOR_TOTAL_COUNT_AGGREGATE_OPERATION,
  ut as FIELD_LINKS_VARIANTS,
  Hi as FIELD_METADATA_TYPES_NOT_SUPPORTED_IN_GROUP_BY,
  ct as FIELD_METADATA_TYPES_WITHOUT_DEFAULT_VALUE,
  xi as FIELD_RESTRICTED_ADDITIONAL_PERMISSIONS_REQUIRED,
  Ji as FIELD_TYPE_DEFAULT_ICONS,
  zi as FILES_FIELD_MAX_NUMBER_OF_VALUES,
  Ct as FILE_CATEGORIES,
  Pt as FILTERABLE_FIELD_TYPES,
  Yl as FILTER_OPERANDS_MAP,
  tS as FILTER_VALUE_FORMAT_HINTS,
  eS as FILTER_VALUE_SCHEMAS_MAP,
  PS as FIRST_DAY_OF_WEEK_ISO_8601_MONDAY,
  tr as FRONT_COMPONENT_SHARED_DEPENDENCIES_BUILT_PATH,
  mr as FRONT_COMPONENT_SHARED_DEPENDENCIES_IMPORT_SPECIFIER,
  St as FeatureFlagKey,
  vo as FieldActorSource,
  Ot as FieldMetadataComplexOption,
  Rt as FieldMetadataDefaultOption,
  It as FieldMetadataSettingsOnClickAction,
  k as FieldMetadataType,
  ht as FileFolder,
  yt as FirstDayOfTheWeek,
  ar as GENERATED_DIR,
  Zi as GIN_COMPATIBLE_FIELD_TYPES,
  Oe as GRAPH_WIDGET_CONFIGURATION_TYPES,
  ra as GROUP_BY_DATE_GRANULARITY_THAT_REQUIRE_TIME_ZONE,
  Vt as HTTPMethod,
  ta as IANA_TIME_ZONES,
  lA as IDENTIFIER_MAX_CHAR_LENGTH,
  vA as IF_ELSE_BRANCH_POSITION_OFFSETS,
  ma as IMAGE_IDENTIFIER_FIELD_METADATA_TYPES,
  bt as IndexType,
  Ze as IsValidGraphQLEnumName,
  aa as LABEL_IDENTIFIER_FIELD_METADATA_TYPES,
  Gt as LOGIC_FUNCTION_HTTP_RESPONSE_MARKER,
  fa as MAX_CORE_WORKFLOW_FILTER_RULES,
  la as MAX_CUSTOM_INDEXES_PER_OBJECT,
  Sa as MAX_EMAIL_RECIPIENTS,
  Ki as MAX_OPTIONS_TO_DISPLAY,
  ca as MULTI_ITEM_FIELD_DEFAULT_MAX_VALUES,
  Aa as MULTI_ITEM_FIELD_MIN_MAX_VALUES,
  Ia as MUTATION_MAX_MERGE_RECORDS,
  Kt as MessageCampaignStatus,
  Ht as MessageChannelContactAutoCreationPolicy,
  xt as MessageChannelPendingGroupEmailsAction,
  Jt as MessageChannelSyncStage,
  zt as MessageChannelSyncStatus,
  Zt as MessageChannelType,
  re as MessageChannelVisibility,
  te as MessageFolderImportPolicy,
  me as MessageFolderPendingSyncAction,
  ae as MessageParticipantRole,
  fe as MetadataWritability,
  s as NATIVE_AI_SDK_PROVIDER_IDS,
  fr as NODE_ESM_CJS_BANNER,
  Pf as NON_ISO_DATE_FORMATS,
  le as NavigationMenuItemType,
  gt as NumberDataType,
  kA as OBJECTS_BLOCKED_FROM_AUTOMATION,
  Oa as OBJECTS_WITH_CHANNEL_VISIBILITY_CONSTRAINTS,
  lr as OUTPUT_DIR,
  Se as ObjectOpenRecordIn,
  tp as ObjectRecordBaseEvent,
  mp as ObjectRecordCreateEvent,
  ap as ObjectRecordDeleteEvent,
  fp as ObjectRecordDestroyEvent,
  Ae as ObjectRecordGroupByDateGranularity,
  lp as ObjectRecordRestoreEvent,
  Sp as ObjectRecordUpdateEvent,
  cp as ObjectRecordUpsertEvent,
  Ie as OpenRecordIn,
  ce as OrderByDirection,
  vO as PROVISIONED_WORKSPACE_ACTIVATION_STATUSES,
  Fe as PageLayoutTabLayoutMode,
  ue as PageLayoutType,
  Fa as PermissionFlagType,
  ua as PermissionsOnAllObjectRecords,
  La as QUERY_DEFAULT_LIMIT_RECORDS,
  Na as QUERY_MAX_RECORDS,
  Ma as QUERY_MAX_RECORDS_FROM_RELATION,
  Ua as QUOTED_STRING_REGEX,
  wa as RATING_VALUES,
  va as RELATION_NESTED_QUERY_KEYWORDS,
  SA as RESERVED_METADATA_NAME_KEYWORDS,
  ka as RESERVED_SUBDOMAINS,
  Ne as RecordFilterGroupLogicalOperator,
  Me as RelationOnDeleteAction,
  Ue as RelationType,
  we as RowLevelPermissionPredicateGroupLogicalOperator,
  ve as RowLevelPermissionPredicateOperand,
  ke as SERIALIZED_RELATION_BRAND,
  Op as SOURCE_LOCALE,
  IA as STANDARD_OBJECTS,
  AA as STANDARD_OBJECT_FIELDS,
  Ba as STANDARD_OBJECT_RECORDS_UNDER_OBJECT_RECORDS_PERMISSIONS,
  cA as STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
  OA as STANDARD_PAGE_LAYOUT_UNIVERSAL_IDENTIFIERS,
  Ka as SUBDOMAIN_PATTERN,
  Mm as SYSTEM_VIEW_KEYS,
  Be as ServerFileFolder,
  Ke as SettingsPath,
  He as SidePanelPages,
  xe as StepLogicalOperator,
  id as StepStatus,
  Ym as SyncableEntity,
  Ha as SystemPermissionFlag,
  Tc as TIPTAP_DOCUMENT_SCHEMA_VERSION,
  vc as TIPTAP_MARKS_RENDER_ORDER,
  mc as TIPTAP_MARK_TYPES,
  nc as TIPTAP_NODE_TYPES,
  BA as TRIGGER_STEP_ID,
  xa as TWENTY_COMPANIES_BASE_URL,
  Ja as TWENTY_ICONS_BASE_URL,
  Sr as TWENTY_STANDARD_APPLICATION_NAME,
  cr as TWENTY_STANDARD_APPLICATION_UNIVERSAL_IDENTIFIER,
  T as ToolCategory,
  Je as TwoFactorAuthenticationStrategy,
  za as UI_SCALE_VALUES,
  ze as UpgradeHealthEnum,
  Za as VIEW_GROUP_VISIBLE_OPTIONS_MAX,
  rp as VIEW_TYPE_DEFAULT_ICONS,
  rm as ViewCalendarLayout,
  tm as ViewFilterGroupLogicalOperator,
  mm as ViewFilterOperand,
  am as ViewFilterOperandDeprecated,
  fm as ViewKey,
  lm as ViewOpenRecordIn,
  Sm as ViewSortDirection,
  cm as ViewType,
  Am as ViewVisibility,
  t_ as WORKFLOW_DIAGRAM_DEFAULT_NODE_DIMENSIONS,
  m_ as WORKFLOW_LAYOUT_DEFAULT_OPTIONS,
  KA as WORKFLOW_TRIGGER_METADATA_KEY,
  HA as WORKFLOW_TRIGGER_METADATA_LABEL,
  xA as WORKFLOW_TRIGGER_METADATA_WORKSPACE_MEMBER_ID_KEY,
  JA as WORKFLOW_TRIGGER_METADATA_WORKSPACE_MEMBER_ID_LABEL,
  zA as WORKFLOW_TRIGGER_PAYLOAD_KEY,
  r_ as WORKFLOW_TRIGGER_RECORDS_LABEL,
  ZA as WORKFLOW_TRIGGER_RECORD_LABEL,
  Im as WebhookSubscriptionChannelType,
  Om as WebhookSubscriptionStatus,
  Le as WidgetType,
  ud as WorkflowActionType,
  wO as WorkspaceActivationStatus,
  FA as WorkspaceMigrationV2ExceptionCode,
  aT as absoluteUrlSchema,
  bo as actorCompositeType,
  VE as actorSourceFilterValueSchema,
  uA as addCustomSuffixIfIsReserved,
  _S as addUnitToDateTime,
  dS as addUnitToZonedDateTime,
  Go as addressCompositeType,
  un as appendCopySuffix,
  wp as applyDiff,
  CE as arrayOfStringsOrVariablesSchema,
  hE as arrayOfUuidOrVariableSchema,
  Ip as assertIsDefinedOrThrow,
  nf as assertUnreachable,
  Ef as base64UrlEncode,
  A_ as baseTriggerSchema,
  S_ as baseWorkflowActionSchema,
  f_ as baseWorkflowActionSettingsSchema,
  vE as booleanFilterValueSchema,
  uO as buildManualTriggerMetadataNode,
  fT as buildSignedPath,
  Zd as buildWorkflowGraph,
  xs as camelToKebab,
  Js as camelToSnakeCase,
  Ld as canObjectBeManagedByAutomation,
  Ln as capitalize,
  Ap as checkIfFieldIsImageIdentifier,
  mA as checkIfFieldIsLabelIdentifier,
  El as checkIfShouldComputeEmptinessFilter,
  aO as collectOutputSchemaPaths,
  lO as collectOutputSchemaVariablePaths,
  Pl as combineFilters,
  vp as compareArraysOfObjectsByProperty,
  nE as compareSelectOptionValues,
  rt as compositeTypeDefinitions,
  Ar as computeDeterministicUuid,
  Cf as computeDiffBetweenObjects,
  _l as computeEmptyGqlOperationFilterForEmails,
  dl as computeEmptyGqlOperationFilterForLinks,
  sl as computeGqlOperationFilterForEmails,
  Tl as computeGqlOperationFilterForLinks,
  LA as computeMetadataNameFromLabel,
  NA as computeMetadataNamesFromLabelsOrThrow,
  vn as computeMorphRelationGqlFieldJoinColumnName,
  wn as computeMorphRelationGqlFieldName,
  TS as computeRecordGqlOperationFilter,
  bn as computeRelationGqlFieldJoinColumnName,
  a_ as computeWorkflowLayout,
  df as conditionalAvailabilityParser,
  RS as convertCalendarStartDayNonIsoNumberToFirstDayOfTheWeek,
  DS as convertFirstDayOfTheWeekToCalendarStartDayNumber,
  yl as convertGreaterThanOrEqualRatingToArrayOfRatingValues,
  wl as convertLessThanOrEqualRatingToArrayOfRatingValues,
  Vl as convertRatingToRatingValue,
  ZS as convertViewFilterOperandToCoreOperand,
  pS as convertViewFilterValueToString,
  Cl as createAnyFieldRecordFilterBaseProperties,
  Wo as currencyCompositeType,
  fn as deepMerge,
  jm as deserializeApplicationVariableValue,
  MA as eachTestingContextFilter,
  dc as emailDocumentSchema,
  vT as emailSchema,
  Yo as emailsCompositeType,
  tT as ensureAbsoluteUrl,
  kT as escapeForIlike,
  Bd as escapePathSegment,
  In as evalFromContext,
  Rf as evaluateConditionalAvailabilityExpression,
  I_ as expectedOutputSchemaShape,
  Fn as extractAndSanitizeObjectStringFields,
  il as extractFolderPathFilenameAndTypeOrThrow,
  Nd as extractRawVariableNamePart,
  rO as extractVariablesFromInput,
  gf as fastDeepEqual,
  Tt as fieldMetadataDefaultValueFunctionName,
  kp as filterDuplicatesById,
  Bp as filterOutByProperty,
  gl as filterOutInvalidRecordFilters,
  rs as filterSelectOptionsOfFieldMetadataItem,
  Kp as findById,
  Hp as findByProperty,
  xp as findOrThrow,
  fO as findOutputSchemaPathFailure,
  YE as firstDayOfWeekSchema,
  ln as formatEmailAddress,
  R as formatRecordReference,
  ts as formatToShortNumber,
  rT as formatUpgradeCommandName,
  ms as fromArrayToUniqueKeyRecord,
  as as fromArrayToValuesByKeyRecord,
  jo as fullNameCompositeType,
  bl as generateILikeFiltersForCompositeFields,
  lT as getAbsoluteUrlOrThrow,
  Ir as getAgentUniversalIdentifier,
  Ns as getAppPath,
  Or as getApplicationVariableUniversalIdentifier,
  Fr as getConnectionProviderUniversalIdentifier,
  ls as getConnectionTypename,
  Jp as getContiguousIncrementalValues,
  xT as getCountryCodesForCallingCode,
  LO as getCurrentItemSchemaFromFlattenedArrayOutputSchema,
  Es as getEdgeTypename,
  tO as getEditDistance,
  Gl as getEmptyRecordGqlOperationFilter,
  ur as getFieldPermissionUniversalIdentifier,
  Lr as getFieldUniversalIdentifier,
  jl as getFilterOperandsForFilterableFieldType,
  nl as getFilterTypeFromFieldType,
  iS as getFilterValueSchema,
  nS as getFilterValueValidationIssue,
  gS as getFirstDayOfTheWeekAsANumberForDateFNS,
  CS as getFirstDayOfTheWeekAsISONumber,
  wr as getFolderNavigationMenuItemUniversalIdentifier,
  Nr as getFrontComponentUniversalIdentifier,
  Md as getFunctionInputFromInputSchema,
  Ks as getGenericOperationName,
  Ss as getGroupByConnectionTypename,
  Hs as getHumanReadableNameFromCode,
  Ts as getImageAbsoluteURI,
  Mr as getIndexUniversalIdentifier,
  Os as getLinkFaviconUrl,
  Vr as getLinkNavigationMenuItemUniversalIdentifier,
  AT as getLinkUrlNormalizer,
  Ur as getLogicFunctionUniversalIdentifier,
  _s as getLogoUrlFromDomainName,
  US as getNextPeriodStart,
  ss as getNodeTypename,
  vr as getObjectNavigationMenuItemUniversalIdentifier,
  Gr as getObjectPermissionUniversalIdentifier,
  Wr as getObjectUniversalIdentifier,
  Yr as getPageLayoutUniversalIdentifier,
  hS as getPeriodStart,
  jr as getPermissionFlagUniversalIdentifier,
  qr as getRolePermissionFlagUniversalIdentifier,
  Xr as getRoleTargetUniversalIdentifier,
  Qr as getRoleUniversalIdentifier,
  OT as getSafeUrl,
  $r as getSearchFieldUniversalIdentifier,
  oo as getSelectOptionUniversalIdentifier,
  Sn as getSendableEmailHandles,
  Ms as getSettingsPath,
  eo as getSkillUniversalIdentifier,
  Xd as getStepInput,
  zd as getStepOutgoingStepIds,
  rc as getSubdomainSlugFromDisplayName,
  io as getSystemNavigationCommandMenuItemUniversalIdentifier,
  po as getSystemPageLayoutTabUniversalIdentifier,
  no as getSystemPageLayoutWidgetUniversalIdentifier,
  Fm as getSystemRecordPageLayoutUniversalIdentifier,
  um as getSystemRelationFieldUniversalIdentifier,
  Lm as getSystemViewFieldGroupUniversalIdentifier,
  Nm as getSystemViewFieldUniversalIdentifier,
  Pm as getSystemViewUniversalIdentifier,
  fs as getURLSafely,
  Fs as getUniqueConstraintsFields,
  FT as getUrlHostnameOrThrow,
  yf as getValidTimeZoneOrUndefined,
  cO as getVariablePathSuggestions,
  ym as getViewFieldUniversalIdentifier,
  Vm as getViewFilterUniversalIdentifier,
  bm as getViewGroupUniversalIdentifier,
  $T as getViewLayoutFromViewType,
  br as getViewNavigationMenuItemUniversalIdentifier,
  Gm as getViewSortUniversalIdentifier,
  Wm as getViewUniversalIdentifier,
  Ud as getWorkflowRunContext,
  D as inferAiSdkPackage,
  bE as instantFilterValueSchema,
  uT as isAbsoluteUrl,
  g as isAiSdkPackage,
  us as isAutoSelectModelId,
  mO as isBaseOutputSchemaV2,
  sf as isCallRecordingTranscriptStatusMarker,
  Rc as isCanvasTheme,
  C as isCompleteWorkspaceSetupToolPart,
  h as isDataResidency,
  Vf as isDateWithoutTime,
  _ as isDefined,
  pc as isEmailDocumentMarkType,
  Sc as isEmailDocumentNodeType,
  Dc as isEmailDocumentShape,
  pl as isEmptinessOperand,
  BT as isEmptyObject,
  ql as isExpectedSubFieldName,
  d as isExtendedFileUIPart,
  Gn as isFieldMetadataArrayKind,
  Wn as isFieldMetadataDateKind,
  Yn as isFieldMetadataEligibleForFieldsWidget,
  jn as isFieldMetadataEnumKind,
  qn as isFieldMetadataNumericKind,
  Xn as isFieldMetadataSelectKind,
  $n as isFieldMetadataSupportedInGroupBy,
  ol as isFieldMetadataTextKind,
  At as isFieldMetadataTypeWithDefaultValue,
  Ls as isFieldValueRestricted,
  CO as isFlattenedArrayOutputSchema,
  jd as isIfElseStepInput,
  KT as isImageIdentifierFieldMetadataType,
  qd as isIteratorStepInput,
  v as isKnownApplicationCategory,
  HT as isLabelIdentifierFieldMetadataTypes,
  Bt as isLogicFunctionHttpResponse,
  Xl as isMatchingArrayFilter,
  Ql as isMatchingBooleanFilter,
  $l as isMatchingCurrencyFilter,
  oE as isMatchingDateFilter,
  eE as isMatchingFilesFilter,
  iE as isMatchingFloatFilter,
  pE as isMatchingMultiSelectFilter,
  EE as isMatchingRatingFilter,
  sE as isMatchingRawJsonFilter,
  TE as isMatchingRichTextFilter,
  _E as isMatchingSelectFilter,
  dE as isMatchingStringFilter,
  RE as isMatchingTSVectorFilter,
  DE as isMatchingUUIDFilter,
  xc as isMetadataGqlOperationSignature,
  zp as isNonEmptyArray,
  bf as isPlainDateAfter,
  Gf as isPlainDateBefore,
  Wf as isPlainDateBeforeOrEqual,
  Yf as isPlainDateInSameMonth,
  jf as isPlainDateInWeekend,
  Jc as isPlainObject,
  Rl as isRecordFilterOperandExpectingValue,
  Dl as isRecordFilterValueValid,
  zc as isRecordGqlOperationSignature,
  sc as isRenderedEmailDocumentNodeType,
  IT as isSafeUrl,
  qf as isSamePlainDate,
  Np as isSearchableFieldType,
  wd as isStandaloneVariableString,
  wS as isSubDayRelativeDateFilterUnit,
  P as isSucceededCompleteWorkspaceSetupToolPart,
  Mc as isTipTapNode,
  y as isValidAgentResponseSchemaPropertyKey,
  JT as isValidCountryCode,
  LT as isValidDomain,
  mT as isValidHostname,
  up as isValidLocale,
  Lp as isValidTwentySubdomain,
  NT as isValidUrl,
  Mp as isValidUuid,
  gE as isValidVariable,
  zT as isVariableReference,
  oA as isWidgetViewType,
  kO as isWorkspaceProvisioned,
  Wd as joinVariablePath,
  UE as jsonRelationFilterValueSchema,
  Nn as kebabToCamelCase,
  qo as linksCompositeType,
  gc as listCampaignVariablesForFields,
  Zp as mapById,
  rf as mapByProperty,
  hO as navigateOutputSchemaProperty,
  Kd as needsEscaping,
  kE as nonEmptyStringFilterValueSchema,
  ST as normalizeDomain,
  Up as normalizeLocale,
  MT as normalizeUrl,
  cT as normalizeUrlOrigin,
  GE as numericFilterValueSchema,
  N_ as objectRecordSchema,
  vd as parseBooleanFromStringValue,
  Tf as parseCallRecordingTranscriptEntries,
  Cc as parseCanonicalEmailDocument,
  Pc as parseCanonicalTipTapJsonDocument,
  kd as parseDataFromContentType,
  cn as parseEmailAddressList,
  Nc as parseEmailDocument,
  Us as parseJson,
  Uc as parseTipTapJsonDocument,
  Qf as parseToInstantOrThrow,
  $f as parseToPlainDateOrThrow,
  Yd as parseVariablePath,
  Mn as pascalCase,
  Un as pascalToKebab,
  Xo as phonesCompositeType,
  el as pickMorphGroupSurvivorOrThrow,
  BE as plainDateFilterValueSchema,
  WE as plainDateOrInstantFilterValueSchema,
  yE as relationFilterValueSchemaObject,
  jE as relativeDateFilterAmountSchema,
  qE as relativeDateFilterDirectionSchema,
  QE as relativeDateFilterSchema,
  $E as relativeDateFilterStringifiedSchema,
  XE as relativeDateFilterUnitSchema,
  ws as removePropertiesFromRecord,
  vs as removeUndefinedFields,
  wc as resolveCanvasTheme,
  KS as resolveDateFilter,
  JS as resolveDateTimeFilter,
  EO as resolveInSchema,
  QT as resolveInput,
  Df as resolveObjectMetadataLabel,
  kS as resolveRelativeDateFilter,
  BS as resolveRelativeDateFilterStringified,
  HS as resolveRelativeDateTimeFilter,
  xS as resolveRelativeDateTimeFilterStringified,
  ks as resolveRichTextVariables,
  SO as resolveVariablePathInOutputSchema,
  Qo as richTextCompositeType,
  Zo as richTextValueSchema,
  UT as safeDecodeURIComponent,
  _f as safeGetNestedProperty,
  Bs as safeParseRelativeDateFilterJsonStringified,
  Is as sanitizeURL,
  PO as searchRecordOutputSchema,
  UO as searchVariableInOutputSchema,
  xm as serializeApplicationVariableValue,
  Qn as shouldExcludeFieldFromAgentToolSchema,
  on as sortPlainDate,
  v_ as stepFilterGroupSchema,
  k_ as stepFilterSchema,
  RI as stepIfElseBranchSchema,
  ME as strictArrayOfUuidOrVariableSchema,
  zs as stringifySafely,
  zS as subUnitFromDateTime,
  vS as subUnitFromZonedDateTime,
  tf as sumByProperty,
  Zc as throwIfNotDefined,
  kc as tipTapDocumentToMarkdown,
  Bc as transformEmailDocumentStrings,
  Kc as trimAndRemoveDuplicatedWhitespacesFromObjectStringProperties,
  On as trimAndRemoveDuplicatedWhitespacesFromString,
  hl as turnAnyFieldFilterIntoRecordGqlFilter,
  Xf as turnJSDateToPlainDate,
  en as turnPlainDateIntoUserTimeZoneInstantString,
  an as turnPlainDateToShiftedDateInSystemTimeZone,
  sS as turnRecordFilterGroupsIntoGqlOperationFilter,
  ES as turnRecordFilterIntoRecordGqlOperationFilter,
  Hc as typedObjectEntries,
  Zs as uncapitalize,
  mf as upsertIntoArrayOfObjectsComparingId,
  pf as upsertPropertiesOfItemIntoArrayOfObjectsComparingId,
  wT as uuidToBase36,
  AO as validateWorkflowGraph,
  IO as validateWorkflowStepParams,
  FO as validateWorkflowStructure,
  OO as validateWorkflowVariableReferences,
  ed as workflowActionSchema,
  c_ as workflowAiAgentActionSchema,
  l_ as workflowAiAgentActionSettingsSchema,
  F_ as workflowCodeActionSchema,
  O_ as workflowCodeActionSettingsSchema,
  L_ as workflowCreateCalendarEventActionSchema,
  u_ as workflowCreateCalendarEventActionSettingsSchema,
  U_ as workflowCreateRecordActionSchema,
  M_ as workflowCreateRecordActionSettingsSchema,
  w_ as workflowCronTriggerSchema,
  B_ as workflowDatabaseEventTriggerSchema,
  od as workflowDelayActionSchema,
  $I as workflowDelayActionSettingsSchema,
  H_ as workflowDeleteRecordActionSchema,
  K_ as workflowDeleteRecordActionSettingsSchema,
  $_ as workflowDraftEmailActionSchema,
  z_ as workflowEmailFilesSchema,
  eI as workflowEmptyActionSchema,
  oI as workflowEmptyActionSettingsSchema,
  x_ as workflowFileSchema,
  pI as workflowFilterActionSchema,
  iI as workflowFilterActionSettingsSchema,
  EI as workflowFindRecordsActionSchema,
  nI as workflowFindRecordsActionSettingsSchema,
  TI as workflowFormActionSchema,
  sI as workflowFormActionSettingsSchema,
  dI as workflowHttpRequestActionSchema,
  _I as workflowHttpRequestActionSettingsSchema,
  uI as workflowIfElseActionSchema,
  FI as workflowIfElseActionSettingsSchema,
  NI as workflowIteratorActionSchema,
  LI as workflowIteratorActionSettingsSchema,
  UI as workflowLogicFunctionActionSchema,
  MI as workflowLogicFunctionActionSettingsSchema,
  wI as workflowManualTriggerSchema,
  GI as workflowPickRecordActionSchema,
  vI as workflowPickRecordActionSettingsSchema,
  bI as workflowPickRecordStrategySchema,
  Fd as workflowRunSchema,
  Td as workflowRunStateSchema,
  nd as workflowRunStateStepInfoSchema,
  Ed as workflowRunStateStepInfosSchema,
  _d as workflowRunStatusSchema,
  dd as workflowRunStepLogSchema,
  Od as workflowRunStepLogsSchema,
  pd as workflowRunStepStatusSchema,
  WI as workflowSendEmailActionSchema,
  Q_ as workflowSendEmailActionSettingsSchema,
  sd as workflowTriggerSchema,
  jI as workflowUpdateRecordActionSchema,
  YI as workflowUpdateRecordActionSettingsSchema,
  XI as workflowUpsertRecordActionSchema,
  qI as workflowUpsertRecordActionSettingsSchema,
  J_ as workflowVariableReferenceSchema,
  QI as workflowWebhookTriggerSchema
};
