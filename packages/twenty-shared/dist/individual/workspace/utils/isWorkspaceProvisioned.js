import { isDefined as r } from "../../utils/validation/isDefined.js";
import { PROVISIONED_WORKSPACE_ACTIVATION_STATUSES as o } from "../constants/ProvisionedWorkspaceActivationStatuses.js";
var S = (i) => r(i) && o.includes(i.activationStatus);
export {
  S as isWorkspaceProvisioned
};

//# sourceMappingURL=isWorkspaceProvisioned.js.map