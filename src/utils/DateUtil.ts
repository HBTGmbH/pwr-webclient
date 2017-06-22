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

let language = navigator.language;
if(isNullOrUndefined(language)) language = "de";

const format: Intl.DateTimeFormat = new Intl.DateTimeFormat(language, optionsShortDisplay);
const formatTimeOnly:Intl.DateTimeFormat = new Intl.DateTimeFormat(language, optionsTimeOnly);
const formatDayAndMonth: Intl.DateTimeFormat = new Intl.DateTimeFormat(language, optionsDayAndMonth);
const formatOnlyYear: Intl.DateTimeFormat = new Intl.DateTimeFormat(language, optionsOnlyYear);

export function formatToShortDisplay(date: Date) {
    if(isNullOrUndefined(date)) return PowerLocalize.get("Today");
    return format.format(date);
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
    return formatOnlyYear.format(date);
}