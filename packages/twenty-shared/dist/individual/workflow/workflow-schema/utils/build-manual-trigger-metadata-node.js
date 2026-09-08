import { WORKFLOW_TRIGGER_METADATA_LABEL as e } from "../../constants/WorkflowTriggerMetadataLabel.js";
import { WORKFLOW_TRIGGER_METADATA_WORKSPACE_MEMBER_ID_KEY as E } from "../../constants/WorkflowTriggerMetadataWorkspaceMemberIdKey.js";
import { WORKFLOW_TRIGGER_METADATA_WORKSPACE_MEMBER_ID_LABEL as _ } from "../../constants/WorkflowTriggerMetadataWorkspaceMemberIdLabel.js";
var r = () => ({
  isLeaf: !1,
  type: "object",
  label: e,
  value: { [E]: {
    isLeaf: !0,
    type: "string",
    label: _,
    value: ""
  } }
});
export {
  r as buildManualTriggerMetadataNode
};

//# sourceMappingURL=build-manual-trigger-metadata-node.js.map