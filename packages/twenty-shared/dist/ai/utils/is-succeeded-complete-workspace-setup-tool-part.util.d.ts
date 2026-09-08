import { type ExtendedUIMessagePart } from '../types/ExtendedUIMessagePart';
export declare const isSucceededCompleteWorkspaceSetupToolPart: (part: ExtendedUIMessagePart) => part is {
    type: `tool-${string}`;
} & import("ai").UIToolInvocation<import("ai").UITool>;
//# sourceMappingURL=is-succeeded-complete-workspace-setup-tool-part.util.d.ts.map