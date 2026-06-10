import { format as dateFormat } from "date-fns-jalali";

const validateDate = (str: string | Date) =>
  new Date(str).toString() !== "Invalid Date";

export const formatJalaliDate = (
  date: string | Date | null | undefined,
  format = "yyyy/MM/dd",
) => (date && validateDate(date) ? dateFormat(new Date(date), format) : "");

export const persianFormatDate = (date: string | Date | null | undefined) =>
  formatJalaliDate(date);

export const GetShamsiTimeDate = (str: string | Date | null | undefined) =>
  formatJalaliDate(str, "HH:mm yyyy/MM/dd");

export function CompareDates(date1: Date | undefined | null, date2: Date) {
  if (!date1 || date1 == null) {
    return;
  }
  const withoutTime1 = new Date(date1.getTime());

  const withoutTime2 = new Date(date2.getTime());

  withoutTime1.setUTCHours(0, 0, 0, 0);

  withoutTime2.setUTCHours(0, 0, 0, 0);

  if (withoutTime1.getTime() == withoutTime2.getTime()) {
    return "Same";
  } else if (withoutTime1.getTime() > withoutTime2.getTime()) {
    return "Greater";
  } else if (withoutTime1.getTime() < withoutTime2.getTime()) {
    return "Smaller";
  }
}

export const GetValidationDateColor = (_date: Date | null | undefined) => {
  if (_date == undefined || _date == null) {
    return "error";
  }
  const res = CompareDates(new Date(_date), new Date(Date.now()));

  if (res == "Same" || res == "Greater") {
    return "success";
  } else {
    return "warning";
  }
};

export function GetShamsiDateTime(str: string | Date | null | undefined) {
  return formatJalaliDate(str, "yyyy/MM/dd - HH:mm");
}

export function GetShamsiDate(str: string | Date | null | undefined) {
  return formatJalaliDate(str, "yyyy/MM/dd");
}

export function IsValidTimestampFormat(str: string): boolean {
  const dateRegex = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/;
  const timestampRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?Z$/;

  return dateRegex.test(str) || timestampRegex.test(str);
}

export const IsValidDate = (dateObject: Date) =>
  new Date(dateObject).toString() !== "Invalid Date";

export const convertTimeStampToDateTime = (number: number) =>
  new Date(number * 1000);
