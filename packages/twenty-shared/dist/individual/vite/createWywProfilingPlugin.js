var v = /@linaria/, S = "import { styled } from '@linaria/react';\nconst StyledDiv = styled.div`color: red;`;\n", _ = (t, i) => {
  const h = i?.devSlowThresholdMs ?? 200, y = i?.topSlowFilesCount ?? 10, g = i?.warmupThresholdMs ?? 500;
  let c = 0, a = 0, w = 0, m = !1, f = `${process.cwd()}/src/__wyw_warmup__.tsx`;
  const d = [], p = t.transform;
  return {
    ...t,
    enforce: "pre",
    configResolved(r) {
      m = r.command === "serve", f = `${r.root}/src/__wyw_warmup__.tsx`, typeof t.configResolved == "function" && t.configResolved.call(this, r);
    },
    async buildStart() {
      console.log("[linaria/wyw] Starting CSS pre-build");
      const r = performance.now();
      try {
        const o = p.call(this, S, f);
        o !== null && typeof o == "object" && "then" in o && await o;
      } catch {
      }
      const e = performance.now() - r, l = e > g ? " ⚠️  slow" : "";
      console.log(`[linaria/wyw] Pre-warm: ${e.toFixed(0)}ms${l}`);
    },
    transform(r, e, ...l) {
      if (!v.test(r))
        return w++, null;
      const o = performance.now(), s = p.call(this, r, e, ...l), u = (n) => {
        c += n, a++, d.push({
          id: e,
          ms: n
        }), m && n > h && console.log(`[linaria/wyw] slow: ${e.replace(process.cwd(), "")} ${n.toFixed(0)}ms`);
      };
      return s && typeof s == "object" && "then" in s ? s.then((n) => (u(performance.now() - o), n)) : (u(performance.now() - o), s);
    },
    closeBundle: () => {
      const r = a > 0 ? c / a : 0, e = Math.round(10 * r), l = d.filter((o) => o.ms > e);
      console.log(`
[linaria/wyw] ===== CSS PRE-BUILD SUMMARY =====`), console.log(`[linaria/wyw] Files transformed: ${a}`), console.log(`[linaria/wyw] Files skipped (no @linaria): ${w}`), console.log(`[linaria/wyw] Transform time: ${c.toFixed(0)}ms`), console.log(`[linaria/wyw] Avg per transformed file: ${r.toFixed(1)}ms`), l.length > 0 && (console.log(`[linaria/wyw] Slow files (>10x avg = ${e}ms):`), l.sort((o, s) => s.ms - o.ms).slice(0, y).forEach((o) => console.log(`[linaria/wyw]   ${o.ms.toFixed(0)}ms ${o.id.replace(process.cwd(), "")}`))), console.log(`[linaria/wyw] ==========================================
`);
    }
  };
};
export {
  _ as createWywProfilingPlugin
};

//# sourceMappingURL=createWywProfilingPlugin.js.map