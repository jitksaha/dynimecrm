import { WORKFLOW_LAYOUT_DEFAULT_OPTIONS as p } from "../constants/WorkflowLayoutDefaultOptions.js";
import h from "@dagrejs/dagre";
var c = ({ nodes: e, edges: s, options: a = p }) => {
  const t = new h.graphlib.Graph().setDefaultEdgeLabel(() => ({}));
  t.setGraph({
    ranksep: a.ranksep,
    nodesep: a.nodesep,
    rankdir: a.rankdir
  });
  const o = new Set(e.map((r) => r.id));
  return e.forEach((r) => t.setNode(r.id, {
    width: r.width,
    height: r.height
  })), s.forEach((r) => {
    o.has(r.source) && o.has(r.target) && t.setEdge(r.source, r.target);
  }), h.layout(t), e.map((r) => {
    const i = t.node(r.id);
    return {
      id: r.id,
      centerPosition: {
        x: i.x,
        y: i.y
      }
    };
  });
};
export {
  c as computeWorkflowLayout
};

//# sourceMappingURL=compute-workflow-layout.util.js.map