import { z } from 'zod';
export declare const workflowDatabaseEventTriggerSchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    position: z.ZodNullable<z.ZodOptional<z.ZodObject<{
        x: z.ZodNumber;
        y: z.ZodNumber;
    }, z.core.$strip>>>;
    nextStepIds: z.ZodNullable<z.ZodOptional<z.ZodArray<z.ZodString>>>;
    type: z.ZodLiteral<"DATABASE_EVENT">;
    settings: z.ZodObject<{
        eventName: z.ZodString;
        input: z.ZodOptional<z.ZodObject<{}, z.core.$loose>>;
        outputSchema: z.ZodObject<{}, z.core.$loose>;
        objectType: z.ZodOptional<z.ZodString>;
        fields: z.ZodNullable<z.ZodOptional<z.ZodArray<z.ZodString>>>;
        filter: z.ZodOptional<z.ZodObject<{
            stepFilterGroups: z.ZodArray<z.ZodObject<{
                id: z.ZodString;
                logicalOperator: z.ZodEnum<typeof import("../../types").StepLogicalOperator>;
                parentStepFilterGroupId: z.ZodOptional<z.ZodString>;
                positionInStepFilterGroup: z.ZodOptional<z.ZodNumber>;
            }, z.core.$strip>>;
            stepFilters: z.ZodArray<z.ZodObject<{
                id: z.ZodString;
                type: z.ZodString;
                stepOutputKey: z.ZodString;
                operand: z.ZodUnion<[z.ZodEnum<typeof import("../../types").ViewFilterOperand>, z.ZodEnum<typeof import("../../types").ViewFilterOperandDeprecated>]>;
                value: z.ZodString;
                stepFilterGroupId: z.ZodString;
                positionInStepFilterGroup: z.ZodOptional<z.ZodNumber>;
                fieldMetadataId: z.ZodOptional<z.ZodString>;
                compositeFieldSubFieldName: z.ZodOptional<z.ZodString>;
            }, z.core.$strip>>;
        }, z.core.$strip>>;
    }, z.core.$strip>;
}, z.core.$strip>;
//# sourceMappingURL=database-event-trigger-schema.d.ts.map