import InspectionStates from "./Inspection-Status/enums/inspection-status.enum";

export default class InspectionStatus {
	static getInspectionStatusLabel(status: InspectionStates) {
		switch (status) {
			case 1:
				return "ثبت درخواست";

			case 2:
				return "پذیرش مدیر فنی";

			case 3:
				return "عدم پذیرش مدیر فنی";

			case 4:
				return "در حال بازدید";

			case 5:
				return "رفع نواقص";

			case 6:
				return "در حال ارسال به سازمان";

			case 7:
				return "دارای کد سباف";

			case 8:
				return "ثبت سازمانی خوداظهاری";

			case 9:
				return "پایان اعتبار خوداظهاری";

			case 10:
				return "در حال بررسی";

			default:
				return "بدون وضعیت";
		}
	}

	static getInspectionStatusColor(status: InspectionStates) {
		switch (status) {
			case 1:
			case 2:
				return "#171717";

			case 3:
			case 9:
				return "#dc2626";

			case 4:
			case 10:
				return "#00eb93";

			case 5:
				return "#f59e0b";

			case 6:
				return "#7474C1";

			case 7:
			case 8:
				return "#30eca5";

			default:
				return "inherit";
		}
	}
}
