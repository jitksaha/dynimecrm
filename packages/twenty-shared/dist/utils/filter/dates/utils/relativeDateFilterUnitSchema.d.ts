import z from 'zod';
export declare const relativeDateFilterUnitSchema: z.ZodEnum<{
    DAY: "DAY";
    HOUR: "HOUR";
    MINUTE: "MINUTE";
    MONTH: "MONTH";
    QUARTER: "QUARTER";
    SECOND: "SECOND";
    WEEK: "WEEK";
    YEAR: "YEAR";
}>;
export type RelativeDateFilterUnit = z.infer<typeof relativeDateFilterUnitSchema>;
//# sourceMappingURL=relativeDateFilterUnitSchema.d.ts.map