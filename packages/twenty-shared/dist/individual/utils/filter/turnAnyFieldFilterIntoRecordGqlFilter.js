import { isDefined as E } from "../validation/isDefined.js";
import { FieldMetadataType as i } from "../../types/FieldMetadataType.js";
import { ViewFilterOperand as r } from "../../types/ViewFilterOperand.js";
import { CURRENCY_CODE_LABELS as y } from "../../constants/CurrencyCodeLabels.js";
import { isNonEmptyArray as c } from "../array/isNonEmptyArray.js";
import { createAnyFieldRecordFilterBaseProperties as o } from "./utils/createAnyFieldRecordFilterBaseProperties.js";
import { turnRecordFilterIntoRecordGqlOperationFilter as C } from "./turnRecordFilterIntoGqlOperationFilter.js";
import { filterSelectOptionsOfFieldMetadataItem as S } from "./utils/filterSelectOptionsOfFieldMetadataItem.js";
import { isNonEmptyString as m } from "@sniptt/guards";
import { z as O } from "zod";
var M = Object.entries(y).map(([e, { label: s }]) => ({
  value: e,
  label: `${s} (${e})`
})), g = ({ filterValue: e, fields: s }) => {
  const a = [], f = O.coerce.number().safeParse(e).success;
  for (const t of s) switch (t.type) {
    case i.TEXT:
      a.push({
        ...o({
          filterValue: e,
          fieldMetadataItem: t
        }),
        operand: r.CONTAINS,
        type: "TEXT"
      });
      break;
    case i.ADDRESS:
      a.push({
        ...o({
          filterValue: e,
          fieldMetadataItem: t
        }),
        operand: r.CONTAINS,
        type: "ADDRESS"
      });
      break;
    case i.LINKS:
      a.push({
        ...o({
          filterValue: e,
          fieldMetadataItem: t
        }),
        operand: r.CONTAINS,
        type: "LINKS"
      });
      break;
    case i.FULL_NAME:
      a.push({
        ...o({
          filterValue: e,
          fieldMetadataItem: t
        }),
        operand: r.CONTAINS,
        type: "FULL_NAME"
      });
      break;
    case i.ARRAY:
      a.push({
        ...o({
          filterValue: e,
          fieldMetadataItem: t
        }),
        operand: r.CONTAINS,
        type: "ARRAY"
      });
      break;
    case i.EMAILS:
      a.push({
        ...o({
          filterValue: e,
          fieldMetadataItem: t
        }),
        operand: r.CONTAINS,
        type: "EMAILS"
      });
      break;
    case i.PHONES:
      a.push({
        ...o({
          filterValue: e,
          fieldMetadataItem: t
        }),
        operand: r.CONTAINS,
        type: "PHONES"
      });
      break;
    case i.NUMBER:
      f && a.push({
        ...o({
          filterValue: e,
          fieldMetadataItem: t
        }),
        operand: r.IS,
        type: "NUMBER"
      });
      break;
    case i.CURRENCY:
      if (f && a.push({
        ...o({
          filterValue: e,
          fieldMetadataItem: t
        }),
        operand: r.IS,
        type: "CURRENCY"
      }), m(e)) {
        const d = M.filter((p) => p.label.includes(e) || p.value.includes(e));
        if (c(d)) {
          const p = JSON.stringify(d.map((n) => n.value));
          a.push({
            ...o({
              filterValue: p,
              fieldMetadataItem: t
            }),
            operand: r.IS,
            type: "CURRENCY",
            subFieldName: "currencyCode"
          });
        }
      }
      break;
    case i.SELECT:
      if (m(e)) {
        const { foundCorrespondingSelectOptions: d } = S({
          fieldMetadataItem: t,
          filterValue: e
        });
        if (c(d)) {
          const p = JSON.stringify(d.map((n) => n.value));
          a.push({
            ...o({
              fieldMetadataItem: t,
              filterValue: p
            }),
            operand: r.IS,
            type: "SELECT"
          });
        }
      }
      break;
    case i.MULTI_SELECT:
      if (m(e)) {
        const { foundCorrespondingSelectOptions: d } = S({
          fieldMetadataItem: t,
          filterValue: e
        });
        if (c(d)) {
          const p = JSON.stringify(d.map((n) => n.value));
          a.push({
            ...o({
              fieldMetadataItem: t,
              filterValue: p
            }),
            operand: r.CONTAINS,
            type: "MULTI_SELECT"
          });
        }
      }
      break;
  }
  const N = new Map(s.map((t) => [t.id, t])), I = a.map((t) => C({
    filterValueDependencies: {},
    fieldMetadataItemById: N,
    recordFilter: t
  })).filter(E), l = { or: I };
  return I.length === 0 ? { recordGqlOperationFilter: {} } : { recordGqlOperationFilter: l };
};
export {
  g as turnAnyFieldFilterIntoRecordGqlFilter
};

//# sourceMappingURL=turnAnyFieldFilterIntoRecordGqlFilter.js.map