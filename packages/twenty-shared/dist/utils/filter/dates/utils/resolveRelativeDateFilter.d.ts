import { type Temporal } from 'temporal-polyfill';
export declare const resolveRelativeDateFilter: (relativeDateFilter: {
    direction: "NEXT" | "PAST" | "THIS";
    amount?: number | null | undefined;
    unit: "DAY" | "HOUR" | "MINUTE" | "MONTH" | "QUARTER" | "SECOND" | "WEEK" | "YEAR";
    timezone?: string | null | undefined;
    firstDayOfTheWeek?: import("../../../../types").FirstDayOfTheWeek | null | undefined;
}, referenceTodayZonedDateTime: Temporal.ZonedDateTime) => {
    direction: "NEXT" | "PAST" | "THIS";
    amount?: number | null | undefined;
    unit: "DAY" | "HOUR" | "MINUTE" | "MONTH" | "QUARTER" | "SECOND" | "WEEK" | "YEAR";
    timezone?: string | null | undefined;
    firstDayOfTheWeek?: import("../../../../types").FirstDayOfTheWeek | null | undefined;
    start: string;
    end: string;
};
//# sourceMappingURL=resolveRelativeDateFilter.d.ts.map