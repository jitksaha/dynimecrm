import { formatRecordReference as E } from "../../ai/utils/format-record-reference.util.js";
import { TIPTAP_MARK_TYPES as s } from "./tiptap-mark-types.js";
import { TIPTAP_NODE_TYPES as a } from "./tiptap-node-types.js";
import { parseTipTapJsonDocument as A } from "./parse-tiptap-json-document.js";
import { TIPTAP_MARKS_RENDER_ORDER as $ } from "./tiptap-marks-render-order.js";
var i = (t) => (t.content ?? []).map(T).join(""), c = (t) => t.replace(/([\\`*_[\]{}<>~|#&])/g, "\\$1").replace(/^(\s{0,3})>(?=\s|$)/gm, "$1\\>").replace(/^(\s{0,3})-(?=-{2}|\s|$)/gm, "$1\\-").replace(/^(\s{0,3})\+(?=\s|$)/gm, "$1\\+").replace(/^(\s{0,3}\d+)([.)])(?=\s|$)/gm, "$1\\$2"), f = {
  "\\": "%5C",
  "(": "%28",
  ")": "%29",
  "<": "%3C",
  ">": "%3E"
}, p = (t) => t.replace(/[\\()<>\s]/g, (r) => r in f ? f[r] : encodeURIComponent(r)), I = (t, r) => {
  switch (r.type) {
    case s.BOLD:
      return `**${t}**`;
    case s.ITALIC:
      return `_${t}_`;
    case s.UNDERLINE:
      return `<u>${t}</u>`;
    case s.STRIKE:
      return `~~${t}~~`;
    case s.LINK: {
      const e = r.attrs?.href;
      return typeof e == "string" ? `[${t}](${p(e)})` : t;
    }
    default:
      return t;
  }
}, R = (t) => {
  const r = t.attrs?.objectNameSingular, e = t.attrs?.recordId, n = t.attrs?.label;
  return typeof r == "string" && typeof e == "string" ? E({
    objectNameSingular: r,
    recordId: e,
    displayName: typeof n == "string" ? n : ""
  }) : typeof n == "string" ? `@${n}` : "";
}, l = (t, r) => {
  const [e = "", ...n] = i(t).trim().split(`
`), m = " ".repeat(r.length), o = n.map((u) => u === "" ? "" : `${m}${u}`).join(`
`);
  return `${r}${e}${o === "" ? "" : `
${o}`}
`;
}, T = (t) => {
  switch (t.type) {
    case a.TEXT:
      return [...t.marks ?? []].sort((r, e) => $.indexOf(r.type) - $.indexOf(e.type)).reduce((r, e) => I(r, e), c(t.text ?? ""));
    case a.HARD_BREAK:
      return `
`;
    case a.VARIABLE_TAG:
      return typeof t.attrs?.variable == "string" ? t.attrs.variable : "";
    case a.MENTION_TAG:
      return R(t);
    case a.HEADING: {
      const r = typeof t.attrs?.level == "number" ? t.attrs.level : 1;
      return `${"#".repeat(Math.min(Math.max(r, 1), 6))} ${i(t)}

`;
    }
    case a.PARAGRAPH:
      return `${i(t)}

`;
    case a.BULLET_LIST:
      return `${(t.content ?? []).map((r) => l(r, "- ")).join("")}
`;
    case a.ORDERED_LIST: {
      const r = typeof t.attrs?.start == "number" ? t.attrs.start : 1;
      return `${(t.content ?? []).map((e, n) => l(e, `${r + n}. `)).join("")}
`;
    }
    case a.IMAGE: {
      const r = typeof t.attrs?.alt == "string" ? t.attrs.alt : "", e = typeof t.attrs?.src == "string" ? t.attrs.src : "";
      return e === "" ? c(r) : `![${c(r)}](${p(e)})

`;
    }
    case a.BUTTON: {
      const r = i(t), e = t.attrs?.href;
      return `${typeof e == "string" ? `[${r}](${p(e)})` : r}

`;
    }
    case a.HTML:
      return typeof t.attrs?.html == "string" ? t.attrs.html : "";
    case a.DIVIDER:
      return `---

`;
    default:
      return i(t);
  }
}, v = (t) => {
  const r = typeof t == "string" ? A(t) : t;
  return r === void 0 ? typeof t == "string" ? t : "" : T(r).trim();
};
export {
  v as tipTapDocumentToMarkdown
};

//# sourceMappingURL=tiptap-document-to-markdown.js.map