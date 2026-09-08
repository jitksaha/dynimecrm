import { TWENTY_STANDARD_APPLICATION_UNIVERSAL_IDENTIFIER as t } from "../../../application/constants/TwentyStandardApplicationUniversalIdentifier.js";
import { getSystemViewFieldGroupUniversalIdentifier as f } from "../../../application/deterministic-identifier/get-system-view-field-group-universal-identifier.util.js";
import { getSystemViewFieldUniversalIdentifier as s } from "../../../application/deterministic-identifier/get-system-view-field-universal-identifier.util.js";
import { SYSTEM_VIEW_KEYS as l, getSystemViewUniversalIdentifier as I } from "../../../application/deterministic-identifier/get-system-view-universal-identifier.util.js";
var E = ({ objectUniversalIdentifier: n, fields: a, viewFieldNames: d, viewFieldGroupNames: o }) => {
  const r = I({
    objectMetadataApplicationUniversalIdentifier: t,
    objectUniversalIdentifier: n,
    viewKey: l.FIELDS_WIDGET
  });
  return {
    universalIdentifier: r,
    viewFields: Object.fromEntries(d.map((e) => {
      const i = a[e];
      if (i === void 0) throw new Error(`Missing field "${e}" for the record-page view of object ${n}`);
      return [e, { universalIdentifier: s({
        fieldMetadataApplicationUniversalIdentifier: t,
        viewUniversalIdentifier: r,
        fieldMetadataUniversalIdentifier: i.universalIdentifier
      }) }];
    })),
    viewFieldGroups: Object.fromEntries(Object.entries(o).map(([e, i]) => [e, { universalIdentifier: f({
      objectMetadataApplicationUniversalIdentifier: t,
      viewUniversalIdentifier: r,
      name: i
    }) }]))
  };
};
export {
  E as buildStandardObjectRecordPageFieldsView
};

//# sourceMappingURL=build-standard-object-record-page-fields-view.util.js.map