import { TWENTY_STANDARD_APPLICATION_UNIVERSAL_IDENTIFIER as n } from "../../../application/constants/TwentyStandardApplicationUniversalIdentifier.js";
import { getSystemViewFieldUniversalIdentifier as f } from "../../../application/deterministic-identifier/get-system-view-field-universal-identifier.util.js";
import { SYSTEM_VIEW_KEYS as o, getSystemViewUniversalIdentifier as I } from "../../../application/deterministic-identifier/get-system-view-universal-identifier.util.js";
var E = ({ objectUniversalIdentifier: i, fields: a, viewFieldNames: d }) => {
  const r = I({
    objectMetadataApplicationUniversalIdentifier: n,
    objectUniversalIdentifier: i,
    viewKey: o.INDEX
  });
  return {
    universalIdentifier: r,
    viewFields: Object.fromEntries(d.map((e) => {
      const t = a[e];
      if (t === void 0) throw new Error(`Missing field "${e}" for the INDEX view of object ${i}`);
      return [e, { universalIdentifier: f({
        fieldMetadataApplicationUniversalIdentifier: n,
        viewUniversalIdentifier: r,
        fieldMetadataUniversalIdentifier: t.universalIdentifier
      }) }];
    }))
  };
};
export {
  E as buildStandardObjectIndexView
};

//# sourceMappingURL=build-standard-object-index-view.util.js.map