import { z } from 'zod';
export declare const workflowPickRecordStrategySchema: z.ZodEnum<{
    LOAD_BALANCED: "LOAD_BALANCED";
    RANDOM: "RANDOM";
    ROUND_ROBIN: "ROUND_ROBIN";
}>;
export declare const workflowPickRecordActionSettingsSchema: z.ZodObject<{
    outputSchema: z.ZodObject<{}, z.core.$loose>;
    errorHandlingOptions: z.ZodObject<{
        retryOnFailure: z.ZodObject<{
            value: z.ZodBoolean;
        }, z.core.$strip>;
        continueOnFailure: z.ZodObject<{
            value: z.ZodBoolean;
        }, z.core.$strip>;
    }, z.core.$strip>;
    input: z.ZodObject<{
        objectName: z.ZodString;
        strategy: z.ZodEnum<{
            LOAD_BALANCED: "LOAD_BALANCED";
            RANDOM: "RANDOM";
            ROUND_ROBIN: "ROUND_ROBIN";
        }>;
        recordIds: z.ZodArray<z.ZodString>;
        loadBalance: z.ZodOptional<z.ZodObject<{
            objectNameSingular: z.ZodString;
            fieldName: z.ZodString;
        }, z.core.$strip>>;
    }, z.core.$strip>;
}, z.core.$strip>;
//# sourceMappingURL=pick-record-action-settings-schema.d.ts.map