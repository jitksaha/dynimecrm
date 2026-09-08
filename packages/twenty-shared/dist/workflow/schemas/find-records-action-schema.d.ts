import { z } from 'zod';
export declare const workflowFindRecordsActionSchema: z.ZodObject<{
    id: z.ZodUUID;
    name: z.ZodString;
    valid: z.ZodBoolean;
    nextStepIds: z.ZodNullable<z.ZodOptional<z.ZodArray<z.ZodUUID>>>;
    position: z.ZodNullable<z.ZodOptional<z.ZodObject<{
        x: z.ZodNumber;
        y: z.ZodNumber;
    }, z.core.$strip>>>;
    type: z.ZodLiteral<"FIND_RECORDS">;
    settings: z.ZodObject<{
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
            limit: z.ZodOptional<z.ZodUnion<readonly [z.ZodNumber, z.ZodString]>>;
            offset: z.ZodOptional<z.ZodUnion<readonly [z.ZodNumber, z.ZodString]>>;
            filter: z.ZodOptional<z.ZodObject<{
                recordFilterGroups: z.ZodOptional<z.ZodArray<z.ZodAny>>;
                recordFilters: z.ZodOptional<z.ZodArray<z.ZodAny>>;
            }, z.core.$strip>>;
            orderBy: z.ZodOptional<z.ZodObject<{
                recordSorts: z.ZodOptional<z.ZodArray<z.ZodAny>>;
                gqlOperationOrderBy: z.ZodOptional<z.ZodArray<z.ZodRecord<z.ZodString, z.ZodAny>>>;
            }, z.core.$strip>>;
        }, z.core.$strip>;
    }, z.core.$strip>;
}, z.core.$strip>;
//# sourceMappingURL=find-records-action-schema.d.ts.map