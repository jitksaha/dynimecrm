import { z } from 'zod';
import { type EmailDocumentNode } from './email-document-node';
export declare const emailDocumentSchema: z.ZodObject<{
    type: z.ZodLiteral<"doc">;
    attrs: z.ZodOptional<z.ZodObject<{
        schemaVersion: z.ZodOptional<z.ZodInt>;
        canvasTheme: z.ZodOptional<z.ZodNullable<z.ZodObject<{
            pageBackground: z.ZodOptional<z.ZodString>;
            pagePadding: z.ZodOptional<z.ZodString>;
            textAlign: z.ZodOptional<z.ZodEnum<{
                center: "center";
                left: "left";
                right: "right";
            }>>;
            bodyBackground: z.ZodOptional<z.ZodString>;
            textColor: z.ZodOptional<z.ZodString>;
            width: z.ZodOptional<z.ZodString>;
            padding: z.ZodOptional<z.ZodString>;
            cornerRadius: z.ZodOptional<z.ZodString>;
            borderWidth: z.ZodOptional<z.ZodString>;
            borderColor: z.ZodOptional<z.ZodString>;
        }, z.core.$loose>>>;
    }, z.core.$loose>>;
    content: z.ZodOptional<z.ZodArray<z.ZodLazy<z.ZodType<EmailDocumentNode, unknown, z.core.$ZodTypeInternals<EmailDocumentNode, unknown>>>>>;
}, z.core.$loose>;
export type EmailDocument = z.infer<typeof emailDocumentSchema>;
//# sourceMappingURL=email-document-schema.d.ts.map