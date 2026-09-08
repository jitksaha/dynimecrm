import z from 'zod';
export declare const relativeDateFilterSchema: z.ZodObject<{
    direction: z.ZodEnum<{
        NEXT: "NEXT";
        PAST: "PAST";
        THIS: "THIS";
    }>;
    amount: z.ZodOptional<z.ZodNullable<z.ZodPipe<z.ZodUnion<readonly [z.ZodCoercedNumber<unknown>, z.ZodLiteral<"undefined">]>, z.ZodTransform<number | undefined, number | "undefined">>>>;
    unit: z.ZodEnum<{
        DAY: "DAY";
        HOUR: "HOUR";
        MINUTE: "MINUTE";
        MONTH: "MONTH";
        QUARTER: "QUARTER";
        SECOND: "SECOND";
        WEEK: "WEEK";
        YEAR: "YEAR";
    }>;
    timezone: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    firstDayOfTheWeek: z.ZodOptional<z.ZodNullable<z.ZodEnum<{
        MONDAY: import("../../../../types").FirstDayOfTheWeek.MONDAY;
        SATURDAY: import("../../../../types").FirstDayOfTheWeek.SATURDAY;
        SUNDAY: import("../../../../types").FirstDayOfTheWeek.SUNDAY;
    }>>>;
}, z.core.$strip>;
export type RelativeDateFilter = z.infer<typeof relativeDateFilterSchema>;
//# sourceMappingURL=relativeDateFilterSchema.d.ts.map