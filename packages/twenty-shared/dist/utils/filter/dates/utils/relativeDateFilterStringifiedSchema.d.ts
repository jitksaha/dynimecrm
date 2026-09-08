import z from 'zod';
export declare const relativeDateFilterStringifiedSchema: z.ZodPipe<z.ZodString, z.ZodTransform<{
    direction: "NEXT" | "PAST" | "THIS";
    amount?: number | null | undefined;
    unit: "DAY" | "HOUR" | "MINUTE" | "MONTH" | "QUARTER" | "SECOND" | "WEEK" | "YEAR";
    timezone?: string | null | undefined;
    firstDayOfTheWeek?: import("../../../../types").FirstDayOfTheWeek | null | undefined;
}, string>>;
//# sourceMappingURL=relativeDateFilterStringifiedSchema.d.ts.map