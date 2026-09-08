import { APPLICATION_CATEGORIES as e, isKnownApplicationCategory as r } from "./applicationCategoryType.js";
import { APPLICATION_VARIABLE_FIELD_METADATA_TYPES as o } from "./applicationVariablesType.js";
import { APPLICATION_FILE_UPLOAD_BATCH_SIZE as n } from "./constants/ApplicationFileUploadBatchSize.js";
import { ASSETS_DIR as a } from "./constants/AssetDirectory.js";
import { DEFAULT_API_KEY_NAME as l } from "./constants/DefaultApiKeyName.js";
import { DEFAULT_API_URL_NAME as s } from "./constants/DefaultApiUrlName.js";
import { DEFAULT_APP_ACCESS_TOKEN_NAME as A } from "./constants/DefaultAppAccessTokenName.js";
import { DEFAULT_APP_APPLICATION_ACCESS_TOKEN_NAME as g } from "./constants/DefaultAppApplicationAccessTokenName.js";
import { DEFAULT_FUNCTIONS_URL_NAME as U } from "./constants/DefaultFunctionsUrlName.js";
import { FRONT_COMPONENT_SHARED_DEPENDENCIES_BUILT_PATH as N } from "./constants/FrontComponentSharedDependenciesBuiltPath.js";
import { FRONT_COMPONENT_SHARED_DEPENDENCIES_IMPORT_SPECIFIER as P } from "./constants/FrontComponentSharedDependenciesImportSpecifier.js";
import { GENERATED_DIR as D } from "./constants/GeneratedDirectory.js";
import { NODE_ESM_CJS_BANNER as L } from "./constants/NodeEsmCjsBanner.js";
import { OUTPUT_DIR as R } from "./constants/OutputDirectory.js";
import { TWENTY_STANDARD_APPLICATION_NAME as M } from "./constants/TwentyStandardApplicationName.js";
import { TWENTY_STANDARD_APPLICATION_UNIVERSAL_IDENTIFIER as c } from "./constants/TwentyStandardApplicationUniversalIdentifier.js";
import { computeDeterministicUuid as y } from "./deterministic-identifier/compute-deterministic-uuid.util.js";
import { getAgentUniversalIdentifier as b } from "./deterministic-identifier/get-agent-universal-identifier.util.js";
import { getApplicationVariableUniversalIdentifier as K } from "./deterministic-identifier/get-application-variable-universal-identifier.util.js";
import { getConnectionProviderUniversalIdentifier as G } from "./deterministic-identifier/get-connection-provider-universal-identifier.util.js";
import { getFieldPermissionUniversalIdentifier as W } from "./deterministic-identifier/get-field-permission-universal-identifier.util.js";
import { getFieldUniversalIdentifier as k } from "./deterministic-identifier/get-field-universal-identifier.util.js";
import { getFrontComponentUniversalIdentifier as z } from "./deterministic-identifier/get-front-component-universal-identifier.util.js";
import { getIndexUniversalIdentifier as J } from "./deterministic-identifier/get-index-universal-identifier.util.js";
import { getLogicFunctionUniversalIdentifier as q } from "./deterministic-identifier/get-logic-function-universal-identifier.util.js";
import { getFolderNavigationMenuItemUniversalIdentifier as X, getLinkNavigationMenuItemUniversalIdentifier as $, getObjectNavigationMenuItemUniversalIdentifier as ii, getViewNavigationMenuItemUniversalIdentifier as ei } from "./deterministic-identifier/get-navigation-menu-item-universal-identifier.util.js";
import { getObjectPermissionUniversalIdentifier as ti } from "./deterministic-identifier/get-object-permission-universal-identifier.util.js";
import { getObjectUniversalIdentifier as mi } from "./deterministic-identifier/get-object-universal-identifier.util.js";
import { getPageLayoutUniversalIdentifier as fi } from "./deterministic-identifier/get-page-layout-universal-identifier.util.js";
import { getPermissionFlagUniversalIdentifier as Ii } from "./deterministic-identifier/get-permission-flag-universal-identifier.util.js";
import { getRolePermissionFlagUniversalIdentifier as pi } from "./deterministic-identifier/get-role-permission-flag-universal-identifier.util.js";
import { getRoleTargetUniversalIdentifier as Ei } from "./deterministic-identifier/get-role-target-universal-identifier.util.js";
import { getRoleUniversalIdentifier as _i } from "./deterministic-identifier/get-role-universal-identifier.util.js";
import { getSearchFieldUniversalIdentifier as di } from "./deterministic-identifier/get-search-field-universal-identifier.util.js";
import { getSelectOptionUniversalIdentifier as vi } from "./deterministic-identifier/get-select-option-universal-identifier.util.js";
import { getSkillUniversalIdentifier as Ti } from "./deterministic-identifier/get-skill-universal-identifier.util.js";
import { getSystemNavigationCommandMenuItemUniversalIdentifier as Si } from "./deterministic-identifier/get-system-navigation-command-menu-item-universal-identifier.util.js";
import { getSystemPageLayoutTabUniversalIdentifier as Fi } from "./deterministic-identifier/get-system-page-layout-tab-universal-identifier.util.js";
import { getSystemPageLayoutWidgetUniversalIdentifier as Oi } from "./deterministic-identifier/get-system-page-layout-widget-universal-identifier.util.js";
import { getSystemRecordPageLayoutUniversalIdentifier as Ci } from "./deterministic-identifier/get-system-record-page-layout-universal-identifier.util.js";
import { getSystemRelationFieldUniversalIdentifier as Vi } from "./deterministic-identifier/get-system-relation-field-universal-identifier.util.js";
import { getSystemViewFieldGroupUniversalIdentifier as ui } from "./deterministic-identifier/get-system-view-field-group-universal-identifier.util.js";
import { getSystemViewFieldUniversalIdentifier as wi } from "./deterministic-identifier/get-system-view-field-universal-identifier.util.js";
import { SYSTEM_VIEW_KEYS as Yi, getSystemViewUniversalIdentifier as Ki } from "./deterministic-identifier/get-system-view-universal-identifier.util.js";
import { getViewFieldUniversalIdentifier as Gi } from "./deterministic-identifier/get-view-field-universal-identifier.util.js";
import { getViewFilterUniversalIdentifier as Wi } from "./deterministic-identifier/get-view-filter-universal-identifier.util.js";
import { getViewGroupUniversalIdentifier as ki } from "./deterministic-identifier/get-view-group-universal-identifier.util.js";
import { getViewSortUniversalIdentifier as zi } from "./deterministic-identifier/get-view-sort-universal-identifier.util.js";
import { getViewUniversalIdentifier as Ji } from "./deterministic-identifier/get-view-universal-identifier.util.js";
import { SyncableEntity as qi } from "./enums/syncable-entities.enum.js";
import { deserializeApplicationVariableValue as Xi, serializeApplicationVariableValue as $i } from "./utils/applicationVariableValueSerialization.js";
export {
  e as APPLICATION_CATEGORIES,
  n as APPLICATION_FILE_UPLOAD_BATCH_SIZE,
  o as APPLICATION_VARIABLE_FIELD_METADATA_TYPES,
  a as ASSETS_DIR,
  l as DEFAULT_API_KEY_NAME,
  s as DEFAULT_API_URL_NAME,
  A as DEFAULT_APP_ACCESS_TOKEN_NAME,
  g as DEFAULT_APP_APPLICATION_ACCESS_TOKEN_NAME,
  U as DEFAULT_FUNCTIONS_URL_NAME,
  N as FRONT_COMPONENT_SHARED_DEPENDENCIES_BUILT_PATH,
  P as FRONT_COMPONENT_SHARED_DEPENDENCIES_IMPORT_SPECIFIER,
  D as GENERATED_DIR,
  L as NODE_ESM_CJS_BANNER,
  R as OUTPUT_DIR,
  Yi as SYSTEM_VIEW_KEYS,
  qi as SyncableEntity,
  M as TWENTY_STANDARD_APPLICATION_NAME,
  c as TWENTY_STANDARD_APPLICATION_UNIVERSAL_IDENTIFIER,
  y as computeDeterministicUuid,
  Xi as deserializeApplicationVariableValue,
  b as getAgentUniversalIdentifier,
  K as getApplicationVariableUniversalIdentifier,
  G as getConnectionProviderUniversalIdentifier,
  W as getFieldPermissionUniversalIdentifier,
  k as getFieldUniversalIdentifier,
  X as getFolderNavigationMenuItemUniversalIdentifier,
  z as getFrontComponentUniversalIdentifier,
  J as getIndexUniversalIdentifier,
  $ as getLinkNavigationMenuItemUniversalIdentifier,
  q as getLogicFunctionUniversalIdentifier,
  ii as getObjectNavigationMenuItemUniversalIdentifier,
  ti as getObjectPermissionUniversalIdentifier,
  mi as getObjectUniversalIdentifier,
  fi as getPageLayoutUniversalIdentifier,
  Ii as getPermissionFlagUniversalIdentifier,
  pi as getRolePermissionFlagUniversalIdentifier,
  Ei as getRoleTargetUniversalIdentifier,
  _i as getRoleUniversalIdentifier,
  di as getSearchFieldUniversalIdentifier,
  vi as getSelectOptionUniversalIdentifier,
  Ti as getSkillUniversalIdentifier,
  Si as getSystemNavigationCommandMenuItemUniversalIdentifier,
  Fi as getSystemPageLayoutTabUniversalIdentifier,
  Oi as getSystemPageLayoutWidgetUniversalIdentifier,
  Ci as getSystemRecordPageLayoutUniversalIdentifier,
  Vi as getSystemRelationFieldUniversalIdentifier,
  ui as getSystemViewFieldGroupUniversalIdentifier,
  wi as getSystemViewFieldUniversalIdentifier,
  Ki as getSystemViewUniversalIdentifier,
  Gi as getViewFieldUniversalIdentifier,
  Wi as getViewFilterUniversalIdentifier,
  ki as getViewGroupUniversalIdentifier,
  ei as getViewNavigationMenuItemUniversalIdentifier,
  zi as getViewSortUniversalIdentifier,
  Ji as getViewUniversalIdentifier,
  r as isKnownApplicationCategory,
  $i as serializeApplicationVariableValue
};
