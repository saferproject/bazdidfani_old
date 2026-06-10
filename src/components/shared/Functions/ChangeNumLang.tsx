const persianDigits = "۰۱۲۳۴۵۶۷۸۹";
const englishDigits = "0123456789";

export function ToPersianNumber(num: string) {
	return num?.replace(/[0-9]/g, (digit: any) => persianDigits[digit]);
}

export function ToEnglishNumber(num: string) {
	return num?.replace(/[۰-۹]/g, (digit: any) => englishDigits[persianDigits.indexOf(digit)]);
}
