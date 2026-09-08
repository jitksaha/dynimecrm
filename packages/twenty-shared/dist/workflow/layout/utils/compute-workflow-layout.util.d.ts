export type WorkflowLayoutNode = {
    id: string;
    width: number;
    height: number;
};
export type WorkflowLayoutEdge = {
    source: string;
    target: string;
};
export type WorkflowLayoutPosition = {
    id: string;
    centerPosition: {
        x: number;
        y: number;
    };
};
export type WorkflowLayoutOptions = {
    ranksep: number;
    nodesep: number;
    rankdir: string;
};
export declare const computeWorkflowLayout: ({ nodes, edges, options, }: {
    nodes: WorkflowLayoutNode[];
    edges: WorkflowLayoutEdge[];
    options?: WorkflowLayoutOptions | undefined;
}) => WorkflowLayoutPosition[];
//# sourceMappingURL=compute-workflow-layout.util.d.ts.map