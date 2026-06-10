import { toPersianChars } from "@persian-tools/persian-tools";
import base64ToBlob from './base64ToBlob'

export const UndefinedToEmptyString = (value: any) => {
	if (value === undefined || value === null) {
		return "";
	}
	return value;
};

export function createFormData<T extends object>(data: T): FormData {
	const formData = new FormData();

	Object.entries(data).forEach(([key, value]) => {
		if (value !== null && value !== undefined) {
			if (value instanceof File) {
				formData.append(key, value);
			} else if (Array.isArray(value)) {
				value.forEach((item, itemIndex) => {
					if (typeof item === "object") {
						if (item instanceof Date) {
							formData.append(key, item.toISOString());
						} else {
							Object.entries(item).forEach(([subKey, subValue]) => {
								if (subKey === "image" && Array.isArray(subValue)) {
									for (const [index, img] of subValue.entries()) {
										console.info('img in createImage', img)
										formData.append(`${key}[${itemIndex}][${subKey}]`, img instanceof Blob ? img : base64ToBlob(img), `image-${index + 1}`);
									}
								} else formData.append(`${key}[${itemIndex}][${subKey}]`, subValue as any);
							});
						}
					} else formData.append(`${key}[${itemIndex}]`, item);
				});
			} else if (typeof value === "object") {
				if (value instanceof Date) {
					formData.append(key, value.toISOString());
				} else {
					Object.entries(value).forEach(([subKey, subValue]) => {
						formData.append(`${key}[${subKey}]`, (subValue as any) ?? "");
					});
				}
			} else {
				formData.append(key, value.toString());
			}
		} else {
			formData.append(key, value);
		}
	});

	return formData;
}

export const QueryParamsMaker = (obj: any) => {
	const obj2: any = {};
	Object.keys(obj).map((ele) => {
		if (obj[ele] !== null && obj[ele] !== undefined) {
			obj2[ele] = obj[ele];
		}
	});
	const str = `${Object.keys(obj2)
		.map((ele) => `${ele}=${obj2[ele]}`)
		.join("&")}`;
	return str ? `?${str}` : "";
};

export const ConvertDatetoDateTime = (value: Date | null) => {
	if (!value) return "";
	const date = new Date(value.toString());
	const year = date.getFullYear();
	const month = String(date.getMonth() + 1).padStart(2, "0"); // ماه از 0 شروع می‌شود
	const day = String(date.getDate()).padStart(2, "0");
	const hours = String(date.getHours()).padStart(2, "0");
	const minutes = String(date.getMinutes()).padStart(2, "0");
	const seconds = String(date.getSeconds()).padStart(2, "0");
	return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

export const convertCharToPersian = (char: string) => toPersianChars(char);

export const converCertTypeToNumber = (word?: string) => {
	switch (convertCharToPersian(word)) {
		case "پایه یک":
			return 1;
		case "پایه دو":
			return 2;
		case "پایه دو تبصره 99":
			return 3;
		default:
			return null;
	}
};

export const FalsyValueToDash = (value: any) => {
	if (!value) return "-";
	else return value;
};

export const ConvertFileToUrl = (file?: File | null) => (file ? URL.createObjectURL(file) : "");

export const checkIfMobile = function () {
	let check = false;
	(function (a) {
		if (
			/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(
				a
			) ||
			/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(
				a.substr(0, 4)
			)
		)
			check = true;
		// لاین پایین رو چون با سرپ به دست اووردم، دقیق از پاک کردنش اطمینان ندارم برای همین بجای پاک کردن اروراش تایپ اسکریپتو ساکت میکنم. اگر نیاز دوسنتین بررسی کنین.
		// @ts-ignore
	})(navigator?.userAgent || navigator?.vendor || window?.opera);
	return check;
};

export default function makePriceHumanReadable(price: number | string) {
	price = String(price);
	let cntr = price.length - 1;
	while (cntr > 2) {
		price = price.slice(0, cntr - 2) + "," + price.slice(cntr - 2);
		cntr -= 3;
	}
	return price;
}
