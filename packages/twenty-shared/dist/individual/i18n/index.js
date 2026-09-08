import { createI18nInstanceFactory as a } from "./create-i18n-instance-factory.js";
import { generateMessageId as A } from "./generate-message-id.js";
import { getMetadataLabelContext as o } from "./get-metadata-label-context.js";
import { interpolateMessagePlaceholders as L } from "./interpolate-message-placeholders.js";
import { METADATA_LABEL_PLACEHOLDER_NAMES as _, METADATA_LABEL_PLACEHOLDER_PASS_THROUGH as M, OBJECT_METADATA_LABEL_PLACEHOLDER_NAMES as T, buildObjectMetadataLabelPlaceholderValues as m, getMetadataLabelPlaceholder as d, hasObjectMetadataLabelPlaceholder as P } from "./metadata-label-placeholder.js";
import { TRANSLATABLE_PROPERTIES_BY_METADATA_NAME as i } from "./translatable-properties-by-metadata-name.js";
export {
  _ as METADATA_LABEL_PLACEHOLDER_NAMES,
  M as METADATA_LABEL_PLACEHOLDER_PASS_THROUGH,
  T as OBJECT_METADATA_LABEL_PLACEHOLDER_NAMES,
  i as TRANSLATABLE_PROPERTIES_BY_METADATA_NAME,
  m as buildObjectMetadataLabelPlaceholderValues,
  a as createI18nInstanceFactory,
  A as generateMessageId,
  o as getMetadataLabelContext,
  d as getMetadataLabelPlaceholder,
  P as hasObjectMetadataLabelPlaceholder,
  L as interpolateMessagePlaceholders
};
