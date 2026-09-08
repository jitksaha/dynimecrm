import z from 'zod';
export declare const relativeDateFilterDirectionSchema: z.ZodEnum<{
    NEXT: "NEXT";
    PAST: "PAST";
    THIS: "THIS";
}>;
export type RelativeDateFilterDirection = z.infer<typeof relativeDateFilterDirectionSchema>;
//# sourceMappingURL=relativeDateFilterDirectionSchema.d.ts.map