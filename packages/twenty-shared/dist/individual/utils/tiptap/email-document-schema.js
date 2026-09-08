import { TIPTAP_MARK_TYPES as o } from "./tiptap-mark-types.js";
import { TIPTAP_NODE_TYPES as t } from "./tiptap-node-types.js";
import { EMAIL_DOCUMENT_SCHEMA_VERSION as n } from "./email-document-schema-version.js";
import { z as e } from "zod";
var a = e.record(e.string().regex(/^[a-zA-Z]+$/).max(40), e.string().max(400)).optional(), s = e.discriminatedUnion("type", [
  e.looseObject({ type: e.literal(o.BOLD) }),
  e.looseObject({ type: e.literal(o.ITALIC) }),
  e.looseObject({ type: e.literal(o.UNDERLINE) }),
  e.looseObject({ type: e.literal(o.STRIKE) }),
  e.looseObject({
    type: e.literal(o.LINK),
    attrs: e.looseObject({ href: e.string().max(4e3) }).optional()
  })
]), c = e.looseObject({
  type: e.literal(t.TEXT),
  text: e.string().min(1),
  marks: e.array(s).optional()
}), m = e.looseObject({
  type: e.literal(t.VARIABLE_TAG),
  attrs: e.looseObject({ variable: e.string().nullable() })
}), p = e.looseObject({ type: e.literal(t.HARD_BREAK) }), r = e.discriminatedUnion("type", [
  c,
  m,
  p
]), l = e.array(e.lazy(() => u)), b = e.looseObject({
  type: e.literal(t.PARAGRAPH),
  attrs: e.looseObject({}).optional(),
  content: e.array(r).optional()
}), O = e.looseObject({
  type: e.literal(t.HEADING),
  attrs: e.looseObject({ level: e.union([
    e.literal(1),
    e.literal(2),
    e.literal(3)
  ]) }),
  content: e.array(r).optional()
}), i = e.looseObject({
  type: e.literal(t.LIST_ITEM),
  attrs: e.looseObject({}).optional(),
  content: l.min(1)
}), d = e.looseObject({
  type: e.literal(t.BULLET_LIST),
  attrs: e.looseObject({}).optional(),
  content: e.array(i).min(1)
}), y = e.looseObject({
  type: e.literal(t.ORDERED_LIST),
  attrs: e.looseObject({}).optional(),
  content: e.array(i).min(1)
}), j = e.looseObject({
  type: e.literal(t.IMAGE),
  attrs: e.looseObject({
    fileId: e.uuid().nullable().optional(),
    src: e.string().max(4e3),
    alt: e.string().nullable().optional(),
    title: e.string().nullable().optional(),
    align: e.string().nullable().optional(),
    width: e.union([e.string(), e.number()]).nullable().optional(),
    href: e.string().max(4e3).nullable().optional()
  })
}), g = e.looseObject({
  type: e.literal(t.SECTION),
  attrs: e.looseObject({ style: a }),
  content: l.min(1)
}), h = e.looseObject({
  type: e.literal(t.COLUMN),
  attrs: e.looseObject({ style: a }),
  content: l.min(1)
}), S = e.looseObject({
  type: e.literal(t.COLUMNS),
  attrs: e.looseObject({ style: a }),
  content: e.array(h).min(2).max(4)
}), N = e.looseObject({
  type: e.literal(t.BUTTON),
  attrs: e.looseObject({
    href: e.string().max(4e3).nullable(),
    style: a
  }),
  content: e.array(e.looseObject({
    type: e.literal(t.TEXT),
    text: e.string().min(1)
  })).optional()
}), v = e.looseObject({
  type: e.literal(t.DIVIDER),
  attrs: e.looseObject({ style: a })
}), T = e.looseObject({
  type: e.literal(t.HTML),
  attrs: e.looseObject({ html: e.string().max(1e5) })
}), u = e.discriminatedUnion("type", [
  b,
  O,
  d,
  y,
  j,
  g,
  S,
  N,
  v,
  T
]), E = e.looseObject({
  pageBackground: e.string().optional(),
  pagePadding: e.string().optional(),
  textAlign: e.enum([
    "left",
    "center",
    "right"
  ]).optional(),
  bodyBackground: e.string().optional(),
  textColor: e.string().optional(),
  width: e.string().optional(),
  padding: e.string().optional(),
  cornerRadius: e.string().optional(),
  borderWidth: e.string().optional(),
  borderColor: e.string().optional()
}), R = e.looseObject({
  type: e.literal(t.DOCUMENT),
  attrs: e.looseObject({
    schemaVersion: e.int().min(1).max(n).optional(),
    canvasTheme: E.nullable().optional()
  }).optional(),
  content: l.optional()
});
export {
  R as emailDocumentSchema
};

//# sourceMappingURL=email-document-schema.js.map