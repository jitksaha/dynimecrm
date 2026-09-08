import { TWENTY_STANDARD_APPLICATION_UNIVERSAL_IDENTIFIER as e } from "../../../application/constants/TwentyStandardApplicationUniversalIdentifier.js";
import { getSystemPageLayoutTabUniversalIdentifier as I } from "../../../application/deterministic-identifier/get-system-page-layout-tab-universal-identifier.util.js";
import { getSystemPageLayoutWidgetUniversalIdentifier as l } from "../../../application/deterministic-identifier/get-system-page-layout-widget-universal-identifier.util.js";
import { getSystemRecordPageLayoutUniversalIdentifier as c } from "../../../application/deterministic-identifier/get-system-record-page-layout-universal-identifier.util.js";
var u = ({ objectUniversalIdentifier: r, tabs: a }) => {
  const t = c({
    objectMetadataApplicationUniversalIdentifier: e,
    objectUniversalIdentifier: r
  });
  return {
    universalIdentifier: t,
    tabs: Object.fromEntries(Object.entries(a).map(([n, { title: o, widgets: s }]) => {
      const i = I({
        objectMetadataApplicationUniversalIdentifier: e,
        pageLayoutUniversalIdentifier: t,
        title: o
      });
      return [n, {
        universalIdentifier: i,
        widgets: Object.fromEntries(Object.entries(s).map(([d, f]) => [d, { universalIdentifier: l({
          objectMetadataApplicationUniversalIdentifier: e,
          pageLayoutTabUniversalIdentifier: i,
          title: f
        }) }]))
      }];
    }))
  };
};
export {
  u as buildStandardObjectRecordPageLayout
};

//# sourceMappingURL=build-standard-object-record-page-layout.util.js.map