import { type Nullable } from '../../../../types';
import { type Temporal } from 'temporal-polyfill';
export declare const FIRST_DAY_OF_WEEK_ISO_8601_MONDAY = 1;
export declare const getNextPeriodStart: (dateTime: Temporal.ZonedDateTime, unit: "DAY" | "HOUR" | "MINUTE" | "MONTH" | "QUARTER" | "SECOND" | "WEEK" | "YEAR", firstDayOfTheWeek?: Nullable<import("../../../../types").FirstDayOfTheWeek>) => Temporal.ZonedDateTime;
//# sourceMappingURL=getNextPeriodStart.d.ts.map