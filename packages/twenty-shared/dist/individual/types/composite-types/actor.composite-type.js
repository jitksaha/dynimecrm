import { FieldMetadataType as a } from "../FieldMetadataType.js";
import { v4 as s } from "uuid";
var p = /* @__PURE__ */ (function(e) {
  return e.EMAIL = "EMAIL", e.CALENDAR = "CALENDAR", e.WORKFLOW = "WORKFLOW", e.AGENT = "AGENT", e.API = "API", e.IMPORT = "IMPORT", e.MANUAL = "MANUAL", e.SYSTEM = "SYSTEM", e.WEBHOOK = "WEBHOOK", e.APPLICATION = "APPLICATION", e;
})({}), O = {
  type: a.ACTOR,
  properties: [
    {
      name: "source",
      type: a.SELECT,
      hidden: !1,
      isRequired: !0,
      options: Object.keys(p).map((e, n) => ({
        id: s(),
        label: `${p[e].toLowerCase()}`,
        value: e,
        position: n
      }))
    },
    {
      name: "workspaceMemberId",
      type: a.UUID,
      hidden: "input",
      isRequired: !1
    },
    {
      name: "name",
      type: a.TEXT,
      hidden: "input",
      isRequired: !0
    },
    {
      name: "context",
      type: a.RAW_JSON,
      hidden: !1,
      isRequired: !1
    }
  ]
};
export {
  p as FieldActorSource,
  O as actorCompositeType
};

//# sourceMappingURL=actor.composite-type.js.map