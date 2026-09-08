import { z } from 'zod';
export declare const baseWorkflowActionSchema: z.ZodObject<{
    id: z.ZodUUID;
    name: z.ZodString;
    valid: z.ZodBoolean;
    nextStepIds: z.ZodNullable<z.ZodOptional<z.ZodArray<z.ZodUUID>>>;
    position: z.ZodNullable<z.ZodOptional<z.ZodObject<{
        x: z.ZodNumber;
        y: z.ZodNumber;
    }, z.core.$strip>>>;
}, z.core.$strip>;
//# sourceMappingURL=base-workflow-action-schema.d.ts.map