import { t as e } from "./isDefined-Dtu5EYqP.mjs";
import { t } from "./is-record-object-schema-CwzshFdt.mjs";
import { isNonEmptyString as n, isObject as r } from "@sniptt/guards";
//#region src/logic-function/build-tool-input-json-schema.ts
var i = (e, t) => {
	let r = n(e) ? t?.(e) : void 0;
	return `Id of the ${n(r) ? r : "linked"} record`;
}, a = (n, o) => {
	if (t(n)) return {
		type: "string",
		description: i(n.objectUniversalIdentifier, o)
	};
	if (n.type === "records") return {
		type: "array",
		items: {
			type: "string",
			description: i(n.objectUniversalIdentifier, o)
		}
	};
	let { objectUniversalIdentifier: s, multiline: c, label: l, items: u, properties: d, additionalProperties: f, ...p } = n, m = { ...p };
	return e(u) && (m.items = a(u, o)), e(d) && (m.properties = Object.fromEntries(Object.entries(d).map(([e, t]) => [e, a(t, o)]))), e(f) && (m.additionalProperties = r(f) ? a(f, o) : f), m;
}, o = {
	type: "object",
	properties: {}
}, s = (e) => {
	let t = { type: "unknown" };
	switch (e.type) {
		case "string":
			t.type = "string";
			break;
		case "number":
		case "integer":
			t.type = "number";
			break;
		case "boolean":
			t.type = "boolean";
			break;
		case "array":
			t.type = "array", e.items && (t.items = s(e.items));
			break;
		case "object":
			t.type = "object", e.properties && (t.properties = Object.fromEntries(Object.entries(e.properties).map(([e, t]) => [e, s(t)])));
			break;
		case "record":
			t.type = "record";
			break;
		case "records":
			t.type = "records";
			break;
		default: t.type = "unknown";
	}
	return Array.isArray(e.enum) && (t.enum = e.enum.filter((e) => typeof e == "string")), e.multiline === !0 && (t.multiline = !0), n(e.label) && (t.label = e.label), n(e.objectUniversalIdentifier) && (t.objectUniversalIdentifier = e.objectUniversalIdentifier), t;
}, c = (e) => [s(e)], l = { inputSchema: c({
	type: "object",
	properties: {
		a: { type: "string" },
		b: { type: "number" }
	}
}) }, u = async (t) => {
	let { getFunctionInputSchema: n } = await import("./get-function-input-schema-GNk3NRLJ.mjs"), r = n(t)[0];
	return r?.type === "object" && e(r.properties) ? {
		type: "object",
		properties: r.properties
	} : o;
}, d = (t) => !e(t) || t === null ? "unknown" : typeof t == "string" ? "string" : typeof t == "number" ? "number" : typeof t == "boolean" ? "boolean" : Array.isArray(t) ? "array" : "unknown", f = (e) => e ? Object.entries(e).reduce((e, [t, n]) => (r(n) && !Array.isArray(n) ? e[t] = {
	isLeaf: !1,
	type: "object",
	label: t,
	value: f(n)
} : e[t] = {
	isLeaf: !0,
	value: n,
	type: d(n),
	label: t
}, e), {}) : {}, p = (e, t) => e ? `${e}.${t}` : t, m = (t, n, r = "") => {
	let i = [];
	for (let [a, o] of Object.entries(n)) {
		let n = p(r, a), s = t[a];
		if (!e(s)) {
			i.push(`Missing key "${n}" in declared output schema.`);
			continue;
		}
		if (o.isLeaf !== s.isLeaf) {
			i.push(`Type mismatch at "${n}": expected ${o.isLeaf ? o.type : "object"} but declared ${s.isLeaf ? s.type : "object"}.`);
			continue;
		}
		if (!o.isLeaf && !s.isLeaf) {
			i.push(...m(s.value, o.value, n));
			continue;
		}
		o.isLeaf && s.isLeaf && o.type !== "unknown" && s.type !== "unknown" && o.type !== s.type && i.push(`Type mismatch at "${n}": expected ${o.type} but declared ${s.type}.`);
	}
	return i;
}, h = [
	"string",
	"number",
	"boolean",
	"array",
	"unknown"
], g = (e) => h.includes(e), _ = (e, t) => {
	let n = t.label ?? e;
	return t.type === "record" ? {
		isLeaf: !0,
		type: "string",
		label: n,
		value: null
	} : t.type === "records" ? {
		isLeaf: !0,
		type: "array",
		label: n,
		value: null
	} : t.type === "object" ? {
		isLeaf: !1,
		type: "object",
		label: n,
		value: r(t.properties) ? v(t.properties) : {}
	} : {
		isLeaf: !0,
		type: g(t.type) ? t.type : "unknown",
		label: n,
		value: null
	};
}, v = (e) => Object.entries(e).reduce((e, [t, n]) => (e[t] = _(t, n), e), {}), y = (e) => {
	let t = e[0];
	return t?.type !== "object" || !r(t.properties) ? {} : v(t.properties);
}, b = (e) => e?.type === "records" && n(e.objectUniversalIdentifier) || e?.type === "array" && t(e?.items), x = "RetryableLogicFunctionError", S = class extends Error {
	constructor(e) {
		super(e), this.name = x;
	}
};
//#endregion
export { o as DEFAULT_TOOL_INPUT_SCHEMA, x as RETRYABLE_LOGIC_FUNCTION_ERROR_NAME, S as RetryableLogicFunctionError, l as SEED_WORKFLOW_ACTION_TRIGGER_SETTINGS, a as buildToolInputJsonSchema, u as getInputSchemaFromSourceCode, f as getOutputSchemaFromValue, m as getOutputSchemaMismatchIssues, y as inputSchemaToOutputSchema, b as isRecordArraySchema, t as isRecordObjectSchema, c as jsonSchemaToInputSchema };
