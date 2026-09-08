import { isDefined as o } from "./validation/isDefined.js";
import { evalFromContext as l } from "./evalFromContext.js";
var p = /\{"type":"variableTag","attrs":\{"variable":"(\{\{[^{}]+\}\})"\}\}|\{"attrs":\{"variable":"(\{\{[^{}]+\}\})"\},"type":"variableTag"\}/g, s = (e) => JSON.stringify(e).slice(1, -1), v = (e) => {
  const t = e.split(`
`);
  return t.length === 1 ? `{"type":"text","text":"${s(e)}"}` : t.map((n, i) => {
    const r = `{"type":"text","text":"${s(n)}"}`;
    return i < t.length - 1 ? `${r},{"type":"hardBreak"}` : r;
  }).join(",");
}, u = (e, t) => {
  if (o(e))
    return e.replace(p, (n, i, r) => {
      const a = l(i ?? r, t);
      return v(o(a) ? typeof a == "object" ? JSON.stringify(a) : String(a) : "");
    });
};
export {
  u as resolveRichTextVariables
};

//# sourceMappingURL=rich-text-variable-resolver.js.map