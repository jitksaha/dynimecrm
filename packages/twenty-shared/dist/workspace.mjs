import { t as e } from "./isDefined-Dtu5EYqP.mjs";
//#region src/workspace/types/WorkspaceActivationStatus.ts
var t = /* @__PURE__ */ function(e) {
	return e.ONGOING_CREATION = "ONGOING_CREATION", e.PENDING_CREATION = "PENDING_CREATION", e.CREATED = "CREATED", e.ACTIVE = "ACTIVE", e.INACTIVE = "INACTIVE", e.SUSPENDED = "SUSPENDED", e;
}({}), n = [
	t.CREATED,
	t.ACTIVE,
	t.SUSPENDED
], r = (t) => e(t) && n.includes(t.activationStatus);
//#endregion
export { n as PROVISIONED_WORKSPACE_ACTIVATION_STATUSES, t as WorkspaceActivationStatus, r as isWorkspaceProvisioned };
