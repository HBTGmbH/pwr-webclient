import DateTimeFormatOptions = Intl.DateTimeFormatOptions;
import {isNullOrUndefined} from 'util';
import {PowerLocalize} from '../localization/PowerLocalizer';
const optionsShortDisplay: DateTimeFormatOptions = {
    year: "numeric",
    month: "short"
};

const optionsTimeOnly: DateTimeFormatOptions = {
    hour: "numeric",
    minute: "numeric"
};

const optionsDayAndMonth : DateTimeFormatOptions = {
    month: "short",
    day: "2-digit"
};

const optionsOnlyYear: DateTimeFormatOptions = {
    year: "numeric"
};

const optionsFullDate: DateTimeFormatOptions = {
    year: "numeric",
    day: "2-digit",
    month: "long"
};

let language = navigator.language;
if(isNullOrUndefined(language)) language = "de";

const format: Intl.DateTimeFormat = new Intl.DateTimeFormat(language, optionsShortDisplay);
const formatTimeOnly:Intl.DateTimeFormat = new Intl.DateTimeFormat(language, optionsTimeOnly);
const formatDayAndMonth: Intl.DateTimeFormat = new Intl.DateTimeFormat(language, optionsDayAndMonth);
const formatOnlyYear: Intl.DateTimeFormat = new Intl.DateTimeFormat(language, optionsOnlyYear);
const formatFullDate: Intl.DateTimeFormat = new Intl.DateTimeFormat(language, optionsFullDate);

/**
 * Formats a date to a 'short' display.
 *
 * Example: Jan 2017, Aug 2003
 * @param date to be formatted
 * @return formatted date or PowerLocalize.get("Today") if the date is null.
 */
export function formatToShortDisplay(date: Date): string {
    if(isNullOrUndefined(date)) return PowerLocalize.get("Today");
    return format.format(date);
}

/**
 * Formats a date to a full, human readable localized date.
 *
 * Examples: January 02, 2002, March 17, 2000
 * @param date to be formatted
 * @return formatted date or "???" if the date is null
 */
export function formatFullLocalizedDate(date: Date): string {
    if(isNullOrUndefined(date)) return "???";
    return formatFullDate.format(date);
}

function isOnSameDay(a: Date, b: Date) {
    return a.getFullYear() == b.getFullYear() && a.getMonth() == b.getMonth() && a.getDate() == b.getDate();
}

export function formatToMailDisplay(date: Date) {
    if(isOnSameDay(new Date(), date)) {
        return formatTimeOnly.format(date);
    } else {
        return formatDayAndMonth.format(date);
    }
}

export function formatToYear(date: Date) {
    if(isNullOrUndefined(date)) return PowerLocalize.get("Today");
    return formatOnlyYear.format(date);
}