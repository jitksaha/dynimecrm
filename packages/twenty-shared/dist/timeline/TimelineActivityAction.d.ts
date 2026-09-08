export declare const TIMELINE_ACTIVITY_ACTIONS: readonly ["created", "updated", "deleted", "restored", "linked", "unlinked"];
export type TimelineActivityAction = (typeof TIMELINE_ACTIVITY_ACTIONS)[number];
export declare const isTimelineActivityAction: (value: string | null | undefined) => value is "created" | "deleted" | "linked" | "restored" | "unlinked" | "updated";
//# sourceMappingURL=TimelineActivityAction.d.ts.map