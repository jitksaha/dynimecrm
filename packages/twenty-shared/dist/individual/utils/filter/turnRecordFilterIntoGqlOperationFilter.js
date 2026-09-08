import { isDefined as m } from "../validation/isDefined.js";
import { FieldMetadataType as l } from "../../types/FieldMetadataType.js";
import { FieldActorSource as f } from "../../types/composite-types/actor.composite-type.js";
import { ViewFilterOperand as r } from "../../types/ViewFilterOperand.js";
import { CustomError as R } from "../errors/CustomError.js";
import { computeMorphRelationGqlFieldName as k } from "../fieldMetadata/compute-morph-relation-gql-field-name.js";
import { computeMorphRelationGqlFieldJoinColumnName as U, computeRelationGqlFieldJoinColumnName as L } from "../fieldMetadata/compute-relation-gql-field-join-column-name.js";
import { getFilterTypeFromFieldType as y } from "./utils/getFilterTypeFromFieldType.js";
import { checkIfShouldComputeEmptinessFilter as b } from "./checkIfShouldComputeEmptinessFilter.js";
import { computeGqlOperationFilterForEmails as P } from "./compute-record-gql-operation-filter/for-composite-field/computeGqlOperationFilterForEmails.js";
import { computeGqlOperationFilterForLinks as D } from "./compute-record-gql-operation-filter/for-composite-field/computeGqlOperationFilterForLinks.js";
import { isRecordFilterValueValid as I } from "./isRecordFilterValueValid.js";
import { convertGreaterThanOrEqualRatingToArrayOfRatingValues as V, convertLessThanOrEqualRatingToArrayOfRatingValues as q, convertRatingToRatingValue as T } from "./utils/fieldRatingConvertors.js";
import { generateILikeFiltersForCompositeFields as j } from "./utils/generateILikeFiltersForCompositeFields.js";
import { getEmptyRecordGqlOperationFilter as G } from "./utils/getEmptyRecordGqlOperationFilter.js";
import { isExpectedSubFieldName as E } from "./utils/isExpectedSubFieldName.js";
import { arrayOfStringsOrVariablesSchema as h } from "./utils/validation-schemas/arrayOfStringsOrVariablesSchema.js";
import { arrayOfUuidOrVariableSchema as w } from "./utils/validation-schemas/arrayOfUuidsOrVariablesSchema.js";
import { jsonRelationFilterValueSchema as _ } from "./utils/validation-schemas/jsonRelationFilterValueSchema.js";
import { actorSourceFilterValueSchema as H, booleanFilterValueSchema as Y, instantFilterValueSchema as W, numericFilterValueSchema as Z, plainDateOrInstantFilterValueSchema as J } from "./utils/validation-schemas/filterValueScalarSchemas.js";
import { getPeriodStart as Q } from "./dates/utils/getPeriodStart.js";
import { getNextPeriodStart as B } from "./dates/utils/getNextPeriodStart.js";
import { resolveRelativeDateFilterStringified as x } from "./dates/utils/resolveRelativeDateFilterStringified.js";
import { resolveDateFilter as z } from "./dates/utils/resolveDateFilter.js";
import { resolveDateTimeFilter as g } from "./dates/utils/resolveDateTimeFilter.js";
import { isNonEmptyString as $ } from "@sniptt/guards";
import { Temporal as O } from "temporal-polyfill";
var K = /(?!^)\+|[^0-9+]/g, X = /[0-9]/, d = Y.catch(!1), N = (n) => {
  const e = Z.safeParse(n);
  return e.success ? e.data : parseFloat(n);
}, v = (n) => {
  const e = H.safeParse(n);
  return e.success ? e.data : JSON.parse(n);
}, F = ({ sourceFieldMetadataItem: n, targetFieldMetadataItem: e }) => {
  if (n.type !== l.MORPH_RELATION) return n.name;
  const p = e.relation?.sourceObjectMetadata.id, t = n.morphRelations?.find((c) => c.targetObjectMetadata.id === p);
  if (!m(t)) throw new R(`No morph relation on field ${n.name} targets the traversed object ${p}`, "UNRESOLVED_MORPH_RELATION_TRAVERSAL");
  return k({
    fieldName: n.name,
    relationType: t.type,
    targetObjectMetadataNameSingular: t.targetObjectMetadata.nameSingular,
    targetObjectMetadataNamePlural: t.targetObjectMetadata.namePlural
  });
}, kn = ({ recordFilter: n, fieldMetadataItemById: e, filterValueDependencies: p }) => {
  const t = e.get(n.fieldMetadataId);
  if (m(t) && I(n)) {
    if ((t.type === l.RELATION || t.type === l.MORPH_RELATION) && m(n.relationTargetFieldMetadataId)) {
      const c = e.get(n.relationTargetFieldMetadataId);
      if (!m(c)) return;
      const u = F({
        sourceFieldMetadataItem: t,
        targetFieldMetadataItem: c
      }), o = A({
        recordFilter: {
          ...n,
          fieldMetadataId: c.id,
          relationTargetFieldMetadataId: null
        },
        fieldMetadataItem: c,
        filterValueDependencies: p
      });
      return m(o) ? { [u]: o } : void 0;
    }
    return A({
      recordFilter: n,
      fieldMetadataItem: t,
      filterValueDependencies: p
    });
  }
}, M = ({ fieldMetadataItem: n, filterValueDependencies: e }) => {
  if (n.type !== l.MORPH_RELATION) return L({ name: n.name });
  const p = n.morphRelations?.find((t) => t.targetObjectMetadata.nameSingular === e.currentRecord?.objectMetadataNameSingular);
  if (m(p))
    return U({
      fieldName: n.name,
      relationType: p.type,
      targetObjectMetadataNameSingular: p.targetObjectMetadata.nameSingular,
      targetObjectMetadataNamePlural: p.targetObjectMetadata.namePlural
    });
}, A = ({ recordFilter: n, fieldMetadataItem: e, filterValueDependencies: p }) => {
  if (b({
    recordFilterOperand: n.operand,
    correspondingFieldMetadataItem: e
  })) return G({
    operand: n.operand,
    correspondingField: e,
    recordFilter: n
  });
  const t = n.subFieldName, c = $(t), u = y(e.type);
  switch (u) {
    case "TEXT":
      switch (n.operand) {
        case r.CONTAINS:
          return { [e.name]: { ilike: `%${n.value}%` } };
        case r.DOES_NOT_CONTAIN:
          return { not: { [e.name]: { ilike: `%${n.value}%` } } };
        default:
          throw new R(`Unknown operand ${n.operand} for ${u} filter`, "UNKNOWN_OPERAND_FOR_FILTER");
      }
    case "TS_VECTOR":
      if (n.operand === r.VECTOR_SEARCH)
        return { [e.name]: { search: n.value } };
      throw new Error(`Unknown operand ${n.operand} for ${u} filter`);
    case "RAW_JSON":
      switch (n.operand) {
        case r.CONTAINS:
          return { [e.name]: { like: `%${n.value}%` } };
        case r.DOES_NOT_CONTAIN:
          return { not: { [e.name]: { like: `%${n.value}%` } } };
        default:
          throw new Error(`Unknown operand ${n.operand} for ${u} filter`);
      }
    case "FILES":
      switch (n.operand) {
        case r.CONTAINS:
          return { [e.name]: { like: `%${n.value}%` } };
        case r.DOES_NOT_CONTAIN:
          return { not: { [e.name]: { like: `%${n.value}%` } } };
        default:
          throw new Error(`Unknown operand ${n.operand} for ${u} filter`);
      }
    case "DATE":
      if (n.operand === r.IS_RELATIVE) {
        const o = x(n.value), s = z({
          value: "PAST_1_DAY",
          operand: r.IS_RELATIVE
        });
        if (!s) throw new Error("Failed to resolve default date range");
        const i = o?.start?.toString() ?? s.start, a = o?.end?.toString() ?? s.end;
        return { and: [{ [e.name]: { gte: i } }, { [e.name]: { lt: a } }] };
      }
      if (n.operand === r.IS_TODAY || n.operand === r.IS_IN_PAST || n.operand === r.IS_IN_FUTURE) {
        const o = O.Now.plainDateISO(p.timeZone).toString();
        switch (n.operand) {
          case r.IS_IN_PAST:
            return { [e.name]: { lt: o } };
          case r.IS_IN_FUTURE:
            return { [e.name]: { gte: o } };
          case r.IS_TODAY:
            return { [e.name]: { eq: o } };
        }
      } else {
        const o = n.value;
        switch (n.operand) {
          case r.IS_AFTER:
            return { [e.name]: { gte: o } };
          case r.IS_BEFORE:
            return { [e.name]: { lt: o } };
          case r.IS:
            return { [e.name]: { eq: o } };
        }
      }
      throw new Error(`Unknown operand ${n.operand} for ${u} filter`);
    case "DATE_TIME":
      if (n.operand === r.IS_RELATIVE) {
        const o = g(n), s = m(o) && typeof o == "object" ? o : null;
        if (!m(s)) throw new Error(`Cannot parse relative date filter : "${n.value}"`);
        const i = g({
          value: `PAST_1_DAY;;${p.timeZone}`,
          operand: r.IS_RELATIVE
        });
        if (!m(i?.start) || !m(i?.end)) throw new Error("Failed to resolve default date range");
        const a = s?.start ?? i.start, S = s?.end ?? i.end;
        return { and: [{ [e.name]: { gte: a.toInstant().toString() } }, { [e.name]: { lt: S.toInstant().toString() } }] };
      }
      if (n.operand === r.IS_TODAY || n.operand === r.IS_IN_PAST || n.operand === r.IS_IN_FUTURE) {
        const o = O.Now.zonedDateTimeISO(p.timeZone);
        switch (n.operand) {
          case r.IS_IN_PAST:
            return { [e.name]: { lt: o.toInstant().round("minute").toString() } };
          case r.IS_IN_FUTURE:
            return { [e.name]: { gt: o.toInstant().round("minute").toString() } };
          case r.IS_TODAY:
            return { and: [{ [e.name]: { gte: Q(o, "DAY").toInstant().toString() } }, { [e.name]: { lt: B(o, "DAY").toInstant().toString() } }] };
        }
      } else {
        if (!$(n.value)) throw new Error("Date filter is empty");
        if (n.operand === r.IS) {
          const s = p.timeZone ?? "UTC", i = J.safeParse(n.value);
          if (!i.success) throw new Error(`Cannot parse "${n.value}" for ${u} filter`);
          const a = (i.data instanceof O.Instant ? i.data.toZonedDateTimeISO(s).toPlainDate() : i.data).toZonedDateTime(s), S = a.toInstant(), C = a.add({ days: 1 }).toInstant();
          return { and: [{ [e.name]: { gte: S.toString() } }, { [e.name]: { lt: C.toString() } }] };
        }
        const o = W.parse(n.value);
        switch (n.operand) {
          case r.IS_AFTER:
            return { [e.name]: { gte: o.toString() } };
          case r.IS_BEFORE:
            return { [e.name]: { lt: o.toString() } };
        }
      }
      throw new Error(`Unknown operand ${n.operand} for ${u} filter`);
    case "RATING":
      switch (n.operand) {
        case r.IS:
          return { [e.name]: { eq: T(N(n.value)) } };
        case r.IS_NOT:
          return { not: { [e.name]: { eq: T(N(n.value)) } } };
        case r.GREATER_THAN_OR_EQUAL:
          return { [e.name]: { in: V(N(n.value)) } };
        case r.LESS_THAN_OR_EQUAL:
          return { [e.name]: { in: q(N(n.value)) } };
        default:
          throw new Error(`Unknown operand ${n.operand} for ${u} filter`);
      }
    case "NUMBER":
      switch (n.operand) {
        case r.GREATER_THAN_OR_EQUAL:
          return { [e.name]: { gte: N(n.value) } };
        case r.LESS_THAN_OR_EQUAL:
          return { [e.name]: { lte: N(n.value) } };
        case r.IS:
          return { [e.name]: { eq: N(n.value) } };
        case r.IS_NOT:
          return { not: { [e.name]: { eq: N(n.value) } } };
        default:
          throw new Error(`Unknown operand ${n.operand} for ${u} filter`);
      }
    case "RELATION": {
      const { isCurrentWorkspaceMemberSelected: o, isCurrentRecordSelected: s, selectedRecordIds: i } = _.catch({
        isCurrentWorkspaceMemberSelected: !1,
        isCurrentRecordSelected: !1,
        selectedRecordIds: w.parse(n.value)
      }).parse(n.value), a = [
        ...i,
        ...o ? [p?.currentWorkspaceMemberId] : [],
        ...s ? [p.currentRecord?.id] : []
      ].filter(m);
      if (a.length === 0) return;
      const S = M({
        fieldMetadataItem: e,
        filterValueDependencies: p
      });
      if (!m(S)) return;
      switch (n.operand) {
        case r.IS:
          return { [S]: { in: a } };
        case r.IS_NOT:
          return !m(a) || a.length === 0 ? void 0 : { or: [{ not: { [S]: { in: a } } }, { [S]: { is: "NULL" } }] };
        default:
          throw new Error(`Unknown operand ${n.operand} for ${u} filter`);
      }
    }
    case "CURRENCY":
      if (E(l.CURRENCY, "currencyCode", t)) {
        const o = h.parse(n.value);
        if (o.length === 0) return;
        const s = { [e.name]: { currencyCode: { in: o } } };
        switch (n.operand) {
          case r.IS:
            return s;
          case r.IS_NOT:
            return { not: s };
          default:
            throw new Error(`Unknown operand ${n.operand} for ${u} / ${t} filter`);
        }
      } else if (E(l.CURRENCY, "amountMicros", t) || !c) switch (n.operand) {
        case r.GREATER_THAN_OR_EQUAL:
          return { [e.name]: { amountMicros: { gte: N(n.value) * 1e6 } } };
        case r.LESS_THAN_OR_EQUAL:
          return { [e.name]: { amountMicros: { lte: N(n.value) * 1e6 } } };
        case r.IS:
          return { [e.name]: { amountMicros: { eq: N(n.value) * 1e6 } } };
        case r.IS_NOT:
          return { not: { [e.name]: { amountMicros: { eq: N(n.value) * 1e6 } } } };
        default:
          throw new Error(`Unknown operand ${n.operand} for ${u} / ${t}  filter`);
      }
      else throw new Error(`Unknown subfield ${t} for ${u} filter`);
    case "LINKS":
      return D({
        correspondingFieldMetadataItem: e,
        recordFilter: n,
        subFieldName: t
      });
    case "FULL_NAME": {
      const o = j(n.value, e.name, ["firstName", "lastName"]);
      switch (n.operand) {
        case r.CONTAINS:
          return c ? { [e.name]: { [t]: { ilike: `%${n.value}%` } } } : { or: o };
        case r.DOES_NOT_CONTAIN:
          return c ? { not: { [e.name]: { [t]: { ilike: `%${n.value}%` } } } } : { and: o.map((s) => ({ not: s })) };
        default:
          throw new Error(`Unknown operand ${n.operand} for ${u} filter`);
      }
    }
    case "ADDRESS":
      switch (n.operand) {
        case r.CONTAINS:
          if (c) {
            if (t === "addressCountry") {
              const o = h.parse(n.value);
              return o.length === 0 ? {} : { [e.name]: { [t]: { in: o } } };
            }
            return { [e.name]: { [t]: { ilike: `%${n.value}%` } } };
          } else
            return { or: [
              { [e.name]: { addressStreet1: { ilike: `%${n.value}%` } } },
              { [e.name]: { addressStreet2: { ilike: `%${n.value}%` } } },
              { [e.name]: { addressCity: { ilike: `%${n.value}%` } } },
              { [e.name]: { addressState: { ilike: `%${n.value}%` } } },
              { [e.name]: { addressCountry: { ilike: `%${n.value}%` } } },
              { [e.name]: { addressPostcode: { ilike: `%${n.value}%` } } }
            ] };
        case r.DOES_NOT_CONTAIN:
          if (c) {
            if (t === "addressCountry") {
              const o = h.parse(n.value);
              return n.value === "[]" || o.length === 0 ? {} : { or: [{ not: { [e.name]: { addressCountry: { in: o } } } }, { [e.name]: { addressCountry: { is: "NULL" } } }] };
            }
            return { or: [{ not: { [e.name]: { [t]: { ilike: `%${n.value}%` } } } }, { [e.name]: { [t]: { is: "NULL" } } }] };
          } else
            return { and: [
              { or: [{ not: { [e.name]: { addressStreet1: { ilike: `%${n.value}%` } } } }, { [e.name]: { addressStreet1: { is: "NULL" } } }] },
              { or: [{ not: { [e.name]: { addressStreet2: { ilike: `%${n.value}%` } } } }, { [e.name]: { addressStreet2: { is: "NULL" } } }] },
              { or: [{ not: { [e.name]: { addressCity: { ilike: `%${n.value}%` } } } }, { [e.name]: { addressCity: { is: "NULL" } } }] },
              { or: [{ not: { [e.name]: { addressState: { ilike: `%${n.value}%` } } } }, { [e.name]: { addressState: { is: "NULL" } } }] },
              { or: [{ not: { [e.name]: { addressPostcode: { ilike: `%${n.value}%` } } } }, { [e.name]: { addressPostcode: { is: "NULL" } } }] },
              { or: [{ not: { [e.name]: { addressCountry: { ilike: `%${n.value}%` } } } }, { [e.name]: { addressCountry: { is: "NULL" } } }] }
            ] };
        default:
          throw new Error(`Unknown operand ${n.operand} for ${u} filter`);
      }
    case "MULTI_SELECT": {
      const o = h.parse(n.value);
      if (o.length === 0) return;
      const s = o.filter((a) => a === ""), i = o.filter((a) => a !== "");
      switch (n.operand) {
        case r.CONTAINS: {
          const a = [];
          return i.length > 0 && a.push({ [e.name]: { containsAny: i } }), s.length > 0 && a.push({ [e.name]: { isEmptyArray: !0 } }), a.length === 1 ? a[0] : { or: a };
        }
        case r.DOES_NOT_CONTAIN:
          return { or: [
            { not: { [e.name]: { containsAny: i } } },
            { [e.name]: { isEmptyArray: !0 } },
            { [e.name]: { is: "NULL" } }
          ] };
        default:
          throw new Error(`Unknown operand ${n.operand} for ${u} filter`);
      }
    }
    case "SELECT": {
      const o = h.parse(n.value);
      if (o.length === 0) return;
      const s = o.filter((a) => a === ""), i = o.filter((a) => a !== "");
      switch (n.operand) {
        case r.IS: {
          const a = [];
          return i.length > 0 && a.push({ [e.name]: { in: i } }), s.length > 0 && a.push({ [e.name]: { is: "NULL" } }), a.length === 1 ? a[0] : { or: a };
        }
        case r.IS_NOT: {
          const a = [];
          return i.length > 0 && a.push({ not: { [e.name]: { in: i } } }), s.length > 0 && a.push({ not: { [e.name]: { is: "NULL" } } }), a.length === 1 ? a[0] : { and: a };
        }
        default:
          throw new Error(`Unknown operand ${n.operand} for ${u} filter`);
      }
    }
    case "ARRAY":
      switch (n.operand) {
        case r.CONTAINS:
          return { [e.name]: { containsIlike: `%${n.value}%` } };
        case r.DOES_NOT_CONTAIN:
          return { not: { [e.name]: { containsIlike: `%${n.value}%` } } };
        default:
          throw new Error(`Unknown operand ${n.operand} for ${u} filter`);
      }
    case "ACTOR": {
      if (t === "source") switch (n.operand) {
        case r.IS: {
          if (n.value === "[]") return;
          const s = v(n.value);
          return { [e.name]: { source: { in: s } } };
        }
        case r.IS_NOT: {
          if (n.value === "[]") return;
          const s = v(n.value);
          return s.length === 0 ? void 0 : { not: { [e.name]: { source: { in: s } } } };
        }
        default:
          throw new Error(`Unknown operand ${n.operand} for ${e.label} filter`);
      }
      if (t === "workspaceMemberId") {
        const { isCurrentWorkspaceMemberSelected: s, selectedRecordIds: i } = _.catch({
          isCurrentWorkspaceMemberSelected: !1,
          selectedRecordIds: w.parse(n.value)
        }).parse(n.value), a = s ? [...i, p?.currentWorkspaceMemberId].filter(m) : i;
        if (!m(a) || a.length === 0) return;
        switch (n.operand) {
          case r.IS:
            return { [e.name]: { workspaceMemberId: { in: a } } };
          case r.IS_NOT:
            return { or: [{ not: { [e.name]: { workspaceMemberId: { in: a } } } }, { [e.name]: { workspaceMemberId: { is: "NULL" } } }] };
          default:
            throw new Error(`Unknown operand ${n.operand} for ${e.label} filter`);
        }
      }
      const o = Object.values(f).filter((s) => s.toLowerCase().includes(n.value.toLowerCase()));
      switch (n.operand) {
        case r.CONTAINS:
          return { or: [{ [e.name]: { name: { ilike: `%${n.value}%` } } }, ...o.length > 0 ? [{ [e.name]: { source: { in: o } } }] : []] };
        case r.DOES_NOT_CONTAIN:
          return { and: [{ not: { [e.name]: { name: { ilike: `%${n.value}%` } } } }, ...o.length > 0 ? [{ not: { [e.name]: { source: { in: o } } } }] : []] };
        default:
          throw new Error(`Unknown operand ${n.operand} for ${e.label} filter`);
      }
    }
    case "EMAILS":
      return P({
        correspondingFieldMetadataItem: e,
        recordFilter: n,
        subFieldName: t
      });
    case "PHONES": {
      if (!c) {
        const s = n.value.trim().replace(K, "");
        if (!X.test(s)) return;
        switch (n.operand) {
          case r.CONTAINS:
            return { or: [
              { [e.name]: { primaryPhoneNumber: { ilike: `%${s}%` } } },
              { [e.name]: { primaryPhoneCallingCode: { ilike: `%${s}%` } } },
              { [e.name]: { additionalPhones: { like: `%${s}%` } } }
            ] };
          case r.DOES_NOT_CONTAIN:
            return { and: [
              { not: { [e.name]: { primaryPhoneNumber: { ilike: `%${s}%` } } } },
              { not: { [e.name]: { primaryPhoneCallingCode: { ilike: `%${s}%` } } } },
              { or: [{ not: { [e.name]: { additionalPhones: { like: `%${s}%` } } } }, { [e.name]: { additionalPhones: { is: "NULL" } } }] }
            ] };
          default:
            throw new Error(`Unknown operand ${n.operand} for ${u} filter`);
        }
      }
      const o = n.value;
      switch (t) {
        case "additionalPhones":
          switch (n.operand) {
            case r.CONTAINS:
              return { or: [{ [e.name]: { additionalPhones: { like: `%${o}%` } } }] };
            case r.DOES_NOT_CONTAIN:
              return { or: [{ not: { [e.name]: { additionalPhones: { like: `%${o}%` } } } }, { [e.name]: { additionalPhones: { is: "NULL" } } }] };
            default:
              throw new Error(`Unknown operand ${n.operand} for ${u} filter`);
          }
        case "primaryPhoneNumber":
          switch (n.operand) {
            case r.CONTAINS:
              return { [e.name]: { primaryPhoneNumber: { ilike: `%${o}%` } } };
            case r.DOES_NOT_CONTAIN:
              return { not: { [e.name]: { primaryPhoneNumber: { ilike: `%${o}%` } } } };
            default:
              throw new Error(`Unknown operand ${n.operand} for ${u} filter`);
          }
        case "primaryPhoneCallingCode":
          switch (n.operand) {
            case r.CONTAINS:
              return { [e.name]: { primaryPhoneCallingCode: { ilike: `%${o}%` } } };
            case r.DOES_NOT_CONTAIN:
              return { not: { [e.name]: { primaryPhoneCallingCode: { ilike: `%${o}%` } } } };
            default:
              throw new Error(`Unknown operand ${n.operand} for ${u} filter`);
          }
        default:
          throw new Error(`Unknown subfield ${t} for ${u} filter`);
      }
    }
    case "BOOLEAN":
      return { [e.name]: { eq: d.parse(n.value) } };
    case "UUID": {
      const o = w.parse(n.value), s = m(o) && o.length > 0 ? o : ["00000000-0000-4000-8000-000000000000"];
      switch (n.operand) {
        case r.IS:
          return { [e.name]: { in: s } };
        case r.IS_NOT:
          return { not: { [e.name]: { in: s } } };
        default:
          throw new Error(`Unknown operand ${n.operand} for ${u} filter`);
      }
    }
    default:
      throw new Error("Unknown filter type");
  }
};
export {
  kn as turnRecordFilterIntoRecordGqlOperationFilter
};

//# sourceMappingURL=turnRecordFilterIntoGqlOperationFilter.js.map