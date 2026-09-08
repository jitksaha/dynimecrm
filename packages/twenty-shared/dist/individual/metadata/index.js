import { checkIfFieldIsImageIdentifier as r } from "./check-if-field-is-image-identifier.util.js";
import { DEFAULT_LABEL_IDENTIFIER_FIELD_NAME as E, checkIfFieldIsLabelIdentifier as A } from "./check-if-field-is-label-identifier.util.js";
import { ALL_METADATA_NAME as t } from "./constants/all-metadata-name.constant.js";
import { DEFAULT_RELATIONS_OBJECTS_STANDARD_IDS as e } from "./constants/default-relations-object-standard-ids.constant.js";
import { IDENTIFIER_MAX_CHAR_LENGTH as D } from "./constants/identifier-max-char-length.constant.js";
import { RESERVED_METADATA_NAME_KEYWORDS as f } from "./constants/reserved-metadata-name-keywords.constant.js";
import { STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS as N } from "./constants/standard-object-universal-identifiers.constant.js";
import { STANDARD_OBJECT_FIELDS as S } from "./constants/standard-object-fields.constant.js";
import { STANDARD_OBJECTS as a } from "./constants/standard-object.constant.js";
import { STANDARD_PAGE_LAYOUT_UNIVERSAL_IDENTIFIERS as d } from "./constants/standard-page-layout-universal-identifiers.constant.js";
import { WorkspaceMigrationV2ExceptionCode as c } from "./types/MetadataValidationError.js";
import { addCustomSuffixIfIsReserved as O } from "./utils/add-custom-suffix-if-reserved.util.js";
import { computeMetadataNameFromLabel as l } from "./utils/compute-metadata-name-from-label.util.js";
import { computeMetadataNamesFromLabelsOrThrow as U } from "./utils/compute-metadata-names-from-labels-or-throw.util.js";
export {
  t as ALL_METADATA_NAME,
  E as DEFAULT_LABEL_IDENTIFIER_FIELD_NAME,
  e as DEFAULT_RELATIONS_OBJECTS_STANDARD_IDS,
  D as IDENTIFIER_MAX_CHAR_LENGTH,
  f as RESERVED_METADATA_NAME_KEYWORDS,
  a as STANDARD_OBJECTS,
  S as STANDARD_OBJECT_FIELDS,
  N as STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
  d as STANDARD_PAGE_LAYOUT_UNIVERSAL_IDENTIFIERS,
  c as WorkspaceMigrationV2ExceptionCode,
  O as addCustomSuffixIfIsReserved,
  r as checkIfFieldIsImageIdentifier,
  A as checkIfFieldIsLabelIdentifier,
  l as computeMetadataNameFromLabel,
  U as computeMetadataNamesFromLabelsOrThrow
};
