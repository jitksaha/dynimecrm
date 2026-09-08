import { Temporal } from 'temporal-polyfill';
import { z } from 'zod';
import { FieldActorSource } from '../../../../types';
export declare const nonEmptyStringFilterValueSchema: z.ZodString;
export declare const numericFilterValueSchema: z.ZodPipe<z.ZodString, z.ZodTransform<number, string>>;
export declare const plainDateFilterValueSchema: z.ZodPipe<z.ZodString, z.ZodTransform<Temporal.PlainDate, string>>;
export declare const instantFilterValueSchema: z.ZodPipe<z.ZodString, z.ZodTransform<Temporal.Instant, string>>;
export declare const plainDateOrInstantFilterValueSchema: z.ZodPipe<z.ZodString, z.ZodTransform<Temporal.Instant | Temporal.PlainDate, string>>;
export declare const booleanFilterValueSchema: z.ZodPipe<z.ZodEnum<{
    false: "false";
    true: "true";
}>, z.ZodTransform<boolean, "false" | "true">>;
export declare const actorSourceFilterValueSchema: z.ZodPipe<z.ZodPipe<z.ZodString, z.ZodTransform<any, string>>, z.ZodArray<z.ZodEnum<typeof FieldActorSource>>>;
//# sourceMappingURL=filterValueScalarSchemas.d.ts.map