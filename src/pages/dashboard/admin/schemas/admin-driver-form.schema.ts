import { z } from "zod";

const AdminDriverFormSchema = z.object({
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
	birthdate: z.string({ invalid_type_error: "تاریخ تولد الزامی است", required_error: "تاریخ تولد الزامی است" }),
	// birthdate: z
	// 	.date({ invalid_type_error: "تاریخ تولد الزامی است", required_error: "تاریخ تولد الزامی است" })
	certificate_type: z.union(
		[z.literal(1, { description: "پایه یک" }), z.literal(2, { description: "پایه دو" }), z.literal(3, { description: "پایه دو تبصره 99" })],
		{ invalid_type_error: "نوع گواهی نامه الزامی است", required_error: "نوع گواهی نامه الزامی است" }
	),
	certificate_number: z
		.string({ invalid_type_error: "شماره گواهی نامه الزامی است", required_error: "شماره گواهی نامه الزامی است" })
		.length(10, "شماره گواهی نامه باید 10 رقم باشد")
		.regex(/^\d+$/, "شماره گواهی نامه باید فقط شامل اعداد باشد"),
	certificate_validity: z.string({
		invalid_type_error: "تاریخ اعتبار کارت گواهی نامه الزامی است",
		required_error: "تاریخ اعتبار کارت گواهی نامه الزامی است",
	}),
	insurance_number: z
		.string({ invalid_type_error: "شماره بیمه الزامی است", required_error: "شماره بیمه الزامی است" })
		.length(8, "شماره بیمه باید 8 رقم باشد")
		.regex(/^\d+$/, "شماره بیمه باید فقط شامل اعداد باشد"),
	health_card_validity: z.string({
		invalid_type_error: "تاریخ اعتبار کارت سلامت الزامی است",
		required_error: "تاریخ اعتبار کارت سلامت الزامی است",
	}),
	phone_number: z
		.string({ invalid_type_error: "شماره موبایل الزامی است", required_error: "شماره موبایل الزامی است" })
		.length(11, "شماره موبایل باید 11 رقم باشد")
		.regex(/^09\d{9}$/, "شماره موبایل باید فقط شامل اعداد باشد و با 09 شروع شود"),
	smart_card_validity: z
		.string({
			invalid_type_error: "تاریخ اعتبار کارت هوشمند الزامی است",
			required_error: "تاریخ اعتبار کارت هوشمند الزامی است",
		})
		.optional(),
});

export type AdminDriverFormType = z.infer<typeof AdminDriverFormSchema>;

export default AdminDriverFormSchema;
