import { z } from "zod";

const TechnicalManagerFormSchema = z
	.object({
		type: z.union([z.literal(1), z.literal(2), z.literal(3)], { invalid_type_error: "حوزه فعالیت مدیر فنی الزامی است" }),
		national_code: z
			.string({ invalid_type_error: "کد ملی الزامی است" })
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
		phone: z
			.string({ invalid_type_error: "شماره موبایل الزامی است", required_error: "شماره موبایل الزامی است" })
			.length(11, "شماره موبایل باید 11 رقم باشد")
			.regex(/^09\d{9}$/, "شماره موبایل باید فقط شامل اعداد باشد و با 09 شروع شود"),
		capacity: z
			.number({ invalid_type_error: "حداکثر پذیرش روزانه باید عدد باشد", required_error: "حداکثر پذیرش روزانه الزامی است" })
			.min(1, "حداکثر پذیرش روزانه باید حداقل 1 باشد")
			.max(999, "حداکثر پذیرش روزانه باید حداکثر 999 باشد"),
		freighter_capacity: z
			.number({ invalid_type_error: "حداکثر پذیرش باری باید فقط عدد باشد" })
			.min(0, "حداکثر پذیرش باری کمتر از 0 نمیتواند باشد")
			.nullish(),
		passenger_capacity: z
			.number({ invalid_type_error: "حداکثر پذیرش مسافری باید فقط عدد باشد" })
			.min(0, "حداکثر پذیرش مسافری کمتر از 0 نمیتواند باشد")
			.nullish(),
		full_name: z.string({ invalid_type_error: "نام کامل الزامی است", required_error: "نام کامل الزامی است" }),
		father_name: z.string({ invalid_type_error: "نام پدر الزامی است", required_error: "نام پدر الزامی است" }),
		address: z.string({ invalid_type_error: "آدرس الزامی است", required_error: "آدرس الزامی است" }),
		email: z.string({ invalid_type_error: "ایمیل الزامی است", required_error: "ایمیل الزامی است" }),
		telephone: z.string({ invalid_type_error: "تلفن ثابت الزامی است", required_error: "تلفن ثابت الزامی است" }),
		birthdate: z.string({ invalid_type_error: "تاریخ تولد الزامی است", required_error: "تاریخ تولد الزامی است" }),
		city_code: z.number({ invalid_type_error: "شهر الزامی است", required_error: "شهر الزامی است" }),
		image: z.string({ invalid_type_error: "عکس باید فایل باشد." }).optional(),
		company_id: z.number({ invalid_type_error: "شرکت الزامی است", required_error: "شرکت الزامی است" }),
		start_cooperate: z.string({ invalid_type_error: "تاریخ شروع همکاری الزامی است", required_error: "تاریخ شروع همکاری الزامی است" }),
		end_cooperate: z.string({ invalid_type_error: "تاریخ پایان همکاری الزامی است", required_error: "تاریخ پایان همکاری الزامی است" }),
		citySearch: z.string().optional(),
	})
	.superRefine((values, ctx) => {
		if (values.type === 3) {
			if (values.freighter_capacity > values.capacity)
				ctx.addIssue({
					code: z.ZodIssueCode.too_big,
					type: "number",
					path: ["freighter_capacity"],
					message: "حداکثر پذیرش باری بیشتر از حداکثر پذیرش روزانه نمیتواند باشد",
					maximum: values.capacity,
					inclusive: true,
				});
			else if (values.passenger_capacity > values.capacity)
				ctx.addIssue({
					code: z.ZodIssueCode.too_big,
					type: "number",
					path: ["passenger_capacity"],
					message: "حداکثر پذیرش مسافری بیشتر از حداکثر پذیرش روزانه نمیتواند باشد",
					maximum: values.capacity,
					inclusive: true,
				});
		}
	});

export const TechnicalManagerInqueryFormSchema = z
	.object({
		type: z.union([z.literal(1), z.literal(2), z.literal(3)], { invalid_type_error: "حوزه فعالیت مدیر فنی الزامی است" }),
		national_code: z
			.string({ invalid_type_error: "کد ملی الزامی است" })
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
		phone: z
			.string({ invalid_type_error: "شماره موبایل الزامی است", required_error: "شماره موبایل الزامی است" })
			.length(11, "شماره موبایل باید 11 رقم باشد")
			.regex(/^09\d{9}$/, "شماره موبایل باید فقط شامل اعداد باشد و با 09 شروع شود"),
		capacity: z
			.number({ invalid_type_error: "حداکثر پذیرش روزانه باید عدد باشد", required_error: "حداکثر پذیرش روزانه الزامی است" })
			.min(1, "حداکثر پذیرش روزانه باید حداقل 1 باشد")
			.max(999, "حداکثر پذیرش روزانه باید حداکثر 999 باشد"),
		freighter_capacity: z
			.number({ invalid_type_error: "حداکثر پذیرش باری باید فقط عدد باشد" })
			.min(0, "حداکثر پذیرش باری کمتر از 0 نمیتواند باشد")
			.nullish(),
		passenger_capacity: z
			.number({ invalid_type_error: "حداکثر پذیرش مسافری باید فقط عدد باشد" })
			.min(0, "حداکثر پذیرش مسافری کمتر از 0 نمیتواند باشد")
			.nullish(),
	})
	.superRefine((values, ctx) => {
		if (values.type === 3) {
			if (values.freighter_capacity > values.capacity)
				ctx.addIssue({
					code: z.ZodIssueCode.too_big,
					type: "number",
					path: ["freighter_capacity"],
					message: "حداکثر پذیرش باری بیشتر از حداکثر پذیرش روزانه نمیتواند باشد",
					maximum: values.capacity,
					inclusive: true,
				});
			else if (values.passenger_capacity > values.capacity)
				ctx.addIssue({
					code: z.ZodIssueCode.too_big,
					type: "number",
					path: ["passenger_capacity"],
					message: "حداکثر پذیرش مسافری بیشتر از حداکثر پذیرش روزانه نمیتواند باشد",
					maximum: values.capacity,
					inclusive: true,
				});
		}
	});

export type TechnicalManagerFormType = z.infer<typeof TechnicalManagerFormSchema>;
export type TechnicalManagerInqueryFormType = z.infer<typeof TechnicalManagerInqueryFormSchema>;

export default TechnicalManagerFormSchema;
