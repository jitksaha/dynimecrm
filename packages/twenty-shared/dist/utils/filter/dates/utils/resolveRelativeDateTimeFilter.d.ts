import { type Temporal } from 'temporal-polyfill';
export declare const resolveRelativeDateTimeFilter: (relativeDateFilter: {
    direction: "NEXT" | "PAST" | "THIS";
    amount?: number | null | undefined;
    unit: "DAY" | "HOUR" | "MINUTE" | "MONTH" | "QUARTER" | "SECOND" | "WEEK" | "YEAR";
    timezone?: string | null | undefined;
    firstDayOfTheWeek?: import("../../../../types").FirstDayOfTheWeek | null | undefined;
}, referenceZonedDateTime: Temporal.ZonedDateTime) => {
    direction: "NEXT" | "PAST" | "THIS";
    amount?: number | null | undefined;
    unit: "DAY" | "HOUR" | "MINUTE" | "MONTH" | "QUARTER" | "SECOND" | "WEEK" | "YEAR";
    timezone?: string | null | undefined;
    firstDayOfTheWeek?: import("../../../../types").FirstDayOfTheWeek | null | undefined;
    start: Temporal.ZonedDateTime;
    end: Temporal.ZonedDateTime;
};
//# sourceMappingURL=resolveRelativeDateTimeFilter.d.ts.map