import { Temporal } from 'temporal-polyfill';
export declare const resolveRelativeDateTimeFilterStringified: (relativeDateTimeFilterStringified: string | null | undefined) => {
    direction: "NEXT" | "PAST" | "THIS";
    amount?: number | null | undefined;
    unit: "DAY" | "HOUR" | "MINUTE" | "MONTH" | "QUARTER" | "SECOND" | "WEEK" | "YEAR";
    timezone?: string | null | undefined;
    firstDayOfTheWeek?: import("../../../../types").FirstDayOfTheWeek | null | undefined;
    start: Temporal.ZonedDateTime;
    end: Temporal.ZonedDateTime;
} | null;
//# sourceMappingURL=resolveRelativeDateTimeFilterStringified.d.ts.map