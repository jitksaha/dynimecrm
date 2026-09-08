import { ViewFilterOperand as e } from "../../../../types/ViewFilterOperand.js";
import { arrayOfStringsOrVariablesSchema as S } from "./arrayOfStringsOrVariablesSchema.js";
import { strictArrayOfUuidOrVariableSchema as i } from "./arrayOfUuidsOrVariablesSchema.js";
import { jsonRelationFilterValueSchema as o } from "./jsonRelationFilterValueSchema.js";
import { actorSourceFilterValueSchema as _, booleanFilterValueSchema as N, instantFilterValueSchema as n, nonEmptyStringFilterValueSchema as I, numericFilterValueSchema as t, plainDateFilterValueSchema as T, plainDateOrInstantFilterValueSchema as R } from "./filterValueScalarSchemas.js";
import { relativeDateFilterStringifiedSchema as s } from "../../dates/utils/relativeDateFilterStringifiedSchema.js";
var c = o.refine(({ selectedRecordIds: a }) => i.safeParse(a).success, "Expected selectedRecordIds to contain UUIDs or variables").refine(({ selectedRecordIds: a, isCurrentWorkspaceMemberSelected: l, isCurrentRecordSelected: A }) => a.length > 0 || l === !0 || A === !0, "Expected at least one selected record").or(i.refine((a) => a.length > 0, "Expected at least one selected record")), E = I.refine((a) => {
  if (S.safeParse(a).success) return !0;
  try {
    JSON.parse(a);
  } catch {
    return !0;
  }
  return !1;
}, "Expected an array of option values"), r = {
  [e.CONTAINS]: I,
  [e.DOES_NOT_CONTAIN]: I
}, O = {
  [e.IS]: t,
  [e.IS_NOT]: t,
  [e.GREATER_THAN_OR_EQUAL]: t,
  [e.LESS_THAN_OR_EQUAL]: t
}, L = {
  TEXT: r,
  EMAILS: r,
  FULL_NAME: r,
  ADDRESS: r,
  LINKS: r,
  PHONES: r,
  RAW_JSON: r,
  FILES: r,
  ARRAY: r,
  ACTOR: r,
  MULTI_SELECT: {
    [e.CONTAINS]: E,
    [e.DOES_NOT_CONTAIN]: E
  },
  SELECT: {
    [e.IS]: E,
    [e.IS_NOT]: E
  },
  CURRENCY: O,
  NUMBER: O,
  RATING: O,
  DATE: {
    [e.IS]: T,
    [e.IS_BEFORE]: T,
    [e.IS_AFTER]: T,
    [e.IS_RELATIVE]: s
  },
  DATE_TIME: {
    [e.IS]: R,
    [e.IS_BEFORE]: n,
    [e.IS_AFTER]: n,
    [e.IS_RELATIVE]: s
  },
  RELATION: {
    [e.IS]: c,
    [e.IS_NOT]: c
  },
  UUID: {
    [e.IS]: i,
    [e.IS_NOT]: i
  },
  BOOLEAN: { [e.IS]: N },
  TS_VECTOR: { [e.VECTOR_SEARCH]: I }
}, V = {
  ACTOR: {
    source: {
      [e.IS]: _,
      [e.IS_NOT]: _
    },
    workspaceMemberId: {
      [e.IS]: c,
      [e.IS_NOT]: c
    }
  },
  CURRENCY: { currencyCode: {
    [e.IS]: S,
    [e.IS_NOT]: S
  } },
  ADDRESS: { addressCountry: {
    [e.CONTAINS]: S,
    [e.DOES_NOT_CONTAIN]: S
  } }
}, h = {
  [e.IS_RELATIVE]: 'Expected a stringified relative date such as "NEXT_30_DAY".',
  [e.VECTOR_SEARCH]: "Expected a non empty search string."
};
export {
  V as COMPOSITE_SUB_FIELD_VALUE_SCHEMAS,
  h as FILTER_VALUE_FORMAT_HINTS,
  L as FILTER_VALUE_SCHEMAS_MAP
};

//# sourceMappingURL=filterValueSchemasMap.js.map