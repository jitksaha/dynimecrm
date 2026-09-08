import { isDefined as i } from "../validation/isDefined.js";
import { RecordFilterGroupLogicalOperator as f } from "../../types/RecordFilterGroupLogicalOperator.js";
import { turnRecordFilterIntoRecordGqlOperationFilter as u } from "./turnRecordFilterIntoGqlOperationFilter.js";
var O = ({ filterValueDependencies: l, filters: n, fieldMetadataItemById: p, recordFilterGroups: t, currentRecordFilterGroupId: e }) => {
  const o = t.find((r) => r.id === e);
  if (!i(o)) return;
  const a = n.filter((r) => r.recordFilterGroupId === e).map((r) => u({
    filterValueDependencies: l,
    recordFilter: r,
    fieldMetadataItemById: p
  })).filter(i), c = t.filter((r) => r.parentRecordFilterGroupId === e).map((r) => O({
    filterValueDependencies: l,
    filters: n,
    fieldMetadataItemById: p,
    recordFilterGroups: t,
    currentRecordFilterGroupId: r.id
  })).filter(i);
  if (o.logicalOperator === f.AND) return { and: [...a, ...c] };
  if (o.logicalOperator === f.OR) return { or: [...a, ...c] };
  throw new Error(`Unknown logical operator ${o.logicalOperator}`);
};
export {
  O as turnRecordFilterGroupsIntoGqlOperationFilter
};

//# sourceMappingURL=turnRecordFilterGroupIntoGqlOperationFilter.js.map