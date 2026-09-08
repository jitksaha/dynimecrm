//#region src/testing/EachTestingContextFilter.ts
var e = (e) => {
	let t = e.filter((e) => e.only === !0);
	return process.env.CI && t.length > 0 ? (console.warn("Should never push tests cases with an only to true, only to use in dev env\n returning the whole test suite anyway"), e) : t.length > 0 ? t : e;
};
//#endregion
export { e as eachTestingContextFilter };
