export declare const getWorkflowRunContext: (stepInfos: Record<string, {
    result?: any;
    error?: any;
    status: import("../../workflow/types/WorkflowRunStateStepInfos").StepStatus;
    history?: {
        result?: any;
        error?: any;
        status: import("../../workflow/types/WorkflowRunStateStepInfos").StepStatus;
    }[] | undefined;
}>) => Record<string, unknown>;
//# sourceMappingURL=getWorkflowRunContext.d.ts.map