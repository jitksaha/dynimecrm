//#region \0rolldown/runtime.js
var e = Object.defineProperty, t = (t, n) => {
	let r = {};
	for (var i in t) e(r, i, {
		get: t[i],
		enumerable: !0
	});
	return n || e(r, Symbol.toStringTag, { value: "Module" }), r;
}, n = class {
	constructor(e) {
		throw Error("CoreApiClient was not generated. Install this app on a Twenty instance or run `yarn twenty dev`.");
	}
}, r = /* @__PURE__ */ t({});
//#endregion
export { n as CoreApiClient, r as CoreSchema };
