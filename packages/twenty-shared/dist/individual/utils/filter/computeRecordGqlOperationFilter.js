import { isDefined as e } from "../validation/isDefined.js";
import { turnRecordFilterIntoRecordGqlOperationFilter as u } from "./turnRecordFilterIntoGqlOperationFilter.js";
import { turnRecordFilterGroupsIntoGqlOperationFilter as m } from "./turnRecordFilterGroupIntoGqlOperationFilter.js";
var I = ({ fieldMetadataItems: d, recordFilters: o, recordFilterGroups: i, filterValueDependencies: n }) => {
  const l = new Map(d.map((r) => [r.id, r])), p = o.filter((r) => !e(r.recordFilterGroupId)).map((r) => u({
    recordFilter: r,
    fieldMetadataItemById: l,
    filterValueDependencies: n
  })).filter(e), a = i.find((r) => !r.parentRecordFilterGroupId)?.id, c = m({
    filterValueDependencies: n,
    filters: o,
    fieldMetadataItemById: l,
    recordFilterGroups: i,
    currentRecordFilterGroupId: a
  }), t = [...p, c].filter(e);
  return t.length === 0 ? {} : t.length === 1 ? t[0] : { and: t };
};
export {
  I as computeRecordGqlOperationFilter
};

//# sourceMappingURL=computeRecordGqlOperationFilter.js.map