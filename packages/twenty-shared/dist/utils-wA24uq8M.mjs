import { t as e } from "./isDefined-Dtu5EYqP.mjs";
import { t } from "./format-record-reference.util-Bj0YDbrL.mjs";
import { Ct as n, Lt as r, Mt as i, S as a, Y as o, c as s, i as c, l, w as u } from "./types-BVPyJxl2.mjs";
import { $ as d, E as ee, I as te, M as f, N as ne, T as re, Y as ie, Z as ae, d as oe, s as se } from "./constants-kicYhN_j.mjs";
import "./SourceLocale-CfovCqKy.mjs";
import { t as ce } from "./capitalize-BIrP8_oc.mjs";
import { t as le } from "./AppLocales-CxfCC4eU.mjs";
import { isArray as ue, isNonEmptyArray as de, isNonEmptyString as p, isNumber as fe, isNumberOrNaN as pe, isObject as m, isString as me, isUndefined as he } from "@sniptt/guards";
import { v4 as ge } from "uuid";
import h, { z as g } from "zod";
import { Parser as _e } from "expr-eval-fork";
import { Temporal as _ } from "temporal-polyfill";
import ve from "addressparser";
import ye from "handlebars";
import be from "lodash.camelcase";
import xe from "lodash.escaperegexp";
import Se from "qs";
import { generatePath as Ce } from "react-router-dom";
import { slugify as we } from "transliteration";
import { getCountries as Te, getCountryCallingCode as Ee } from "libphonenumber-js";
//#region src/utils/validation/assertIsDefinedOrThrow.ts
function De(t, n = /* @__PURE__ */ Error("Value not defined")) {
	if (!e(t)) throw n;
}
//#endregion
//#region src/utils/validation/isValidLocale.ts
var Oe = (e) => e !== null && e in le, ke = (e) => se.test(e), Ae = [
	r.TEXT,
	r.FULL_NAME,
	r.EMAILS,
	r.ADDRESS,
	r.LINKS,
	r.PHONES,
	r.RICH_TEXT,
	r.UUID
], je = (e) => Ae.includes(e), Me = (e) => /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(e), Ne = Object.keys(le).reduce((e, t) => {
	let n = t.split("-")[0].toLowerCase();
	return (!e[n] || t === "en") && (e[n] = t), e;
}, {}), Pe = (e) => {
	if (e === null) return "en";
	if (e in le) return e;
	let t = Object.keys(le).find((t) => t.toLowerCase() === e.toLowerCase());
	if (t) return t;
	let n = e?.trim() ? e.split("-")[0].toLowerCase() : "";
	return Ne[n] ? Ne[n] : "en";
}, Fe = Symbol("micropatch-delete"), Ie = [
	"__proto__",
	"constructor",
	"prototype"
], Le = (t, n) => {
	if (!e(t)) throw Error("Cannot apply diff to null or undefined object");
	if (!Array.isArray(n)) throw Error("Diffs must be an array");
	let r = Ge(t), i = [];
	for (let e of n) if (!(!e || !e.path || e.path.length === 0)) try {
		Re(r, e, i);
	} catch (t) {
		throw Error(`Failed to apply diff at path ${e.path.join(".")}: ${t}`);
	}
	return i.forEach((e) => e()), r;
}, Re = (e, t, n) => {
	let { path: r, type: i } = t, a = "value" in t ? t.value : void 0, o = r[r.length - 1], s = ze(e, r);
	switch (i) {
		case "CREATE":
		case "CHANGE":
			Be(s, o, a);
			break;
		case "REMOVE":
			Ve(e, r, s, o, n);
			break;
		default: throw Error(`Unsupported diff type: ${i}`);
	}
}, ze = (e, t) => {
	let n = e;
	for (let e = 0; e < t.length - 1; e++) {
		let r = t[e];
		if (n == null) throw Error(`Cannot traverse path: found null/undefined at element ${e}`);
		if (fe(r) && !Array.isArray(n)) throw Error(`Expected array at path element ${e}, got ${typeof n}`);
		if (me(r) && Array.isArray(n)) throw Error(`Expected object at path element ${e}, got array`);
		n = n[r];
	}
	return n;
}, Be = (e, t, n) => {
	if (Array.isArray(e)) {
		if (!fe(t)) throw Error(`Expected numeric index for array, got ${typeof t}`);
		try {
			e[t] = n;
		} catch (e) {
			throw Error(`Cannot set array element at index ${t}: ${e}. Array may be non-extensible.`);
		}
	} else if (m(e)) {
		if (Ie.includes(t)) throw Error(`Refusing to set forbidden property key '${t}' on object (prototype pollution protection)`);
		try {
			e[t] = n;
		} catch (e) {
			throw Error(`Cannot set property '${String(t)}': ${e}. Object may be non-extensible.`);
		}
	} else throw Error(`Expected object or array, got ${typeof e}`);
}, Ve = (e, t, n, r, i) => {
	Array.isArray(n) ? He(e, t, n, r, i) : Ue(n, r);
}, He = (e, t, n, r, i) => {
	if (typeof r != "number") throw Error(`Expected numeric index for array removal, got ${typeof r}`);
	n[r] = Fe, i.push(() => {
		t.length === 1 ? Array.isArray(e) && We(e) : We(n);
	});
}, Ue = (e, t) => {
	Ie.includes(t) || delete e[t];
}, We = (e) => {
	let t = [];
	for (let n = 0; n < e.length; n++) e[n] === Fe && t.push(n);
	for (let n = t.length - 1; n >= 0; n--) e.splice(t[n], 1);
}, Ge = (e) => {
	if (e === null || !m(e)) return e;
	if (typeof structuredClone < "u") try {
		return structuredClone(e);
	} catch {
		return Ke(e);
	}
	return Ke(e);
}, Ke = (e) => {
	try {
		return JSON.parse(JSON.stringify(e));
	} catch {
		throw Error("Failed to clone object");
	}
}, qe = (e, t, n) => e.length !== t.length || e.some((e) => !t.some((t) => t[n] === e[n])) || t.some((t) => !e.some((e) => e[n] === t[n])), Je = (e, t, n) => n.findIndex((t) => t.id === e.id) === t, Ye = (e, t) => (n) => n[e] !== t, Xe = (e) => (t) => t.id === e, Ze = (e, t) => (n) => n[e] === t, Qe = (e, t, n = /* @__PURE__ */ Error("Element not found")) => {
	let r = e.find(t);
	return De(r, n), r;
}, $e = (e, t = 0) => Array.from({ length: e }, (e, n) => t + n), et = (e) => !!(Array.isArray(e) && fe(e.length) && e.length > 0), tt = (e) => e.id, nt = (e) => (t) => t[e], rt = (e) => (t, n) => (typeof t != "number" && (t = 0), pe(n[e]) && (t += n[e]), t), it = (e, t) => {
	let n = e.findIndex(Xe(t.id));
	if (n > -1) {
		let r = [...e];
		return r.splice(n, 1, t), r;
	} else return e.concat(t);
}, at = (e, t) => {
	let n = e.findIndex(Xe(t.id));
	if (n > -1) {
		let r = [...e], i = {
			...e[n],
			...t
		};
		return r.splice(n, 1, i), r;
	} else return e.concat({ ...t });
}, v = (e, t) => {
	throw Error(t ?? "Didn't expect to get here.");
}, ot = (e) => e.toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, ""), st = (e) => {
	if (!m(e) || ue(e)) return !1;
	let t = e.status;
	return t === "PENDING" || t === "FAILED";
}, y = (e) => m(e) && !ue(e) ? e : void 0, ct = (e) => {
	let t = e?.relative;
	return fe(t) && Number.isFinite(t) ? t : void 0;
}, lt = (e) => {
	let t = me(e) ? e.trim() : "";
	return t === "" ? void 0 : t;
}, ut = (e) => {
	let t = lt(e.text);
	if (!he(t)) return {
		text: t,
		startSeconds: ct(y(e.start_timestamp)),
		endSeconds: ct(y(e.end_timestamp))
	};
}, dt = (e) => lt(e?.name), ft = (t) => {
	if (!ue(t.words)) return;
	let n = t.words.map(y).filter(e).map(ut).filter(e);
	if (n.length !== 0) return {
		speakerName: dt(y(t.participant)),
		startSeconds: n[0].startSeconds,
		endSeconds: n[n.length - 1].endSeconds,
		text: n.map((e) => e.text).join(" "),
		words: n
	};
}, pt = (t) => {
	if (ue(t)) return t.map(y).filter(e).map(ft).filter(e);
}, mt = new Set([
	"__proto__",
	"constructor",
	"prototype"
]), ht = (t, n) => {
	if (!me(n)) return;
	let r = n.split("."), i = t;
	for (let t of r) {
		if (!e(i) || !m(i) || mt.has(t) || !Object.prototype.hasOwnProperty.call(i, t)) return;
		i = i[t];
	}
	return i;
}, b = (e, t) => (n, r) => de(n) ? n[e]((e) => t(ht(e, r))) : !1, x = (e, t) => (n, r, i) => de(n) ? n[e]((e) => t(ht(e, r), i)) : !1, S = new _e();
S.functions.isDefined = (t) => e(t), S.functions.isNonEmptyString = (e) => p(e), S.functions.includes = (e, t) => Array.isArray(e) && e.includes(t), S.functions.arrayLength = (e) => Array.isArray(e) ? e.length : 0, S.functions.every = b("every", Boolean), S.functions.everyDefined = b("every", e), S.functions.some = b("some", Boolean), S.functions.someDefined = b("some", e), S.functions.someNonEmptyString = b("some", p), S.functions.none = b("every", (e) => !e), S.functions.noneDefined = b("every", (t) => !e(t)), S.functions.everyEquals = x("every", (e, t) => e === t), S.functions.someEquals = x("some", (e, t) => e === t), S.functions.noneEquals = x("every", (e, t) => e !== t), S.functions.includesEvery = x("every", (e, t) => Array.isArray(e) && e.includes(t)), S.functions.includesSome = x("some", (e, t) => Array.isArray(e) && e.includes(t)), S.functions.includesNone = x("every", (e, t) => Array.isArray(e) && !e.includes(t));
//#endregion
//#region src/utils/command-menu-items/evaluateConditionalAvailabilityExpression.ts
var gt = (e, t) => {
	if (!p(e)) return !0;
	try {
		return S.parse(e).evaluate(t) === !0;
	} catch {
		return !1;
	}
}, _t = ({ objectMetadataItem: e, numberOfSelectedRecords: t }) => t === 1 ? e.labelSingular : e.labelPlural, C = (e, t) => {
	if (e === t) return !0;
	if (e && t && typeof e == "object" && typeof t == "object") {
		if (e.constructor !== t.constructor) return !1;
		if (Array.isArray(e)) {
			let n = e, r = t;
			if (n.length !== r.length) return !1;
			for (let e = n.length; e-- !== 0;) if (!C(n[e], r[e])) return !1;
			return !0;
		}
		if (e instanceof Map && t instanceof Map) {
			if (e.size !== t.size) return !1;
			for (let [n] of e.entries()) if (!t.has(n)) return !1;
			for (let [n, r] of e.entries()) if (!C(r, t.get(n))) return !1;
			return !0;
		}
		if (e instanceof Set && t instanceof Set) {
			if (e.size !== t.size) return !1;
			for (let n of e) if (!t.has(n)) return !1;
			return !0;
		}
		if (ArrayBuffer.isView(e) && ArrayBuffer.isView(t)) {
			let n = e, r = t;
			if (n.length !== r.length) return !1;
			for (let e = n.length; e-- !== 0;) if (n[e] !== r[e]) return !1;
			return !0;
		}
		if (e.constructor === RegExp) {
			let n = e, r = t;
			return n.source === r.source && n.flags === r.flags;
		}
		if (e.valueOf !== Object.prototype.valueOf) return e.valueOf() === t.valueOf();
		if (e.toString !== Object.prototype.toString) return e.toString() === t.toString();
		let n = Object.keys(e), r = Object.keys(t);
		if (n.length !== r.length) return !1;
		for (let e = n.length; e-- !== 0;) if (!(n[e] in t)) return !1;
		for (let r = n.length; r-- !== 0;) {
			let i = n[r];
			if (!C(e[i], t[i])) return !1;
		}
		return !0;
	}
	return e !== e && t !== t;
}, vt = (e, t) => t.reduce((t, n) => ({
	...t,
	[n]: e[n]
}), {}), yt = ({ existingObjects: t, receivedObjects: n, propertiesToCompare: r, isEntityIncluded: i }) => {
	let a = [], o = [], s = [], c = new Map(t.map((e) => [e.id, e])), l = new Map(n.map((e) => [e.id, e]));
	for (let t of n) {
		let n = c.get(t.id);
		e(n) ? i(n) ? C(vt(n, r), vt(t, r)) || o.push(t) : s.push(t) : a.push(t);
	}
	return {
		toCreate: a,
		toUpdate: o,
		toRestoreAndUpdate: s,
		idsToRemove: t.filter((e) => i(e)).filter((e) => !l.has(e.id)).map((e) => e.id)
	};
}, bt = [
	"yyyy.MM.dd",
	"yyyy/MM/dd",
	"MM-dd-yyyy",
	"MM/dd/yyyy",
	"MM.dd.yyyy",
	"MMMM d, yyyy",
	"MMM d, yyyy",
	"d MMMM yyyy",
	"d MMM yyyy",
	"dd-MMM-yyyy",
	"yyyy-MMM-dd"
], xt = [
	"yyyy-MM-dd",
	"yyyyMMdd",
	...bt,
	"yyyy-MM-dd'T'HH:mm:ss.SSSX",
	"yyyy-MM-dd'T'HH:mm:ssX",
	"yyyy-MM-dd'T'HH:mm:ss.SSS",
	"yyyy-MM-dd'T'HH:mm:ss",
	"yyyy-MM-dd HH:mm:ss",
	"yyyy-MM-dd HH:mm:ss.SSS"
], St = [
	"yyyy-MM-dd'T'HH:mm:ss.SSSX",
	"yyyy-MM-dd'T'HH:mm:ssX",
	"yyyy-MM-dd'T'HH:mm:ss.SSSxxx",
	"yyyy-MM-dd'T'HH:mm:ssxxx",
	"yyyy-MM-dd'T'HH:mm:ss.SSS",
	"yyyy-MM-dd'T'HH:mm:ss",
	"yyyy-MM-dd HH:mm:ss.SSS",
	"yyyy-MM-dd HH:mm:ss",
	"yyyy-MM-dd HH:mm",
	"yyyy-MM-dd",
	"yyyyMMdd",
	...bt
], Ct = (e) => {
	if (!(!p(e) || e === "system")) try {
		return new Intl.DateTimeFormat("en-US", { timeZone: e }), e;
	} catch {
		return;
	}
}, wt = (e) => /^\d{4}-\d{2}-\d{2}$/.test(e), Tt = (e, t) => _.PlainDate.compare(e, t) === 1, Et = (e, t) => _.PlainDate.compare(e, t) === -1, Dt = (e, t) => _.PlainDate.compare(e, t) <= 0, Ot = (e, t) => e.month === t.month && e.year === t.year, kt = (e) => e.dayOfWeek > 5, At = (e, t) => _.PlainDate.compare(e, t) === 0, jt = 365.2425, Mt = 6048e5, Nt = 6e4, Pt = 36e5, Ft = 1e3, It = 3600 * 24;
It * 7, It * jt / 12 * 3;
var Lt = Symbol.for("constructDateFrom");
//#endregion
//#region ../../node_modules/date-fns/constructFrom.js
function w(e, t) {
	return typeof e == "function" ? e(t) : e && typeof e == "object" && Lt in e ? e[Lt](t) : e instanceof Date ? new e.constructor(t) : new Date(t);
}
//#endregion
//#region ../../node_modules/date-fns/toDate.js
function T(e, t) {
	return w(t || e, e);
}
//#endregion
//#region ../../node_modules/date-fns/addDays.js
function Rt(e, t, n) {
	let r = T(e, n?.in);
	return isNaN(t) ? w(n?.in || e, NaN) : (t && r.setDate(r.getDate() + t), r);
}
//#endregion
//#region ../../node_modules/date-fns/addMonths.js
function zt(e, t, n) {
	let r = T(e, n?.in);
	if (isNaN(t)) return w(n?.in || e, NaN);
	if (!t) return r;
	let i = r.getDate(), a = w(n?.in || e, r.getTime());
	return a.setMonth(r.getMonth() + t + 1, 0), i >= a.getDate() ? a : (r.setFullYear(a.getFullYear(), a.getMonth(), i), r);
}
//#endregion
//#region ../../node_modules/date-fns/addMilliseconds.js
function Bt(e, t, n) {
	return w(n?.in || e, +T(e) + t);
}
//#endregion
//#region ../../node_modules/date-fns/addHours.js
function Vt(e, t, n) {
	return Bt(e, t * Pt, n);
}
//#endregion
//#region ../../node_modules/date-fns/_lib/defaultOptions.js
var Ht = {};
function Ut() {
	return Ht;
}
//#endregion
//#region ../../node_modules/date-fns/startOfWeek.js
function E(e, t) {
	let n = Ut(), r = t?.weekStartsOn ?? t?.locale?.options?.weekStartsOn ?? n.weekStartsOn ?? n.locale?.options?.weekStartsOn ?? 0, i = T(e, t?.in), a = i.getDay(), o = (a < r ? 7 : 0) + a - r;
	return i.setDate(i.getDate() - o), i.setHours(0, 0, 0, 0), i;
}
//#endregion
//#region ../../node_modules/date-fns/startOfISOWeek.js
function D(e, t) {
	return E(e, {
		...t,
		weekStartsOn: 1
	});
}
//#endregion
//#region ../../node_modules/date-fns/getISOWeekYear.js
function Wt(e, t) {
	let n = T(e, t?.in), r = n.getFullYear(), i = w(n, 0);
	i.setFullYear(r + 1, 0, 4), i.setHours(0, 0, 0, 0);
	let a = D(i), o = w(n, 0);
	o.setFullYear(r, 0, 4), o.setHours(0, 0, 0, 0);
	let s = D(o);
	return n.getTime() >= a.getTime() ? r + 1 : n.getTime() >= s.getTime() ? r : r - 1;
}
//#endregion
//#region ../../node_modules/date-fns/_lib/getTimezoneOffsetInMilliseconds.js
function Gt(e) {
	let t = T(e), n = new Date(Date.UTC(t.getFullYear(), t.getMonth(), t.getDate(), t.getHours(), t.getMinutes(), t.getSeconds(), t.getMilliseconds()));
	return n.setUTCFullYear(t.getFullYear()), e - +n;
}
//#endregion
//#region ../../node_modules/date-fns/startOfISOWeekYear.js
function Kt(e, t) {
	let n = Wt(e, t), r = w(t?.in || e, 0);
	return r.setFullYear(n, 0, 4), r.setHours(0, 0, 0, 0), D(r);
}
//#endregion
//#region ../../node_modules/date-fns/addMinutes.js
function qt(e, t, n) {
	let r = T(e, n?.in);
	return r.setTime(r.getTime() + t * Nt), r;
}
//#endregion
//#region ../../node_modules/date-fns/addSeconds.js
function Jt(e, t, n) {
	return Bt(e, t * 1e3, n);
}
//#endregion
//#region ../../node_modules/date-fns/addWeeks.js
function Yt(e, t, n) {
	return Rt(e, t * 7, n);
}
//#endregion
//#region ../../node_modules/date-fns/addYears.js
function Xt(e, t, n) {
	return zt(e, t * 12, n);
}
//#endregion
//#region ../../node_modules/date-fns/isDate.js
function Zt(e) {
	return e instanceof Date || typeof e == "object" && Object.prototype.toString.call(e) === "[object Date]";
}
//#endregion
//#region ../../node_modules/date-fns/isValid.js
function Qt(e) {
	return !(!Zt(e) && typeof e != "number" || isNaN(+T(e)));
}
//#endregion
//#region ../../node_modules/date-fns/locale/en-US/_lib/formatDistance.js
var $t = {
	lessThanXSeconds: {
		one: "less than a second",
		other: "less than {{count}} seconds"
	},
	xSeconds: {
		one: "1 second",
		other: "{{count}} seconds"
	},
	halfAMinute: "half a minute",
	lessThanXMinutes: {
		one: "less than a minute",
		other: "less than {{count}} minutes"
	},
	xMinutes: {
		one: "1 minute",
		other: "{{count}} minutes"
	},
	aboutXHours: {
		one: "about 1 hour",
		other: "about {{count}} hours"
	},
	xHours: {
		one: "1 hour",
		other: "{{count}} hours"
	},
	xDays: {
		one: "1 day",
		other: "{{count}} days"
	},
	aboutXWeeks: {
		one: "about 1 week",
		other: "about {{count}} weeks"
	},
	xWeeks: {
		one: "1 week",
		other: "{{count}} weeks"
	},
	aboutXMonths: {
		one: "about 1 month",
		other: "about {{count}} months"
	},
	xMonths: {
		one: "1 month",
		other: "{{count}} months"
	},
	aboutXYears: {
		one: "about 1 year",
		other: "about {{count}} years"
	},
	xYears: {
		one: "1 year",
		other: "{{count}} years"
	},
	overXYears: {
		one: "over 1 year",
		other: "over {{count}} years"
	},
	almostXYears: {
		one: "almost 1 year",
		other: "almost {{count}} years"
	}
}, en = (e, t, n) => {
	let r, i = $t[e];
	return r = typeof i == "string" ? i : t === 1 ? i.one : i.other.replace("{{count}}", t.toString()), n?.addSuffix ? n.comparison && n.comparison > 0 ? "in " + r : r + " ago" : r;
};
//#endregion
//#region ../../node_modules/date-fns/locale/_lib/buildFormatLongFn.js
function tn(e) {
	return (t = {}) => {
		let n = t.width ? String(t.width) : e.defaultWidth;
		return e.formats[n] || e.formats[e.defaultWidth];
	};
}
var nn = {
	date: tn({
		formats: {
			full: "EEEE, MMMM do, y",
			long: "MMMM do, y",
			medium: "MMM d, y",
			short: "MM/dd/yyyy"
		},
		defaultWidth: "full"
	}),
	time: tn({
		formats: {
			full: "h:mm:ss a zzzz",
			long: "h:mm:ss a z",
			medium: "h:mm:ss a",
			short: "h:mm a"
		},
		defaultWidth: "full"
	}),
	dateTime: tn({
		formats: {
			full: "{{date}} 'at' {{time}}",
			long: "{{date}} 'at' {{time}}",
			medium: "{{date}}, {{time}}",
			short: "{{date}}, {{time}}"
		},
		defaultWidth: "full"
	})
}, rn = {
	lastWeek: "'last' eeee 'at' p",
	yesterday: "'yesterday at' p",
	today: "'today at' p",
	tomorrow: "'tomorrow at' p",
	nextWeek: "eeee 'at' p",
	other: "P"
}, an = (e, t, n, r) => rn[e];
//#endregion
//#region ../../node_modules/date-fns/locale/_lib/buildLocalizeFn.js
function O(e) {
	return (t, n) => {
		let r = n?.context ? String(n.context) : "standalone", i;
		if (r === "formatting" && e.formattingValues) {
			let t = e.defaultFormattingWidth || e.defaultWidth, r = n?.width ? String(n.width) : t;
			i = e.formattingValues[r] || e.formattingValues[t];
		} else {
			let t = e.defaultWidth, r = n?.width ? String(n.width) : e.defaultWidth;
			i = e.values[r] || e.values[t];
		}
		let a = e.argumentCallback ? e.argumentCallback(t) : t;
		return i[a];
	};
}
var on = {
	ordinalNumber: (e, t) => {
		let n = Number(e), r = n % 100;
		if (r > 20 || r < 10) switch (r % 10) {
			case 1: return n + "st";
			case 2: return n + "nd";
			case 3: return n + "rd";
		}
		return n + "th";
	},
	era: O({
		values: {
			narrow: ["B", "A"],
			abbreviated: ["BC", "AD"],
			wide: ["Before Christ", "Anno Domini"]
		},
		defaultWidth: "wide"
	}),
	quarter: O({
		values: {
			narrow: [
				"1",
				"2",
				"3",
				"4"
			],
			abbreviated: [
				"Q1",
				"Q2",
				"Q3",
				"Q4"
			],
			wide: [
				"1st quarter",
				"2nd quarter",
				"3rd quarter",
				"4th quarter"
			]
		},
		defaultWidth: "wide",
		argumentCallback: (e) => e - 1
	}),
	month: O({
		values: {
			narrow: [
				"J",
				"F",
				"M",
				"A",
				"M",
				"J",
				"J",
				"A",
				"S",
				"O",
				"N",
				"D"
			],
			abbreviated: [
				"Jan",
				"Feb",
				"Mar",
				"Apr",
				"May",
				"Jun",
				"Jul",
				"Aug",
				"Sep",
				"Oct",
				"Nov",
				"Dec"
			],
			wide: [
				"January",
				"February",
				"March",
				"April",
				"May",
				"June",
				"July",
				"August",
				"September",
				"October",
				"November",
				"December"
			]
		},
		defaultWidth: "wide"
	}),
	day: O({
		values: {
			narrow: [
				"S",
				"M",
				"T",
				"W",
				"T",
				"F",
				"S"
			],
			short: [
				"Su",
				"Mo",
				"Tu",
				"We",
				"Th",
				"Fr",
				"Sa"
			],
			abbreviated: [
				"Sun",
				"Mon",
				"Tue",
				"Wed",
				"Thu",
				"Fri",
				"Sat"
			],
			wide: [
				"Sunday",
				"Monday",
				"Tuesday",
				"Wednesday",
				"Thursday",
				"Friday",
				"Saturday"
			]
		},
		defaultWidth: "wide"
	}),
	dayPeriod: O({
		values: {
			narrow: {
				am: "a",
				pm: "p",
				midnight: "mi",
				noon: "n",
				morning: "morning",
				afternoon: "afternoon",
				evening: "evening",
				night: "night"
			},
			abbreviated: {
				am: "AM",
				pm: "PM",
				midnight: "midnight",
				noon: "noon",
				morning: "morning",
				afternoon: "afternoon",
				evening: "evening",
				night: "night"
			},
			wide: {
				am: "a.m.",
				pm: "p.m.",
				midnight: "midnight",
				noon: "noon",
				morning: "morning",
				afternoon: "afternoon",
				evening: "evening",
				night: "night"
			}
		},
		defaultWidth: "wide",
		formattingValues: {
			narrow: {
				am: "a",
				pm: "p",
				midnight: "mi",
				noon: "n",
				morning: "in the morning",
				afternoon: "in the afternoon",
				evening: "in the evening",
				night: "at night"
			},
			abbreviated: {
				am: "AM",
				pm: "PM",
				midnight: "midnight",
				noon: "noon",
				morning: "in the morning",
				afternoon: "in the afternoon",
				evening: "in the evening",
				night: "at night"
			},
			wide: {
				am: "a.m.",
				pm: "p.m.",
				midnight: "midnight",
				noon: "noon",
				morning: "in the morning",
				afternoon: "in the afternoon",
				evening: "in the evening",
				night: "at night"
			}
		},
		defaultFormattingWidth: "wide"
	})
};
//#endregion
//#region ../../node_modules/date-fns/locale/_lib/buildMatchFn.js
function sn(e) {
	return (t, n = {}) => {
		let r = n.width, i = r && e.matchPatterns[r] || e.matchPatterns[e.defaultMatchWidth], a = t.match(i);
		if (!a) return null;
		let o = a[0], s = r && e.parsePatterns[r] || e.parsePatterns[e.defaultParseWidth], c = Array.isArray(s) ? ln(s, (e) => e.test(o)) : cn(s, (e) => e.test(o)), l;
		l = e.valueCallback ? e.valueCallback(c) : c, l = n.valueCallback ? n.valueCallback(l) : l;
		let u = t.slice(o.length);
		return {
			value: l,
			rest: u
		};
	};
}
function cn(e, t) {
	for (let n in e) if (Object.prototype.hasOwnProperty.call(e, n) && t(e[n])) return n;
}
function ln(e, t) {
	for (let n = 0; n < e.length; n++) if (t(e[n])) return n;
}
//#endregion
//#region ../../node_modules/date-fns/locale/_lib/buildMatchPatternFn.js
function un(e) {
	return (t, n = {}) => {
		let r = t.match(e.matchPattern);
		if (!r) return null;
		let i = r[0], a = t.match(e.parsePattern);
		if (!a) return null;
		let o = e.valueCallback ? e.valueCallback(a[0]) : a[0];
		o = n.valueCallback ? n.valueCallback(o) : o;
		let s = t.slice(i.length);
		return {
			value: o,
			rest: s
		};
	};
}
//#endregion
//#region ../../node_modules/date-fns/locale/en-US.js
var dn = {
	code: "en-US",
	formatDistance: en,
	formatLong: nn,
	formatRelative: an,
	localize: on,
	match: {
		ordinalNumber: un({
			matchPattern: /^(\d+)(th|st|nd|rd)?/i,
			parsePattern: /\d+/i,
			valueCallback: (e) => parseInt(e, 10)
		}),
		era: sn({
			matchPatterns: {
				narrow: /^(b|a)/i,
				abbreviated: /^(b\.?\s?c\.?|b\.?\s?c\.?\s?e\.?|a\.?\s?d\.?|c\.?\s?e\.?)/i,
				wide: /^(before christ|before common era|anno domini|common era)/i
			},
			defaultMatchWidth: "wide",
			parsePatterns: { any: [/^b/i, /^(a|c)/i] },
			defaultParseWidth: "any"
		}),
		quarter: sn({
			matchPatterns: {
				narrow: /^[1234]/i,
				abbreviated: /^q[1234]/i,
				wide: /^[1234](th|st|nd|rd)? quarter/i
			},
			defaultMatchWidth: "wide",
			parsePatterns: { any: [
				/1/i,
				/2/i,
				/3/i,
				/4/i
			] },
			defaultParseWidth: "any",
			valueCallback: (e) => e + 1
		}),
		month: sn({
			matchPatterns: {
				narrow: /^[jfmasond]/i,
				abbreviated: /^(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)/i,
				wide: /^(january|february|march|april|may|june|july|august|september|october|november|december)/i
			},
			defaultMatchWidth: "wide",
			parsePatterns: {
				narrow: [
					/^j/i,
					/^f/i,
					/^m/i,
					/^a/i,
					/^m/i,
					/^j/i,
					/^j/i,
					/^a/i,
					/^s/i,
					/^o/i,
					/^n/i,
					/^d/i
				],
				any: [
					/^ja/i,
					/^f/i,
					/^mar/i,
					/^ap/i,
					/^may/i,
					/^jun/i,
					/^jul/i,
					/^au/i,
					/^s/i,
					/^o/i,
					/^n/i,
					/^d/i
				]
			},
			defaultParseWidth: "any"
		}),
		day: sn({
			matchPatterns: {
				narrow: /^[smtwf]/i,
				short: /^(su|mo|tu|we|th|fr|sa)/i,
				abbreviated: /^(sun|mon|tue|wed|thu|fri|sat)/i,
				wide: /^(sunday|monday|tuesday|wednesday|thursday|friday|saturday)/i
			},
			defaultMatchWidth: "wide",
			parsePatterns: {
				narrow: [
					/^s/i,
					/^m/i,
					/^t/i,
					/^w/i,
					/^t/i,
					/^f/i,
					/^s/i
				],
				any: [
					/^su/i,
					/^m/i,
					/^tu/i,
					/^w/i,
					/^th/i,
					/^f/i,
					/^sa/i
				]
			},
			defaultParseWidth: "any"
		}),
		dayPeriod: sn({
			matchPatterns: {
				narrow: /^(a|p|mi|n|(in the|at) (morning|afternoon|evening|night))/i,
				any: /^([ap]\.?\s?m\.?|midnight|noon|(in the|at) (morning|afternoon|evening|night))/i
			},
			defaultMatchWidth: "any",
			parsePatterns: { any: {
				am: /^a/i,
				pm: /^p/i,
				midnight: /^mi/i,
				noon: /^no/i,
				morning: /morning/i,
				afternoon: /afternoon/i,
				evening: /evening/i,
				night: /night/i
			} },
			defaultParseWidth: "any"
		})
	},
	options: {
		weekStartsOn: 0,
		firstWeekContainsDate: 1
	}
};
//#endregion
//#region ../../node_modules/date-fns/getISOWeek.js
function fn(e, t) {
	let n = T(e, t?.in), r = D(n) - +Kt(n);
	return Math.round(r / Mt) + 1;
}
//#endregion
//#region ../../node_modules/date-fns/getWeekYear.js
function pn(e, t) {
	let n = T(e, t?.in), r = n.getFullYear(), i = Ut(), a = t?.firstWeekContainsDate ?? t?.locale?.options?.firstWeekContainsDate ?? i.firstWeekContainsDate ?? i.locale?.options?.firstWeekContainsDate ?? 1, o = w(t?.in || e, 0);
	o.setFullYear(r + 1, 0, a), o.setHours(0, 0, 0, 0);
	let s = E(o, t), c = w(t?.in || e, 0);
	c.setFullYear(r, 0, a), c.setHours(0, 0, 0, 0);
	let l = E(c, t);
	return +n >= +s ? r + 1 : +n >= +l ? r : r - 1;
}
//#endregion
//#region ../../node_modules/date-fns/startOfWeekYear.js
function mn(e, t) {
	let n = Ut(), r = t?.firstWeekContainsDate ?? t?.locale?.options?.firstWeekContainsDate ?? n.firstWeekContainsDate ?? n.locale?.options?.firstWeekContainsDate ?? 1, i = pn(e, t), a = w(t?.in || e, 0);
	return a.setFullYear(i, 0, r), a.setHours(0, 0, 0, 0), E(a, t);
}
//#endregion
//#region ../../node_modules/date-fns/getWeek.js
function hn(e, t) {
	let n = T(e, t?.in), r = E(n, t) - +mn(n, t);
	return Math.round(r / Mt) + 1;
}
//#endregion
//#region ../../node_modules/date-fns/_lib/format/longFormatters.js
var gn = (e, t) => {
	switch (e) {
		case "P": return t.date({ width: "short" });
		case "PP": return t.date({ width: "medium" });
		case "PPP": return t.date({ width: "long" });
		default: return t.date({ width: "full" });
	}
}, _n = (e, t) => {
	switch (e) {
		case "p": return t.time({ width: "short" });
		case "pp": return t.time({ width: "medium" });
		case "ppp": return t.time({ width: "long" });
		default: return t.time({ width: "full" });
	}
}, vn = {
	p: _n,
	P: (e, t) => {
		let n = e.match(/(P+)(p+)?/) || [], r = n[1], i = n[2];
		if (!i) return gn(e, t);
		let a;
		switch (r) {
			case "P":
				a = t.dateTime({ width: "short" });
				break;
			case "PP":
				a = t.dateTime({ width: "medium" });
				break;
			case "PPP":
				a = t.dateTime({ width: "long" });
				break;
			default:
				a = t.dateTime({ width: "full" });
				break;
		}
		return a.replace("{{date}}", gn(r, t)).replace("{{time}}", _n(i, t));
	}
}, yn = /^D+$/, bn = /^Y+$/, xn = [
	"D",
	"DD",
	"YY",
	"YYYY"
];
function Sn(e) {
	return yn.test(e);
}
function Cn(e) {
	return bn.test(e);
}
function wn(e, t, n) {
	let r = Tn(e, t, n);
	if (console.warn(r), xn.includes(e)) throw RangeError(r);
}
function Tn(e, t, n) {
	let r = e[0] === "Y" ? "years" : "days of the month";
	return `Use \`${e.toLowerCase()}\` instead of \`${e}\` (in \`${t}\`) for formatting ${r} to the input \`${n}\`; see: https://github.com/date-fns/date-fns/blob/master/docs/unicodeTokens.md`;
}
//#endregion
//#region ../../node_modules/date-fns/getDefaultOptions.js
function En() {
	return Object.assign({}, Ut());
}
//#endregion
//#region ../../node_modules/date-fns/getISODay.js
function Dn(e, t) {
	let n = T(e, t?.in).getDay();
	return n === 0 ? 7 : n;
}
//#endregion
//#region ../../node_modules/date-fns/isAfter.js
function On(e, t) {
	return +T(e) > +T(t);
}
//#endregion
//#region ../../node_modules/date-fns/isBefore.js
function kn(e, t) {
	return +T(e) < +T(t);
}
//#endregion
//#region ../../node_modules/date-fns/isEqual.js
function An(e, t) {
	return +T(e) == +T(t);
}
//#endregion
//#region ../../node_modules/date-fns/transpose.js
function jn(e, t) {
	let n = Mn(t) ? new t(0) : w(t, 0);
	return n.setFullYear(e.getFullYear(), e.getMonth(), e.getDate()), n.setHours(e.getHours(), e.getMinutes(), e.getSeconds(), e.getMilliseconds()), n;
}
function Mn(e) {
	return typeof e == "function" && e.prototype?.constructor === e;
}
//#endregion
//#region ../../node_modules/date-fns/parse/_lib/Setter.js
var Nn = 10, Pn = class {
	subPriority = 0;
	validate(e, t) {
		return !0;
	}
}, Fn = class extends Pn {
	constructor(e, t, n, r, i) {
		super(), this.value = e, this.validateValue = t, this.setValue = n, this.priority = r, i && (this.subPriority = i);
	}
	validate(e, t) {
		return this.validateValue(e, this.value, t);
	}
	set(e, t, n) {
		return this.setValue(e, t, this.value, n);
	}
}, In = class extends Pn {
	priority = Nn;
	subPriority = -1;
	constructor(e, t) {
		super(), this.context = e || ((e) => w(t, e));
	}
	set(e, t) {
		return t.timestampIsSet ? e : w(e, jn(e, this.context));
	}
}, k = class {
	run(e, t, n, r) {
		let i = this.parse(e, t, n, r);
		return i ? {
			setter: new Fn(i.value, this.validate, this.set, this.priority, this.subPriority),
			rest: i.rest
		} : null;
	}
	validate(e, t, n) {
		return !0;
	}
}, Ln = class extends k {
	priority = 140;
	parse(e, t, n) {
		switch (t) {
			case "G":
			case "GG":
			case "GGG": return n.era(e, { width: "abbreviated" }) || n.era(e, { width: "narrow" });
			case "GGGGG": return n.era(e, { width: "narrow" });
			default: return n.era(e, { width: "wide" }) || n.era(e, { width: "abbreviated" }) || n.era(e, { width: "narrow" });
		}
	}
	set(e, t, n) {
		return t.era = n, e.setFullYear(n, 0, 1), e.setHours(0, 0, 0, 0), e;
	}
	incompatibleTokens = [
		"R",
		"u",
		"t",
		"T"
	];
}, A = {
	month: /^(1[0-2]|0?\d)/,
	date: /^(3[0-1]|[0-2]?\d)/,
	dayOfYear: /^(36[0-6]|3[0-5]\d|[0-2]?\d?\d)/,
	week: /^(5[0-3]|[0-4]?\d)/,
	hour23h: /^(2[0-3]|[0-1]?\d)/,
	hour24h: /^(2[0-4]|[0-1]?\d)/,
	hour11h: /^(1[0-1]|0?\d)/,
	hour12h: /^(1[0-2]|0?\d)/,
	minute: /^[0-5]?\d/,
	second: /^[0-5]?\d/,
	singleDigit: /^\d/,
	twoDigits: /^\d{1,2}/,
	threeDigits: /^\d{1,3}/,
	fourDigits: /^\d{1,4}/,
	anyDigitsSigned: /^-?\d+/,
	singleDigitSigned: /^-?\d/,
	twoDigitsSigned: /^-?\d{1,2}/,
	threeDigitsSigned: /^-?\d{1,3}/,
	fourDigitsSigned: /^-?\d{1,4}/
}, j = {
	basicOptionalMinutes: /^([+-])(\d{2})(\d{2})?|Z/,
	basic: /^([+-])(\d{2})(\d{2})|Z/,
	basicOptionalSeconds: /^([+-])(\d{2})(\d{2})((\d{2}))?|Z/,
	extended: /^([+-])(\d{2}):(\d{2})|Z/,
	extendedOptionalSeconds: /^([+-])(\d{2}):(\d{2})(:(\d{2}))?|Z/
};
//#endregion
//#region ../../node_modules/date-fns/parse/_lib/utils.js
function M(e, t) {
	return e && {
		value: t(e.value),
		rest: e.rest
	};
}
function N(e, t) {
	let n = t.match(e);
	return n ? {
		value: parseInt(n[0], 10),
		rest: t.slice(n[0].length)
	} : null;
}
function P(e, t) {
	let n = t.match(e);
	if (!n) return null;
	if (n[0] === "Z") return {
		value: 0,
		rest: t.slice(1)
	};
	let r = n[1] === "+" ? 1 : -1, i = n[2] ? parseInt(n[2], 10) : 0, a = n[3] ? parseInt(n[3], 10) : 0, o = n[5] ? parseInt(n[5], 10) : 0;
	return {
		value: r * (i * Pt + a * Nt + o * Ft),
		rest: t.slice(n[0].length)
	};
}
function Rn(e) {
	return N(A.anyDigitsSigned, e);
}
function F(e, t) {
	switch (e) {
		case 1: return N(A.singleDigit, t);
		case 2: return N(A.twoDigits, t);
		case 3: return N(A.threeDigits, t);
		case 4: return N(A.fourDigits, t);
		default: return N(RegExp("^\\d{1," + e + "}"), t);
	}
}
function zn(e, t) {
	switch (e) {
		case 1: return N(A.singleDigitSigned, t);
		case 2: return N(A.twoDigitsSigned, t);
		case 3: return N(A.threeDigitsSigned, t);
		case 4: return N(A.fourDigitsSigned, t);
		default: return N(RegExp("^-?\\d{1," + e + "}"), t);
	}
}
function Bn(e) {
	switch (e) {
		case "morning": return 4;
		case "evening": return 17;
		case "pm":
		case "noon":
		case "afternoon": return 12;
		default: return 0;
	}
}
function Vn(e, t) {
	let n = t > 0, r = n ? t : 1 - t, i;
	if (r <= 50) i = e || 100;
	else {
		let t = r + 50, n = Math.trunc(t / 100) * 100, a = e >= t % 100;
		i = e + n - (a ? 100 : 0);
	}
	return n ? i : 1 - i;
}
function Hn(e) {
	return e % 400 == 0 || e % 4 == 0 && e % 100 != 0;
}
//#endregion
//#region ../../node_modules/date-fns/parse/_lib/parsers/YearParser.js
var Un = class extends k {
	priority = 130;
	incompatibleTokens = [
		"Y",
		"R",
		"u",
		"w",
		"I",
		"i",
		"e",
		"c",
		"t",
		"T"
	];
	parse(e, t, n) {
		let r = (e) => ({
			year: e,
			isTwoDigitYear: t === "yy"
		});
		switch (t) {
			case "y": return M(F(4, e), r);
			case "yo": return M(n.ordinalNumber(e, { unit: "year" }), r);
			default: return M(F(t.length, e), r);
		}
	}
	validate(e, t) {
		return t.isTwoDigitYear || t.year > 0;
	}
	set(e, t, n) {
		let r = e.getFullYear();
		if (n.isTwoDigitYear) {
			let t = Vn(n.year, r);
			return e.setFullYear(t, 0, 1), e.setHours(0, 0, 0, 0), e;
		}
		let i = !("era" in t) || t.era === 1 ? n.year : 1 - n.year;
		return e.setFullYear(i, 0, 1), e.setHours(0, 0, 0, 0), e;
	}
}, Wn = class extends k {
	priority = 130;
	parse(e, t, n) {
		let r = (e) => ({
			year: e,
			isTwoDigitYear: t === "YY"
		});
		switch (t) {
			case "Y": return M(F(4, e), r);
			case "Yo": return M(n.ordinalNumber(e, { unit: "year" }), r);
			default: return M(F(t.length, e), r);
		}
	}
	validate(e, t) {
		return t.isTwoDigitYear || t.year > 0;
	}
	set(e, t, n, r) {
		let i = pn(e, r);
		if (n.isTwoDigitYear) {
			let t = Vn(n.year, i);
			return e.setFullYear(t, 0, r.firstWeekContainsDate), e.setHours(0, 0, 0, 0), E(e, r);
		}
		let a = !("era" in t) || t.era === 1 ? n.year : 1 - n.year;
		return e.setFullYear(a, 0, r.firstWeekContainsDate), e.setHours(0, 0, 0, 0), E(e, r);
	}
	incompatibleTokens = [
		"y",
		"R",
		"u",
		"Q",
		"q",
		"M",
		"L",
		"I",
		"d",
		"D",
		"i",
		"t",
		"T"
	];
}, Gn = class extends k {
	priority = 130;
	parse(e, t) {
		return zn(t === "R" ? 4 : t.length, e);
	}
	set(e, t, n) {
		let r = w(e, 0);
		return r.setFullYear(n, 0, 4), r.setHours(0, 0, 0, 0), D(r);
	}
	incompatibleTokens = [
		"G",
		"y",
		"Y",
		"u",
		"Q",
		"q",
		"M",
		"L",
		"w",
		"d",
		"D",
		"e",
		"c",
		"t",
		"T"
	];
}, Kn = class extends k {
	priority = 130;
	parse(e, t) {
		return zn(t === "u" ? 4 : t.length, e);
	}
	set(e, t, n) {
		return e.setFullYear(n, 0, 1), e.setHours(0, 0, 0, 0), e;
	}
	incompatibleTokens = [
		"G",
		"y",
		"Y",
		"R",
		"w",
		"I",
		"i",
		"e",
		"c",
		"t",
		"T"
	];
}, qn = class extends k {
	priority = 120;
	parse(e, t, n) {
		switch (t) {
			case "Q":
			case "QQ": return F(t.length, e);
			case "Qo": return n.ordinalNumber(e, { unit: "quarter" });
			case "QQQ": return n.quarter(e, {
				width: "abbreviated",
				context: "formatting"
			}) || n.quarter(e, {
				width: "narrow",
				context: "formatting"
			});
			case "QQQQQ": return n.quarter(e, {
				width: "narrow",
				context: "formatting"
			});
			default: return n.quarter(e, {
				width: "wide",
				context: "formatting"
			}) || n.quarter(e, {
				width: "abbreviated",
				context: "formatting"
			}) || n.quarter(e, {
				width: "narrow",
				context: "formatting"
			});
		}
	}
	validate(e, t) {
		return t >= 1 && t <= 4;
	}
	set(e, t, n) {
		return e.setMonth((n - 1) * 3, 1), e.setHours(0, 0, 0, 0), e;
	}
	incompatibleTokens = [
		"Y",
		"R",
		"q",
		"M",
		"L",
		"w",
		"I",
		"d",
		"D",
		"i",
		"e",
		"c",
		"t",
		"T"
	];
}, Jn = class extends k {
	priority = 120;
	parse(e, t, n) {
		switch (t) {
			case "q":
			case "qq": return F(t.length, e);
			case "qo": return n.ordinalNumber(e, { unit: "quarter" });
			case "qqq": return n.quarter(e, {
				width: "abbreviated",
				context: "standalone"
			}) || n.quarter(e, {
				width: "narrow",
				context: "standalone"
			});
			case "qqqqq": return n.quarter(e, {
				width: "narrow",
				context: "standalone"
			});
			default: return n.quarter(e, {
				width: "wide",
				context: "standalone"
			}) || n.quarter(e, {
				width: "abbreviated",
				context: "standalone"
			}) || n.quarter(e, {
				width: "narrow",
				context: "standalone"
			});
		}
	}
	validate(e, t) {
		return t >= 1 && t <= 4;
	}
	set(e, t, n) {
		return e.setMonth((n - 1) * 3, 1), e.setHours(0, 0, 0, 0), e;
	}
	incompatibleTokens = [
		"Y",
		"R",
		"Q",
		"M",
		"L",
		"w",
		"I",
		"d",
		"D",
		"i",
		"e",
		"c",
		"t",
		"T"
	];
}, Yn = class extends k {
	incompatibleTokens = [
		"Y",
		"R",
		"q",
		"Q",
		"L",
		"w",
		"I",
		"D",
		"i",
		"e",
		"c",
		"t",
		"T"
	];
	priority = 110;
	parse(e, t, n) {
		let r = (e) => e - 1;
		switch (t) {
			case "M": return M(N(A.month, e), r);
			case "MM": return M(F(2, e), r);
			case "Mo": return M(n.ordinalNumber(e, { unit: "month" }), r);
			case "MMM": return n.month(e, {
				width: "abbreviated",
				context: "formatting"
			}) || n.month(e, {
				width: "narrow",
				context: "formatting"
			});
			case "MMMMM": return n.month(e, {
				width: "narrow",
				context: "formatting"
			});
			default: return n.month(e, {
				width: "wide",
				context: "formatting"
			}) || n.month(e, {
				width: "abbreviated",
				context: "formatting"
			}) || n.month(e, {
				width: "narrow",
				context: "formatting"
			});
		}
	}
	validate(e, t) {
		return t >= 0 && t <= 11;
	}
	set(e, t, n) {
		return e.setMonth(n, 1), e.setHours(0, 0, 0, 0), e;
	}
}, Xn = class extends k {
	priority = 110;
	parse(e, t, n) {
		let r = (e) => e - 1;
		switch (t) {
			case "L": return M(N(A.month, e), r);
			case "LL": return M(F(2, e), r);
			case "Lo": return M(n.ordinalNumber(e, { unit: "month" }), r);
			case "LLL": return n.month(e, {
				width: "abbreviated",
				context: "standalone"
			}) || n.month(e, {
				width: "narrow",
				context: "standalone"
			});
			case "LLLLL": return n.month(e, {
				width: "narrow",
				context: "standalone"
			});
			default: return n.month(e, {
				width: "wide",
				context: "standalone"
			}) || n.month(e, {
				width: "abbreviated",
				context: "standalone"
			}) || n.month(e, {
				width: "narrow",
				context: "standalone"
			});
		}
	}
	validate(e, t) {
		return t >= 0 && t <= 11;
	}
	set(e, t, n) {
		return e.setMonth(n, 1), e.setHours(0, 0, 0, 0), e;
	}
	incompatibleTokens = [
		"Y",
		"R",
		"q",
		"Q",
		"M",
		"w",
		"I",
		"D",
		"i",
		"e",
		"c",
		"t",
		"T"
	];
};
//#endregion
//#region ../../node_modules/date-fns/setWeek.js
function Zn(e, t, n) {
	let r = T(e, n?.in), i = hn(r, n) - t;
	return r.setDate(r.getDate() - i * 7), T(r, n?.in);
}
//#endregion
//#region ../../node_modules/date-fns/parse/_lib/parsers/LocalWeekParser.js
var Qn = class extends k {
	priority = 100;
	parse(e, t, n) {
		switch (t) {
			case "w": return N(A.week, e);
			case "wo": return n.ordinalNumber(e, { unit: "week" });
			default: return F(t.length, e);
		}
	}
	validate(e, t) {
		return t >= 1 && t <= 53;
	}
	set(e, t, n, r) {
		return E(Zn(e, n, r), r);
	}
	incompatibleTokens = [
		"y",
		"R",
		"u",
		"q",
		"Q",
		"M",
		"L",
		"I",
		"d",
		"D",
		"i",
		"t",
		"T"
	];
};
//#endregion
//#region ../../node_modules/date-fns/setISOWeek.js
function $n(e, t, n) {
	let r = T(e, n?.in), i = fn(r, n) - t;
	return r.setDate(r.getDate() - i * 7), r;
}
//#endregion
//#region ../../node_modules/date-fns/parse/_lib/parsers/ISOWeekParser.js
var er = class extends k {
	priority = 100;
	parse(e, t, n) {
		switch (t) {
			case "I": return N(A.week, e);
			case "Io": return n.ordinalNumber(e, { unit: "week" });
			default: return F(t.length, e);
		}
	}
	validate(e, t) {
		return t >= 1 && t <= 53;
	}
	set(e, t, n) {
		return D($n(e, n));
	}
	incompatibleTokens = [
		"y",
		"Y",
		"u",
		"q",
		"Q",
		"M",
		"L",
		"w",
		"d",
		"D",
		"e",
		"c",
		"t",
		"T"
	];
}, tr = [
	31,
	28,
	31,
	30,
	31,
	30,
	31,
	31,
	30,
	31,
	30,
	31
], nr = [
	31,
	29,
	31,
	30,
	31,
	30,
	31,
	31,
	30,
	31,
	30,
	31
], rr = class extends k {
	priority = 90;
	subPriority = 1;
	parse(e, t, n) {
		switch (t) {
			case "d": return N(A.date, e);
			case "do": return n.ordinalNumber(e, { unit: "date" });
			default: return F(t.length, e);
		}
	}
	validate(e, t) {
		let n = Hn(e.getFullYear()), r = e.getMonth();
		return n ? t >= 1 && t <= nr[r] : t >= 1 && t <= tr[r];
	}
	set(e, t, n) {
		return e.setDate(n), e.setHours(0, 0, 0, 0), e;
	}
	incompatibleTokens = [
		"Y",
		"R",
		"q",
		"Q",
		"w",
		"I",
		"D",
		"i",
		"e",
		"c",
		"t",
		"T"
	];
}, ir = class extends k {
	priority = 90;
	subpriority = 1;
	parse(e, t, n) {
		switch (t) {
			case "D":
			case "DD": return N(A.dayOfYear, e);
			case "Do": return n.ordinalNumber(e, { unit: "date" });
			default: return F(t.length, e);
		}
	}
	validate(e, t) {
		return Hn(e.getFullYear()) ? t >= 1 && t <= 366 : t >= 1 && t <= 365;
	}
	set(e, t, n) {
		return e.setMonth(0, n), e.setHours(0, 0, 0, 0), e;
	}
	incompatibleTokens = [
		"Y",
		"R",
		"q",
		"Q",
		"M",
		"L",
		"w",
		"I",
		"d",
		"E",
		"i",
		"e",
		"c",
		"t",
		"T"
	];
};
//#endregion
//#region ../../node_modules/date-fns/setDay.js
function ar(e, t, n) {
	let r = Ut(), i = n?.weekStartsOn ?? n?.locale?.options?.weekStartsOn ?? r.weekStartsOn ?? r.locale?.options?.weekStartsOn ?? 0, a = T(e, n?.in), o = a.getDay(), s = (t % 7 + 7) % 7, c = 7 - i;
	return Rt(a, t < 0 || t > 6 ? t - (o + c) % 7 : (s + c) % 7 - (o + c) % 7, n);
}
//#endregion
//#region ../../node_modules/date-fns/parse/_lib/parsers/DayParser.js
var or = class extends k {
	priority = 90;
	parse(e, t, n) {
		switch (t) {
			case "E":
			case "EE":
			case "EEE": return n.day(e, {
				width: "abbreviated",
				context: "formatting"
			}) || n.day(e, {
				width: "short",
				context: "formatting"
			}) || n.day(e, {
				width: "narrow",
				context: "formatting"
			});
			case "EEEEE": return n.day(e, {
				width: "narrow",
				context: "formatting"
			});
			case "EEEEEE": return n.day(e, {
				width: "short",
				context: "formatting"
			}) || n.day(e, {
				width: "narrow",
				context: "formatting"
			});
			default: return n.day(e, {
				width: "wide",
				context: "formatting"
			}) || n.day(e, {
				width: "abbreviated",
				context: "formatting"
			}) || n.day(e, {
				width: "short",
				context: "formatting"
			}) || n.day(e, {
				width: "narrow",
				context: "formatting"
			});
		}
	}
	validate(e, t) {
		return t >= 0 && t <= 6;
	}
	set(e, t, n, r) {
		return e = ar(e, n, r), e.setHours(0, 0, 0, 0), e;
	}
	incompatibleTokens = [
		"D",
		"i",
		"e",
		"c",
		"t",
		"T"
	];
}, sr = class extends k {
	priority = 90;
	parse(e, t, n, r) {
		let i = (e) => {
			let t = Math.floor((e - 1) / 7) * 7;
			return (e + r.weekStartsOn + 6) % 7 + t;
		};
		switch (t) {
			case "e":
			case "ee": return M(F(t.length, e), i);
			case "eo": return M(n.ordinalNumber(e, { unit: "day" }), i);
			case "eee": return n.day(e, {
				width: "abbreviated",
				context: "formatting"
			}) || n.day(e, {
				width: "short",
				context: "formatting"
			}) || n.day(e, {
				width: "narrow",
				context: "formatting"
			});
			case "eeeee": return n.day(e, {
				width: "narrow",
				context: "formatting"
			});
			case "eeeeee": return n.day(e, {
				width: "short",
				context: "formatting"
			}) || n.day(e, {
				width: "narrow",
				context: "formatting"
			});
			default: return n.day(e, {
				width: "wide",
				context: "formatting"
			}) || n.day(e, {
				width: "abbreviated",
				context: "formatting"
			}) || n.day(e, {
				width: "short",
				context: "formatting"
			}) || n.day(e, {
				width: "narrow",
				context: "formatting"
			});
		}
	}
	validate(e, t) {
		return t >= 0 && t <= 6;
	}
	set(e, t, n, r) {
		return e = ar(e, n, r), e.setHours(0, 0, 0, 0), e;
	}
	incompatibleTokens = [
		"y",
		"R",
		"u",
		"q",
		"Q",
		"M",
		"L",
		"I",
		"d",
		"D",
		"E",
		"i",
		"c",
		"t",
		"T"
	];
}, cr = class extends k {
	priority = 90;
	parse(e, t, n, r) {
		let i = (e) => {
			let t = Math.floor((e - 1) / 7) * 7;
			return (e + r.weekStartsOn + 6) % 7 + t;
		};
		switch (t) {
			case "c":
			case "cc": return M(F(t.length, e), i);
			case "co": return M(n.ordinalNumber(e, { unit: "day" }), i);
			case "ccc": return n.day(e, {
				width: "abbreviated",
				context: "standalone"
			}) || n.day(e, {
				width: "short",
				context: "standalone"
			}) || n.day(e, {
				width: "narrow",
				context: "standalone"
			});
			case "ccccc": return n.day(e, {
				width: "narrow",
				context: "standalone"
			});
			case "cccccc": return n.day(e, {
				width: "short",
				context: "standalone"
			}) || n.day(e, {
				width: "narrow",
				context: "standalone"
			});
			default: return n.day(e, {
				width: "wide",
				context: "standalone"
			}) || n.day(e, {
				width: "abbreviated",
				context: "standalone"
			}) || n.day(e, {
				width: "short",
				context: "standalone"
			}) || n.day(e, {
				width: "narrow",
				context: "standalone"
			});
		}
	}
	validate(e, t) {
		return t >= 0 && t <= 6;
	}
	set(e, t, n, r) {
		return e = ar(e, n, r), e.setHours(0, 0, 0, 0), e;
	}
	incompatibleTokens = [
		"y",
		"R",
		"u",
		"q",
		"Q",
		"M",
		"L",
		"I",
		"d",
		"D",
		"E",
		"i",
		"e",
		"t",
		"T"
	];
};
//#endregion
//#region ../../node_modules/date-fns/setISODay.js
function lr(e, t, n) {
	let r = T(e, n?.in);
	return Rt(r, t - Dn(r, n), n);
}
//#endregion
//#region ../../node_modules/date-fns/parse/_lib/parsers/ISODayParser.js
var ur = class extends k {
	priority = 90;
	parse(e, t, n) {
		let r = (e) => e === 0 ? 7 : e;
		switch (t) {
			case "i":
			case "ii": return F(t.length, e);
			case "io": return n.ordinalNumber(e, { unit: "day" });
			case "iii": return M(n.day(e, {
				width: "abbreviated",
				context: "formatting"
			}) || n.day(e, {
				width: "short",
				context: "formatting"
			}) || n.day(e, {
				width: "narrow",
				context: "formatting"
			}), r);
			case "iiiii": return M(n.day(e, {
				width: "narrow",
				context: "formatting"
			}), r);
			case "iiiiii": return M(n.day(e, {
				width: "short",
				context: "formatting"
			}) || n.day(e, {
				width: "narrow",
				context: "formatting"
			}), r);
			default: return M(n.day(e, {
				width: "wide",
				context: "formatting"
			}) || n.day(e, {
				width: "abbreviated",
				context: "formatting"
			}) || n.day(e, {
				width: "short",
				context: "formatting"
			}) || n.day(e, {
				width: "narrow",
				context: "formatting"
			}), r);
		}
	}
	validate(e, t) {
		return t >= 1 && t <= 7;
	}
	set(e, t, n) {
		return e = lr(e, n), e.setHours(0, 0, 0, 0), e;
	}
	incompatibleTokens = [
		"y",
		"Y",
		"u",
		"q",
		"Q",
		"M",
		"L",
		"w",
		"d",
		"D",
		"E",
		"e",
		"c",
		"t",
		"T"
	];
}, dr = class extends k {
	priority = 80;
	parse(e, t, n) {
		switch (t) {
			case "a":
			case "aa":
			case "aaa": return n.dayPeriod(e, {
				width: "abbreviated",
				context: "formatting"
			}) || n.dayPeriod(e, {
				width: "narrow",
				context: "formatting"
			});
			case "aaaaa": return n.dayPeriod(e, {
				width: "narrow",
				context: "formatting"
			});
			default: return n.dayPeriod(e, {
				width: "wide",
				context: "formatting"
			}) || n.dayPeriod(e, {
				width: "abbreviated",
				context: "formatting"
			}) || n.dayPeriod(e, {
				width: "narrow",
				context: "formatting"
			});
		}
	}
	set(e, t, n) {
		return e.setHours(Bn(n), 0, 0, 0), e;
	}
	incompatibleTokens = [
		"b",
		"B",
		"H",
		"k",
		"t",
		"T"
	];
}, fr = class extends k {
	priority = 80;
	parse(e, t, n) {
		switch (t) {
			case "b":
			case "bb":
			case "bbb": return n.dayPeriod(e, {
				width: "abbreviated",
				context: "formatting"
			}) || n.dayPeriod(e, {
				width: "narrow",
				context: "formatting"
			});
			case "bbbbb": return n.dayPeriod(e, {
				width: "narrow",
				context: "formatting"
			});
			default: return n.dayPeriod(e, {
				width: "wide",
				context: "formatting"
			}) || n.dayPeriod(e, {
				width: "abbreviated",
				context: "formatting"
			}) || n.dayPeriod(e, {
				width: "narrow",
				context: "formatting"
			});
		}
	}
	set(e, t, n) {
		return e.setHours(Bn(n), 0, 0, 0), e;
	}
	incompatibleTokens = [
		"a",
		"B",
		"H",
		"k",
		"t",
		"T"
	];
}, pr = class extends k {
	priority = 80;
	parse(e, t, n) {
		switch (t) {
			case "B":
			case "BB":
			case "BBB": return n.dayPeriod(e, {
				width: "abbreviated",
				context: "formatting"
			}) || n.dayPeriod(e, {
				width: "narrow",
				context: "formatting"
			});
			case "BBBBB": return n.dayPeriod(e, {
				width: "narrow",
				context: "formatting"
			});
			default: return n.dayPeriod(e, {
				width: "wide",
				context: "formatting"
			}) || n.dayPeriod(e, {
				width: "abbreviated",
				context: "formatting"
			}) || n.dayPeriod(e, {
				width: "narrow",
				context: "formatting"
			});
		}
	}
	set(e, t, n) {
		return e.setHours(Bn(n), 0, 0, 0), e;
	}
	incompatibleTokens = [
		"a",
		"b",
		"t",
		"T"
	];
}, mr = class extends k {
	priority = 70;
	parse(e, t, n) {
		switch (t) {
			case "h": return N(A.hour12h, e);
			case "ho": return n.ordinalNumber(e, { unit: "hour" });
			default: return F(t.length, e);
		}
	}
	validate(e, t) {
		return t >= 1 && t <= 12;
	}
	set(e, t, n) {
		let r = e.getHours() >= 12;
		return r && n < 12 ? e.setHours(n + 12, 0, 0, 0) : !r && n === 12 ? e.setHours(0, 0, 0, 0) : e.setHours(n, 0, 0, 0), e;
	}
	incompatibleTokens = [
		"H",
		"K",
		"k",
		"t",
		"T"
	];
}, hr = class extends k {
	priority = 70;
	parse(e, t, n) {
		switch (t) {
			case "H": return N(A.hour23h, e);
			case "Ho": return n.ordinalNumber(e, { unit: "hour" });
			default: return F(t.length, e);
		}
	}
	validate(e, t) {
		return t >= 0 && t <= 23;
	}
	set(e, t, n) {
		return e.setHours(n, 0, 0, 0), e;
	}
	incompatibleTokens = [
		"a",
		"b",
		"h",
		"K",
		"k",
		"t",
		"T"
	];
}, gr = class extends k {
	priority = 70;
	parse(e, t, n) {
		switch (t) {
			case "K": return N(A.hour11h, e);
			case "Ko": return n.ordinalNumber(e, { unit: "hour" });
			default: return F(t.length, e);
		}
	}
	validate(e, t) {
		return t >= 0 && t <= 11;
	}
	set(e, t, n) {
		return e.getHours() >= 12 && n < 12 ? e.setHours(n + 12, 0, 0, 0) : e.setHours(n, 0, 0, 0), e;
	}
	incompatibleTokens = [
		"h",
		"H",
		"k",
		"t",
		"T"
	];
}, _r = class extends k {
	priority = 70;
	parse(e, t, n) {
		switch (t) {
			case "k": return N(A.hour24h, e);
			case "ko": return n.ordinalNumber(e, { unit: "hour" });
			default: return F(t.length, e);
		}
	}
	validate(e, t) {
		return t >= 1 && t <= 24;
	}
	set(e, t, n) {
		let r = n <= 24 ? n % 24 : n;
		return e.setHours(r, 0, 0, 0), e;
	}
	incompatibleTokens = [
		"a",
		"b",
		"h",
		"H",
		"K",
		"t",
		"T"
	];
}, vr = class extends k {
	priority = 60;
	parse(e, t, n) {
		switch (t) {
			case "m": return N(A.minute, e);
			case "mo": return n.ordinalNumber(e, { unit: "minute" });
			default: return F(t.length, e);
		}
	}
	validate(e, t) {
		return t >= 0 && t <= 59;
	}
	set(e, t, n) {
		return e.setMinutes(n, 0, 0), e;
	}
	incompatibleTokens = ["t", "T"];
}, yr = class extends k {
	priority = 50;
	parse(e, t, n) {
		switch (t) {
			case "s": return N(A.second, e);
			case "so": return n.ordinalNumber(e, { unit: "second" });
			default: return F(t.length, e);
		}
	}
	validate(e, t) {
		return t >= 0 && t <= 59;
	}
	set(e, t, n) {
		return e.setSeconds(n, 0), e;
	}
	incompatibleTokens = ["t", "T"];
}, br = class extends k {
	priority = 30;
	parse(e, t) {
		return M(F(t.length, e), (e) => Math.trunc(e * 10 ** (-t.length + 3)));
	}
	set(e, t, n) {
		return e.setMilliseconds(n), e;
	}
	incompatibleTokens = ["t", "T"];
}, xr = class extends k {
	priority = 10;
	parse(e, t) {
		switch (t) {
			case "X": return P(j.basicOptionalMinutes, e);
			case "XX": return P(j.basic, e);
			case "XXXX": return P(j.basicOptionalSeconds, e);
			case "XXXXX": return P(j.extendedOptionalSeconds, e);
			default: return P(j.extended, e);
		}
	}
	set(e, t, n) {
		return t.timestampIsSet ? e : w(e, e.getTime() - Gt(e) - n);
	}
	incompatibleTokens = [
		"t",
		"T",
		"x"
	];
}, Sr = class extends k {
	priority = 10;
	parse(e, t) {
		switch (t) {
			case "x": return P(j.basicOptionalMinutes, e);
			case "xx": return P(j.basic, e);
			case "xxxx": return P(j.basicOptionalSeconds, e);
			case "xxxxx": return P(j.extendedOptionalSeconds, e);
			default: return P(j.extended, e);
		}
	}
	set(e, t, n) {
		return t.timestampIsSet ? e : w(e, e.getTime() - Gt(e) - n);
	}
	incompatibleTokens = [
		"t",
		"T",
		"X"
	];
}, Cr = class extends k {
	priority = 40;
	parse(e) {
		return Rn(e);
	}
	set(e, t, n) {
		return [w(e, n * 1e3), { timestampIsSet: !0 }];
	}
	incompatibleTokens = "*";
}, wr = class extends k {
	priority = 20;
	parse(e) {
		return Rn(e);
	}
	set(e, t, n) {
		return [w(e, n), { timestampIsSet: !0 }];
	}
	incompatibleTokens = "*";
}, Tr = {
	G: new Ln(),
	y: new Un(),
	Y: new Wn(),
	R: new Gn(),
	u: new Kn(),
	Q: new qn(),
	q: new Jn(),
	M: new Yn(),
	L: new Xn(),
	w: new Qn(),
	I: new er(),
	d: new rr(),
	D: new ir(),
	E: new or(),
	e: new sr(),
	c: new cr(),
	i: new ur(),
	a: new dr(),
	b: new fr(),
	B: new pr(),
	h: new mr(),
	H: new hr(),
	K: new gr(),
	k: new _r(),
	m: new vr(),
	s: new yr(),
	S: new br(),
	X: new xr(),
	x: new Sr(),
	t: new Cr(),
	T: new wr()
}, Er = /[yYQqMLwIdDecihHKkms]o|(\w)\1*|''|'(''|[^'])+('|$)|./g, Dr = /P+p+|P+|p+|''|'(''|[^'])+('|$)|./g, Or = /^'([^]*?)'?$/, kr = /''/g, Ar = /\S/, jr = /[a-zA-Z]/;
function Mr(e, t, n, r) {
	let i = () => w(r?.in || n, NaN), a = En(), o = r?.locale ?? a.locale ?? dn, s = r?.firstWeekContainsDate ?? r?.locale?.options?.firstWeekContainsDate ?? a.firstWeekContainsDate ?? a.locale?.options?.firstWeekContainsDate ?? 1, c = r?.weekStartsOn ?? r?.locale?.options?.weekStartsOn ?? a.weekStartsOn ?? a.locale?.options?.weekStartsOn ?? 0;
	if (!t) return e ? i() : T(n, r?.in);
	let l = {
		firstWeekContainsDate: s,
		weekStartsOn: c,
		locale: o
	}, u = [new In(r?.in, n)], d = t.match(Dr).map((e) => {
		let t = e[0];
		if (t in vn) {
			let n = vn[t];
			return n(e, o.formatLong);
		}
		return e;
	}).join("").match(Er), ee = [];
	for (let n of d) {
		!r?.useAdditionalWeekYearTokens && Cn(n) && wn(n, t, e), !r?.useAdditionalDayOfYearTokens && Sn(n) && wn(n, t, e);
		let a = n[0], s = Tr[a];
		if (s) {
			let { incompatibleTokens: t } = s;
			if (Array.isArray(t)) {
				let e = ee.find((e) => t.includes(e.token) || e.token === a);
				if (e) throw RangeError(`The format string mustn't contain \`${e.fullToken}\` and \`${n}\` at the same time`);
			} else if (s.incompatibleTokens === "*" && ee.length > 0) throw RangeError(`The format string mustn't contain \`${n}\` and any other token at the same time`);
			ee.push({
				token: a,
				fullToken: n
			});
			let r = s.run(e, n, o.match, l);
			if (!r) return i();
			u.push(r.setter), e = r.rest;
		} else {
			if (a.match(jr)) throw RangeError("Format string contains an unescaped latin alphabet character `" + a + "`");
			if (n === "''" ? n = "'" : a === "'" && (n = Nr(n)), e.indexOf(n) === 0) e = e.slice(n.length);
			else return i();
		}
	}
	if (e.length > 0 && Ar.test(e)) return i();
	let te = u.map((e) => e.priority).sort((e, t) => t - e).filter((e, t, n) => n.indexOf(e) === t).map((e) => u.filter((t) => t.priority === e).sort((e, t) => t.subPriority - e.subPriority)).map((e) => e[0]), f = T(n, r?.in);
	if (isNaN(+f)) return i();
	let ne = {};
	for (let e of te) {
		if (!e.validate(f, l)) return i();
		let t = e.set(f, ne, l);
		Array.isArray(t) ? (f = t[0], Object.assign(ne, t[1])) : f = t;
	}
	return f;
}
function Nr(e) {
	return e.match(Or)[1].replace(kr, "'");
}
//#endregion
//#region ../../node_modules/date-fns/subDays.js
function Pr(e, t, n) {
	return Rt(e, -t, n);
}
//#endregion
//#region ../../node_modules/date-fns/parseISO.js
function I(e, t) {
	let n = () => w(t?.in, NaN), r = t?.additionalDigits ?? 2, i = zr(e), a;
	if (i.date) {
		let e = Br(i.date, r);
		a = Vr(e.restDateString, e.year);
	}
	if (!a || isNaN(+a)) return n();
	let o = +a, s = 0, c;
	if (i.time && (s = Ur(i.time), isNaN(s))) return n();
	if (i.timezone) {
		if (c = Gr(i.timezone), isNaN(c)) return n();
	} else {
		let e = new Date(o + s), n = T(0, t?.in);
		return n.setFullYear(e.getUTCFullYear(), e.getUTCMonth(), e.getUTCDate()), n.setHours(e.getUTCHours(), e.getUTCMinutes(), e.getUTCSeconds(), e.getUTCMilliseconds()), n;
	}
	return T(o + s + c, t?.in);
}
var Fr = {
	dateTimeDelimiter: /[T ]/,
	timeZoneDelimiter: /[Z ]/i,
	timezone: /([Z+-].*)$/
}, Ir = /^-?(?:(\d{3})|(\d{2})(?:-?(\d{2}))?|W(\d{2})(?:-?(\d{1}))?|)$/, Lr = /^(\d{2}(?:[.,]\d*)?)(?::?(\d{2}(?:[.,]\d*)?))?(?::?(\d{2}(?:[.,]\d*)?))?$/, Rr = /^([+-])(\d{2})(?::?(\d{2}))?$/;
function zr(e) {
	let t = {}, n = e.split(Fr.dateTimeDelimiter), r;
	if (n.length > 2) return t;
	if (/:/.test(n[0]) ? r = n[0] : (t.date = n[0], r = n[1], Fr.timeZoneDelimiter.test(t.date) && (t.date = e.split(Fr.timeZoneDelimiter)[0], r = e.substr(t.date.length, e.length))), r) {
		let e = Fr.timezone.exec(r);
		e ? (t.time = r.replace(e[1], ""), t.timezone = e[1]) : t.time = r;
	}
	return t;
}
function Br(e, t) {
	let n = RegExp("^(?:(\\d{4}|[+-]\\d{" + (4 + t) + "})|(\\d{2}|[+-]\\d{" + (2 + t) + "})$)"), r = e.match(n);
	if (!r) return {
		year: NaN,
		restDateString: ""
	};
	let i = r[1] ? parseInt(r[1]) : null, a = r[2] ? parseInt(r[2]) : null;
	return {
		year: a === null ? i : a * 100,
		restDateString: e.slice((r[1] || r[2]).length)
	};
}
function Vr(e, t) {
	if (t === null) return /* @__PURE__ */ new Date(NaN);
	let n = e.match(Ir);
	if (!n) return /* @__PURE__ */ new Date(NaN);
	let r = !!n[4], i = Hr(n[1]), a = Hr(n[2]) - 1, o = Hr(n[3]), s = Hr(n[4]), c = Hr(n[5]) - 1;
	if (r) return Zr(t, s, c) ? Kr(t, s, c) : /* @__PURE__ */ new Date(NaN);
	{
		let e = /* @__PURE__ */ new Date(0);
		return !Yr(t, a, o) || !Xr(t, i) ? /* @__PURE__ */ new Date(NaN) : (e.setUTCFullYear(t, a, Math.max(i, o)), e);
	}
}
function Hr(e) {
	return e ? parseInt(e) : 1;
}
function Ur(e) {
	let t = e.match(Lr);
	if (!t) return NaN;
	let n = Wr(t[1]), r = Wr(t[2]), i = Wr(t[3]);
	return Qr(n, r, i) ? n * Pt + r * Nt + i * 1e3 : NaN;
}
function Wr(e) {
	return e && parseFloat(e.replace(",", ".")) || 0;
}
function Gr(e) {
	if (e === "Z") return 0;
	let t = e.match(Rr);
	if (!t) return 0;
	let n = t[1] === "+" ? -1 : 1, r = parseInt(t[2]), i = t[3] && parseInt(t[3]) || 0;
	return $r(r, i) ? n * (r * Pt + i * Nt) : NaN;
}
function Kr(e, t, n) {
	let r = /* @__PURE__ */ new Date(0);
	r.setUTCFullYear(e, 0, 4);
	let i = r.getUTCDay() || 7, a = (t - 1) * 7 + n + 1 - i;
	return r.setUTCDate(r.getUTCDate() + a), r;
}
var qr = [
	31,
	null,
	31,
	30,
	31,
	30,
	31,
	31,
	30,
	31,
	30,
	31
];
function Jr(e) {
	return e % 400 == 0 || e % 4 == 0 && e % 100 != 0;
}
function Yr(e, t, n) {
	return t >= 0 && t <= 11 && n >= 1 && n <= (qr[t] || (Jr(e) ? 29 : 28));
}
function Xr(e, t) {
	return t >= 1 && t <= (Jr(e) ? 366 : 365);
}
function Zr(e, t, n) {
	return t >= 1 && t <= 53 && n >= 0 && n <= 6;
}
function Qr(e, t, n) {
	return e === 24 ? t === 0 && n === 0 : n >= 0 && n < 60 && t >= 0 && t < 60 && e >= 0 && e < 25;
}
function $r(e, t) {
	return t >= 0 && t <= 59;
}
//#endregion
//#region ../../node_modules/date-fns/subMonths.js
function ei(e, t, n) {
	return zt(e, -t, n);
}
//#endregion
//#region ../../node_modules/date-fns/subHours.js
function ti(e, t, n) {
	return Vt(e, -t, n);
}
//#endregion
//#region ../../node_modules/date-fns/subMinutes.js
function ni(e, t, n) {
	return qt(e, -t, n);
}
//#endregion
//#region ../../node_modules/date-fns/subSeconds.js
function ri(e, t, n) {
	return Jt(e, -t, n);
}
//#endregion
//#region ../../node_modules/date-fns/subWeeks.js
function ii(e, t, n) {
	return Yt(e, -t, n);
}
//#endregion
//#region ../../node_modules/date-fns/subYears.js
function ai(e, t, n) {
	return Xt(e, -t, n);
}
//#endregion
//#region src/utils/date/turnJSDateToPlainDate.ts
var oi = (e) => _.PlainDate.from({
	day: e.getDate(),
	month: e.getMonth() + 1,
	year: e.getFullYear()
}), si = (e) => {
	try {
		return _.Instant.from(e);
	} catch {
		try {
			return _.PlainDateTime.from(e).toZonedDateTime("UTC").toInstant();
		} catch {
			return null;
		}
	}
}, ci = (t) => {
	let n = si(t);
	if (e(n)) return n;
	for (let e of bt) {
		let n = Mr(t, e, /* @__PURE__ */ new Date());
		if (Qt(n)) return oi(n).toZonedDateTime("UTC").toInstant();
	}
	throw Error(`Cannot parse date-time string as Instant: "${t}"`);
}, li = (e) => {
	try {
		return _.Instant.from(e).toZonedDateTimeISO("UTC").toPlainDate();
	} catch {}
	try {
		return _.PlainDate.from(e);
	} catch {}
	throw Error(`Cannot parse date string as PlainDate : "${e}"`);
}, ui = (e) => (t, n) => {
	let r = _.PlainDate.compare(t, n);
	return r === 0 ? 0 : e === "asc" ? r : -r;
}, di = (e, t) => e.toZonedDateTime(t).toInstant().toString(), fi = (e) => {
	let t = Intl.DateTimeFormat().resolvedOptions().timeZone, n = e.toZonedDateTime(t).toInstant().toString();
	return new Date(n);
}, pi = (e, t) => {
	if (!e) return t;
	if (!t) return e;
	let n = { ...e };
	return Object.keys(t).forEach((r) => {
		let i = e[r], a = t[r];
		if (a !== void 0) {
			if (a === null) {
				n[r] = null;
				return;
			}
			if (Array.isArray(i) && Array.isArray(a)) {
				n[r] = [...i, ...a];
				return;
			}
			if (a instanceof Date || a instanceof RegExp || i instanceof Date || i instanceof RegExp) {
				n[r] = a;
				return;
			}
			if (i && a && typeof i == "object" && typeof a == "object" && !Array.isArray(i) && !Array.isArray(a)) {
				n[r] = pi(i, a);
				return;
			}
			n[r] = a;
		}
	}), n;
}, mi = /[()<>[\]:;@\\,."]/, hi = ({ address: e, name: t }) => p(t) ? `${mi.test(t) ? `"${t.replace(/[\\"]/g, "\\$&")}"` : t} <${e}>` : e, gi = (e) => [e.handle, ...e.handleAliases ?? []].filter(p), _i = (e) => e.flatMap((e) => e.group ? _i(e.group) : [e]), vi = (e) => {
	try {
		return _i(ve(e)).map((e) => ({
			address: e.address ?? "",
			name: (e.name ?? "").trim()
		})).filter((e) => e.address.length > 0 || e.name.length > 0);
	} catch {
		return [];
	}
}, L = class extends Error {
	constructor(e, t) {
		super(e), this.code = t;
	}
}, yi = (e, t) => {
	try {
		ye.registerHelper("json", (e) => JSON.stringify(e));
		let n = e.replace("{{", "{{{ json ").replace("}}", " }}}"), r = ye.compile(n)(t, { helpers: { json: (e) => JSON.stringify(e) } });
		return JSON.parse(r);
	} catch {
		return;
	}
}, bi = /\s+/g, xi = (e) => e.trim().replace(bi, " "), Si = (e, t, n = 10) => {
	let r = (e, t) => {
		if (e !== void 0) {
			if (e === null) return null;
			if (t >= n) return e;
			if (Array.isArray(e)) return e.map((e) => r(e, t));
			if (typeof e == "object") {
				let n = e;
				return Object.keys(n).reduce((e, i) => ({
					...e,
					[i]: r(n[i], t + 1)
				}), {});
			}
			return typeof e == "string" ? xi(e) : e;
		}
	};
	return t.reduce((t, n) => {
		let i = r(e[n], 0);
		return i === void 0 ? t : {
			...t,
			[n]: i
		};
	}, {});
}, Ci = "(Copy)", wi = "(copy)", Ti = (e) => !p(e) || e.toLowerCase().endsWith(wi) ? e : `${e} ${Ci}`, Ei = (e) => e.replace(/-([a-z])/g, (e, t) => t.toUpperCase()), R = (e) => ce(be(e)), Di = (e) => e.replace(/([a-z0-9])([A-Z])/g, "$1-$2").replace(/([A-Z])([A-Z][a-z])/g, "$1-$2").toLowerCase(), Oi = ({ fieldName: e, relationType: t, targetObjectMetadataNameSingular: n, targetObjectMetadataNamePlural: r }) => {
	if (t === "MANY_TO_ONE") return `${e}${ce(n)}`;
	if (t === "ONE_TO_MANY") return `${e}${ce(r)}`;
	throw new L(`Invalid relation type (${t}) for field ${e} on ${n}`, "INVALID_RELATION_TYPE_FOR_COMPUTE_MORPH_RELATION_GQL_FIELD_NAME");
}, ki = ({ name: e }) => `${e}Id`, Ai = ({ fieldName: e, relationType: t, targetObjectMetadataNameSingular: n, targetObjectMetadataNamePlural: r }) => ki({ name: Oi({
	fieldName: e,
	relationType: t,
	targetObjectMetadataNameSingular: n,
	targetObjectMetadataNamePlural: r
}) }), ji = (e) => e === r.MULTI_SELECT || e === r.ARRAY, Mi = (e) => e === r.DATE || e === r.DATE_TIME, Ni = ({ fieldName: e, fieldType: t, isLabelIdentifierField: n }) => !(e === "deletedAt" || t === r.TS_VECTOR || t === r.POSITION || e === "id" && !n || n), Pi = (e) => e === r.SELECT || e === r.MULTI_SELECT || e === r.RATING, Fi = [
	r.NUMBER,
	r.NUMERIC,
	r.CURRENCY,
	r.RATING,
	r.POSITION
], Ii = (e) => Fi.includes(e), Li = (e) => e === r.SELECT || e === r.MULTI_SELECT, Ri = ({ fieldName: e, isSystem: t, excludeId: n = !0, additionalExcludedFieldNames: r = [] }) => {
	let i = [...te, ...r];
	return n && i.push("id"), i.includes(e) || t;
}, zi = new Set(["createdAt", "updatedAt"]), Bi = new Set([r.RELATION, r.MORPH_RELATION]), Vi = ({ type: e, name: t, isSystem: n, relationType: r }) => !(zi.has(t) && Mi(e)) && Ri({
	fieldName: t,
	isSystem: n
}) || Bi.has(e) && r === a.ONE_TO_MANY ? !1 : !ne.has(e), Hi = [r.TEXT, r.RICH_TEXT], Ui = (e) => Hi.includes(e), Wi = (e) => (e.isActive ? 2 : 0) + +!e.isSystem, Gi = (e) => {
	if (e.length === 0) throw new L("pickMorphGroupSurvivorOrThrow requires a non-empty morph group", "EMPTY_MORPH_GROUP");
	return e.reduce((e, t) => {
		let n = Wi(t) - Wi(e);
		return n > 0 || n === 0 && t.id < e.id ? t : e;
	});
}, Ki = (e) => {
	if (!p(e)) throw Error("Invalid fullPath provided");
	let t = e.split("/"), n = t.pop() || "", r = t.join("/"), i = n.lastIndexOf(".");
	return {
		folderPath: r,
		filename: n,
		type: i === -1 ? "" : n.slice(i + 1)
	};
}, qi = (e) => [l.IS_EMPTY, l.IS_NOT_EMPTY].includes(e), z = (e) => {
	switch (e) {
		case r.DATE_TIME: return "DATE_TIME";
		case r.DATE: return "DATE";
		case r.LINKS: return "LINKS";
		case r.FULL_NAME: return "FULL_NAME";
		case r.NUMBER: return "NUMBER";
		case r.CURRENCY: return "CURRENCY";
		case r.EMAILS: return "EMAILS";
		case r.PHONES: return "PHONES";
		case r.RELATION:
		case r.MORPH_RELATION: return "RELATION";
		case r.SELECT: return "SELECT";
		case r.MULTI_SELECT: return "MULTI_SELECT";
		case r.ADDRESS: return "ADDRESS";
		case r.RATING: return "RATING";
		case r.ACTOR: return "ACTOR";
		case r.ARRAY: return "ARRAY";
		case r.RAW_JSON: return "RAW_JSON";
		case r.FILES: return "FILES";
		case r.BOOLEAN: return "BOOLEAN";
		case r.TS_VECTOR: return "TS_VECTOR";
		case r.UUID: return "UUID";
		default: return "TEXT";
	}
}, Ji = ({ recordFilterOperand: e, correspondingFieldMetadataItem: t }) => {
	if (!qi(e)) return !1;
	let n = ["BOOLEAN", "TS_VECTOR"], r = z(t.type);
	return !n.includes(r);
}, Yi = ({ recordFilter: e, correspondingFieldMetadataItem: t, subFieldName: n }) => {
	if (p(n)) switch (n) {
		case "primaryEmail": switch (e.operand) {
			case l.CONTAINS: return { [t.name]: { primaryEmail: { ilike: `%${e.value}%` } } };
			case l.DOES_NOT_CONTAIN: return { not: { [t.name]: { primaryEmail: { ilike: `%${e.value}%` } } } };
			default: throw Error(`Unknown operand ${e.operand} for ${t.type} filter`);
		}
		case "additionalEmails": switch (e.operand) {
			case l.CONTAINS: return { [t.name]: { additionalEmails: { like: `%${e.value}%` } } };
			case l.DOES_NOT_CONTAIN: return { or: [{ not: { [t.name]: { additionalEmails: { like: `%${e.value}%` } } } }, { [t.name]: { additionalEmails: { is: "NULL" } } }] };
			default: throw new L(`Unknown operand ${e.operand} for ${t.type} filter`, "UNKNOWN_OPERAND_FOR_FILTER");
		}
		default: throw new L(`Unknown subfield name ${n}`, "UNKNOWN_SUBFIELD_NAME");
	}
	switch (e.operand) {
		case l.CONTAINS: return { or: [{ [t.name]: { primaryEmail: { ilike: `%${e.value}%` } } }, { [t.name]: { additionalEmails: { like: `%${e.value}%` } } }] };
		case l.DOES_NOT_CONTAIN: return { and: [{ not: { [t.name]: { primaryEmail: { ilike: `%${e.value}%` } } } }, { or: [{ not: { [t.name]: { additionalEmails: { like: `%${e.value}%` } } } }, { [t.name]: { additionalEmails: { is: "NULL" } } }] }] };
		default: throw Error(`Unknown operand ${e.operand} for ${t.type} filter`);
	}
}, Xi = ({ recordFilter: e, correspondingFieldMetadataItem: t, subFieldName: n }) => {
	if (p(n)) switch (n) {
		case "primaryLinkLabel":
		case "primaryLinkUrl": switch (e.operand) {
			case l.CONTAINS: return { [t.name]: { [n]: { ilike: `%${e.value}%` } } };
			case l.DOES_NOT_CONTAIN: return { not: { [t.name]: { [n]: { ilike: `%${e.value}%` } } } };
			default: throw new L(`Unknown operand ${e.operand} for ${t.type} filter`, "UNKNOWN_OPERAND_FOR_FILTER");
		}
		case "secondaryLinks": switch (e.operand) {
			case l.CONTAINS: return { [t.name]: { secondaryLinks: { like: `%${e.value}%` } } };
			case l.DOES_NOT_CONTAIN: return { or: [{ not: { [t.name]: { secondaryLinks: { like: `%${e.value}%` } } } }, { [t.name]: { secondaryLinks: { is: "NULL" } } }] };
			default: throw Error(`Unknown operand ${e.operand} for ${t.type} filter`);
		}
		default: throw Error(`Unknown subfield name ${n}`);
	}
	switch (e.operand) {
		case l.CONTAINS: return { or: [
			{ [t.name]: { primaryLinkUrl: { ilike: `%${e.value}%` } } },
			{ [t.name]: { primaryLinkLabel: { ilike: `%${e.value}%` } } },
			{ [t.name]: { secondaryLinks: { like: `%${e.value}%` } } }
		] };
		case l.DOES_NOT_CONTAIN: return { and: [
			{ not: { [t.name]: { primaryLinkLabel: { ilike: `%${e.value}%` } } } },
			{ not: { [t.name]: { primaryLinkUrl: { ilike: `%${e.value}%` } } } },
			{ or: [{ not: { [t.name]: { secondaryLinks: { like: `%${e.value}%` } } } }, { [t.name]: { secondaryLinks: { is: "NULL" } } }] }
		] };
		default: throw Error(`Unknown operand ${e.operand} for ${t.type} filter`);
	}
}, Zi = ({ recordFilter: e, correspondingFieldMetadataItem: t }) => {
	let n = e.subFieldName;
	if (p(n)) switch (n) {
		case "primaryEmail": return { or: [{ [t.name]: { primaryEmail: { eq: "" } } }, { [t.name]: { primaryEmail: { is: "NULL" } } }] };
		case "additionalEmails": return { or: [{ [t.name]: { additionalEmails: { is: "NULL" } } }, { [t.name]: { additionalEmails: { like: "[]" } } }] };
		default: throw new L(`Unknown subfield name ${n}`, "UNKNOWN_SUBFIELD_NAME");
	}
	return { and: [{ or: [{ [t.name]: { primaryEmail: { eq: "" } } }, { [t.name]: { primaryEmail: { is: "NULL" } } }] }, { or: [{ [t.name]: { additionalEmails: { is: "NULL" } } }, { [t.name]: { additionalEmails: { like: "[]" } } }] }] };
}, Qi = ({ recordFilter: e, correspondingFieldMetadataItem: t }) => {
	let n = e.subFieldName;
	if (p(n)) switch (n) {
		case "primaryLinkLabel": return { or: [{ [t.name]: { primaryLinkLabel: { eq: "" } } }, { [t.name]: { primaryLinkLabel: { is: "NULL" } } }] };
		case "primaryLinkUrl": return { or: [{ [t.name]: { primaryLinkUrl: { eq: "" } } }, { [t.name]: { primaryLinkUrl: { is: "NULL" } } }] };
		case "secondaryLinks": return { or: [{ [t.name]: { secondaryLinks: { is: "NULL" } } }, { [t.name]: { secondaryLinks: { like: "[]" } } }] };
		default: throw new L(`Unknown subfield name ${n}`, "UNKNOWN_SUBFIELD_NAME");
	}
	return { and: [
		{ or: [{ [t.name]: { primaryLinkLabel: { eq: "" } } }, { [t.name]: { primaryLinkLabel: { is: "NULL" } } }] },
		{ or: [{ [t.name]: { primaryLinkUrl: { eq: "" } } }, { [t.name]: { primaryLinkUrl: { is: "NULL" } } }] },
		{ or: [{ [t.name]: { secondaryLinks: { is: "NULL" } } }, { [t.name]: { secondaryLinks: { like: "[]" } } }] }
	] };
}, $i = (e) => {
	switch (e) {
		case l.IS_NOT_NULL:
		case l.IS_EMPTY:
		case l.IS_NOT_EMPTY:
		case l.IS_IN_PAST:
		case l.IS_IN_FUTURE:
		case l.IS_TODAY: return !1;
		default: return !0;
	}
}, ea = (t) => $i(t.operand) ? e(t.value) && t.value !== "" && t.value !== "[]" : !0, ta = (e) => e.filter(ea), B = ({ filterValue: e, fieldMetadataItem: t }) => ({
	id: ge(),
	value: e,
	fieldMetadataId: t.id
}), na = Object.entries(ie).map(([e, { label: t }]) => ({
	value: e,
	label: `${t} (${e})`
})), ra = ({ filterValue: t, fields: n }) => {
	let i = [], a = g.coerce.number().safeParse(t).success;
	for (let e of n) switch (e.type) {
		case r.TEXT:
			i.push({
				...B({
					filterValue: t,
					fieldMetadataItem: e
				}),
				operand: l.CONTAINS,
				type: "TEXT"
			});
			break;
		case r.ADDRESS:
			i.push({
				...B({
					filterValue: t,
					fieldMetadataItem: e
				}),
				operand: l.CONTAINS,
				type: "ADDRESS"
			});
			break;
		case r.LINKS:
			i.push({
				...B({
					filterValue: t,
					fieldMetadataItem: e
				}),
				operand: l.CONTAINS,
				type: "LINKS"
			});
			break;
		case r.FULL_NAME:
			i.push({
				...B({
					filterValue: t,
					fieldMetadataItem: e
				}),
				operand: l.CONTAINS,
				type: "FULL_NAME"
			});
			break;
		case r.ARRAY:
			i.push({
				...B({
					filterValue: t,
					fieldMetadataItem: e
				}),
				operand: l.CONTAINS,
				type: "ARRAY"
			});
			break;
		case r.EMAILS:
			i.push({
				...B({
					filterValue: t,
					fieldMetadataItem: e
				}),
				operand: l.CONTAINS,
				type: "EMAILS"
			});
			break;
		case r.PHONES:
			i.push({
				...B({
					filterValue: t,
					fieldMetadataItem: e
				}),
				operand: l.CONTAINS,
				type: "PHONES"
			});
			break;
		case r.NUMBER:
			a && i.push({
				...B({
					filterValue: t,
					fieldMetadataItem: e
				}),
				operand: l.IS,
				type: "NUMBER"
			});
			break;
		case r.CURRENCY:
			if (a && i.push({
				...B({
					filterValue: t,
					fieldMetadataItem: e
				}),
				operand: l.IS,
				type: "CURRENCY"
			}), p(t)) {
				let n = na.filter((e) => e.label.includes(t) || e.value.includes(t));
				if (et(n)) {
					let t = JSON.stringify(n.map((e) => e.value));
					i.push({
						...B({
							filterValue: t,
							fieldMetadataItem: e
						}),
						operand: l.IS,
						type: "CURRENCY",
						subFieldName: "currencyCode"
					});
				}
			}
			break;
		case r.SELECT:
			if (p(t)) {
				let { foundCorrespondingSelectOptions: n } = Fo({
					fieldMetadataItem: e,
					filterValue: t
				});
				if (et(n)) {
					let t = JSON.stringify(n.map((e) => e.value));
					i.push({
						...B({
							fieldMetadataItem: e,
							filterValue: t
						}),
						operand: l.IS,
						type: "SELECT"
					});
				}
			}
			break;
		case r.MULTI_SELECT:
			if (p(t)) {
				let { foundCorrespondingSelectOptions: n } = Fo({
					fieldMetadataItem: e,
					filterValue: t
				});
				if (et(n)) {
					let t = JSON.stringify(n.map((e) => e.value));
					i.push({
						...B({
							fieldMetadataItem: e,
							filterValue: t
						}),
						operand: l.CONTAINS,
						type: "MULTI_SELECT"
					});
				}
			}
			break;
	}
	let o = new Map(n.map((e) => [e.id, e])), s = i.map((e) => uo({
		filterValueDependencies: {},
		fieldMetadataItemById: o,
		recordFilter: e
	})).filter(e), c = { or: s };
	return s.length === 0 ? { recordGqlOperationFilter: {} } : { recordGqlOperationFilter: c };
}, ia = (e) => {
	let t = e.filter((e) => Object.keys(e).length > 0);
	return t.length === 0 ? {} : t.length === 1 ? t[0] : { and: t };
}, aa = (e) => oe.filter((t) => +t.split("_")[1] >= e), oa = (e) => oe.filter((t) => +t.split("_")[1] <= e), sa = (e) => `RATING_${e}`, ca = (e, t, n, r = !1) => {
	if (r) return n.map((e) => ({ or: [{ [t]: { [e]: { is: "NULL" } } }, { [t]: { [e]: { ilike: "" } } }] }));
	let i = e.trim().split(/\s+/).filter(Boolean);
	return i.length <= 1 ? n.map((e) => ({ [t]: { [e]: { ilike: `%${i[0] ?? ""}%` } } })) : [{ and: i.map((e) => ({ or: n.map((n) => ({ [t]: { [n]: { ilike: `%${e}%` } } })) })) }];
}, la = ({ operand: e, correspondingField: t, recordFilter: n }) => {
	let r = {}, i = n.subFieldName, a = p(i), o = z(t.type);
	switch (o) {
		case "TEXT":
			r = { or: [{ [t.name]: { ilike: "" } }, { [t.name]: { is: "NULL" } }] };
			break;
		case "PHONES":
			if (!a) r = { and: [{ or: [{ [t.name]: { primaryPhoneNumber: { is: "NULL" } } }, { [t.name]: { primaryPhoneNumber: { ilike: "" } } }] }, { or: [{ [t.name]: { additionalPhones: { is: "NULL" } } }, { [t.name]: { additionalPhones: { like: "[]" } } }] }] };
			else switch (i) {
				case "primaryPhoneNumber":
				case "primaryPhoneCallingCode":
					r = { or: [{ [t.name]: { [i]: { is: "NULL" } } }, { [t.name]: { [i]: { ilike: "" } } }] };
					break;
				case "additionalPhones":
					r = { or: [{ [t.name]: { additionalPhones: { is: "NULL" } } }, { [t.name]: { additionalPhones: { like: "[]" } } }] };
					break;
				default: throw Error(`Unsupported composite field name ${i} for filter type ${o}`);
			}
			break;
		case "CURRENCY":
			r = { or: [{ [t.name]: { amountMicros: { is: "NULL" } } }] };
			break;
		case "FULL_NAME":
			r = a ? { or: [{ [t.name]: { [i]: { ilike: "" } } }, { [t.name]: { [i]: { is: "NULL" } } }] } : { and: ca("", t.name, ["firstName", "lastName"], !0) };
			break;
		case "LINKS":
			r = Qi({
				correspondingFieldMetadataItem: t,
				recordFilter: n
			});
			break;
		case "ADDRESS":
			r = a ? { or: [{ [t.name]: { [i]: { ilike: "" } } }, { [t.name]: { [i]: { is: "NULL" } } }] } : { and: [
				{ or: [{ [t.name]: { addressStreet1: { ilike: "" } } }, { [t.name]: { addressStreet1: { is: "NULL" } } }] },
				{ or: [{ [t.name]: { addressStreet2: { ilike: "" } } }, { [t.name]: { addressStreet2: { is: "NULL" } } }] },
				{ or: [{ [t.name]: { addressCity: { ilike: "" } } }, { [t.name]: { addressCity: { is: "NULL" } } }] },
				{ or: [{ [t.name]: { addressState: { ilike: "" } } }, { [t.name]: { addressState: { is: "NULL" } } }] },
				{ or: [{ [t.name]: { addressCountry: { ilike: "" } } }, { [t.name]: { addressCountry: { is: "NULL" } } }] },
				{ or: [{ [t.name]: { addressPostcode: { ilike: "" } } }, { [t.name]: { addressPostcode: { is: "NULL" } } }] }
			] };
			break;
		case "NUMBER":
			r = { [t.name]: { is: "NULL" } };
			break;
		case "RATING":
			r = { [t.name]: { is: "NULL" } };
			break;
		case "DATE":
		case "DATE_TIME":
			r = { [t.name]: { is: "NULL" } };
			break;
		case "SELECT":
			r = { [t.name]: { is: "NULL" } };
			break;
		case "UUID":
			r = { [t.name]: { is: "NULL" } };
			break;
		case "MULTI_SELECT":
			r = { or: [{ [t.name]: { is: "NULL" } }, { [t.name]: { isEmptyArray: !0 } }] };
			break;
		case "RELATION":
			r = { [t.name + "Id"]: { is: "NULL" } };
			break;
		case "ACTOR":
			r = { or: [{ [t.name]: { name: { ilike: "" } } }, { [t.name]: { name: { is: "NULL" } } }] };
			break;
		case "ARRAY":
			r = { or: [{ [t.name]: { is: "NULL" } }, { [t.name]: { isEmptyArray: !0 } }] };
			break;
		case "FILES":
		case "RAW_JSON":
			r = { or: [{ [t.name]: { is: "NULL" } }] };
			break;
		case "EMAILS":
			r = Zi({
				correspondingFieldMetadataItem: t,
				recordFilter: n
			});
			break;
		default: throw new L(`Unsupported empty filter type ${o}`, "UNSUPPORTED_EMPTY_FILTER_TYPE");
	}
	switch (e) {
		case l.IS_EMPTY: return r;
		case l.IS_NOT_EMPTY: return { not: r };
		default: throw new L(`Unknown operand ${e} for ${o} filter`, "UNKNOWN_OPERAND_FOR_FILTER");
	}
}, ua = [l.IS_EMPTY, l.IS_NOT_EMPTY], da = { CURRENCY: {
	currencyCode: [
		l.IS,
		l.IS_NOT,
		...ua
	],
	amountMicros: [
		l.GREATER_THAN_OR_EQUAL,
		l.LESS_THAN_OR_EQUAL,
		l.IS,
		l.IS_NOT,
		...ua
	]
} }, V = [l.IS_EMPTY, l.IS_NOT_EMPTY], fa = [l.IS, l.IS_NOT], pa = {
	TEXT: [
		l.CONTAINS,
		l.DOES_NOT_CONTAIN,
		...V
	],
	EMAILS: [
		l.CONTAINS,
		l.DOES_NOT_CONTAIN,
		...V
	],
	FULL_NAME: [
		l.CONTAINS,
		l.DOES_NOT_CONTAIN,
		...V
	],
	ADDRESS: [
		l.CONTAINS,
		l.DOES_NOT_CONTAIN,
		...V
	],
	LINKS: [
		l.CONTAINS,
		l.DOES_NOT_CONTAIN,
		...V
	],
	PHONES: [
		l.CONTAINS,
		l.DOES_NOT_CONTAIN,
		...V
	],
	CURRENCY: [
		l.GREATER_THAN_OR_EQUAL,
		l.LESS_THAN_OR_EQUAL,
		...V
	],
	NUMBER: [
		l.IS,
		l.IS_NOT,
		l.GREATER_THAN_OR_EQUAL,
		l.LESS_THAN_OR_EQUAL,
		...V
	],
	RAW_JSON: [
		l.CONTAINS,
		l.DOES_NOT_CONTAIN,
		...V
	],
	FILES: [
		l.CONTAINS,
		l.DOES_NOT_CONTAIN,
		...V
	],
	DATE_TIME: [
		l.IS,
		l.IS_RELATIVE,
		l.IS_IN_PAST,
		l.IS_IN_FUTURE,
		l.IS_TODAY,
		l.IS_BEFORE,
		l.IS_AFTER,
		...V
	],
	DATE: [
		l.IS,
		l.IS_RELATIVE,
		l.IS_IN_PAST,
		l.IS_IN_FUTURE,
		l.IS_TODAY,
		l.IS_BEFORE,
		l.IS_AFTER,
		...V
	],
	RATING: [
		l.IS,
		l.IS_NOT,
		l.GREATER_THAN_OR_EQUAL,
		l.LESS_THAN_OR_EQUAL,
		...V
	],
	RELATION: [...fa, ...V],
	MULTI_SELECT: [
		l.CONTAINS,
		l.DOES_NOT_CONTAIN,
		...V
	],
	SELECT: [
		l.IS,
		l.IS_NOT,
		...V
	],
	ACTOR: [
		l.CONTAINS,
		l.DOES_NOT_CONTAIN,
		...V
	],
	ARRAY: [
		l.CONTAINS,
		l.DOES_NOT_CONTAIN,
		...V
	],
	BOOLEAN: [l.IS],
	TS_VECTOR: [l.VECTOR_SEARCH],
	UUID: [
		l.IS,
		l.IS_NOT,
		...V
	]
}, ma = [
	l.IS,
	l.IS_NOT,
	l.IS_EMPTY,
	l.IS_NOT_EMPTY
], ha = ({ filterType: e, subFieldName: t }) => e === "CURRENCY" ? t === "currencyCode" ? da.CURRENCY.currencyCode : da.CURRENCY.amountMicros : e === "ACTOR" && (t === "source" || t === "workspaceMemberId") ? ma : pa[e], ga = (e, t, n) => Object.values(ae[e]).includes(t) && t === n, _a = ({ arrayFilter: e, value: t }) => {
	switch (!0) {
		case e.is !== void 0: return e.is === "NULL" ? t === null : t !== null;
		case e.isEmptyArray !== void 0: return Array.isArray(t) && t.length === 0;
		case e.containsIlike !== void 0: {
			let n = e.containsIlike.toLowerCase();
			return Array.isArray(t) && t.some((e) => e.toLowerCase().includes(n));
		}
		default: throw Error(`Unexpected value for array filter: ${JSON.stringify(e)}`);
	}
}, va = ({ booleanFilter: e, value: t }) => {
	if (e.eq !== void 0) return t === e.eq;
	if (e.is !== void 0) return e.is === "NULL" ? t === null : t !== null;
	throw Error(`Unexpected value for string filter : ${JSON.stringify(e)}`);
}, ya = (e, t) => {
	switch (!0) {
		case e?.in !== void 0: return p(t) && e.in.includes(t);
		case e?.is !== void 0: return e.is === "NULL" ? t === null : t !== null;
		default: throw Error(`Unexpected operand for currency code filter : ${JSON.stringify(e)}`);
	}
}, ba = (t, n) => {
	switch (!0) {
		case t?.eq !== void 0: return n === t.eq;
		case t?.neq !== void 0: return n !== t.neq;
		case t?.gt !== void 0: return e(n) && n > t.gt;
		case t?.gte !== void 0: return e(n) && n >= t.gte;
		case t?.lt !== void 0: return e(n) && n < t.lt;
		case t?.lte !== void 0: return e(n) && n <= t.lte;
		case t?.is !== void 0: return t.is === "NULL" ? n === null : n !== null;
		default: throw Error(`Unexpected operand for currency amount micros filter : ${JSON.stringify(t)}`);
	}
}, xa = ({ currencyFilter: t, value: n }) => {
	let r = e(t.currencyCode), i = e(t.amountMicros);
	if (r && i) return ba(t.amountMicros, n.amountMicros) && ya(t.currencyCode, n.currencyCode);
	if (i) return ba(t.amountMicros, n.amountMicros);
	if (r) return ya(t.currencyCode, n.currencyCode);
	throw Error(`Unexpected filter for currency : ${JSON.stringify(t)}`);
}, Sa = ({ dateFilter: t, value: n }) => {
	if (!e(n)) return t.is === "NULL";
	switch (!0) {
		case t.eq !== void 0: return An(I(n), I(t.eq));
		case t.neq !== void 0: return !An(I(n), I(t.neq));
		case t.in !== void 0: return t.in.includes(n);
		case t.is !== void 0: return t.is === "NULL" ? n === null : n !== null;
		case t.gt !== void 0: return On(I(n), I(t.gt));
		case t.gte !== void 0: {
			let e = I(n), r = I(t.gte);
			return On(e, r) || An(e, r);
		}
		case t.lt !== void 0: return kn(I(n), I(t.lt));
		case t.lte !== void 0: {
			let e = I(n), r = I(t.lte);
			return kn(e, r) || An(e, r);
		}
		default: throw Error(`Unexpected value for string filter : ${JSON.stringify(t)}`);
	}
}, Ca = ({ filesFilter: e, value: t }) => {
	switch (!0) {
		case e.like !== void 0: {
			let n = e.like.replace(/[.*+?^${}()|[\]\\]/g, "\\$&").replace(/%/g, ".*"), r = RegExp(`^${n}$`, "is"), i = JSON.stringify(t, null, 1);
			return r.test(i);
		}
		case e.is !== void 0: return e.is === "NULL" ? t === null || t.length === 0 : t !== null && t.length > 0;
		default: throw Error(`Unexpected value for files filter : ${JSON.stringify(e)}`);
	}
}, wa = ({ floatFilter: e, value: t }) => {
	switch (!0) {
		case e.eq !== void 0: return t === e.eq;
		case e.neq !== void 0: return t !== e.neq;
		case e.gt !== void 0: return t > e.gt;
		case e.gte !== void 0: return t >= e.gte;
		case e.lt !== void 0: return t < e.lt;
		case e.lte !== void 0: return t <= e.lte;
		case e.in !== void 0: return e.in.includes(t);
		case e.is !== void 0: return e.is === "NULL" ? t === null : t !== null;
		default: throw Error(`Unexpected value for float filter : ${JSON.stringify(e)}`);
	}
}, Ta = ({ multiSelectFilter: e, value: t }) => {
	switch (!0) {
		case e.containsAny !== void 0: return Array.isArray(t) && e.containsAny.some((e) => t.includes(e));
		case e.isEmptyArray !== void 0: return Array.isArray(t) && t.length === 0;
		case e.is !== void 0: return e.is === "NULL" ? t === null : t !== null;
		default: throw Error(`Unexpected value for multi-select filter: ${JSON.stringify(e)}`);
	}
}, H = ({ value: t, comparisonValue: n, options: r }) => {
	if (!e(t) || !e(r)) return null;
	let i = [...r].sort((e, t) => e.position - t.position).map((e) => e.value), a = i.indexOf(t), o = i.indexOf(n);
	return a === -1 || o === -1 ? null : a - o;
}, Ea = ({ ratingFilter: e, value: t, options: n }) => {
	switch (!0) {
		case e.eq !== void 0: return t === e.eq;
		case e.in !== void 0: return t !== null && e.in.includes(t);
		case e.is !== void 0: return e.is === "NULL" ? t === null : t !== null;
		case e.gt !== void 0: {
			let r = H({
				value: t,
				comparisonValue: e.gt,
				options: n
			});
			return r !== null && r > 0;
		}
		case e.gte !== void 0: {
			let r = H({
				value: t,
				comparisonValue: e.gte,
				options: n
			});
			return r !== null && r >= 0;
		}
		case e.lt !== void 0: {
			let r = H({
				value: t,
				comparisonValue: e.lt,
				options: n
			});
			return r !== null && r < 0;
		}
		case e.lte !== void 0: {
			let r = H({
				value: t,
				comparisonValue: e.lte,
				options: n
			});
			return r !== null && r <= 0;
		}
		default: throw Error(`Unexpected value for rating filter : ${JSON.stringify(e)}`);
	}
}, Da = ({ rawJsonFilter: e, value: t }) => {
	switch (!0) {
		case e.like !== void 0: {
			let n = e.like.replace(/%/g, ".*"), r = RegExp(`^${n}$`, "is"), i = JSON.stringify(t, null, 1);
			return r.test(i);
		}
		case e.is !== void 0: return e.is === "NULL" ? t === null : t !== null;
		default: throw Error(`Unexpected value for string filter : ${JSON.stringify(e)}`);
	}
}, Oa = ({ richTextFilter: e, value: t }) => {
	switch (!0) {
		case e.markdown !== void 0: {
			let n = xe(e.markdown.ilike).replace(/%/g, ".*");
			return RegExp(`^${n}$`, "i").test(t);
		}
		default: throw Error(`Unexpected value for RICH_TEXT filter : ${JSON.stringify(e)}`);
	}
}, ka = ({ selectFilter: e, value: t, options: n }) => {
	switch (!0) {
		case e.in !== void 0: return t !== null && e.in.includes(t);
		case e.is !== void 0: return e.is === "NULL" ? t === null : t !== null;
		case e.eq !== void 0: return t === e.eq;
		case e.neq !== void 0: return t !== null && t !== e.neq;
		case e.gt !== void 0: {
			let r = H({
				value: t,
				comparisonValue: e.gt,
				options: n
			});
			return r !== null && r > 0;
		}
		case e.gte !== void 0: {
			let r = H({
				value: t,
				comparisonValue: e.gte,
				options: n
			});
			return r !== null && r >= 0;
		}
		case e.lt !== void 0: {
			let r = H({
				value: t,
				comparisonValue: e.lt,
				options: n
			});
			return r !== null && r < 0;
		}
		case e.lte !== void 0: {
			let r = H({
				value: t,
				comparisonValue: e.lte,
				options: n
			});
			return r !== null && r <= 0;
		}
		default: throw Error(`Unexpected value for select filter : ${JSON.stringify(e)}`);
	}
}, Aa = ({ stringFilter: e, value: t }) => {
	switch (!0) {
		case e.eq !== void 0: return t === e.eq;
		case e.neq !== void 0: return t !== e.neq;
		case e.gt !== void 0: return t > e.gt;
		case e.gte !== void 0: return t >= e.gte;
		case e.lt !== void 0: return t < e.lt;
		case e.lte !== void 0: return t <= e.lte;
		case e.like !== void 0: {
			let n = xe(e.like).replace(/%/g, ".*");
			return RegExp(`^${n}$`).test(t);
		}
		case e.ilike !== void 0: {
			let n = xe(e.ilike).replace(/%/g, ".*");
			return RegExp(`^${n}$`, "i").test(t);
		}
		case e.in !== void 0: return e.in.includes(t);
		case e.is !== void 0: return e.is === "NULL" ? t === null : t !== null;
		case e.regex !== void 0: {
			let n = e.regex;
			return new RegExp(n).test(t);
		}
		case e.iregex !== void 0: {
			let n = e.iregex;
			return new RegExp(n, "i").test(t);
		}
		case e.startsWith !== void 0: return t.startsWith(e.startsWith);
		default: throw Error(`Unexpected value for string filter : ${JSON.stringify(e)}`);
	}
}, ja = ({ tsVectorFilter: e, value: t }) => {
	if (t === void 0) return !0;
	switch (!0) {
		case e.search !== void 0: {
			let n = e.search.toLowerCase(), r = t.toLowerCase();
			return n.split(/\s+/).filter(Boolean).every((e) => r.includes(e));
		}
		default: throw Error(`Unexpected value for ts_vector filter : ${JSON.stringify(e)}`);
	}
}, Ma = ({ uuidFilter: e, value: t }) => {
	switch (!0) {
		case e.eq !== void 0: return t === e.eq;
		case e.neq !== void 0: return t !== e.neq;
		case e.gt !== void 0: return t > e.gt;
		case e.gte !== void 0: return t >= e.gte;
		case e.lt !== void 0: return t < e.lt;
		case e.lte !== void 0: return t <= e.lte;
		case e.in !== void 0: return e.in.includes(t);
		case e.is !== void 0: return e.is === "NULL" ? t === null : t !== null;
		default: throw Error(`Unexpected value for UUID filter: ${JSON.stringify(e)}`);
	}
}, Na = (e) => /^{{[^{}]+}}$/.test(e), U = g.string().transform((e, t) => {
	if (e === "") return [];
	if (Na(e)) return [e];
	try {
		return JSON.parse(e);
	} catch (e) {
		return t.addIssue({
			code: "custom",
			message: e.message
		}), g.NEVER;
	}
}).refine((e) => Array.isArray(e) && e.every((e) => typeof e == "string"), { error: "Expected an array of strings" }), W = g.preprocess((e) => {
	try {
		if (typeof e == "string") {
			if (Na(e)) return [e];
			try {
				let t = JSON.parse(e);
				return Array.isArray(t) ? t : [t];
			} catch {
				return [e];
			}
		}
		return Array.isArray(e) ? e : [e];
	} catch {
		return [];
	}
}, g.array(g.string().refine((e) => Me(e) || Na(e), "Must be a valid UUID or a variable with {{ }} syntax"))), Pa = W.catch([]), Fa = g.object({
	isCurrentWorkspaceMemberSelected: g.boolean().optional(),
	isCurrentRecordSelected: g.boolean().optional(),
	selectedRecordIds: g.array(g.string())
}), Ia = g.string().transform((e, t) => {
	try {
		return JSON.parse(e);
	} catch (e) {
		return t.addIssue({
			code: "custom",
			message: e.message
		}), g.NEVER;
	}
}).pipe(Fa), G = g.string().min(1), La = /^[+-]?(?:\d+\.?\d*|\.\d+)(?:[eE][+-]?\d+)?$/, K = g.string().refine((e) => La.test(e.trim()), "Expected a number").transform((e) => parseFloat(e)).refine((e) => Number.isFinite(e), "Expected a finite number"), Ra = (e, t) => g.string().transform((n, r) => {
	try {
		return e(n);
	} catch {
		return r.addIssue({
			code: "custom",
			message: t
		}), g.NEVER;
	}
}), za = Ra((e) => _.PlainDate.from(e), "Expected an ISO date, e.g. \"2026-01-31\""), Ba = Ra((e) => _.Instant.from(e), "Expected an ISO date time, e.g. \"2026-01-31T00:00:00Z\""), Va = Ra((e) => e.includes("T") ? _.Instant.from(e) : _.PlainDate.from(e), "Expected an ISO date or date time"), Ha = g.enum(["true", "false"]).transform((e) => e === "true"), Ua = g.string().transform((e, t) => {
	try {
		return JSON.parse(e);
	} catch (e) {
		return t.addIssue({
			code: "custom",
			message: e.message
		}), g.NEVER;
	}
}).pipe(g.array(g.enum(n))), Wa = h.enum([
	o.MONDAY,
	o.SATURDAY,
	o.SUNDAY
]), Ga = h.union([h.coerce.number().int().positive(), h.literal("undefined")]).transform((e) => e === "undefined" ? void 0 : e), Ka = h.enum([
	"NEXT",
	"THIS",
	"PAST"
]), qa = h.enum([
	"SECOND",
	"MINUTE",
	"HOUR",
	"DAY",
	"WEEK",
	"MONTH",
	"QUARTER",
	"YEAR"
]), Ja = h.object({
	direction: Ka,
	amount: Ga.nullish(),
	unit: qa,
	timezone: h.string().nullish(),
	firstDayOfTheWeek: Wa.nullish()
}).refine((e) => !(e.amount === void 0 && e.direction !== "THIS"), { error: "Amount cannot be 'undefined' unless direction is 'THIS'" }), Ya = /((?:THIS)|(?:PAST)|(?:NEXT))_(\d*)_(DAY|MONTH|YEAR|WEEK|QUARTER|HOUR|MINUTE|SECOND)(?:(?:;;([^;;]*);;)?(?:(MONDAY|SUNDAY|SATURDAY);;)?)?/, q = h.string().transform((e, t) => {
	let n = new RegExp(Ya).exec(e);
	if (!de(n)) return t.addIssue(`Cannot parse stringified inline relative date filter, value : "${e}"`), h.NEVER;
	let [r, i, a, o, s, c] = n, l = Ja.safeParse({
		direction: i,
		amount: a,
		unit: o,
		timezone: s,
		firstDayOfTheWeek: c
	});
	return l.success ? l.data : (t.addIssue(`Cannot parse stringified inline relative date filter, value : "${e}"`), h.NEVER);
}), Xa = Ia.refine(({ selectedRecordIds: e }) => W.safeParse(e).success, "Expected selectedRecordIds to contain UUIDs or variables").refine(({ selectedRecordIds: e, isCurrentWorkspaceMemberSelected: t, isCurrentRecordSelected: n }) => e.length > 0 || t === !0 || n === !0, "Expected at least one selected record").or(W.refine((e) => e.length > 0, "Expected at least one selected record")), Za = G.refine((e) => {
	if (U.safeParse(e).success) return !0;
	try {
		JSON.parse(e);
	} catch {
		return !0;
	}
	return !1;
}, "Expected an array of option values"), J = {
	[l.CONTAINS]: G,
	[l.DOES_NOT_CONTAIN]: G
}, Qa = {
	[l.IS]: K,
	[l.IS_NOT]: K,
	[l.GREATER_THAN_OR_EQUAL]: K,
	[l.LESS_THAN_OR_EQUAL]: K
}, $a = {
	TEXT: J,
	EMAILS: J,
	FULL_NAME: J,
	ADDRESS: J,
	LINKS: J,
	PHONES: J,
	RAW_JSON: J,
	FILES: J,
	ARRAY: J,
	ACTOR: J,
	MULTI_SELECT: {
		[l.CONTAINS]: Za,
		[l.DOES_NOT_CONTAIN]: Za
	},
	SELECT: {
		[l.IS]: Za,
		[l.IS_NOT]: Za
	},
	CURRENCY: Qa,
	NUMBER: Qa,
	RATING: Qa,
	DATE: {
		[l.IS]: za,
		[l.IS_BEFORE]: za,
		[l.IS_AFTER]: za,
		[l.IS_RELATIVE]: q
	},
	DATE_TIME: {
		[l.IS]: Va,
		[l.IS_BEFORE]: Ba,
		[l.IS_AFTER]: Ba,
		[l.IS_RELATIVE]: q
	},
	RELATION: {
		[l.IS]: Xa,
		[l.IS_NOT]: Xa
	},
	UUID: {
		[l.IS]: W,
		[l.IS_NOT]: W
	},
	BOOLEAN: { [l.IS]: Ha },
	TS_VECTOR: { [l.VECTOR_SEARCH]: G }
}, eo = {
	ACTOR: {
		source: {
			[l.IS]: Ua,
			[l.IS_NOT]: Ua
		},
		workspaceMemberId: {
			[l.IS]: Xa,
			[l.IS_NOT]: Xa
		}
	},
	CURRENCY: { currencyCode: {
		[l.IS]: U,
		[l.IS_NOT]: U
	} },
	ADDRESS: { addressCountry: {
		[l.CONTAINS]: U,
		[l.DOES_NOT_CONTAIN]: U
	} }
}, to = {
	[l.IS_RELATIVE]: "Expected a stringified relative date such as \"NEXT_30_DAY\".",
	[l.VECTOR_SEARCH]: "Expected a non empty search string."
}, no = ({ filterType: t, operand: n, subFieldName: r }) => {
	if (!$i(n)) return;
	let i = eo[t];
	return e(r) && e(i?.[r]) ? i[r][n] : $a[t][n];
}, ro = (e) => typeof e == "string" ? e : JSON.stringify(e ?? ""), io = ({ fieldType: t, operand: n, subFieldName: r, value: i }) => {
	let a = ro(i);
	if (!ea({
		operand: n,
		value: a
	})) return;
	let o = z(t), s = no({
		filterType: o,
		operand: n,
		subFieldName: r
	});
	if (!e(s)) return;
	let c = s.safeParse(a);
	if (!c.success) return {
		stringifiedValue: a,
		operand: n,
		filterType: o,
		hint: to[n] ?? c.error.issues[0]?.message ?? ""
	};
}, ao = /(?!^)\+|[^0-9+]/g, oo = /[0-9]/, so = Ha.catch(!1), Y = (e) => {
	let t = K.safeParse(e);
	return t.success ? t.data : parseFloat(e);
}, co = (e) => {
	let t = Ua.safeParse(e);
	return t.success ? t.data : JSON.parse(e);
}, lo = ({ sourceFieldMetadataItem: t, targetFieldMetadataItem: n }) => {
	if (t.type !== r.MORPH_RELATION) return t.name;
	let i = n.relation?.sourceObjectMetadata.id, a = t.morphRelations?.find((e) => e.targetObjectMetadata.id === i);
	if (!e(a)) throw new L(`No morph relation on field ${t.name} targets the traversed object ${i}`, "UNRESOLVED_MORPH_RELATION_TRAVERSAL");
	return Oi({
		fieldName: t.name,
		relationType: a.type,
		targetObjectMetadataNameSingular: a.targetObjectMetadata.nameSingular,
		targetObjectMetadataNamePlural: a.targetObjectMetadata.namePlural
	});
}, uo = ({ recordFilter: t, fieldMetadataItemById: n, filterValueDependencies: i }) => {
	let a = n.get(t.fieldMetadataId);
	if (e(a) && ea(t)) {
		if ((a.type === r.RELATION || a.type === r.MORPH_RELATION) && e(t.relationTargetFieldMetadataId)) {
			let r = n.get(t.relationTargetFieldMetadataId);
			if (!e(r)) return;
			let o = lo({
				sourceFieldMetadataItem: a,
				targetFieldMetadataItem: r
			}), s = po({
				recordFilter: {
					...t,
					fieldMetadataId: r.id,
					relationTargetFieldMetadataId: null
				},
				fieldMetadataItem: r,
				filterValueDependencies: i
			});
			return e(s) ? { [o]: s } : void 0;
		}
		return po({
			recordFilter: t,
			fieldMetadataItem: a,
			filterValueDependencies: i
		});
	}
}, fo = ({ fieldMetadataItem: t, filterValueDependencies: n }) => {
	if (t.type !== r.MORPH_RELATION) return ki({ name: t.name });
	let i = t.morphRelations?.find((e) => e.targetObjectMetadata.nameSingular === n.currentRecord?.objectMetadataNameSingular);
	if (e(i)) return Ai({
		fieldName: t.name,
		relationType: i.type,
		targetObjectMetadataNameSingular: i.targetObjectMetadata.nameSingular,
		targetObjectMetadataNamePlural: i.targetObjectMetadata.namePlural
	});
}, po = ({ recordFilter: t, fieldMetadataItem: i, filterValueDependencies: a }) => {
	if (Ji({
		recordFilterOperand: t.operand,
		correspondingFieldMetadataItem: i
	})) return la({
		operand: t.operand,
		correspondingField: i,
		recordFilter: t
	});
	let o = t.subFieldName, s = p(o), c = z(i.type);
	switch (c) {
		case "TEXT": switch (t.operand) {
			case l.CONTAINS: return { [i.name]: { ilike: `%${t.value}%` } };
			case l.DOES_NOT_CONTAIN: return { not: { [i.name]: { ilike: `%${t.value}%` } } };
			default: throw new L(`Unknown operand ${t.operand} for ${c} filter`, "UNKNOWN_OPERAND_FOR_FILTER");
		}
		case "TS_VECTOR": switch (t.operand) {
			case l.VECTOR_SEARCH: return { [i.name]: { search: t.value } };
			default: throw Error(`Unknown operand ${t.operand} for ${c} filter`);
		}
		case "RAW_JSON": switch (t.operand) {
			case l.CONTAINS: return { [i.name]: { like: `%${t.value}%` } };
			case l.DOES_NOT_CONTAIN: return { not: { [i.name]: { like: `%${t.value}%` } } };
			default: throw Error(`Unknown operand ${t.operand} for ${c} filter`);
		}
		case "FILES": switch (t.operand) {
			case l.CONTAINS: return { [i.name]: { like: `%${t.value}%` } };
			case l.DOES_NOT_CONTAIN: return { not: { [i.name]: { like: `%${t.value}%` } } };
			default: throw Error(`Unknown operand ${t.operand} for ${c} filter`);
		}
		case "DATE":
			if (t.operand === l.IS_RELATIVE) {
				let e = Do(t.value), n = Oo({
					value: "PAST_1_DAY",
					operand: l.IS_RELATIVE
				});
				if (!n) throw Error("Failed to resolve default date range");
				let r = e?.start?.toString() ?? n.start, a = e?.end?.toString() ?? n.end;
				return { and: [{ [i.name]: { gte: r } }, { [i.name]: { lt: a } }] };
			}
			if (t.operand === l.IS_TODAY || t.operand === l.IS_IN_PAST || t.operand === l.IS_IN_FUTURE) {
				let e = _.Now.plainDateISO(a.timeZone).toString();
				switch (t.operand) {
					case l.IS_IN_PAST: return { [i.name]: { lt: e } };
					case l.IS_IN_FUTURE: return { [i.name]: { gte: e } };
					case l.IS_TODAY: return { [i.name]: { eq: e } };
				}
			} else {
				let e = t.value;
				switch (t.operand) {
					case l.IS_AFTER: return { [i.name]: { gte: e } };
					case l.IS_BEFORE: return { [i.name]: { lt: e } };
					case l.IS: return { [i.name]: { eq: e } };
				}
			}
			throw Error(`Unknown operand ${t.operand} for ${c} filter`);
		case "DATE_TIME":
			if (t.operand === l.IS_RELATIVE) {
				let n = jo(t), r = e(n) && typeof n == "object" ? n : null;
				if (!e(r)) throw Error(`Cannot parse relative date filter : "${t.value}"`);
				let o = jo({
					value: `PAST_1_DAY;;${a.timeZone}`,
					operand: l.IS_RELATIVE
				});
				if (!e(o?.start) || !e(o?.end)) throw Error("Failed to resolve default date range");
				let s = r?.start ?? o.start, c = r?.end ?? o.end;
				return { and: [{ [i.name]: { gte: s.toInstant().toString() } }, { [i.name]: { lt: c.toInstant().toString() } }] };
			}
			if (t.operand === l.IS_TODAY || t.operand === l.IS_IN_PAST || t.operand === l.IS_IN_FUTURE) {
				let e = _.Now.zonedDateTimeISO(a.timeZone);
				switch (t.operand) {
					case l.IS_IN_PAST: return { [i.name]: { lt: e.toInstant().round("minute").toString() } };
					case l.IS_IN_FUTURE: return { [i.name]: { gt: e.toInstant().round("minute").toString() } };
					case l.IS_TODAY: return { and: [{ [i.name]: { gte: X(e, "DAY").toInstant().toString() } }, { [i.name]: { lt: Z(e, "DAY").toInstant().toString() } }] };
				}
			} else {
				if (!p(t.value)) throw Error("Date filter is empty");
				if (t.operand === l.IS) {
					let e = a.timeZone ?? "UTC", n = Va.safeParse(t.value);
					if (!n.success) throw Error(`Cannot parse "${t.value}" for ${c} filter`);
					let r = (n.data instanceof _.Instant ? n.data.toZonedDateTimeISO(e).toPlainDate() : n.data).toZonedDateTime(e), o = r.toInstant(), s = r.add({ days: 1 }).toInstant();
					return { and: [{ [i.name]: { gte: o.toString() } }, { [i.name]: { lt: s.toString() } }] };
				}
				let e = Ba.parse(t.value);
				switch (t.operand) {
					case l.IS_AFTER: return { [i.name]: { gte: e.toString() } };
					case l.IS_BEFORE: return { [i.name]: { lt: e.toString() } };
				}
			}
			throw Error(`Unknown operand ${t.operand} for ${c} filter`);
		case "RATING": switch (t.operand) {
			case l.IS: return { [i.name]: { eq: sa(Y(t.value)) } };
			case l.IS_NOT: return { not: { [i.name]: { eq: sa(Y(t.value)) } } };
			case l.GREATER_THAN_OR_EQUAL: return { [i.name]: { in: aa(Y(t.value)) } };
			case l.LESS_THAN_OR_EQUAL: return { [i.name]: { in: oa(Y(t.value)) } };
			default: throw Error(`Unknown operand ${t.operand} for ${c} filter`);
		}
		case "NUMBER": switch (t.operand) {
			case l.GREATER_THAN_OR_EQUAL: return { [i.name]: { gte: Y(t.value) } };
			case l.LESS_THAN_OR_EQUAL: return { [i.name]: { lte: Y(t.value) } };
			case l.IS: return { [i.name]: { eq: Y(t.value) } };
			case l.IS_NOT: return { not: { [i.name]: { eq: Y(t.value) } } };
			default: throw Error(`Unknown operand ${t.operand} for ${c} filter`);
		}
		case "RELATION": {
			let { isCurrentWorkspaceMemberSelected: n, isCurrentRecordSelected: r, selectedRecordIds: o } = Ia.catch({
				isCurrentWorkspaceMemberSelected: !1,
				isCurrentRecordSelected: !1,
				selectedRecordIds: Pa.parse(t.value)
			}).parse(t.value), s = [
				...o,
				...n ? [a?.currentWorkspaceMemberId] : [],
				...r ? [a.currentRecord?.id] : []
			].filter(e);
			if (s.length === 0) return;
			let u = fo({
				fieldMetadataItem: i,
				filterValueDependencies: a
			});
			if (!e(u)) return;
			switch (t.operand) {
				case l.IS: return { [u]: { in: s } };
				case l.IS_NOT: return !e(s) || s.length === 0 ? void 0 : { or: [{ not: { [u]: { in: s } } }, { [u]: { is: "NULL" } }] };
				default: throw Error(`Unknown operand ${t.operand} for ${c} filter`);
			}
		}
		case "CURRENCY": if (ga(r.CURRENCY, "currencyCode", o)) {
			let e = U.parse(t.value);
			if (e.length === 0) return;
			let n = { [i.name]: { currencyCode: { in: e } } };
			switch (t.operand) {
				case l.IS: return n;
				case l.IS_NOT: return { not: n };
				default: throw Error(`Unknown operand ${t.operand} for ${c} / ${o} filter`);
			}
		} else if (ga(r.CURRENCY, "amountMicros", o) || !s) switch (t.operand) {
			case l.GREATER_THAN_OR_EQUAL: return { [i.name]: { amountMicros: { gte: Y(t.value) * 1e6 } } };
			case l.LESS_THAN_OR_EQUAL: return { [i.name]: { amountMicros: { lte: Y(t.value) * 1e6 } } };
			case l.IS: return { [i.name]: { amountMicros: { eq: Y(t.value) * 1e6 } } };
			case l.IS_NOT: return { not: { [i.name]: { amountMicros: { eq: Y(t.value) * 1e6 } } } };
			default: throw Error(`Unknown operand ${t.operand} for ${c} / ${o}  filter`);
		}
		else throw Error(`Unknown subfield ${o} for ${c} filter`);
		case "LINKS": return Xi({
			correspondingFieldMetadataItem: i,
			recordFilter: t,
			subFieldName: o
		});
		case "FULL_NAME": {
			let e = ca(t.value, i.name, ["firstName", "lastName"]);
			switch (t.operand) {
				case l.CONTAINS: return s ? { [i.name]: { [o]: { ilike: `%${t.value}%` } } } : { or: e };
				case l.DOES_NOT_CONTAIN: return s ? { not: { [i.name]: { [o]: { ilike: `%${t.value}%` } } } } : { and: e.map((e) => ({ not: e })) };
				default: throw Error(`Unknown operand ${t.operand} for ${c} filter`);
			}
		}
		case "ADDRESS": switch (t.operand) {
			case l.CONTAINS: if (s) {
				if (o === "addressCountry") {
					let e = U.parse(t.value);
					return e.length === 0 ? {} : { [i.name]: { [o]: { in: e } } };
				}
				return { [i.name]: { [o]: { ilike: `%${t.value}%` } } };
			} else return { or: [
				{ [i.name]: { addressStreet1: { ilike: `%${t.value}%` } } },
				{ [i.name]: { addressStreet2: { ilike: `%${t.value}%` } } },
				{ [i.name]: { addressCity: { ilike: `%${t.value}%` } } },
				{ [i.name]: { addressState: { ilike: `%${t.value}%` } } },
				{ [i.name]: { addressCountry: { ilike: `%${t.value}%` } } },
				{ [i.name]: { addressPostcode: { ilike: `%${t.value}%` } } }
			] };
			case l.DOES_NOT_CONTAIN: if (s) {
				if (o === "addressCountry") {
					let e = U.parse(t.value);
					return t.value === "[]" || e.length === 0 ? {} : { or: [{ not: { [i.name]: { addressCountry: { in: e } } } }, { [i.name]: { addressCountry: { is: "NULL" } } }] };
				}
				return { or: [{ not: { [i.name]: { [o]: { ilike: `%${t.value}%` } } } }, { [i.name]: { [o]: { is: "NULL" } } }] };
			} else return { and: [
				{ or: [{ not: { [i.name]: { addressStreet1: { ilike: `%${t.value}%` } } } }, { [i.name]: { addressStreet1: { is: "NULL" } } }] },
				{ or: [{ not: { [i.name]: { addressStreet2: { ilike: `%${t.value}%` } } } }, { [i.name]: { addressStreet2: { is: "NULL" } } }] },
				{ or: [{ not: { [i.name]: { addressCity: { ilike: `%${t.value}%` } } } }, { [i.name]: { addressCity: { is: "NULL" } } }] },
				{ or: [{ not: { [i.name]: { addressState: { ilike: `%${t.value}%` } } } }, { [i.name]: { addressState: { is: "NULL" } } }] },
				{ or: [{ not: { [i.name]: { addressPostcode: { ilike: `%${t.value}%` } } } }, { [i.name]: { addressPostcode: { is: "NULL" } } }] },
				{ or: [{ not: { [i.name]: { addressCountry: { ilike: `%${t.value}%` } } } }, { [i.name]: { addressCountry: { is: "NULL" } } }] }
			] };
			default: throw Error(`Unknown operand ${t.operand} for ${c} filter`);
		}
		case "MULTI_SELECT": {
			let e = U.parse(t.value);
			if (e.length === 0) return;
			let n = e.filter((e) => e === ""), r = e.filter((e) => e !== "");
			switch (t.operand) {
				case l.CONTAINS: {
					let e = [];
					return r.length > 0 && e.push({ [i.name]: { containsAny: r } }), n.length > 0 && e.push({ [i.name]: { isEmptyArray: !0 } }), e.length === 1 ? e[0] : { or: e };
				}
				case l.DOES_NOT_CONTAIN: return { or: [
					{ not: { [i.name]: { containsAny: r } } },
					{ [i.name]: { isEmptyArray: !0 } },
					{ [i.name]: { is: "NULL" } }
				] };
				default: throw Error(`Unknown operand ${t.operand} for ${c} filter`);
			}
		}
		case "SELECT": {
			let e = U.parse(t.value);
			if (e.length === 0) return;
			let n = e.filter((e) => e === ""), r = e.filter((e) => e !== "");
			switch (t.operand) {
				case l.IS: {
					let e = [];
					return r.length > 0 && e.push({ [i.name]: { in: r } }), n.length > 0 && e.push({ [i.name]: { is: "NULL" } }), e.length === 1 ? e[0] : { or: e };
				}
				case l.IS_NOT: {
					let e = [];
					return r.length > 0 && e.push({ not: { [i.name]: { in: r } } }), n.length > 0 && e.push({ not: { [i.name]: { is: "NULL" } } }), e.length === 1 ? e[0] : { and: e };
				}
				default: throw Error(`Unknown operand ${t.operand} for ${c} filter`);
			}
		}
		case "ARRAY": switch (t.operand) {
			case l.CONTAINS: return { [i.name]: { containsIlike: `%${t.value}%` } };
			case l.DOES_NOT_CONTAIN: return { not: { [i.name]: { containsIlike: `%${t.value}%` } } };
			default: throw Error(`Unknown operand ${t.operand} for ${c} filter`);
		}
		case "ACTOR": {
			if (o === "source") switch (t.operand) {
				case l.IS: {
					if (t.value === "[]") return;
					let e = co(t.value);
					return { [i.name]: { source: { in: e } } };
				}
				case l.IS_NOT: {
					if (t.value === "[]") return;
					let e = co(t.value);
					return e.length === 0 ? void 0 : { not: { [i.name]: { source: { in: e } } } };
				}
				default: throw Error(`Unknown operand ${t.operand} for ${i.label} filter`);
			}
			if (o === "workspaceMemberId") {
				let { isCurrentWorkspaceMemberSelected: n, selectedRecordIds: r } = Ia.catch({
					isCurrentWorkspaceMemberSelected: !1,
					selectedRecordIds: Pa.parse(t.value)
				}).parse(t.value), o = n ? [...r, a?.currentWorkspaceMemberId].filter(e) : r;
				if (!e(o) || o.length === 0) return;
				switch (t.operand) {
					case l.IS: return { [i.name]: { workspaceMemberId: { in: o } } };
					case l.IS_NOT: return { or: [{ not: { [i.name]: { workspaceMemberId: { in: o } } } }, { [i.name]: { workspaceMemberId: { is: "NULL" } } }] };
					default: throw Error(`Unknown operand ${t.operand} for ${i.label} filter`);
				}
			}
			let r = Object.values(n).filter((e) => e.toLowerCase().includes(t.value.toLowerCase()));
			switch (t.operand) {
				case l.CONTAINS: return { or: [{ [i.name]: { name: { ilike: `%${t.value}%` } } }, ...r.length > 0 ? [{ [i.name]: { source: { in: r } } }] : []] };
				case l.DOES_NOT_CONTAIN: return { and: [{ not: { [i.name]: { name: { ilike: `%${t.value}%` } } } }, ...r.length > 0 ? [{ not: { [i.name]: { source: { in: r } } } }] : []] };
				default: throw Error(`Unknown operand ${t.operand} for ${i.label} filter`);
			}
		}
		case "EMAILS": return Yi({
			correspondingFieldMetadataItem: i,
			recordFilter: t,
			subFieldName: o
		});
		case "PHONES": {
			if (!s) {
				let e = t.value.trim().replace(ao, "");
				if (!oo.test(e)) return;
				switch (t.operand) {
					case l.CONTAINS: return { or: [
						{ [i.name]: { primaryPhoneNumber: { ilike: `%${e}%` } } },
						{ [i.name]: { primaryPhoneCallingCode: { ilike: `%${e}%` } } },
						{ [i.name]: { additionalPhones: { like: `%${e}%` } } }
					] };
					case l.DOES_NOT_CONTAIN: return { and: [
						{ not: { [i.name]: { primaryPhoneNumber: { ilike: `%${e}%` } } } },
						{ not: { [i.name]: { primaryPhoneCallingCode: { ilike: `%${e}%` } } } },
						{ or: [{ not: { [i.name]: { additionalPhones: { like: `%${e}%` } } } }, { [i.name]: { additionalPhones: { is: "NULL" } } }] }
					] };
					default: throw Error(`Unknown operand ${t.operand} for ${c} filter`);
				}
			}
			let e = t.value;
			switch (o) {
				case "additionalPhones": switch (t.operand) {
					case l.CONTAINS: return { or: [{ [i.name]: { additionalPhones: { like: `%${e}%` } } }] };
					case l.DOES_NOT_CONTAIN: return { or: [{ not: { [i.name]: { additionalPhones: { like: `%${e}%` } } } }, { [i.name]: { additionalPhones: { is: "NULL" } } }] };
					default: throw Error(`Unknown operand ${t.operand} for ${c} filter`);
				}
				case "primaryPhoneNumber": switch (t.operand) {
					case l.CONTAINS: return { [i.name]: { primaryPhoneNumber: { ilike: `%${e}%` } } };
					case l.DOES_NOT_CONTAIN: return { not: { [i.name]: { primaryPhoneNumber: { ilike: `%${e}%` } } } };
					default: throw Error(`Unknown operand ${t.operand} for ${c} filter`);
				}
				case "primaryPhoneCallingCode": switch (t.operand) {
					case l.CONTAINS: return { [i.name]: { primaryPhoneCallingCode: { ilike: `%${e}%` } } };
					case l.DOES_NOT_CONTAIN: return { not: { [i.name]: { primaryPhoneCallingCode: { ilike: `%${e}%` } } } };
					default: throw Error(`Unknown operand ${t.operand} for ${c} filter`);
				}
				default: throw Error(`Unknown subfield ${o} for ${c} filter`);
			}
		}
		case "BOOLEAN": return { [i.name]: { eq: so.parse(t.value) } };
		case "UUID": {
			let n = Pa.parse(t.value), r = e(n) && n.length > 0 ? n : ["00000000-0000-4000-8000-000000000000"];
			switch (t.operand) {
				case l.IS: return { [i.name]: { in: r } };
				case l.IS_NOT: return { not: { [i.name]: { in: r } } };
				default: throw Error(`Unknown operand ${t.operand} for ${c} filter`);
			}
		}
		default: throw Error("Unknown filter type");
	}
}, mo = ({ filterValueDependencies: t, filters: n, fieldMetadataItemById: r, recordFilterGroups: i, currentRecordFilterGroupId: a }) => {
	let o = i.find((e) => e.id === a);
	if (!e(o)) return;
	let s = n.filter((e) => e.recordFilterGroupId === a).map((e) => uo({
		filterValueDependencies: t,
		recordFilter: e,
		fieldMetadataItemById: r
	})).filter(e), c = i.filter((e) => e.parentRecordFilterGroupId === a).map((e) => mo({
		filterValueDependencies: t,
		filters: n,
		fieldMetadataItemById: r,
		recordFilterGroups: i,
		currentRecordFilterGroupId: e.id
	})).filter(e);
	if (o.logicalOperator === u.AND) return { and: [...s, ...c] };
	if (o.logicalOperator === u.OR) return { or: [...s, ...c] };
	throw Error(`Unknown logical operator ${o.logicalOperator}`);
}, ho = ({ fieldMetadataItems: t, recordFilters: n, recordFilterGroups: r, filterValueDependencies: i }) => {
	let a = new Map(t.map((e) => [e.id, e])), o = n.filter((t) => !e(t.recordFilterGroupId)).map((e) => uo({
		recordFilter: e,
		fieldMetadataItemById: a,
		filterValueDependencies: i
	})).filter(e), s = r.find((e) => !e.parentRecordFilterGroupId)?.id, c = mo({
		filterValueDependencies: i,
		filters: n,
		fieldMetadataItemById: a,
		recordFilterGroups: r,
		currentRecordFilterGroupId: s
	}), l = [...o, c].filter(e);
	return l.length === 0 ? {} : l.length === 1 ? l[0] : { and: l };
}, go = (e, t, n) => {
	switch (n) {
		case "SECOND": return Jt(e, t);
		case "MINUTE": return qt(e, t);
		case "HOUR": return Vt(e, t);
		case "DAY": return Rt(e, t);
		case "WEEK": return Yt(e, t);
		case "MONTH": return zt(e, t);
		case "QUARTER": return zt(e, t * 3);
		case "YEAR": return Xt(e, t);
	}
}, _o = (e, t, n) => {
	switch (t) {
		case "DAY": return e.add({ days: n });
		case "WEEK": return e.add({ weeks: n });
		case "QUARTER": return e.add({ months: n * 3 });
		case "MONTH": return e.add({ months: n });
		case "YEAR": return e.add({ years: n });
		case "SECOND": return e.add({ seconds: n });
		case "MINUTE": return e.add({ minutes: n });
		case "HOUR": return e.add({ hours: n });
		default: return v(t);
	}
}, vo = (e, t) => {
	switch (e) {
		case d.MONDAY: return o.MONDAY;
		case d.SATURDAY: return o.SATURDAY;
		case d.SUNDAY: return o.SUNDAY;
		case d.SYSTEM: return t;
		default: return v(e);
	}
}, yo = (e) => {
	switch (e) {
		case o.MONDAY: return d.MONDAY;
		case o.SATURDAY: return d.SATURDAY;
		case o.SUNDAY: return d.SUNDAY;
	}
}, bo = (e) => {
	switch (e) {
		case o.MONDAY: return 1;
		case o.SATURDAY: return 6;
		case o.SUNDAY: return 0;
		default: return v(e);
	}
}, xo = (e) => {
	switch (e) {
		case o.MONDAY: return 1;
		case o.SATURDAY: return 6;
		case o.SUNDAY: return 7;
		default: return v(e);
	}
}, X = (t, n, r) => {
	switch (n) {
		case "DAY": return t.startOfDay();
		case "WEEK": {
			let n = e(r) ? xo(r) : 1, i = (t.dayOfWeek - n + 7) % 7;
			return t.startOfDay().subtract({ days: i });
		}
		case "QUARTER": {
			let e = Math.floor((t.month - 1) / 3);
			return t.startOfDay().with({
				day: 1,
				month: e * 3 + 1
			});
		}
		case "MONTH": return t.startOfDay().with({ day: 1 });
		case "YEAR": return t.startOfDay().with({
			day: 1,
			month: 1
		});
		case "SECOND": return t.with({
			nanosecond: 0,
			microsecond: 0,
			millisecond: 0
		});
		case "MINUTE": return t.with({
			second: 0,
			nanosecond: 0,
			microsecond: 0,
			millisecond: 0
		});
		case "HOUR": return t.with({
			minute: 0,
			second: 0,
			nanosecond: 0,
			microsecond: 0,
			millisecond: 0
		});
		default: return v(n);
	}
}, So = 1, Z = (e, t, n) => {
	switch (t) {
		case "DAY": return X(e, "DAY").add({ days: 1 });
		case "WEEK": return X(e, "WEEK", n).add({ weeks: 1 });
		case "MONTH": return X(e, "MONTH", n).add({ months: 1 });
		case "QUARTER": return X(e, "QUARTER", n).add({ months: 3 });
		case "YEAR": return X(e, "YEAR", n).add({ years: 1 });
		case "SECOND": return X(e, "SECOND").add({ seconds: 1 });
		case "MINUTE": return X(e, "MINUTE").add({ minutes: 1 });
		case "HOUR": return X(e, "HOUR").add({ hours: 1 });
		default: return v(t);
	}
}, Co = [
	"SECOND",
	"MINUTE",
	"HOUR"
], wo = (e) => Co.includes(e), To = (e, t, n) => {
	switch (t) {
		case "DAY": return e.subtract({ days: n });
		case "WEEK": return e.subtract({ weeks: n });
		case "QUARTER": return e.subtract({ months: n * 3 });
		case "MONTH": return e.subtract({ months: n });
		case "YEAR": return e.subtract({ years: n });
		case "SECOND": return e.subtract({ seconds: n });
		case "MINUTE": return e.subtract({ minutes: n });
		case "HOUR": return e.subtract({ hours: n });
		default: return v(t);
	}
}, Eo = (t, n) => {
	let { direction: r, amount: i, unit: a, firstDayOfTheWeek: o } = t;
	switch (r) {
		case "NEXT": {
			if (!e(i)) throw Error("Amount is required");
			let r = Z(n, a, o), s = _o(r, a, i);
			return {
				...t,
				start: r.toPlainDate().toString(),
				end: s.toPlainDate().toString()
			};
		}
		case "PAST": {
			if (!e(i)) throw Error("Amount is required");
			let r = X(n, a, o), s = To(r, a, i);
			return {
				...t,
				start: s.toPlainDate().toString(),
				end: r.toPlainDate().toString()
			};
		}
		case "THIS": {
			let e = X(n, a, o), r = Z(n, a, o), i = e?.toPlainDate().toString(), s = r?.toPlainDate().toString();
			return {
				...t,
				start: i,
				end: s
			};
		}
	}
}, Do = (t) => {
	if (!p(t)) return null;
	let n = q.safeParse(t);
	if (!n.success) return null;
	let r = n.data;
	return Eo(r, e(r.timezone) ? _.Now.zonedDateTimeISO(r.timezone) : _.Now.zonedDateTimeISO());
}, Oo = (e) => e.value ? e.operand === l.IS_RELATIVE ? Do(e.value) : e.value : null, ko = (t, n) => {
	let { direction: r, amount: i, unit: a, firstDayOfTheWeek: o } = t;
	switch (r) {
		case "NEXT": {
			if (!e(i)) throw Error("Amount is required");
			let r = Z(n, a, o);
			return {
				...t,
				start: r,
				end: _o(r, a, i)
			};
		}
		case "PAST": {
			if (!e(i)) throw Error("Amount is required");
			let r = X(n, a, o);
			return {
				...t,
				start: To(r, a, i),
				end: r
			};
		}
		case "THIS": return {
			...t,
			start: X(n, a, o),
			end: Z(n, a, o)
		};
	}
}, Ao = (t) => {
	if (!p(t)) return null;
	let n = q.safeParse(t);
	if (n.success) {
		let t = n.data;
		return ko(t, (e(t.timezone) ? _.Now.zonedDateTimeISO(t.timezone) : _.Now.zonedDateTimeISO()).round({ smallestUnit: "second" }));
	} else return null;
}, jo = (e) => e.value ? e.operand === l.IS_RELATIVE ? Ao(e.value) : e.value : null, Mo = (e, t, n) => {
	switch (n) {
		case "SECOND": return ri(e, t);
		case "MINUTE": return ni(e, t);
		case "HOUR": return ti(e, t);
		case "DAY": return Pr(e, t);
		case "WEEK": return ii(e, t);
		case "MONTH": return ei(e, t);
		case "QUARTER": return ei(e, t * 3);
		case "YEAR": return ai(e, t);
	}
}, No = {
	[s.Is]: l.IS,
	[s.IsNotNull]: l.IS_NOT_NULL,
	[s.IsNot]: l.IS_NOT,
	[s.LessThanOrEqual]: l.LESS_THAN_OR_EQUAL,
	[s.GreaterThanOrEqual]: l.GREATER_THAN_OR_EQUAL,
	[s.IsBefore]: l.IS_BEFORE,
	[s.IsAfter]: l.IS_AFTER,
	[s.Contains]: l.CONTAINS,
	[s.DoesNotContain]: l.DOES_NOT_CONTAIN,
	[s.IsEmpty]: l.IS_EMPTY,
	[s.IsNotEmpty]: l.IS_NOT_EMPTY,
	[s.IsRelative]: l.IS_RELATIVE,
	[s.IsInPast]: l.IS_IN_PAST,
	[s.IsInFuture]: l.IS_IN_FUTURE,
	[s.IsToday]: l.IS_TODAY,
	[l.IS]: l.IS,
	[l.IS_NOT_NULL]: l.IS_NOT_NULL,
	[l.IS_NOT]: l.IS_NOT,
	[l.LESS_THAN_OR_EQUAL]: l.LESS_THAN_OR_EQUAL,
	[l.GREATER_THAN_OR_EQUAL]: l.GREATER_THAN_OR_EQUAL,
	[l.IS_BEFORE]: l.IS_BEFORE,
	[l.IS_AFTER]: l.IS_AFTER,
	[l.CONTAINS]: l.CONTAINS,
	[l.DOES_NOT_CONTAIN]: l.DOES_NOT_CONTAIN,
	[l.IS_EMPTY]: l.IS_EMPTY,
	[l.IS_NOT_EMPTY]: l.IS_NOT_EMPTY,
	[l.IS_RELATIVE]: l.IS_RELATIVE,
	[l.IS_IN_PAST]: l.IS_IN_PAST,
	[l.IS_IN_FUTURE]: l.IS_IN_FUTURE,
	[l.IS_TODAY]: l.IS_TODAY,
	[l.VECTOR_SEARCH]: l.VECTOR_SEARCH
}, Po = (e) => No[e], Fo = ({ fieldMetadataItem: e, filterValue: t }) => ({ foundCorrespondingSelectOptions: e.options?.filter((e) => e.value.toLocaleLowerCase().includes(t.toLocaleLowerCase()) || e.label.toLocaleLowerCase().includes(t.toLocaleLowerCase())) }), Io = (e) => {
	let t = e < 0 ? "-" : "", n = Math.abs(e), r = (e, n) => t + e.toFixed(1).replace(/\.?0+$/, "") + n;
	return Number(n.toFixed(1)) < 1e3 ? r(n, "") : Number((n / 1e3).toFixed(1)) < 1e3 ? r(n / 1e3, "k") : Number((n / 1e6).toFixed(1)) < 1e3 ? r(n / 1e6, "m") : r(n / 1e9, "b");
}, Lo = ({ array: t, uniqueKey: n }) => t.reduce((t, r) => {
	let i = r[n];
	if (e(t[i])) throw Error(`Should never occur, flat array contains twice the same unique key ${r[n]}`);
	return {
		...t,
		[i]: r
	};
}, {}), Ro = ({ array: t, key: n }) => t.reduce((t, r) => {
	let i = r[n], a = t[i];
	return e(a) ? {
		...t,
		[i]: [...a, r]
	} : {
		...t,
		[i]: [r]
	};
}, {}), zo = (e) => {
	try {
		return new URL(e);
	} catch {
		return null;
	}
}, Bo = (e) => R(e), Vo = (e) => `${R(e)}Connection`, Ho = (e) => `${R(e)}Edge`, Uo = (e) => `${R(e)}GroupByConnection`, Wo = ({ imageUrl: e, baseUrl: t }) => {
	let n = e.toLowerCase();
	return [
		"http:",
		"https:",
		"data:",
		"blob:"
	].some((e) => n.startsWith(e)) || e.startsWith("//") ? e : e.startsWith("/") ? new URL(`/files${e}`, t).toString() : new URL(`/files/${e}`, t).toString();
}, Go = (e) => e ? e.replace(/(https?:\/\/)|(www\.)/g, "").replace(/\/$/, "") : "", Ko = (e) => {
	let t = Go(e);
	return t ? `https://twenty-icons.com/${t}` : void 0;
}, qo = (e) => {
	let t = (e ?? "").trim();
	if (!t) return;
	let n = t.startsWith("http://") || t.startsWith("https://") ? t : `https://${t}`;
	try {
		let e = new URL(n).hostname;
		return Ko(e);
	} catch {
		return;
	}
}, Jo = (t) => {
	let n = t.indexMetadatas.filter((e) => e.isUnique), r = new Map(t.fields.map((e) => [e.id, e])), i = t.fields.find((e) => e.name === "id");
	if (!e(i)) throw Error(`Primary key constraint field not found for object metadata ${t.id}`);
	let a = n.map((t) => t.indexFieldMetadatas.map((n) => {
		let i = r.get(n.fieldMetadataId);
		if (!e(i)) throw Error(`Index field not found for field id ${n.fieldMetadataId} in index metadata ${t.id}`);
		return i;
	}));
	return [[i], ...a];
}, Yo = (e) => e === "default-fast-model" || e === "default-smart-model", Xo = (e) => e === f, Zo = (t, n, r) => {
	let i = t;
	if (e(n) && (i = Ce(t, n)), e(r)) {
		let t = Object.fromEntries(Object.entries(r).filter(([t, n]) => e(n))), n = Se.stringify(t);
		n !== "" && (i += `?${n}`);
	}
	return i;
}, Qo = (t, n, r, a) => {
	let o = `/${i.Settings}/${t}`;
	if (e(n) && (o = Ce(`/${i.Settings}/${t}`, n)), e(r)) {
		let t = Object.fromEntries(Object.entries(r).filter(([t, n]) => e(n))), n = Se.stringify(t);
		n !== "" && (o += `?${n}`);
	}
	return e(a) && (o += `#${a.replace(/^#/, "")}`), o;
}, $o = (t) => {
	try {
		return !e(t) || t === "" ? null : JSON.parse("[" + t + "]")[0];
	} catch {
		return null;
	}
}, es = (e, t) => {
	let n = { ...e };
	for (let e of t) delete n[e];
	return n;
}, ts = (e) => e === void 0 || typeof e != "object" || !e ? e : Array.isArray(e) ? e.map((e) => ts(e)).filter((e) => !he(e)) : Object.entries(e).reduce((e, [t, n]) => {
	if (he(n)) return e;
	if (n === null || n instanceof Date) return {
		...e,
		[t]: n
	};
	if (typeof n == "object") {
		let r = ts(n);
		return !he(r) && Object.keys(r).length > 0 ? {
			...e,
			[t]: r
		} : e;
	}
	return {
		...e,
		[t]: n
	};
}, {}), ns = /\{"type":"variableTag","attrs":\{"variable":"(\{\{[^{}]+\}\})"\}\}|\{"attrs":\{"variable":"(\{\{[^{}]+\}\})"\},"type":"variableTag"\}/g, rs = (e) => JSON.stringify(e).slice(1, -1), is = (e) => {
	let t = e.split("\n");
	return t.length === 1 ? `{"type":"text","text":"${rs(e)}"}` : t.map((e, n) => {
		let r = `{"type":"text","text":"${rs(e)}"}`;
		return n < t.length - 1 ? `${r},{"type":"hardBreak"}` : r;
	}).join(",");
}, as = (t, n) => {
	if (e(t)) return t.replace(ns, (t, r, i) => {
		let a = yi(r ?? i, n);
		return is(e(a) ? typeof a == "object" ? JSON.stringify(a) : String(a) : "");
	});
}, os = (e) => {
	try {
		let t = JSON.parse(e), n = Ja.safeParse(t);
		return n.success ? n.data : void 0;
	} catch {
		return;
	}
}, ss = (e) => e?.match(/^[A-Z][a-z]*/)?.[0], cs = (e) => e.split("_").map((e) => e.charAt(0)?.toUpperCase() + e.slice(1)?.toLowerCase()).join(" "), ls = (e) => e.replace(/([A-Z])/g, (e) => `-${e.toLowerCase()}`), us = (e) => e.replace(/[A-Z]/g, (e) => `_${e.toLowerCase()}`), ds = (e) => {
	try {
		if (e === void 0) return "undefined";
		if (e === null) return "null";
		if (e === Infinity) return "Infinity";
		if (e === -Infinity) return "-Infinity";
		if (typeof e == "number" && isNaN(e)) return "NaN";
		let t = JSON.stringify(e);
		return t === void 0 ? String(e) : t;
	} catch {
		return String(e);
	}
}, fs = (e) => e.charAt(0).toLowerCase() + e.slice(1), ps = 1, ms = 30, hs = (t) => {
	if (!e(t)) return;
	let n = we(t, {
		trim: !0,
		separator: "-",
		allowedChars: "a-zA-Z0-9"
	}).slice(0, ms).replace(/-+$/g, "");
	return n.length >= ps ? n : void 0;
}, gs = {
	pageBackground: "#ffffff",
	pagePadding: "24px",
	textAlign: "left",
	bodyBackground: "",
	textColor: "#18181b",
	width: "600px",
	padding: "24px",
	cornerRadius: "0px",
	borderWidth: "0px",
	borderColor: ""
}, Q = {
	BOLD: "bold",
	ITALIC: "italic",
	UNDERLINE: "underline",
	STRIKE: "strike",
	LINK: "link"
}, _s = {
	[Q.BOLD]: { stringAttributes: {} },
	[Q.ITALIC]: { stringAttributes: {} },
	[Q.UNDERLINE]: { stringAttributes: {} },
	[Q.STRIKE]: { stringAttributes: {} },
	[Q.LINK]: { stringAttributes: { href: "url" } }
}, vs = (e) => Object.prototype.hasOwnProperty.call(_s, e), $ = {
	DOCUMENT: "doc",
	PARAGRAPH: "paragraph",
	TEXT: "text",
	HEADING: "heading",
	VARIABLE_TAG: "variableTag",
	MENTION_TAG: "mentionTag",
	IMAGE: "image",
	BULLET_LIST: "bulletList",
	ORDERED_LIST: "orderedList",
	LIST_ITEM: "listItem",
	HARD_BREAK: "hardBreak",
	SECTION: "section",
	COLUMNS: "columns",
	COLUMN: "column",
	BUTTON: "button",
	DIVIDER: "divider",
	HTML: "html"
}, ys = {
	[$.DOCUMENT]: {
		renderMode: "children",
		stringAttributes: {}
	},
	[$.PARAGRAPH]: {
		renderMode: "node",
		stringAttributes: {}
	},
	[$.TEXT]: {
		renderMode: "node",
		stringAttributes: {}
	},
	[$.HEADING]: {
		renderMode: "node",
		stringAttributes: {}
	},
	[$.VARIABLE_TAG]: {
		renderMode: "node",
		stringAttributes: { variable: "text" }
	},
	[$.IMAGE]: {
		renderMode: "node",
		stringAttributes: {
			src: "url",
			href: "url",
			alt: "text",
			title: "text"
		}
	},
	[$.BULLET_LIST]: {
		renderMode: "node",
		stringAttributes: {}
	},
	[$.ORDERED_LIST]: {
		renderMode: "node",
		stringAttributes: {}
	},
	[$.LIST_ITEM]: {
		renderMode: "node",
		stringAttributes: {}
	},
	[$.HARD_BREAK]: {
		renderMode: "node",
		stringAttributes: {}
	},
	[$.SECTION]: {
		renderMode: "node",
		stringAttributes: {}
	},
	[$.COLUMNS]: {
		renderMode: "node",
		stringAttributes: {}
	},
	[$.COLUMN]: {
		renderMode: "parent",
		stringAttributes: {}
	},
	[$.BUTTON]: {
		renderMode: "node",
		stringAttributes: { href: "url" }
	},
	[$.DIVIDER]: {
		renderMode: "node",
		stringAttributes: {}
	},
	[$.HTML]: {
		renderMode: "node",
		stringAttributes: { html: "html" }
	}
}, bs = (e) => Object.prototype.hasOwnProperty.call(ys, e), xs = (e) => bs(e) && ys[e].renderMode === "node", Ss = 1, Cs = 1, ws = g.record(g.string().regex(/^[a-zA-Z]+$/).max(40), g.string().max(400)).optional(), Ts = g.discriminatedUnion("type", [
	g.looseObject({ type: g.literal(Q.BOLD) }),
	g.looseObject({ type: g.literal(Q.ITALIC) }),
	g.looseObject({ type: g.literal(Q.UNDERLINE) }),
	g.looseObject({ type: g.literal(Q.STRIKE) }),
	g.looseObject({
		type: g.literal(Q.LINK),
		attrs: g.looseObject({ href: g.string().max(4e3) }).optional()
	})
]), Es = g.looseObject({
	type: g.literal($.TEXT),
	text: g.string().min(1),
	marks: g.array(Ts).optional()
}), Ds = g.looseObject({
	type: g.literal($.VARIABLE_TAG),
	attrs: g.looseObject({ variable: g.string().nullable() })
}), Os = g.looseObject({ type: g.literal($.HARD_BREAK) }), ks = g.discriminatedUnion("type", [
	Es,
	Ds,
	Os
]), As = g.array(g.lazy(() => Us)), js = g.looseObject({
	type: g.literal($.PARAGRAPH),
	attrs: g.looseObject({}).optional(),
	content: g.array(ks).optional()
}), Ms = g.looseObject({
	type: g.literal($.HEADING),
	attrs: g.looseObject({ level: g.union([
		g.literal(1),
		g.literal(2),
		g.literal(3)
	]) }),
	content: g.array(ks).optional()
}), Ns = g.looseObject({
	type: g.literal($.LIST_ITEM),
	attrs: g.looseObject({}).optional(),
	content: As.min(1)
}), Ps = g.looseObject({
	type: g.literal($.BULLET_LIST),
	attrs: g.looseObject({}).optional(),
	content: g.array(Ns).min(1)
}), Fs = g.looseObject({
	type: g.literal($.ORDERED_LIST),
	attrs: g.looseObject({}).optional(),
	content: g.array(Ns).min(1)
}), Is = g.looseObject({
	type: g.literal($.IMAGE),
	attrs: g.looseObject({
		fileId: g.uuid().nullable().optional(),
		src: g.string().max(4e3),
		alt: g.string().nullable().optional(),
		title: g.string().nullable().optional(),
		align: g.string().nullable().optional(),
		width: g.union([g.string(), g.number()]).nullable().optional(),
		href: g.string().max(4e3).nullable().optional()
	})
}), Ls = g.looseObject({
	type: g.literal($.SECTION),
	attrs: g.looseObject({ style: ws }),
	content: As.min(1)
}), Rs = g.looseObject({
	type: g.literal($.COLUMN),
	attrs: g.looseObject({ style: ws }),
	content: As.min(1)
}), zs = g.looseObject({
	type: g.literal($.COLUMNS),
	attrs: g.looseObject({ style: ws }),
	content: g.array(Rs).min(2).max(4)
}), Bs = g.looseObject({
	type: g.literal($.BUTTON),
	attrs: g.looseObject({
		href: g.string().max(4e3).nullable(),
		style: ws
	}),
	content: g.array(g.looseObject({
		type: g.literal($.TEXT),
		text: g.string().min(1)
	})).optional()
}), Vs = g.looseObject({
	type: g.literal($.DIVIDER),
	attrs: g.looseObject({ style: ws })
}), Hs = g.looseObject({
	type: g.literal($.HTML),
	attrs: g.looseObject({ html: g.string().max(1e5) })
}), Us = g.discriminatedUnion("type", [
	js,
	Ms,
	Ps,
	Fs,
	Is,
	Ls,
	zs,
	Bs,
	Vs,
	Hs
]), Ws = g.looseObject({
	pageBackground: g.string().optional(),
	pagePadding: g.string().optional(),
	textAlign: g.enum([
		"left",
		"center",
		"right"
	]).optional(),
	bodyBackground: g.string().optional(),
	textColor: g.string().optional(),
	width: g.string().optional(),
	padding: g.string().optional(),
	cornerRadius: g.string().optional(),
	borderWidth: g.string().optional(),
	borderColor: g.string().optional()
}), Gs = g.looseObject({
	type: g.literal($.DOCUMENT),
	attrs: g.looseObject({
		schemaVersion: g.int().min(1).max(Cs).optional(),
		canvasTheme: Ws.nullable().optional()
	}).optional(),
	content: As.optional()
}), Ks = (e) => typeof e == "object" && !!e && !Array.isArray(e), qs = (e) => typeof e == "object" && !!e && "type" in e && e.type === "doc", Js = [
	r.TEXT,
	r.NUMBER,
	r.BOOLEAN,
	r.DATE,
	r.DATE_TIME,
	r.SELECT,
	r.RATING
], Ys = { [r.FULL_NAME]: [{
	subFieldName: "firstName",
	subFieldLabel: "First name"
}, {
	subFieldName: "lastName",
	subFieldLabel: "Last name"
}] }, Xs = (e) => {
	let t = [];
	for (let n of e) {
		if (n.isSystem === !0 || n.isActive === !1) continue;
		if (Js.includes(n.type)) {
			t.push({
				name: n.name,
				label: n.label,
				fieldName: n.name,
				fieldType: n.type
			});
			continue;
		}
		let e = Ys[n.type];
		if (e) for (let { subFieldName: r, subFieldLabel: i } of e) t.push({
			name: `${n.name}.${r}`,
			label: e.length === 1 ? n.label : `${n.label} · ${i}`,
			fieldName: n.name,
			fieldType: n.type,
			subFieldName: r
		});
	}
	return t;
}, Zs = (e) => {
	let t = Gs.safeParse(e);
	return t.success ? {
		success: !0,
		document: t.data
	} : {
		success: !1,
		error: t.error.issues.slice(0, 10).map((e) => `${e.path.join(".")}: ${e.message}`).join("; ")
	};
}, Qs = (e) => {
	let t = Zs(e);
	return t.success ? t.document.attrs?.schemaVersion === Cs ? t : {
		success: !1,
		error: `attrs.schemaVersion: Expected ${Cs}`
	} : t;
}, $s = (e) => typeof e == "object" && !!e && !Array.isArray(e), ec = (e) => $s(e) ? typeof e.type == "string" && (e.attrs === void 0 || $s(e.attrs)) : !1, tc = (e) => $s(e) ? typeof e.type == "string" && (e.attrs === void 0 || $s(e.attrs)) && (e.text === void 0 || typeof e.text == "string") && (e.content === void 0 || Array.isArray(e.content) && e.content.every(tc)) && (e.marks === void 0 || Array.isArray(e.marks) && e.marks.every(ec)) : !1, nc = (e) => tc(e) && e.type === $.DOCUMENT, rc = (e) => {
	try {
		let t = JSON.parse(e);
		return nc(t) ? t : void 0;
	} catch {
		return;
	}
}, ic = (e) => {
	let t = rc(e);
	return t?.attrs?.schemaVersion === 1 ? t : void 0;
}, ac = (e) => Ks(e) ? {
	...gs,
	...e
} : null, oc = [
	Q.UNDERLINE,
	Q.BOLD,
	Q.ITALIC,
	Q.STRIKE,
	Q.LINK
], sc = (e) => (e.content ?? []).map(mc).join(""), cc = (e) => e.replace(/([\\`*_[\]{}<>~|#&])/g, "\\$1").replace(/^(\s{0,3})>(?=\s|$)/gm, "$1\\>").replace(/^(\s{0,3})-(?=-{2}|\s|$)/gm, "$1\\-").replace(/^(\s{0,3})\+(?=\s|$)/gm, "$1\\+").replace(/^(\s{0,3}\d+)([.)])(?=\s|$)/gm, "$1\\$2"), lc = {
	"\\": "%5C",
	"(": "%28",
	")": "%29",
	"<": "%3C",
	">": "%3E"
}, uc = (e) => e.replace(/[\\()<>\s]/g, (e) => e in lc ? lc[e] : encodeURIComponent(e)), dc = (e, t) => {
	switch (t.type) {
		case Q.BOLD: return `**${e}**`;
		case Q.ITALIC: return `_${e}_`;
		case Q.UNDERLINE: return `<u>${e}</u>`;
		case Q.STRIKE: return `~~${e}~~`;
		case Q.LINK: {
			let n = t.attrs?.href;
			return typeof n == "string" ? `[${e}](${uc(n)})` : e;
		}
		default: return e;
	}
}, fc = (e) => {
	let n = e.attrs?.objectNameSingular, r = e.attrs?.recordId, i = e.attrs?.label;
	return typeof n == "string" && typeof r == "string" ? t({
		objectNameSingular: n,
		recordId: r,
		displayName: typeof i == "string" ? i : ""
	}) : typeof i == "string" ? `@${i}` : "";
}, pc = (e, t) => {
	let [n = "", ...r] = sc(e).trim().split("\n"), i = " ".repeat(t.length), a = r.map((e) => e === "" ? "" : `${i}${e}`).join("\n");
	return `${t}${n}${a === "" ? "" : `\n${a}`}\n`;
}, mc = (e) => {
	switch (e.type) {
		case $.TEXT: return [...e.marks ?? []].sort((e, t) => oc.indexOf(e.type) - oc.indexOf(t.type)).reduce((e, t) => dc(e, t), cc(e.text ?? ""));
		case $.HARD_BREAK: return "\n";
		case $.VARIABLE_TAG: return typeof e.attrs?.variable == "string" ? e.attrs.variable : "";
		case $.MENTION_TAG: return fc(e);
		case $.HEADING: {
			let t = typeof e.attrs?.level == "number" ? e.attrs.level : 1;
			return `${"#".repeat(Math.min(Math.max(t, 1), 6))} ${sc(e)}\n\n`;
		}
		case $.PARAGRAPH: return `${sc(e)}\n\n`;
		case $.BULLET_LIST: return `${(e.content ?? []).map((e) => pc(e, "- ")).join("")}\n`;
		case $.ORDERED_LIST: {
			let t = typeof e.attrs?.start == "number" ? e.attrs.start : 1;
			return `${(e.content ?? []).map((e, n) => pc(e, `${t + n}. `)).join("")}\n`;
		}
		case $.IMAGE: {
			let t = typeof e.attrs?.alt == "string" ? e.attrs.alt : "", n = typeof e.attrs?.src == "string" ? e.attrs.src : "";
			return n === "" ? cc(t) : `![${cc(t)}](${uc(n)})\n\n`;
		}
		case $.BUTTON: {
			let t = sc(e), n = e.attrs?.href;
			return `${typeof n == "string" ? `[${t}](${uc(n)})` : t}\n\n`;
		}
		case $.HTML: return typeof e.attrs?.html == "string" ? e.attrs.html : "";
		case $.DIVIDER: return "---\n\n";
		default: return sc(e);
	}
}, hc = (e) => {
	let t = typeof e == "string" ? rc(e) : e;
	return t === void 0 ? typeof e == "string" ? e : "" : mc(t).trim();
}, gc = (t, n, r) => e(t) ? Object.entries(n).reduce((t, [n, i]) => {
	let a = t[n];
	return typeof a == "string" && e(i) ? {
		...t,
		[n]: r(a, i)
	} : t;
}, t) : t, _c = (e, t) => {
	let n = bs(e.type) ? ys[e.type] : void 0, r = gc(e.attrs, n?.stringAttributes ?? {}, t), i = e.marks?.map((e) => typeof e != "object" || !e || !("type" in e) || typeof e.type != "string" || !vs(e.type) ? e : {
		...e,
		..."attrs" in e && typeof e.attrs == "object" && e.attrs !== null && { attrs: gc(e.attrs, _s[e.type].stringAttributes, t) }
	});
	return {
		...e,
		...typeof e.text == "string" && { text: t(e.text, "text") },
		...r && { attrs: r },
		...i && { marks: i },
		...e.content && { content: e.content.map((e) => _c(e, t)) }
	};
}, vc = (e, t, n) => t.reduce((t, n) => {
	let r = e[n];
	return r === void 0 || typeof r != "string" || r === null ? t : {
		...t,
		[n]: xi(r)
	};
}, n ? {} : e), yc = (e) => Object.entries(e), bc = (e) => "metadataName" in e, xc = (e) => typeof e == "object" && !!e && !Array.isArray(e), Sc = (e) => "objectNameSingular" in e, Cc = (e, t) => {
	if (e == null) throw Error(`Value must be defined for variable ${t}, this should not happen`);
}, wc = /^\d+$/, Tc = (e) => e.endsWith("FastInstanceCommand") ? "(instance fast)" : e.endsWith("SlowInstanceCommand") ? "(instance slow)" : "(workspace)", Ec = (e) => e.replace(/FastInstanceCommand$/, "").replace(/SlowInstanceCommand$/, "").replace(/Command$/, ""), Dc = (e) => {
	let t = e.split("_");
	if (t.length < 3) return e;
	let n = t[0], r = t[t.length - 1], i = wc.test(r), a = t.slice(1, -1).join("_"), o = Ec(a), s = Tc(a);
	return i ? `${o} ${r} (${n}) ${s}` : `${o} (${n}) ${s}`;
}, Oc = (e) => {
	let t = e.trim();
	return t.startsWith("http://") || t.startsWith("https://") || t.startsWith("HTTPS://") || t.startsWith("HTTP://") ? t : `https://${t}`;
}, kc = (e, t) => {
	let n = t?.allowIp ?? !0, r = t?.allowLocalhost ?? !0, i = /^(((?!-))(xn--|_)?[a-z0-9-]{0,61}[a-z0-9]{1,1}\.){1,10}(xn--)?([a-z0-9][a-z0-9-]{0,60}|[a-z0-9-]{1,30}\.[a-z]{2,})$/.test(e), a = /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(e), o = e === "localhost" || e === "127.0.0.1";
	return o && !r || a && !n ? !1 : i || o || a;
}, Ac = g.string().transform((e, t) => {
	let n = Oc(e.trim()), r = n.replace("https://", "").replace("http://", "").replace("HTTPS://", "").replace("HTTP://", "");
	if (/^\d+(?:\/[a-zA-Z]*)?$/.test(r)) return t.addIssue({
		code: "custom",
		message: "domain is not a valid url"
	}), g.NEVER;
	try {
		return kc(new URL(n).hostname) ? n : (t.addIssue({
			code: "custom",
			message: "domain is not a valid url"
		}), g.NEVER);
	} catch {
		return t.addIssue({
			code: "custom",
			message: "domain is not a valid url"
		}), g.NEVER;
	}
}), jc = ({ path: e, token: t }) => {
	if (e.startsWith("https:") || e.startsWith("http:")) return e;
	let n = e.split("/"), r = n.pop();
	if (!p(r)) throw Error(`Filename empty: cannot build signed path from folderPath '${e}'`);
	return `${n.join("/")}/${t}/${r}`;
}, Mc = (e) => {
	try {
		return Ac.parse(e);
	} catch {
		throw Error("Invalid URL");
	}
}, Nc = /^[a-z][a-z0-9+.-]*:\/\//i, Pc = /[/\\?#]/, Fc = /^.*@/, Ic = /:\d+$/, Lc = (e) => {
	let t = e.split(".");
	for (; t.length > 0 && t[t.length - 1] === "";) t.pop();
	for (; t[0] === "www";) t.shift();
	return t.join(".");
}, Rc = (e) => {
	try {
		return new URL(`https://${e}`).hostname;
	} catch {
		return e;
	}
}, zc = (e) => Rc(Lc(e.trim().replace(Nc, "").split(Pc)[0].replace(Fc, "").replace(Ic, "").toLowerCase())), Bc = (t) => {
	let n = zo(t);
	return e(n) ? (n.origin + n.pathname + n.search + n.hash).replace(/\/$/, "") : t;
}, Vc = (e) => e === "domain" ? zc : Bc, Hc = [
	"http:",
	"https:",
	"mailto:",
	"tel:"
], Uc = (e) => {
	if (e.startsWith("/") && !e.startsWith("//")) return !0;
	try {
		let t = new URL(e);
		return Hc.includes(t.protocol);
	} catch {
		return !1;
	}
}, Wc = (e) => {
	if (!e || e.trim().length === 0) return;
	if (Uc(e)) return e;
	let t = `https://${e}`;
	return Uc(t) ? t : void 0;
}, Gc = (e) => {
	let t = Ac.safeParse(e);
	if (!t.success) throw Error("Invalid URL");
	try {
		return new URL(t.data).hostname;
	} catch {
		throw Error("Invalid URL");
	}
}, Kc = (e) => /^https?:\/\//i.test(e), qc = (e) => kc(zc(e), {
	allowLocalhost: !1,
	allowIp: !1
}), Jc = (e) => Ac.safeParse(e).success, Yc = (e) => {
	let t = e.trim();
	return t === "" ? t : Bc(Oc(t));
}, Xc = (e) => {
	try {
		return decodeURIComponent(e);
	} catch {
		return e;
	}
}, Zc = (e) => {
	let t = e.replace(/-/g, "");
	return BigInt("0x" + t).toString(36);
}, Qc = g.email({ pattern: g.regexes.unicodeEmail }).max(255), $c = (e) => e.replace(/[\\%_]/g, "\\$&"), el = (e) => m(e) && Object.keys(e).length === 0, tl = (e) => ee.includes(e), nl = (e) => re.includes(e), rl = /* @__PURE__ */ new Map();
for (let e of Te()) {
	let t = Ee(e), n = rl.get(t);
	n ? n.push(e) : rl.set(t, [e]);
}
var il = (e) => {
	let t = e.startsWith("+") ? e.slice(1) : e;
	return rl.get(t) ?? [];
}, al = new Set(Te()), ol = (e) => al.has(e), sl = (e) => typeof e == "string", cl = RegExp("\\{\\{([^{}]+)\\}\\}", "g"), ll = (t) => sl(t) && e(t.match(cl)), ul = (t, n) => e(t) ? sl(t) ? pl(t, n) : Array.isArray(t) ? dl(t, n) : typeof t == "object" && t ? fl(t, n) : t : t, dl = (e, t) => {
	let n = e;
	for (let r = 0; r < e.length; ++r) n[r] = ul(e[r], t);
	return n;
}, fl = (e, t) => Object.entries(e).reduce((e, [n, r]) => {
	let i = ul(n, t);
	return e[typeof i == "string" ? i : String(i)] = ul(r, t), e;
}, {}), pl = (e, t) => {
	let n = e.match(cl);
	return !n || n.length === 0 ? e : n.length === 1 && n[0] === e ? yi(e, t) : e.replace(cl, (e, n) => {
		let r = yi(e, t);
		return typeof r == "object" && r ? JSON.stringify(r) : r;
	});
}, ml = {
	[c.TABLE]: c.TABLE,
	[c.KANBAN]: c.KANBAN,
	[c.CALENDAR]: c.CALENDAR,
	[c.LIST]: c.LIST,
	[c.FIELDS_WIDGET]: c.FIELDS_WIDGET,
	[c.TABLE_WIDGET]: c.TABLE,
	[c.KANBAN_WIDGET]: c.KANBAN,
	[c.LIST_WIDGET]: c.LIST,
	[c.CALENDAR_WIDGET]: c.CALENDAR
}, hl = (e) => ml[e], gl = [
	c.FIELDS_WIDGET,
	c.TABLE_WIDGET,
	c.KANBAN_WIDGET,
	c.LIST_WIDGET,
	c.CALENDAR_WIDGET
], _l = (e) => gl.includes(e);
//#endregion
export { xs as $, ra as $n, bt as $r, go as $t, Cc as A, Aa as An, xi as Ar, zo as At, tc as B, xa as Bn, li as Br, Oo as Bt, zc as C, Le as Ci, Fa as Cn, ki as Cr, Ko as Ct, kc as D, ke as Di, Na as Dn, Ei as Dr, Ho as Dt, Ac as E, je as Ei, U as En, R as Er, Vo as Et, vc as F, H as Fn, hi as Fr, Po as Ft, Xs as G, pa as Gn, Ot as Gr, So as Gt, rc as H, _a as Hn, oi as Hr, Eo as Ht, _c as I, Ta as In, pi as Ir, Mo as It, Gs as J, ca as Jn, Tt as Jr, xo as Jt, qs as K, da as Kn, Dt as Kr, Z as Kt, hc as L, wa as Ln, fi as Lr, jo as Lt, xc as M, Oa as Mn, L as Mr, Lo as Mt, bc as N, Da as Nn, vi as Nr, Io as Nt, Oc as O, Oe as Oi, Ma as On, Ti as Or, Uo as Ot, yc as P, Ea as Pn, gi as Pr, Fo as Pt, bs as Q, ia as Qn, St as Qr, _o as Qt, oc as R, Ca as Rn, di as Rr, Ao as Rt, Bc as S, qe as Si, Ia as Sn, Ai as Sr, qo as St, jc as T, Me as Ti, W as Tn, Di as Tr, Wo as Tt, Qs as U, ga as Un, At as Ur, To as Ut, ic as V, va as Vn, ci as Vr, Do as Vt, Zs as W, ha as Wn, kt as Wr, wo as Wt, Ss as X, oa as Xn, Ct as Xr, yo as Xt, Cs as Y, aa as Yn, wt as Yr, bo as Yt, ys as Z, sa as Zn, xt as Zr, vo as Zt, Kc as _, Qe as _i, Ba as _n, Ii as _r, Qo as _t, ol as a, ht as ai, no as an, Zi as ar, hs as at, Uc as b, Ye as bi, za as bn, Mi as br, Yo as bt, tl as c, ot as ci, $a as cn, Ji as cr, us as ct, Qc as d, it as di, qa as dn, Ki as dr, ss as dt, yt as ei, ho as en, B as er, $ as et, Zc as f, rt as fi, Ka as fn, Gi as fr, os as ft, qc as g, $e as gi, Ha as gn, Li as gr, $o as gt, Jc as h, et as hi, Ua as hn, Ri as hr, es as ht, ul as i, S as ii, ro as in, Qi as ir, gs as it, Sc as j, ka as jn, yi as jr, Ro as jt, Dc as k, De as ki, ja as kn, Si as kr, Bo as kt, el as l, v as li, q as ln, z as lr, ls as lt, Yc as m, tt as mi, Wa as mn, Vi as mr, ts as mt, hl as n, _t as ni, uo as nn, ea as nr, vs as nt, il as o, pt as oi, eo as on, Xi as or, fs as ot, Xc as p, nt as pi, Ga as pn, Ui as pr, as as pt, Ks as q, la as qn, Et as qr, X as qt, ll as r, gt as ri, io as rn, $i as rr, Q as rt, nl as s, st as si, to as sn, Yi as sr, ds as st, _l as t, C as ti, mo as tn, ta as tr, _s as tt, $c as u, at as ui, Ja as un, qi as ur, cs as ut, Gc as v, Ze as vi, G as vn, Pi as vr, Zo as vt, Mc as w, Pe as wi, Pa as wn, Oi as wr, Go as wt, Vc as x, Je as xi, Va as xn, ji as xr, Jo as xt, Wc as y, Xe as yi, K as yn, Ni as yr, Xo as yt, ac as z, Sa as zn, ui as zr, ko as zt };
