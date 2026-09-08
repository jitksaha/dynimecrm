//#region src/vite/createWywProfilingPlugin.ts
var e = /@linaria/, t = "import { styled } from '@linaria/react';\nconst StyledDiv = styled.div`color: red;`;\n", n = (n, r) => {
	let i = r?.devSlowThresholdMs ?? 200, a = r?.topSlowFilesCount ?? 10, o = r?.warmupThresholdMs ?? 500, s = 0, c = 0, l = 0, u = !1, d = `${process.cwd()}/src/__wyw_warmup__.tsx`, f = [], p = n.transform;
	return {
		...n,
		enforce: "pre",
		configResolved(e) {
			u = e.command === "serve", d = `${e.root}/src/__wyw_warmup__.tsx`, typeof n.configResolved == "function" && n.configResolved.call(this, e);
		},
		async buildStart() {
			console.log("[linaria/wyw] Starting CSS pre-build");
			let e = performance.now();
			try {
				let e = p.call(this, t, d);
				typeof e == "object" && e && "then" in e && await e;
			} catch {}
			let n = performance.now() - e, r = n > o ? " ⚠️  slow" : "";
			console.log(`[linaria/wyw] Pre-warm: ${n.toFixed(0)}ms${r}`);
		},
		transform(t, n, ...r) {
			if (!e.test(t)) return l++, null;
			let a = performance.now(), o = p.call(this, t, n, ...r), d = (e) => {
				s += e, c++, f.push({
					id: n,
					ms: e
				}), u && e > i && console.log(`[linaria/wyw] slow: ${n.replace(process.cwd(), "")} ${e.toFixed(0)}ms`);
			};
			return o && typeof o == "object" && "then" in o ? o.then((e) => (d(performance.now() - a), e)) : (d(performance.now() - a), o);
		},
		closeBundle: () => {
			let e = c > 0 ? s / c : 0, t = Math.round(10 * e), n = f.filter((e) => e.ms > t);
			console.log("\n[linaria/wyw] ===== CSS PRE-BUILD SUMMARY ====="), console.log(`[linaria/wyw] Files transformed: ${c}`), console.log(`[linaria/wyw] Files skipped (no @linaria): ${l}`), console.log(`[linaria/wyw] Transform time: ${s.toFixed(0)}ms`), console.log(`[linaria/wyw] Avg per transformed file: ${e.toFixed(1)}ms`), n.length > 0 && (console.log(`[linaria/wyw] Slow files (>10x avg = ${t}ms):`), n.sort((e, t) => t.ms - e.ms).slice(0, a).forEach((e) => console.log(`[linaria/wyw]   ${e.ms.toFixed(0)}ms ${e.id.replace(process.cwd(), "")}`))), console.log("[linaria/wyw] ==========================================\n");
		}
	};
};
//#endregion
export { n as createWywProfilingPlugin };
