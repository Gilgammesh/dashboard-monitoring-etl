import { setMinutes, setSeconds, setMilliseconds, format } from "date-fns";
import { toZonedTime, getTimezoneOffset, formatInTimeZone } from "date-fns-tz";
import { localeEs, timeZone } from "@/config/constants";

export const getNowWithTimeZone = (): Date => {
  const now = toZonedTime(new Date(), timeZone);
  return now;
};

export const toDateTimeZone = (date: Date): Date => {
  const dateTZ = toZonedTime(date, timeZone);
  return dateTZ;
};

export const getGmt = (): string => {
  const offset = getTimezoneOffset(timeZone, new Date());
  const hours = Math.floor(offset / (60 * 60 * 1000));
  return `GMT${hours}`;
};

export const formatDateString = (date: Date, formatString: string): string => {
  const formattedDate = formatInTimeZone(date, timeZone, formatString, {
    locale: localeEs,
  });
  return formattedDate;
};

export const formatDateNoTzString = (
  date: Date,
  formatString: string
): string => {
  const formattedDate = format(date, formatString, {
    locale: localeEs,
  });
  return formattedDate;
};

export const formatDateToUtcString = (
  date: Date,
  formatString: string
): string => {
  const formattedDate = formatInTimeZone(date, "UTC", formatString);
  return formattedDate;
};

export const formatDateNoTzToUtcString = (
  date: Date,
  formatString: string
): string => {
  const formattedDate = format(date, formatString);
  return formattedDate;
};

export const setMinutesDate = (date: Date, minutes: number): Date => {
  const updatedDate = setMinutes(
    setSeconds(setMilliseconds(date, 0), 0),
    minutes
  );
  return updatedDate;
};
