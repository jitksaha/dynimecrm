import { RESERVED_METADATA_NAME_KEYWORDS as t } from "../constants/reserved-metadata-name-keywords.constant.js";
var E = (r) => r && (t.includes(r) ? `${r}Custom` : r);
export {
  E as addCustomSuffixIfIsReserved
};

//# sourceMappingURL=add-custom-suffix-if-reserved.util.js.map