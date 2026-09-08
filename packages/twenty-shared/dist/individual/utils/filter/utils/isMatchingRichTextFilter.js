import a from "lodash.escaperegexp";
var o = ({ richTextFilter: e, value: r }) => {
  if (!0 === (e.markdown !== void 0)) {
    const t = a(e.markdown.ilike).replace(/%/g, ".*");
    return new RegExp(`^${t}$`, "i").test(r);
  } else
    throw new Error(`Unexpected value for RICH_TEXT filter : ${JSON.stringify(e)}`);
};
export {
  o as isMatchingRichTextFilter
};

//# sourceMappingURL=isMatchingRichTextFilter.js.map