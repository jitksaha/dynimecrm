import { Lt as e } from "./types-BVPyJxl2.mjs";
import { a as t, c as n, d as r, f as i, i as a, l as o, n as s, o as c, r as l, s as u, t as d, u as f } from "./get-system-view-universal-identifier.util-ySpYrDPE.mjs";
//#region src/application/applicationCategoryType.ts
var p = [
	"Communication",
	"Productivity",
	"Product management",
	"Sales",
	"Marketing",
	"Enrichment",
	"Data",
	"Search",
	"Other"
], m = (e) => p.includes(e), h = [
	e.TEXT,
	e.ARRAY,
	e.BOOLEAN,
	e.DATE,
	e.DATE_TIME,
	e.NUMBER,
	e.NUMERIC,
	e.RAW_JSON,
	e.RICH_TEXT,
	e.SELECT,
	e.MULTI_SELECT
], g = 100, _ = "public", v = "TWENTY_API_KEY", y = "TWENTY_API_URL", b = "TWENTY_APP_ACCESS_TOKEN", x = "TWENTY_APP_APPLICATION_ACCESS_TOKEN", S = "TWENTY_FUNCTIONS_URL", C = "front-component-shared-dependencies.mjs", w = "twenty:front-component-shared-dependencies", T = "generated", E = { js: "import { createRequire as __createRequire } from 'module';\nconst require = __createRequire(import.meta.url);" }, D = ".twenty/output", O = "Standard", k = ({ applicationUniversalIdentifier: e, name: t }) => r({
	entityNamespace: "agent",
	value: t,
	applicationUniversalIdentifier: e
}), A = ({ applicationUniversalIdentifier: e, key: t }) => r({
	entityNamespace: "applicationVariable",
	value: t,
	applicationUniversalIdentifier: e
}), j = ({ applicationUniversalIdentifier: e, name: t }) => r({
	entityNamespace: "connectionProvider",
	value: t,
	applicationUniversalIdentifier: e
}), ee = ({ applicationUniversalIdentifier: e, roleUniversalIdentifier: t, fieldUniversalIdentifier: n }) => r({
	entityNamespace: "fieldPermission",
	value: `${t}:${n}`,
	applicationUniversalIdentifier: e
}), M = ({ applicationUniversalIdentifier: e, componentName: t }) => r({
	entityNamespace: "frontComponent",
	value: t,
	applicationUniversalIdentifier: e
}), N = ({ applicationUniversalIdentifier: e, objectUniversalIdentifier: t, name: n }) => r({
	entityNamespace: "index",
	value: `${t}:${n}`,
	applicationUniversalIdentifier: e
}), P = ({ applicationUniversalIdentifier: e, name: t }) => r({
	entityNamespace: "logicFunction",
	value: t,
	applicationUniversalIdentifier: e
}), F = ({ applicationUniversalIdentifier: e, name: t }) => r({
	entityNamespace: "navigationMenuItem",
	value: `FOLDER:${t}`,
	applicationUniversalIdentifier: e
}), I = ({ applicationUniversalIdentifier: e, objectUniversalIdentifier: t }) => r({
	entityNamespace: "navigationMenuItem",
	value: `OBJECT:${t}`,
	applicationUniversalIdentifier: e
}), L = ({ applicationUniversalIdentifier: e, viewUniversalIdentifier: t }) => r({
	entityNamespace: "navigationMenuItem",
	value: `VIEW:${t}`,
	applicationUniversalIdentifier: e
}), R = ({ applicationUniversalIdentifier: e, link: t }) => r({
	entityNamespace: "navigationMenuItem",
	value: `LINK:${t}`,
	applicationUniversalIdentifier: e
}), z = ({ applicationUniversalIdentifier: e, roleUniversalIdentifier: t, objectUniversalIdentifier: n }) => r({
	entityNamespace: "objectPermission",
	value: `${t}:${n}`,
	applicationUniversalIdentifier: e
}), B = ({ applicationUniversalIdentifier: e, nameSingular: t }) => r({
	entityNamespace: "objectMetadata",
	value: t,
	applicationUniversalIdentifier: e
}), V = ({ applicationUniversalIdentifier: e, key: t }) => r({
	entityNamespace: "permissionFlag",
	value: t,
	applicationUniversalIdentifier: e
}), H = ({ applicationUniversalIdentifier: e, roleUniversalIdentifier: t, permissionFlagUniversalIdentifier: n }) => r({
	entityNamespace: "rolePermissionFlag",
	value: `${t}:${n}`,
	applicationUniversalIdentifier: e
}), U = ({ applicationUniversalIdentifier: e, agentUniversalIdentifier: t }) => r({
	entityNamespace: "roleTarget",
	value: t,
	applicationUniversalIdentifier: e
}), W = ({ applicationUniversalIdentifier: e, label: t }) => r({
	entityNamespace: "role",
	value: t,
	applicationUniversalIdentifier: e
}), G = ({ applicationUniversalIdentifier: e, fieldMetadataUniversalIdentifier: t }) => r({
	entityNamespace: "searchFieldMetadata",
	value: t,
	applicationUniversalIdentifier: e
}), K = ({ applicationUniversalIdentifier: e, fieldUniversalIdentifier: t, value: n }) => r({
	entityNamespace: "selectOption",
	value: `${t}:${n}`,
	applicationUniversalIdentifier: e
}), q = ({ applicationUniversalIdentifier: e, name: t }) => r({
	entityNamespace: "skill",
	value: t,
	applicationUniversalIdentifier: e
}), J = "navigation", Y = ({ objectMetadataApplicationUniversalIdentifier: e, objectUniversalIdentifier: t }) => r({
	entityNamespace: "commandMenuItem",
	value: `${t}:${J}`,
	applicationUniversalIdentifier: e
}), X = ({ applicationUniversalIdentifier: e, viewUniversalIdentifier: t, fieldMetadataUniversalIdentifier: n }) => r({
	entityNamespace: "viewField",
	value: `${t}:${n}`,
	applicationUniversalIdentifier: e
}), Z = ({ applicationUniversalIdentifier: e, viewUniversalIdentifier: t, fieldMetadataUniversalIdentifier: n, operand: i, subFieldName: a }) => r({
	entityNamespace: "viewFilter",
	value: `${t}:${n}:${i}:${a ?? ""}`,
	applicationUniversalIdentifier: e
}), Q = ({ applicationUniversalIdentifier: e, viewUniversalIdentifier: t, fieldValue: n }) => r({
	entityNamespace: "viewGroup",
	value: `${t}:${n}`,
	applicationUniversalIdentifier: e
}), $ = ({ applicationUniversalIdentifier: e, viewUniversalIdentifier: t, fieldMetadataUniversalIdentifier: n }) => r({
	entityNamespace: "viewSort",
	value: `${t}:${n}`,
	applicationUniversalIdentifier: e
}), te = ({ applicationUniversalIdentifier: e, objectUniversalIdentifier: t, name: n }) => r({
	entityNamespace: "view",
	value: `${t}:${n}`,
	applicationUniversalIdentifier: e
}), ne = /* @__PURE__ */ function(e) {
	return e.Object = "object", e.Field = "field", e.LogicFunction = "logicFunction", e.FrontComponent = "frontComponent", e.Role = "role", e.Skill = "skill", e.Agent = "agent", e.ConnectionProvider = "connectionProvider", e.View = "view", e.ViewField = "viewField", e.NavigationMenuItem = "navigationMenuItem", e.PageLayout = "pageLayout", e.PageLayoutTab = "pageLayoutTab", e.CommandMenuItem = "commandMenuItem", e.TimelineActivityType = "timelineActivityType", e;
}({}), re = (t, n = e.TEXT) => {
	if (t == null) return "";
	switch (n) {
		case e.BOOLEAN: return String(t) === "true" ? "true" : "false";
		case e.NUMBER:
		case e.NUMERIC: return String(t);
		case e.ARRAY:
		case e.MULTI_SELECT:
			if (Array.isArray(t)) return JSON.stringify(t);
			if (typeof t == "string") {
				try {
					let e = JSON.parse(t);
					if (Array.isArray(e)) return t;
				} catch {}
				return JSON.stringify([t]);
			}
			return JSON.stringify(t);
		case e.RAW_JSON:
		case e.RICH_TEXT: return typeof t == "string" ? t : JSON.stringify(t);
		default: return typeof t == "string" ? t : String(t);
	}
}, ie = (t, n = e.TEXT) => {
	if (t === "") return n === e.ARRAY || n === e.MULTI_SELECT ? [] : "";
	switch (n) {
		case e.BOOLEAN: return t === "true";
		case e.NUMBER:
		case e.NUMERIC: {
			let e = Number(t);
			return Number.isNaN(e) ? t : e;
		}
		case e.ARRAY:
		case e.MULTI_SELECT: try {
			let e = JSON.parse(t);
			return Array.isArray(e) ? e : [];
		} catch {
			return [];
		}
		case e.RAW_JSON:
		case e.RICH_TEXT: try {
			return JSON.parse(t);
		} catch {
			return t;
		}
		default: return t;
	}
};
//#endregion
export { p as APPLICATION_CATEGORIES, g as APPLICATION_FILE_UPLOAD_BATCH_SIZE, h as APPLICATION_VARIABLE_FIELD_METADATA_TYPES, _ as ASSETS_DIR, v as DEFAULT_API_KEY_NAME, y as DEFAULT_API_URL_NAME, b as DEFAULT_APP_ACCESS_TOKEN_NAME, x as DEFAULT_APP_APPLICATION_ACCESS_TOKEN_NAME, S as DEFAULT_FUNCTIONS_URL_NAME, C as FRONT_COMPONENT_SHARED_DEPENDENCIES_BUILT_PATH, w as FRONT_COMPONENT_SHARED_DEPENDENCIES_IMPORT_SPECIFIER, T as GENERATED_DIR, E as NODE_ESM_CJS_BANNER, D as OUTPUT_DIR, d as SYSTEM_VIEW_KEYS, ne as SyncableEntity, O as TWENTY_STANDARD_APPLICATION_NAME, i as TWENTY_STANDARD_APPLICATION_UNIVERSAL_IDENTIFIER, r as computeDeterministicUuid, ie as deserializeApplicationVariableValue, k as getAgentUniversalIdentifier, A as getApplicationVariableUniversalIdentifier, j as getConnectionProviderUniversalIdentifier, ee as getFieldPermissionUniversalIdentifier, f as getFieldUniversalIdentifier, F as getFolderNavigationMenuItemUniversalIdentifier, M as getFrontComponentUniversalIdentifier, N as getIndexUniversalIdentifier, R as getLinkNavigationMenuItemUniversalIdentifier, P as getLogicFunctionUniversalIdentifier, I as getObjectNavigationMenuItemUniversalIdentifier, z as getObjectPermissionUniversalIdentifier, B as getObjectUniversalIdentifier, o as getPageLayoutUniversalIdentifier, V as getPermissionFlagUniversalIdentifier, H as getRolePermissionFlagUniversalIdentifier, U as getRoleTargetUniversalIdentifier, W as getRoleUniversalIdentifier, G as getSearchFieldUniversalIdentifier, K as getSelectOptionUniversalIdentifier, q as getSkillUniversalIdentifier, Y as getSystemNavigationCommandMenuItemUniversalIdentifier, n as getSystemPageLayoutTabUniversalIdentifier, u as getSystemPageLayoutWidgetUniversalIdentifier, c as getSystemRecordPageLayoutUniversalIdentifier, t as getSystemRelationFieldUniversalIdentifier, a as getSystemViewFieldGroupUniversalIdentifier, l as getSystemViewFieldUniversalIdentifier, s as getSystemViewUniversalIdentifier, X as getViewFieldUniversalIdentifier, Z as getViewFilterUniversalIdentifier, Q as getViewGroupUniversalIdentifier, L as getViewNavigationMenuItemUniversalIdentifier, $ as getViewSortUniversalIdentifier, te as getViewUniversalIdentifier, m as isKnownApplicationCategory, re as serializeApplicationVariableValue };
