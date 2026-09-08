import { type ExtendedUIMessagePart } from '../types/ExtendedUIMessagePart';
export declare const isCompleteWorkspaceSetupToolPart: (part: ExtendedUIMessagePart) => part is {
    type: `tool-${string}`;
} & import("ai").UIToolInvocation<import("ai").UITool>;
//# sourceMappingURL=is-complete-workspace-setup-tool-part.util.d.ts.map