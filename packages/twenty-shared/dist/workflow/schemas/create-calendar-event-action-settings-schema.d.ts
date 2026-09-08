import { z } from 'zod';
export declare const workflowCreateCalendarEventActionSettingsSchema: z.ZodObject<{
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
        connectedAccountId: z.ZodString;
        title: z.ZodString;
        description: z.ZodOptional<z.ZodString>;
        location: z.ZodOptional<z.ZodString>;
        startsAt: z.ZodString;
        endsAt: z.ZodString;
        isFullDay: z.ZodBoolean;
        timeZone: z.ZodOptional<z.ZodString>;
        attendees: z.ZodDefault<z.ZodOptional<z.ZodString>>;
        sendInvitations: z.ZodBoolean;
        addConferencing: z.ZodBoolean;
    }, z.core.$strip>;
}, z.core.$strip>;
//# sourceMappingURL=create-calendar-event-action-settings-schema.d.ts.map