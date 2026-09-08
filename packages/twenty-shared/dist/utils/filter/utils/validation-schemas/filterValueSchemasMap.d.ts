import { type z } from 'zod';
import { ViewFilterOperand } from '../../../../types';
export declare const FILTER_VALUE_SCHEMAS_MAP: {
    readonly TEXT: {
        CONTAINS: z.ZodString;
        DOES_NOT_CONTAIN: z.ZodString;
    };
    readonly EMAILS: {
        CONTAINS: z.ZodString;
        DOES_NOT_CONTAIN: z.ZodString;
    };
    readonly FULL_NAME: {
        CONTAINS: z.ZodString;
        DOES_NOT_CONTAIN: z.ZodString;
    };
    readonly ADDRESS: {
        CONTAINS: z.ZodString;
        DOES_NOT_CONTAIN: z.ZodString;
    };
    readonly LINKS: {
        CONTAINS: z.ZodString;
        DOES_NOT_CONTAIN: z.ZodString;
    };
    readonly PHONES: {
        CONTAINS: z.ZodString;
        DOES_NOT_CONTAIN: z.ZodString;
    };
    readonly RAW_JSON: {
        CONTAINS: z.ZodString;
        DOES_NOT_CONTAIN: z.ZodString;
    };
    readonly FILES: {
        CONTAINS: z.ZodString;
        DOES_NOT_CONTAIN: z.ZodString;
    };
    readonly ARRAY: {
        CONTAINS: z.ZodString;
        DOES_NOT_CONTAIN: z.ZodString;
    };
    readonly ACTOR: {
        CONTAINS: z.ZodString;
        DOES_NOT_CONTAIN: z.ZodString;
    };
    readonly MULTI_SELECT: {
        readonly CONTAINS: z.ZodString;
        readonly DOES_NOT_CONTAIN: z.ZodString;
    };
    readonly SELECT: {
        readonly IS: z.ZodString;
        readonly IS_NOT: z.ZodString;
    };
    readonly CURRENCY: {
        IS: z.ZodPipe<z.ZodString, z.ZodTransform<number, string>>;
        IS_NOT: z.ZodPipe<z.ZodString, z.ZodTransform<number, string>>;
        GREATER_THAN_OR_EQUAL: z.ZodPipe<z.ZodString, z.ZodTransform<number, string>>;
        LESS_THAN_OR_EQUAL: z.ZodPipe<z.ZodString, z.ZodTransform<number, string>>;
    };
    readonly NUMBER: {
        IS: z.ZodPipe<z.ZodString, z.ZodTransform<number, string>>;
        IS_NOT: z.ZodPipe<z.ZodString, z.ZodTransform<number, string>>;
        GREATER_THAN_OR_EQUAL: z.ZodPipe<z.ZodString, z.ZodTransform<number, string>>;
        LESS_THAN_OR_EQUAL: z.ZodPipe<z.ZodString, z.ZodTransform<number, string>>;
    };
    readonly RATING: {
        IS: z.ZodPipe<z.ZodString, z.ZodTransform<number, string>>;
        IS_NOT: z.ZodPipe<z.ZodString, z.ZodTransform<number, string>>;
        GREATER_THAN_OR_EQUAL: z.ZodPipe<z.ZodString, z.ZodTransform<number, string>>;
        LESS_THAN_OR_EQUAL: z.ZodPipe<z.ZodString, z.ZodTransform<number, string>>;
    };
    readonly DATE: {
        readonly IS: z.ZodPipe<z.ZodString, z.ZodTransform<import("temporal-spec").Temporal.PlainDate, string>>;
        readonly IS_BEFORE: z.ZodPipe<z.ZodString, z.ZodTransform<import("temporal-spec").Temporal.PlainDate, string>>;
        readonly IS_AFTER: z.ZodPipe<z.ZodString, z.ZodTransform<import("temporal-spec").Temporal.PlainDate, string>>;
        readonly IS_RELATIVE: z.ZodPipe<z.ZodString, z.ZodTransform<{
            direction: "NEXT" | "PAST" | "THIS";
            amount?: number | null | undefined;
            unit: "DAY" | "HOUR" | "MINUTE" | "MONTH" | "QUARTER" | "SECOND" | "WEEK" | "YEAR";
            timezone?: string | null | undefined;
            firstDayOfTheWeek?: import("../../../../types").FirstDayOfTheWeek | null | undefined;
        }, string>>;
    };
    readonly DATE_TIME: {
        readonly IS: z.ZodPipe<z.ZodString, z.ZodTransform<import("temporal-spec").Temporal.Instant | import("temporal-spec").Temporal.PlainDate, string>>;
        readonly IS_BEFORE: z.ZodPipe<z.ZodString, z.ZodTransform<import("temporal-spec").Temporal.Instant, string>>;
        readonly IS_AFTER: z.ZodPipe<z.ZodString, z.ZodTransform<import("temporal-spec").Temporal.Instant, string>>;
        readonly IS_RELATIVE: z.ZodPipe<z.ZodString, z.ZodTransform<{
            direction: "NEXT" | "PAST" | "THIS";
            amount?: number | null | undefined;
            unit: "DAY" | "HOUR" | "MINUTE" | "MONTH" | "QUARTER" | "SECOND" | "WEEK" | "YEAR";
            timezone?: string | null | undefined;
            firstDayOfTheWeek?: import("../../../../types").FirstDayOfTheWeek | null | undefined;
        }, string>>;
    };
    readonly RELATION: {
        readonly IS: z.ZodUnion<[z.ZodPipe<z.ZodPipe<z.ZodString, z.ZodTransform<any, string>>, z.ZodObject<{
            isCurrentWorkspaceMemberSelected: z.ZodOptional<z.ZodBoolean>;
            isCurrentRecordSelected: z.ZodOptional<z.ZodBoolean>;
            selectedRecordIds: z.ZodArray<z.ZodString>;
        }, z.core.$strip>>, z.ZodPipe<z.ZodTransform<any[], unknown>, z.ZodArray<z.ZodString>>]>;
        readonly IS_NOT: z.ZodUnion<[z.ZodPipe<z.ZodPipe<z.ZodString, z.ZodTransform<any, string>>, z.ZodObject<{
            isCurrentWorkspaceMemberSelected: z.ZodOptional<z.ZodBoolean>;
            isCurrentRecordSelected: z.ZodOptional<z.ZodBoolean>;
            selectedRecordIds: z.ZodArray<z.ZodString>;
        }, z.core.$strip>>, z.ZodPipe<z.ZodTransform<any[], unknown>, z.ZodArray<z.ZodString>>]>;
    };
    readonly UUID: {
        readonly IS: z.ZodPipe<z.ZodTransform<any[], unknown>, z.ZodArray<z.ZodString>>;
        readonly IS_NOT: z.ZodPipe<z.ZodTransform<any[], unknown>, z.ZodArray<z.ZodString>>;
    };
    readonly BOOLEAN: {
        readonly IS: z.ZodPipe<z.ZodEnum<{
            false: "false";
            true: "true";
        }>, z.ZodTransform<boolean, "false" | "true">>;
    };
    readonly TS_VECTOR: {
        readonly VECTOR_SEARCH: z.ZodString;
    };
};
export declare const COMPOSITE_SUB_FIELD_VALUE_SCHEMAS: {
    readonly ACTOR: {
        readonly source: {
            readonly IS: z.ZodPipe<z.ZodPipe<z.ZodString, z.ZodTransform<any, string>>, z.ZodArray<z.ZodEnum<typeof import("../../../../types").FieldActorSource>>>;
            readonly IS_NOT: z.ZodPipe<z.ZodPipe<z.ZodString, z.ZodTransform<any, string>>, z.ZodArray<z.ZodEnum<typeof import("../../../../types").FieldActorSource>>>;
        };
        readonly workspaceMemberId: {
            readonly IS: z.ZodUnion<[z.ZodPipe<z.ZodPipe<z.ZodString, z.ZodTransform<any, string>>, z.ZodObject<{
                isCurrentWorkspaceMemberSelected: z.ZodOptional<z.ZodBoolean>;
                isCurrentRecordSelected: z.ZodOptional<z.ZodBoolean>;
                selectedRecordIds: z.ZodArray<z.ZodString>;
            }, z.core.$strip>>, z.ZodPipe<z.ZodTransform<any[], unknown>, z.ZodArray<z.ZodString>>]>;
            readonly IS_NOT: z.ZodUnion<[z.ZodPipe<z.ZodPipe<z.ZodString, z.ZodTransform<any, string>>, z.ZodObject<{
                isCurrentWorkspaceMemberSelected: z.ZodOptional<z.ZodBoolean>;
                isCurrentRecordSelected: z.ZodOptional<z.ZodBoolean>;
                selectedRecordIds: z.ZodArray<z.ZodString>;
            }, z.core.$strip>>, z.ZodPipe<z.ZodTransform<any[], unknown>, z.ZodArray<z.ZodString>>]>;
        };
    };
    readonly CURRENCY: {
        readonly currencyCode: {
            readonly IS: z.ZodPipe<z.ZodString, z.ZodTransform<any, string>>;
            readonly IS_NOT: z.ZodPipe<z.ZodString, z.ZodTransform<any, string>>;
        };
    };
    readonly ADDRESS: {
        readonly addressCountry: {
            readonly CONTAINS: z.ZodPipe<z.ZodString, z.ZodTransform<any, string>>;
            readonly DOES_NOT_CONTAIN: z.ZodPipe<z.ZodString, z.ZodTransform<any, string>>;
        };
    };
};
export declare const FILTER_VALUE_FORMAT_HINTS: Partial<Record<ViewFilterOperand, string>>;
//# sourceMappingURL=filterValueSchemasMap.d.ts.map