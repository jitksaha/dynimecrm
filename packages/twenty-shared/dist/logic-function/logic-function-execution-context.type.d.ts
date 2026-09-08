export type LogicFunctionExecutionContext = {
    retryCount: number;
    maxRetries: number;
    workspaceId: string;
    userWorkspaceId: string | null;
    workspaceMemberId: string | null;
};
export type LogicFunctionRetryContext = Pick<LogicFunctionExecutionContext, 'retryCount' | 'maxRetries'>;
//# sourceMappingURL=logic-function-execution-context.type.d.ts.map