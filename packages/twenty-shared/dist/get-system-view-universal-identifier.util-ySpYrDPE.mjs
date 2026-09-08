import { E as e } from "./types-BVPyJxl2.mjs";
import { v5 as t } from "uuid";
//#region src/application/constants/TwentyStandardApplicationUniversalIdentifier.ts
var n = "20202020-64aa-4b6f-b003-9c74b97cee20", r = ({ entityNamespace: e, value: n, applicationUniversalIdentifier: r }) => t(`${e}:${n}`, r), i = ({ applicationUniversalIdentifier: e, objectUniversalIdentifier: t, name: n }) => r({
	entityNamespace: "fieldMetadata",
	value: `${t}:${n}`,
	applicationUniversalIdentifier: e
}), a = ({ applicationUniversalIdentifier: e, objectUniversalIdentifier: t, name: n }) => r({
	entityNamespace: "pageLayout",
	value: t ? `${t}:${n}` : n,
	applicationUniversalIdentifier: e
}), o = ({ objectMetadataApplicationUniversalIdentifier: e, pageLayoutUniversalIdentifier: t, title: n }) => r({
	entityNamespace: "pageLayoutTab",
	value: `${t}:${n}`,
	applicationUniversalIdentifier: e
}), s = ({ objectMetadataApplicationUniversalIdentifier: e, pageLayoutTabUniversalIdentifier: t, title: n }) => r({
	entityNamespace: "pageLayoutWidget",
	value: `${t}:${n}`,
	applicationUniversalIdentifier: e
}), c = ({ objectMetadataApplicationUniversalIdentifier: t, objectUniversalIdentifier: n }) => a({
	applicationUniversalIdentifier: t,
	objectUniversalIdentifier: n,
	name: e.RECORD_PAGE
}), l = ({ applicationUniversalIdentifier: e, objectUniversalIdentifier: t, relationTargetObjectUniversalIdentifier: n }) => r({
	entityNamespace: "fieldMetadata",
	value: `${t}:systemRelation:${n}`,
	applicationUniversalIdentifier: e
}), u = ({ objectMetadataApplicationUniversalIdentifier: e, viewUniversalIdentifier: t, name: n }) => r({
	entityNamespace: "viewFieldGroup",
	value: `${t}:${n}`,
	applicationUniversalIdentifier: e
}), d = ({ fieldMetadataApplicationUniversalIdentifier: e, viewUniversalIdentifier: t, fieldMetadataUniversalIdentifier: n }) => r({
	entityNamespace: "viewField",
	value: `${t}:${n}`,
	applicationUniversalIdentifier: e
}), f = {
	INDEX: "INDEX",
	FIELDS_WIDGET: "FIELDS_WIDGET"
}, p = ({ objectMetadataApplicationUniversalIdentifier: e, objectUniversalIdentifier: t, viewKey: n }) => r({
	entityNamespace: "view",
	value: `${t}:${n}`,
	applicationUniversalIdentifier: e
});
//#endregion
export { l as a, o as c, r as d, n as f, u as i, a as l, p as n, c as o, d as r, s, f as t, i as u };
