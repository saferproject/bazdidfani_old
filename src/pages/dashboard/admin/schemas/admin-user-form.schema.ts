import { z } from "zod";

const AdminUserFormSchema = z.object({
	phone: z
		.string({ invalid_type_error: "شماره موبایل الزامی است", required_error: "شماره موبایل الزامی است" })
		.length(11, "شماره موبایل باید 11 رقم باشد")
		.regex(/^09\d{9}$/, "شماره موبایل باید فقط شامل اعداد باشد و با 09 شروع شود"),
	national_code: z
		.string({ invalid_type_error: "کد ملی الزامی است", required_error: "کد ملی الزامی است" })
		.length(10, "کد ملی باید 10 رقم باشد")
		.regex(/^\d+$/, "کد ملی باید فقط شامل اعداد باشد")
		.refine(
			(value) => {
				const digits = value.split("").map(Number);
				const sum = digits.slice(0, 9).reduce((acc, digit, i) => acc + digit * (10 - i), 0);
				const remainder = sum % 11;
				const lastDigit = digits[9];

				if ((remainder < 2 && lastDigit === remainder) || lastDigit === 11 - remainder) return true;

				return false;
			},
			{ message: "کد ملی معتبر نیست" }
		),
	full_name: z
		.string({ invalid_type_error: "نام و نام خانوادگی الزامی است", required_error: "نام و نام خانوادگی الزامی است" })
		.min(3, "نام و نام خانوادگی حداقل 3 حرف میتواند باشد")
		.max(64, "نام و نام خانوادگی حداکثر 64 حرف میتواند باشد")
		.regex(/[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF\s]/g, "نام و نام خانوادگی باید به حروف فارسی باشد"),
	father_name: z
		.string({ invalid_type_error: "نام پدر الزامی است", required_error: "نام پدر الزامی است" })
		.min(3, "نام پدر حداقل 3 حرف میتواند باشد")
		.max(32, "نام پدر حداکثر 32 حرف میتواند باشد")
		.regex(/[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF\s]/g, "نام پدر باید به حروف فارسی باشد"),
	telephone: z
		.string({ invalid_type_error: "شماره ثابت الزامی است" })
		.length(11, "شماره ثابت باید 11 رقم باشد")
		.regex(/^0\d{10}$/, "شماره ثابت باید فقط شامل اعداد باشد و با 0 شروع شود")
		.optional()
		.nullable(),
	email: z.string({ invalid_type_error: "ایمیل به درستی وارد نشده است" }).optional().nullable(),
	birthdate: z.string({ invalid_type_error: "تاریخ تولد الزامی است", required_error: "تاریخ تولد الزامی است" }),
	city_code: z.number({ invalid_type_error: "شهر الزامی است", required_error: "شهر الزامی است" }),
	address: z
		.string({ invalid_type_error: "آدرس الزامی است", required_error: "آدرس الزامی است" })
		.max(255, "طول آدرس بیشتر از 255 کاراکتر نمیتواند باشد")
		.regex(/[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF0-9،\s]/g),
	citySearch: z.string().optional().nullable(),
});

export type AdminUserFormType = z.infer<typeof AdminUserFormSchema>;

export default AdminUserFormSchema;
