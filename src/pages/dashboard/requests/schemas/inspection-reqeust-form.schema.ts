import { z } from "zod";

const InspectionRequestformSchema = z.object({
	// NOTE truck data
	id: z.number(),
	truck_id: z.number(),
	smart_number: z.number({ invalid_type_error: "شماره هوشمند را وارد کنید", required_error: "شماره هوشمند را وارد کنید" }),
	first_number: z.string(),
	second_number: z.string(),
	third_character: z.string(),
	fourth_number: z.string(),
	loader_type: z.string(),
	loader_type_id: z.string(),
	plate_type: z.number(),
	insurance_validity: z.string(),
	type: z.union([z.literal(1), z.literal(2)]),
	user_id: z.number(),
	company_id: z.number(),
	date_made: z.number(),
	VIN: z.string(),
	validity_technical_examination: z.string(),
	allowed_certificate: z.union([z.literal(1), z.literal(2), z.literal(3)]),
	is_new: z.boolean(),
	loader: z.object({
		id: z.string(),
		loader_code: z.number(),
		name: z.string(),
	}),

	// NOTE driver data
	driver_id: z.number().optional(),
	driver_company_id: z.number().optional(),
	driver_health_card_validity: z.string().optional(),
	driver_national_code: z
		.string({ invalid_type_error: "کد ملی الزامی است", required_error: "کد ملی را وارد کنید" })
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
		)
		.optional()
		.nullable(),
	driver_full_name: z.string().optional(),
	driver_father_name: z.string().optional(),
	driver_smart_card_validity: z.string().optional(),
	driver_phone_number: z.string().optional(),
	driver_certificate_type: z.string().optional(),
	driver_certificate_validity: z.string().optional(),
	driver_insurance_number: z.string().optional(),
	driver_status: z.string().optional(),
	driver_description: z.string().optional(),

	// NOTE technical manager data
	technical_manager_id: z.number(),
	technicalmanager: z.object({
		phone: z.string(),
		end_cooperate: z.string(),
		national_code: z.string(),
		technical_manager_id: z.number(),
	}),
	technical_manager_national_code: z.string(),

	// NOTE none sendable controls
	loadingTypeSearch: z.string(),
});

export type InspectionRequestFormType = z.infer<typeof InspectionRequestformSchema>;

export default InspectionRequestformSchema;
