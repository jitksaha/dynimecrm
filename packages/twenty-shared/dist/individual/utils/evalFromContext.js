import e from "handlebars";
var i = (t, n) => {
  try {
    e.registerHelper("json", (r) => JSON.stringify(r));
    const o = t.replace("{{", "{{{ json ").replace("}}", " }}}"), p = e.compile(o)(n, { helpers: { json: (r) => JSON.stringify(r) } });
    return JSON.parse(p);
  } catch {
    return;
  }
};
export {
  i as evalFromContext
};

//# sourceMappingURL=evalFromContext.js.map