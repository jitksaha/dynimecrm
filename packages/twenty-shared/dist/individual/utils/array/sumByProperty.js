import { isNumberOrNaN as i } from "@sniptt/guards";
var N = (e) => (r, f) => (typeof r != "number" && (r = 0), i(f[e]) && (r += f[e]), r);
export {
  N as sumByProperty
};

//# sourceMappingURL=sumByProperty.js.map